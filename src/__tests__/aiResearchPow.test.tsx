/**
 * Tests the Harbor Meter scoring functions and the AI research proof-of-work page.
 *
 * The counts are locked to the prepared rows. The page test drives the inspectors: dataset filter,
 * metric definition, result slice, failure empty state, local preference, and configuration diff.
 *
 * Connects to:
 * - src/lib/aiResearchEval.ts, src/content/aiResearchPow.ts
 * - src/pages/AiResearchEngineeringPowPage.tsx, src/App.tsx
 * - src/lib/agent/markdown.ts, src/lib/publicRoutes.ts, src/content/searchIndex.ts
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { searchIndex } from "../content";
import { demoConfigs, researchExamples } from "../content/aiResearchPow";
import { ThemeProvider } from "../contexts/ThemeContext";
import { canonicalUrl } from "../lib/canonical";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";
import {
  causalBlockers,
  configDifferences,
  duplicateIds,
  exactMatch,
  normalizeAnswer,
  preparedOutput,
  retrievalRecall,
  schemaValid,
  summarizeExperiment,
  taskLabel,
} from "../lib/aiResearchEval";

/** Renders the research route and waits for the lazy page. The notebook chunk is large on a slow disk. */
async function renderResearch() {
  await import("../pages/AiResearchEngineeringPowPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={["/pow/ai-research-engineering"]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole(
    "heading",
    { level: 1, name: "Build the experiment. Test the hypothesis. Follow the evidence." },
    { timeout: 15000 },
  );
}

/** Scoring rules on the prepared rows and on small edge inputs. */
describe("AI research evaluation", () => {
  it("normalizes only case, space, and trailing periods", () => {
    expect(normalizeAnswer("  12 March 2024. ")).toBe("12 march 2024");
    expect(exactMatch("12 March 2024.", "12 March 2024")).toBe(true);
    expect(exactMatch("70 °C", "40 °C")).toBe(false);
    expect(exactMatch("anything", null)).toBeNull();
    expect(exactMatch("anything", "  ")).toBeNull();
  });

  it("treats a missing schema and an empty relevance set as not applicable", () => {
    expect(schemaValid(null, [])).toBeNull();
    expect(schemaValid(null, ["date"])).toBe(false);
    expect(schemaValid({ date: "12 March 2024" }, ["date", "technician"])).toBe(false);
    expect(schemaValid({ date: "12 March 2024", technician: "N. Iyer" }, ["date", "technician"])).toBe(true);
    expect(retrievalRecall([], ["a"])).toBeNull();
    expect(retrievalRecall(["a", "b"], ["b"])).toBe(0.5);
  });

  it("derives task labels from exact match and the prepared evidence label", () => {
    expect(taskLabel(null, "supported")).toBe("unscored");
    expect(taskLabel(true, "partial")).toBe("partial");
    expect(taskLabel(true, "supported")).toBe("correct");
    expect(taskLabel(true, "unscored")).toBe("correct");
    expect(taskLabel(true, "unsupported")).toBe("incorrect");
    expect(taskLabel(false, "unscored")).toBe("incorrect");
  });

  it("scores the Harbor Meter fixture without crowning retrieval", () => {
    const summary = summarizeExperiment(researchExamples);
    expect(summary.rows).toBe(12);
    expect(summary.scorable).toBe(9);
    expect(summary.excluded).toBe(3);
    expect(summary.baselineExactCorrect).toBe(6);
    expect(summary.retrievalExactCorrect).toBe(3);
    expect(summary.helps).toBe(2);
    expect(summary.hurts).toBe(5);
    expect(summary.noEffect).toBe(2);
    expect(summary.notComparable).toBe(3);
    expect(summary.schemaApplicable).toBe(1);
    expect(summary.baselineSchemaValid).toBe(0);
    expect(summary.retrievalSchemaValid).toBe(1);
    expect(summary.emptyOutputs).toEqual({ baseline: 0, retrieval: 0 });
    expect(summary.recallHits).toBe(8);
    expect(summary.recallRelevant).toBe(9);
    expect(summary.evidence.baseline).toEqual({ supported: 3, partial: 1, unsupported: 3, unscored: 2 });
    expect(summary.evidence.retrieval).toEqual({ supported: 3, partial: 2, unsupported: 1, unscored: 3 });
    expect(duplicateIds(researchExamples)).toEqual(["HM-05"]);
    expect(preparedOutput(researchExamples[0], "baseline")).toBe(researchExamples[0].baselineOutput);
    expect(summarizeExperiment([])).toMatchObject({ rows: 0, scorable: 0, recallHits: 0 });
  });

  it("flags an unrun configuration as a causal blocker", () => {
    const [baseline, retrieval, rerank] = demoConfigs;
    const sameSide = configDifferences(baseline, retrieval);
    expect(sameSide.map((item) => item.id)).toEqual(["retrieval"]);
    expect(causalBlockers(sameSide, true, true)).toEqual([]);
    const blocked = configDifferences(retrieval, rerank);
    expect(causalBlockers(blocked, true, false).length).toBeGreaterThan(0);
    expect(configDifferences(baseline, baseline)).toEqual([]);
  });
});

/** The page, its route, and the Markdown twin. */
describe("AI research engineering page", () => {
  it("shows the question, a prepared label, and the sibling proof-of-work routes", async () => {
    expect(await renderResearch()).toBeInTheDocument();
    expect(screen.getAllByText(/Does adding a fixed bundle of retrieved evidence/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Synthetic").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Explore the research workbench" })).toHaveAttribute("href", "#workbench");
    expect(screen.getByRole("link", { name: "Inspect the experiment methodology" })).toHaveAttribute("href", "#method");
    const researchLinks = screen.getAllByRole("link", { name: "AI research engineering" });
    expect(researchLinks.some((link) => link.getAttribute("aria-current") === "page")).toBe(true);
    expect(screen.getAllByRole("link", { name: "Forward deployed engineering" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Product management" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "GitHub" }).length).toBeGreaterThan(0);
  }, 20000);

  it("filters bad rows, opens a metric, and lists the rows behind a result", async () => {
    const user = userEvent.setup();
    expect(await renderResearch()).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Data-quality filter"), "duplicate");
    expect(screen.getByText("Showing 1 of 12")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /HM-05/ })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Structured-output accuracy/ }));
    expect(screen.getByText(/Only HM-11 declares a schema/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Retrieval hurts/ }));
    expect(screen.getByRole("button", { name: "HM-03" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "HM-01" })).not.toBeInTheDocument();
  }, 20000);

  it("keeps an empty failure category, a local preference, and an unrun comparison", async () => {
    const user = userEvent.setup();
    expect(await renderResearch()).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Failure category"), "incorrect_reference");
    expect(screen.getByText(/No prepared row is labeled with this category/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "A satisfies the rubric" }));
    expect(screen.getByText(/choice A/)).toBeInTheDocument();
    expect(screen.getByText(/not an annotation database/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Right"), "Retrieval with reranking");
    expect(screen.getByText(/One configuration has no prepared outputs/)).toBeInTheDocument();
    expect(screen.getAllByText(/Not run/).length).toBeGreaterThan(0);
  }, 20000);

  it("publishes the same counts in Markdown, the sitemap, and search", () => {
    const markdown = renderPageMarkdown("/pow/ai-research-engineering") ?? "";
    expect(markdown).toContain("Baseline exact match: 6 of 9.");
    expect(markdown).toContain("Retrieval exact match: 3 of 9.");
    expect(markdown).toContain("No model was called.");
    expect(markdown).toContain(canonicalUrl("/pow/ai-research-engineering"));
    expect(markdown).not.toContain("statistically significant");
    expect(prerenderRoutes()).toContain("/pow/ai-research-engineering");
    expect(sitemapRoutes()).toContain("/pow/ai-research-engineering");
    expect(searchIndex.some((item) => item.href === "/pow/ai-research-engineering")).toBe(true);
  });
});
