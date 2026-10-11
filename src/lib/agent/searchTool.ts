import { searchPayload } from "./search";
import { validateQuery, validateSearchType } from "./validate";

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
