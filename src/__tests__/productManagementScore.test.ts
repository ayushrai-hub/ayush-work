/**
 * Tests the product-management notebook score.
 *
 * The numbers are hand-checked against the written formula. They are not product metrics.
 *
 * Connects to:
 * - src/lib/productManagementScore.ts
 */
import { describe, expect, it } from "vitest";
import {
  clampScore,
  DEFAULT_WEIGHTS,
  explainScore,
  initiativeScore,
  normalizeWeights,
  rankInitiatives,
} from "../lib/productManagementScore";

const full: Parameters<typeof initiativeScore>[0] = {
  userValue: 5,
  alignment: 5,
  confidence: 5,
  effort: 1,
  risk: 1,
};

/** Formula, clamps, weights, and stable ranking. */
describe("product management score", () => {
  it("computes the weighted value-confidence score adjusted for effort and risk", () => {
    expect(initiativeScore(full, DEFAULT_WEIGHTS)).toBeCloseTo(5);
    expect(initiativeScore({ ...full, effort: 5 }, DEFAULT_WEIGHTS)).toBeCloseTo(1);
    expect(initiativeScore({ ...full, confidence: 1 }, DEFAULT_WEIGHTS)).toBeCloseTo(1);
    expect(
      initiativeScore(
        { userValue: 1, alignment: 1, confidence: 5, effort: 1, risk: 5 },
        DEFAULT_WEIGHTS,
      ),
    ).toBeCloseTo(1 / 1.15);
  });

  it("clamps inputs and weights, and breaks ties by title", () => {
    expect(clampScore(0)).toBe(1);
    expect(clampScore(9)).toBe(5);
    expect(clampScore(Number.NaN)).toBe(1);
    expect(normalizeWeights(0).userValue).toBeCloseTo(0.2);
    expect(normalizeWeights(0).alignment).toBeCloseTo(0.8);
    expect(normalizeWeights(1).userValue).toBeCloseTo(0.8);
    expect(normalizeWeights(1).alignment).toBeCloseTo(0.2);
    expect(normalizeWeights(Number.NaN).userValue).toBe(DEFAULT_WEIGHTS.userValue);
    expect(explainScore(DEFAULT_WEIGHTS)).toContain("0.60");

    const ranked = rankInitiatives(
      [
        { id: "low", title: "Bravo", userValue: 1, alignment: 1, confidence: 1, effort: 5, risk: 5 },
        { id: "high", title: "Alpha", ...full },
        { id: "tie", title: "Alpha twin", ...full },
      ],
      DEFAULT_WEIGHTS,
    );
    expect(ranked.map((item) => item.id)).toEqual(["high", "tie", "low"]);
    expect(ranked.map((item) => item.rank)).toEqual([1, 2, 3]);
    expect(rankInitiatives([], DEFAULT_WEIGHTS)).toEqual([]);

    const uneven = { userValue: 5, alignment: 1, confidence: 5, effort: 1, risk: 1 };
    expect(initiativeScore(uneven, normalizeWeights(0.8))).toBeGreaterThan(
      initiativeScore(uneven, normalizeWeights(0.2)),
    );
  });
});
