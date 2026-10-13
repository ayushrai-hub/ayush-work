/**
 * Serverless entry for the remote MCP endpoint (`POST /api/mcp`, Streamable HTTP) and its Server Card.
 *
 * Netlify Functions v2 pass a Web Request, which goes straight to handleMcpRequest. Vercel's Node
 * runtime passes (req, res): the request is rebuilt as a Web Request, and the Web Response is copied
 * back onto `res`. All protocol, rate-limit, and Server Card logic lives in handleMcpRequest.
 *
 * Connects to:
 * - Netlify: `api/` is the functions directory; netlify.toml routes `/api/*` to `/.netlify/functions/:splat`
 *   and `/api/mcp/server-card` to `/.netlify/functions/mcp?resource=server-card`.
 * - Vercel: vercel.json rewrites `/api/mcp/server-card` to `/api/mcp?resource=server-card`.
 * - src/lib/agent/mcpHttp.ts (handleMcpRequest), which builds the server from src/lib/agent/mcpServer.ts.
 */
import { handleMcpRequest } from "../src/lib/agent/mcpHttp";

/** The subset of Vercel's Node request this adapter reads. Vercel parses JSON bodies into `body`. */
type NodeRequest = {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

/** The subset of Vercel's Node response this adapter writes to. */
type NodeResponse = {
  status: (code: number) => NodeResponse;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

// The body is re-serialized below, so the original length and hop-by-hop headers no longer apply.
const DROPPED_HEADERS = new Set(["content-length", "connection", "transfer-encoding"]);

/**
 * Rebuilds a Vercel Node request as a Web Request for handleMcpRequest.
 * Joins multi-value headers, re-serializes a parsed POST body as JSON, and resolves the URL
 * against the request's Host header (falling back to the canonical host).
 */
function toWebRequest(req: NodeRequest): Request {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (DROPPED_HEADERS.has(key.toLowerCase())) continue;
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(", "));
  }
  const method = (req.method || "GET").toUpperCase();
  const body =
    method === "POST"
      ? typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body ?? null)
      : undefined;
  const host = headers.get("host") ?? "www.ayushrai.site";
  return new Request(new URL(req.url || "/api/mcp", `https://${host}`), { method, headers, body });
}

/**
 * Remote MCP endpoint (Streamable HTTP, stateless JSON responses).
 * Netlify passes a Web Request and receives the Web Response back. Vercel passes a Node request
 * and response; the result is written to `res` and nothing is returned.
 */
export default async function handler(request: unknown, response?: unknown) {
  if (request instanceof Request) return handleMcpRequest(request);

  const res = response as NodeResponse;
  const result = await handleMcpRequest(toWebRequest(request as NodeRequest));
  result.headers.forEach((value, key) => res.setHeader(key, value));
  res.status(result.status).end(await result.text());
}
