/**
 * Vercel Routing Middleware: JSON 404s for unknown `/api` paths, `/?mode=agent`, and Markdown negotiation.
 *
 * Self-contained with zero internal imports so Vercel's Edge runtime compiler (`node16` / `nodenext`
 * without relative `.js` rewriting) compiles this file in isolation without TS2835/TS2834 or bundling
 * the 21,000-line content tree into a V8 isolate. For `/?mode=agent` and Markdown negotiation, it
 * rewrites to the prerendered static files (`/agent-mode.json`, `/index.md`, `<path>.md`, `/404.md`)
 * via `x-middleware-rewrite` or fetches them from the deployment origin when needed.
 *
 * Connects to:
 * - Vercel only. Netlify uses `netlify/edge-functions/markdown-negotiation.js` for the same behavior.
 * - Route list and `wantsMarkdown` rule match `src/lib/agent/apiRoutes.ts` and `src/lib/agent/surfaces.ts`.
 */

/**
 * Matches every `/api` path, plus page paths that are not under `api/`, `_vercel/`, `assets/`, or `images/`
 * and do not end in a file extension (so `.md`, `.json`, and asset files skip the middleware).
 */
export const config = {
  matcher: ["/api/:path*", "/((?!api/|_vercel/|assets/|images/|.*\\.[A-Za-z0-9]+$).*)"],
};

const MARKDOWN_HEADERS: Record<string, string> = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept, User-Agent",
  "X-Content-Type-Options": "nosniff",
};

const NON_PAGE_PREFIXES = ["/api/", "/_vercel/", "/.netlify/", "/.well-known/", "/assets/", "/images/"];

const API_ROUTES = [
  "/api/search",
  "/api/projects",
  "/api/v1/search",
  "/api/v1/projects",
  "/api/v1/compare",
  "/api/mcp",
  "/api/mcp/server-card",
  "/api/mcp/docs",
  "/api/mcp/docs/server-card",
  "/api/v1/batch",
  "/api/v1/jobs",
  "/api/a2a",
  "/api/sandbox/v1/search",
  "/api/sandbox/v1/projects",
  "/api/sandbox/v1/compare",
  "/api/ask",
  "/api/send-email",
];

const PROJECT_DETAIL = /^\/api\/(?:sandbox\/)?v1\/projects\/[^/]+$/;
const JOB_DETAIL = /^\/api\/v1\/jobs\/[^/]+$/;

const FALLBACK_NOT_FOUND = [
  "# Page not found",
  "",
  "There is no page at this address on https://www.ayushrai.site/. It may have moved, or it never existed.",
  "",
  "Start here instead:",
  "",
  "- Index of every page: https://www.ayushrai.site/llms.txt",
  "- Sitemap: https://www.ayushrai.site/sitemap.xml",
  "- Agent guide: https://www.ayushrai.site/AGENTS.md",
  "- Developer notes and API: https://www.ayushrai.site/developers",
  "- Search: https://www.ayushrai.site/api/search?q=",
  "",
].join("\n");

/** True when `pathname`, ignoring one trailing slash, is a deployed API route. */
function isKnownApiPath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return API_ROUTES.includes(path) || PROJECT_DETAIL.test(path) || JOB_DETAIL.test(path);
}

/** JSON `route_not_found` 404 in the shared API error shape. */
function apiNotFound(pathname: string): Response {
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

/** Highest quality value `accept` gives to `mediaType`, or 0. */
function acceptQuality(accept: string, mediaType: string): number {
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

const AGENT_BOT_UA =
  /(?:GPTBot|ClaudeBot|ChatGPT-User|PerplexityBot|Google-Extended|Applebot-Extended|ora-agent|DeepSeekBot)/i;

/** True when `Accept` prefers `text/markdown` over `text/html`, or for known agent crawlers. */
function wantsMarkdown(accept: string | null, userAgent: string | null): boolean {
  if (accept) {
    const markdown = acceptQuality(accept, "text/markdown");
    if (markdown > 0 && markdown > acceptQuality(accept, "text/html")) return true;
  }
  return Boolean(userAgent && AGENT_BOT_UA.test(userAgent));
}

/** True when the homepage was requested with `?mode=agent`. */
function wantsAgentMode(pathname: string, searchParams: URLSearchParams): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return (path === "/" || path === "") && searchParams.get("mode") === "agent";
}

/** Middleware entry; returning undefined passes the request through unchanged to static HTML or `/api` functions. */
export default async function middleware(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname.startsWith("/api/")) {
    if (!isKnownApiPath(pathname)) return apiNotFound(pathname);
    return undefined;
  }

  if (request.method !== "GET" && request.method !== "HEAD") return undefined;

  if (wantsAgentMode(pathname, url.searchParams)) {
    const targetUrl = new URL("/agent-mode.json", url.origin);
    const res = await fetch(targetUrl);
    if (res.ok) {
      return new Response(request.method === "HEAD" ? null : await res.text(), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=300",
          "Access-Control-Allow-Origin": "*",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
    return undefined;
  }

  if (!wantsMarkdown(request.headers.get("accept"), request.headers.get("user-agent"))) {
    return undefined;
  }

  if (NON_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return undefined;
  if (/\.[a-z0-9]+$/i.test(pathname)) return undefined;

  let path = pathname;
  try {
    path = decodeURIComponent(path);
  } catch {
    return new Response(request.method === "HEAD" ? null : FALLBACK_NOT_FOUND, {
      status: 404,
      headers: MARKDOWN_HEADERS,
    });
  }
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (path === "/design-system") return undefined;

  const target = path === "/" || path === "" ? "/index.md" : `${path}.md`;
  const twin = await fetch(new URL(target, url.origin));
  if (twin.ok) {
    return new Response(request.method === "HEAD" ? null : await twin.text(), {
      status: 200,
      headers: MARKDOWN_HEADERS,
    });
  }

  const notFound = await fetch(new URL("/404.md", url.origin));
  const body = notFound.ok ? await notFound.text() : FALLBACK_NOT_FOUND;
  return new Response(request.method === "HEAD" ? null : body, {
    status: 404,
    headers: MARKDOWN_HEADERS,
  });
}
