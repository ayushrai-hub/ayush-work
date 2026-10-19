/**
 * Tests the Insight Lab calculations and the /pow/ai-data-scientist page.
 *
 * The calculation tests use known inputs or the synthetic extract's planted rows.
 * The page test renders the real route and checks that a price edit changes the
 * assumed margin, which is computed rather than stored.
 *
 * Connects to:
 * - src/lib/dataScience/* and src/pages/AiDataScientistPowPage.tsx.
 * - src/App.tsx, src/lib/publicRoutes.ts, src/content/searchIndex.ts, src/lib/agent/markdown.ts.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { searchIndex } from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { analyzeRetail } from "../lib/dataScience/analysis";
import { compareGroups } from "../lib/dataScience/inference";
import {
  fitOrdinaryLeastSquares,
  regressionMetrics,
} from "../lib/dataScience/models";
import { assumedUnits, priceOutcome } from "../lib/dataScience/pricing";
import { cleanRetail, DEFAULT_CLEANING, inspectRaw } from "../lib/dataScience/quality";
import { RAW_RECORDS, RETAIL_SKUS } from "../lib/dataScience/retailDataset";
import { summarizeSeries } from "../lib/dataScience/series";
import {
  mean,
  median,
  pearson,
  quantile,
  sampleSizePerGroup,
  sampleStdev,
  solveLinearSystem,
} from "../lib/dataScience/stats";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";

/** Renders the data-science route inside the site shell. */
async function renderPage() {
  await import("../pages/AiDataScientistPowPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={["/pow/ai-data-scientist"]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole("heading", { level: 1, name: /Find the signal/ }, { timeout: 5000 });
}

describe("data science calculations", () => {
  it("computes mean, median, spread, correlation, and a solvable system", () => {
    expect(mean([])).toBeNull();
    expect(mean([1, 2, 3])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(sampleStdev([1, 2, 3])).toBeCloseTo(1);
    expect(quantile([1, 2, 3, 4], 0.25)).toBeCloseTo(1.75);
    expect(pearson([1, 2, 3], [1, 2, 3])).toBeCloseTo(1);
    expect(pearson([1, 1, 1], [1, 2, 3])).toBeNull();
    expect(solveLinearSystem([[2, 0], [0, 4]], [2, 8])).toEqual([1, 2]);
    expect(solveLinearSystem([[0, 0], [0, 0]], [1, 1])).toBeNull();
    expect(sampleSizePerGroup(1, 1)).toBe(16);
    expect(sampleSizePerGroup(0, 1)).toBeNull();
  });

  it("fits a known line and withholds MAPE when an actual value is zero", () => {
    const fit = fitOrdinaryLeastSquares(
      [[1, 1], [1, 2], [1, 3]],
      [3, 5, 7],
      ["intercept", "x"],
    );
    expect(fit?.coefficients[0]?.value).toBeCloseTo(1);
    expect(fit?.coefficients[1]?.value).toBeCloseTo(2);
    const metrics = regressionMetrics([1, 4], [1, 2]);
    expect(metrics?.mae).toBeCloseTo(1);
    expect(metrics?.rmse).toBeCloseTo(Math.sqrt(2));
    expect(metrics?.mape).toBeCloseTo(25);
    expect(metrics?.rSquared).toBeCloseTo(1 / 9);
    expect(regressionMetrics([0, 1], [0, 1])?.mape).toBeNull();
    expect(regressionMetrics([2, 2], [2, 2])?.rSquared).toBeNull();
  });

  it("flags planted defects and keeps the repaired rows under the default decisions", () => {
    const findings = inspectRaw(RAW_RECORDS);
    expect(findings.some((finding) => finding.recordId === "issue-missing-price")).toBe(true);
    expect(findings.some((finding) => finding.check === "potential-leakage")).toBe(true);
    expect(findings.some((finding) => finding.check === "duplicate")).toBe(true);
    const cleaned = cleanRetail(RAW_RECORDS, DEFAULT_CLEANING);
    const ids = cleaned.kept.map((row) => row.id);
    expect(ids).not.toContain("issue-extreme-units");
    expect(ids).not.toContain("issue-negative-price");
    expect(ids).not.toContain("issue-duplicate");
    expect(ids).toContain("issue-bad-category");
    expect(cleaned.kept.find((row) => row.id === "issue-bad-category")?.category).toBe("furniture");
    expect(cleaned.kept.find((row) => row.id === "issue-string-types")?.price).toBe(24);
    const withExtreme = cleanRetail(RAW_RECORDS, { ...DEFAULT_CLEANING, dropExtremeUnits: false });
    expect(withExtreme.kept.some((row) => row.id === "issue-extreme-units")).toBe(true);
    const keepCopies = cleanRetail(RAW_RECORDS, {
      ...DEFAULT_CLEANING,
      dropDuplicateProductDay: false,
      dropConflictingNames: false,
    });
    expect(keepCopies.kept.filter((row) => row.id === "issue-duplicate").length).toBeGreaterThan(0);
  });

  it("reports a permutation p-value only when both groups are large enough", () => {
    const comparison = compareGroups([5, 6, 7, 8, 9, 10, 11, 12], [0, 1, 2, 3, 4, 5, 6, 7], "high", "low");
    expect(comparison.pMethod).toBe("exact-permutation");
    expect(comparison.pValue).not.toBeNull();
    expect(comparison.pValue ?? 1).toBeLessThan(0.05);
    expect(compareGroups([1, 2], [3, 4, 5], "a", "b").pValue).toBeNull();
  });

  it("keeps the leaked feature perfect and the price assumption explicit", () => {
    const snapshot = analyzeRetail(DEFAULT_CLEANING, "ols");
    const leak = snapshot.models.find((model) => model.id === "leaky-revenue");
    const meanModel = snapshot.models.find((model) => model.id === "mean");
    expect(leak?.metrics?.rSquared ?? 0).toBeGreaterThan(0.999);
    expect(meanModel?.metrics?.mae).toBeGreaterThan(0);
    expect(snapshot.promotion.pValue).not.toBeNull();
    expect(snapshot.promotionBySeason.find((item) => item.season === "winter")?.comparison.pValue).toBeNull();
    expect(snapshot.test.every((row) => row.day > 12)).toBe(true);
    const sheet = RETAIL_SKUS[1];
    expect(sheet).toBeDefined();
    if (!sheet) return;
    expect(assumedUnits(sheet.referencePrice, sheet.referencePrice)).toBe(24);
    expect(priceOutcome(28, sheet, null).margin).toBeCloseTo(408);
    expect(priceOutcome(1, sheet, null).belowCost).toBe(true);
    expect(priceOutcome(1, sheet, null).margin).toBeLessThan(0);
    expect(assumedUnits(10_000, sheet.referencePrice)).toBe(0);
    const series = summarizeSeries();
    expect(series.points).toHaveLength(24);
    expect(series.naiveMae).not.toBeNull();
    expect(series.centeredProtocolMae).not.toBeNull();
  });
});

describe("AI data scientist page", () => {
  it("renders the workbench, links the series, and recalculates the assumed margin", async () => {
    const user = userEvent.setup();
    await renderPage();
    expect(screen.getByText(/Northline Goods is fictional/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Data" })).toHaveAttribute("href", "/pow/ai-data-scientist");
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/ayushrai-hub");
    const margin = screen.getByText(/Assumed contribution margin:/);
    expect(margin.textContent).toContain("272.00");
    await user.clear(screen.getByLabelText("Candidate price"));
    await user.type(screen.getByLabelText("Candidate price"), "40");
    expect(margin.textContent).toContain("464.00");
    const oak = RETAIL_SKUS[0];
    expect(oak).toBeDefined();
    if (!oak) return;
    await user.selectOptions(screen.getByLabelText("SKU"), oak.productId);
    expect(screen.getByLabelText("Candidate price")).toHaveValue(oak.referencePrice);
    expect(prerenderRoutes()).toContain("/pow/ai-data-scientist");
    expect(sitemapRoutes()).toContain("/pow/ai-data-scientist");
    expect(searchIndex.some((item) => item.href === "/pow/ai-data-scientist")).toBe(true);
    const markdown = renderPageMarkdown("/pow/ai-data-scientist") ?? "";
    expect(markdown).toContain("Synthetic demonstration");
    expect(markdown).toContain("did not find");
    expect(markdown).not.toContain("7440567944");
  }, 20000);
});
