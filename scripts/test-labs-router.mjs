import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { proxyDemoRequest } from "../functions/_lib/demo-proxy.mjs";
import { serveDemosIndexIfNoSlug } from "../functions/_lib/demos-index-fallback.mjs";
import { onRequest as redirectLegacyGamesRoute } from "../functions/games/demos/[[slug]].js";
import { onRequest as redirectLegacyGamersRoute } from "../functions/gamers/[[slug]].js";

const routes = JSON.parse(
  readFileSync(new URL("../_routes.json", import.meta.url), "utf8"),
);

test("legacy demo routes are covered without overlapping Pages Function rules", () => {
  assert.ok(routes.include.includes("/games/*"));
  assert.equal(routes.include.includes("/games/demos/*"), false);
  assert.ok(routes.exclude.includes("/games"));
  assert.ok(routes.exclude.includes("/games/"));
  assert.ok(routes.exclude.includes("/games/demos"));
  assert.ok(routes.exclude.includes("/games/demos/"));
  assert.equal(
    existsSync(new URL("../functions/games/index.js", import.meta.url)),
    false,
  );
});

test("empty catch-all route serves the static demos catalog", async () => {
  let observed;
  const response = await serveDemosIndexIfNoSlug({
    request: makeRequest("/games/"),
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
  assert.equal(observed.url, "https://labs.adumun.cl/games/");
  assert.equal(await response.text(), "<h1>Videojuegos</h1>");
});

test("bare demos path redirects to trailing slash", async () => {
  const response = await serveDemosIndexIfNoSlug({
    request: makeRequest("/games"),
    params: {},
    env: { ASSETS: { fetch: async () => { throw new Error("must not fetch"); } } },
  });

  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://labs.adumun.cl/games/");
});

test("demo routes bypass the empty-slug fallback", async () => {
  const response = await serveDemosIndexIfNoSlug({
    request: makeRequest("/games/starborne-voyager/"),
    params: { slug: ["starborne-voyager"] },
    env: { ASSETS: { fetch: async () => { throw new Error("must not fetch"); } } },
  });

  assert.equal(response, null);
});

test("legacy game routes redirect to the games namespace", async () => {
  const response = redirectLegacyGamesRoute({
    request: makeRequest("/games/demos/light-thief/?v=2"),
  });

  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://labs.adumun.cl/games/light-thief/?v=2");
});

test("accidental gamers routes redirect to the games namespace", async () => {
  const response = redirectLegacyGamersRoute({
    request: makeRequest("/gamers/light-thief/?v=2"),
  });

  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://labs.adumun.cl/games/light-thief/?v=2");
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
      slug: "web-game-prototypes",
      categoryId: "games",
      kind: "demo",
      status: "published",
      origin: "https://labs-web-game-prototypes.pages.dev",
      visible: false,
    },
    {
      slug: "light-thief",
      categoryId: "games",
      kind: "demo",
      status: "published",
      origin: "https://labs-web-game-prototypes.pages.dev",
      upstreamPath: "/prototypes/light-thief/",
    },
    {
      slug: "neon-tetris",
      categoryId: "games",
      kind: "demo",
      status: "published",
      origin: "https://labs-web-game-prototypes.pages.dev",
      upstreamPath: "/prototypes/neon-tetris/",
    },
    {
      slug: "super-chess",
      categoryId: "games",
      kind: "demo",
      status: "published",
      origin: "https://labs-web-game-prototypes.pages.dev",
      upstreamPath: "/prototypes/super-chess/",
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
    request: makeRequest("/games/unknown/"),
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
    request: makeRequest("/games/neon-pursuit/"),
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
    request: makeRequest("/games/starborne-voyager/"),
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
    request: makeRequest("/games/starborne-voyager/assets/game.js?v=2"),
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

test("individual prototype demos proxy their public root to the configured upstream directory", async () => {
  let observed;
  const response = await proxyDemoRequest({
    request: makeRequest("/games/light-thief/"),
    params: { slug: ["light-thief", ""] },
    catalog: publishedCatalog,
    fetchImpl: async (url, options) => {
      observed = { url: String(url), options };
      return new Response("<h1>Light Thief</h1>", {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    },
  });

  assert.equal(response.status, 200);
  assert.equal(observed.url, "https://labs-web-game-prototypes.pages.dev/prototypes/light-thief/");
  assert.equal(observed.options.method, "GET");
  assert.equal(await response.text(), "<h1>Light Thief</h1>");
});

test("individual prototype assets stay inside their configured upstream directory", async () => {
  let observed;
  const response = await proxyDemoRequest({
    request: makeRequest("/games/neon-tetris/assets/game.css?v=2"),
    params: { slug: ["neon-tetris", "assets", "game.css"] },
    catalog: publishedCatalog,
    fetchImpl: async (url) => {
      observed = String(url);
      return new Response("body {}", { status: 200 });
    },
  });

  assert.equal(response.status, 200);
  assert.equal(
    observed,
    "https://labs-web-game-prototypes.pages.dev/prototypes/neon-tetris/assets/game.css?v=2",
  );
});

test("individual prototype redirects are rewritten relative to the public demo root", async () => {
  let calls = 0;
  const response = await proxyDemoRequest({
    request: makeRequest("/games/super-chess/index.html"),
    params: { slug: ["super-chess", "index.html"] },
    catalog: publishedCatalog,
    fetchImpl: async () => {
      calls++;
      if (calls === 1) {
        return new Response(null, {
          status: 308,
          headers: { Location: "/prototypes/super-chess/" },
        });
      }
      return new Response("<h1>Ajedrez Real</h1>", { status: 200 });
    },
  });

  assert.equal(response.status, 200);
  assert.equal(calls, 2);
  assert.equal(await response.text(), "<h1>Ajedrez Real</h1>");
});

test("bare demo paths redirect to their canonical trailing-slash URL", async () => {
  const response = await proxyDemoRequest({
    request: makeRequest("/games/starborne-voyager"),
    params: { slug: ["starborne-voyager"] },
    catalog: publishedCatalog,
    fetchImpl: async () => { throw new Error("must not fetch"); },
  });
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://labs.adumun.cl/games/starborne-voyager/");
});

test("path traversal and encoded separators are rejected", async () => {
  for (const segment of ["..", "%2e%2e", "%2fetc", "a\\b"]) {
    const response = await proxyDemoRequest({
      request: makeRequest("/games/starborne-voyager/"),
      params: { slug: ["starborne-voyager", segment] },
      catalog: publishedCatalog,
      fetchImpl: async () => { throw new Error("must not fetch"); },
    });
    assert.equal(response.status, 400);
  }
});

test("non-GET methods are rejected for static demos", async () => {
  const response = await proxyDemoRequest({
    request: makeRequest("/games/starborne-voyager/", "POST"),
    params: { slug: ["starborne-voyager"] },
    catalog: publishedCatalog,
    fetchImpl: async () => { throw new Error("must not fetch"); },
  });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
});

test("same-origin upstream redirects are followed internally instead of reaching the browser", async () => {
  const observed = [];
  const response = await proxyDemoRequest({
    request: makeRequest("/games/starborne-voyager/"),
    params: { slug: ["starborne-voyager"] },
    catalog: publishedCatalog,
    fetchImpl: async (url, options) => {
      observed.push({ url: String(url), method: options.method });
      if (observed.length === 1) {
        return new Response(null, {
          status: 302,
          headers: { Location: "https://labs-starborne-voyager.pages.dev/login/" },
        });
      }
      return new Response("<h1>Login</h1>", { status: 200 });
    },
  });

  assert.deepEqual(observed, [
    { url: "https://labs-starborne-voyager.pages.dev/", method: "GET" },
    { url: "https://labs-starborne-voyager.pages.dev/login/", method: "GET" },
  ]);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  assert.equal(await response.text(), "<h1>Login</h1>");
});

test("directory canonical redirects are followed internally and return final HTML", async () => {
  const observed = [];
  const response = await proxyDemoRequest({
    request: makeRequest("/games/web-game-prototypes/prototypes/light-thief/index.html"),
    params: { slug: ["web-game-prototypes", "prototypes", "light-thief", "index.html"] },
    catalog: publishedCatalog,
    fetchImpl: async (url) => {
      observed.push(String(url));
      if (observed.length === 1) {
        return new Response(null, {
          status: 308,
          headers: { Location: "/prototypes/light-thief/" },
        });
      }
      return new Response("<h1>Light Thief</h1>", {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    },
  });

  assert.deepEqual(observed, [
    "https://labs-web-game-prototypes.pages.dev/prototypes/light-thief/index.html",
    "https://labs-web-game-prototypes.pages.dev/prototypes/light-thief/",
  ]);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  assert.equal(await response.text(), "<h1>Light Thief</h1>");
});

test("relative same-origin redirects are resolved and followed internally", async () => {
  const observed = [];
  const response = await proxyDemoRequest({
    request: makeRequest("/games/web-game-prototypes/prototypes/neon-tetris/index.html"),
    params: { slug: ["web-game-prototypes", "prototypes", "neon-tetris", "index.html"] },
    catalog: publishedCatalog,
    fetchImpl: async (url) => {
      observed.push(String(url));
      if (observed.length === 1) {
        return new Response(null, {
          status: 302,
          headers: { Location: "./" },
        });
      }
      return new Response("<h1>Neon Tetris</h1>", { status: 200 });
    },
  });

  assert.deepEqual(observed, [
    "https://labs-web-game-prototypes.pages.dev/prototypes/neon-tetris/index.html",
    "https://labs-web-game-prototypes.pages.dev/prototypes/neon-tetris/",
  ]);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  assert.equal(await response.text(), "<h1>Neon Tetris</h1>");
});

test("external redirects are returned unchanged and are never fetched by the proxy", async () => {
  let calls = 0;
  const response = await proxyDemoRequest({
    request: makeRequest("/games/starborne-voyager/"),
    params: { slug: ["starborne-voyager"] },
    catalog: publishedCatalog,
    fetchImpl: async () => {
      calls++;
      return new Response(null, {
        status: 302,
        headers: { Location: "https://accounts.example.org/login/" },
      });
    },
  });

  assert.equal(calls, 1);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get("location"), "https://accounts.example.org/login/");
});

test("credential-bearing redirect targets are rejected", async () => {
  const response = await proxyDemoRequest({
    request: makeRequest("/games/starborne-voyager/"),
    params: { slug: ["starborne-voyager"] },
    catalog: publishedCatalog,
    fetchImpl: async () => new Response(null, {
      status: 302,
      headers: {
        Location: "https://user:secret@labs-starborne-voyager.pages.dev/private/",
      },
    }),
  });

  assert.equal(response.status, 502);
  assert.match(await response.text(), /unsafe redirect target/i);
});

test("same-origin redirect cycles are stopped with a gateway error", async () => {
  let calls = 0;
  const response = await proxyDemoRequest({
    request: makeRequest("/games/web-game-prototypes/prototypes/light-thief/index.html"),
    params: { slug: ["web-game-prototypes", "prototypes", "light-thief", "index.html"] },
    catalog: publishedCatalog,
    fetchImpl: async () => {
      calls++;
      return new Response(null, {
        status: 308,
        headers: {
          Location: calls === 1
            ? "/prototypes/light-thief/"
            : "/prototypes/light-thief/index.html",
        },
      });
    },
  });

  assert.equal(calls, 2);
  assert.equal(response.status, 502);
  assert.match(await response.text(), /redirect loop detected/i);
});

test("temporary redirect trace follows real upstream hops without forwarding its query flag", async () => {
  const observed = [];
  const response = await proxyDemoRequest({
    request: makeRequest(
      "/games/web-game-prototypes/prototypes/light-thief/index.html?__trace_proxy=chain",
    ),
    params: {
      slug: ["web-game-prototypes", "prototypes", "light-thief", "index.html"],
    },
    catalog: publishedCatalog,
    fetchImpl: async (url, options) => {
      observed.push({ url: String(url), method: options.method });
      if (observed.length === 1) {
        return new Response(null, {
          status: 307,
          headers: { Location: "/prototypes/light-thief/" },
        });
      }
      return new Response("<h1>Light Thief</h1>", { status: 200 });
    },
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8");
  assert.deepEqual(observed, [
    {
      url: "https://labs-web-game-prototypes.pages.dev/prototypes/light-thief/index.html",
      method: "GET",
    },
    {
      url: "https://labs-web-game-prototypes.pages.dev/prototypes/light-thief/",
      method: "GET",
    },
  ]);

  const trace = await response.json();
  assert.equal(trace.hops.length, 2);
  assert.equal(trace.hops[0].status, 307);
  assert.equal(
    trace.hops[0].rewrittenLocation,
    "https://labs.adumun.cl/games/web-game-prototypes/prototypes/light-thief/",
  );
  assert.equal(trace.hops[1].status, 200);
  assert.equal(trace.terminalStatus, 200);
  assert.equal(trace.cycleDetected, false);
});

test("temporary redirect trace detects upstream canonicalization cycles", async () => {
  let calls = 0;
  const response = await proxyDemoRequest({
    request: makeRequest(
      "/games/web-game-prototypes/prototypes/light-thief/index.html?__trace_proxy=chain",
    ),
    params: {
      slug: ["web-game-prototypes", "prototypes", "light-thief", "index.html"],
    },
    catalog: publishedCatalog,
    fetchImpl: async () => {
      calls++;
      return new Response(null, {
        status: calls % 2 === 1 ? 307 : 308,
        headers: {
          Location: calls % 2 === 1
            ? "/prototypes/light-thief/"
            : "/prototypes/light-thief/index.html",
        },
      });
    },
  });

  const trace = await response.json();
  assert.equal(response.status, 200);
  assert.equal(trace.cycleDetected, true);
  assert.equal(calls, 2);
  assert.equal(trace.hops.at(-1).cycleDetected, true);
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
    request: makeRequest("/games/starborne-voyager/"),
    params: { slug: ["starborne-voyager"] },
    catalog,
    fetchImpl: async () => { throw new Error("must not fetch"); },
  });
  assert.equal(response.status, 503);
});
