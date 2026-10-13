/**
 * The remote MCP endpoint `/api/mcp` and its Server Card, as one Web `Request` handler.
 *
 * Each POST builds a fresh server from `mcpServer.ts`, connects it to a stateless SDK transport
 * with JSON responses, handles the one request, and closes. Requests for the Server Card are
 * answered here too, with ETag and If-None-Match support. Both share the per-instance rate limit.
 *
 * Connects to:
 * - `api/mcp.ts` (Netlify passes a Web Request; Vercel's Node request is converted first).
 *   `netlify.toml` and `vercel.json` rewrite `/api/mcp/server-card` to `/api/mcp?resource=server-card`.
 * - `vitePlugin.ts` calls it for `/api/mcp` and `/api/mcp/server-card` in dev and preview.
 * - Depends on `@modelcontextprotocol/sdk`, `mcpServer.ts`, `mcpCard.ts`, `rateLimit.ts`, `apiError.ts`.
 */
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { apiErrorBody } from "./apiError";
import { SERVER_CARD_HEADERS, SERVER_CARD_PATH, serverCardEtag, serverCardJson } from "./mcpCard";
import { createPortfolioMcpServer } from "./mcpServer";
import {
  clientKeyFrom,
  RATE_LIMIT_EXPOSED_HEADERS,
  RATE_LIMIT_QUOTA,
  RATE_LIMIT_WINDOW_SECONDS,
  takeRateLimit,
} from "./rateLimit";

/** Any origin may call the MCP endpoint; it is read-only and needs no credentials. */
const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Protocol-Version",
  "Access-Control-Expose-Headers": RATE_LIMIT_EXPOSED_HEADERS,
};

/** Copy of `response` with `extra` headers set, overriding any with the same name. */
function withHeaders(response: Response, extra: Record<string, string>): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(extra)) headers.set(key, value);
  return new Response(response.body, { status: response.status, headers });
}

/**
 * JSON-RPC 2.0 error response with `id: null`, used before the SDK sees the request.
 * Code -32000 is the server-error range; `data` can carry the REST-style error object.
 */
function jsonRpcError(status: number, message: string, headers: Record<string, string>, data?: unknown) {
  return new Response(
    JSON.stringify({ jsonrpc: "2.0", error: { code: -32000, message, ...(data ? { data } : {}) }, id: null }),
    { status, headers: { ...headers, "Content-Type": "application/json" } },
  );
}

/**
 * `vercel.json` and `netlify.toml` both rewrite the card path to the MCP function with
 * `?resource=server-card`. The path check covers requests that still carry the original URL,
 * such as the Vite dev server.
 */
function isServerCardRequest(url: URL): boolean {
  return (
    url.pathname.replace(/\/$/, "") === SERVER_CARD_PATH ||
    url.searchParams.get("resource") === "server-card"
  );
}

/**
 * Serves the Server Card: 200 with an ETag, 304 when If-None-Match matches (or is `*`),
 * and 405 JSON for methods other than GET, HEAD, and OPTIONS.
 */
function serveServerCard(request: Request, rateHeaders: Record<string, string>): Response {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: SERVER_CARD_HEADERS });
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(JSON.stringify(apiErrorBody("method_not_allowed", "The Server Card is read with GET.")), {
      status: 405,
      headers: { ...SERVER_CARD_HEADERS, "Content-Type": "application/json", Allow: "GET, HEAD, OPTIONS" },
    });
  }
  const body = serverCardJson();
  const etag = serverCardEtag(body);
  const headers = { ...SERVER_CARD_HEADERS, ...rateHeaders, ETag: etag };
  const match = request.headers.get("if-none-match");
  if (match && match.split(",").some((tag) => tag.trim() === etag || tag.trim() === "*")) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(request.method === "HEAD" ? null : body, { status: 200, headers });
}

/**
 * Stateless Streamable HTTP: every POST gets a fresh server and a JSON response, so the
 * endpoint runs as an ordinary serverless function. There are no sessions and no GET stream.
 * OPTIONS is answered before the rate limit; everything else, the Server Card included, counts
 * against it. Non-POST methods on `/api/mcp` get a 405 JSON-RPC error.
 */
export async function handleMcpRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const card = isServerCardRequest(url);
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: card ? SERVER_CARD_HEADERS : CORS_HEADERS });
  }

  const limit = takeRateLimit(clientKeyFrom(request.headers));
  if (!limit.allowed) {
    const error = apiErrorBody(
      "rate_limited",
      `More than ${RATE_LIMIT_QUOTA} requests in ${RATE_LIMIT_WINDOW_SECONDS} seconds.`,
    ).error;
    return jsonRpcError(429, error.message, { ...CORS_HEADERS, ...limit.headers }, error);
  }
  if (card) return serveServerCard(request, limit.headers);

  if (request.method !== "POST") {
    return jsonRpcError(405, "Method not allowed. Send JSON-RPC with POST.", {
      ...CORS_HEADERS,
      ...limit.headers,
      Allow: "POST, OPTIONS",
    });
  }

  const server = createPortfolioMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await server.connect(transport);
  try {
    return withHeaders(await transport.handleRequest(request), { ...CORS_HEADERS, ...limit.headers });
  } finally {
    await server.close();
  }
}
