/**
 * Types for the EVALFORGE demonstration on /pow/benchmark-engineering.
 *
 * These records are the shape a later evaluation service can return. The page
 * reads an EvaluationRun. It does not branch into a second UI for live jobs.
 * Nothing in this module calls a model or runs submitted code.
 *
 * Connects to:
 * - src/lib/benchmark/score.ts, stats.ts, quality.ts, aggregate.ts.
 * - src/content/benchmarkEngineering.ts builds the demonstration run.
 * - src/pages/BenchmarkEngineeringPage.tsx and src/components/benchmark/* render it.
 */

/** Task family in the demonstration benchmark. */
export type TaskCategory = "coding" | "reasoning";

/** Coarse difficulty label. It is a tag, not a measured IRT parameter. */
export type Difficulty = "easy" | "medium" | "hard";

/** Where a task came from. Every current record uses one of these labels. */
export type Provenance = "synthetic" | "original-demonstration";

/** Human decision recorded on the task, separate from the automated checks. */
export type ValidationStatus = "accepted" | "rejected";

/** Scoring method stored on a task. Pairwise is not used as an accuracy score. */
export type ScoringMethod = "exact-match" | "unit-test" | "rubric" | "pairwise";

/** Why a scored response failed. `none` means the scorer marked it passed. */
export type FailureCategory =
  | "none"
  | "wrong-result"
  | "failed-tests"
  | "incomplete"
  | "format-error"
  | "instruction-miss"
  | "unsupported-claim";

/** One stored unit-test outcome. The browser does not execute the test. */
export interface StoredTest {
  name: string;
  passed: boolean;
  /** Present when `passed` is false. A short category, not a stack trace. */
  errorCategory?: string;
}

/** One rubric row. Scores are authored for the demonstration, not collected from raters. */
export interface RubricRow {
  criterion: string;
  score: number;
  max: number;
  note: string;
}

/**
 * A task record loose enough for the quality inspector to reject bad rows.
 * Fields are strings so a schema check can fail closed instead of trusting the type.
 */
export interface TaskRecord {
  id: string;
  category: string;
  declaredCapability: string;
  difficulty: string;
  prompt: string;
  expectedSpec: string;
  provenance: string;
  validationStatus: string;
  scoringMethod: string;
  version: string;
  testNames: string[];
  rejectionReason?: string;
}

/** A named demonstration profile. The label must not be a real model name. */
export interface DemoModel {
  id: string;
  label: string;
  summary: string;
}

/** Stored response for one profile on one task. */
export interface DemonstrationOutput {
  taskId: string;
  modelId: string;
  response: string;
  tests?: StoredTest[];
  rubric?: RubricRow[];
  /** Authored note about the case. The pass/fail flag comes from the scorer. */
  explanation: string;
}

/** One pairwise comparison. It is not folded into the accuracy totals. */
export interface PreferenceCase {
  id: string;
  taskId: string;
  criterion: string;
  responseA: string;
  responseB: string;
  winner: "A" | "B" | "tie";
  rationale: string;
  /** How the judgment should be read. A single rater is not ground truth. */
  adjudication: "single-rater" | "adjudicated-tie";
  limitation: string;
}

/**
 * The object the page renders. `source` reserves a later API-backed run.
 * `executed` is false for the fixture: no job ran.
 */
export interface EvaluationRun {
  id: string;
  source: "demonstration-fixture" | "evaluation-api";
  executed: boolean;
  disclaimer: string;
  models: DemoModel[];
  tasks: TaskRecord[];
  outputs: DemonstrationOutput[];
  preferences: PreferenceCase[];
}

/** Result of scoring one stored output against its task. */
export interface ScoreResult {
  method: ScoringMethod | "unscored";
  passed: boolean;
  failure: FailureCategory;
  /** How the flag was obtained, shown next to the aggregate that uses it. */
  calculation: string;
  tests?: StoredTest[];
  rubricTotal?: number;
  rubricMax?: number;
}
