/**
 * Scoring for the product-management proof-of-work prioritization notebook.
 *
 * The score is a weighted value-confidence figure divided by effort, with a small penalty as risk
 * rises. It exists so a reader can see a ranking change when the inputs change. It is not a
 * measurement of user impact, revenue, or statistical confidence.
 *
 * Connects to:
 * - src/content/productManagementPow.ts (default estimates and the written formula).
 * - src/components/pow/PmDecide.tsx (the explorer that calls `rankInitiatives`).
 * - src/__tests__/productManagementScore.test.ts.
 */

/** Five ordinal inputs, each intended to be an integer from 1 to 5. */
export interface ScoreInput {
  userValue: number;
  alignment: number;
  confidence: number;
  effort: number;
  risk: number;
}

/** Weights used by `initiativeScore`. User value and alignment are normalized to sum to 1. */
export interface ScoreWeights {
  userValue: number;
  alignment: number;
  riskPenalty: number;
}

/** An initiative row that can be ranked. `title` breaks ties. */
export interface RankableInitiative extends ScoreInput {
  id: string;
  title: string;
}

/** `RankableInitiative` plus the computed score and 1-based rank. */
export type RankedInitiative<T extends RankableInitiative> = T & {
  score: number;
  rank: number;
};

/** Starting weights: user value 0.6, alignment 0.4, risk penalty 0.15. */
export const DEFAULT_WEIGHTS: ScoreWeights = {
  userValue: 0.6,
  alignment: 0.4,
  riskPenalty: 0.15,
};

/**
 * Clamps a score input to an integer from 1 to 5.
 * Non-finite values become 1 so a blank control cannot divide by zero or produce NaN.
 */
export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(5, Math.max(1, Math.round(value)));
}

/**
 * Keeps the user-value weight between 0.2 and 0.8 and sets alignment to the remainder.
 * The risk penalty stays between 0 and 1. Non-finite inputs fall back to `DEFAULT_WEIGHTS`.
 */
export function normalizeWeights(
  userValueWeight: number,
  riskPenalty: number = DEFAULT_WEIGHTS.riskPenalty,
): ScoreWeights {
  const rawWeight = Number.isFinite(userValueWeight) ? userValueWeight : DEFAULT_WEIGHTS.userValue;
  const userValue = Math.min(0.8, Math.max(0.2, rawWeight));
  const rawPenalty = Number.isFinite(riskPenalty) ? riskPenalty : DEFAULT_WEIGHTS.riskPenalty;
  return {
    userValue,
    alignment: 1 - userValue,
    riskPenalty: Math.min(1, Math.max(0, rawPenalty)),
  };
}

/**
 * Weighted value-confidence score adjusted for effort and risk.
 *
 * ((user value × user weight) + (alignment × alignment weight)) × (confidence / 5)
 * ÷ (effort × (1 + risk penalty × (risk − 1) / 4))
 */
export function initiativeScore(input: ScoreInput, weights: ScoreWeights): number {
  const userValue = clampScore(input.userValue);
  const alignment = clampScore(input.alignment);
  const confidence = clampScore(input.confidence);
  const effort = clampScore(input.effort);
  const risk = clampScore(input.risk);
  const normalized = normalizeWeights(weights.userValue, weights.riskPenalty);
  const blended = userValue * normalized.userValue + alignment * normalized.alignment;
  const confidenceFactor = confidence / 5;
  const riskFactor = 1 + normalized.riskPenalty * ((risk - 1) / 4);
  return (blended * confidenceFactor) / (effort * riskFactor);
}

/**
 * Ranks initiatives by `initiativeScore`, highest first.
 * Equal scores use `title` ascending so the order does not depend on input order.
 */
export function rankInitiatives<T extends RankableInitiative>(
  items: readonly T[],
  weights: ScoreWeights,
): RankedInitiative<T>[] {
  const normalized = normalizeWeights(weights.userValue, weights.riskPenalty);
  return items
    .map((item) => ({ ...item, score: initiativeScore(item, normalized) }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

/**
 * One-sentence statement of the formula with the weights currently in use.
 * Rounded to two decimals so the notebook matches the sliders.
 */
export function explainScore(weights: ScoreWeights): string {
  const normalized = normalizeWeights(weights.userValue, weights.riskPenalty);
  const user = normalized.userValue.toFixed(2);
  const alignment = normalized.alignment.toFixed(2);
  const penalty = normalized.riskPenalty.toFixed(2);
  return `Score = ((user value × ${user}) + (strategic alignment × ${alignment})) × (confidence ÷ 5) ÷ (effort × (1 + ${penalty} × (risk − 1) ÷ 4)).`;
}
