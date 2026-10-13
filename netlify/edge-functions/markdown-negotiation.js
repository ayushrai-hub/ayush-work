/**
 * Production content negotiation. Netlify redirect Accept conditions did not
 * fire on the live host (the homepage still returned HTML). This runs only
 * when the client asks for Markdown and does not also ask for HTML.
 * Mirrors negotiateMarkdown in src/lib/agent/surfaces.ts and unknownApiResponse in
 * src/lib/agent/apiRoutes.ts, which Deno cannot import. Tests compare the two.
 */
const MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "X-Content-Type-Options": "nosniff",
};

const NON_PAGE_PREFIXES = ["/api/", "/.netlify/", "/.well-known/", "/assets/"];

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

export function isKnownApiPath(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return API_ROUTES.includes(path) || PROJECT_DETAIL.test(path);
}

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

function markdown(request, body, status) {
  return new Response(request.method === "HEAD" ? null : body, {
    status,
    headers: MARKDOWN_HEADERS,
  });
}

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
