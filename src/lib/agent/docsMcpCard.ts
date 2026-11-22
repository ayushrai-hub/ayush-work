/**
 * Discovery facts for the documentation MCP server: identity, paths, Server Card, and catalog entry.
 *
 * Kept apart from `docsMcp.ts` on purpose. That file builds the server with
 * `@modelcontextprotocol/sdk`, which the Vercel Edge runtime cannot load. Everything the Routing
 * Middleware reaches (agent mode, ARD, AI Catalog, API catalog, generated agent files) imports this
 * module instead, so the middleware bundle never contains the SDK.
 *
 * Connects to:
 * - `docsMcp.ts` (the server) re-exports everything here.
 * - `agentMode.ts`, `mcpCard.ts`, `apiCatalog.ts`, `surfaces.ts`, `vitePlugin.ts`, and `mcpHttp.ts`.
 * - Depends only on `person` from src/content.
 */
import { person } from "../../content/person";

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

/** Endpoint path of the docs MCP server. */
export const DOCS_MCP_PATH = "/api/mcp/docs";
/** Path of the docs Server Card. */
export const DOCS_SERVER_CARD_PATH = `${DOCS_MCP_PATH}/server-card`;

/** Stable URN for the docs entry in ARD and the AI Catalog. */
export const DOCS_MCP_ENTRY_IDENTIFIER = "urn:air:ayushrai.site:mcp:docs";
/** Display name for the docs entry in ARD and the AI Catalog. */
export const DOCS_MCP_ENTRY_DISPLAY_NAME = "Ayush Rai docs MCP";

/** Canonical origin without a trailing slash. */
function origin() {
  return person.siteUrl.replace(/\/$/, "");
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
