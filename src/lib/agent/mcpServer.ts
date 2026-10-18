/**
 * Builds the MCP server and its four read-only tools over the public project and search records.
 *
 * Tools: `list_projects`, `get_project`, `compare_projects`, and `search_portfolio`. Each calls
 * the same query and validation functions as the REST API, so results match `/api/v1/*`.
 * Protocol errors follow the MCP spec split: an unknown tool name or arguments that fail the tool's
 * zod `inputSchema` are JSON-RPC errors (`-32602` with a `data.code`), raised by the `tools/call`
 * handler installed below. The SDK's own handler would wrap those as `isError` results. Execution
 * errors (shared validator failures, missing records) stay tool results with `isError: true`.
 *
 * Connects to:
 * - `mcp/server.ts` (local stdio server) and `mcpHttp.ts` (remote Streamable HTTP via `api/mcp.ts`).
 * - Depends on `@modelcontextprotocol/sdk`, `zod`, `mcpCard.ts` (server identity), `projectsQuery.ts`,
 *   `searchTool.ts`, `pagination.ts`, and `validate.ts`.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  McpError,
  type CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { MCP_SERVER_INFO, MCP_SERVER_INSTRUCTIONS } from "./mcpCard";
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

/**
 * Tool result flagged `isError` with a readable message and a stable `code` in structuredContent.
 */
function toolError(message: string, code = "tool_error") {
  return {
    isError: true,
    content: [{ type: "text" as const, text: `${code}: ${message}` }],
    structuredContent: { error: { code, message } },
  };
}

type ToolShape = z.ZodRawShape;
type ToolRunner = (args: Record<string, unknown>) => CallToolResult | Promise<CallToolResult>;

/** Human-readable summary of zod issues, such as `slug: expected string, received number`. */
function describeIssues(issues: z.core.$ZodIssue[]): string {
  return issues.map((issue) => `${issue.path.join(".") || "arguments"}: ${issue.message}`).join("; ");
}

/**
 * Read-only tools over the public project records. Shared by stdio and Streamable HTTP.
 * Returns a new, unconnected server; the caller attaches a transport.
 */
export function createPortfolioMcpServer() {
  const server = new McpServer({ ...MCP_SERVER_INFO }, { instructions: MCP_SERVER_INSTRUCTIONS });
  const tools = new Map<string, { schema: z.ZodObject<ToolShape>; run: ToolRunner }>();

  /** Registers a tool with the SDK (for tools/list) and keeps its schema and handler for tools/call. */
  const registerTool = <S extends ToolShape>(
    name: string,
    config: { description: string; inputSchema: S; annotations: { readOnlyHint: boolean } },
    run: (args: z.infer<z.ZodObject<S>>) => CallToolResult | Promise<CallToolResult>,
  ) => {
    server.registerTool(name, config, run as never);
    tools.set(name, { schema: z.object(config.inputSchema), run: run as ToolRunner });
  };

  registerTool(
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
      if (invalid) return toolError(invalid.message, invalid.code);
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

  registerTool(
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
      if (invalid) return toolError(invalid.message, invalid.code);
      const project = getPublicProject(slug, { includeArchive });
      if (!project) return toolError(`No public project with slug "${slug}".`, "not_found");
      return text({ project });
    },
  );

  registerTool(
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
      if (!result.ok) return toolError(result.message, "invalid_compare");
      return text({ projects: result.projects, missing: result.missing });
    },
  );

  registerTool(
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

  server.server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: rawArgs } = request.params;
    const tool = tools.get(name);
    if (!tool) {
      throw new McpError(ErrorCode.InvalidParams, `Unknown tool "${name}". Call tools/list for the available tools.`, {
        code: "unknown_tool",
        tools: [...tools.keys()],
      });
    }
    const parsed = tool.schema.safeParse(rawArgs ?? {});
    if (!parsed.success) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid arguments for ${name}: ${describeIssues(parsed.error.issues)}`, {
        code: "invalid_arguments",
        issues: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
      });
    }
    return tool.run(parsed.data);
  });

  return server;
}
