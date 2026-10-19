/**
 * Scoring, statistics, dataset checks, and aggregates for the EVALFORGE demonstration.
 *
 * The counts asserted here are properties of the stored fixture, not measurements
 * of a named model. A change to a stored response should change these tests.
 *
 * Connects to:
 * - src/lib/benchmark/*.
 * - src/content/benchmarkEngineering.ts.
 */
import { describe, expect, it } from "vitest";
import { auditFixtureTasks, benchmarkTasks, demonstrationRun } from "../content/benchmarkEngineering";
import {
  acceptedTasks,
  comparePaired,
  executionLabel,
  filterCases,
  rateBy,
  scoreRun,
  specificationStatus,
  tallyFailures,
} from "../lib/benchmark/aggregate";
import { failingFindings, inspectDataset, promptIsAmbiguous } from "../lib/benchmark/quality";
import { RUBRIC_CRITERIA, scoreExact, scoreOutput, scoreRubric, scoreStoredTests } from "../lib/benchmark/score";
import {
  binomialCoefficient,
  bonferroniAlpha,
  comparisonNote,
  exactDiscordantTest,
  intervalsOverlap,
  wilsonInterval,
} from "../lib/benchmark/stats";
import type { RubricRow, TaskRecord } from "../lib/benchmark/types";

/** A rubric row with the demonstration maximum of 2. */
function row(criterion: string, score: number, max = 2): RubricRow {
  return { criterion, score, max, note: "test" };
}

/** The four required criteria, in order, with the given scores. */
function card(scores: number[]): RubricRow[] {
  return RUBRIC_CRITERIA.map((criterion, index) => row(criterion, scores[index] ?? 0));
}

/** Statistics and scoring rules, including the branches the fixture does not hit. */
describe("benchmark statistics and scoring", () => {
  it("computes a Wilson interval and refuses an empty or impossible sample", () => {
    const interval = wilsonInterval(6, 8);
    expect(interval.p).toBeCloseTo(0.75);
    expect(interval.low).toBeGreaterThan(0.3);
    expect(interval.high).toBeLessThan(1);
    expect(interval.low).toBeLessThan(interval.p);
    expect(wilsonInterval(0, 0)).toMatchObject({ n: 0, p: 0 });
    expect(wilsonInterval(9, 8).n).toBe(0);
  });

  it("detects overlap, binomial edges, and the exact sign test", () => {
    expect(intervalsOverlap({ low: 0.2, high: 0.5 }, { low: 0.5, high: 0.8 })).toBe(true);
    expect(intervalsOverlap({ low: 0.2, high: 0.4 }, { low: 0.5, high: 0.8 })).toBe(false);
    expect(binomialCoefficient(5, -1)).toBe(0);
    expect(binomialCoefficient(5, 2)).toBe(10);
    expect(exactDiscordantTest(0, 0)).toEqual({ n: 0, pValue: 1 });
    expect(exactDiscordantTest(-1, 1).n).toBe(0);
    expect(exactDiscordantTest(3, 0).pValue).toBeCloseTo(0.25);
    expect(bonferroniAlpha(0)).toBe(0.05);
    expect(bonferroniAlpha(6)).toBeCloseTo(0.05 / 6);
    expect(comparisonNote(true, 1)).toContain("overlap");
    expect(comparisonNote(false, 8)).toContain("do not overlap");
  });

  it("scores exact match, stored tests, and each rubric failure", () => {
    expect(scoreExact("20", "20").passed).toBe(true);
    expect(scoreExact("The fee is 20.", "20").failure).toBe("format-error");
    expect(scoreExact("", "C").failure).toBe("instruction-miss");
    expect(scoreExact("hold", "held").failure).toBe("wrong-result");
    expect(scoreExact("20", "").failure).toBe("wrong-result");

    const task = benchmarkTasks.find((item) => item.id === "code-range");
    expect(task).toBeDefined();
    const tests = [
      { name: "inclusive", passed: true },
      { name: "reversed", passed: false, errorCategory: "boundary" },
      { name: "empty", passed: true },
    ];
    expect(scoreStoredTests(task as TaskRecord, tests).failure).toBe("failed-tests");
    expect(scoreStoredTests(task as TaskRecord, tests.map((item) => ({ ...item, passed: true }))).passed).toBe(true);
    expect(scoreStoredTests(task as TaskRecord, [{ name: "only", passed: true }]).passed).toBe(false);

    expect(scoreRubric(card([2, 2, 2, 2])).passed).toBe(true);
    expect(scoreRubric(card([0, 2, 2, 0])).failure).toBe("unsupported-claim");
    expect(scoreRubric(card([0, 2, 2, 1])).failure).toBe("wrong-result");
    expect(scoreRubric(card([2, 0, 0, 2])).failure).toBe("instruction-miss");
    expect(scoreRubric(card([1, 0, 1, 1])).failure).toBe("incomplete");
    expect(scoreRubric(undefined).failure).toBe("incomplete");
    expect(scoreRubric(card([2, 2, 2, 2]).map((item) => ({ ...item, max: 0 }))).passed).toBe(false);
    expect(scoreOutput(task as TaskRecord, undefined).failure).toBe("instruction-miss");

    const pairwise = benchmarkTasks.find((item) => item.id === "reject-ambiguous");
    expect(scoreOutput(pairwise as TaskRecord, {
      taskId: "reject-ambiguous",
      modelId: "north",
      response: "A",
      explanation: "not scored",
    }).method).toBe("unscored");
  });
});

/** The fixture the page renders: accepted rows are clean, and the rates match the stored cases. */
describe("benchmark fixture", () => {
  const run = demonstrationRun();
  const cases = scoreRun(run.tasks, run.outputs, run.models.map((model) => model.id));

  it("accepts eight tasks and rejects the ambiguous row without scoring it", () => {
    expect(executionLabel(false)).toContain("Not executed");
    expect(executionLabel(true)).toContain("Executed");
    expect(run.executed).toBe(false);
    expect(acceptedTasks(run.tasks)).toHaveLength(8);
    expect(cases).toHaveLength(24);
    const findings = failingFindings(inspectDataset(benchmarkTasks));
    expect(findings.every((finding) => finding.taskId === "reject-ambiguous")).toBe(true);
    expect(promptIsAmbiguous(benchmarkTasks[0] as TaskRecord)).toBe(false);
    expect(findings.map((finding) => finding.check)).toEqual(
      expect.arrayContaining(["ambiguous-instruction", "inconsistent-label", "missing-expected", "scoring-config"]),
    );
  });

  it("derives pass counts from the stored responses", () => {
    const totals = Object.fromEntries(rateBy(cases, "all").map((rate) => [rate.modelId, rate.successes]));
    expect(totals).toEqual({ north: 6, east: 6, west: 3 });
    expect(rateBy(cases, "coding").find((rate) => rate.modelId === "east")?.successes).toBe(4);
    expect(rateBy(cases, "reasoning").find((rate) => rate.modelId === "north")?.successes).toBe(4);
    const paired = comparePaired(cases, "north", "east");
    expect(paired.aOnly).toBe(2);
    expect(paired.bOnly).toBe(2);
    expect(tallyFailures(cases).find((item) => item.failure === "format-error")?.count).toBe(1);
    expect(filterCases(cases, "hard").every((item) => item.task.difficulty === "hard")).toBe(true);
    expect(filterCases(cases, "all")).toHaveLength(cases.length);
    expect(specificationStatus(run).every((check) => check.met)).toBe(true);
  });

  it("flags a planted duplicate and a broken schema, and a specification with one category missing", () => {
    const audited = inspectDataset([...benchmarkTasks, ...auditFixtureTasks()]);
    expect(audited.some((finding) => finding.check === "duplicate-task")).toBe(true);
    expect(audited.some((finding) => finding.check === "invalid-schema")).toBe(true);
    expect(audited.some((finding) => finding.check === "missing-field")).toBe(true);
    const thin = specificationStatus({ ...run, tasks: run.tasks.filter((task) => task.category !== "coding"), outputs: [] });
    expect(thin.find((check) => check.id === "both-categories")?.met).toBe(false);
    const noCards = specificationStatus({ ...run, outputs: [] });
    expect(noCards.find((check) => check.id === "rubric-shape")?.met).toBe(false);
  });

  it("counts a missing response as a failure and skips a task the other profile lacks", () => {
    const partial = scoreRun(acceptedTasks(run.tasks).slice(0, 1), [], ["north"]);
    expect(partial[0]?.result.passed).toBe(false);
    const paired = comparePaired(partial, "north", "east");
    expect(paired.n).toBe(0);
  });
});
