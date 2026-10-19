/**
 * Tests the /pow/fde forward-deployed engineering page, its interactions, and its Markdown twin.
 *
 * Checks the hero, the simulated investigation, the stage, architecture, decision, failure, and
 * deployment controls, the roadmap statuses, related-work links taken from the product and project
 * records, and that the route is prerendered, indexed, and present in navigation.
 *
 * Connects to:
 * - src/pages/FdePowPage.tsx, src/components/fde/*, src/content/fde.ts, src/App.tsx
 * - src/lib/agent/markdown.ts, src/lib/publicRoutes.ts, src/content/searchIndex.ts
 */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { nextRovingIndex } from "../components/fde/roving";
import { accountScore, fdeAccounts, fdePow, fdeRelatedWork, fdeRoadmap, searchIndex } from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { canonicalUrl } from "../lib/canonical";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";

/** Renders the real routes at /pow/fde and waits for the lazy page. */
async function renderFde() {
  await import("../pages/FdePowPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={["/pow/fde"]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole("heading", { level: 1, name: fdePow.headline }, { timeout: 5000 });
}

/** Route, records, and the simulated investigation. */
describe("FDE proof of work", () => {
  it("scores an account as the sum of its rule points", () => {
    expect(accountScore(fdeAccounts[0])).toBe(90);
    expect(accountScore(fdeAccounts[1])).toBe(20);
    expect(fdeRoadmap.map((phase) => phase.status)).toEqual([
      "implemented",
      "planned",
      "planned",
      "planned",
      "planned",
      "planned",
    ]);
    expect(fdeRelatedWork().map((item) => item.slug)).toEqual([
      "revenueroles",
      "revenue-intelligence-engine",
      "agenyra",
      "spiderweb",
      "medvoice",
      "the-open-framework",
      "personal-portfolio",
    ]);
  });

  it("moves a roving index for arrows, Home, and End", () => {
    expect(nextRovingIndex("ArrowDown", 0, 3)).toBe(1);
    expect(nextRovingIndex("ArrowUp", 0, 3)).toBe(2);
    expect(nextRovingIndex("ArrowRight", 2, 3)).toBe(0);
    expect(nextRovingIndex("ArrowLeft", 0, 3)).toBe(2);
    expect(nextRovingIndex("Home", 2, 3)).toBe(0);
    expect(nextRovingIndex("End", 0, 3)).toBe(2);
    expect(nextRovingIndex("Enter", 0, 3)).toBeNull();
    expect(nextRovingIndex("ArrowDown", 0, 0)).toBeNull();
  });

  it("renders the proposal, the navigation entry, and an empty investigation", async () => {
    await renderFde();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText(/Personal engineering project/)).toBeInTheDocument();
    expect(screen.getByText("RELAY has no public repository yet.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore the engineering" })).toHaveAttribute("href", "/pow/fde#problem");
    expect(screen.getByRole("link", { name: "View my GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/ayushrai-hub",
    );
    expect(screen.getAllByRole("link", { name: "POW" }).length).toBeGreaterThan(0);
    expect(screen.getByText(/Select a synthetic account/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "This page does not exist yet." })).not.toBeInTheDocument();
  });

  it("walks the workflow, architecture, decisions, failures, and deployment sequence", async () => {
    const user = userEvent.setup();
    await renderFde();

    const ingest = screen.getByRole("tab", { name: /Ingest events/ });
    ingest.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("tab", { name: /Normalize records/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/A validated raw event/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /AI services/ }));
    expect(screen.getByText(/A provider sits behind this module/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Human approval versus/ }));
    expect(screen.getByText(/The system proposes/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Unavailable model providers" }));
    expect(screen.getByText(/Scoring and evidence retrieval still run/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Handoff/ }));
    expect(screen.getByText("Operational runbook")).toBeInTheDocument();
  });

  it("investigates a synthetic account without calling a workflow", async () => {
    const user = userEvent.setup();
    await renderFde();

    await user.click(screen.getByRole("button", { name: /Harbor & Co/ }));
    expect(screen.getByRole("heading", { level: 3, name: "Harbor & Co" })).toBeInTheDocument();
    expect(screen.getByText("Sum of the rule points below. A model does not set this number.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Conflicting owner notes/ }));
    expect(screen.getByText("Owner field: Priya Shah.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Conflicting owner notes/ }));
    expect(screen.queryByText("Owner field: Priya Shah.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Preview the approval gate" }));
    expect(screen.getByText(/Recorded in this preview only/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Signals" }));
    expect(screen.getByText(/Add 10 when two sources disagree/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Workflow Center" }));
    expect(screen.getByText("Execution is not connected in this preview.")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Approvals" }));
    expect(screen.getByText(/A person has to confirm the hold/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Audit Trail" }));
    expect(screen.getByText(/Sample audit row/)).toBeInTheDocument();
    expect(screen.getByText("approval: previewed locally")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Integrations" }));
    expect(screen.getAllByText("Not connected")).toHaveLength(4);

    await user.click(screen.getByRole("tab", { name: "Overview" }));
    await user.click(screen.getByRole("button", { name: "Open the investigation" }));
    expect(screen.getByRole("tab", { name: "Account Investigation" })).toHaveAttribute("aria-selected", "true");

    await user.click(screen.getByRole("tab", { name: "Account Explorer" }));
    await user.click(screen.getByRole("button", { name: /Fieldnote/ }));
    expect(screen.getByRole("heading", { level: 3, name: "Fieldnote" })).toBeInTheDocument();
  });

  it("shows planned phases and links related work to the recorded URLs", async () => {
    await renderFde();
    expect(
      screen.getByText("Implemented in this repository as a client-side page. It is not a separate RELAY service."),
    ).toBeInTheDocument();
    expect(screen.getByText("Planned. No customer environment is connected.")).toBeInTheDocument();

    const revenue = document.getElementById("related-revenueroles");
    expect(revenue).not.toBeNull();
    expect(within(revenue as HTMLElement).getByRole("link", { name: "Live" })).toHaveAttribute(
      "href",
      "https://revenueroles.in",
    );
    const engine = document.getElementById("related-revenue-intelligence-engine");
    expect(within(engine as HTMLElement).getByRole("link", { name: "Recorded demo" })).toHaveAttribute(
      "href",
      "https://cashmaker-two.vercel.app",
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/ayushrai02/",
    );
  });

  it("publishes the same record as Markdown, the sitemap, and search", () => {
    const markdown = renderPageMarkdown("/pow/fde") ?? "";
    expect(markdown).toContain(fdePow.headline);
    expect(markdown).toContain("Northline Analytics");
    expect(markdown).toContain("RELAY has no public repository yet.");
    expect(markdown).toContain(canonicalUrl("/pow/fde"));
    expect(prerenderRoutes()).toContain("/pow/fde");
    expect(sitemapRoutes()).toContain("/pow/fde");
    expect(searchIndex.some((item) => item.href === "/pow/fde")).toBe(true);
  });
});
