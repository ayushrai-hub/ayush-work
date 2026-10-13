/**
 * Vercel Routing Middleware: JSON 404s for unknown `/api` paths and Markdown content negotiation.
 *
 * Runs before Vercel serves static files or functions. markdownMiddleware returns a JSON
 * `route_not_found` 404 for any `/api/*` path that is not a known route, serves the page's Markdown
 * twin when the client sends `Accept: text/markdown` without `text/html`, and otherwise returns
 * undefined so Vercel continues with its normal file or function.
 *
 * Connects to:
 * - Vercel only. Netlify uses netlify/edge-functions/markdown-negotiation.js for the same behavior.
 * - src/lib/agent/markdownMiddleware.ts, which uses src/lib/agent/apiRoutes.ts and src/lib/agent/surfaces.ts.
 */
import { markdownMiddleware } from "./src/lib/agent/markdownMiddleware";

/**
 * Matches every `/api` path, plus page paths that are not under `api/`, `_vercel/`, or `assets/`
 * and do not end in a file extension (so `.md`, `.json`, and asset files skip the middleware).
 */
export const config = {
  matcher: ["/api/:path*", "/((?!api/|_vercel/|assets/|.*\\.[A-Za-z0-9]+$).*)"],
};

/** Middleware entry; returning undefined passes the request through unchanged. */
export default function middleware(request: Request): Response | undefined {
  return markdownMiddleware(request);
}
