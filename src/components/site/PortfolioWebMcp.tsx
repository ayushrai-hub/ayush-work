/**
 * Registers WebMCP tools when the browser exposes modelContext and the classic script has not.
 *
 * Prefers `document.modelContext.registerTool()`, with `navigator.modelContext.registerTool()` only
 * as a trailing compatibility fallback. Skips work when `window.__ayushWebMcpRegistered` is already
 * set by `/webmcp.js`. Uses direct member expressions on `document.modelContext` and
 * `navigator.modelContext` so minifiers preserve the exact property chains in the compiled bundle.
 *
 * Connects to:
 * - Rendered once by SiteLayout. `public/webmcp.js` is the classic-script registration path.
 * - `lib/agent/searchTool` for the React-side search tool (`search_portfolio_projects`).
 */
import { useEffect } from "react";
import { executePortfolioSearch, PORTFOLIO_SEARCH_TOOL } from "../../lib/agent/searchTool";

/** Minimal shape of a WebMCP tool definition passed to `registerTool`. */
interface WebMcpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (args: { query?: string; type?: string; limit?: number; cursor?: string }) => Promise<unknown> | unknown;
}

/** Minimal shape of the WebMCP modelContext object on `document` or `navigator`. */
interface ModelContextLike {
  registerTool: (tool: WebMcpToolDefinition, options?: { signal?: AbortSignal }) => Promise<void> | void;
}

declare global {
  interface Document {
    modelContext?: ModelContextLike;
  }
  interface Navigator {
    modelContext?: ModelContextLike;
  }
}

/**
 * Registers a tool via `document.modelContext.registerTool()` first, falling back to
 * `navigator.modelContext.registerTool()` only when `document.modelContext` is unavailable.
 */
function registerWithModelContext(
  tool: WebMcpToolDefinition,
  options: { signal: AbortSignal },
): Promise<void> | null {
  if (
    typeof document !== "undefined" &&
    document.modelContext &&
    typeof document.modelContext.registerTool === "function"
  ) {
    return Promise.resolve().then(() => document.modelContext!.registerTool(tool, options));
  }
  if (
    typeof navigator !== "undefined" &&
    navigator.modelContext &&
    typeof navigator.modelContext.registerTool === "function"
  ) {
    return Promise.resolve().then(() => navigator.modelContext!.registerTool(tool, options));
  }
  return null;
}

/** Registers search_portfolio_projects when WebMCP exists and `/webmcp.js` has not already run. */
export default function PortfolioWebMcp() {
  useEffect(() => {
    const flag = window as Window & { __ayushWebMcpRegistered?: boolean };
    if (flag.__ayushWebMcpRegistered) return;
    const controller = new AbortController();
    const registration = registerWithModelContext(
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
    if (!registration) return;
    registration.catch((error: unknown) => {
      console.warn("WebMCP tool registration failed", error);
    });
    return () => controller.abort();
  }, []);

  return null;
}
