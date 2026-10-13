/**
 * Builds the MCP server and its four read-only tools over the public project and search records.
 *
 * Tools: `list_projects`, `get_project`, `compare_projects`, and `search_portfolio`. Each calls
 * the same query and validation functions as the REST API, so results match `/api/v1/*`.
 * Arguments are checked first by each tool's zod `inputSchema` (in the SDK), then by the shared
 * validators; validator failures and missing records return a tool result with `isError: true`.
 *
 * Connects to:
 * - `mcp/server.ts` (local stdio server) and `mcpHttp.ts` (remote Streamable HTTP via `api/mcp.ts`).
 * - Depends on `@modelcontextprotocol/sdk`, `zod`, `mcpCard.ts` (server identity), `projectsQuery.ts`,
 *   `searchTool.ts`, `pagination.ts`, and `validate.ts`.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCP_SERVER_INFO } from "./mcpCard";
import { decodeCursor } from "./pagination";
import { comparePublicProjects, getPublicProject, pagePublicProjects } from "./projectsQuery";
import { executePortfolioSearch } from "./searchTool";
import { validateProjectCategory, validateProjectType, validateSlug } from "./validate";

/** Tool result whose single text block is `value` as indented JSON. */
function text(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

/** Tool result flagged `isError` with a plain-text message, for the model to read and retry. */
function toolError(message: string) {
  return { isError: true, content: [{ type: "text" as const, text: message }] };
}

/**
 * Read-only tools over the public project records. Shared by stdio and Streamable HTTP.
 * Returns a new, unconnected server; the caller attaches a transport.
 */
export function createPortfolioMcpServer() {
  const server = new McpServer({ ...MCP_SERVER_INFO });

  server.registerTool(
    "list_projects",
    {
      description:
        "List public projects from Ayush Rai's site. Archived records are omitted unless includeArchive is true. Same records and cursor as GET /api/v1/projects.",
      inputSchema: {
        category: z.string().optional().describe("Project category, such as tooling"),
        type: z.string().optional().describe("Project type, such as open-source"),
        limit: z.number().int().min(1).max(20).optional(),
        cursor: z.string().optional().describe("nextCursor from a previous call"),
        includeArchive: z.boolean().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async (args) => {
      const invalid =
        validateProjectCategory(args?.category ?? null) ??
        validateProjectType(args?.type ?? null) ??
        decodeCursor(args?.cursor).error;
      if (invalid) return toolError(invalid.message);
      const page = pagePublicProjects({
        category: args?.category,
        type: args?.type,
        limit: args?.limit,
        includeArchive: args?.includeArchive,
        offset: decodeCursor(args?.cursor).offset,
      });
      return text({ projects: page.items, count: page.items.length, nextCursor: page.nextCursor });
    },
  );

  server.registerTool(
    "get_project",
    {
      description:
        "Fetch one public project by slug. Archived projects require includeArchive. Same record as GET /api/v1/projects/{slug}.",
      inputSchema: {
        slug: z.string().describe("Project slug, such as overlay-text-box"),
        includeArchive: z.boolean().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ slug, includeArchive }) => {
      const invalid = validateSlug(slug);
      if (invalid) return toolError(invalid.message);
      const project = getPublicProject(slug, { includeArchive });
      if (!project) return toolError(`No public project with slug "${slug}".`);
      return text({ project });
    },
  );

  server.registerTool(
    "compare_projects",
    {
      description:
        "Compare two to four public projects by slug. Rejects duplicates. Archived projects are reported as missing unless includeArchive is true. Same comparison as GET /api/v1/compare?slugs= (archive=1).",
      inputSchema: {
        slugs: z.array(z.string()).min(2).max(4).describe("Two to four project slugs"),
        includeArchive: z.boolean().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ slugs, includeArchive }) => {
      const result = comparePublicProjects(slugs, { includeArchive });
      if (!result.ok) return toolError(result.message);
      return text({ projects: result.projects, missing: result.missing });
    },
  );

  server.registerTool(
    "search_portfolio",
    {
      description:
        "Search Ayush Rai's public site index: work, products, projects, research, and notes. Lexical match only, the same function as GET /api/v1/search. Not semantic search. Pass nextCursor back as cursor for the next page.",
      inputSchema: {
        query: z.string().max(200).describe("Search text. Empty returns the default slice."),
        type: z.string().optional().describe("Optional record type, such as work or research"),
        limit: z.number().int().min(1).max(20).optional().describe("Results per page"),
        cursor: z.string().optional().describe("nextCursor from a previous call"),
      },
      annotations: { readOnlyHint: true },
    },
    async (args) => executePortfolioSearch(args),
  );

  return server;
}
