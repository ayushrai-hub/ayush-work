/**
 * Registers the WebMCP tool `search_portfolio_projects` for browser agents, when the browser supports it.
 *
 * On mount, looks for a `modelContext` object with `registerTool` on `document`, falling back to
 * `navigator`. If none exists it does nothing. Otherwise it registers the tool definition from
 * PORTFOLIO_SEARCH_TOOL with an AbortSignal and aborts on unmount, which unregisters the tool.
 * Renders nothing.
 *
 * Connects to:
 * - Rendered once by SiteLayout, so it is active on every route
 * - lib/agent/searchTool: PORTFOLIO_SEARCH_TOOL and executePortfolioSearch, which validate input and
 *   call the same lexical search as GET /api/search
 */
import { useEffect } from "react";
import { executePortfolioSearch, PORTFOLIO_SEARCH_TOOL } from "../../lib/agent/searchTool";

/** Minimal shape of the WebMCP model context this component needs; TypeScript's DOM types do not include it. */
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

/** Returns `document.modelContext`, else `navigator.modelContext`, if it exposes `registerTool`. */
function modelContext(): ModelContextLike | undefined {
  const doc = document as Document & { modelContext?: ModelContextLike };
  const nav = navigator as Navigator & { modelContext?: ModelContextLike };
  const candidate = doc.modelContext ?? nav.modelContext;
  if (!candidate || typeof candidate.registerTool !== "function") return undefined;
  return candidate;
}

/** Registers search_portfolio_projects when the browser exposes WebMCP; the abort on cleanup unregisters it. */
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
