/**
 * Tests the product-management proof-of-work page and its Markdown twin.
 *
 * Renders the real route, checks the case study stays labeled, moves the prioritization ranking,
 * filters the synthetic funnel, and confirms the FDE route is still linked and prerendered.
 *
 * Connects to:
 * - src/pages/ProductManagementPowPage.tsx, src/pages/FdePowPage.tsx, src/App.tsx
 * - src/content/productManagementPow.ts, src/lib/productManagementScore.ts
 * - src/lib/agent/markdown.ts, src/lib/publicRoutes.ts, src/content/searchIndex.ts
 */
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { initiatives } from "../content/productManagementPow";
import { searchIndex } from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { DEFAULT_WEIGHTS, rankInitiatives } from "../lib/productManagementScore";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";

/** Renders the proof-of-work route inside the site shell and waits for the lazy page. */
async function renderPow() {
  await import("../pages/ProductManagementPowPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={["/pow/product-management"]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole(
    "heading",
    { level: 1, name: "I turn ambiguous problems into products people can use." },
    { timeout: 15000 },
  );
}

/** The page, the ranking, the synthetic funnel, and the twin. */
describe("product management proof of work", () => {
  it("renders the case study, keeps hypotheses distinct, and links the FDE page", async () => {
    const user = userEvent.setup();
    expect(await renderPow()).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 2, name: /RevenueRoles/ })).toBeInTheDocument();
    expect(screen.getAllByText("Verified fact").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Hypothesis").length).toBeGreaterThan(0);
    expect(screen.getByText("Proposed experiment. It has not been run.")).toBeInTheDocument();
    expect(screen.getAllByText("Baseline not yet measured.").length).toBeGreaterThan(0);
    expect(screen.getByText("Synthetic demonstration data")).toBeInTheDocument();
    expect(screen.queryByText(/statistically significant/i)).toBeNull();

    expect(screen.getByRole("link", { name: "View my products" })).toHaveAttribute("href", "/products");
    expect(screen.getAllByRole("link", { name: "FDE / POW" }).length).toBeGreaterThan(0);
    const fdeLinks = screen.getAllByRole("link", { name: "FDE proof of work" });
    expect(fdeLinks.length).toBeGreaterThan(0);
    for (const link of fdeLinks) expect(link).toHaveAttribute("href", "/pow/fde");

    const discover = screen.getByRole("tab", { name: "Discover" });
    discover.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Define" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Measure" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Discover" })).toHaveAttribute("aria-selected", "true");

    const acceptance = screen.getByText("Acceptance criteria").closest("details");
    expect(acceptance).toHaveProperty("open", false);
    await user.click(screen.getByText("Acceptance criteria"));
    expect(acceptance).toHaveProperty("open", true);
    expect(screen.getAllByText(/Verification time unknown/).length).toBeGreaterThan(0);
  }, 20000);

  it("re-ranks initiatives when a score changes and labels synthetic funnel filters", async () => {
    expect(await renderPow()).toBeInTheDocument();
    const list = screen.getByRole("list", { name: "Initiative ranking" });
    const leader = rankInitiatives(
      initiatives.map((item) => ({ ...item, ...item.estimate })),
      DEFAULT_WEIGHTS,
    )[0];
    expect(within(list).getAllByRole("button")[0]).toHaveTextContent(leader.title);

    await userEvent.click(within(list).getAllByRole("button")[0]);
    fireEvent.change(screen.getByRole("slider", { name: `${leader.title} User value` }), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByRole("slider", { name: `${leader.title} Confidence in the evidence` }), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByRole("slider", { name: `${leader.title} Implementation effort` }), {
      target: { value: "5" },
    });
    expect(within(list).getAllByRole("button")[0]).not.toHaveTextContent(leader.title);

    await userEvent.click(screen.getByRole("button", { name: "Reset scores" }));
    expect(within(list).getAllByRole("button")[0]).toHaveTextContent(leader.title);

    fireEvent.change(screen.getByRole("slider", { name: "Weight on user value versus strategic alignment" }), {
      target: { value: "0.8" },
    });
    expect(screen.getByText(/user value × 0.80/)).toBeInTheDocument();

    const table = screen.getByRole("table", { name: /Synthetic funnel/ });
    expect(within(table).getByText("240")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Segment"), { target: { value: "gtm" } });
    fireEvent.change(screen.getByLabelText("Window"), { target: { value: "7d" } });
    expect(within(table).getByText("5")).toBeInTheDocument();
    expect(within(table).getAllByText("—").length).toBeGreaterThan(0);
    expect(screen.getByText(/not RevenueRoles performance/)).toBeInTheDocument();
  }, 20000);

  it("publishes a Markdown twin and prerenders both proof-of-work routes", () => {
    const markdown = renderPageMarkdown("/pow/product-management") ?? "";
    expect(markdown).toContain("Verified facts");
    expect(markdown).toContain("Hypotheses");
    expect(markdown).toContain("synthetic demonstration data");
    expect(markdown).toContain("Baseline not yet measured");
    expect(markdown).toContain("has not been run");
    expect(markdown.toLowerCase()).not.toContain("statistically significant");
    expect(prerenderRoutes()).toContain("/pow/product-management");
    expect(prerenderRoutes()).toContain("/pow/fde");
    expect(sitemapRoutes()).toContain("/pow/product-management");
    expect(searchIndex.some((item) => item.href === "/pow/product-management")).toBe(true);
    expect(searchIndex.some((item) => item.href === "/pow/fde")).toBe(true);
    expect(renderPageMarkdown("/pow/fde")).toContain("RELAY");
  });
});
