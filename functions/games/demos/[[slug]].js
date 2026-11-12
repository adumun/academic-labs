const LEGACY_PREFIX = "/games/demos/";
const CANONICAL_PREFIX = "/games/";

export function onRequest(context) {
  const target = new URL(context.request.url);
  const suffix = target.pathname.startsWith(LEGACY_PREFIX)
    ? target.pathname.slice(LEGACY_PREFIX.length)
    : "";
  target.pathname = `${CANONICAL_PREFIX}${suffix}`;
  return Response.redirect(target.toString(), 308);
}
