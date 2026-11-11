const DEMO_PREFIX = "/games/demos/";
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

function findDemo(catalog, slug) {
  if (!catalog || !Array.isArray(catalog.applications)) return null;

  return catalog.applications.find((app) =>
    app &&
    app.slug === slug &&
    app.categoryId === "games" &&
    app.kind === "demo"
  ) || null;
}

function rewriteLocation(location, upstreamUrl, requestUrl, slug) {
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

  const rewritten = new URL(requestUrl);
  rewritten.pathname = `${DEMO_PREFIX}${slug}${target.pathname === "/" ? "/" : target.pathname}`;
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
  const upstreamPath = assetSegments.length
    ? `/${assetSegments.map(encodeURIComponent).join("/")}`
    : "/";
  // Pages catch-all params omit the trailing empty segment after normalization.
  // Preserve the public request's slash so directory URLs resolve to index.html
  // instead of bouncing between the slash and non-slash canonical URLs.
  upstreamUrl.pathname = assetSegments.length && requestUrl.pathname.endsWith("/")
    ? `${upstreamPath}/`
    : upstreamPath;
  const traceRedirects = requestUrl.searchParams.get("__trace_proxy") === "1";
  const forwardedSearch = new URLSearchParams(requestUrl.searchParams);
  if (traceRedirects) forwardedSearch.delete("__trace_proxy");
  upstreamUrl.search = forwardedSearch.toString() ? `?${forwardedSearch.toString()}` : "";

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  let upstreamResponse;
  try {
    upstreamResponse = await fetchImpl(upstreamUrl.toString(), {
      method: traceRedirects ? "GET" : request.method,
      headers,
      redirect: "manual",
    });
  } catch {
    if (traceRedirects) {
      return new Response(JSON.stringify({
        requestUrl: request.url,
        paramsSlug: params?.slug ?? null,
        routeSegments,
        slug,
        assetSegments,
        upstreamUrl: upstreamUrl.toString(),
        error: "Upstream fetch failed",
      }, null, 2), {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json; charset=utf-8",
          "X-Robots-Tag": "noindex",
        },
      });
    }

    return textResponse("Demo origin is temporarily unavailable.", 502, {
      "Retry-After": "60",
    });
  }

  if (traceRedirects) {
    const location = upstreamResponse.headers.get("location");
    let resolvedLocation = null;
    let rewrittenLocation = null;
    let sameOrigin = null;

    if (location) {
      try {
        const target = new URL(location, upstreamUrl);
        resolvedLocation = target.toString();
        sameOrigin = target.origin === upstreamUrl.origin;
        if (sameOrigin) {
          rewrittenLocation = rewriteLocation(location, upstreamUrl, request.url, slug);
        }
      } catch {
        // Preserve invalid upstream Location values as trace data only.
      }
    }

    return new Response(JSON.stringify({
      requestUrl: request.url,
      paramsSlug: params?.slug ?? null,
      routeSegments,
      slug,
      assetSegments,
      upstreamUrl: upstreamUrl.toString(),
      upstream: {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        location,
        resolvedLocation,
        sameOrigin,
        rewrittenLocation,
        headers: {
          server: upstreamResponse.headers.get("server"),
          cfRay: upstreamResponse.headers.get("cf-ray"),
          cacheControl: upstreamResponse.headers.get("cache-control"),
          contentType: upstreamResponse.headers.get("content-type"),
        },
      },
    }, null, 2), {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete("set-cookie");
  responseHeaders.delete("set-cookie2");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  responseHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

  const location = responseHeaders.get("location");
  if (location) {
    responseHeaders.set(
      "Location",
      rewriteLocation(location, upstreamUrl, request.url, slug),
    );
  }

  return new Response(request.method === "HEAD" ? null : upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}
