/**
 * Documentation MCP server: read published Markdown pages and search the public site index.
 *
 * This is the learn surface. The portfolio server at `/api/mcp` is the do surface (projects and
 * search tools). Tools here return the same Markdown twins and lexical search results as the site.
 * Nothing is written.
 *
 * Only the server lives here because it needs `@modelcontextprotocol/sdk`. Identity, paths, the
 * Server Card, and the catalog entry live in `docsMcpCard.ts` (re-exported below) so the Vercel
 * Edge middleware can use them without bundling the SDK.
 *
 * Connects to:
 * - `mcpHttp.ts` serves it at POST /api/mcp/docs, with a Server Card at /api/mcp/docs/server-card.
 * - `docsMcpCard.ts` for identity and card. `markdown.ts` and `search.ts` supply data.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DOCS_MCP_INSTRUCTIONS, DOCS_MCP_SERVER_INFO } from "./docsMcpCard";
import { getAgentPage, listAgentPages } from "./markdown";
import { searchPayload } from "./search";

export * from "./docsMcpCard";

/** Tool result whose text block is indented JSON. */
function text(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

/** Tool result flagged isError. */
function toolError(message: string, code: string) {
  return {
    isError: true as const,
    content: [{ type: "text" as const, text: `${code}: ${message}` }],
    structuredContent: { error: { code, message } },
  };
}

/**
 * A new unconnected docs server. The caller attaches a transport.
 * Tools are read-only and use the published page list and search index.
 */
export function createDocsMcpServer() {
  const server = new McpServer({ ...DOCS_MCP_SERVER_INFO }, { instructions: DOCS_MCP_INSTRUCTIONS });

  server.registerTool(
    "list_pages",
    {
      description: "List published Markdown pages: path, title, and description. Same pages as llms.txt.",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () =>
      text({
        pages: listAgentPages().map((page) => ({
          path: page.path,
          title: page.title,
          description: page.description,
        })),
      }),
  );

  server.registerTool(
    "get_page",
    {
      description: "Return one published page as Markdown. path is a site path such as /about or /developers.",
      inputSchema: {
        path: z.string().describe("Site path, with or without a trailing slash"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ path }) => {
      const page = getAgentPage(path.startsWith("/") ? path : `/${path}`);
      if (!page) return toolError(`No published page at ${path}.`, "not_found");
      return text({ path: page.path, title: page.title, markdown: page.markdown });
    },
  );

  server.registerTool(
    "search_docs",
    {
      description:
        "Lexical search over the published site index, the same function as GET /api/v1/search. Not semantic search.",
      inputSchema: {
        query: z.string().max(200).describe("Search text. Empty returns the default slice."),
        limit: z.number().int().min(1).max(20).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ query, limit }) => text(searchPayload(query, { limit })),
  );

  return server;
}
