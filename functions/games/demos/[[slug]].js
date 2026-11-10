import { proxyDemoRequest } from "../../_lib/demo-proxy.mjs";

export async function onRequest(context) {
  const requestUrl = new URL(context.request.url);
  const routeSegments = Array.isArray(context.params?.slug)
    ? context.params.slug
    : typeof context.params?.slug === "string"
      ? context.params.slug.split("/")
      : [];
  const hasDemoSlug = routeSegments.some(
    (segment) => typeof segment === "string" && segment.length > 0,
  );

  // Defensive fallback: the optional catch-all can receive the catalog root
  // with no slug. Serve the static index instead of treating it as a demo.
  if (!hasDemoSlug) {
    if (requestUrl.pathname === "/games/demos") {
      return Response.redirect(new URL("/games/demos/", requestUrl), 308);
    }
    requestUrl.pathname = "/games/demos/";
    return context.env.ASSETS.fetch(new Request(requestUrl, context.request));
  }

  const registryUrl = new URL("/labs-catalog.json", context.request.url);
  const registryResponse = await context.env.ASSETS.fetch(registryUrl);

  if (!registryResponse.ok) {
    return new Response("ADÜMÜN Labs registry is unavailable.", {
      status: 500,
      headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  let catalog;
  try {
    catalog = await registryResponse.json();
  } catch {
    return new Response("ADÜMÜN Labs registry is invalid.", {
      status: 500,
      headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return proxyDemoRequest({
    request: context.request,
    params: context.params,
    catalog,
  });
}
