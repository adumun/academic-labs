/**
 * The demos index is a static asset. Use ASSETS directly to avoid invoking
 * another Function for the same request.
 */
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  url.pathname = "/games/demos/";
  return env.ASSETS.fetch(url);
}
