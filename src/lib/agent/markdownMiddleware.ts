/**
 * Request-time Markdown negotiation and API 404s for Vercel, as a Web `Request` handler.
 *
 * It first answers unknown `/api/` paths with a JSON 404. For GET and HEAD it then asks
 * `negotiateMarkdown` whether the client wants the page's Markdown twin. Anything else returns
 * undefined so the host continues to its static file or function.
 *
 * Connects to:
 * - Root `middleware.ts` (Vercel Routing Middleware), whose matcher limits it to `/api/*` and
 *   extensionless page paths. Netlify uses `netlify/edge-functions/markdown-negotiation.js` instead.
 * - Tested in `src/__tests__/agentSurfaces.test.ts` and `agentReadiness.test.ts`.
 * - Depends on `apiRoutes.ts` and `surfaces.ts`.
 */
import { unknownApiResponse } from "./apiRoutes";
import { MARKDOWN_HEADERS, negotiateMarkdown } from "./surfaces";

/**
 * Returns a JSON 404 for unknown API paths or a Markdown response for pages,
 * or undefined so the host serves its normal file or function.
 * The API check runs for every method; Markdown is served only for GET and HEAD (HEAD has no body).
 */
export function markdownMiddleware(request: Request): Response | undefined {
  const pathname = new URL(request.url).pathname;
  const apiMiss = unknownApiResponse(pathname);
  if (apiMiss) return apiMiss;
  if (request.method !== "GET" && request.method !== "HEAD") return undefined;
  const result = negotiateMarkdown(pathname, request.headers.get("accept") ?? undefined);
  if (!result) return undefined;
  return new Response(request.method === "HEAD" ? null : result.body, {
    status: result.status,
    headers: MARKDOWN_HEADERS,
  });
}
