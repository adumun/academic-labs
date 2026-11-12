const DEMO_PREFIX = "/games/";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ALLOWED_METHODS = new Set(["GET", "HEAD"]);
const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "if-none-match",
  "if-modified-since",
  "range",
];

function textResponse(message, status, extraHeaders = {}) {
  return new Response(message, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function safePathSegment(segment) {
  return typeof segment === "string" &&
    segment.length > 0 &&
    segment !== "." &&
    segment !== ".." &&
    !/[\\/\u0000-\u001f]/.test(segment) &&
    !/%(?:2f|5c|2e)/i.test(segment);
}

function getPagesOrigin(value) {
  let origin;
  try {
    origin = new URL(value);
  } catch {
    return null;
  }

  if (
    origin.protocol !== "https:" ||
    !origin.hostname.endsWith(".pages.dev") ||
    origin.username ||
    origin.password ||
    origin.port ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  ) {
    return null;
  }

  return origin;
}

function getDemoBasePath(value) {
  if (value === undefined || value === null || value === "") return "/";
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.includes("\\") ||
    value.includes("?") ||
    value.includes("#") ||
    value.includes("//") ||
    /%(?:2f|5c|2e)/i.test(value)
  ) {
    return null;
  }

  const normalized = value.endsWith("/") ? value : `${value}/`;
  const segments = normalized.split("/").slice(1, -1);
  return segments.every(safePathSegment) ? normalized : null;
}

function getRelativeDemoPath(targetPath, basePath) {
  if (basePath === "/") return targetPath || "/";

  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const baseWithoutSlash = normalizedBase.slice(0, -1);
  if (targetPath === normalizedBase || targetPath === baseWithoutSlash) return "/";
  if (!targetPath.startsWith(normalizedBase)) return null;

  const relativePath = targetPath.slice(normalizedBase.length);
  return `/${relativePath}`;
}

function findDemo(catalog, slug) {
  if (!catalog || !Array.isArray(catalog.applications)) return null;

  return catalog.applications.find((app) =>
    app &&
    app.slug === slug &&
    app.categoryId === "games" &&
    app.kind === "demo"
  ) || null;
}

function rewriteLocation(location, upstreamUrl, requestUrl, slug, basePath) {
  if (!location) return location;

  let target;
  try {
    // Resolve relative Location values against the actual upstream request URL,
    // as required by HTTP redirect semantics (not against the origin root).
    target = new URL(location, upstreamUrl);
  } catch {
    return location;
  }

  if (target.origin !== upstreamUrl.origin) return location;

  const relativePath = getRelativeDemoPath(target.pathname, basePath);
  if (relativePath === null) return null;

  const rewritten = new URL(requestUrl);
  rewritten.pathname = `${DEMO_PREFIX}${slug}${relativePath}`;
  rewritten.search = target.search;
  rewritten.hash = target.hash;
  return rewritten.toString();
}

/**
 * Proxies a published game demo through the stable ADÜMÜN Labs route.
 * Only registered slugs and HTTPS *.pages.dev origins are accepted.
 */
export async function proxyDemoRequest({
  request,
  params,
  catalog,
  fetchImpl = globalThis.fetch,
}) {
  const requestUrl = new URL(request.url);
  const routeSegments = Array.isArray(params?.slug)
    ? [...params.slug]
    : typeof params?.slug === "string"
      ? params.slug.split("/")
      : [];

  // Pages may include a trailing empty catch-all segment for slash-terminated URLs.
  while (routeSegments.at(-1) === "") routeSegments.pop();

  const [slug, ...assetSegments] = routeSegments;

  if (!slug || !SLUG_PATTERN.test(slug)) {
    return textResponse("Demo not found.", 404);
  }

  const demo = findDemo(catalog, slug);
  if (!demo) return textResponse("Demo not found.", 404);

  if (demo.status !== "published") {
    return textResponse("This demo is not published yet.", 503, {
      "Retry-After": "300",
    });
  }

  const origin = getPagesOrigin(demo.origin);
  if (!origin) {
    return textResponse("Demo origin is not configured safely.", 503);
  }

  const basePath = getDemoBasePath(demo.upstreamPath);
  if (!basePath) {
    return textResponse("Demo upstream path is not configured safely.", 503);
  }

  if (!assetSegments.every(safePathSegment)) {
    return textResponse("Invalid demo asset path.", 400);
  }

  if (!requestUrl.pathname.endsWith("/") && assetSegments.length === 0) {
    const canonical = new URL(request.url);
    canonical.pathname = `${DEMO_PREFIX}${slug}/`;
    return Response.redirect(canonical.toString(), 308);
  }

  if (!ALLOWED_METHODS.has(request.method)) {
    return textResponse("Only GET and HEAD are supported for static demos.", 405, {
      Allow: "GET, HEAD",
    });
  }

  const upstreamUrl = new URL(origin.origin);
  const upstreamRoot = basePath === "/" ? "" : basePath.slice(0, -1);
  const assetPath = assetSegments.map(encodeURIComponent).join("/");
  // Pages catch-all params omit the trailing empty segment after normalization.
  // Preserve the public request's slash so directory URLs resolve to index.html
  // instead of bouncing between the slash and non-slash canonical URLs.
  upstreamUrl.pathname = assetSegments.length
    ? `${upstreamRoot}/${assetPath}${requestUrl.pathname.endsWith("/") ? "/" : ""}`
    : basePath;
  const traceRedirects = requestUrl.searchParams.get("__trace_proxy") === "chain";
  const forwardedSearch = new URLSearchParams(requestUrl.searchParams);
  if (traceRedirects) forwardedSearch.delete("__trace_proxy");
  upstreamUrl.search = forwardedSearch.toString() ? `?${forwardedSearch.toString()}` : "";

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  if (traceRedirects) {
    const hops = [];
    const seenUpstreamUrls = new Set();
    let currentPublicUrl = new URL(request.url);
    let currentUpstreamUrl = new URL(upstreamUrl);
    let terminalStatus = null;
    let error = null;
    let cycleDetected = false;

    for (let hop = 1; hop <= 8; hop++) {
      const currentKey = currentUpstreamUrl.toString();
      if (seenUpstreamUrls.has(currentKey)) {
        cycleDetected = true;
        hops.push({ hop, cycleDetected: true, upstreamUrl: currentKey });
        break;
      }
      seenUpstreamUrls.add(currentKey);

      let response;
      try {
        response = await fetchImpl(currentUpstreamUrl.toString(), {
          method: "GET",
          headers,
          redirect: "manual",
        });
      } catch {
        error = "Upstream fetch failed";
        hops.push({
          hop,
          publicUrl: currentPublicUrl.toString(),
          upstreamUrl: currentKey,
          error,
        });
        break;
      }

      const location = response.headers.get("location");
      const entry = {
        hop,
        publicUrl: currentPublicUrl.toString(),
        upstreamUrl: currentKey,
        status: response.status,
        statusText: response.statusText,
        location,
        headers: {
          server: response.headers.get("server"),
          cfRay: response.headers.get("cf-ray"),
          cacheControl: response.headers.get("cache-control"),
          contentType: response.headers.get("content-type"),
        },
      };

      if (!location) {
        entry.terminal = true;
        terminalStatus = response.status;
        hops.push(entry);
        break;
      }

      let target;
      try {
        target = new URL(location, currentUpstreamUrl);
      } catch {
        entry.invalidLocation = true;
        hops.push(entry);
        break;
      }

      entry.resolvedLocation = target.toString();
      if (target.origin !== origin.origin) {
        entry.externalRedirect = true;
        hops.push(entry);
        break;
      }

      const rewrittenLocation = rewriteLocation(
        location,
        currentUpstreamUrl,
        currentPublicUrl.toString(),
        slug,
        basePath,
      );
      if (rewrittenLocation === null) {
        entry.invalidRedirectScope = true;
        hops.push(entry);
        break;
      }
      entry.rewrittenLocation = rewrittenLocation;
      hops.push(entry);

      currentPublicUrl = new URL(rewrittenLocation);
      currentUpstreamUrl = target;

      if (hop === 8) entry.maxHopsReached = true;
    }

    return new Response(JSON.stringify({
      requestUrl: request.url,
      paramsSlug: params?.slug ?? null,
      routeSegments,
      slug,
      assetSegments,
      initialUpstreamUrl: upstreamUrl.toString(),
      terminalStatus,
      cycleDetected,
      error,
      hops,
    }, null, 2), {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  const redirectStatuses = new Set([301, 302, 303, 307, 308]);
  const seenRedirectUrls = new Set();
  let currentUpstreamUrl = new URL(upstreamUrl);
  let upstreamResponse;
  let redirectHops = 0;

  while (true) {
    const currentUrl = currentUpstreamUrl.toString();
    if (seenRedirectUrls.has(currentUrl)) {
      return textResponse("Demo origin redirect loop detected.", 502, {
        "Retry-After": "60",
      });
    }
    seenRedirectUrls.add(currentUrl);

    try {
      upstreamResponse = await fetchImpl(currentUrl, {
        method: request.method,
        headers,
        redirect: "manual",
      });
    } catch {
      return textResponse("Demo origin is temporarily unavailable.", 502, {
        "Retry-After": "60",
      });
    }

    const location = upstreamResponse.headers.get("location");
    if (!location || !redirectStatuses.has(upstreamResponse.status)) break;

    let target;
    try {
      target = new URL(location, currentUpstreamUrl);
    } catch {
      // Preserve malformed upstream redirects as received; do not guess a target.
      break;
    }

    // Only follow redirects within the registered Pages origin. External redirects
    // remain visible to the client and are never fetched by this proxy.
    if (target.username || target.password) {
      try {
        await upstreamResponse.body?.cancel();
      } catch {
        // Ignore body cancellation failures for an unsafe redirect target.
      }
      return textResponse("Demo origin returned an unsafe redirect target.", 502);
    }

    if (target.origin !== origin.origin) break;

    if (getRelativeDemoPath(target.pathname, basePath) === null) {
      try {
        await upstreamResponse.body?.cancel();
      } catch {
        // Ignore body cancellation failures while rejecting an out-of-scope redirect.
      }
      return textResponse("Demo origin redirect leaves the configured demo path.", 502);
    }

    if (redirectHops >= 8) {
      try {
        await upstreamResponse.body?.cancel();
      } catch {
        // Ignore body cancellation failures while stopping an excessive chain.
      }
      return textResponse("Demo origin exceeded the redirect limit.", 502, {
        "Retry-After": "60",
      });
    }

    try {
      await upstreamResponse.body?.cancel();
    } catch {
      // Redirect bodies are not forwarded; continue with the target URL.
    }

    currentUpstreamUrl = target;
    redirectHops++;
  }

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete("set-cookie");
  responseHeaders.delete("set-cookie2");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  responseHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

  const location = responseHeaders.get("location");
  if (location) {
    const rewrittenLocation = rewriteLocation(
      location,
      currentUpstreamUrl,
      request.url,
      slug,
      basePath,
    );
    if (rewrittenLocation === null) {
      return textResponse("Demo origin redirect leaves the configured demo path.", 502);
    }
    responseHeaders.set(
      "Location",
      rewrittenLocation,
    );
  }

  return new Response(request.method === "HEAD" ? null : upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}
