/**
 * Registers WebMCP tools when the browser exposes modelContext and the classic script has not.
 *
 * Prefers `document.modelContext`, then `navigator.modelContext`. Skips work when
 * `window.__ayushWebMcpRegistered` is already set by `/webmcp.js`. Uses bracket access with
 * string literals so minifiers leave `modelContext` / `registerTool` detectable in the bundle.
 *
 * Connects to:
 * - Rendered once by SiteLayout. `public/webmcp.js` is the primary registration path for scanners.
 * - `lib/agent/searchTool` for the React-side search tool only (extra tools live in webmcp.js).
 */
import { useEffect } from "react";
import { executePortfolioSearch, PORTFOLIO_SEARCH_TOOL } from "../../lib/agent/searchTool";

/** Property names scanners and the WebMCP draft look for — keep as string literals. */
const MODEL_CONTEXT_KEY = "modelContext";
const REGISTER_TOOL_KEY = "registerTool";

/** Minimal shape of the WebMCP model context this component needs. */
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

/** Returns document.modelContext, else navigator.modelContext, if registerTool exists. */
function modelContext(): ModelContextLike | undefined {
  const doc = document as Document & Record<string, unknown>;
  const nav = navigator as Navigator & Record<string, unknown>;
  const candidate = (doc[MODEL_CONTEXT_KEY] ?? nav[MODEL_CONTEXT_KEY]) as ModelContextLike | undefined;
  if (!candidate || typeof candidate[REGISTER_TOOL_KEY] !== "function") return undefined;
  return candidate;
}

/** Registers search_portfolio_projects when WebMCP exists and `/webmcp.js` has not already run. */
export default function PortfolioWebMcp() {
  useEffect(() => {
    const flag = window as Window & { __ayushWebMcpRegistered?: boolean };
    if (flag.__ayushWebMcpRegistered) return;
    const context = modelContext();
    if (!context) return;
    const controller = new AbortController();
    const registerTool = context[REGISTER_TOOL_KEY].bind(context);
    Promise.resolve()
      .then(() =>
        registerTool(
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
        ),
      )
      .catch((error: unknown) => {
        console.warn("WebMCP tool registration failed", error);
      });
    return () => controller.abort();
  }, []);

  return null;
}
