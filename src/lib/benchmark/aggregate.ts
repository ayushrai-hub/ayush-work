/**
 * Aggregates the EVALFORGE demonstration from scored cases.
 *
 * Every rate is a count over accepted tasks and stored outputs. Rejected
 * tasks stay in the inspector and out of the pass rate. Preference cases
 * are not added to accuracy. Filtering by difficulty recomputes the counts
 * so a chart cannot show a number the rows do not contain.
 *
 * Connects to:
 * - src/lib/benchmark/score.ts and stats.ts.
 * - src/content/benchmarkEngineering.ts (`renderBenchmarkBody`).
 * - src/components/benchmark/ResultsDashboard.tsx and ReliabilityPanel.tsx.
 * - src/__tests__/benchmark.test.ts.
 */
import { scoreOutput } from "./score";
import { exactDiscordantTest, wilsonInterval, type WilsonInterval } from "./stats";
import type {
  DemonstrationOutput,
  EvaluationRun,
  FailureCategory,
  ScoreResult,
  TaskRecord,
} from "./types";

/** One accepted task scored for one demonstration profile. */
export interface ScoredCase {
  task: TaskRecord;
  modelId: string;
  response: string;
  explanation: string;
  result: ScoreResult;
}

/** Pass count for one profile, optionally inside one category. */
export interface RateSummary {
  modelId: string;
  category: string;
  successes: number;
  n: number;
  wilson: WilsonInterval;
  cases: ScoredCase[];
}

/** How many times a failure category appears among scored cases. */
export interface FailureTally {
  failure: FailureCategory;
  count: number;
}

/** Paired counts on the tasks both profiles were scored on. */
export interface PairedComparison {
  modelA: string;
  modelB: string;
  bothPass: number;
  bothFail: number;
  aOnly: number;
  bOnly: number;
  n: number;
  discordant: { n: number; pValue: number };
}

/** Label for the run’s execution flag. The fixture is not an executed job. */
export function executionLabel(executed: boolean): string {
  return executed ? "Executed evaluation job" : "Not executed — stored demonstration";
}

/** Accepted tasks only, in input order. */
export function acceptedTasks(tasks: TaskRecord[]): TaskRecord[] {
  return tasks.filter((task) => task.validationStatus === "accepted");
}

/**
 * Scores every accepted task for every model. A missing output is scored as
 * a failure so a profile cannot omit a task and raise its rate.
 */
export function scoreRun(
  tasks: TaskRecord[],
  outputs: DemonstrationOutput[],
  modelIds: string[],
): ScoredCase[] {
  const cases: ScoredCase[] = [];
  for (const task of acceptedTasks(tasks)) {
    for (const modelId of modelIds) {
      const output = outputs.find((item) => item.taskId === task.id && item.modelId === modelId);
      cases.push({
        task,
        modelId,
        response: output?.response ?? "",
        explanation: output?.explanation ?? "No stored response.",
        result: scoreOutput(task, output),
      });
    }
  }
  return cases;
}

/** Restricts cases to a difficulty, or returns them all when `difficulty` is `all`. */
export function filterCases(cases: ScoredCase[], difficulty: string): ScoredCase[] {
  if (difficulty === "all") return cases;
  return cases.filter((item) => item.task.difficulty === difficulty);
}

/** Groups scored cases into pass rates. `category` `all` keeps every task in the group. */
export function rateBy(cases: ScoredCase[], category: string): RateSummary[] {
  const modelIds = [...new Set(cases.map((item) => item.modelId))];
  return modelIds.map((modelId) => {
    const rows = cases.filter(
      (item) => item.modelId === modelId && (category === "all" || item.task.category === category),
    );
    const successes = rows.filter((item) => item.result.passed).length;
    return {
      modelId,
      category,
      successes,
      n: rows.length,
      wilson: wilsonInterval(successes, rows.length),
      cases: rows,
    };
  });
}

/** Counts failure categories, including `none`, so the denominator stays visible. */
export function tallyFailures(cases: ScoredCase[]): FailureTally[] {
  const counts = new Map<FailureCategory, number>();
  for (const item of cases) {
    counts.set(item.result.failure, (counts.get(item.result.failure) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([failure, count]) => ({ failure, count }))
    .sort((a, b) => b.count - a.count || a.failure.localeCompare(b.failure));
}

/**
 * Paired comparison on the intersection of task ids. Concordant pairs do not
 * enter the sign test. The p-value is exact and unadjusted.
 */
export function comparePaired(cases: ScoredCase[], modelA: string, modelB: string): PairedComparison {
  const tasks = cases.filter((item) => item.modelId === modelA).map((item) => item.task.id);
  let bothPass = 0;
  let bothFail = 0;
  let aOnly = 0;
  let bOnly = 0;
  for (const taskId of tasks) {
    const a = cases.find((item) => item.modelId === modelA && item.task.id === taskId);
    const b = cases.find((item) => item.modelId === modelB && item.task.id === taskId);
    if (!a || !b) continue;
    if (a.result.passed && b.result.passed) bothPass += 1;
    else if (!a.result.passed && !b.result.passed) bothFail += 1;
    else if (a.result.passed) aOnly += 1;
    else bOnly += 1;
  }
  const n = bothPass + bothFail + aOnly + bOnly;
  return {
    modelA,
    modelB,
    bothPass,
    bothFail,
    aOnly,
    bOnly,
    n,
    discordant: exactDiscordantTest(aOnly, bOnly),
  };
}

/**
 * Checks the published specification against the records. A met check is a
 * property of this fixture, not a claim that the benchmark is validated.
 */
export function specificationStatus(run: EvaluationRun): { id: string; label: string; met: boolean; detail: string }[] {
  const accepted = acceptedTasks(run.tasks);
  const coding = accepted.filter((task) => task.category === "coding");
  const reasoning = accepted.filter((task) => task.category === "reasoning");
  const rubricTasks = accepted.filter((task) => task.scoringMethod === "rubric");
  const rubricOutputs = run.outputs.filter((output) =>
    rubricTasks.some((task) => task.id === output.taskId),
  );
  const rubricOk =
    rubricOutputs.length === rubricTasks.length * run.models.length &&
    rubricOutputs.every(
      (output) =>
        output.rubric?.length === 4 &&
        ["Correctness", "Completeness", "Instruction adherence", "Evidence quality"].every((criterion) =>
          output.rubric?.some((row) => row.criterion === criterion),
        ),
    );
  return [
    {
      id: "both-categories",
      label: "Both categories have an accepted task",
      met: coding.length > 0 && reasoning.length > 0,
      detail: `${coding.length} coding, ${reasoning.length} reasoning.`,
    },
    {
      id: "coding-tests",
      label: "Accepted coding tasks use unit tests, with at least two named tests",
      met: coding.every((task) => task.scoringMethod === "unit-test" && task.testNames.length >= 2),
      detail: `${coding.length} coding task${coding.length === 1 ? "" : "s"} checked.`,
    },
    {
      id: "exact-spec",
      label: "Exact-match tasks name the expected string",
      met: accepted
        .filter((task) => task.scoringMethod === "exact-match")
        .every((task) => task.expectedSpec.trim() !== ""),
      detail: "The expected field is the whole target, not a description of a good answer.",
    },
    {
      id: "rubric-shape",
      label: "Rubric outputs use the four named criteria",
      met: rubricTasks.length > 0 && rubricOk,
      detail: `${rubricOutputs.length} stored rubric scorecard${rubricOutputs.length === 1 ? "" : "s"}.`,
    },
    {
      id: "provenance",
      label: "Every task has a provenance label",
      met: run.tasks.every((task) => task.provenance === "synthetic" || task.provenance === "original-demonstration"),
      detail: "Current records are synthetic demonstration examples.",
    },
  ];
}
