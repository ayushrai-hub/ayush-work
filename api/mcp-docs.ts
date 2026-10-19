/**
 * Serverless entry for the documentation MCP server at POST /api/mcp/docs.
 *
 * Same host adapter as api/mcp.ts, with the docs surface: list_pages, get_page, and search_docs.
 * The Server Card is GET /api/mcp/docs/server-card, rewritten to this function with
 * ?resource=server-card.
 *
 * Connects to:
 * - src/lib/agent/mcpHttp.ts (DOCS_HTTP_SURFACE) and src/lib/agent/docsMcp.ts.
 * - netlify.toml and vercel.json route /api/mcp/docs here, ahead of the /api/* splat.
 */
import { createMcpHandler } from "./mcp";
import { DOCS_HTTP_SURFACE } from "../src/lib/agent/mcpHttp";

/** Docs MCP endpoint. Netlify and Vercel both call this default export. */
export default createMcpHandler(DOCS_HTTP_SURFACE);
