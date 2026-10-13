/**
 * Stdio MCP server for Claude Desktop and other local MCP clients.
 *
 * Builds the portfolio MCP server and connects it to a stdio transport. The tools read the same
 * project records as the website and `/api/projects`. The deployed Streamable HTTP endpoint
 * (`/api/mcp`, api/mcp.ts) builds its server from the same factory. Run with `npm run mcp` or:
 *
 *   npx tsx mcp/server.ts
 *
 * Connects to:
 * - package.json script `mcp`; the local client config is documented in AGENTS.md.
 * - src/lib/agent/mcpServer.ts (createPortfolioMcpServer), re-exported here.
 */
import { pathToFileURL } from "node:url";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createPortfolioMcpServer } from "../src/lib/agent/mcpServer.ts";

export { createPortfolioMcpServer };

/** Creates the server and serves it over stdin/stdout until the client disconnects. */
async function main() {
  const server = createPortfolioMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Start only when run directly, so importing this module (for the re-export) has no side effects.
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
