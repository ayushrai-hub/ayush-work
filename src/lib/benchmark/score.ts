/**
 * Scoring rules for the EVALFORGE demonstration.
 *
 * Exact match, stored unit-test outcomes, and a fixed rubric are pure functions
 * of the task and the stored output. They do not call a model, grade free-form
 * text with another model, or execute code. Pairwise cases are not scored here.
 *
 * Connects to:
 * - src/lib/benchmark/types.ts for the record shapes.
 * - src/lib/benchmark/aggregate.ts, which scores every accepted task.
 * - src/__tests__/benchmark.test.ts.
 */
import type {
  DemonstrationOutput,
  FailureCategory,
  RubricRow,
  ScoreResult,
  ScoringMethod,
  StoredTest,
  TaskRecord,
} from "./types";

/** Rubric criteria, in display order. A rubric output must include each one. */
export const RUBRIC_CRITERIA = [
  "Correctness",
  "Completeness",
  "Instruction adherence",
  "Evidence quality",
] as const;

/**
 * Share of the rubric maximum required, in addition to a non-zero Correctness
 * score. 0.75 means 6 points when each of the four criteria has a max of 2.
 */
export const RUBRIC_PASS_RATIO = 0.75;

/** True when every required rubric criterion is present exactly once. */
export function rubricShapeOk(rows: RubricRow[]): boolean {
  const names = rows.map((row) => row.criterion);
  return (
    names.length === RUBRIC_CRITERIA.length &&
    RUBRIC_CRITERIA.every((criterion) => names.filter((name) => name === criterion).length === 1)
  );
}

/**
 * Exact match after trimming. Extra words that still contain the expected
 * token are a format failure, not a pass: the task asked for a defined string.
 * An empty response missed the instruction to reply.
 */
export function scoreExact(response: string, expected: string): ScoreResult {
  const actual = response.trim();
  const want = expected.trim();
  if (want === "") {
    return {
      method: "exact-match",
      passed: false,
      failure: "wrong-result",
      calculation: "No expected string is defined, so exact match cannot pass.",
    };
  }
  if (actual === want) {
    return {
      method: "exact-match",
      passed: true,
      failure: "none",
      calculation: `Trimmed response equals the expected string “${want}”.`,
    };
  }
  if (actual === "") {
    return {
      method: "exact-match",
      passed: false,
      failure: "instruction-miss",
      calculation: "The response is empty. The task required a defined string.",
    };
  }
  if (actual.includes(want)) {
    return {
      method: "exact-match",
      passed: false,
      failure: "format-error",
      calculation: `The response contains “${want}” but is not exactly that string. Exact match fails closed on extra text.`,
    };
  }
  return {
    method: "exact-match",
    passed: false,
    failure: "wrong-result",
    calculation: `Trimmed response “${actual}” does not equal “${want}”.`,
  };
}

/**
 * A coding task passes only when every stored test passed and the names match
 * the task. This reads stored outcomes. It does not run the tests.
 */
export function scoreStoredTests(task: TaskRecord, tests: StoredTest[]): ScoreResult {
  const names = tests.map((test) => test.name);
  const sameNames =
    task.testNames.length === names.length &&
    task.testNames.every((name, index) => name === names[index]);
  if (!sameNames || task.testNames.length < 2) {
    return {
      method: "unit-test",
      passed: false,
      failure: "failed-tests",
      calculation:
        "Stored tests do not match the task’s test list, or fewer than two tests are defined. The case is not counted as a pass.",
      tests,
    };
  }
  const failed = tests.filter((test) => !test.passed);
  const passedCount = tests.length - failed.length;
  if (failed.length === 0) {
    return {
      method: "unit-test",
      passed: true,
      failure: "none",
      calculation: `${passedCount}/${tests.length} stored tests passed. The browser did not execute them.`,
      tests,
    };
  }
  const categories = failed
    .map((test) => `${test.name}${test.errorCategory ? ` (${test.errorCategory})` : ""}`)
    .join(", ");
  return {
    method: "unit-test",
    passed: false,
    failure: "failed-tests",
    calculation: `${passedCount}/${tests.length} stored tests passed. Failed: ${categories}.`,
    tests,
  };
}

/** Reads one criterion. Missing criteria are handled by `scoreRubric` before this is used. */
function rowScore(rows: RubricRow[], criterion: string): number {
  return rows.find((row) => row.criterion === criterion)?.score ?? 0;
}

/**
 * Rubric pass rule: Correctness is at least 1, and the total is at least
 * RUBRIC_PASS_RATIO of the maximum. Otherwise the failure category follows
 * which required part is missing. These points are demonstration scores.
 */
export function scoreRubric(rows: RubricRow[] | undefined): ScoreResult {
  if (!rows || !rubricShapeOk(rows)) {
    return {
      method: "rubric",
      passed: false,
      failure: "incomplete",
      calculation: `A rubric result needs exactly these criteria: ${RUBRIC_CRITERIA.join(", ")}.`,
    };
  }
  const total = rows.reduce((sum, row) => sum + row.score, 0);
  const max = rows.reduce((sum, row) => sum + row.max, 0);
  const correctness = rowScore(rows, "Correctness");
  const adherence = rowScore(rows, "Instruction adherence");
  const evidence = rowScore(rows, "Evidence quality");
  const ratio = max === 0 ? 0 : total / max;
  const passed = correctness > 0 && ratio >= RUBRIC_PASS_RATIO;
  let failure: FailureCategory = "none";
  if (!passed) {
    if (correctness === 0 && evidence === 0) failure = "unsupported-claim";
    else if (correctness === 0) failure = "wrong-result";
    else if (adherence === 0) failure = "instruction-miss";
    else failure = "incomplete";
  }
  return {
    method: "rubric",
    passed,
    failure,
    calculation: `Rubric ${total}/${max} (${Math.round(ratio * 100)}%). Pass requires Correctness ≥ 1 and at least ${Math.round(RUBRIC_PASS_RATIO * 100)}% of the maximum. Points are authored demonstration scores, not a panel of raters.`,
    rubricTotal: total,
    rubricMax: max,
  };
}

/**
 * Scores one output with the task’s method. Unknown methods and missing
 * outputs do not pass. Pairwise is refused here so it cannot enter accuracy.
 */
export function scoreOutput(task: TaskRecord, output: DemonstrationOutput | undefined): ScoreResult {
  if (!output) {
    return {
      method: "unscored",
      passed: false,
      failure: "instruction-miss",
      calculation: "No stored response for this profile on this task.",
    };
  }
  const method = task.scoringMethod as ScoringMethod;
  if (method === "exact-match") return scoreExact(output.response, task.expectedSpec);
  if (method === "unit-test") return scoreStoredTests(task, output.tests ?? []);
  if (method === "rubric") return scoreRubric(output.rubric);
  return {
    method: "unscored",
    passed: false,
    failure: "wrong-result",
    calculation: `Scoring method “${task.scoringMethod}” is not an accuracy rule. Pairwise comparison stays outside the pass rate.`,
  };
}
