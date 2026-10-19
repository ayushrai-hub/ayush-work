/**
 * One pass from the raw Northline extract to the numbers the workbench shows.
 *
 * Cleaning, group comparisons, features, models, and the decision note all use
 * the same kept rows. Table filters do not call this again. The weekly series
 * does not depend on the retail cleaning options.
 *
 * Connects to:
 * - src/lib/dataScience/retailDataset.ts, quality.ts, inference.ts, models.ts, series.ts, stats.ts.
 * - src/components/pow/ds/InsightLab.tsx and src/content/aiDataScientist.ts.
 * - src/__tests__/dataScience.test.ts.
 */
import { compareGroups } from "./inference";
import {
  describeErrors,
  fitModels,
  fitOrdinaryLeastSquares,
  partialDependence,
  previousUnits,
  regressionMetrics,
  type ErrorRow,
  type FittedModel,
} from "./models";
import {
  cleanRetail,
  inspectRaw,
  type CleanRecord,
  type CleaningOptions,
  type CleaningResult,
  type QualityFinding,
} from "./quality";
import { RAW_RECORDS, TRAIN_LAST_DAY, type RawRetailRecord } from "./retailDataset";
import { summarizeSeries, type SeriesSummary } from "./series";
import {
  groupMeans,
  histogram,
  interquartileRange,
  mean,
  median,
  pearson,
  sampleStdev,
  type GroupMean,
  type HistogramBin,
} from "./stats";

/** A kept row plus features a reviewer can inspect. Lag and rolling means use only earlier days. */
export interface FeatureRow extends CleanRecord {
  discountPercent: number;
  lagUnits: number | null;
  rolling3: number | null;
  priceRelativeToEarlierCategoryMedian: number | null;
  previousPromotion: 0 | 1 | null;
  inventoryAvailable: 0 | 1;
  futureUnits: number | null;
}

/** The calculated state of the workbench for one set of cleaning options. */
export interface AnalysisSnapshot {
  examined: number;
  findings: QualityFinding[];
  cleaning: CleaningResult;
  train: CleanRecord[];
  test: CleanRecord[];
  unitsSummary: {
    n: number;
    mean: number | null;
    median: number | null;
    stdev: number | null;
    iqr: number | null;
  };
  histogram: HistogramBin[];
  categoryMeans: GroupMean[];
  seasonMeans: GroupMean[];
  weekdayMeans: GroupMean[];
  correlations: { pair: string; value: number | null; note: string }[];
  promotion: ReturnType<typeof compareGroups>;
  promotionBySeason: { season: string; comparison: ReturnType<typeof compareGroups> }[];
  features: FeatureRow[];
  models: FittedModel[];
  errors: ErrorRow[];
  partialPrice: { feature: number; prediction: number }[];
  sensitivityMae: number | null;
  series: SeriesSummary;
  testIsAllSpring: boolean;
  decision: {
    observed: string;
    predicts: string;
    reliability: string;
    uncertain: string;
    action: string;
    evidence: string;
  };
}

/** Format a number for the decision sentences. Null stays as the word "unavailable". */
function num(value: number | null, digits = 2): string {
  if (value === null || Number.isNaN(value)) return "unavailable";
  return value.toFixed(digits);
}

/** Features for kept rows. `futureUnits` is joined from the raw extract and is not a model input. */
export function buildFeatures(rows: readonly CleanRecord[], raw: readonly RawRetailRecord[]): FeatureRow[] {
  const future = new Map(raw.map((row) => [row.id, row.unitsNextDay]));
  return rows.map((row) => {
    const earlierPrices = rows
      .filter((candidate) => candidate.category === row.category && candidate.day < row.day)
      .map((candidate) => candidate.price);
    const medianPrice = median(earlierPrices);
    const earlierSame = rows
      .filter((candidate) => candidate.productId === row.productId && candidate.day < row.day)
      .sort((a, b) => b.day - a.day);
    const rollingSource = earlierSame.slice(0, 3).map((candidate) => candidate.units);
    return {
      ...row,
      discountPercent: row.discount * 100,
      lagUnits: previousUnits(row, rows),
      rolling3: rollingSource.length === 0 ? null : mean(rollingSource),
      priceRelativeToEarlierCategoryMedian:
        medianPrice && medianPrice !== 0 ? row.price / medianPrice : null,
      previousPromotion: earlierSame[0] ? earlierSame[0].promotion : null,
      inventoryAvailable: row.inventory > 0 ? 1 : 0,
      futureUnits: future.get(row.id) ?? null,
    };
  });
}

/** Test MAE of an OLS fit that omits price. Null when that system cannot be solved. */
export function maeWithoutPrice(train: readonly CleanRecord[], test: readonly CleanRecord[]): number | null {
  const names = ["intercept", "discount", "promotion", "competitorPrice", "inventory", "rating", "spring"];
  const rowOf = (row: CleanRecord) => [
    1,
    row.discount,
    row.promotion,
    row.competitorPrice,
    row.inventory,
    row.rating,
    row.season === "spring" ? 1 : 0,
  ];
  const fit = fitOrdinaryLeastSquares(
    train.map(rowOf),
    train.map((row) => row.units),
    names,
  );
  if (!fit || test.length === 0) return null;
  return (
    regressionMetrics(
      test.map((row) => row.units),
      test.map((row) => fit.predict(rowOf(row))),
    )?.mae ?? null
  );
}

/** Correlation of two numeric fields on the same rows. */
function pair(rows: readonly CleanRecord[], left: (row: CleanRecord) => number, right: (row: CleanRecord) => number): number | null {
  return pearson(rows.map(left), rows.map(right));
}

/**
 * Run the workbench calculations.
 * `modelId` selects which fit supplies the error table and the partial-dependence line.
 */
export function analyzeRetail(options: CleaningOptions, modelId = "ols"): AnalysisSnapshot {
  const findings = inspectRaw(RAW_RECORDS);
  const cleaning = cleanRetail(RAW_RECORDS, options);
  const train = cleaning.kept.filter((row) => row.day <= TRAIN_LAST_DAY);
  const test = cleaning.kept.filter((row) => row.day > TRAIN_LAST_DAY);
  const units = cleaning.kept.map((row) => row.units);
  const promo = cleaning.kept.filter((row) => row.promotion === 1).map((row) => row.units);
  const plain = cleaning.kept.filter((row) => row.promotion === 0).map((row) => row.units);
  const models = fitModels(train, test, cleaning.kept);
  const selected = models.find((model) => model.id === modelId) ?? models[2] ?? models[0];
  const ols = models.find((model) => model.id === "ols");
  const pricePoints = [0, 1, 2, 3, 4, 5, 6, 7].map((step) => {
    const prices = train.map((row) => row.price);
    const low = prices.length ? Math.min(...prices) : 0;
    const high = prices.length ? Math.max(...prices) : 0;
    return low + ((high - low) * step) / 7;
  });
  const promotion = compareGroups(promo, plain, "promotion", "no promotion");
  const difference = promotion.differenceOfMeans;
  const testIsAllSpring = test.length > 0 && test.every((row) => row.season === "spring");
  return {
    examined: RAW_RECORDS.length,
    findings,
    cleaning,
    train,
    test,
    unitsSummary: {
      n: units.length,
      mean: mean(units),
      median: median(units),
      stdev: sampleStdev(units),
      iqr: interquartileRange(units),
    },
    histogram: histogram(units, 5),
    categoryMeans: groupMeans(cleaning.kept.map((row) => ({ key: row.category, value: row.units }))),
    seasonMeans: groupMeans(cleaning.kept.map((row) => ({ key: row.season, value: row.units }))),
    weekdayMeans: groupMeans(cleaning.kept.map((row) => ({ key: row.dayOfWeek, value: row.units }))),
    correlations: [
      {
        pair: "price and units",
        value: pair(cleaning.kept, (row) => row.price, (row) => row.units),
        note: "Association across mixed promotions, seasons, and products. Not a price effect.",
      },
      {
        pair: "promotion and units",
        value: pair(cleaning.kept, (row) => row.promotion, (row) => row.units),
        note: "The generator adds units on promotion days, and it also turns promotions on more often in spring.",
      },
      {
        pair: "promotion and spring",
        value: pair(cleaning.kept, (row) => row.promotion, (row) => (row.season === "spring" ? 1 : 0)),
        note: "This correlation is built into the promotion rule. It is confounding, not a discovery.",
      },
    ],
    promotion,
    promotionBySeason: (["winter", "spring"] as const).map((season) => ({
      season,
      comparison: compareGroups(
        cleaning.kept.filter((row) => row.season === season && row.promotion === 1).map((row) => row.units),
        cleaning.kept.filter((row) => row.season === season && row.promotion === 0).map((row) => row.units),
        "promotion",
        "no promotion",
      ),
    })),
    features: buildFeatures(cleaning.kept, RAW_RECORDS),
    models,
    errors: selected
      ? describeErrors(
          selected,
          cleaning.kept,
          train.map((row) => row.price),
        )
      : [],
    partialPrice: ols ? partialDependence(ols, "price", train, pricePoints) : [],
    sensitivityMae: maeWithoutPrice(train, test),
    series: summarizeSeries(),
    testIsAllSpring,
    decision: {
      observed: `In the cleaned synthetic sample, promotional rows average ${num(promotion.leftMean)} units and other rows average ${num(promotion.rightMean)} (difference ${num(difference)}).`,
      predicts: `The selected fit's test MAE is ${num(selected?.metrics?.mae ?? null)} units on ${selected?.nTest ?? 0} holdout rows. That is a prediction error, not a measured sales result.`,
      reliability: testIsAllSpring
        ? `The holdout is every day after day ${TRAIN_LAST_DAY}, and those rows are all labeled spring. A small synthetic holdout is a weak check.`
        : `The holdout is every day after day ${TRAIN_LAST_DAY}. A small synthetic holdout is a weak check.`,
      uncertain: "The price coefficient is an association. Historical rows do not identify what would happen if a price were changed.",
      action: "The pricing panel can maximize an assumed margin function. That grid maximum is not a price to charge.",
      evidence: "A randomized price test, with a predeclared outcome and guardrails, would be a different kind of evidence. This page does not contain one.",
    },
  };
}
