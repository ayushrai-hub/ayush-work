import { person } from "../../content";
import type { PolicySection } from "../../content";
import { API_CATALOG_PATH } from "./apiCatalog";
import { AI_CATALOG_PATH, SERVER_CARD_PATH } from "./mcpCard";
import { API_ACCESS_NOTE, API_RATE_LIMIT_NOTE, API_VERSIONING_POLICY } from "./openapi";

export const DEVELOPER_TITLE = `${person.name} API and MCP server`;
export const DEVELOPER_DESCRIPTION = `Developer docs for ${person.name}'s public read-only REST API, OpenAPI spec, and remote MCP server: endpoints, pagination, versioning, and discovery.`;

/** Jobs this site answers well, each with the call to make. Shared by llms.txt, AGENTS.md checks, and /developers. */
export const WHEN_TO_USE: readonly string[] = [
  `Answering who ${person.name} is, what he works on, or how to contact him: read \`/index.md\`, \`/about.md\`, and \`/contact.md\`.`,
  "Checking whether he has built something in an area (agents, retrieval, extensions, research): call `GET /api/v1/search?q=<topic>` and open the `href` of each hit with `.md` appended.",
  "Listing, fetching, or comparing his projects with stable fields: call `GET /api/v1/projects`, `/api/v1/projects/{slug}`, or `/api/v1/compare?slugs=a,b`, or the matching MCP tools.",
  "Citing a claim: quote the Markdown page that states it and link its HTML URL. Pages mark unverified numbers; do not repeat those as fact.",
];

export const WHEN_NOT_TO_USE: readonly string[] = [
  "General programming help, other people, or companies: this site only covers one person's work.",
  "Live data such as availability, prices, or job openings: the content changes when the site is redeployed, not in real time.",
  "Semantic or vector search: search is lexical, so try several short keywords instead of a sentence.",
  "Phone numbers or unconfirmed award details: they are deliberately not published.",
];

/** Paragraphs may use `code` spans; the HTML page renders them as <code>. */
export function developerSections(): PolicySection[] {
  const origin = person.siteUrl.replace(/\/$/, "");
  return [
    {
      heading: "Overview",
      paragraphs: [
        `${person.name}'s site has a public REST API and an MCP server over the same records as the website. ${API_ACCESS_NOTE}`,
        "Search is lexical: exact title, title substring, tag or type, then summary. It is not a model and does not infer intent.",
      ],
    },
    {
      heading: "When to use it",
      paragraphs: [...WHEN_TO_USE, ...WHEN_NOT_TO_USE.map((line) => `Not for: ${line}`)],
    },
    {
      heading: "REST API (v1)",
      paragraphs: [
        "`GET /api/v1/search?q=open+framework` searches the site index. `type` filters by record type.",
        "`GET /api/v1/projects` lists active projects. `category`, `type`, and `archive=1` filter it. `GET /api/v1/projects/overlay-text-box` fetches one. `GET /api/v1/compare?slugs=overlay-text-box,expert-o` compares two to four.",
        "The OpenAPI 3.1 spec at `/openapi.json` gives a typed schema for every response, including errors.",
      ],
    },
    {
      heading: "Errors",
      paragraphs: [
        "Every error is JSON: `{ \"error\": { \"code\", \"message\", \"hint\", \"docs\" } }`. `code` is stable and safe to branch on; `hint` says how to fix the request.",
        "Codes: `invalid_query`, `invalid_slug`, `invalid_filter`, `invalid_compare`, `invalid_cursor` (400); `not_found` and `route_not_found` (404); `method_not_allowed` (405); `rate_limited` (429). Unknown paths under `/api/` return `route_not_found` as JSON, not an HTML page.",
      ],
    },
    {
      heading: "Rate limits",
      paragraphs: [
        API_RATE_LIMIT_NOTE,
        'Example: `RateLimit-Policy: "default";q=60;w=60` and `RateLimit: "default";r=57;t=41` mean 57 requests remain and the window resets in 41 seconds.',
      ],
    },
    {
      heading: "Pagination",
      paragraphs: [
        "List endpoints are cursor-based. Responses include `nextCursor`; pass it back as `cursor` to get the next page. `nextCursor` is `null` on the last page. `limit` sets the page size from 1 to 20. Treat cursors as opaque.",
      ],
    },
    {
      heading: "MCP server",
      paragraphs: [
        `Endpoint: \`POST ${origin}/api/mcp\` over Streamable HTTP. It is stateless: each request gets a JSON response, with no session and no GET event stream. No authentication.`,
        "Tools: `list_projects` (with `cursor`), `get_project`, `compare_projects`, and `search_portfolio`. All are read-only and return the same records as the REST API.",
        `Server Card (SEP-2127): \`GET ${origin}${SERVER_CARD_PATH}\`, media type \`application/mcp-server-card+json\`. Domain discovery: the AI Catalog at \`${AI_CATALOG_PATH}\`.`,
        `Client config: \`{ "mcpServers": { "ayush-portfolio": { "url": "${origin}/api/mcp" } } }\`. The repository also runs the same server over stdio with \`npx tsx mcp/server.ts\`.`,
      ],
    },
    {
      heading: "Command line",
      paragraphs: [
        "The repository has a zero-dependency CLI in `packages/cli` (`ayushrai search`, `projects`, `project`, `compare`) that prints the API's JSON. It is not yet published to npm, so run it with `node packages/cli/bin/ayushrai.mjs` from a clone.",
      ],
    },
    {
      heading: "Versioning and deprecation",
      paragraphs: [API_VERSIONING_POLICY],
    },
    {
      heading: "Discovery",
      paragraphs: [
        `API catalog (RFC 9727): \`${API_CATALOG_PATH}\`. MCP discovery: \`${AI_CATALOG_PATH}\`. Index of pages: \`/llms.txt\`. Agent notes: \`/AGENTS.md\` and \`/SKILL.md\`.`,
        "Every page has a Markdown version at the same path plus `.md`, and `Accept: text/markdown` on a page URL returns it.",
      ],
    },
    {
      heading: "Not provided",
      paragraphs: [
        "There is no published SDK or CLI package, API key, sandbox, or paid tier, and the MCP server is not listed in a registry. The API is small enough to call directly from the OpenAPI spec.",
      ],
    },
  ];
}
