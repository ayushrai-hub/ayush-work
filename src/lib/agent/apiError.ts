import { person } from "../../content";

export type ApiErrorCode =
  | "invalid_query"
  | "invalid_slug"
  | "invalid_filter"
  | "invalid_compare"
  | "invalid_cursor"
  | "not_found"
  | "route_not_found"
  | "method_not_allowed"
  | "rate_limited";

const HINTS: Record<ApiErrorCode, string> = {
  invalid_query: "Send q as plain text of at most 200 characters, or omit it for the default slice.",
  invalid_slug:
    "Use a slug from GET /api/v1/projects: lowercase letters, numbers, and single hyphens, such as overlay-text-box.",
  invalid_filter:
    "limit must be an integer from 1 to 20; type and category must be values listed in /openapi.json.",
  invalid_compare: "Pass two to four distinct slugs, for example /api/v1/compare?slugs=overlay-text-box,expert-o.",
  invalid_cursor: "Pass the nextCursor value from the previous response unchanged, or omit cursor to start again.",
  not_found: "List valid slugs with GET /api/v1/projects. Archived projects also need archive=1.",
  route_not_found: "This path is not an API endpoint. See /openapi.json or /.well-known/api-catalog for the endpoints.",
  method_not_allowed: "The read API accepts GET, HEAD, and OPTIONS. The MCP endpoint accepts POST.",
  rate_limited: "Wait the number of seconds in Retry-After, then retry. The RateLimit header shows the remaining quota.",
};

export interface ApiErrorBody {
  error: { code: ApiErrorCode; message: string; hint: string; docs: string };
}

export function apiErrorBody(code: ApiErrorCode, message: string): ApiErrorBody {
  return {
    error: {
      code,
      message,
      hint: HINTS[code],
      docs: `${person.siteUrl.replace(/\/$/, "")}/developers/`,
    },
  };
}
