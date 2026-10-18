/**
 * The set of generated agent files, and the rule for when a page request gets Markdown.
 *
 * `agentFiles()` maps output file names to contents: `llms.txt` and section indexes, `llms-full.txt`,
 * `openapi.json`, `404.md`, `auth.md`, `pricing.md`, the Schema Map and feed, the `.well-known`
 * discovery documents, and one `.md` twin per page. `negotiateMarkdown`
 * decides, for an extensionless page path, whether to answer with the twin, a Markdown 404, or
 * the normal HTML.
 *
 * Connects to:
 * - `vitePlugin.ts` emits `agentFiles()` into the build and serves both functions in dev and preview.
 * - `markdownMiddleware.ts` (Vercel root `middleware.ts`) calls `negotiateMarkdown`.
 *   `netlify/edge-functions/markdown-negotiation.js` reimplements the same rule for Netlify.
 * - Depends on `markdown.ts`, `apiCatalog.ts`, `mcpCard.ts`, `openapi.ts`, and `prerenderRoutes()`
 *   in `src/lib/publicRoutes.ts`.
 */
import { prerenderRoutes } from "../publicRoutes";
import { agentModeJson } from "./agentMode";
import { API_CATALOG_PATH, buildApiCatalog } from "./apiCatalog";
import { renderAuthMarkdown } from "./authDocs";
import {
  AI_CATALOG_PATH,
  ARD_PATH,
  buildAiCatalog,
  buildArdManifest,
  LEGACY_SERVER_CARD_PATH,
  serverCardJson,
} from "./mcpCard";
import { buildOpenApiDocument } from "./openapi";
import { renderPricingMarkdown } from "./pricingDocs";
import { renderSchemaFeed, renderSchemaMap, SCHEMA_FEED_PATH, SCHEMA_MAP_PATH } from "./schemaFeed";
import {
  listAgentPages,
  markdownPublicPath,
  renderDevelopersLlmsTxt,
  renderLlmsFull,
  renderLlmsTxt,
  renderNotFoundMarkdown,
  renderPageMarkdown,
  renderProductsLlmsTxt,
  renderWorkLlmsTxt,
  sitePathFromRequest,
} from "./markdown";

/**
 * Headers for every negotiated Markdown response. `Vary: Accept, User-Agent` keeps caches from
 * mixing HTML and Markdown, since both the Accept header and agent-bot User-Agents select the twin.
 */
export const MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept, User-Agent",
  "X-Content-Type-Options": "nosniff",
} as const;

/**
 * Highest quality value `accept` gives to exactly `mediaType`, or 0 when it is absent.
 * Wildcards are ignored so `*\/*` never selects Markdown. A missing or malformed q counts as 1.
 */
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

/**
 * User-Agent tokens used by common AI crawlers and the ora scanner. These clients receive the
 * Markdown twin of a page whatever their Accept header says, including `text/html`; the twin is
 * the same public content. Search crawlers such as Googlebot are not listed and keep HTML.
 * Ordinary browsers keep the Accept-only rule below.
 */
export const AGENT_BOT_UA =
  /(?:GPTBot|ClaudeBot|ChatGPT-User|PerplexityBot|Google-Extended|Applebot-Extended|ora-agent|DeepSeekBot)/i;

/** True when `userAgent` matches a known agent crawler. */
export function isAgentBotUserAgent(userAgent: string | undefined): boolean {
  return Boolean(userAgent && AGENT_BOT_UA.test(userAgent));
}

/**
 * True when `Accept` gives `text/markdown` a positive quality strictly above `text/html`.
 * Browsers list `text/html` at q=1 on page loads, so they keep getting HTML; a tie also stays
 * HTML. Known agent bots always get Markdown (test-enforced with the Netlify edge copy).
 */
export function wantsMarkdown(accept: string | undefined, userAgent?: string): boolean {
  if (accept) {
    const markdown = acceptQuality(accept, "text/markdown");
    if (markdown > 0 && markdown > acceptQuality(accept, "text/html")) return true;
  }
  return isAgentBotUserAgent(userAgent);
}

/**
 * Every generated agent file, keyed by output path relative to the site root (no leading slash).
 * Recomputes the JSON documents on each call; the page twins come from the cached page list.
 */
export function agentFiles(): Record<string, string> {
  const files: Record<string, string> = {
    "llms.txt": renderLlmsTxt(),
    "llms-full.txt": renderLlmsFull(),
    "developers/llms.txt": renderDevelopersLlmsTxt(),
    "work/llms.txt": renderWorkLlmsTxt(),
    "products/llms.txt": renderProductsLlmsTxt(),
    "openapi.json": `${JSON.stringify(buildOpenApiDocument(), null, 2)}\n`,
    "404.md": renderNotFoundMarkdown(),
    "auth.md": renderAuthMarkdown(),
    "pricing.md": renderPricingMarkdown(),
    "agent-mode.json": agentModeJson(),
    [SCHEMA_MAP_PATH.slice(1)]: renderSchemaMap(),
    [SCHEMA_FEED_PATH.slice(1)]: renderSchemaFeed(),
    [API_CATALOG_PATH.slice(1)]: `${JSON.stringify(buildApiCatalog(), null, 2)}\n`,
    [AI_CATALOG_PATH.slice(1)]: `${JSON.stringify(buildAiCatalog(), null, 2)}\n`,
    [ARD_PATH.slice(1)]: `${JSON.stringify(buildArdManifest(), null, 2)}\n`,
    [LEGACY_SERVER_CARD_PATH.slice(1)]: serverCardJson(),
  };
  for (const page of listAgentPages()) {
    const name = markdownPublicPath(page.path).replace(/^\//, "");
    files[name] = page.markdown;
  }
  return files;
}

/** Twin for a raw request path (with or without `.md`), or null when there is none or the path cannot be decoded. */
export function markdownForRequestPath(urlPath: string): string | null {
  let sitePath: string | null;
  try {
    sitePath = sitePathFromRequest(urlPath);
  } catch {
    return null;
  }
  if (!sitePath) return null;
  return renderPageMarkdown(sitePath);
}

/** Paths that are never pages, so negotiation leaves them to the host. */
const NON_PAGE_PREFIXES = ["/api/", "/_vercel/", "/.netlify/", "/.well-known/", "/assets/"];

let htmlRoutes: Set<string> | null = null;

/** True when the build prerenders an HTML file for this path (trailing slashes ignored). */
function hasHtmlPage(pathname: string): boolean {
  if (!htmlRoutes) htmlRoutes = new Set(prerenderRoutes());
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
  return htmlRoutes.has(path);
}

/** A Markdown answer: the twin with 200, or the Markdown 404 page with 404. */
export interface MarkdownNegotiation {
  status: 200 | 404;
  body: string;
}

/**
 * Markdown for an extensionless page request that asked for it, or null to serve the host's
 * normal response. Pages with HTML but no Markdown twin, such as /design-system, stay HTML.
 * Paths with a file extension and the `NON_PAGE_PREFIXES` are skipped. A path with neither a
 * twin nor an HTML page gets the Markdown 404 body.
 */
export function negotiateMarkdown(
  pathname: string,
  accept: string | undefined,
  userAgent?: string,
): MarkdownNegotiation | null {
  if (!wantsMarkdown(accept, userAgent)) return null;
  if (NON_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  if (/\.[a-z0-9]+$/i.test(pathname)) return null;
  const markdown = markdownForRequestPath(pathname);
  if (markdown) return { status: 200, body: markdown };
  if (hasHtmlPage(pathname)) return null;
  return { status: 404, body: renderNotFoundMarkdown() };
}
