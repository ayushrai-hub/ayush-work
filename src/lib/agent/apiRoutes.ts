/**
 * The list of deployed `/api/*` paths, and a JSON 404 for any other path under `/api/`.
 *
 * Without this, an unknown API path would fall through to the host's HTML 404 or SPA page.
 * The middleware checks the path first and answers with a `route_not_found` error body.
 *
 * Connects to:
 * - `markdownMiddleware.ts` (used by root `middleware.ts` on Vercel) calls `unknownApiResponse`.
 * - `netlify/edge-functions/markdown-negotiation.js` keeps its own copy for Netlify, because Deno
 *   cannot import this file; `src/__tests__/agentReadiness.test.ts` checks the two route lists match.
 * - Depends on `apiError.ts` for the error body.
 */
import { apiErrorBody } from "./apiError";

/** Every deployed `/api/*` path. Keep in sync with `netlify/edge-functions/markdown-negotiation.js`. */
export const API_ROUTES = [
  "/api/search",
  "/api/projects",
  "/api/v1/search",
  "/api/v1/projects",
  "/api/v1/compare",
  "/api/mcp",
  "/api/mcp/server-card",
  "/api/ask",
  "/api/send-email",
] as const;

/** `/api/v1/projects/{slug}`, the one parameterized API path. */
const PROJECT_DETAIL = /^\/api\/v1\/projects\/[^/]+$/;

/** True when `pathname`, ignoring one trailing slash, is a deployed API route. */
export function isKnownApiPath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return (API_ROUTES as readonly string[]).includes(path) || PROJECT_DETAIL.test(path);
}

/** JSON 404 for paths under `/api/` that no function serves; null for known routes and other paths. */
export function unknownApiResponse(pathname: string): Response | null {
  if (!pathname.startsWith("/api/") || isKnownApiPath(pathname)) return null;
  return new Response(
    JSON.stringify(apiErrorBody("route_not_found", `No API route at ${pathname}.`)),
    {
      status: 404,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
