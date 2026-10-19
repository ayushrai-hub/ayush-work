/**
 * Documentation MCP server: read published Markdown pages and search the public site index.
 *
 * This is the learn surface. The portfolio server at `/api/mcp` is the do surface (projects and
 * search tools). Tools here return the same Markdown twins and lexical search results as the site.
 * Nothing is written.
 *
 * Connects to:
 * - `mcpHttp.ts` serves it at POST /api/mcp/docs, with a Server Card at /api/mcp/docs/server-card.
 * - `mcpCard.ts` lists the card in ARD and the AI Catalog. `markdown.ts` and `search.ts` supply data.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { person } from "../../content";
import { getAgentPage, listAgentPages } from "./markdown";
import { searchPayload } from "./search";

/** Same schema URL as the portfolio card in mcpCard.ts. Duplicated so the two files do not import each other. */
const DOCS_CARD_SCHEMA = "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json";

/** Identity shared by initialize and the docs Server Card. */
export const DOCS_MCP_SERVER_INFO = {
  name: "site.ayushrai/docs",
  title: "Ayush Rai site docs",
  version: "1.0.0",
} as const;

/** Shown to clients on initialize. */
export const DOCS_MCP_INSTRUCTIONS =
  "Read Ayush Rai's published site pages. list_pages lists Markdown twins, get_page returns one page's Markdown, and search_docs runs the same lexical search as GET /api/v1/search. This server does not change anything. The project tools live on the separate portfolio server.";

export const DOCS_MCP_PATH = "/api/mcp/docs";
export const DOCS_SERVER_CARD_PATH = `${DOCS_MCP_PATH}/server-card`;

/** Stable URN for the docs entry in ARD and the AI Catalog. */
export const DOCS_MCP_ENTRY_IDENTIFIER = "urn:air:ayushrai.site:mcp:docs";
export const DOCS_MCP_ENTRY_DISPLAY_NAME = "Ayush Rai docs MCP";

/** Canonical origin without a trailing slash. */
function origin() {
  return person.siteUrl.replace(/\/$/, "");
}

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

/** Server Card for the docs MCP endpoint. Description stays within the 100-character card limit. */
export function buildDocsServerCard() {
  return {
    $schema: DOCS_CARD_SCHEMA,
    name: DOCS_MCP_SERVER_INFO.name,
    version: DOCS_MCP_SERVER_INFO.version,
    description: "Read published Markdown pages and search Ayush Rai's site docs.",
    title: DOCS_MCP_SERVER_INFO.title,
    websiteUrl: `${origin()}/developers/`,
    icons: [{ src: `${origin()}/favicon.svg`, mimeType: "image/svg+xml", sizes: ["any"] }],
    repository: { url: "https://github.com/ayushrai-hub/ayush-work", source: "github" },
    remotes: [
      {
        type: "streamable-http" as const,
        url: `${origin()}${DOCS_MCP_PATH}`,
        supportedProtocolVersions: ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05", "2024-10-07"],
      },
    ],
  };
}

/** Pretty-printed docs Server Card, the bytes served at the card path. */
export function docsServerCardJson(): string {
  return `${JSON.stringify(buildDocsServerCard(), null, 2)}\n`;
}

/** ARD and AI Catalog entry for the docs server. Points at the live card, not an inline copy. */
export function buildDocsCatalogEntry() {
  return {
    identifier: DOCS_MCP_ENTRY_IDENTIFIER,
    displayName: DOCS_MCP_ENTRY_DISPLAY_NAME,
    type: "application/mcp-server-card+json",
    url: `${origin()}${DOCS_SERVER_CARD_PATH}`,
    description: "MCP tools that read Ayush Rai's published Markdown pages and search the site index.",
    tags: ["docs", "mcp", "markdown", "search"],
    capabilities: ["list_pages", "get_page", "search_docs"],
    representativeQueries: [
      "List the published pages on ayushrai.site",
      "Get the Markdown for the developers page",
      "Search the site docs for the OpenAPI spec",
    ],
    version: DOCS_MCP_SERVER_INFO.version,
    trustManifest: {
      identity: origin(),
      identityType: "https",
    },
  };
}

/** Absolute URL of the docs server, for agent-mode and developer copy. */
export function docsMcpUrl(): string {
  return `${origin()}${DOCS_MCP_PATH}`;
}
