/**
 * Defensively serves the static demos catalog when the optional multipath
 * route is invoked without a demo slug.
 */
export async function serveDemosIndexIfNoSlug(context) {
  const routeSegments = Array.isArray(context.params?.slug)
    ? context.params.slug
    : typeof context.params?.slug === "string"
      ? context.params.slug.split("/")
      : [];
  const hasDemoSlug = routeSegments.some(
    (segment) => typeof segment === "string" && segment.length > 0,
  );

  if (hasDemoSlug) return null;

  const requestUrl = new URL(context.request.url);
  if (requestUrl.pathname === "/games/demos") {
    return Response.redirect(new URL("/games/demos/", requestUrl), 308);
  }

  requestUrl.pathname = "/games/demos/";
  return context.env.ASSETS.fetch(new Request(requestUrl, context.request));
}
