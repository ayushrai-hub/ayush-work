/**
 * Serverless entry for POST /api/v1/jobs and GET /api/v1/jobs/:id.
 *
 * Vercel rewrites those public paths here. The handler restores the public pathname, including
 * `?id=` from the rewrite, then calls `agentApiResponse`. Netlify Functions v2 pass a Web Request.
 *
 * Connects to:
 * - src/lib/agent/jobs.ts (202 body and poll store). vercel.json rewrites `/api/v1/jobs`.
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

/** Public pathname: `/api/v1/jobs` or `/api/v1/jobs/{id}` from either the URL path or rewrite query. */
function publicPath(url: URL, query?: Record<string, string | string[] | undefined>): string {
  const cleanPath = url.pathname.replace(/\/$/, "");
  if (cleanPath.startsWith("/api/v1/jobs/") && cleanPath.length > "/api/v1/jobs/".length) {
    return cleanPath;
  }
  const queryId = typeof query?.id === "string" ? query.id : Array.isArray(query?.id) ? query.id[0] : undefined;
  const id = url.searchParams.get("id") ?? queryId;
  return id ? `/api/v1/jobs/${id}` : "/api/v1/jobs";
}

/**
 * Job handler. Web Request in, Web Response out. Node `(req, res)` writes to `res`.
 */
export default async function handler(request: unknown, response?: unknown) {
  if (typeof Request !== "undefined" && request instanceof Request) {
    const url = new URL(request.url);
    const text = request.method === "POST" ? await request.text() : "";
    const result = agentApiResponse({
      pathname: publicPath(url),
      method: request.method,
      params: url.searchParams,
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
    query?: Record<string, string | string[] | undefined>;
    headers?: HeaderBag;
    body?: unknown;
  };
  const url = new URL(node.url || "/api/jobs", "https://www.ayushrai.site");
  const result = agentApiResponse({
    pathname: publicPath(url, node.query),
    method: node.method || "GET",
    params: url.searchParams,
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
