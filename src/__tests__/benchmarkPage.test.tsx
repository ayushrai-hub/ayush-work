/**
 * Tests the /pow/ai-benchmark page, its alias redirect, and the Markdown twin.
 *
 * Renders the real route and exercises the inspectors. The numbers on the page
 * come from the fixture; the test checks that the synthetic disclaimer and the
 * derived pass counts are visible.
 *
 * Connects to:
 * - src/pages/BenchmarkEngineeringPage.tsx and src/components/benchmark/*.
 * - src/App.tsx, src/lib/publicRoutes.ts, src/lib/agent/markdown.ts, searchIndex.
 */
import { fireEvent, render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import "../pages/BenchmarkEngineeringPage";
import { searchIndex } from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";

/** Renders the benchmark route and waits for the lazy page. */
async function renderBenchmark(path = "/pow/ai-benchmark") {
  await import("../pages/BenchmarkEngineeringPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole(
    "heading",
    { level: 1, name: "Don't just compare models. Understand why they fail." },
    { timeout: 15000 },
  );
}

/** The page, the redirect, and the sections a reader can operate. */
describe("AI benchmark engineering page", { timeout: 40000 }, () => {
  it("renders the demonstration and links the other proof-of-work routes", async () => {
    expect(await renderBenchmark()).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByText(/Synthetic demonstration results/).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /^FDE$/ })).toHaveAttribute("href", "/pow/fde");
    expect(screen.getByRole("link", { name: /^Product$/ })).toHaveAttribute("href", "/pow/product-management");
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/ayushrai-hub");
    expect(screen.getAllByText("6/8").length).toBeGreaterThan(0);
    expect(screen.getAllByText("3/8").length).toBeGreaterThan(0);
  });

  it("redirects the longer path to the series route", async () => {
    expect(await renderBenchmark("/pow/benchmark-engineering")).toBeInTheDocument();
  });

  it("inspects a principle, a lifecycle stage, and the reasoning specification", async () => {
    await renderBenchmark();
    fireEvent.click(screen.getByRole("button", { name: /Failed cases are often more informative/ }));
    expect(screen.getByText(/Profile East’s fee answer/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /06/ }));
    expect(screen.getByText(/Apply exact match/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Structured reasoning" }));
    expect(screen.getByText(/Exact match when the answer is a single defined string/)).toBeInTheDocument();
  });

  it("filters the dataset, shows why the bad row is rejected, and surfaces the audit fixture", async () => {
    await renderBenchmark();
    const dataset = document.getElementById("dataset");
    expect(dataset).not.toBeNull();
    const scope = within(dataset as HTMLElement);
    fireEvent.click(scope.getByRole("button", { name: "Add a duplicate and a schema break" }));
    expect(scope.getByText(/duplicate-task/)).toBeInTheDocument();
    expect(scope.getByText(/invalid-schema/)).toBeInTheDocument();
    fireEvent.click(scope.getByRole("button", { name: "Rejected" }));
    expect(scope.getByText(/The prompt does not say better at what/)).toBeInTheDocument();
    fireEvent.click(scope.getByRole("button", { name: "Coding" }));
  });

  it("filters the playground, including a combination with no rows", async () => {
    await renderBenchmark();
    const scope = within(document.getElementById("playground") as HTMLElement);
    fireEvent.click(scope.getByRole("button", { name: "Profile East" }));
    fireEvent.click(scope.getByRole("button", { name: /reason-fee/ }));
    expect(scope.getByText(/Exact match fails closed on extra text/)).toBeInTheDocument();
    fireEvent.click(scope.getByRole("button", { name: "Coding" }));
    fireEvent.click(scope.getByRole("button", { name: "Fail" }));
    expect(scope.getByText(/No stored case matches this filter/)).toBeInTheDocument();
  });

  it("switches scoring methods and opens a results row", async () => {
    await renderBenchmark();
    const scoring = within(document.getElementById("scoring") as HTMLElement);
    fireEvent.click(scoring.getByRole("button", { name: "Unit tests" }));
    expect(scoring.getByText(/does not execute the functions/)).toBeInTheDocument();
    fireEvent.click(scoring.getByRole("button", { name: "Rubric" }));
    expect(scoring.getByText(/no second rater/)).toBeInTheDocument();
    fireEvent.click(scoring.getByRole("button", { name: "Pairwise preference" }));
    expect(scoring.getByText(/A tie is a result/)).toBeInTheDocument();

    const results = within(document.getElementById("results") as HTMLElement);
    fireEvent.click(results.getByRole("button", { name: "Coding" }));
    fireEvent.click(results.getByRole("button", { name: "Profile West" }));
    expect(results.getByText(/code-sum-evens/)).toBeInTheDocument();
  });

  it("changes the difficulty slice and refuses a profile compared with itself", async () => {
    await renderBenchmark();
    const scope = within(document.getElementById("reliability") as HTMLElement);
    fireEvent.click(scope.getByRole("button", { name: "Hard only" }));
    expect(scope.getAllByText("1/2").length).toBeGreaterThan(0);
    fireEvent.change(scope.getByRole("combobox", { name: "Second profile" }), {
      target: { value: "north" },
    });
    expect(scope.getByText(/Choose two different profiles/)).toBeInTheDocument();
  });

  it("publishes a Markdown twin, a prerendered route, and a search record", async () => {
    const markdown = renderPageMarkdown("/pow/ai-benchmark") ?? "";
    expect(markdown).toContain("Synthetic demonstration results");
    expect(markdown).toContain("Profile North: 6/8");
    expect(markdown).toContain("Profile West: 3/8");
    expect(markdown).not.toContain("GPT");
    expect(prerenderRoutes()).toContain("/pow/ai-benchmark");
    expect(sitemapRoutes()).toContain("/pow/ai-benchmark");
    expect(searchIndex.some((item) => item.href === "/pow/ai-benchmark")).toBe(true);
    expect(await renderBenchmark()).toBeInTheDocument();
  });
});
