/**
 * Two-group comparison for the promotional question in the synthetic sample.
 *
 * The p-value is an exact permutation p-value when the number of label assignments
 * is at most 20,000, and otherwise a Monte Carlo p-value with a fixed seed.
 * Both include the observed assignment. Neither estimates a causal promotion effect:
 * the labels were not randomized.
 *
 * Connects to:
 * - src/lib/dataScience/stats.ts for means, skewness, Cohen's d, and the Welch statistic.
 * - src/lib/dataScience/analysis.ts.
 * - src/__tests__/dataScience.test.ts.
 */
import { cohensD, mean, median, skewness, welchT } from "./stats";

/** Seed for the Monte Carlo permutation test. Changing it changes the p-value. */
export const PERMUTATION_SEED = 20261019;

/** Monte Carlo draws used when an exact enumeration would exceed 20,000 assignments. */
export const PERMUTATION_DRAWS = 4999;

/** Minimum size of each group before a p-value is reported. */
export const MIN_GROUP_SIZE = 8;

/** Result of comparing two observed groups. `pValue` is null when a group is too small. */
export interface GroupComparison {
  leftLabel: string;
  rightLabel: string;
  leftN: number;
  rightN: number;
  leftMean: number | null;
  rightMean: number | null;
  leftMedian: number | null;
  rightMedian: number | null;
  differenceOfMeans: number | null;
  cohensD: number | null;
  leftSkew: number | null;
  rightSkew: number | null;
  welchT: number | null;
  welchDf: number | null;
  pValue: number | null;
  pMethod: "exact-permutation" | "monte-carlo-permutation" | "not-reported";
  warning: string;
}

/** Mulberry32 generator. Returns numbers in [0, 1). The seed is an unsigned 32-bit integer. */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Number of combinations C(n, k). Exact for the sizes this page enumerates. */
function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let value = 1;
  for (let index = 0; index < Math.min(k, n - k); index += 1) {
    value = (value * (n - index)) / (index + 1);
  }
  return value;
}

/** Mean difference left minus right. Null if either side is empty. */
function difference(values: number[], inLeft: boolean[]): number | null {
  const left: number[] = [];
  const right: number[] = [];
  values.forEach((value, index) => {
    if (inLeft[index]) left.push(value);
    else right.push(value);
  });
  const leftMean = mean(left);
  const rightMean = mean(right);
  if (leftMean === null || rightMean === null) return null;
  return leftMean - rightMean;
}

/** Exact two-sided permutation p-value over every way to choose the left-group indexes. */
function exactP(values: number[], leftCount: number, observed: number): number {
  let asExtreme = 0;
  let total = 0;
  const chosen: number[] = [];
  const walk = (start: number) => {
    if (chosen.length === leftCount) {
      total += 1;
      const mask = Array(values.length).fill(false);
      for (const index of chosen) mask[index] = true;
      const diff = difference(values, mask);
      if (diff !== null && Math.abs(diff) + 1e-9 >= Math.abs(observed)) asExtreme += 1;
      return;
    }
    for (let index = start; index < values.length; index += 1) {
      chosen.push(index);
      walk(index + 1);
      chosen.pop();
    }
  };
  walk(0);
  return total === 0 ? 1 : asExtreme / total;
}

/**
 * Monte Carlo two-sided permutation p-value.
 * (1 + count of draws at least as extreme) / (1 + draws), which counts the observed assignment.
 */
function monteCarloP(values: number[], leftCount: number, observed: number): number {
  const random = mulberry32(PERMUTATION_SEED);
  let asExtreme = 0;
  const indexes = values.map((_, index) => index);
  for (let draw = 0; draw < PERMUTATION_DRAWS; draw += 1) {
    for (let index = indexes.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      const current = indexes[index] ?? 0;
      indexes[index] = indexes[swap] ?? 0;
      indexes[swap] = current;
    }
    const mask = Array(values.length).fill(false);
    for (let index = 0; index < leftCount; index += 1) mask[indexes[index] ?? 0] = true;
    const diff = difference(values, mask);
    if (diff !== null && Math.abs(diff) + 1e-9 >= Math.abs(observed)) asExtreme += 1;
  }
  return (1 + asExtreme) / (1 + PERMUTATION_DRAWS);
}

/**
 * Compare `left` with `right`.
 * A p-value is withheld when either group has fewer than `MIN_GROUP_SIZE` observations.
 */
export function compareGroups(left: number[], right: number[], leftLabel: string, rightLabel: string): GroupComparison {
  const leftMean = mean(left);
  const rightMean = mean(right);
  const welch = welchT(left, right);
  const observed = leftMean !== null && rightMean !== null ? leftMean - rightMean : null;
  const tooSmall = left.length < MIN_GROUP_SIZE || right.length < MIN_GROUP_SIZE;
  const values = [...left, ...right];
  const assignments = combinations(values.length, left.length);
  let pValue: number | null = null;
  let pMethod: GroupComparison["pMethod"] = "not-reported";
  if (!tooSmall && observed !== null && left.length > 0 && right.length > 0) {
    if (assignments <= 20000) {
      pValue = exactP(values, left.length, observed);
      pMethod = "exact-permutation";
    } else {
      pValue = monteCarloP(values, left.length, observed);
      pMethod = "monte-carlo-permutation";
    }
  }
  const warning = tooSmall
    ? `One group has fewer than ${MIN_GROUP_SIZE} rows, so no p-value is reported. A test on a group that small would look more precise than the sample is.`
    : "This p-value asks how unusual the mean gap is if the labels were exchangeable. Promotions in this file were not randomized, and the generator ties them to season. The p-value is not a causal effect and it is not a result about real retailers.";
  return {
    leftLabel,
    rightLabel,
    leftN: left.length,
    rightN: right.length,
    leftMean,
    rightMean,
    leftMedian: median(left),
    rightMedian: median(right),
    differenceOfMeans: observed,
    cohensD: cohensD(left, right),
    leftSkew: skewness(left),
    rightSkew: skewness(right),
    welchT: welch?.t ?? null,
    welchDf: welch?.df ?? null,
    pValue,
    pMethod,
    warning,
  };
}
