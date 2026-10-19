/**
 * Builds the RFC 9727 API catalog served at `/.well-known/api-catalog`.
 *
 * The catalog is a linkset: one entry lists every API by URL, and one entry per API points at
 * its machine description (`/openapi.json`, or the MCP Server Card) and the `/developers` docs.
 * URLs are absolute and built from `person.siteUrl`.
 *
 * Connects to:
 * - `surfaces.ts` `agentFiles()` writes it as a static file; `vitePlugin.ts` serves it in dev and
 *   preview; `netlify.toml` and `vercel.json` set its Content-Type on the deployed file.
 * - `developerDocs.ts` cites `API_CATALOG_PATH`; `src/__tests__/agentReadiness.test.ts` checks the output.
 * - Depends on `src/content` (`person`), `../canonical`, and the MCP paths in `mcpCard.ts`.
 */
import { person } from "../../content";
import { canonicalUrl } from "../canonical";
import { DOCS_MCP_PATH, DOCS_SERVER_CARD_PATH } from "./docsMcp";
import { MCP_ENDPOINT_PATH, SERVER_CARD_CONTENT_TYPE, SERVER_CARD_PATH } from "./mcpCard";

export const API_CATALOG_PATH = "/.well-known/api-catalog";
/** Media type RFC 9727 assigns to the catalog; host configs repeat this string. */
export const API_CATALOG_CONTENT_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

/**
 * RFC 9727 linkset for the REST API and the MCP endpoint. List only endpoints that are deployed.
 * The MCP entry uses the Server Card as `service-desc` and `llms.txt` as `service-meta`.
 */
export function buildApiCatalog() {
  const origin = person.siteUrl.replace(/\/$/, "");
  const openapi = [{ href: `${origin}/openapi.json`, type: "application/vnd.oai.openapi+json" }];
  const docs = [{ href: canonicalUrl("/developers"), type: "text/html" }];
  const apis = [
    `${origin}/api/v1/projects`,
    `${origin}/api/v1/search`,
    `${origin}/api/v1/batch`,
    `${origin}${MCP_ENDPOINT_PATH}`,
    `${origin}${DOCS_MCP_PATH}`,
  ];
  return {
    linkset: [
      {
        anchor: `${origin}${API_CATALOG_PATH}`,
        item: apis.map((href) => ({ href })),
      },
      {
        anchor: `${origin}/api/v1/projects`,
        "service-desc": openapi,
        "service-doc": docs,
      },
      {
        anchor: `${origin}/api/v1/search`,
        "service-desc": openapi,
        "service-doc": docs,
      },
      {
        anchor: `${origin}${MCP_ENDPOINT_PATH}`,
        "service-desc": [{ href: `${origin}${SERVER_CARD_PATH}`, type: SERVER_CARD_CONTENT_TYPE }],
        "service-doc": docs,
        "service-meta": [{ href: `${origin}/llms.txt`, type: "text/plain" }],
      },
      {
        anchor: `${origin}${DOCS_MCP_PATH}`,
        "service-desc": [{ href: `${origin}${DOCS_SERVER_CARD_PATH}`, type: SERVER_CARD_CONTENT_TYPE }],
        "service-doc": docs,
        "service-meta": [{ href: `${origin}/llms.txt`, type: "text/plain" }],
      },
    ],
  };
}
