/**
 * Serverless entry for POST /api/a2a, the A2A JSON-RPC endpoint named by the agent card.
 *
 * The body is one JSON-RPC request. `message/send` runs lexical portfolio search.
 *
 * Connects to:
 * - src/lib/agent/a2a.ts. The card is `/.well-known/agent-card.json`.
 */
import { agentApiResponse } from "../src/lib/agent/http";
import { clientKeyFrom } from "../src/lib/agent/rateLimit";

/** Headers as a Web Headers object or a Node record. */
type HeaderBag = Headers | Record<string, string | string[] | undefined> | undefined;

/** Reads one header from either shape. */
function headerValue(headers: HeaderBag, name: string): string | undefined {
  if (!headers) return undefined;
  if (typeof (headers as Headers).get === "function") return (headers as Headers).get(name) ?? undefined;
  const record = headers as Record<string, string | string[] | undefined>;
  const value = record[name] ?? record[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

/** Node response subset this adapter writes. */
type NodeResponse = {
  status: (code: number) => NodeResponse;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

/** True when the second argument is a writable Node response. */
function isNodeResponse(value: unknown): value is NodeResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<NodeResponse>;
  return typeof candidate.status === "function" && typeof candidate.setHeader === "function" && typeof candidate.end === "function";
}

/** A2A handler. This function only serves /api/a2a, so the path is fixed. */
export default async function handler(request: unknown, response?: unknown) {
  if (typeof Request !== "undefined" && request instanceof Request) {
    const text = request.method === "POST" ? await request.text() : "";
    const result = agentApiResponse({
      pathname: "/api/a2a",
      method: request.method,
      params: new URL(request.url).searchParams,
      origin: request.headers.get("origin"),
      clientKey: clientKeyFrom(request.headers),
      body: text,
    });
    return new Response(result.body, { status: result.status, headers: result.headers });
  }

  const node = request as { method?: string; url?: string; headers?: HeaderBag; body?: unknown };
  const result = agentApiResponse({
    pathname: "/api/a2a",
    method: node.method || "POST",
    params: new URL(node.url || "/api/a2a", "https://www.ayushrai.site").searchParams,
    origin: headerValue(node.headers, "origin"),
    clientKey: clientKeyFrom(node.headers as Headers | Record<string, string | undefined>),
    body: node.body,
  });
  if (isNodeResponse(response)) {
    for (const [key, value] of Object.entries(result.headers)) response.setHeader(key, value);
    response.status(result.status).end(result.body ?? undefined);
    return;
  }
  return new Response(result.body, { status: result.status, headers: result.headers });
}
