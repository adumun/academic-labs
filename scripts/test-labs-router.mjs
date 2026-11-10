import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { proxyDemoRequest } from "../functions/_lib/demo-proxy.mjs";
import { serveDemosIndexIfNoSlug } from "../functions/_lib/demos-index-fallback.mjs";

const routes = JSON.parse(
  readFileSync(new URL("../_routes.json", import.meta.url), "utf8"),
);

test("demos catalog index bypasses Functions and is served as a static asset", () => {
  assert.ok(routes.include.includes("/games/demos/*"));
  assert.ok(routes.exclude.includes("/games/demos"));
  assert.ok(routes.exclude.includes("/games/demos/"));
  assert.equal(
    existsSync(new URL("../functions/games/demos/index.js", import.meta.url)),
    false,
  );
});

test("empty catch-all route serves the static demos catalog", async () => {
  let observed;
  const response = await serveDemosIndexIfNoSlug({
    request: makeRequest("/games/demos/"),
    params: { slug: [""] },
    env: {
      ASSETS: {
        fetch: async (request) => {
          observed = request;
          return new Response("<h1>Videojuegos</h1>", {
            status: 200,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        },
      },
    },
  });

  assert.equal(response.status, 200);
  assert.equal(observed.url, "https://labs.adumun.cl/games/demos/");
  assert.equal(await response.text(), "<h1>Videojuegos</h1>");
});

test("bare demos path redirects to trailing slash", async () => {
  const response = await serveDemosIndexIfNoSlug({
    request: makeRequest("/games/demos"),
    params: {},
    env: { ASSETS: { fetch: async () => { throw new Error("must not fetch"); } } },
  });

  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://labs.adumun.cl/games/demos/");
});

test("demo routes bypass the empty-slug fallback", async () => {
  const response = await serveDemosIndexIfNoSlug({
    request: makeRequest("/games/demos/starborne-voyager/"),
    params: { slug: ["starborne-voyager"] },
    env: { ASSETS: { fetch: async () => { throw new Error("must not fetch"); } } },
  });

  assert.equal(response, null);
});

const publishedCatalog = {
  applications: [
    {
      slug: "starborne-voyager",
      categoryId: "games",
      kind: "demo",
      status: "published",
      origin: "https://labs-starborne-voyager.pages.dev",
    },
    {
      slug: "neon-pursuit",
      categoryId: "games",
      kind: "demo",
      status: "pending",
      origin: "https://labs-neon-pursuit.pages.dev",
    },
  ],
};

function makeRequest(path, method = "GET") {
  return new Request("https://labs.adumun.cl" + path, {
    method,
    headers: {
      accept: "text/html,*/*",
      cookie: "session=must-not-forward",
      authorization: "Bearer must-not-forward",
    },
  });
}

test("unknown demo slugs return 404 without calling upstream", async () => {
  let called = false;
  const response = await proxyDemoRequest({
    request: makeRequest("/games/demos/unknown/"),
    params: { slug: ["unknown"] },
    catalog: publishedCatalog,
    fetchImpl: async () => { called = true; },
  });
  assert.equal(response.status, 404);
  assert.equal(called, false);
});

test("pending demos return 503 without exposing their origin", async () => {
  let called = false;
  const response = await proxyDemoRequest({
    request: makeRequest("/games/demos/neon-pursuit/"),
    params: { slug: ["neon-pursuit"] },
    catalog: publishedCatalog,
    fetchImpl: async () => { called = true; },
  });
  assert.equal(response.status, 503);
  assert.equal(called, false);
  assert.doesNotMatch(await response.text(), /pages\.dev/);
});

test("trailing empty catch-all segments are ignored", async () => {
  let called = false;
  const response = await proxyDemoRequest({
    request: makeRequest("/games/demos/starborne-voyager/"),
    params: { slug: ["starborne-voyager", ""] },
    catalog: publishedCatalog,
    fetchImpl: async (url) => {
      called = true;
      assert.equal(String(url), "https://labs-starborne-voyager.pages.dev/");
      return new Response("ok", { status: 200 });
    },
  });
  assert.equal(response.status, 200);
  assert.equal(called, true);
});

test("published demos proxy root, path and query to their registered Pages origin", async () => {
  let observed;
  const response = await proxyDemoRequest({
    request: makeRequest("/games/demos/starborne-voyager/assets/game.js?v=2"),
    params: { slug: ["starborne-voyager", "assets", "game.js"] },
    catalog: publishedCatalog,
    fetchImpl: async (url, options) => {
      observed = { url: String(url), options };
      return new Response("console.log('ok')", {
        status: 200,
        headers: { "Content-Type": "application/javascript" },
      });
    },
  });

  assert.equal(response.status, 200);
  assert.equal(observed.url, "https://labs-starborne-voyager.pages.dev/assets/game.js?v=2");
  assert.equal(observed.options.method, "GET");
  assert.equal(observed.options.headers.get("cookie"), null);
  assert.equal(observed.options.headers.get("authorization"), null);
  assert.equal(await response.text(), "console.log('ok')");
});

test("bare demo paths redirect to their canonical trailing-slash URL", async () => {
  const response = await proxyDemoRequest({
    request: makeRequest("/games/demos/starborne-voyager"),
    params: { slug: ["starborne-voyager"] },
    catalog: publishedCatalog,
    fetchImpl: async () => { throw new Error("must not fetch"); },
  });
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://labs.adumun.cl/games/demos/starborne-voyager/");
});

test("path traversal and encoded separators are rejected", async () => {
  for (const segment of ["..", "%2e%2e", "%2fetc", "a\\b"]) {
    const response = await proxyDemoRequest({
      request: makeRequest("/games/demos/starborne-voyager/"),
      params: { slug: ["starborne-voyager", segment] },
      catalog: publishedCatalog,
      fetchImpl: async () => { throw new Error("must not fetch"); },
    });
    assert.equal(response.status, 400);
  }
});

test("non-GET methods are rejected for static demos", async () => {
  const response = await proxyDemoRequest({
    request: makeRequest("/games/demos/starborne-voyager/", "POST"),
    params: { slug: ["starborne-voyager"] },
    catalog: publishedCatalog,
    fetchImpl: async () => { throw new Error("must not fetch"); },
  });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
});

test("upstream redirects back through the stable public path", async () => {
  const response = await proxyDemoRequest({
    request: makeRequest("/games/demos/starborne-voyager/"),
    params: { slug: ["starborne-voyager"] },
    catalog: publishedCatalog,
    fetchImpl: async () => new Response(null, {
      status: 302,
      headers: { Location: "https://labs-starborne-voyager.pages.dev/login/" },
    }),
  });
  assert.equal(response.headers.get("location"), "https://labs.adumun.cl/games/demos/starborne-voyager/login/");
});

test("unsafe origins are rejected", async () => {
  const catalog = {
    applications: [{
      slug: "starborne-voyager",
      categoryId: "games",
      kind: "demo",
      status: "published",
      origin: "https://example.com",
    }],
  };
  const response = await proxyDemoRequest({
    request: makeRequest("/games/demos/starborne-voyager/"),
    params: { slug: ["starborne-voyager"] },
    catalog,
    fetchImpl: async () => { throw new Error("must not fetch"); },
  });
  assert.equal(response.status, 503);
});
