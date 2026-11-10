/**
 * Host-aware entry point.
 *
 * - labs.adumun.cl serves the ADÜMÜN Labs portal.
 * - academic-labs.adumun.cl keeps its existing Academic Labs landing page.
 * - Pages preview and pages.dev hosts keep serving the original landing page.
 */
export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  if (url.hostname === "labs.adumun.cl" && url.pathname === "/") {
    return env.ASSETS.fetch(new Request(new URL("/labs/", url), request));
  }

  return env.ASSETS.fetch(request);
}
