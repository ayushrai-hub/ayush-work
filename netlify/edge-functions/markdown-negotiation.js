/**
 * Netlify Edge Function: JSON 404s for unknown `/api` paths and Markdown content negotiation for pages.
 *
 * Unknown `/api/*` paths get a JSON `route_not_found` 404. For GET/HEAD page requests whose Accept
 * header includes `text/markdown` but not `text/html`, it fetches the deployed `<path>.md` twin (or
 * `/index.md` for `/`) and returns it as Markdown. With no twin, an existing HTML page (for example
 * `/design-system`) passes through unchanged; a 404 becomes a Markdown 404 from `/404.md`. Everything
 * else calls `context.next()`. The Accept-conditioned redirects in netlify.toml did not take effect on
 * the live host, which is why this function exists.
 *
 * Connects to:
 * - netlify.toml `[[edge_functions]]` binds it to `/*`. Vercel uses middleware.ts instead.
 * - Plain JS copy of negotiateMarkdown (src/lib/agent/surfaces.ts) and unknownApiResponse /
 *   isKnownApiPath (src/lib/agent/apiRoutes.ts), because the Deno edge runtime cannot import those
 *   TS sources. src/__tests__/agentReadiness.test.ts checks that API_ROUTES and isKnownApiPath match
 *   the TS versions and that misses return JSON; the Markdown branch is not compared.
 */
const MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "X-Content-Type-Options": "nosniff",
};

const NON_PAGE_PREFIXES = ["/api/", "/.netlify/", "/.well-known/", "/assets/"];

/** Known API paths. Must stay identical to API_ROUTES in src/lib/agent/apiRoutes.ts (test-enforced). */
export const API_ROUTES = [
  "/api/search",
  "/api/projects",
  "/api/v1/search",
  "/api/v1/projects",
  "/api/v1/compare",
  "/api/mcp",
  "/api/mcp/server-card",
  "/api/send-email",
];

const PROJECT_DETAIL = /^\/api\/v1\/projects\/[^/]+$/;

const FALLBACK_NOT_FOUND =
  "# Page not found\n\nThere is no page at this address. See https://www.ayushrai.site/llms.txt for every page.\n";

/** True for a listed API route or `/api/v1/projects/{slug}`; one trailing slash is ignored. */
export function isKnownApiPath(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return API_ROUTES.includes(path) || PROJECT_DETAIL.test(path);
}

/** JSON `route_not_found` 404 in the shared API error shape (`{ error: { code, message, hint, docs } }`). */
function apiNotFound(pathname) {
  const body = {
    error: {
      code: "route_not_found",
      message: `No API route at ${pathname}.`,
      hint: "This path is not an API endpoint. See /openapi.json or /.well-known/api-catalog for the endpoints.",
      docs: "https://www.ayushrai.site/developers/",
    },
  };
  return new Response(JSON.stringify(body), {
    status: 404,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** Markdown response with the twin headers; HEAD requests get headers only. */
function markdown(request, body, status) {
  return new Response(request.method === "HEAD" ? null : body, {
    status,
    headers: MARKDOWN_HEADERS,
  });
}

/** Edge entry. `context.next()` continues to Netlify's redirects, static files, and functions. */
export default async function handler(request, context) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (pathname.startsWith("/api/") && !isKnownApiPath(pathname)) return apiNotFound(pathname);

  const accept = (request.headers.get("accept") ?? "").toLowerCase();
  if (!accept.includes("text/markdown") || accept.includes("text/html")) {
    return context.next();
  }
  if (request.method !== "GET" && request.method !== "HEAD") return context.next();

  if (NON_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return context.next();
  }
  if (/\.[a-z0-9]+$/i.test(pathname)) return context.next();

  let path = pathname;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  const target = path === "/" || path === "" ? "/index.md" : `${path}.md`;

  const twin = await fetch(new URL(target, url.origin));
  if (twin.ok) return markdown(request, await twin.text(), 200);

  // No twin. A real HTML page without one (for example /design-system) stays HTML.
  const page = await context.next();
  if (page.status !== 404) return page;

  const notFound = await fetch(new URL("/404.md", url.origin));
  const body = notFound.ok ? await notFound.text() : FALLBACK_NOT_FOUND;
  return markdown(request, body, 404);
}
