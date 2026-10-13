import { prerenderRoutes } from "../publicRoutes";
import { API_CATALOG_PATH, buildApiCatalog } from "./apiCatalog";
import { AI_CATALOG_PATH, buildAiCatalog, LEGACY_SERVER_CARD_PATH, serverCardJson } from "./mcpCard";
import { buildOpenApiDocument } from "./openapi";
import {
  listAgentPages,
  markdownPublicPath,
  renderLlmsFull,
  renderLlmsTxt,
  renderNotFoundMarkdown,
  renderPageMarkdown,
  sitePathFromRequest,
} from "./markdown";

export const MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "X-Content-Type-Options": "nosniff",
} as const;

export function wantsMarkdown(accept: string | undefined): boolean {
  if (!accept) return false;
  if (!accept.toLowerCase().includes("text/markdown")) return false;
  return !accept.toLowerCase().includes("text/html");
}

export function agentFiles(): Record<string, string> {
  const files: Record<string, string> = {
    "llms.txt": renderLlmsTxt(),
    "llms-full.txt": renderLlmsFull(),
    "openapi.json": `${JSON.stringify(buildOpenApiDocument(), null, 2)}\n`,
    "404.md": renderNotFoundMarkdown(),
    [API_CATALOG_PATH.slice(1)]: `${JSON.stringify(buildApiCatalog(), null, 2)}\n`,
    [AI_CATALOG_PATH.slice(1)]: `${JSON.stringify(buildAiCatalog(), null, 2)}\n`,
    [LEGACY_SERVER_CARD_PATH.slice(1)]: serverCardJson(),
  };
  for (const page of listAgentPages()) {
    const name = markdownPublicPath(page.path).replace(/^\//, "");
    files[name] = page.markdown;
  }
  return files;
}

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

const NON_PAGE_PREFIXES = ["/api/", "/_vercel/", "/.netlify/", "/.well-known/", "/assets/"];

let htmlRoutes: Set<string> | null = null;

function hasHtmlPage(pathname: string): boolean {
  if (!htmlRoutes) htmlRoutes = new Set(prerenderRoutes());
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
  return htmlRoutes.has(path);
}

export interface MarkdownNegotiation {
  status: 200 | 404;
  body: string;
}

/**
 * Markdown for an extensionless page request that asked for it, or null to serve the host's
 * normal response. Pages with HTML but no Markdown twin, such as /design-system, stay HTML.
 */
export function negotiateMarkdown(
  pathname: string,
  accept: string | undefined,
): MarkdownNegotiation | null {
  if (!wantsMarkdown(accept)) return null;
  if (NON_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  if (/\.[a-z0-9]+$/i.test(pathname)) return null;
  const markdown = markdownForRequestPath(pathname);
  if (markdown) return { status: 200, body: markdown };
  if (hasHtmlPage(pathname)) return null;
  return { status: 404, body: renderNotFoundMarkdown() };
}
