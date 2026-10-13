import { person } from "../../content";
import { canonicalUrl } from "../canonical";
import { MCP_ENDPOINT_PATH, SERVER_CARD_CONTENT_TYPE, SERVER_CARD_PATH } from "./mcpCard";

export const API_CATALOG_PATH = "/.well-known/api-catalog";
export const API_CATALOG_CONTENT_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

/** RFC 9727 linkset. List only endpoints that are deployed. */
export function buildApiCatalog() {
  const origin = person.siteUrl.replace(/\/$/, "");
  const openapi = [{ href: `${origin}/openapi.json`, type: "application/vnd.oai.openapi+json" }];
  const docs = [{ href: canonicalUrl("/developers"), type: "text/html" }];
  const apis = [`${origin}/api/v1/projects`, `${origin}/api/v1/search`, `${origin}/api/mcp`];
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
    ],
  };
}
