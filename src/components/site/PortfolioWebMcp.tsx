import { useEffect } from "react";
import { executePortfolioSearch, PORTFOLIO_SEARCH_TOOL } from "../../lib/agent/searchTool";

interface ModelContextLike {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: Record<string, unknown>;
      annotations?: { readOnlyHint?: boolean };
      execute: (args: { query?: string; type?: string }) => Promise<unknown> | unknown;
    },
    options?: { signal?: AbortSignal },
  ) => Promise<void>;
}

function modelContext(): ModelContextLike | undefined {
  const doc = document as Document & { modelContext?: ModelContextLike };
  const nav = navigator as Navigator & { modelContext?: ModelContextLike };
  const candidate = doc.modelContext ?? nav.modelContext;
  if (!candidate || typeof candidate.registerTool !== "function") return undefined;
  return candidate;
}

/** Registers search_portfolio_projects when the browser exposes WebMCP. */
export default function PortfolioWebMcp() {
  useEffect(() => {
    const context = modelContext();
    if (!context) return;
    const controller = new AbortController();
    void context.registerTool(
      {
        name: PORTFOLIO_SEARCH_TOOL.name,
        description: PORTFOLIO_SEARCH_TOOL.description,
        inputSchema: PORTFOLIO_SEARCH_TOOL.inputSchema,
        annotations: PORTFOLIO_SEARCH_TOOL.annotations,
        execute(args) {
          return executePortfolioSearch(args);
        },
      },
      { signal: controller.signal },
    );
    return () => controller.abort();
  }, []);

  return null;
}
