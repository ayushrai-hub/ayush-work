/**
 * Tests the /pow/fde FDE portfolio page, the /pow/fde/relay RELAY deep dive, and their Markdown twins.
 *
 * Checks the concise FDE portfolio (skills tables, projects table, project breakdowns, experience,
 * RELAY callout, /fde redirect), all interactive RELAY controls on /pow/fde/relay, and that both
 * routes are prerendered, in the sitemap, and indexed in search.
 *
 * Connects to:
 * - src/pages/FdePowPage.tsx, src/pages/FdeRelayPage.tsx, src/components/fde/*, src/content/fde.ts
 * - src/App.tsx, src/lib/agent/markdown.ts, src/lib/publicRoutes.ts, src/content/searchIndex.ts
 */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { nextRovingIndex } from "../components/fde/roving";
import {
  FDE_PATH,
  FDE_RELAY_PATH,
  accountScore,
  fdeAccounts,
  fdePortfolio,
  fdePow,
  fdeProofs,
  fdeRelatedWork,
  fdeRoadmap,
  searchIndex,
} from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { canonicalUrl } from "../lib/canonical";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";

/** Renders the real routes at /pow/fde (or /fde) and waits for the lazy portfolio page. */
async function renderFdePortfolio(initialPath = FDE_PATH) {
  await import("../pages/FdePowPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole("heading", { level: 1, name: fdePortfolio.title }, { timeout: 5000 });
}

/** Renders the real routes at /pow/fde/relay and waits for the lazy RELAY deep-dive page. */
async function renderFdeRelay() {
  await import("../pages/FdeRelayPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={[FDE_RELAY_PATH]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole("heading", { level: 1, name: fdePow.headline }, { timeout: 5000 });
}

/** Main FDE portfolio page (/pow/fde) and /fde redirect. */
describe("FDE portfolio page (/pow/fde)", () => {
  it("resolves every FDE portfolio project against products or projects", () => {
    const proofs = fdeProofs();
    expect(proofs.length).toBeGreaterThanOrEqual(6);
    expect(proofs.map((item) => item.slug)).toEqual(
      fdePortfolio.projects.map((item) => item.slug),
    );
    expect(proofs[0]).toMatchObject({
      slug: "revenueroles",
      kind: "product",
      demoUrl: "https://revenueroles.in",
      href: "/products/revenueroles",
    });
  });

  it("renders who I am, technical and soft skills tables, projects table, experience, and RELAY link", async () => {
    await renderFdePortfolio();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("table")).toHaveLength(3);
    expect(screen.getByRole("heading", { level: 2, name: /Technical skill stack/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Forward deployed & soft skills/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Selected systems & projects/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Experience & education/ })).toBeInTheDocument();

    const relayLink = screen.getByRole("link", { name: fdePortfolio.relayCallout.cta });
    expect(relayLink).toHaveAttribute("href", FDE_RELAY_PATH);

    const techSection = document.getElementById("fde-tech-skills") as HTMLElement;
    const revRolesLinks = within(techSection).getAllByRole("link", { name: "RevenueRoles" });
    expect(revRolesLinks.length).toBeGreaterThanOrEqual(3);
    for (const link of revRolesLinks) {
      expect(link).toHaveAttribute("href", "https://github.com/ayushrai-hub/RevenueRoles");
    }
    expect(within(techSection).getByRole("link", { name: "MailU" })).toHaveAttribute(
      "href",
      "https://github.com/ayushrai-hub/MailU",
    );
    expect(within(techSection).getByRole("link", { name: "MedVoice" })).toHaveAttribute(
      "href",
      "https://github.com/ayushrai-hub/MedVoiceERP",
    );
    expect(within(techSection).getByRole("link", { name: "SpiderWeb" })).toHaveAttribute(
      "href",
      "https://github.com/ayushrai-hub/SpiderWeb",
    );

    for (const proof of fdeProofs()) {
      const card = document.getElementById(`fde-${proof.slug}`);
      expect(card).not.toBeNull();
      const scope = within(card as HTMLElement);
      expect(scope.getByRole("heading", { level: 3, name: proof.title })).toBeInTheDocument();
      if (proof.githubUrl) {
        expect(scope.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", proof.githubUrl);
      }
      if (proof.demoUrl) {
        expect(scope.getByRole("link", { name: "Live" })).toHaveAttribute("href", proof.demoUrl);
      }
    }
  });

  it("redirects /fde to /pow/fde", async () => {
    expect(await renderFdePortfolio("/fde")).toBeInTheDocument();
  });

  it("publishes /pow/fde as Markdown, in the sitemap, prerendered, and in search", () => {
    const markdown = renderPageMarkdown(FDE_PATH) ?? "";
    expect(markdown).toContain("## Technical skill stack");
    expect(markdown).toContain("## Forward deployed & soft skills");
    expect(markdown).toContain("## Selected systems & projects");
    expect(markdown).toContain("RELAY");
    expect(markdown).toContain(FDE_RELAY_PATH);
    expect(markdown).toContain(canonicalUrl(FDE_PATH));
    expect(prerenderRoutes()).toContain(FDE_PATH);
    expect(sitemapRoutes()).toContain(FDE_PATH);
    expect(searchIndex.some((item) => item.href === FDE_PATH)).toBe(true);
  });
});

/** Dedicated RELAY deep-dive page (/pow/fde/relay). */
describe("RELAY FDE proof of work (/pow/fde/relay)", () => {
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

  it("renders the proposal, the back link to /pow/fde, and an empty investigation", async () => {
    await renderFdeRelay();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Back to FDE portfolio/ })).toHaveAttribute("href", FDE_PATH);
    expect(screen.getByText(/Personal engineering project/)).toBeInTheDocument();
    expect(screen.getByText("RELAY has no public repository yet.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore the engineering" })).toHaveAttribute(
      "href",
      `${FDE_RELAY_PATH}#problem`,
    );
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
    await renderFdeRelay();

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
    await renderFdeRelay();

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
    await renderFdeRelay();
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

  it("publishes /pow/fde/relay as Markdown, in the sitemap, prerendered, and in search", () => {
    const markdown = renderPageMarkdown(FDE_RELAY_PATH) ?? "";
    expect(markdown).toContain(fdePow.headline);
    expect(markdown).toContain("Northline Analytics");
    expect(markdown).toContain("RELAY has no public repository yet.");
    expect(markdown).toContain(canonicalUrl(FDE_RELAY_PATH));
    expect(prerenderRoutes()).toContain(FDE_RELAY_PATH);
    expect(sitemapRoutes()).toContain(FDE_RELAY_PATH);
    expect(searchIndex.some((item) => item.href === FDE_RELAY_PATH)).toBe(true);
  });
});
