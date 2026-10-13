/**
 * Stdio MCP server for Claude Desktop and other local MCP clients.
 * Tools read the same project records as the website and /api/projects.
 * The deployed Streamable HTTP endpoint is /api/mcp and uses the same server.
 *
 *   npx tsx mcp/server.ts
 */
import { pathToFileURL } from "node:url";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createPortfolioMcpServer } from "../src/lib/agent/mcpServer.ts";

export { createPortfolioMcpServer };

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
