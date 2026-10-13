import { unknownApiResponse } from "./apiRoutes";
import { MARKDOWN_HEADERS, negotiateMarkdown } from "./surfaces";

/**
 * Returns a JSON 404 for unknown API paths or a Markdown response for pages,
 * or undefined so the host serves its normal file or function.
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
