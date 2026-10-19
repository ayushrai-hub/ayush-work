/**
 * Tests the agent-facing API contract: JSON errors, rate limits, OpenAPI, MCP discovery, agent instructions, and the CLI.
 *
 * Errors: every client error returns { error: { code, message, hint, docs } };
 * unknown /api paths get a JSON 404 from both the Vercel middleware and the
 * Netlify edge function, whose route list must match src/lib/agent/apiRoutes.ts.
 * Rate limits: draft-11 RateLimit headers, 429 with Retry-After, window reset,
 * and the same limit on /api/mcp. OpenAPI: every operation has one typed
 * response schema per status and a 429. MCP discovery: the SEP-2127 Server
 * Card, its media type, caching and ETag 304, and its listing in the AI Catalog
 * and RFC 9727 API catalog. Agent instructions: llms.txt, /developers Markdown,
 * and AGENTS.md (read from disk) state when to use the site. CLI: argument
 * parsing, URL building, and exit codes 0, 1, and 64 against the in-process API.
 *
 * Connects to:
 * - src/lib/agent/{apiCatalog,apiRoutes,http,markdown,markdownMiddleware,mcpCard,mcpHttp,openapi,rateLimit,surfaces}.ts
 * - netlify/edge-functions/markdown-negotiation.js
 * - packages/cli/bin/ayushrai.mjs
 * - AGENTS.md at the repository root
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { SUPPORTED_PROTOCOL_VERSIONS } from "@modelcontextprotocol/sdk/types.js";
import { beforeEach, describe, expect, it } from "vitest";
import netlifyEdge, {
  API_ROUTES as EDGE_API_ROUTES,
  isKnownApiPath as edgeIsKnownApiPath,
  wantsMarkdown as edgeWantsMarkdown,
} from "../../netlify/edge-functions/markdown-negotiation.js";
import { buildRequest, parseArgs, run } from "../../packages/cli/bin/ayushrai.mjs";
import { buildApiCatalog } from "../lib/agent/apiCatalog";
import { API_ROUTES, isKnownApiPath } from "../lib/agent/apiRoutes";
import { agentApiResponse, corsHeaders, dispatchAgentApi, safeDispatch } from "../lib/agent/http";
import { renderLlmsTxt, renderPageMarkdown } from "../lib/agent/markdown";
import { markdownMiddleware } from "../lib/agent/markdownMiddleware";
import { buildAgentModeDocument, wantsAgentMode } from "../lib/agent/agentMode";
import { renderAuthMarkdown } from "../lib/agent/authDocs";
import {
  buildAiCatalog,
  buildArdManifest,
  buildMcpCatalogEntry,
  buildServerCard,
  MCP_ENTRY_DISPLAY_NAME,
  MCP_ENTRY_IDENTIFIER,
  MCP_PROTOCOL_VERSIONS,
  MCP_SERVER_INFO,
  MCP_SERVER_INSTRUCTIONS,
  SERVER_CARD_SCHEMA,
} from "../lib/agent/mcpCard";
import askHandler from "../../api/ask";
import { askEventStream, buildAskResponse, extractAskQuery, wantsAskStream } from "../lib/agent/nlwebAsk";
import { renderSchemaFeed, renderSchemaMap } from "../lib/agent/schemaFeed";
import { createPortfolioMcpServer } from "../lib/agent/mcpServer";
import { handleMcpRequest } from "../lib/agent/mcpHttp";
import { buildOpenApiDocument } from "../lib/agent/openapi";
import { clientKeyFrom, RATE_LIMIT_QUOTA, resetRateLimits, takeRateLimit } from "../lib/agent/rateLimit";
import { agentFiles, wantsMarkdown } from "../lib/agent/surfaces";

const ORIGIN = "https://www.ayushrai.site";

/** Sends a GET through agentApiResponse, which applies rate limiting per `clientKey`. */
function apiCall(pathname: string, clientKey = "203.0.113.7", search = "") {
  return agentApiResponse({
    pathname,
    method: "GET",
    params: new URLSearchParams(search),
    clientKey,
  });
}

// The rate-limit store is module state shared by every test in this file.
beforeEach(() => resetRateLimits());

/** Error envelope shape for API, Vercel middleware, and Netlify edge misses. */
describe("JSON errors", () => {
  it("returns code, message, hint, and docs for every client error", () => {
    const cases: Array<[string, string, number, string]> = [
      ["/api/v1/search", "q=" + "x".repeat(201), 400, "invalid_query"],
      ["/api/v1/projects/Bad_Slug", "", 400, "invalid_slug"],
      ["/api/v1/projects", "limit=99", 400, "invalid_filter"],
      ["/api/v1/projects", "category=toString", 400, "invalid_filter"],
      ["/api/v1/projects", "type=constructor", 400, "invalid_filter"],
      ["/api/v1/compare", "slugs=one", 400, "invalid_compare"],
      ["/api/v1/projects", "cursor=nope", 400, "invalid_cursor"],
      ["/api/v1/projects/no-such-project", "", 404, "not_found"],
      ["/api/v2/projects", "", 404, "route_not_found"],
    ];
    for (const [path, search, status, code] of cases) {
      const response = apiCall(path, `client-${code}`, search);
      expect(response.status, path).toBe(status);
      expect(response.headers["Content-Type"]).toContain("application/json");
      const body = JSON.parse(response.body ?? "{}");
      expect(body.error.code).toBe(code);
      expect(body.error.message.length).toBeGreaterThan(5);
      expect(body.error.hint.length).toBeGreaterThan(20);
      expect(body.error.docs).toBe(`${ORIGIN}/developers/`);
    }
    const post = dispatchAgentApi("/api/v1/search", "POST", new URLSearchParams());
    expect(post.status).toBe(405);
    expect((post.body as { error: { code: string } }).error.code).toBe("method_not_allowed");
  });

  it("answers unknown /api paths with JSON 404 on Vercel and leaves known routes alone", async () => {
    const miss = markdownMiddleware(new Request(`${ORIGIN}/api/nope`, { headers: { accept: "text/html" } }));
    expect(miss).toBeInstanceOf(Response);
    if (!miss) return;
    expect(miss.status).toBe(404);
    expect(miss.headers.get("content-type")).toContain("application/json");
    expect((await miss.json()).error.code).toBe("route_not_found");

    for (const path of ["/api/search", "/api/v1/projects/overlay-text-box", "/api/mcp", "/api/mcp/server-card", "/api/send-email"]) {
      expect(markdownMiddleware(new Request(`${ORIGIN}${path}`, { method: "POST" })), path).toBeUndefined();
    }
  });

  it("keeps the Netlify edge copy of the API route list identical and answers misses with JSON", async () => {
    expect([...EDGE_API_ROUTES]).toEqual([...API_ROUTES]);
    for (const path of ["/api/search/", "/api/v1/projects/expert-o", "/api/v9", "/api/projects/x", "/api/mcp/x"]) {
      expect(edgeIsKnownApiPath(path), path).toBe(isKnownApiPath(path));
    }
    const context = { next: async () => new Response("passed through") };
    const miss = await netlifyEdge(new Request(`${ORIGIN}/api/nope`), context);
    expect(miss.status).toBe(404);
    const body = await miss.json();
    expect(body.error.code).toBe("route_not_found");
    expect(body.error.hint).toBeTruthy();
    const known = await netlifyEdge(new Request(`${ORIGIN}/api/v1/search?q=x`), context);
    expect(await known.text()).toBe("passed through");
  });

  it("negotiates Markdown by quality value, identically in surfaces.ts and the Netlify edge copy", () => {
    const cases: Array<[string | undefined, boolean]> = [
      ["text/markdown", true],
      ["Text/Markdown; charset=utf-8", true],
      ["text/markdown, text/plain;q=0.5", true],
      ["text/markdown, text/html;q=0.9", true],
      ["text/markdown;q=0.9, text/html;q=0.1", true],
      ["text/markdown;q=0", false],
      ["text/markdown;q=0.000", false],
      ["text/markdown;q=0.5, text/html", false],
      ["text/markdown, text/html", false],
      ["text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", false],
      ["*/*", false],
      ["text/*", false],
      ["text/markdownish", false],
      ["", false],
      [undefined, false],
    ];
    for (const [accept, expected] of cases) {
      expect(wantsMarkdown(accept), String(accept)).toBe(expected);
      expect(edgeWantsMarkdown(accept), `edge ${accept}`).toBe(expected);
    }
    // Known agent bots get Markdown whatever they send, including an explicit text/html.
    const browserAccept = "text/html,application/xhtml+xml,*/*;q=0.8";
    for (const ua of ["GPTBot/1.0", "ora-agent/1.0", "ClaudeBot/1.0", "Mozilla/5.0 (compatible; PerplexityBot/1.0)"]) {
      for (const accept of [undefined, "*/*", "text/html", browserAccept]) {
        expect(wantsMarkdown(accept, ua), `${accept} ${ua}`).toBe(true);
        expect(edgeWantsMarkdown(accept, ua), `edge ${accept} ${ua}`).toBe(true);
      }
    }
    // Browsers and search crawlers keep the Accept-only rule.
    for (const ua of ["Mozilla/5.0", "Mozilla/5.0 (compatible; Googlebot/2.1)"]) {
      expect(wantsMarkdown(browserAccept, ua), ua).toBe(false);
      expect(edgeWantsMarkdown(browserAccept, ua), `edge ${ua}`).toBe(false);
      expect(wantsMarkdown(undefined, ua), ua).toBe(false);
    }
  });
});

/** REST stays same-site for browsers; MCP and its card are open. Both are stated in the docs. */
describe("CORS", () => {
  it("grants REST CORS only to the site's own origins and says so in the developer docs", async () => {
    const call = (origin: string | null) =>
      agentApiResponse({ pathname: "/api/v1/search", method: "GET", params: new URLSearchParams("q=x"), clientKey: "cors", origin });
    expect(call(ORIGIN).headers["Access-Control-Allow-Origin"]).toBe(ORIGIN);
    expect(call("https://ayushrai.site").headers["Access-Control-Allow-Origin"]).toBe("https://ayushrai.site");
    expect(call("http://localhost:5173").headers["Access-Control-Allow-Origin"]).toBe("http://localhost:5173");
    for (const origin of ["https://evil.example", "null", "https://www.ayushrai.site.evil.example", null]) {
      const response = call(origin);
      expect(response.headers["Access-Control-Allow-Origin"], String(origin)).toBeUndefined();
      expect(response.headers.Vary).toContain("Origin");
    }
    expect(corsHeaders("*")["Access-Control-Allow-Origin"]).toBeUndefined();

    const mcp = await handleMcpRequest(new Request(`${ORIGIN}/api/mcp`, { method: "OPTIONS" }));
    expect(mcp.headers.get("access-control-allow-origin")).toBe("*");

    const developers = renderPageMarkdown("/developers") ?? "";
    expect(developers).toContain("REST responses grant CORS only to the site's own origins");
    expect(buildOpenApiDocument().info.description).toContain("REST responses grant CORS only");
  });
});

/** Per-client fixed-window limits on the REST API and the MCP endpoint. */
describe("rate limits", () => {
  it("sends draft-11 RateLimit headers and a 429 with Retry-After past the quota", () => {
    const first = apiCall("/api/v1/projects", "198.51.100.1");
    expect(first.status).toBe(200);
    expect(first.headers["RateLimit-Policy"]).toBe(`"default";q=${RATE_LIMIT_QUOTA};w=60`);
    expect(first.headers.RateLimit).toMatch(new RegExp(`^"default";r=${RATE_LIMIT_QUOTA - 1};t=\\d+$`));
    expect(first.headers["Access-Control-Expose-Headers"]).toContain("RateLimit");

    for (let count = 1; count < RATE_LIMIT_QUOTA; count += 1) apiCall("/api/v1/projects", "198.51.100.1");
    const limited = apiCall("/api/v1/projects", "198.51.100.1");
    expect(limited.status).toBe(429);
    expect(Number(limited.headers["Retry-After"])).toBeGreaterThan(0);
    expect(limited.headers.RateLimit).toMatch(/^"default";r=0;t=\d+$/);
    expect(JSON.parse(limited.body ?? "{}").error.code).toBe("rate_limited");

    expect(apiCall("/api/v1/projects", "198.51.100.2").status).toBe(200);
  });

  it("keys clients by address, else by a User-Agent hash, never one shared anonymous bucket", () => {
    expect(clientKeyFrom({ "x-nf-client-connection-ip": " 192.0.2.9 ", "x-real-ip": "x" })).toBe("192.0.2.9");
    expect(clientKeyFrom(new Headers({ "x-forwarded-for": "198.51.100.4, 10.0.0.1" }))).toBe("198.51.100.4");
    const curl = clientKeyFrom(new Headers({ "user-agent": "curl/8.7.1" }));
    const bot = clientKeyFrom({ "user-agent": "ExampleBot/1.0" });
    expect(curl).toMatch(/^anonymous:[0-9a-f]+$/);
    expect(curl).not.toBe(bot);
    expect(curl).not.toContain("curl");
    expect(clientKeyFrom(new Headers({ "user-agent": "curl/8.7.1" }))).toBe(curl);
    expect(clientKeyFrom(new Headers())).toBe("anonymous");
    expect(clientKeyFrom(undefined)).toBe("anonymous");
  });

  it("sends RateLimit headers on the Server Card's 405", async () => {
    const response = await handleMcpRequest(
      new Request(`${ORIGIN}/api/mcp/server-card`, { method: "DELETE", headers: { "x-real-ip": "192.0.2.77" } }),
    );
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, HEAD, OPTIONS");
    expect(response.headers.get("ratelimit-policy")).toBe(`"default";q=${RATE_LIMIT_QUOTA};w=60`);
    expect(response.headers.get("ratelimit")).toMatch(/^"default";r=\d+;t=\d+$/);
  });

  it("opens a new window after the old one ends", () => {
    const start = 1_000_000;
    for (let count = 0; count < RATE_LIMIT_QUOTA; count += 1) takeRateLimit("w", start);
    expect(takeRateLimit("w", start + 1000).allowed).toBe(false);
    const next = takeRateLimit("w", start + 60_000);
    expect(next.allowed).toBe(true);
    expect(next.headers.RateLimit).toBe(`"default";r=${RATE_LIMIT_QUOTA - 1};t=60`);
  });

  it("rate limits the MCP endpoint with the same headers", async () => {
    const request = () =>
      handleMcpRequest(
        new Request(`${ORIGIN}/api/mcp`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json, text/event-stream",
            "x-real-ip": "192.0.2.5",
          },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }),
        }),
      );
    const ok = await request();
    expect(ok.status).toBe(200);
    expect(ok.headers.get("ratelimit-policy")).toBe(`"default";q=${RATE_LIMIT_QUOTA};w=60`);
    for (let count = 1; count < RATE_LIMIT_QUOTA; count += 1) takeRateLimit("192.0.2.5");
    const limited = await request();
    expect(limited.status).toBe(429);
    expect(limited.headers.get("retry-after")).toBeTruthy();
    expect((await limited.json()).error.data.code).toBe("rate_limited");
  });
});

/** Response schemas in the generated OpenAPI document. */
describe("OpenAPI", () => {
  it("gives every operation a typed JSON schema for success and an inline typed error body", () => {
    const spec = buildOpenApiDocument();
    const schemas = spec.components.schemas as Record<string, unknown>;
    const resolve = (ref: string) => ref.split("/").pop() ?? "";
    type Response = { $ref?: string; content?: Record<string, { schema: { $ref?: string } }> };
    let operations = 0;
    for (const [path, item] of Object.entries(spec.paths)) {
      for (const operation of Object.values(item as Record<string, { responses: Record<string, Response> }>)) {
        operations += 1;
        for (const [status, response] of Object.entries(operation.responses)) {
          if (status === "304") continue;
          expect(response.$ref, `${path} ${status} is inline`).toBeUndefined();
          const json = Object.entries(response.content ?? {}).find(([type]) => type !== "text/event-stream");
          expect(json, `${path} ${status}`).toBeTruthy();
          const ref = resolve(json?.[1].schema.$ref ?? "");
          expect(schemas[ref], `${path} ${status}`).toBeTruthy();
          if (Number(status) >= 400) {
            const expected =
              path === "/ask" ? "AskResponse" : path === "/api/send-email" ? "ContactResponse" : "ErrorResponse";
            expect(expected, `${path} ${status}`).toBe(ref);
          }
        }
        expect(Object.keys(operation.responses)).toContain("429");
        expect(Object.keys(operation.responses)).toContain("405");
      }
    }
    expect(operations).toBe(14);
    expect((spec.components as Record<string, unknown>).responses).toBeUndefined();
    const errorSchema = schemas.ErrorResponse as { properties: { error: { required: string[] } } };
    expect(errorSchema.properties.error.required).toEqual(["code", "message", "hint", "docs"]);
  });

  it("turns an unexpected REST failure into a 500 internal_error without leaking details", () => {
    const exploding = { get: () => { throw new Error("secret /var/task/path"); } } as unknown as URLSearchParams;
    const originalError = console.error;
    console.error = () => {};
    try {
      const result = safeDispatch("/api/v1/search", "GET", exploding);
      expect(result.status).toBe(500);
      const body = result.body as { error: { code: string; message: string; hint: string } };
      expect(body.error.code).toBe("internal_error");
      expect(JSON.stringify(body)).not.toContain("secret");
      expect(buildOpenApiDocument().components.schemas.ErrorResponse.properties.error.properties.code.enum).toContain(
        "internal_error",
      );
    } finally {
      console.error = originalError;
    }
  });

  it("documents every query parameter http.ts reads, including on the /api/projects alias", () => {
    const source = readFileSync(resolve(__dirname, "../lib/agent/http.ts"), "utf8");
    const read = new Set([...source.matchAll(/params\.get\("(\w+)"\)/g)].map((match) => match[1]));
    const spec = buildOpenApiDocument();
    const names = (path: string) => {
      const operation = (spec.paths as Record<string, { get?: { parameters?: Array<{ name: string }> } }>)[path].get;
      if (!operation) return new Set<string>();
      return new Set((operation.parameters ?? []).map((parameter) => parameter.name));
    };
    const documented = new Set(Object.keys(spec.paths).flatMap((path) => [...names(path)]));
    for (const name of read) expect(documented.has(name), name).toBe(true);
    const alias = names("/api/projects");
    for (const name of ["category", "type", "limit", "cursor", "archive", "slug", "compare", "slugs"]) {
      expect(alias.has(name), `/api/projects ${name}`).toBe(true);
    }
  });

  it("declares RateLimit headers on 400 and 404, matching what the API sends", () => {
    const spec = buildOpenApiDocument();
    const detail = (spec.paths["/api/v1/projects/{slug}"] as { get: { responses: Record<string, { headers?: object }> } })
      .get.responses;
    for (const status of ["400", "404", "405", "429", "500"]) {
      expect(Object.keys(detail[status].headers ?? {}), status).toEqual(
        expect.arrayContaining(["RateLimit", "RateLimit-Policy"]),
      );
    }
    expect(Object.keys(detail["429"].headers ?? {})).toContain("Retry-After");
    const badRequest = apiCall("/api/v1/projects", "203.0.113.20", "limit=99");
    expect(badRequest.status).toBe(400);
    expect(badRequest.headers.RateLimit).toBeTruthy();
    const notFound = apiCall("/api/v1/projects/no-such-project", "203.0.113.21");
    expect(notFound.status).toBe(404);
    expect(notFound.headers["RateLimit-Policy"]).toBeTruthy();
  });
});

/** Server Card content, HTTP delivery, and catalog listings. */
describe("MCP discovery", () => {
  it("publishes a Server Card that matches SEP-2127 and the live serverInfo", () => {
    const card = buildServerCard();
    expect(card.$schema).toBe(SERVER_CARD_SCHEMA);
    expect(card.name).toMatch(/^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+$/);
    expect(card.name).toBe(MCP_SERVER_INFO.name);
    expect(card.version).toBe(MCP_SERVER_INFO.version);
    expect(card.description.length).toBeLessThanOrEqual(100);
    expect(card.remotes).toEqual([
      expect.objectContaining({ type: "streamable-http", url: `${ORIGIN}/api/mcp` }),
    ]);
    expect(MCP_PROTOCOL_VERSIONS).toEqual([...SUPPORTED_PROTOCOL_VERSIONS]);
    expect(MCP_SERVER_INSTRUCTIONS.length).toBeGreaterThan(40);
    expect(MCP_SERVER_INSTRUCTIONS).toContain("lexical");
    // Constructing the server must accept instructions (initialize identity).
    expect(() => createPortfolioMcpServer()).not.toThrow();
  });

  it("serves the card with its media type, CORS, caching, and ETag revalidation", async () => {
    const response = await handleMcpRequest(
      new Request(`${ORIGIN}/api/mcp/server-card`, {
        headers: { accept: "application/mcp-server-card+json" },
      }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/mcp-server-card+json");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("cache-control")).toBe("public, max-age=3600");
    const etag = response.headers.get("etag") ?? "";
    expect(etag).toMatch(/^"[0-9a-f]+"$/);
    expect((await response.json()).name).toBe(MCP_SERVER_INFO.name);

    const revalidated = await handleMcpRequest(
      new Request(`${ORIGIN}/api/mcp?resource=server-card`, { headers: { "if-none-match": etag } }),
    );
    expect(revalidated.status).toBe(304);
  });

  it("lists the card in the AI Catalog, ARD manifest, and the RFC 9727 API catalog", () => {
    const entry = buildMcpCatalogEntry();
    expect(entry.identifier).toBe(MCP_ENTRY_IDENTIFIER);
    expect(entry.displayName).toBe(MCP_ENTRY_DISPLAY_NAME);
    expect(entry.url).toBe(`${ORIGIN}/api/mcp/server-card`);
    expect(entry).not.toHaveProperty("data");
    expect(entry.trustManifest.identity).toBe(ORIGIN);

    const catalog = buildAiCatalog();
    expect(catalog.specVersion).toBe("1.0");
    expect(catalog.entries[0]).toEqual(entry);
    expect(catalog.entries.map((item) => item.identifier)).toEqual([
      entry.identifier,
      "urn:air:ayushrai.site:mcp:docs",
    ]);
    const ard = buildArdManifest();
    expect(ard.specVersion).toBe("0.91");
    expect(ard.entries[0]).toEqual(entry);
    expect(ard.entries).toHaveLength(2);

    const files = agentFiles();
    expect(JSON.parse(files[".well-known/ai-catalog.json"])).toEqual(catalog);
    expect(JSON.parse(files[".well-known/ard.json"])).toEqual(ard);
    expect(JSON.parse(files[".well-known/mcp/server-card.json"])).toEqual(buildServerCard());
    expect(buildServerCard().icons?.[0]?.src).toContain("/favicon.svg");
    const mcpAnchor = buildApiCatalog().linkset.find((entry) => entry.anchor === `${ORIGIN}/api/mcp`);
    expect(mcpAnchor?.["service-desc"]?.[0]).toEqual({
      href: `${ORIGIN}/api/mcp/server-card`,
      type: "application/mcp-server-card+json",
    });
  });
});

/** Auth docs, agent-mode JSON, and NLWeb-shaped /ask. */
describe("auth, agent mode, and ask", () => {
  it("documents that the public API needs no authentication", () => {
    const auth = renderAuthMarkdown();
    expect(auth.startsWith("# Authentication\n")).toBe(true);
    expect(auth).toContain("public, read-only");
    expect(auth).toContain("no authentication");
    expect(auth).not.toContain("identity_endpoint");
    expect(agentFiles()["auth.md"]).toBe(auth);
  });

  it("builds a distinct agent-mode document for ?mode=agent", () => {
    expect(wantsAgentMode("/", new URLSearchParams("mode=agent"))).toBe(true);
    expect(wantsAgentMode("/", new URLSearchParams())).toBe(false);
    const doc = buildAgentModeDocument();
    expect(doc.api.authentication).toBe("none");
    expect(doc.mcp.url).toBe(`${ORIGIN}/api/mcp`);
    expect(doc.capabilities.a2a).toBe(false);
    expect(JSON.parse(agentFiles()["agent-mode.json"])).toEqual(doc);

    const response = markdownMiddleware(
      new Request(`${ORIGIN}/?mode=agent`, { headers: { accept: "text/html" } }),
    );
    expect(response).toBeInstanceOf(Response);
    expect(response?.headers.get("content-type")).toContain("application/json");
  });

  it("answers NLWeb-shaped ask queries from the lexical index", () => {
    expect(extractAskQuery({ params: new URLSearchParams("q=overlay") }).query).toBe("overlay");
    expect(extractAskQuery({ body: { query: { text: "agents" } } }).query).toBe("agents");
    const empty = buildAskResponse("");
    expect(empty.body._meta).toMatchObject({ response_type: "failure", version: "0.55" });
    const hit = buildAskResponse("overlay");
    expect(hit.body._meta).toMatchObject({ response_type: "answer", version: "0.55" });
    expect(Array.isArray(hit.body.results)).toBe(true);
  });

  it("emits YAML frontmatter on Markdown twins and section llms.txt indexes", () => {
    const about = renderPageMarkdown("/about") ?? "";
    expect(about.startsWith("---\n")).toBe(true);
    expect(about).toContain("title:");
    expect(about).toContain("last-updated:");
    expect(agentFiles()["developers/llms.txt"]).toContain("/auth.md");
    expect(agentFiles()["work/llms.txt"]).toContain("/work/");
    expect(agentFiles()["products/llms.txt"]).toContain("/products/");
    expect(agentFiles()["llms.txt"]).toContain("/developers/llms.txt");
    expect(agentFiles()["llms.txt"]).toContain("/work/llms.txt");
    expect(agentFiles()["llms.txt"]).toContain("/products/llms.txt");
  });

  it("streams /ask as NLWeb SSE only when streaming is requested", async () => {
    expect(wantsAskStream({ body: { prefer: { streaming: true } } })).toBe(true);
    expect(wantsAskStream({ params: new URLSearchParams("streaming=true") })).toBe(true);
    expect(wantsAskStream({ accept: "text/event-stream" })).toBe(true);
    expect(wantsAskStream({ accept: "text/event-stream;q=0" })).toBe(false);
    expect(wantsAskStream({ accept: "*/*" })).toBe(false);
    expect(wantsAskStream({ body: { prefer: { streaming: false } } })).toBe(false);

    /** Parses an SSE body into `[event, data]` pairs. */
    const parse = (text: string) =>
      text
        .trim()
        .split("\n\n")
        .map((frame) => {
          const [eventLine, dataLine] = frame.split("\n");
          return [eventLine.replace("event: ", ""), JSON.parse(dataLine.replace("data: ", ""))] as const;
        });

    const hit = buildAskResponse("overlay");
    const frames = parse(askEventStream(hit.body));
    expect(frames[0][0]).toBe("start");
    expect(frames[0][1]._meta).toMatchObject({ streaming: true, version: "0.55", response_type: "answer" });
    expect(frames[frames.length - 1][0]).toBe("complete");
    const results = frames.filter(([event]) => event === "result");
    expect(results.length).toBe((hit.body.results as unknown[]).length);
    expect(results[0][1]).toMatchObject({ index: 0, item: { name: expect.any(String) } });

    const failure = parse(askEventStream(buildAskResponse("").body));
    expect(failure.map(([event]) => event)).toEqual(["start", "error", "complete"]);

    const streamed = (await askHandler(
      new Request(`${ORIGIN}/ask`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.40" },
        body: JSON.stringify({ query: { text: "overlay" }, prefer: { streaming: true } }),
      }),
    )) as Response;
    expect(streamed.headers.get("content-type")).toBe("text/event-stream; charset=utf-8");
    expect(parse(await streamed.text())[0][0]).toBe("start");

    const plain = (await askHandler(new Request(`${ORIGIN}/ask?q=overlay`, { headers: { "x-forwarded-for": "198.51.100.41" } }))) as Response;
    expect(plain.headers.get("content-type")).toContain("application/json");
  });

  it("publishes a Schema Map and JSON Lines feed of the page JSON-LD, advertised in robots.txt", () => {
    const map = renderSchemaMap();
    expect(map).toContain("<loc>https://www.ayushrai.site/feeds/portfolio.jsonl</loc>");
    expect(map).toContain("<sf:contentType>structuredData/schema.org</sf:contentType>");
    const lines = renderSchemaFeed().trim().split("\n").map((line) => JSON.parse(line));
    for (const node of lines) {
      expect(node["@context"]).toBe("https://schema.org");
      expect(node["@type"]).toBeTruthy();
      expect(node.url).toMatch(/^https:\/\/www\.ayushrai\.site\//);
    }
    expect(lines.map((node) => node["@type"])).toEqual(
      expect.arrayContaining(["WebSite", "Person", "CreativeWork", "Service", "FAQPage"]),
    );
    expect(agentFiles()["schemamap.xml"]).toBe(map);
    const robots = readFileSync(resolve(__dirname, "../../public/robots.txt"), "utf8");
    expect(robots).toMatch(/^schemamap: https:\/\/www\.ayushrai\.site\/schemamap\.xml$/m);
  });

  it("ships a conformant Agent Plugins manifest whose skill names match their directories", () => {
    const root = resolve(__dirname, "../..");
    const plugin = JSON.parse(readFileSync(resolve(root, "plugin.json"), "utf8"));
    expect(plugin.$schema).toBe("https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
    expect(plugin.name).toMatch(/^[a-z0-9](?:[a-z0-9]|-(?!-)|\.(?!\.))*[a-z0-9]$/);
    const allowed = ["$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions"];
    for (const key of Object.keys(plugin)) expect(allowed, key).toContain(key);
    const mcp = JSON.parse(readFileSync(resolve(root, "mcp.json"), "utf8"));
    expect(Object.keys(mcp).sort()).toEqual(["$schema", "mcpServers"]);
    expect(mcp.mcpServers["ayush-portfolio"]).toEqual({ type: "streamable-http", url: `${ORIGIN}/api/mcp` });
    expect(mcp.mcpServers["ayush-portfolio-docs"]).toEqual({
      type: "streamable-http",
      url: `${ORIGIN}/api/mcp/docs`,
    });
    const skill = readFileSync(resolve(root, "skills/portfolio-discovery/SKILL.md"), "utf8");
    expect(skill).toMatch(/^---\nname: portfolio-discovery\n/);
  });

  it("publishes an honest free-access pricing.md without invented tiers", () => {
    const pricing = agentFiles()["pricing.md"] ?? "";
    expect(pricing.startsWith("---\n")).toBe(true);
    expect(pricing).toContain("# Pricing");
    expect(pricing.toLowerCase()).toContain("free");
    expect(pricing).not.toMatch(/\$\d/);
    expect(pricing).not.toContain("schema.org/Offer");
  });
});

/** Usage guidance in llms.txt, /developers, and AGENTS.md. */
describe("agent instructions", () => {
  it("tells agents when to use the site and when not to, in llms.txt and /developers", () => {
    const llms = renderLlmsTxt();
    expect(llms).toContain("**When to use this site:**");
    expect(llms).toContain("**When not to use it:**");
    expect(llms).toContain("/api/mcp/server-card");
    const beforeFirstSection = llms.split("\n## ")[0];
    expect(beforeFirstSection).toContain("When to use this site");
    expect(beforeFirstSection.split("\n").filter((line) => line.startsWith("#"))).toHaveLength(1);
    const developers = renderPageMarkdown("/developers") ?? "";
    expect(developers).toContain("When to use it");
    expect(developers).toContain("Rate limits");
    expect(developers).toContain("rate_limited");

    const agents = readFileSync(resolve(process.cwd(), "AGENTS.md"), "utf8");
    expect(agents).toContain("## When to use this site");
    expect(agents).toContain("Do not use it for:");
    expect(agents).toContain("RateLimit-Policy");
    expect(agents).toContain("/api/mcp/server-card");
  });
});

/** packages/cli request building and run() exit codes, with fetch routed to the in-process API. */
describe("CLI", () => {
  it("maps commands to the v1 endpoints", () => {
    const url = (argv: string[]) => {
      const parsed = parseArgs(argv);
      return buildRequest(parsed.command, parsed.args, parsed.flags);
    };
    expect(url(["search", "open", "framework", "--limit", "3"])).toBe(
      `${ORIGIN}/api/v1/search?q=open+framework&limit=3`,
    );
    expect(url(["projects", "--archive", "--cursor=abc"])).toBe(`${ORIGIN}/api/v1/projects?cursor=abc&archive=1`);
    expect(url(["project", "overlay-text-box"])).toBe(`${ORIGIN}/api/v1/projects/overlay-text-box`);
    expect(url(["compare", "a", "b", "--base-url", "http://localhost:4173/"])).toBe(
      "http://localhost:4173/api/v1/compare?slugs=a%2Cb",
    );
  });

  it("prints API JSON, reports API errors on stderr, and rejects bad usage", async () => {
    const out: string[] = [];
    const err: string[] = [];
    const io = {
      stdout: (text: string) => out.push(text),
      stderr: (text: string) => err.push(text),
      fetch: async (input: string) => {
        const url = new URL(input);
        const response = apiCall(url.pathname, "cli", url.search.slice(1));
        return new Response(response.body, { status: response.status, headers: response.headers });
      },
    };
    expect(await run(["project", "overlay-text-box"], io)).toBe(0);
    expect(JSON.parse(out.join("")).project.slug).toBe("overlay-text-box");

    expect(await run(["project", "no-such-project"], io)).toBe(1);
    expect(err.join("")).toContain("not_found");

    expect(await run(["compare", "only-one"], io)).toBe(64);
    expect(await run(["nonsense"], io)).toBe(64);
    expect(await run(["--help"], io)).toBe(0);
  });
});
