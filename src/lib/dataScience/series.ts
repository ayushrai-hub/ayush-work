/**
 * A separate synthetic weekly series for the time-series section.
 *
 * The series is constructed with a trend, a 4-week seasonal wiggle, and a level
 * shift after week 12. It is not a market price and it is not the retail panel.
 * Forecasts are naive or one-feature linear fits. No recurrent network is trained.
 *
 * Connects to:
 * - src/lib/dataScience/stats.ts and models.ts (`fitOrdinaryLeastSquares`, `regressionMetrics`).
 * - src/lib/dataScience/analysis.ts.
 * - src/__tests__/dataScience.test.ts.
 */
import { fitOrdinaryLeastSquares, regressionMetrics } from "./models";
import { mean, pearson } from "./stats";

/** One constructed week. */
export interface WeekPoint {
  week: number;
  units: number;
  regime: "early" | "late";
}

/** Fixed disturbances, one per week. */
const WEEK_NOISE = [1, -1, 0, 2, -2, 1, 0, -1, 2, -2, 1, 0, 0, 1, -1, 2, 0, -2, 1, -1, 0, 2, -1, 1] as const;

/** Build the 24-week series. Early weeks use level 20. Later weeks use level 32. */
export function syntheticWeeklyUnits(): WeekPoint[] {
  return WEEK_NOISE.map((noise, index) => {
    const week = index + 1;
    const regime = week <= 12 ? "early" : "late";
    const level = regime === "early" ? 20 : 32;
    const season = [0, 3, 1, -2][index % 4] ?? 0;
    return { week, units: Math.round(level + week * 0.4 + season + noise), regime };
  });
}

/** Trailing mean of up to `window` earlier points. The current point is not included. */
export function trailingMean(values: number[], index: number, window: number): number | null {
  if (index <= 0) return null;
  const start = Math.max(0, index - window);
  const slice = values.slice(start, index);
  return mean(slice);
}

/** Centered mean of the previous, current, and next point. The next point is future information. */
export function centeredMean(values: number[], index: number): number | null {
  if (index <= 0 || index >= values.length - 1) return null;
  return mean([values[index - 1] ?? 0, values[index] ?? 0, values[index + 1] ?? 0]);
}

/** MAE of a one-feature linear fit. Null when the fit cannot be solved. */
function linearMae(trainX: number[], trainY: number[], testX: number[], testY: number[]): number | null {
  const fit = fitOrdinaryLeastSquares(
    trainX.map((value) => [1, value]),
    trainY,
    ["intercept", "feature"],
  );
  if (!fit || testY.length === 0) return null;
  const predicted = testX.map((value) => fit.predict([1, value]));
  return regressionMetrics(testY, predicted)?.mae ?? null;
}

/** Summaries that the time-series section displays. Every number is computed from `syntheticWeeklyUnits`. */
export interface SeriesSummary {
  points: WeekPoint[];
  lag1Correlation: number | null;
  trainMean: number | null;
  testMean: number | null;
  naiveMae: number | null;
  trainMeanMae: number | null;
  flatHorizonMae: number | null;
  trailingProtocolMae: number | null;
  centeredProtocolMae: number | null;
  randomSplitCenteredMae: number | null;
}

/**
 * Compare a past-only temporal protocol with a centered window and with a seeded random split.
 * The centered window includes the current and next observation, so it is not a valid forecast feature.
 * The random split is a fixed permutation of eligible weeks, not a fresh draw on each call.
 */
export function summarizeSeries(): SeriesSummary {
  const points = syntheticWeeklyUnits();
  const values = points.map((point) => point.units);
  const lag1Correlation = pearson(values.slice(0, -1), values.slice(1));
  const train = values.slice(0, 18);
  const test = values.slice(18);
  const trainMeanValue = mean(train);
  const naiveErrors = test.map((value, index) => {
    const previous = index === 0 ? train[train.length - 1] : test[index - 1];
    return { actual: value, predicted: previous ?? 0 };
  });
  const naiveMae = regressionMetrics(
    naiveErrors.map((row) => row.actual),
    naiveErrors.map((row) => row.predicted),
  )?.mae ?? null;
  const trainMeanMae =
    trainMeanValue === null
      ? null
      : regressionMetrics(
          test,
          test.map(() => trainMeanValue),
        )?.mae ?? null;
  const lastTrain = train[train.length - 1] ?? 0;
  const flatHorizonMae =
    regressionMetrics(
      test.slice(0, 3),
      [lastTrain, lastTrain, lastTrain],
    )?.mae ?? null;

  const eligible: { index: number; trailing: number; centered: number; actual: number }[] = [];
  for (let index = 2; index < values.length - 1; index += 1) {
    const trailing = trailingMean(values, index, 2);
    const centered = centeredMean(values, index);
    if (trailing === null || centered === null) continue;
    eligible.push({ index, trailing, centered, actual: values[index] ?? 0 });
  }
  const temporalTrain = eligible.filter((row) => row.index < 16);
  const temporalTest = eligible.filter((row) => row.index >= 16);
  const trailingProtocolMae = linearMae(
    temporalTrain.map((row) => row.trailing),
    temporalTrain.map((row) => row.actual),
    temporalTest.map((row) => row.trailing),
    temporalTest.map((row) => row.actual),
  );
  const centeredProtocolMae = linearMae(
    temporalTrain.map((row) => row.centered),
    temporalTrain.map((row) => row.actual),
    temporalTest.map((row) => row.centered),
    temporalTest.map((row) => row.actual),
  );
  const order = [...eligible];
  const random = mulberry(7);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    const current = order[index];
    order[index] = order[swap] ?? current;
    order[swap] = current;
  }
  const randomTestCount = Math.max(1, Math.round(order.length * 0.25));
  const randomTest = order.slice(0, randomTestCount);
  const randomTrain = order.slice(randomTestCount);
  const randomSplitCenteredMae = linearMae(
    randomTrain.map((row) => row.centered),
    randomTrain.map((row) => row.actual),
    randomTest.map((row) => row.centered),
    randomTest.map((row) => row.actual),
  );
  return {
    points,
    lag1Correlation,
    trainMean: trainMeanValue,
    testMean: mean(test),
    naiveMae,
    trainMeanMae,
    flatHorizonMae,
    trailingProtocolMae,
    centeredProtocolMae,
    randomSplitCenteredMae,
  };
}

/** Small seeded generator local to the split. Not the permutation generator. */
function mulberry(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
