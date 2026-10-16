/**
 * MCP server identity and discovery documents: Server Card, AI Catalog, and ARD v0.91 manifest.
 *
 * The Server Card describes the remote Streamable HTTP endpoint at `/api/mcp`. It is served live
 * at `/api/mcp/server-card` with an ETag, and as a static file at the legacy
 * `/.well-known/mcp/server-card.json`. The ARD manifest at `/.well-known/ard.json` is canonical;
 * `/.well-known/ai-catalog.json` stays as the predecessor path with the same entry. All URLs are
 * built from `person.siteUrl`.
 *
 * Connects to:
 * - `mcpServer.ts` (`MCP_SERVER_INFO` as serverInfo), `mcpHttp.ts` (serves the card),
 *   `surfaces.ts` (emits catalog, ARD, and legacy card files), `vitePlugin.ts` (dev routing).
 * - `apiCatalog.ts`, `openapi.ts`, and `developerDocs.ts` read its paths and media type.
 * - Tested in `src/__tests__/agentReadiness.test.ts`. Depends on `src/content` (`person`).
 */
import { person } from "../../content";

/** Mirrors the SDK's SUPPORTED_PROTOCOL_VERSIONS; a test fails when the SDK changes them. */
export const MCP_PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05", "2024-10-07"];

/** Shared by the live server's serverInfo and its Server Card, so the two cannot drift. */
export const MCP_SERVER_INFO = {
  name: "site.ayushrai/portfolio",
  title: "Ayush Rai portfolio",
  version: "1.0.0",
} as const;

/**
 * MCP initialize `instructions`: when to use these tools and their limits.
 * Kept short so clients can show it in full.
 */
export const MCP_SERVER_INSTRUCTIONS =
  "Read-only tools over Ayush Rai's public portfolio at https://www.ayushrai.site. Use list_projects, get_project, compare_projects, and search_portfolio for published work, products, research, and notes. Search is lexical (short keywords), not semantic. No authentication. Prefer Markdown twins by appending .md to page paths, or Accept: text/markdown. Content updates only on redeploy.";

/** Human-readable name for ARD / AI Catalog entries (ARD v0.91 requires `displayName`). */
export const MCP_ENTRY_DISPLAY_NAME = "Ayush Rai portfolio MCP";

/** Stable URN for the portfolio MCP entry; kept across ARD and the legacy AI Catalog. */
export const MCP_ENTRY_IDENTIFIER = "urn:air:ayushrai.site:mcp:portfolio";

export const MCP_ENDPOINT_PATH = "/api/mcp";
export const SERVER_CARD_PATH = `${MCP_ENDPOINT_PATH}/server-card`;
export const SERVER_CARD_CONTENT_TYPE = "application/mcp-server-card+json";
export const SERVER_CARD_SCHEMA = "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json";
export const AI_CATALOG_PATH = "/.well-known/ai-catalog.json";
export const AI_CATALOG_CONTENT_TYPE = "application/ai-catalog+json";
/** ARD v0.91 canonical discovery path (predecessor was `ai-catalog.json`). */
export const ARD_PATH = "/.well-known/ard.json";
export const ARD_CONTENT_TYPE = "application/json";
/** SEP-1649 location. Superseded by SEP-2127, kept so older scanners still find the card. */
export const LEGACY_SERVER_CARD_PATH = "/.well-known/mcp/server-card.json";

/** Response headers for the Server Card. `netlify.toml` and `vercel.json` repeat them for the legacy static file. */
export const SERVER_CARD_HEADERS: Record<string, string> = {
  "Content-Type": SERVER_CARD_CONTENT_TYPE,
  "Cache-Control": "public, max-age=3600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Headers": "Content-Type, If-None-Match",
  "Access-Control-Expose-Headers": "ETag",
};

/** Canonical site origin without a trailing slash. */
function origin() {
  return person.siteUrl.replace(/\/$/, "");
}

/** Shared catalog/ARD entry pointing at the live Server Card (exactly one of url|data). */
export function buildMcpCatalogEntry() {
  return {
    identifier: MCP_ENTRY_IDENTIFIER,
    displayName: MCP_ENTRY_DISPLAY_NAME,
    type: SERVER_CARD_CONTENT_TYPE,
    url: `${origin()}${SERVER_CARD_PATH}`,
    description: "Read-only MCP tools over Ayush Rai's public projects, research, and work.",
    tags: ["portfolio", "mcp", "projects", "search"],
    capabilities: ["list_projects", "get_project", "compare_projects", "search_portfolio"],
    representativeQueries: [
      "What projects has Ayush Rai built with Chrome extensions?",
      "Compare overlay-text-box and expert-o",
      "Search this portfolio for retrieval or agents work",
      "List public projects on ayushrai.site",
    ],
    version: MCP_SERVER_INFO.version,
    // HTTPS identity only — no fabricated signature or attestation.
    trustManifest: {
      identity: origin(),
      identityType: "https",
    },
  };
}

/** The Server Card object: identity from `MCP_SERVER_INFO` and one streamable-http remote. */
export function buildServerCard() {
  return {
    $schema: SERVER_CARD_SCHEMA,
    name: MCP_SERVER_INFO.name,
    version: MCP_SERVER_INFO.version,
    description: "Read-only search and lookup of Ayush Rai's public projects, research, and work.",
    title: MCP_SERVER_INFO.title,
    websiteUrl: `${origin()}/developers/`,
    icons: [{ src: `${origin()}/favicon.svg`, mimeType: "image/svg+xml", sizes: ["any"] }],
    repository: { url: "https://github.com/ayushrai-hub/ayush-work", source: "github" },
    remotes: [
      {
        type: "streamable-http" as const,
        url: `${origin()}${MCP_ENDPOINT_PATH}`,
        supportedProtocolVersions: [...MCP_PROTOCOL_VERSIONS],
      },
    ],
  };
}

/** AI Catalog (predecessor path) with the same MCP entry as ARD. */
export function buildAiCatalog() {
  return {
    specVersion: "1.0",
    host: {
      displayName: person.name,
      documentationUrl: `${origin()}/developers/`,
    },
    entries: [buildMcpCatalogEntry()],
  };
}

/** ARD v0.91 manifest at `/.well-known/ard.json`. */
export function buildArdManifest() {
  return {
    specVersion: "0.91",
    host: {
      displayName: person.name,
      documentationUrl: `${origin()}/developers/`,
    },
    entries: [buildMcpCatalogEntry()],
  };
}

/** The Server Card as pretty-printed JSON with a trailing newline; the exact bytes the ETag covers. */
export function serverCardJson(): string {
  return `${JSON.stringify(buildServerCard(), null, 2)}\n`;
}

/** FNV-1a over the card body: a strong validator that changes whenever the card does. */
export function serverCardEtag(body = serverCardJson()): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < body.length; index += 1) {
    hash ^= body.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `"${(hash >>> 0).toString(16)}"`;
}
