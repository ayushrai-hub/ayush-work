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
import { agentApiResponse, corsHeaders, dispatchAgentApi } from "../lib/agent/http";
import { renderLlmsTxt, renderPageMarkdown } from "../lib/agent/markdown";
import { markdownMiddleware } from "../lib/agent/markdownMiddleware";
import {
  buildAiCatalog,
  buildServerCard,
  MCP_PROTOCOL_VERSIONS,
  MCP_SERVER_INFO,
  SERVER_CARD_SCHEMA,
} from "../lib/agent/mcpCard";
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
  it("gives every operation a typed JSON schema for success and errors", () => {
    const spec = buildOpenApiDocument();
    const schemas = spec.components.schemas as Record<string, unknown>;
    const responses = spec.components.responses as Record<string, { content: Record<string, { schema: { $ref: string } }> }>;
    const resolve = (ref: string) => ref.split("/").pop() ?? "";
    let operations = 0;
    for (const [path, item] of Object.entries(spec.paths)) {
      for (const operation of Object.values(item as Record<string, { responses: Record<string, unknown> }>)) {
        operations += 1;
        for (const [status, raw] of Object.entries(operation.responses)) {
          if (status === "304") continue;
          const response = (raw as { $ref?: string }).$ref
            ? responses[resolve((raw as { $ref: string }).$ref)]
            : (raw as { content: Record<string, { schema: { $ref: string } }> });
          const media = Object.values(response.content ?? {});
          expect(media.length, `${path} ${status}`).toBe(1);
          expect(schemas[resolve(media[0].schema.$ref)], `${path} ${status}`).toBeTruthy();
        }
        expect(Object.keys(operation.responses)).toContain("429");
      }
    }
    expect(operations).toBe(7);
    const errorSchema = schemas.ErrorResponse as { properties: { error: { required: string[] } } };
    expect(errorSchema.properties.error.required).toEqual(["code", "message", "hint", "docs"]);
  });

  it("documents every query parameter http.ts reads, including on the /api/projects alias", () => {
    const source = readFileSync(resolve(__dirname, "../lib/agent/http.ts"), "utf8");
    const read = new Set([...source.matchAll(/params\.get\("(\w+)"\)/g)].map((match) => match[1]));
    const spec = buildOpenApiDocument();
    const names = (path: string) =>
      new Set(
        ((spec.paths as Record<string, { get: { parameters?: Array<{ name: string }> } }>)[path].get.parameters ?? []).map(
          (parameter) => parameter.name,
        ),
      );
    const documented = new Set(Object.keys(spec.paths).flatMap((path) => [...names(path)]));
    for (const name of read) expect(documented.has(name), name).toBe(true);
    const alias = names("/api/projects");
    for (const name of ["category", "type", "limit", "cursor", "archive", "slug", "compare", "slugs"]) {
      expect(alias.has(name), `/api/projects ${name}`).toBe(true);
    }
  });

  it("declares RateLimit headers on 400 and 404, matching what the API sends", () => {
    const spec = buildOpenApiDocument();
    const responses = spec.components.responses as Record<string, { headers?: Record<string, unknown> }>;
    for (const name of ["BadRequest", "NotFound", "TooManyRequests"]) {
      expect(Object.keys(responses[name].headers ?? {}), name).toEqual(
        expect.arrayContaining(["RateLimit", "RateLimit-Policy"]),
      );
    }
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

  it("lists the card in the AI Catalog and the RFC 9727 API catalog", () => {
    const catalog = buildAiCatalog();
    expect(catalog.specVersion).toBe("1.0");
    expect(catalog.entries).toEqual([
      {
        identifier: "urn:air:ayushrai.site:mcp:portfolio",
        type: "application/mcp-server-card+json",
        url: `${ORIGIN}/api/mcp/server-card`,
      },
    ]);
    const files = agentFiles();
    expect(JSON.parse(files[".well-known/ai-catalog.json"])).toEqual(catalog);
    expect(JSON.parse(files[".well-known/mcp/server-card.json"])).toEqual(buildServerCard());
    const mcpAnchor = buildApiCatalog().linkset.find((entry) => entry.anchor === `${ORIGIN}/api/mcp`);
    expect(mcpAnchor?.["service-desc"]?.[0]).toEqual({
      href: `${ORIGIN}/api/mcp/server-card`,
      type: "application/mcp-server-card+json",
    });
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
