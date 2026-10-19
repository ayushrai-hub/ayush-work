/**
 * Small-sample statistics for the EVALFORGE demonstration.
 *
 * Wilson intervals and an exact paired sign test are computed from the scored
 * demonstration records. They describe that sample. They are not a power
 * analysis for a future benchmark, and they are not adjusted for every
 * comparison unless the caller applies the Bonferroni factor returned here.
 *
 * Connects to:
 * - src/lib/benchmark/aggregate.ts.
 * - src/components/benchmark/ReliabilityPanel.tsx.
 * - src/__tests__/benchmark.test.ts.
 */

/** A proportion and its Wilson interval, using z = 1.96 unless the caller overrides it. */
export interface WilsonInterval {
  successes: number;
  n: number;
  p: number;
  low: number;
  high: number;
  z: number;
}

/**
 * Wilson score interval for a binomial proportion.
 * An empty sample returns a zero-width interval at 0 so callers can render it
 * without dividing by zero. The bounds are clamped to [0, 1].
 */
export function wilsonInterval(successes: number, n: number, z = 1.96): WilsonInterval {
  if (n <= 0 || successes < 0 || successes > n) {
    return { successes: 0, n: 0, p: 0, low: 0, high: 0, z };
  }
  const p = successes / n;
  const z2 = z * z;
  const denominator = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denominator;
  const margin =
    (z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n)) / denominator;
  return {
    successes,
    n,
    p,
    low: Math.max(0, center - margin),
    high: Math.min(1, center + margin),
    z,
  };
}

/** True when two closed intervals share any point, including a shared endpoint. */
export function intervalsOverlap(
  a: { low: number; high: number },
  b: { low: number; high: number },
): boolean {
  return a.low <= b.high && b.low <= a.high;
}

/** Binomial coefficient for n up to the demonstration size. Returns 0 for impossible k. */
export function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || n < 0 || k > n) return 0;
  let result = 1;
  for (let i = 1; i <= k; i += 1) {
    result = (result * (n - k + i)) / i;
  }
  return result;
}

/**
 * Two-sided exact sign test on discordant pairs (exact McNemar).
 * `aOnly` is the count where the first profile passed and the second failed.
 * With no discordant pairs the p-value is 1. This is not a chi-square approximation.
 */
export function exactDiscordantTest(aOnly: number, bOnly: number): { n: number; pValue: number } {
  const n = aOnly + bOnly;
  if (n === 0 || aOnly < 0 || bOnly < 0) return { n: 0, pValue: 1 };
  const smaller = Math.min(aOnly, bOnly);
  let cdf = 0;
  for (let i = 0; i <= smaller; i += 1) {
    cdf += binomialCoefficient(n, i) * 0.5 ** n;
  }
  return { n, pValue: Math.min(1, 2 * cdf) };
}

/**
 * Bonferroni cutoff for a family of comparisons at alpha 0.05.
 * `comparisons` below 1 returns 0.05 so a single look keeps the usual cutoff.
 */
export function bonferroniAlpha(comparisons: number, alpha = 0.05): number {
  if (comparisons < 1) return alpha;
  return alpha / comparisons;
}

/**
 * Sentence for a paired comparison of two demonstration profiles.
 * Overlap and non-overlap are both described as properties of this sample.
 */
export function comparisonNote(overlap: boolean, n: number): string {
  const shared = `Both intervals use the same ${n} demonstration task${n === 1 ? "" : "s"}.`;
  if (overlap) {
    return `${shared} The 95% Wilson intervals overlap, so this sample does not separate the two profiles. Overlap is not proof that the profiles are equal.`;
  }
  return `${shared} The 95% Wilson intervals do not overlap. That is still one unadjusted look at a synthetic sample, not a pre-registered result and not evidence about other tasks.`;
}
