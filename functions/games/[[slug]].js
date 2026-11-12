import { proxyDemoRequest } from "../_lib/demo-proxy.mjs";
import { serveDemosIndexIfNoSlug } from "../_lib/demos-index-fallback.mjs";

export async function onRequest(context) {
  const indexResponse = await serveDemosIndexIfNoSlug(context);
  if (indexResponse) return indexResponse;

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
