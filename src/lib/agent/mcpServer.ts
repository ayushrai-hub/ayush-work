import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCP_SERVER_INFO } from "./mcpCard";
import { decodeCursor } from "./pagination";
import { comparePublicProjects, getPublicProject, pagePublicProjects } from "./projectsQuery";
import { executePortfolioSearch } from "./searchTool";
import { validateProjectCategory, validateProjectType, validateSlug } from "./validate";

function text(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

function toolError(message: string) {
  return { isError: true, content: [{ type: "text" as const, text: message }] };
}

/** Read-only tools over the public project records. Shared by stdio and Streamable HTTP. */
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
        "Compare two to four public projects by slug. Rejects duplicates. Same comparison as GET /api/v1/compare?slugs=.",
      inputSchema: {
        slugs: z.array(z.string()).min(2).max(4).describe("Two to four project slugs"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ slugs }) => {
      const result = comparePublicProjects(slugs);
      if (!result.ok) return toolError(result.message);
      return text({ projects: result.projects, missing: result.missing });
    },
  );

  server.registerTool(
    "search_portfolio",
    {
      description:
        "Search Ayush Rai's public site index: work, products, projects, research, and notes. Lexical match only, the same function as GET /api/v1/search. Not semantic search.",
      inputSchema: {
        query: z.string().max(200).describe("Search text. Empty returns the default slice."),
        type: z.string().optional().describe("Optional record type, such as work or research"),
      },
      annotations: { readOnlyHint: true },
    },
    async (args) => executePortfolioSearch(args),
  );

  return server;
}
