/**
 * The JSON error contract shared by the REST API and the MCP HTTP endpoint.
 *
 * Every error body is `{ error: { code, message, hint, docs } }`. `code` is the stable value
 * clients branch on, `message` describes this request, and `hint` is a fixed sentence per code
 * that says how to fix the request.
 *
 * Connects to:
 * - `http.ts` (REST responses), `apiRoutes.ts` (JSON 404 for unknown `/api/` paths), and
 *   `mcpHttp.ts` (rate-limit and Server Card errors). `openapi.ts` lists `ApiErrorCode` values.
 * - `netlify/edge-functions/markdown-negotiation.js` hard-codes a copy of the `route_not_found` body.
 * - Depends on `src/content` (`person.siteUrl`) for the `docs` link.
 */
import { person } from "../../content";

/** Stable error codes. Adding one also needs a `HINTS` entry and the `ERROR_CODES` list in `openapi.ts`. */
export type ApiErrorCode =
  | "invalid_query"
  | "invalid_slug"
  | "invalid_filter"
  | "invalid_compare"
  | "invalid_cursor"
  | "not_found"
  | "route_not_found"
  | "method_not_allowed"
  | "rate_limited"
  | "idempotency_conflict"
  | "internal_error";

/** One fix-it sentence per code, copied into every error body as `hint`. */
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
  method_not_allowed: "Read routes accept GET, HEAD, and OPTIONS. POST /api/v1/batch runs a read batch. POST /api/mcp is MCP.",
  rate_limited: "Wait the number of seconds in Retry-After, then retry. The RateLimit header shows the remaining quota.",
  idempotency_conflict: "Reuse Idempotency-Key only with the same body, or send a new key for a different body.",
  internal_error: "The request was valid but the server failed. Retry once; if it keeps failing, report it to the contact on /developers/.",
};

/** Shape of every JSON error response. Matches the `ErrorResponse` schema in `openapi.ts`. */
export interface ApiErrorBody {
  error: { code: ApiErrorCode; message: string; hint: string; docs: string };
}

/** Builds an error body for `code`, adding its hint and a link to `/developers/`. Does not set a status. */
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
