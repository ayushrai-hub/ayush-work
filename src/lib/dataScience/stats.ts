/**
 * Deterministic summaries for the Insight Lab retail sample.
 *
 * Mean, variance, and skewness use the definitions documented on each function.
 * Quantiles use the R / Excel type-7 linear interpolation. Pearson correlation
 * returns null when either series has no variation. Nothing here draws a chart
 * or claims a cause.
 *
 * Connects to:
 * - src/lib/dataScience/quality.ts, inference.ts, models.ts, series.ts, and analysis.ts.
 * - src/__tests__/dataScience.test.ts.
 */

/** Arithmetic mean. Null when there are no values. */
export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  let total = 0;
  for (const value of values) total += value;
  return total / values.length;
}

/**
 * Sample median. Even counts average the two central values after an ascending sort.
 * Null when there are no values.
 */
export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid] ?? null;
  return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
}

/**
 * Sample variance with divisor n − 1. Null when fewer than two values are present.
 */
export function sampleVariance(values: number[]): number | null {
  if (values.length < 2) return null;
  const center = mean(values);
  if (center === null) return null;
  let sum = 0;
  for (const value of values) {
    const delta = value - center;
    sum += delta * delta;
  }
  return sum / (values.length - 1);
}

/** Square root of `sampleVariance`. Null when the variance is null. */
export function sampleStdev(values: number[]): number | null {
  const variance = sampleVariance(values);
  if (variance === null) return null;
  return Math.sqrt(variance);
}

/**
 * Type-7 quantile. `p` is between 0 and 1.
 * Position h = (n − 1) · p, then linear interpolation between the surrounding order statistics.
 * Null when there are no values or `p` is outside 0–1.
 */
export function quantile(values: number[], p: number): number | null {
  if (values.length === 0 || p < 0 || p > 1) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const h = (sorted.length - 1) * p;
  const low = Math.floor(h);
  const high = Math.ceil(h);
  const lower = sorted[low];
  const upper = sorted[high];
  if (lower === undefined || upper === undefined) return null;
  return lower + (h - low) * (upper - lower);
}

/** Interquartile range, Q3 − Q1, using `quantile`. Null when either quartile is null. */
export function interquartileRange(values: number[]): number | null {
  const q1 = quantile(values, 0.25);
  const q3 = quantile(values, 0.75);
  if (q1 === null || q3 === null) return null;
  return q3 - q1;
}

/**
 * Pearson correlation. Null when the arrays differ in length, have fewer than two
 * pairs, or either side has zero sample variance. This is an association, not an effect.
 */
export function pearson(left: number[], right: number[]): number | null {
  if (left.length !== right.length || left.length < 2) return null;
  const meanLeft = mean(left);
  const meanRight = mean(right);
  if (meanLeft === null || meanRight === null) return null;
  let xy = 0;
  let xx = 0;
  let yy = 0;
  for (let index = 0; index < left.length; index += 1) {
    const x = (left[index] ?? 0) - meanLeft;
    const y = (right[index] ?? 0) - meanRight;
    xy += x * y;
    xx += x * x;
    yy += y * y;
  }
  if (xx === 0 || yy === 0) return null;
  return xy / Math.sqrt(xx * yy);
}

/**
 * Moment skewness g1 = m3 / m2^(3/2), with moments divided by n (not n − 1).
 * Null when fewer than three values exist or the second moment is zero.
 */
export function skewness(values: number[]): number | null {
  if (values.length < 3) return null;
  const center = mean(values);
  if (center === null) return null;
  let m2 = 0;
  let m3 = 0;
  for (const value of values) {
    const delta = value - center;
    m2 += delta * delta;
    m3 += delta * delta * delta;
  }
  m2 /= values.length;
  m3 /= values.length;
  if (m2 === 0) return null;
  return m3 / m2 ** 1.5;
}

/** One bin of a histogram. `end` is exclusive except for the last bin, which includes its end. */
export interface HistogramBin {
  start: number;
  end: number;
  count: number;
}

/**
 * Equal-width bins. The first edge is the greatest multiple of `binWidth` at or below the minimum.
 * Values equal to the maximum fall in the last bin. Empty when there is nothing to bin.
 */
export function histogram(values: number[], binWidth: number): HistogramBin[] {
  if (values.length === 0 || !(binWidth > 0)) return [];
  let min = values[0] ?? 0;
  let max = min;
  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  const start = Math.floor(min / binWidth) * binWidth;
  const binCount = Math.max(1, Math.ceil((max - start) / binWidth));
  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, index) => ({
    start: start + index * binWidth,
    end: start + (index + 1) * binWidth,
    count: 0,
  }));
  for (const value of values) {
    let index = Math.floor((value - start) / binWidth);
    if (index >= bins.length) index = bins.length - 1;
    if (index < 0) index = 0;
    const bin = bins[index];
    if (bin) bin.count += 1;
  }
  return bins;
}

/** Mean of one group, with the group size. */
export interface GroupMean {
  key: string;
  n: number;
  mean: number;
}

/** Group numeric values by a string key and average each group. Empty groups are omitted. Keys are sorted. */
export function groupMeans(rows: { key: string; value: number }[]): GroupMean[] {
  const groups = new Map<string, number[]>();
  for (const row of rows) {
    const bucket = groups.get(row.key) ?? [];
    bucket.push(row.value);
    groups.set(row.key, bucket);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, values]) => ({ key, n: values.length, mean: mean(values) ?? 0 }));
}

/**
 * Cohen's d for two samples, using the pooled sample standard deviation.
 * Null when either sample has fewer than two observations or the pooled deviation is zero.
 */
export function cohensD(left: number[], right: number[]): number | null {
  const varianceLeft = sampleVariance(left);
  const varianceRight = sampleVariance(right);
  const meanLeft = mean(left);
  const meanRight = mean(right);
  if (
    varianceLeft === null ||
    varianceRight === null ||
    meanLeft === null ||
    meanRight === null ||
    left.length < 2 ||
    right.length < 2
  ) {
    return null;
  }
  const pooled =
    ((left.length - 1) * varianceLeft + (right.length - 1) * varianceRight) /
    (left.length + right.length - 2);
  if (!(pooled > 0)) return null;
  return (meanLeft - meanRight) / Math.sqrt(pooled);
}

/**
 * Welch t statistic for a difference of means. This is the statistic only.
 * The page does not convert it to a normal-theory p-value.
 * Null when either sample has fewer than two observations or the standard error is zero.
 */
export function welchT(left: number[], right: number[]): { t: number; df: number } | null {
  const varianceLeft = sampleVariance(left);
  const varianceRight = sampleVariance(right);
  const meanLeft = mean(left);
  const meanRight = mean(right);
  if (varianceLeft === null || varianceRight === null || meanLeft === null || meanRight === null) {
    return null;
  }
  const se2 = varianceLeft / left.length + varianceRight / right.length;
  if (!(se2 > 0)) return null;
  const dfNumerator = se2 * se2;
  const dfDenominator =
    (varianceLeft / left.length) ** 2 / (left.length - 1) +
    (varianceRight / right.length) ** 2 / (right.length - 1);
  if (!(dfDenominator > 0)) return null;
  return { t: (meanLeft - meanRight) / Math.sqrt(se2), df: dfNumerator / dfDenominator };
}

/**
 * Normal-theory sample size per group for a two-sided mean difference.
 * Uses z_(1−α/2) = 1.959963984540054 and z_(power) = 0.841621233572914
 * (α = 0.05, power = 0.80). n = ceil(2 · (zα + zβ)² · σ² / δ²).
 * Null when σ or δ is not positive. This is a planning formula, not an experiment result.
 */
export function sampleSizePerGroup(sigma: number, delta: number): number | null {
  if (!(sigma > 0) || !(delta > 0)) return null;
  const z = 1.959963984540054 + 0.841621233572914;
  return Math.ceil((2 * z * z * sigma * sigma) / (delta * delta));
}

/**
 * Solve a square linear system with Gauss-Jordan elimination and partial pivoting.
 * Returns null when a pivot is smaller than 1e-10 in absolute value.
 */
export function solveLinearSystem(matrix: number[][], vector: number[]): number[] | null {
  const n = vector.length;
  if (matrix.length !== n || matrix.some((row) => row.length !== n)) return null;
  const augmented = matrix.map((row, index) => [...row, vector[index] ?? 0]);
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(augmented[row]?.[col] ?? 0) > Math.abs(augmented[pivot]?.[col] ?? 0)) pivot = row;
    }
    if (Math.abs(augmented[pivot]?.[col] ?? 0) < 1e-10) return null;
    const pivotRow = augmented[pivot];
    const current = augmented[col];
    if (!pivotRow || !current) return null;
    augmented[col] = pivotRow;
    augmented[pivot] = current;
    const divisor = augmented[col]?.[col] ?? 0;
    for (let column = col; column <= n; column += 1) {
      const row = augmented[col];
      if (!row) return null;
      row[column] = (row[column] ?? 0) / divisor;
    }
    for (let rowIndex = 0; rowIndex < n; rowIndex += 1) {
      if (rowIndex === col) continue;
      const row = augmented[rowIndex];
      const lead = augmented[col];
      if (!row || !lead) return null;
      const factor = row[col] ?? 0;
      for (let column = col; column <= n; column += 1) {
        row[column] = (row[column] ?? 0) - factor * (lead[column] ?? 0);
      }
    }
  }
  return augmented.map((row) => row[n] ?? 0);
}
