/**
 * Route, interaction, and Markdown tests for /pow/agentic-ai.
 *
 * Renders the real route and walks the workbench, approval, registry, failure lab,
 * and decision controls. Also checks the twin, prerender list, and search item.
 *
 * Connects to:
 * - src/pages/AgenticPowPage.tsx and src/App.tsx.
 * - src/lib/agent/markdown.ts, src/lib/publicRoutes.ts, src/content/searchIndex.ts.
 */
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { searchIndex } from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";
import { canonicalUrl } from "../lib/canonical";

/** Renders the lazy route and waits for the headline. */
async function renderPage() {
  await import("../pages/AgenticPowPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={["/pow/agentic-ai"]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole("heading", { level: 1, name: /Agents that do the work/ }, { timeout: 15000 });
}

describe("agentic proof of work", { timeout: 20000 }, () => {
  it("is routed, prerendered, searchable, and honest in Markdown", async () => {
    expect(await renderPage()).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: "Agents" })[0]).toHaveAttribute("href", "/pow/agentic-ai");
    expect(screen.getAllByRole("link", { name: "FDE" })[0]).toHaveAttribute("href", "/pow/fde");
    expect(screen.getAllByRole("link", { name: "Product" })[0]).toHaveAttribute("href", "/pow/product-management");
    expect(screen.getAllByRole("link", { name: "Benchmark" })[0]).toHaveAttribute("href", "/pow/ai-benchmark");
    const markdown = renderPageMarkdown("/pow/agentic-ai") ?? "";
    expect(markdown).toContain("does not call a model");
    expect(markdown).toContain(canonicalUrl("/pow/agentic-ai"));
    expect(prerenderRoutes()).toContain("/pow/agentic-ai");
    expect(sitemapRoutes()).toContain("/pow/agentic-ai");
    expect(searchIndex.some((item) => item.href === "/pow/agentic-ai")).toBe(true);
  });

  it("approves a write, verifies it, and does not execute a rejection", async () => {
    const user = userEvent.setup();
    await renderPage();
    await user.click(screen.getByRole("button", { name: "Run until it stops" }));
    const approval = document.getElementById("approval");
    expect(approval).not.toBeNull();
    const panel = within(approval as HTMLElement);
    expect(panel.getByText("proposed")).toBeInTheDocument();
    await user.click(panel.getByRole("button", { name: "Approve action" }));
    expect(panel.getByText("Executed")).toBeInTheDocument();
    await user.click(panel.getByRole("button", { name: "Verify task record" }));
    expect(panel.getByText("Verified")).toBeInTheDocument();
    await user.click(panel.getByRole("button", { name: "Approve action" }));
    expect(panel.getByText(/approval_ignored/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Prepare an internal escalation" }));
    await user.click(screen.getByRole("button", { name: "Run until it stops" }));
    await user.click(panel.getByRole("button", { name: "Reject action" }));
    expect(panel.getByText("Not executed")).toBeInTheDocument();
    expect(panel.getByText(/The write was not called/)).toBeInTheDocument();
  });

  it("rejects a malformed tool call and runs a failure scenario", async () => {
    const user = userEvent.setup();
    await renderPage();
    await user.click(screen.getByRole("button", { name: "Load malformed example" }));
    await user.click(screen.getByRole("button", { name: "Call tool" }));
    const tools = document.getElementById("tools");
    expect(tools).not.toBeNull();
    expect((tools as HTMLElement).textContent?.toLowerCase()).toMatch(/accountid|required/);
    await user.click(screen.getByRole("radio", { name: "Failed verification" }));
    const failures = document.getElementById("failures");
    expect(failures).not.toBeNull();
    expect((failures as HTMLElement).textContent).toMatch(/Unverified/);
    await user.click(screen.getByRole("tab", { name: "Retry versus escalation" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("One retry");
    const architecture = screen.getByRole("button", { name: "Result verifier" });
    await user.click(architecture);
    expect(architecture).toHaveAttribute("aria-pressed", "true");
  });

  it("stops the missing-information task without a write", async () => {
    const user = userEvent.setup();
    await renderPage();
    await user.click(screen.getByRole("button", { name: "Find missing information before acting" }));
    await user.click(screen.getByRole("button", { name: "Run until it stops" }));
    const state = document.getElementById("state");
    expect(state).not.toBeNull();
    expect(within(state as HTMLElement).getByText("Incomplete")).toBeInTheDocument();
  });

  it("validates registry writes and replays every failure scenario", async () => {
    const user = userEvent.setup();
    await renderPage();
    const tools = document.getElementById("tools") as HTMLElement;
    await user.click(within(tools).getByRole("button", { name: /create_internal_task/ }));
    await user.click(within(tools).getByRole("button", { name: "Call tool" }));
    expect(tools.textContent).toMatch(/controller approval/);
    await user.click(within(tools).getByRole("checkbox", { name: /Controller approval/ }));
    await user.click(within(tools).getByRole("button", { name: "Call tool" }));
    expect(tools.textContent).toMatch(/Registry writes: 1/);
    await user.click(within(tools).getByRole("button", { name: "Call tool" }));
    expect(tools.textContent).toMatch(/Registry writes: 1/);
    expect(tools.textContent).toMatch(/duplicate/);
    fireEvent.change(within(tools).getByRole("textbox", { name: /Tool arguments/ }), { target: { value: "{" } });
    await user.click(within(tools).getByRole("button", { name: "Call tool" }));
    expect(tools.textContent).toMatch(/not valid JSON/);
    await user.click(within(tools).getByRole("button", { name: "Reset registry store" }));
    expect(tools.textContent).toMatch(/Registry writes: 0/);

    const failures = document.getElementById("failures") as HTMLElement;
    const scenarios = [
      ["Tool timeout", /retries once/],
      ["Invalid tool arguments", /handler counter stays at zero/],
      ["Conflicting evidence", /uncertain/i],
      ["Duplicate action request", /one row/],
      ["Rejected approval", /not stored/],
      ["Failed verification", /Unverified/],
      ["Maximum execution budget", /two executed steps/],
      ["Untrusted tool output", /Ignore previous instructions/],
    ] as const;
    for (const [name, pattern] of scenarios) {
      await user.click(within(failures).getByRole("radio", { name }));
      expect(failures.textContent).toMatch(pattern);
    }
    await user.click(within(failures).getByRole("button", { name: "Run this scenario again" }));
    expect(failures.textContent).toMatch(/Ignore previous instructions/);

    await user.click(screen.getByRole("button", { name: "Summarize unresolved support issues" }));
    await user.click(screen.getByRole("button", { name: "Run next step" }));
    await user.click(screen.getByRole("button", { name: "Reset run" }));
    expect(screen.getByRole("button", { name: "Summarize unresolved support issues" })).toHaveAttribute("aria-pressed", "true");
  });
});
