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
  "/api/send-email",
] as const;

const PROJECT_DETAIL = /^\/api\/v1\/projects\/[^/]+$/;

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
