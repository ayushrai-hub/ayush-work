/**
 * Netlify Edge Function: JSON 404s for unknown `/api` paths and Markdown content negotiation for pages.
 *
 * Unknown `/api/*` paths get a JSON `route_not_found` 404. For GET/HEAD page requests whose Accept
 * header gives `text/markdown` a higher quality than `text/html`, it fetches the deployed `<path>.md` twin (or
 * `/index.md` for `/`) and returns it as Markdown. With no twin, an existing HTML page (for example
 * `/design-system`) passes through unchanged; a 404 becomes a Markdown 404 from `/404.md`. Everything
 * else calls `context.next()`. The Accept-conditioned redirects in netlify.toml did not take effect on
 * the live host, which is why this function exists.
 *
 * Connects to:
 * - netlify.toml `[[edge_functions]]` binds it to `/*`. Vercel uses middleware.ts instead.
 * - Plain JS copy of negotiateMarkdown (src/lib/agent/surfaces.ts) and unknownApiResponse /
 *   isKnownApiPath (src/lib/agent/apiRoutes.ts), because the Deno edge runtime cannot import those
 *   TS sources. src/__tests__/agentReadiness.test.ts checks that API_ROUTES, isKnownApiPath, and
 *   wantsMarkdown match the TS versions and that misses return JSON.
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

/** Highest q `accept` gives to exactly `mediaType`, or 0. Wildcards are ignored; a bad q counts as 1. */
function acceptQuality(accept, mediaType) {
  let best = 0;
  for (const range of accept.toLowerCase().split(",")) {
    const [type, ...params] = range.split(";").map((part) => part.trim());
    if (type !== mediaType) continue;
    const q = params.find((param) => param.startsWith("q="));
    const value = q ? Number(q.slice(2)) : 1;
    best = Math.max(best, Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 1);
  }
  return best;
}

/** Same agent-bot tokens as `AGENT_BOT_UA` in src/lib/agent/surfaces.ts (test-enforced). */
const AGENT_BOT_UA =
  /(?:GPTBot|ClaudeBot|ChatGPT-User|PerplexityBot|Google-Extended|Applebot-Extended|ora-agent|DeepSeekBot)/i;

/**
 * Copy of wantsMarkdown in src/lib/agent/surfaces.ts: Markdown when Accept prefers it, or when a
 * known agent bot omits an HTML preference.
 */
export function wantsMarkdown(accept, userAgent) {
  if (accept) {
    const markdown = acceptQuality(accept, "text/markdown");
    if (markdown > 0 && markdown > acceptQuality(accept, "text/html")) return true;
  }
  if (!userAgent || !AGENT_BOT_UA.test(userAgent)) return false;
  if (!accept) return true;
  const html = acceptQuality(accept, "text/html");
  if (html === 0) return true;
  const markdown = acceptQuality(accept, "text/markdown");
  return markdown > 0 && markdown >= html;
}

/** True when the homepage was requested with `?mode=agent`. */
function wantsAgentMode(pathname, searchParams) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return (path === "/" || path === "") && searchParams.get("mode") === "agent";
}

/** Edge entry. `context.next()` continues to Netlify's redirects, static files, and functions. */
export default async function handler(request, context) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (pathname.startsWith("/api/") && !isKnownApiPath(pathname)) return apiNotFound(pathname);

  if (
    wantsAgentMode(pathname, url.searchParams) &&
    (request.method === "GET" || request.method === "HEAD")
  ) {
    const twin = await fetch(new URL("/agent-mode.json", url.origin));
    if (twin.ok) {
      return new Response(request.method === "HEAD" ? null : await twin.text(), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=300",
          "Access-Control-Allow-Origin": "*",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  }

  if (!wantsMarkdown(request.headers.get("accept"), request.headers.get("user-agent"))) {
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
