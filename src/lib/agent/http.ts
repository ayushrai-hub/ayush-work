import { comparePublicProjects, getPublicProject, listPublicProjects } from "./projectsQuery";
import { searchPayload } from "./search";
import {
  parseLimit,
  validateProjectCategory,
  validateProjectType,
  validateQuery,
  validateSearchType,
  validateSlug,
  type FieldError,
} from "./validate";

export interface AgentHttpResult {
  status: number;
  body: unknown;
}

const ALLOWED_ORIGINS = new Set([
  "https://www.ayushrai.site",
  "https://ayushrai.site",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
]);

export function corsHeaders(origin?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    Vary: "Origin",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function apiError(status: number, error: FieldError | { code: string; message: string }): AgentHttpResult {
  return { status, body: { error: { code: error.code, message: error.message } } };
}

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
  const listed = listPublicProjects({
    category: params.get("category") || undefined,
    type: params.get("type") || undefined,
    limit: parsed.limit,
    includeArchive,
  });
  return { status: 200, body: { projects: listed, count: listed.length } };
}

export function dispatchAgentApi(
  pathname: string,
  method: string,
  params: URLSearchParams,
): AgentHttpResult {
  if (method === "OPTIONS") return { status: 204, body: null };
  if (method !== "GET" && method !== "HEAD") {
    return apiError(405, { code: "method_not_allowed", message: "Only GET, HEAD, and OPTIONS are allowed." });
  }
  if (pathname === "/api/search") {
    const queryError = validateQuery(params.get("q"));
    if (queryError) return apiError(400, queryError);
    const typeError = validateSearchType(params.get("type"));
    if (typeError) return apiError(400, typeError);
    const parsed = parseLimit(params.get("limit"));
    if (parsed.error) return apiError(400, parsed.error);
    return {
      status: 200,
      body: searchPayload(params.get("q") ?? "", {
        type: params.get("type") || undefined,
        limit: parsed.limit,
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
  return apiError(404, { code: "not_found", message: "No API route at this path." });
}

type NodeLikeRequest = {
  method?: string;
  httpMethod?: string;
  url?: string;
  path?: string;
  query?: Record<string, string | string[] | undefined>;
  queryStringParameters?: Record<string, string | undefined> | null;
  headers?: Record<string, string | undefined>;
};

type NodeLikeResponse = {
  status: (code: number) => NodeLikeResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  end: (body?: string) => void;
};

function headerValue(req: NodeLikeRequest, name: string): string | undefined {
  const headers = req.headers as
    | (Record<string, string | undefined> & { get?: (key: string) => string | null })
    | undefined;
  if (!headers) return undefined;
  if (typeof headers.get === "function") return headers.get(name) ?? undefined;
  return headers[name] || headers[name.toLowerCase()];
}

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

/** Shared adapter for Vercel's (req, res) and Netlify's Web Response runtime. */
export async function handleAgentRequest(
  req: NodeLikeRequest,
  res: NodeLikeResponse | undefined,
  route: "/api/search" | "/api/projects",
) {
  const method = (req.method || req.httpMethod || "GET").toUpperCase();
  const result = dispatchAgentApi(routeFromRequest(req, route), method, queryParams(req, route));
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=300",
    ...corsHeaders(headerValue(req, "origin")),
  };
  if (res && typeof res.status === "function") {
    for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
    if (method === "HEAD" || result.status === 204) {
      res.status(result.status).end();
      return;
    }
    res.status(result.status).json(result.body);
    return;
  }
  const body =
    method === "HEAD" || result.status === 204 || result.body == null
      ? null
      : JSON.stringify(result.body);
  return new Response(body, { status: result.status, headers });
}
