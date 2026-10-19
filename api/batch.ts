/**
 * Serverless entry for POST /api/v1/batch.
 *
 * Reads the JSON body and optional Idempotency-Key, then calls the same dispatcher as the read
 * API. Netlify Functions v2 pass a Web Request. Vercel passes (req, res) and may have already
 * parsed the body.
 *
 * Connects to:
 * - src/lib/agent/http.ts (agentApiResponse). netlify.toml redirects /api/v1/batch here.
 *   vercel.json rewrites /api/v1/batch to /api/batch.
 */
import { agentApiResponse } from "../src/lib/agent/http";
import { clientKeyFrom } from "../src/lib/agent/rateLimit";

/** Headers as a Web Headers object or a Node record. */
type HeaderBag = Headers | Record<string, string | string[] | undefined> | undefined;

/** Reads one header from either shape. Header names are matched case-insensitively on records. */
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

/**
 * Batch handler. This function only serves /api/v1/batch, so the path is fixed even when a host
 * rewrites the URL to /api/batch. Web Request in, Web Response out; Node (req, res) writes to `res`.
 */
export default async function handler(request: unknown, response?: unknown) {
  if (typeof Request !== "undefined" && request instanceof Request) {
    const text = request.method === "POST" ? await request.text() : "";
    const result = agentApiResponse({
      pathname: "/api/v1/batch",
      method: request.method,
      params: new URL(request.url).searchParams,
      origin: request.headers.get("origin"),
      clientKey: clientKeyFrom(request.headers),
      body: text,
      idempotencyKey: request.headers.get("idempotency-key"),
    });
    return new Response(result.body, { status: result.status, headers: result.headers });
  }

  const node = request as {
    method?: string;
    url?: string;
    headers?: HeaderBag;
    body?: unknown;
  };
  const result = agentApiResponse({
    pathname: "/api/v1/batch",
    method: node.method || "GET",
    params: new URL(node.url || "/api/v1/batch", "https://www.ayushrai.site").searchParams,
    origin: headerValue(node.headers, "origin"),
    clientKey: clientKeyFrom(node.headers as Headers | Record<string, string | undefined>),
    body: node.body,
    idempotencyKey: headerValue(node.headers, "idempotency-key"),
  });
  if (isNodeResponse(response)) {
    for (const [key, value] of Object.entries(result.headers)) response.setHeader(key, value);
    response.status(result.status).end(result.body ?? undefined);
    return;
  }
  return new Response(result.body, { status: result.status, headers: result.headers });
}
