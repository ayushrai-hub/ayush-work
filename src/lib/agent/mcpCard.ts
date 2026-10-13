import { person } from "../../content";

/** Mirrors the SDK's SUPPORTED_PROTOCOL_VERSIONS; a test fails when the SDK changes them. */
export const MCP_PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05", "2024-10-07"];

/** Shared by the live server's serverInfo and its Server Card, so the two cannot drift. */
export const MCP_SERVER_INFO = {
  name: "site.ayushrai/portfolio",
  title: "Ayush Rai portfolio",
  version: "1.0.0",
} as const;

export const MCP_ENDPOINT_PATH = "/api/mcp";
export const SERVER_CARD_PATH = `${MCP_ENDPOINT_PATH}/server-card`;
export const SERVER_CARD_CONTENT_TYPE = "application/mcp-server-card+json";
export const SERVER_CARD_SCHEMA = "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json";
export const AI_CATALOG_PATH = "/.well-known/ai-catalog.json";
export const AI_CATALOG_CONTENT_TYPE = "application/ai-catalog+json";
/** SEP-1649 location. Superseded by SEP-2127, kept so older scanners still find the card. */
export const LEGACY_SERVER_CARD_PATH = "/.well-known/mcp/server-card.json";

export const SERVER_CARD_HEADERS: Record<string, string> = {
  "Content-Type": SERVER_CARD_CONTENT_TYPE,
  "Cache-Control": "public, max-age=3600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Headers": "Content-Type, If-None-Match",
  "Access-Control-Expose-Headers": "ETag",
};

function origin() {
  return person.siteUrl.replace(/\/$/, "");
}

export function buildServerCard() {
  return {
    $schema: SERVER_CARD_SCHEMA,
    name: MCP_SERVER_INFO.name,
    version: MCP_SERVER_INFO.version,
    description: "Read-only search and lookup of Ayush Rai's public projects, research, and work.",
    title: MCP_SERVER_INFO.title,
    websiteUrl: `${origin()}/developers/`,
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

export function buildAiCatalog() {
  return {
    specVersion: "1.0",
    entries: [
      {
        identifier: "urn:air:ayushrai.site:mcp:portfolio",
        type: SERVER_CARD_CONTENT_TYPE,
        url: `${origin()}${SERVER_CARD_PATH}`,
      },
    ],
  };
}

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
