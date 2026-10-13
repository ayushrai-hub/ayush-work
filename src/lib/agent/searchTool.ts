/**
 * The portfolio search tool for agents: a JSON Schema definition and an executor.
 *
 * `executePortfolioSearch` accepts untrusted arguments, validates them with the same rules as
 * the REST API, and returns an MCP-style tool result: a JSON text block plus `structuredContent`,
 * or `isError` with a message. `limit` (1–20) and `cursor` (a previous `nextCursor`) page through
 * results exactly like `GET /api/v1/search`.
 *
 * Connects to:
 * - `src/components/site/PortfolioWebMcp.tsx` registers `PORTFOLIO_SEARCH_TOOL` with the browser's
 *   WebMCP `modelContext` when present.
 * - `mcpServer.ts` uses `executePortfolioSearch` for the `search_portfolio` MCP tool.
 * - Tested in `src/__tests__/agentSurfaces.test.ts`. Depends on `search.ts`, `pagination.ts`, and
 *   `validate.ts`.
 */
import { decodeCursor } from "./pagination";
import { SEARCH_MAX_LIMIT, searchPayload } from "./search";
import { validateQuery, validateSearchType, type FieldError } from "./validate";

/** WebMCP tool definition (`search_portfolio_projects`). The MCP server declares its own zod schema instead. */
export const PORTFOLIO_SEARCH_TOOL = {
  name: "search_portfolio_projects",
  description:
    "Search Ayush Rai's public portfolio index. Lexical match only, the same function as GET /api/search. Not semantic search. Pass nextCursor back as cursor for the next page.",
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
      limit: {
        type: "integer",
        minimum: 1,
        maximum: SEARCH_MAX_LIMIT,
        description: "Results per page. Defaults to 12 with a query and 8 without.",
      },
      cursor: {
        type: "string",
        description: "nextCursor from a previous call.",
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
} as const;

/** `limit` from tool arguments: absent is fine; anything but an integer from 1 to 20 is an error. */
function readLimit(value: unknown): { limit?: number; error?: FieldError } {
  if (value === undefined || value === null) return {};
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > SEARCH_MAX_LIMIT) {
    return { error: { code: "invalid_filter", message: `limit must be an integer from 1 to ${SEARCH_MAX_LIMIT}.` } };
  }
  return { limit: value };
}

/**
 * Runs a search from tool arguments. Non-string `query`, `type`, or `cursor` values are treated as
 * absent; a query over 200 characters, an unknown type, a bad limit, or a cursor this server did
 * not issue returns an `isError` result.
 */
export function executePortfolioSearch(args: unknown) {
  const record =
    args && typeof args === "object"
      ? (args as { query?: unknown; type?: unknown; limit?: unknown; cursor?: unknown })
      : {};
  const query = typeof record.query === "string" ? record.query : "";
  const type = typeof record.type === "string" ? record.type : null;
  const limit = readLimit(record.limit);
  const cursor = decodeCursor(typeof record.cursor === "string" ? record.cursor : null);
  const error = validateQuery(query) ?? validateSearchType(type) ?? limit.error ?? cursor.error;
  if (error) {
    return {
      isError: true,
      content: [{ type: "text" as const, text: error.message }],
    };
  }
  const payload = searchPayload(query, { type: type ?? undefined, limit: limit.limit, offset: cursor.offset });
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload) }],
    structuredContent: payload,
  };
}
