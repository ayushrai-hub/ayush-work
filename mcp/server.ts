/**
 * Stdio MCP server for Claude Desktop and other local MCP clients.
 * Tools read the same project records as the website and /api/projects.
 *
 *   npx tsx mcp/server.ts
 */
import { pathToFileURL } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  comparePublicProjects,
  getPublicProject,
  listPublicProjects,
} from "../src/lib/agent/projectsQuery.ts";
import {
  validateProjectCategory,
  validateProjectType,
  validateSlug,
} from "../src/lib/agent/validate.ts";

function text(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

export function createPortfolioMcpServer() {
  const server = new McpServer({
    name: "ayush-portfolio",
    version: "1.0.0",
  });

  server.registerTool(
    "list_projects",
    {
      description:
        "List public projects from Ayush Rai's site. Archived records are omitted unless includeArchive is true. Same records as GET /api/v1/projects.",
      inputSchema: {
        category: z.string().optional().describe("Project category, such as tooling"),
        type: z.string().optional().describe("Project type, such as open-source"),
        limit: z.number().int().min(1).max(20).optional(),
        includeArchive: z.boolean().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async (args) => {
      const categoryError = validateProjectCategory(args?.category ?? null);
      const typeError = validateProjectType(args?.type ?? null);
      const invalid = categoryError ?? typeError;
      if (invalid) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: invalid.message }],
        };
      }
      const projects = listPublicProjects({
        category: args?.category,
        type: args?.type,
        limit: args?.limit,
        includeArchive: args?.includeArchive,
      });
      return text({ projects, count: projects.length });
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
      if (invalid) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: invalid.message }],
        };
      }
      const project = getPublicProject(slug, { includeArchive });
      if (!project) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: `No public project with slug "${slug}".` }],
        };
      }
      return text({ project });
    },
  );

  server.registerTool(
    "compare_projects",
    {
      description:
        "Compare two to four public projects by slug. Rejects duplicates. Same comparison as GET /api/v1/compare?slugs=.",
      inputSchema: {
        slugs: z
          .array(z.string())
          .min(2)
          .max(4)
          .describe("Two to four project slugs"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ slugs }) => {
      const result = comparePublicProjects(slugs);
      if (!result.ok) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: result.message }],
        };
      }
      return text({ projects: result.projects, missing: result.missing });
    },
  );

  return server;
}

async function main() {
  const server = createPortfolioMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

const invoked = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (invoked) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  });
}
