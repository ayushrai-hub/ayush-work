/**
 * Machine-readable homepage view for `?mode=agent`: identity, docs, APIs, and MCP connection facts.
 *
 * Built from the same content and discovery paths as the human site. Emitted as `agent-mode.json`
 * and served when the homepage is requested with `mode=agent`. Ordinary homepage HTML is unchanged.
 *
 * Connects to:
 * - `surfaces.ts` emits the JSON file; `vitePlugin.ts`, `markdownMiddleware.ts`, and the Netlify
 *   edge function serve it for `/?mode=agent`.
 * - Depends on `person`, `mcpCard.ts`, `apiCatalog.ts`, and `openapi.ts` path constants.
 */
import { person } from "../../content";
import { API_CATALOG_PATH } from "./apiCatalog";
import { DOCS_MCP_PATH, DOCS_SERVER_CARD_PATH, docsMcpUrl } from "./docsMcp";
import {
  AI_CATALOG_PATH,
  ARD_PATH,
  LEGACY_SERVER_CARD_PATH,
  MCP_ENDPOINT_PATH,
  SERVER_CARD_PATH,
} from "./mcpCard";

/** Absolute origin without a trailing slash. */
function origin() {
  return person.siteUrl.replace(/\/$/, "");
}

/** Structured agent-mode document. Stable field names; new fields may be added, not removed. */
export function buildAgentModeDocument() {
  const base = origin();
  return {
    schema: "https://www.ayushrai.site/schemas/agent-mode.json",
    version: "1.0.0",
    identity: {
      name: person.name,
      role: person.roleTitle,
      summary: person.tagline,
      location: person.location,
      email: person.email,
      phone: person.phoneDisplay,
      website: `${base}/`,
      sameAs: [...person.sameAs],
    },
    pages: {
      home: `${base}/`,
      about: `${base}/about/`,
      work: `${base}/work/`,
      products: `${base}/products/`,
      projects: `${base}/projects/`,
      contact: `${base}/contact/`,
      developers: `${base}/developers/`,
    },
    markdown: {
      home: `${base}/index.md`,
      about: `${base}/about.md`,
      developers: `${base}/developers.md`,
      auth: `${base}/auth.md`,
      pricing: `${base}/pricing.md`,
      agents: `${base}/AGENTS.md`,
      llms: `${base}/llms.txt`,
      llmsFull: `${base}/llms-full.txt`,
      developersLlms: `${base}/developers/llms.txt`,
      workLlms: `${base}/work/llms.txt`,
      productsLlms: `${base}/products/llms.txt`,
    },
    api: {
      authentication: "none",
      openapi: `${base}/openapi.json`,
      catalog: `${base}${API_CATALOG_PATH}`,
      endpoints: [
        { method: "GET", path: "/api/v1/search", href: `${base}/api/v1/search` },
        { method: "GET", path: "/api/v1/projects", href: `${base}/api/v1/projects` },
        { method: "GET", path: "/api/v1/projects/{slug}", href: `${base}/api/v1/projects/{slug}` },
        { method: "GET", path: "/api/v1/compare", href: `${base}/api/v1/compare` },
        { method: "POST", path: "/ask", href: `${base}/ask`, note: "NLWeb-shaped lexical ask" },
        {
          method: "POST",
          path: "/api/v1/batch",
          href: `${base}/api/v1/batch`,
          note: "Up to 8 public reads. Optional Idempotency-Key header.",
        },
        {
          method: "GET",
          path: "/api/sandbox/v1/search",
          href: `${base}/api/sandbox/v1/search`,
          note: "Sandbox alias of the public read API. Same published records, no writes.",
        },
        {
          method: "POST",
          path: "/api/send-email",
          href: `${base}/api/send-email`,
          note: "Contact form. Optional Idempotency-Key header.",
        },
      ],
      rateLimit: "60 requests per 60 seconds per client address",
    },
    mcp: {
      transport: "streamable-http",
      url: `${base}${MCP_ENDPOINT_PATH}`,
      serverCard: `${base}${SERVER_CARD_PATH}`,
      legacyServerCard: `${base}${LEGACY_SERVER_CARD_PATH}`,
      authentication: "none",
      tools: ["list_projects", "get_project", "compare_projects", "search_portfolio"],
      docs: {
        url: docsMcpUrl(),
        serverCard: `${base}${DOCS_SERVER_CARD_PATH}`,
        tools: ["list_pages", "get_page", "search_docs"],
      },
      clientConfig: {
        mcpServers: {
          "ayush-portfolio": { url: `${base}${MCP_ENDPOINT_PATH}` },
          "ayush-portfolio-docs": { url: `${base}${DOCS_MCP_PATH}` },
        },
      },
    },
    discovery: {
      ard: `${base}${ARD_PATH}`,
      aiCatalog: `${base}${AI_CATALOG_PATH}`,
      apiCatalog: `${base}${API_CATALOG_PATH}`,
    },
    capabilities: {
      search: "lexical",
      semanticSearch: false,
      authentication: false,
      payments: false,
      a2a: false,
      webmcp: true,
      markdownTwins: true,
      contentNegotiation: "Accept: text/markdown",
      batch: true,
      idempotencyKey: true,
      sandbox: "alias of the public read API at /api/sandbox/v1/*",
    },
    limitations: [
      "Search is lexical, not semantic.",
      "Content updates only when the site is redeployed.",
      "The sandbox alias returns the same published records as /api/v1. There is no separate dataset.",
      "No OAuth, API keys, or published SDK package yet.",
      "A2A agent-card is not published because no A2A JSON-RPC endpoint is implemented.",
      "The MCP server is not listed on Smithery, mcp.so, or another registry.",
    ],
  };
}

/** Pretty-printed agent-mode JSON with a trailing newline. */
export function agentModeJson(): string {
  return `${JSON.stringify(buildAgentModeDocument(), null, 2)}\n`;
}

/** True when this request should receive the agent-mode JSON instead of the homepage. */
export function wantsAgentMode(pathname: string, searchParams: URLSearchParams): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return (path === "/" || path === "") && searchParams.get("mode") === "agent";
}
