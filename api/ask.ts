/**
 * Serverless entry for the NLWeb-shaped `/ask` endpoint (lexical portfolio search).
 *
 * Accepts GET and POST. Netlify routes `/ask` here; Vercel rewrites `/ask` to `/api/ask`.
 * Rate limiting uses the same per-instance window as the REST API.
 *
 * Connects to:
 * - `src/lib/agent/nlwebAsk.ts` for the response body.
 * - `src/lib/agent/rateLimit.ts` for quotas. Host config: `netlify.toml`, `vercel.json`.
 */
import { extractAskQuery, buildAskResponse } from "../src/lib/agent/nlwebAsk";
import { clientKeyFrom, takeRateLimit } from "../src/lib/agent/rateLimit";
import { isSiteOrigin } from "../src/lib/siteOrigins";

type NodeRequest = {
  method?: string;
  httpMethod?: string;
  url?: string;
  path?: string;
  headers?: Record<string, string | string[] | undefined> | Headers;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
  queryStringParameters?: Record<string, string | undefined> | null;
};

type NodeResponse = {
  status: (code: number) => NodeResponse;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

/** Reads one header from a Headers object or a plain record. */
function headerValue(req: NodeRequest, name: string): string | undefined {
  const headers = req.headers;
  if (!headers) return undefined;
  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name) ?? undefined;
  }
  const record = headers as Record<string, string | string[] | undefined>;
  const value = record[name] ?? record[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

/** CORS headers; echoes Origin only for the site's own hosts. */
function cors(origin?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Expose-Headers": "RateLimit, RateLimit-Policy, Retry-After",
    Vary: "Origin",
  };
  if (origin && isSiteOrigin(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

/** Parses JSON from a Web Request or a Vercel Node body field. */
async function readBody(req: Request | NodeRequest): Promise<unknown> {
  if (typeof Request !== "undefined" && req instanceof Request) {
    if (req.method.toUpperCase() !== "POST") return undefined;
    const text = await req.text();
    if (!text) return undefined;
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return { __parseError: true };
    }
  }
  const node = req as NodeRequest;
  if ((node.method || node.httpMethod || "GET").toUpperCase() !== "POST") return undefined;
  if (node.body === undefined || node.body === null || node.body === "") return undefined;
  if (typeof node.body === "string") {
    try {
      return JSON.parse(node.body) as unknown;
    } catch {
      return { __parseError: true };
    }
  }
  return node.body;
}

/** Builds query params from a Web or Node request. */
function paramsOf(req: Request | NodeRequest): URLSearchParams {
  if (typeof Request !== "undefined" && req instanceof Request) {
    return new URL(req.url).searchParams;
  }
  const node = req as NodeRequest;
  const params = new URLSearchParams();
  try {
    const url = new URL(node.url || node.path || "/ask", "https://www.ayushrai.site");
    url.searchParams.forEach((value, key) => params.set(key, value));
  } catch {
    // ignore
  }
  const bag = node.queryStringParameters || node.query || {};
  for (const [key, value] of Object.entries(bag)) {
    if (typeof value === "string" && !params.has(key)) params.set(key, value);
  }
  return params;
}

/** Shared ask handler for Web Request and Vercel Node shapes. */
async function handleAsk(req: Request | NodeRequest, res?: NodeResponse) {
  const method = (
    typeof Request !== "undefined" && req instanceof Request
      ? req.method
      : (req as NodeRequest).method || (req as NodeRequest).httpMethod || "GET"
  ).toUpperCase();
  const origin =
    typeof Request !== "undefined" && req instanceof Request
      ? req.headers.get("origin")
      : headerValue(req as NodeRequest, "origin");
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "private, max-age=60",
    ...cors(origin),
  };

  if (method === "OPTIONS") {
    if (res) {
      for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
      res.status(204).end();
      return;
    }
    return new Response(null, { status: 204, headers });
  }

  if (method !== "GET" && method !== "HEAD" && method !== "POST") {
    const body = JSON.stringify({
      _meta: { version: "0.55", response_type: "failure" },
      error: { code: "method_not_allowed", message: "Use GET, HEAD, or POST." },
    });
    if (res) {
      for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
      res.status(405).end(body);
      return;
    }
    return new Response(body, { status: 405, headers });
  }

  const clientKey = clientKeyFrom(
    typeof Request !== "undefined" && req instanceof Request
      ? req.headers
      : ((req as NodeRequest).headers as Headers | Record<string, string | undefined>),
  );
  const limit = takeRateLimit(clientKey);
  Object.assign(headers, limit.headers);
  if (!limit.allowed) {
    headers["Cache-Control"] = "no-store";
    const body = JSON.stringify({
      _meta: { version: "0.55", response_type: "failure" },
      error: { code: "rate_limited", message: "Too many requests. Retry after the window resets." },
    });
    if (res) {
      for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
      res.status(429).end(body);
      return;
    }
    return new Response(body, { status: 429, headers });
  }

  const bodyJson = await readBody(req);
  if (bodyJson && typeof bodyJson === "object" && "__parseError" in (bodyJson as object)) {
    const body = JSON.stringify({
      _meta: { version: "0.55", response_type: "failure" },
      error: { code: "invalid_query", message: "POST body must be JSON." },
    });
    if (res) {
      for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
      res.status(400).end(body);
      return;
    }
    return new Response(body, { status: 400, headers });
  }

  const extracted = extractAskQuery({ params: paramsOf(req), body: bodyJson });
  const answer = extracted.error
    ? {
        status: 200,
        body: {
          _meta: { version: "0.55", response_type: "failure", response_format: "conversational_search" },
          error: { code: "invalid_query", message: extracted.error },
        },
      }
    : buildAskResponse(extracted.query);

  const serialized = method === "HEAD" ? null : JSON.stringify(answer.body);
  if (res) {
    for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
    res.status(answer.status).end(serialized ?? undefined);
    return;
  }
  return new Response(serialized, { status: answer.status, headers });
}

/** Default export for Netlify (Web Request) and Vercel (Node req/res). */
export default function handler(req: unknown, res?: unknown) {
  return handleAsk(req as Request | NodeRequest, res as NodeResponse | undefined);
}
