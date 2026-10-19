/**
 * The read-only REST API: request routing, validation, rate limiting, and host adapters.
 *
 * `dispatchAgentApi` maps a path, method, and query to a status and JSON body without touching
 * HTTP objects. `agentApiResponse` adds CORS, caching, rate-limit headers, and serialization.
 * `handleAgentRequest` adapts that to Vercel's Node `(req, res)` handlers and to Netlify's
 * Web `Request` functions.
 *
 * Connects to:
 * - `api/search.ts` and `api/projects.ts` call `handleAgentRequest`. `netlify.toml` and `vercel.json`
 *   rewrite `/api/v1/*` onto those two functions.
 * - `vitePlugin.ts` calls `agentApiResponse` for `/api/*` in dev and preview.
 * - Depends on `search.ts`, `projectsQuery.ts`, `validate.ts`, `pagination.ts`, `rateLimit.ts`,
 *   `apiError.ts`, and `../siteOrigins.ts` (the CORS allow-list).
 */
import { apiErrorBody, type ApiErrorCode } from "./apiError";
import { runReadBatch } from "./batch";
import { decodeCursor } from "./pagination";
import { comparePublicProjects, getPublicProject, pagePublicProjects } from "./projectsQuery";
import {
  clientKeyFrom,
  RATE_LIMIT_EXPOSED_HEADERS,
  RATE_LIMIT_QUOTA,
  RATE_LIMIT_WINDOW_SECONDS,
  takeRateLimit,
} from "./rateLimit";
import { searchPayload } from "./search";
import { isSiteOrigin } from "../siteOrigins";
import {
  parseLimit,
  validateProjectCategory,
  validateProjectType,
  validateQuery,
  validateSearchType,
  validateSlug,
  type FieldError,
} from "./validate";

/** Status and unserialized JSON body of one API call, before headers are added. */
export interface AgentHttpResult {
  status: number;
  body: unknown;
  /** Extra headers, such as Idempotent-Replayed on a stored batch response. */
  headers?: Record<string, string>;
}

/**
 * CORS headers for a REST response. Echoes `origin` only when it is one of the site's own origins
 * (`SITE_ORIGINS`); other browser origins get no grant. Server-side clients are unaffected.
 */
export function corsHeaders(origin?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Idempotency-Key",
    "Access-Control-Expose-Headers": RATE_LIMIT_EXPOSED_HEADERS,
    Vary: "Origin",
  };
  if (isSiteOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

/** Wraps a validation or routing error in the shared JSON error body with the given status. */
function apiError(
  status: number,
  error: FieldError | { code: ApiErrorCode; message: string },
): AgentHttpResult {
  return { status, body: apiErrorBody(error.code, error.message) };
}

/**
 * Handles every projects request: compare, one project, or a filtered page.
 * `compare` (or `slugs` when no path slug is given) selects comparison; `pathSlug` from
 * `/api/v1/projects/{slug}` or `?slug=` selects one project; otherwise it lists with
 * `category`, `type`, `limit`, `cursor`, and `archive=1`.
 */
export function projectsHttp(params: URLSearchParams, pathSlug?: string): AgentHttpResult {
  const includeArchive = params.get("archive") === "1";
  const compare = params.get("compare") ?? (pathSlug ? null : params.get("slugs"));
  if (compare !== null) {
    const result = comparePublicProjects(compare.split(","), { includeArchive });
    if (!result.ok) return apiError(400, result);
    return { status: 200, body: { projects: result.projects, missing: result.missing } };
  }
  const slug = pathSlug ?? params.get("slug");
  if (slug) {
    const invalid = validateSlug(slug);
    if (invalid) return apiError(400, invalid);
    const project = getPublicProject(slug, { includeArchive });
    if (!project) {
      return apiError(404, {
        code: "not_found",
        message: `No public project with slug "${slug}".`,
      });
    }
    return { status: 200, body: { project } };
  }
  const categoryError = validateProjectCategory(params.get("category"));
  if (categoryError) return apiError(400, categoryError);
  const typeError = validateProjectType(params.get("type"));
  if (typeError) return apiError(400, typeError);
  const parsed = parseLimit(params.get("limit"));
  if (parsed.error) return apiError(400, parsed.error);
  const cursor = decodeCursor(params.get("cursor"));
  if (cursor.error) return apiError(400, cursor.error);
  const page = pagePublicProjects({
    category: params.get("category") || undefined,
    type: params.get("type") || undefined,
    limit: parsed.limit,
    includeArchive,
    offset: cursor.offset,
  });
  return {
    status: 200,
    body: { projects: page.items, count: page.items.length, nextCursor: page.nextCursor },
  };
}

/**
 * Routes one API call by path and method. OPTIONS returns 204. POST is accepted only for
 * `/api/v1/batch`. Other methods return 405, and unknown paths return 404 `route_not_found`.
 * No rate limiting or headers here; `agentApiResponse` adds those. `body` and `idempotencyKey`
 * apply to the batch route.
 */
export function dispatchAgentApi(
  pathname: string,
  method: string,
  params: URLSearchParams,
  body?: unknown,
  idempotencyKey?: string | null,
): AgentHttpResult {
  if (method === "OPTIONS") return { status: 204, body: null };
  if (method === "POST" && pathname === "/api/v1/batch") {
    return runReadBatch(body, idempotencyKey, (path, query) => dispatchAgentApi(path, "GET", query));
  }
  if (method !== "GET" && method !== "HEAD") {
    return apiError(405, { code: "method_not_allowed", message: "Only GET, HEAD, OPTIONS, and POST /api/v1/batch are allowed." });
  }
  if (pathname === "/api/search" || pathname === "/api/v1/search") {
    const queryError = validateQuery(params.get("q"));
    if (queryError) return apiError(400, queryError);
    const typeError = validateSearchType(params.get("type"));
    if (typeError) return apiError(400, typeError);
    const parsed = parseLimit(params.get("limit"));
    if (parsed.error) return apiError(400, parsed.error);
    const cursor = decodeCursor(params.get("cursor"));
    if (cursor.error) return apiError(400, cursor.error);
    return {
      status: 200,
      body: searchPayload(params.get("q") ?? "", {
        type: params.get("type") || undefined,
        limit: parsed.limit,
        offset: cursor.offset,
      }),
    };
  }
  if (pathname === "/api/v1/compare") {
    const slugs = params.get("slugs") ?? params.get("compare");
    if (!slugs) {
      return apiError(400, {
        code: "invalid_compare",
        message: "Provide slugs as a comma-separated list.",
      });
    }
    return projectsHttp(new URLSearchParams({ compare: slugs, archive: params.get("archive") ?? "" }));
  }
  if (pathname === "/api/projects" || pathname === "/api/v1/projects") {
    return projectsHttp(params);
  }
  const detail = pathname.match(/^\/api\/v1\/projects\/([^/]+)$/);
  if (detail) return projectsHttp(params, decodeURIComponent(detail[1]));
  return apiError(404, { code: "route_not_found", message: `No API route at ${pathname}.` });
}

/**
 * The request fields read from either host: a Vercel Node request (`url`, `query`, header record)
 * or a Netlify Web `Request` (`url`, `Headers`). `httpMethod`, `path`, and
 * `queryStringParameters` cover the older Lambda-style event shape.
 */
type NodeLikeRequest = {
  method?: string;
  httpMethod?: string;
  url?: string;
  path?: string;
  query?: Record<string, string | string[] | undefined>;
  queryStringParameters?: Record<string, string | undefined> | null;
  headers?: Record<string, string | undefined>;
};

/** The subset of Vercel's Node response used to write the result. */
type NodeLikeResponse = {
  status: (code: number) => NodeLikeResponse;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

/** Reads one header from either a `Headers` object or a plain record (exact or lowercase key). */
function headerValue(req: NodeLikeRequest, name: string): string | undefined {
  const headers = req.headers as
    | (Record<string, string | undefined> & { get?: (key: string) => string | null })
    | undefined;
  if (!headers) return undefined;
  if (typeof headers.get === "function") return headers.get(name) ?? undefined;
  return headers[name] || headers[name.toLowerCase()];
}

/**
 * Query parameters from the request URL, then any missing keys from the host's parsed query
 * object. The URL wins when both have a key; only string values are copied from the object.
 */
function queryParams(req: NodeLikeRequest, route: string): URLSearchParams {
  const params = new URLSearchParams();
  const rawUrl = req.url || req.path || route;
  try {
    const url = new URL(rawUrl, "https://www.ayushrai.site");
    url.searchParams.forEach((value, key) => params.set(key, value));
  } catch {
    // Relative function paths still expose query bags below.
  }
  const bag = req.queryStringParameters || req.query || {};
  for (const [key, value] of Object.entries(bag)) {
    if (typeof value === "string" && !params.has(key)) params.set(key, value);
  }
  return params;
}

/**
 * The `/api/...` path the client requested, so versioned routes dispatch correctly. When the
 * host passes a rewritten path outside `/api/` (such as `/.netlify/functions/projects`), it falls
 * back to the function's own route.
 */
function routeFromRequest(req: NodeLikeRequest, fallback: "/api/search" | "/api/projects") {
  const raw = req.url || req.path || "";
  try {
    const url = new URL(raw, "https://www.ayushrai.site");
    const path = url.pathname.replace(/\/$/, "") || "/";
    if (path.startsWith("/api/")) return path;
  } catch {
    // Fall back to the function's own route.
  }
  return fallback;
}

/**
 * `dispatchAgentApi`, with any thrown error turned into a 500 `internal_error` envelope. The
 * message is generic so stack traces and file paths never reach the client.
 */
export function safeDispatch(
  pathname: string,
  method: string,
  params: URLSearchParams,
  body?: unknown,
  idempotencyKey?: string | null,
): AgentHttpResult {
  try {
    return dispatchAgentApi(pathname, method, params, body, idempotencyKey);
  } catch (error) {
    console.error("agent API failure", pathname, error instanceof Error ? error.name : typeof error);
    return apiError(500, { code: "internal_error", message: "Unexpected server error." });
  }
}

/** A complete REST response. `body` is null for HEAD, 204, and empty results. */
export interface AgentApiResponse {
  status: number;
  headers: Record<string, string>;
  body: string | null;
}

/**
 * Status, headers, and serialized body for one REST call, rate limit included.
 * Every method except OPTIONS counts against the client's quota; over the quota it returns 429
 * `rate_limited` with `Retry-After` and `no-store`. `clientKey` is usually from `clientKeyFrom`.
 * Responses are `private` so a shared cache never replays another client's RateLimit values.
 */
/** True when this call is the sandbox alias of the public read API. */
function isSandboxRequest(pathname: string, params: URLSearchParams): boolean {
  return pathname.startsWith("/api/sandbox/") || params.get("environment") === "sandbox";
}

/**
 * Maps `/api/sandbox/v1/...` onto `/api/v1/...`. The records are the same public records.
 * A non-sandbox path is returned unchanged.
 */
export function logicalApiPath(pathname: string): string {
  const prefix = "/api/sandbox";
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
    return `/api${pathname.slice(prefix.length)}`;
  }
  return pathname;
}

export function agentApiResponse(input: {
  pathname: string;
  method: string;
  params: URLSearchParams;
  origin?: string | null;
  clientKey: string;
  body?: unknown;
  idempotencyKey?: string | null;
}): AgentApiResponse {
  const method = input.method.toUpperCase();
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "private, max-age=300",
    ...corsHeaders(input.origin),
  };
  if (isSandboxRequest(input.pathname, input.params)) headers["X-Api-Environment"] = "sandbox";
  const pathname = logicalApiPath(input.pathname);
  let result: AgentHttpResult;
  if (method === "OPTIONS") {
    result = { status: 204, body: null };
  } else {
    const limit = takeRateLimit(input.clientKey);
    Object.assign(headers, limit.headers);
    if (limit.allowed) {
      result = safeDispatch(pathname, method, input.params, input.body, input.idempotencyKey);
    } else {
      result = apiError(429, {
        code: "rate_limited",
        message: `More than ${RATE_LIMIT_QUOTA} requests in ${RATE_LIMIT_WINDOW_SECONDS} seconds.`,
      });
    }
    if (!limit.allowed || result.status >= 500) headers["Cache-Control"] = "no-store";
    if (result.headers) Object.assign(headers, result.headers);
  }
  const body =
    method === "HEAD" || result.status === 204 || result.body == null
      ? null
      : JSON.stringify(result.body);
  return { status: result.status, headers, body };
}

/**
 * Shared adapter for Vercel's (req, res) and Netlify's Web Response runtime.
 * With a Node response object it writes headers and body and returns undefined; without one it
 * returns a Web `Response`. `route` is the calling function's own path, used when the request
 * URL does not show an `/api/` path.
 */
export async function handleAgentRequest(
  req: NodeLikeRequest,
  res: NodeLikeResponse | undefined,
  route: "/api/search" | "/api/projects",
) {
  const response = agentApiResponse({
    pathname: routeFromRequest(req, route),
    method: req.method || req.httpMethod || "GET",
    params: queryParams(req, route),
    origin: headerValue(req, "origin"),
    clientKey: clientKeyFrom(req.headers as Headers | Record<string, string | undefined>),
  });
  if (res && typeof res.status === "function") {
    for (const [key, value] of Object.entries(response.headers)) res.setHeader(key, value);
    res.status(response.status).end(response.body ?? undefined);
    return;
  }
  return new Response(response.body, { status: response.status, headers: response.headers });
}
