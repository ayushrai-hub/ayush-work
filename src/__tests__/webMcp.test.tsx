/**
 * Tests the WebMCP registration component.
 *
 * Verifies that PortfolioWebMcp registers `search_portfolio_projects` on
 * `document.modelContext`, aborts the registration signal on unmount, and logs a
 * warning instead of leaking an unhandled rejection when registration fails.
 *
 * Connects to:
 * - src/components/site/PortfolioWebMcp.tsx
 * - src/lib/agent/searchTool.ts (PORTFOLIO_SEARCH_TOOL)
 */
import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PortfolioWebMcp from "../components/site/PortfolioWebMcp";

type DocWithContext = Document & { modelContext?: { registerTool: ReturnType<typeof vi.fn> } };

afterEach(() => {
  delete (document as DocWithContext).modelContext;
  vi.restoreAllMocks();
});

/** Registration, unregistration on unmount, and failure handling. */
describe("PortfolioWebMcp", () => {
  it("registers the search tool and aborts it on unmount", async () => {
    const registerTool = vi.fn().mockResolvedValue(undefined);
    (document as DocWithContext).modelContext = { registerTool };

    const { unmount } = render(<PortfolioWebMcp />);
    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(1));

    const [tool, options] = registerTool.mock.calls[0];
    expect(tool.name).toBe("search_portfolio_projects");
    expect(options.signal.aborted).toBe(false);
    unmount();
    expect(options.signal.aborted).toBe(true);
  });

  it("logs a warning when registration rejects", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    (document as DocWithContext).modelContext = {
      registerTool: vi.fn().mockRejectedValue(new Error("not allowed")),
    };

    render(<PortfolioWebMcp />);
    await waitFor(() => expect(warn).toHaveBeenCalledWith("WebMCP tool registration failed", expect.any(Error)));
  });
});
