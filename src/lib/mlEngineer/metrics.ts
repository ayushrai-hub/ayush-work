/**
 * Regression metrics for the demonstration holdout.
 *
 * Predictions come from two disclosed functions: last week's sales, and a fixed blend of lag,
 * rolling mean, and a promotion bump. The blend coefficients were chosen for this page. They were
 * not estimated by a training job.
 *
 * Connects to:
 * - src/lib/mlEngineer/features.ts (`buildSupervised`, `timeSplit`).
 * - src/lib/mlEngineer/simulate.ts, which attaches these numbers to a simulated run.
 * - src/components/pow/ml/Lab.tsx.
 */
import { buildSupervised, timeSplit, type SupervisedRow } from "./features";

/** Mean absolute error. Null when the two lists differ in length or are empty. */
export function meanAbsoluteError(actual: readonly number[], predicted: readonly number[]): number | null {
  if (actual.length === 0 || actual.length !== predicted.length) return null;
  const total = actual.reduce((sum, value, index) => sum + Math.abs(value - predicted[index]), 0);
  return total / actual.length;
}

/** Root mean squared error. Null on an empty or mismatched pair of lists. */
export function rootMeanSquaredError(actual: readonly number[], predicted: readonly number[]): number | null {
  if (actual.length === 0 || actual.length !== predicted.length) return null;
  const total = actual.reduce((sum, value, index) => sum + (value - predicted[index]) ** 2, 0);
  return Math.sqrt(total / actual.length);
}

/**
 * Coefficient of determination.
 * Null when the lists are shorter than two rows, mismatched, or the actuals do not vary.
 */
export function rSquared(actual: readonly number[], predicted: readonly number[]): number | null {
  if (actual.length < 2 || actual.length !== predicted.length) return null;
  const mean = actual.reduce((sum, value) => sum + value, 0) / actual.length;
  let total = 0;
  let residual = 0;
  for (let index = 0; index < actual.length; index += 1) {
    total += (actual[index] - mean) ** 2;
    residual += (actual[index] - predicted[index]) ** 2;
  }
  if (total === 0) return null;
  return 1 - residual / total;
}

/**
 * Predicts next-week units as last week's units.
 * This is the baseline. It does not use price or promotion.
 */
export function baselinePrediction(row: SupervisedRow): number {
  return row.lag1;
}

/**
 * Predicts with a fixed formula: `0.65 * lag + 0.35 * rolling + 1.5` when the week is promoted.
 * The weights are part of the page, not the result of fitting a linear model.
 */
export function blendPrediction(row: SupervisedRow): number {
  return 0.65 * row.lag1 + 0.35 * row.rolling3 + (row.promo === 1 ? 1.5 : 0);
}

/**
 * A deliberately worse function used to show a failed release gate.
 * It subtracts 4 from the lag and floors at zero. It is not a trained model.
 */
export function worsePrediction(row: SupervisedRow): number {
  return Math.max(0, row.lag1 - 4);
}

/** One holdout row with the three disclosed predictions. */
export interface ScoredRow {
  id: string;
  sku: string;
  category: string;
  observedOn: string;
  actual: number;
  baseline: number;
  blend: number;
  worse: number;
}

/** Metric triple. R-squared is null when it is not defined. */
export interface MetricTriple {
  mae: number | null;
  rmse: number | null;
  r2: number | null;
}

/** How many absolute errors fall in each fixed bucket. */
export interface ErrorBucket {
  label: string;
  count: number;
}

/** MAE for one product category on the holdout. */
export interface CategorySlice {
  category: string;
  count: number;
  baselineMae: number | null;
  blendMae: number | null;
  worseMae: number | null;
}

/** Holdout scorecard. Train rows are counted and not scored. */
export interface HoldoutScore {
  trainCount: number;
  test: ScoredRow[];
  baseline: MetricTriple;
  blend: MetricTriple;
  worse: MetricTriple;
  blendErrors: ErrorBucket[];
  slices: CategorySlice[];
}

/** Bundles MAE, RMSE, and R-squared for one prediction column. */
function triple(rows: readonly ScoredRow[], pick: (row: ScoredRow) => number): MetricTriple {
  const actual = rows.map((row) => row.actual);
  const predicted = rows.map(pick);
  return {
    mae: meanAbsoluteError(actual, predicted),
    rmse: rootMeanSquaredError(actual, predicted),
    r2: rSquared(actual, predicted),
  };
}

/**
 * Counts absolute blend errors in four buckets.
 * The buckets are 0–1, 1–2, 2–4, and 4 or more units.
 */
export function errorBuckets(rows: readonly ScoredRow[]): ErrorBucket[] {
  const counts = [0, 0, 0, 0];
  for (const row of rows) {
    const error = Math.abs(row.actual - row.blend);
    if (error < 1) counts[0] += 1;
    else if (error < 2) counts[1] += 1;
    else if (error < 4) counts[2] += 1;
    else counts[3] += 1;
  }
  return [
    { label: "0–1", count: counts[0] },
    { label: "1–2", count: counts[1] },
    { label: "2–4", count: counts[2] },
    { label: "4+", count: counts[3] },
  ];
}

/**
 * Scores the time-ordered holdout of the synthetic table.
 * Pass `rows` only in tests that need a smaller fixture.
 */
export function scoreHoldout(supervised = buildSupervised().supervised): HoldoutScore {
  const split = timeSplit(supervised);
  const test = split.test.map((row) => ({
    id: row.id,
    sku: row.sku,
    category: row.category,
    observedOn: row.observedOn,
    actual: row.actual,
    baseline: baselinePrediction(row),
    blend: blendPrediction(row),
    worse: worsePrediction(row),
  }));
  const categories = [...new Set(test.map((row) => row.category))].sort();
  const slices = categories.map((category) => {
    const group = test.filter((row) => row.category === category);
    return {
      category,
      count: group.length,
      baselineMae: triple(group, (row) => row.baseline).mae,
      blendMae: triple(group, (row) => row.blend).mae,
      worseMae: triple(group, (row) => row.worse).mae,
    };
  });
  return {
    trainCount: split.train.length,
    test,
    baseline: triple(test, (row) => row.baseline),
    blend: triple(test, (row) => row.blend),
    worse: triple(test, (row) => row.worse),
    blendErrors: errorBuckets(test),
    slices,
  };
}

/**
 * Formats a metric for display.
 * Null becomes an em dash so an undefined R-squared is not shown as zero.
 */
export function formatMetric(value: number | null, digits = 2): string {
  if (value === null || Number.isNaN(value)) return "—";
  return value.toFixed(digits);
}
