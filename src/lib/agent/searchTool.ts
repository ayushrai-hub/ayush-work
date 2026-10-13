/**
 * The portfolio search tool for agents: a JSON Schema definition and an executor.
 *
 * `executePortfolioSearch` accepts untrusted arguments, validates them with the same rules as
 * the REST API, and returns an MCP-style tool result: a JSON text block plus `structuredContent`,
 * or `isError` with a message. Only the first page is returned; the tool takes no `limit` or `cursor`.
 *
 * Connects to:
 * - `src/components/site/PortfolioWebMcp.tsx` registers `PORTFOLIO_SEARCH_TOOL` with the browser's
 *   WebMCP `modelContext` when present.
 * - `mcpServer.ts` uses `executePortfolioSearch` for the `search_portfolio` MCP tool.
 * - Tested in `src/__tests__/agentSurfaces.test.ts`. Depends on `search.ts` and `validate.ts`.
 */
import { searchPayload } from "./search";
import { validateQuery, validateSearchType } from "./validate";

/** WebMCP tool definition (`search_portfolio_projects`). The MCP server declares its own zod schema instead. */
export const PORTFOLIO_SEARCH_TOOL = {
  name: "search_portfolio_projects",
  description:
    "Search Ayush Rai's public portfolio index. Lexical match only, the same function as GET /api/search. Not semantic search.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        maxLength: 200,
        description: "Search text. Empty returns the same default slice as the on-site search dialog.",
      },
      type: {
        type: "string",
        description: "Optional record type, such as work, project, or research.",
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
} as const;

/**
 * Runs a search from tool arguments. Non-string `query` or `type` values are treated as absent;
 * a query over 200 characters or an unknown type returns an `isError` result.
 */
export function executePortfolioSearch(args: unknown) {
  const record =
    args && typeof args === "object" ? (args as { query?: unknown; type?: unknown }) : {};
  const query = typeof record.query === "string" ? record.query : "";
  const type = typeof record.type === "string" ? record.type : null;
  const queryError = validateQuery(query);
  const typeError = validateSearchType(type);
  const error = queryError ?? typeError;
  if (error) {
    return {
      isError: true,
      content: [{ type: "text" as const, text: error.message }],
    };
  }
  const payload = searchPayload(query, { type: type ?? undefined });
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload) }],
    structuredContent: payload,
  };
}
