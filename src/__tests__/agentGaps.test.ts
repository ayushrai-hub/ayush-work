/**
 * Agent-readiness gaps that the site can implement without inventing a product: read batch,
 * sandbox alias, documentation MCP, and the Idempotency-Key declaration.
 *
 * Batch and sandbox go through the same dispatcher as the public reads. The docs MCP is a second
 * Streamable HTTP server. External listings (registries, npm, Wikipedia) are not asserted here.
 *
 * Connects to:
 * - src/lib/agent/http.ts, batch.ts, docsMcp.ts, mcpHttp.ts, openapi.ts, structuredData.ts.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { DOCS_HTTP_SURFACE, handleMcpRequest } from "../lib/agent/mcpHttp";
import { agentApiResponse, dispatchAgentApi } from "../lib/agent/http";
import { resetIdempotency } from "../lib/agent/idempotency";
import { buildOpenApiDocument } from "../lib/agent/openapi";
import { softwareServicesFaqNode, softwareServicesNode } from "../lib/structuredData";

const ORIGIN = "https://www.ayushrai.site";

beforeEach(() => {
  resetIdempotency();
});

/** POST /api/v1/batch over the public read routes. */
describe("read batch", () => {
  it("returns one result per read and replays an Idempotency-Key", () => {
    const body = {
      operations: [
        { method: "GET", path: "/api/v1/search", query: { q: "overlay", limit: "1" } },
        { method: "GET", path: "/api/v1/projects/overlay-text-box", query: {} },
      ],
    };
    const first = agentApiResponse({
      pathname: "/api/v1/batch",
      method: "POST",
      params: new URLSearchParams(),
      clientKey: "batch-a",
      body,
      idempotencyKey: "batch-key",
    });
    expect(first.status).toBe(200);
    const results = JSON.parse(first.body ?? "{}").results as Array<{ status: number }>;
    expect(results).toHaveLength(2);
    expect(results[0].status).toBe(200);
    expect(results[1].status).toBe(200);

    const replay = agentApiResponse({
      pathname: "/api/v1/batch",
      method: "POST",
      params: new URLSearchParams(),
      clientKey: "batch-b",
      body,
      idempotencyKey: "batch-key",
    });
    expect(replay.status).toBe(200);
    expect(replay.headers["Idempotent-Replayed"]).toBe("true");
    expect(replay.body).toBe(first.body);

    const conflict = dispatchAgentApi("/api/v1/batch", "POST", new URLSearchParams(), { operations: [{ path: "/api/v1/search", query: { q: "other" } }] }, "batch-key");
    expect(conflict.status).toBe(409);
    expect((conflict.body as { error: { code: string } }).error.code).toBe("idempotency_conflict");
  });

  it("rejects an empty batch, a write, and a path outside the public reads", () => {
    expect(dispatchAgentApi("/api/v1/batch", "POST", new URLSearchParams(), { operations: [] }).status).toBe(400);
    const mixed = dispatchAgentApi("/api/v1/batch", "POST", new URLSearchParams(), {
      operations: [
        { method: "POST", path: "/api/v1/search" },
        { path: "/api/v1/batch" },
        { path: "/api/v1/search", query: { limit: 2 } },
      ],
    });
    expect(mixed.status).toBe(200);
    const results = (mixed.body as { results: Array<{ status: number }> }).results;
    expect(results.map((item) => item.status)).toEqual([405, 400, 400]);
  });
});

/** Sandbox paths are the public reads with an environment header. */
describe("sandbox alias", () => {
  it("returns the same search body as /api/v1/search and marks the environment", () => {
    const live = agentApiResponse({
      pathname: "/api/v1/search",
      method: "GET",
      params: new URLSearchParams("q=overlay&limit=1"),
      clientKey: "sandbox-live",
    });
    const sandbox = agentApiResponse({
      pathname: "/api/sandbox/v1/search",
      method: "GET",
      params: new URLSearchParams("q=overlay&limit=1"),
      clientKey: "sandbox-alias",
    });
    expect(sandbox.status).toBe(200);
    expect(sandbox.headers["X-Api-Environment"]).toBe("sandbox");
    expect(sandbox.body).toBe(live.body);
    expect(live.headers["X-Api-Environment"]).toBeUndefined();
  });
});

/** Documentation MCP lists pages and returns Markdown. */
describe("docs MCP", () => {
  it("lists pages and returns one published Markdown page", async () => {
    const call = async (name: string, args: Record<string, unknown>) => {
      const response = await handleMcpRequest(
        new Request(`${ORIGIN}/api/mcp/docs`, {
          method: "POST",
          headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
        }),
        DOCS_HTTP_SURFACE,
      );
      return (await response.json()) as { result?: { isError?: boolean; content: Array<{ text: string }> } };
    };

    const listed = JSON.parse((await call("list_pages", {})).result?.content[0].text ?? "{}") as {
      pages: Array<{ path: string }>;
    };
    expect(listed.pages.some((page) => page.path === "/developers")).toBe(true);

    const about = JSON.parse((await call("get_page", { path: "/about" })).result?.content[0].text ?? "{}") as {
      markdown: string;
    };
    expect(about.markdown).toContain("#");

    const missing = await call("get_page", { path: "/no-such-page" });
    expect(missing.result?.isError).toBe(true);

    const card = await handleMcpRequest(new Request(`${ORIGIN}/api/mcp/docs/server-card`), DOCS_HTTP_SURFACE);
    expect(card.status).toBe(200);
    expect((await card.json()).name).toBe("site.ayushrai/docs");
  });
});

/** OpenAPI and schema types the scan can read. */
describe("declared agent surfaces", () => {
  it("documents Idempotency-Key on the batch and contact writes", () => {
    const spec = buildOpenApiDocument();
    const paths = spec.paths as Record<string, { post?: { parameters?: Array<{ name: string; in: string }> } }>;
    for (const path of ["/api/v1/batch", "/api/send-email"]) {
      const parameters = paths[path].post?.parameters ?? [];
      expect(parameters).toEqual(expect.arrayContaining([{ name: "Idempotency-Key", in: "header", required: false, description: expect.any(String), schema: { type: "string", maxLength: 128 } }]));
    }
    expect(softwareServicesNode()["@type"]).toBe("Service");
    expect(softwareServicesFaqNode()["@type"]).toBe("FAQPage");
    expect(softwareServicesFaqNode().mainEntity).toHaveLength(2);
  });
});
