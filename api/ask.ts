/**
 * Serverless entry for the NLWeb-shaped `/ask` endpoint (lexical portfolio search).
 *
 * Netlify Functions v2 pass a Web Request and expect a Web Response (second arg is context, not
 * Node `res`). Vercel may pass `(req, res)` Node shapes. Accepts GET and POST. Netlify routes
 * `/ask` here; Vercel rewrites `/ask` to `/api/ask`.
 *
 * Connects to:
 * - `src/lib/agent/nlwebAsk.ts` for the response body.
 * - `src/lib/agent/rateLimit.ts` for quotas. Host config: `netlify.toml`, `vercel.json`.
 */
import {
  ASK_STREAM_CONTENT_TYPE,
  askEventStream,
  buildAskResponse,
  extractAskQuery,
  wantsAskStream,
} from "../src/lib/agent/nlwebAsk";
import { clientKeyFrom, takeRateLimit } from "../src/lib/agent/rateLimit";
import { isSiteOrigin } from "../src/lib/siteOrigins";

/** Subset of a Vercel Node request this adapter reads. */
type NodeRequest = {
  method?: string;
  httpMethod?: string;
  url?: string;
  path?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
  queryStringParameters?: Record<string, string | undefined> | null;
};

/** Subset of a Vercel Node response this adapter writes to. */
type NodeResponse = {
  status: (code: number) => NodeResponse;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

/** True when the second host argument is a writable Node-style response (not Netlify context). */
function isNodeResponse(value: unknown): value is NodeResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<NodeResponse>;
  return typeof candidate.setHeader === "function" && typeof candidate.status === "function" && typeof candidate.end === "function";
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

/** Reads one header from a plain Node header record. */
function headerValue(headers: NodeRequest["headers"], name: string): string | undefined {
  if (!headers) return undefined;
  const value = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
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
    // ignore malformed URL
  }
  const bag = node.queryStringParameters || node.query || {};
  for (const [key, value] of Object.entries(bag)) {
    if (typeof value === "string" && !params.has(key)) params.set(key, value);
  }
  return params;
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

/** Core ask logic returning a Web Response (hosts adapt as needed). */
async function askResponse(req: Request | NodeRequest): Promise<Response> {
  const method = (
    typeof Request !== "undefined" && req instanceof Request
      ? req.method
      : (req as NodeRequest).method || (req as NodeRequest).httpMethod || "GET"
  ).toUpperCase();
  const origin =
    typeof Request !== "undefined" && req instanceof Request
      ? req.headers.get("origin")
      : headerValue((req as NodeRequest).headers, "origin");
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "private, max-age=60",
    ...cors(origin),
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (method !== "GET" && method !== "HEAD" && method !== "POST") {
    return new Response(
      JSON.stringify({
        _meta: { version: "0.55", response_type: "failure" },
        error: { code: "method_not_allowed", message: "Use GET, HEAD, or POST." },
      }),
      { status: 405, headers },
    );
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
    return new Response(
      JSON.stringify({
        _meta: { version: "0.55", response_type: "failure" },
        error: { code: "rate_limited", message: "Too many requests. Retry after the window resets." },
      }),
      { status: 429, headers },
    );
  }

  const bodyJson = await readBody(req);
  if (bodyJson && typeof bodyJson === "object" && "__parseError" in (bodyJson as object)) {
    return new Response(
      JSON.stringify({
        _meta: { version: "0.55", response_type: "failure" },
        error: { code: "invalid_query", message: "POST body must be JSON." },
      }),
      { status: 400, headers },
    );
  }

  const params = paramsOf(req);
  const extracted = extractAskQuery({ params, body: bodyJson });
  const answer = extracted.error
    ? {
        status: 200,
        body: {
          _meta: { version: "0.55", response_type: "failure", response_format: "conversational_search" },
          error: { code: "invalid_query", message: extracted.error },
        },
      }
    : buildAskResponse(extracted.query);

  const accept =
    typeof Request !== "undefined" && req instanceof Request
      ? req.headers.get("accept")
      : headerValue((req as NodeRequest).headers, "accept");
  if (wantsAskStream({ params, body: bodyJson, accept })) {
    headers["Content-Type"] = ASK_STREAM_CONTENT_TYPE;
    headers["Cache-Control"] = "no-store";
    return new Response(method === "HEAD" ? null : askEventStream(answer.body), {
      status: answer.status,
      headers,
    });
  }

  return new Response(method === "HEAD" ? null : JSON.stringify(answer.body), {
    status: answer.status,
    headers,
  });
}

/**
 * Netlify: Web Request → Web Response (ignore context second arg).
 * Vercel Node: rebuild via askResponse and write onto `res`.
 */
export default async function handler(request: unknown, response?: unknown) {
  if (typeof Request !== "undefined" && request instanceof Request) {
    return askResponse(request);
  }

  const result = await askResponse(request as NodeRequest);
  if (isNodeResponse(response)) {
    result.headers.forEach((value, key) => response.setHeader(key, value));
    response.status(result.status).end(await result.text());
    return;
  }
  return result;
}
