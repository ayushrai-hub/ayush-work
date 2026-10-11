import { buildOpenApiDocument } from "./openapi";
import {
  listAgentPages,
  markdownPublicPath,
  renderLlmsFull,
  renderLlmsTxt,
  renderPageMarkdown,
  sitePathFromRequest,
} from "./markdown";

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
  };
  for (const page of listAgentPages()) {
    const name = markdownPublicPath(page.path).replace(/^\//, "");
    files[name] = page.markdown;
  }
  return files;
}

export function markdownForRequestPath(urlPath: string): string | null {
  const sitePath = sitePathFromRequest(urlPath);
  if (!sitePath) return null;
  return renderPageMarkdown(sitePath);
}
