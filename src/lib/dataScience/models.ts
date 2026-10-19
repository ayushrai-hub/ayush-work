/**
 * Closed-form baselines and linear models for the synthetic retail panel.
 *
 * Ordinary least squares and ridge regression are solved with `solveLinearSystem`.
 * Ridge penalizes every coefficient except the intercept after standardizing the
 * other columns on the training rows only. Metrics are computed from the test rows
 * of that same fit. A leaked feature is fit separately and labeled as leakage.
 *
 * Connects to:
 * - src/lib/dataScience/stats.ts (`solveLinearSystem`, `mean`, `median`).
 * - src/lib/dataScience/quality.ts (`CleanRecord`).
 * - src/lib/dataScience/analysis.ts.
 * - src/__tests__/dataScience.test.ts.
 */
import type { CleanRecord } from "./quality";
import { mean, median, solveLinearSystem } from "./stats";

/** Ridge penalty added to the diagonal of the standardized normal equations, except the intercept. */
export const RIDGE_LAMBDA = 1;

/** Names of the columns in the valid linear models, after the intercept. */
export const LINEAR_FEATURES = [
  "price",
  "discount",
  "promotion",
  "competitorPrice",
  "inventory",
  "rating",
  "spring",
] as const;

/** Regression metrics. MAPE and R² are null when their denominators are unusable. */
export interface RegressionMetrics {
  mae: number;
  rmse: number;
  mape: number | null;
  rSquared: number | null;
  n: number;
}

/** One fitted model and its test metrics. */
export interface FittedModel {
  id: string;
  name: string;
  role: "baseline" | "linear" | "regularized" | "leakage";
  purpose: string;
  assumptions: string;
  nTrain: number;
  nTest: number;
  coefficients: { name: string; value: number }[] | null;
  metrics: RegressionMetrics | null;
  unavailable: string | null;
  testPredictions: { id: string; actual: number; predicted: number }[];
}

/** One test-row error with a rule tag. The tag is a hypothesis about the row, not a proven cause. */
export interface ErrorRow {
  id: string;
  productName: string;
  category: string;
  day: number;
  promotion: 0 | 1;
  inventory: number;
  price: number;
  actual: number;
  predicted: number;
  error: number;
  tags: string[];
}

/**
 * Mean absolute error, root mean squared error, mean absolute percentage error, and R².
 * MAPE is null when any actual value is 0, because the percentage is then undefined.
 * R² is null when the actual values have no variance.
 */
export function regressionMetrics(actual: number[], predicted: number[]): RegressionMetrics | null {
  if (actual.length === 0 || actual.length !== predicted.length) return null;
  let absolute = 0;
  let squared = 0;
  for (let index = 0; index < actual.length; index += 1) {
    const error = (predicted[index] ?? 0) - (actual[index] ?? 0);
    absolute += Math.abs(error);
    squared += error * error;
  }
  const center = mean(actual) ?? 0;
  let total = 0;
  for (const value of actual) {
    const delta = value - center;
    total += delta * delta;
  }
  let mape: number | null = 0;
  for (const value of actual) {
    if (value === 0) {
      mape = null;
      break;
    }
  }
  if (mape !== null) {
    let percent = 0;
    for (let index = 0; index < actual.length; index += 1) {
      percent += Math.abs((predicted[index] ?? 0) - (actual[index] ?? 0)) / Math.abs(actual[index] ?? 1);
    }
    mape = (percent / actual.length) * 100;
  }
  return {
    mae: absolute / actual.length,
    rmse: Math.sqrt(squared / actual.length),
    mape,
    rSquared: total === 0 ? null : 1 - squared / total,
    n: actual.length,
  };
}

/** Design-matrix cell for a valid feature. Spring is 1 when the row's season is spring. */
export function featureValue(row: CleanRecord, name: (typeof LINEAR_FEATURES)[number]): number {
  if (name === "spring") return row.season === "spring" ? 1 : 0;
  return row[name];
}

interface LinearFit {
  coefficients: { name: string; value: number }[];
  predict: (rowValues: number[]) => number;
}

/**
 * Ordinary least squares for a design that already includes an intercept column of ones.
 * `featureNames[0]` must be the intercept label. Returns null when the system is singular
 * or there are fewer rows than columns.
 */
export function fitOrdinaryLeastSquares(
  design: number[][],
  target: number[],
  featureNames: string[],
): LinearFit | null {
  if (design.length === 0 || design.length < (design[0]?.length ?? 0)) return null;
  const width = design[0]?.length ?? 0;
  const gram: number[][] = Array.from({ length: width }, () => Array(width).fill(0));
  const right: number[] = Array(width).fill(0);
  for (let rowIndex = 0; rowIndex < design.length; rowIndex += 1) {
    const row = design[rowIndex] ?? [];
    for (let column = 0; column < width; column += 1) {
      right[column] = (right[column] ?? 0) + (row[column] ?? 0) * (target[rowIndex] ?? 0);
      for (let other = 0; other < width; other += 1) {
        const gramRow = gram[column];
        if (!gramRow) return null;
        gramRow[other] = (gramRow[other] ?? 0) + (row[column] ?? 0) * (row[other] ?? 0);
      }
    }
  }
  const solved = solveLinearSystem(gram, right);
  if (!solved) return null;
  return {
    coefficients: featureNames.map((name, index) => ({ name, value: solved[index] ?? 0 })),
    predict: (rowValues) => solved.reduce((sum, coef, index) => sum + coef * (rowValues[index] ?? 0), 0),
  };
}

/**
 * Ridge regression on standardized non-intercept columns. The penalty is `RIDGE_LAMBDA`.
 * Coefficients are translated back to the original scale of the features.
 * A column with zero training variance is dropped and named in the returned list only if it remains.
 */
export function fitRidge(design: number[][], target: number[], featureNames: string[]): LinearFit | null {
  if (design.length === 0 || featureNames[0] !== "intercept") return null;
  const width = design[0]?.length ?? 0;
  const means = Array(width).fill(0);
  const scales = Array(width).fill(1);
  const keep = [0];
  for (let column = 1; column < width; column += 1) {
    const columnValues = design.map((row) => row[column] ?? 0);
    const columnMean = mean(columnValues) ?? 0;
    means[column] = columnMean;
    let sum = 0;
    for (const value of columnValues) sum += (value - columnMean) ** 2;
    const sd = Math.sqrt(sum / Math.max(1, columnValues.length - 1));
    if (sd < 1e-10) continue;
    scales[column] = sd;
    keep.push(column);
  }
  const standardized = design.map((row) =>
    keep.map((column) => (column === 0 ? 1 : ((row[column] ?? 0) - (means[column] ?? 0)) / (scales[column] ?? 1))),
  );
  const widthKept = keep.length;
  const gram: number[][] = Array.from({ length: widthKept }, () => Array(widthKept).fill(0));
  const right: number[] = Array(widthKept).fill(0);
  for (let rowIndex = 0; rowIndex < standardized.length; rowIndex += 1) {
    const row = standardized[rowIndex] ?? [];
    for (let column = 0; column < widthKept; column += 1) {
      right[column] = (right[column] ?? 0) + (row[column] ?? 0) * (target[rowIndex] ?? 0);
      for (let other = 0; other < widthKept; other += 1) {
        const gramRow = gram[column];
        if (!gramRow) return null;
        gramRow[other] = (gramRow[other] ?? 0) + (row[column] ?? 0) * (row[other] ?? 0);
      }
    }
  }
  for (let column = 1; column < widthKept; column += 1) {
    const gramRow = gram[column];
    if (!gramRow) return null;
    gramRow[column] = (gramRow[column] ?? 0) + RIDGE_LAMBDA;
  }
  const solved = solveLinearSystem(gram, right);
  if (!solved) return null;
  const original = Array(width).fill(0);
  let intercept = solved[0] ?? 0;
  keep.forEach((sourceColumn, index) => {
    if (sourceColumn === 0) return;
    const scaled = (solved[index] ?? 0) / (scales[sourceColumn] ?? 1);
    original[sourceColumn] = scaled;
    intercept -= scaled * (means[sourceColumn] ?? 0);
  });
  original[0] = intercept;
  return {
    coefficients: featureNames.map((name, index) => ({ name, value: original[index] ?? 0 })),
    predict: (rowValues) => original.reduce((sum, coef, index) => sum + coef * (rowValues[index] ?? 0), 0),
  };
}

/** Intercept plus the valid feature columns, in `LINEAR_FEATURES` order. */
export function validDesignRow(row: CleanRecord): number[] {
  return [1, ...LINEAR_FEATURES.map((name) => featureValue(row, name))];
}

/** Fit a constant baseline. Every test prediction is the training aggregate. */
function fitConstant(
  id: string,
  name: string,
  purpose: string,
  train: CleanRecord[],
  test: CleanRecord[],
  aggregate: (values: number[]) => number | null,
): FittedModel {
  const value = aggregate(train.map((row) => row.units));
  if (value === null || test.length === 0) {
    return {
      id,
      name,
      role: "baseline",
      purpose,
      assumptions: "The future mean equals the training mean. No product or price information is used.",
      nTrain: train.length,
      nTest: test.length,
      coefficients: null,
      metrics: null,
      unavailable: "The training or test split has no rows.",
      testPredictions: [],
    };
  }
  const predictions = test.map((row) => ({ id: row.id, actual: row.units, predicted: value }));
  return {
    id,
    name,
    role: "baseline",
    purpose,
    assumptions: "The future mean equals the training aggregate. No product or price information is used.",
    nTrain: train.length,
    nTest: test.length,
    coefficients: [{ name: "constant", value }],
    metrics: regressionMetrics(
      predictions.map((row) => row.actual),
      predictions.map((row) => row.predicted),
    ),
    unavailable: null,
    testPredictions: predictions,
  };
}

/** Fit OLS or ridge on the valid features. */
function fitValidLinear(train: CleanRecord[], test: CleanRecord[], kind: "ols" | "ridge"): FittedModel {
  const names = ["intercept", ...LINEAR_FEATURES];
  const design = train.map(validDesignRow);
  const target = train.map((row) => row.units);
  const fit =
    kind === "ols"
      ? fitOrdinaryLeastSquares(design, target, names)
      : fitRidge(design, target, names);
  const shared = {
    nTrain: train.length,
    nTest: test.length,
    assumptions:
      "The fit is linear and additive. It uses only columns treated as known on that day. It is an association in this synthetic panel, not a causal price effect.",
  };
  if (!fit || test.length === 0) {
    return {
      id: kind,
      name: kind === "ols" ? "Ordinary least squares" : "Ridge regression",
      role: kind === "ols" ? "linear" : "regularized",
      purpose:
        kind === "ols"
          ? "A linear association between units and the valid same-day features."
          : `The same linear features with an L2 penalty of ${RIDGE_LAMBDA} on the standardized coefficients.`,
      ...shared,
      coefficients: null,
      metrics: null,
      unavailable: "The design matrix could not be solved, or the test split is empty.",
      testPredictions: [],
    };
  }
  const predictions = test.map((row) => ({
    id: row.id,
    actual: row.units,
    predicted: fit.predict(validDesignRow(row)),
  }));
  return {
    id: kind,
    name: kind === "ols" ? "Ordinary least squares" : "Ridge regression",
    role: kind === "ols" ? "linear" : "regularized",
    purpose:
      kind === "ols"
        ? "A linear association between units and the valid same-day features."
        : `The same linear features with an L2 penalty of ${RIDGE_LAMBDA} on the standardized coefficients.`,
    ...shared,
    coefficients: fit.coefficients,
    metrics: regressionMetrics(
      predictions.map((row) => row.actual),
      predictions.map((row) => row.predicted),
    ),
    unavailable: null,
    testPredictions: predictions,
  };
}

/**
 * OLS of units on (price × units) / price. That feature is units itself.
 * Test error collapses because the outcome was copied into the feature. This is leakage.
 */
function fitRevenueLeak(train: CleanRecord[], test: CleanRecord[]): FittedModel {
  const design = train.map((row) => [1, row.price === 0 ? 0 : (row.price * row.units) / row.price]);
  const fit = fitOrdinaryLeastSquares(design, train.map((row) => row.units), ["intercept", "unitsCopiedFromRevenue"]);
  const predictions =
    fit === null
      ? []
      : test.map((row) => ({
          id: row.id,
          actual: row.units,
          predicted: fit.predict([1, row.price === 0 ? 0 : (row.price * row.units) / row.price]),
        }));
  return {
    id: "leaky-revenue",
    name: "Leaky: units copied from revenue",
    role: "leakage",
    purpose: "Shows a feature that repeats the outcome. Revenue divided by price is units.",
    assumptions: "This feature is not available as a predictor of units, because it is computed from units.",
    nTrain: train.length,
    nTest: test.length,
    coefficients: fit?.coefficients ?? null,
    metrics:
      predictions.length === 0
        ? null
        : regressionMetrics(
            predictions.map((row) => row.actual),
            predictions.map((row) => row.predicted),
          ),
    unavailable: fit ? null : "The leaked design could not be solved.",
    testPredictions: predictions,
  };
}

/** Most recent earlier day for the same product in this set. */
export function previousUnits(row: CleanRecord, rows: readonly CleanRecord[]): number | null {
  const earlier = rows
    .filter((candidate) => candidate.productId === row.productId && candidate.day < row.day)
    .sort((a, b) => b.day - a.day);
  return earlier[0]?.units ?? null;
}

/**
 * OLS with the valid features plus lagged units.
 * Rows without an earlier day for that product are left out of this fit only.
 * The lag uses an earlier day, never the current or a later day.
 */
export function fitLagModel(train: CleanRecord[], test: CleanRecord[], all: readonly CleanRecord[]): FittedModel {
  const withLag = (row: CleanRecord) => {
    const lag = previousUnits(row, all);
    return lag === null ? null : { row, lag };
  };
  const trainRows = train.map(withLag).filter((row): row is { row: CleanRecord; lag: number } => row !== null);
  const testRows = test.map(withLag).filter((row): row is { row: CleanRecord; lag: number } => row !== null);
  const names = ["intercept", ...LINEAR_FEATURES, "lagUnits"];
  const design = trainRows.map((item) => [...validDesignRow(item.row), item.lag]);
  const fit = fitOrdinaryLeastSquares(
    design,
    trainRows.map((item) => item.row.units),
    names,
  );
  const predictions =
    fit === null
      ? []
      : testRows.map((item) => ({
          id: item.row.id,
          actual: item.row.units,
          predicted: fit.predict([...validDesignRow(item.row), item.lag]),
        }));
  return {
    id: "ols-lag",
    name: "OLS with lagged units",
    role: "linear",
    purpose: "Adds the previous observed units for the same product. The first day of a product has no lag and is excluded.",
    assumptions:
      "The lag is the latest earlier day in the analysis set, including an earlier test day. That is a one-step score that sees the actual previous units. It is not a multi-step forecast made only from the training period. Its test size can differ from the other models.",
    nTrain: trainRows.length,
    nTest: testRows.length,
    coefficients: fit?.coefficients ?? null,
    metrics:
      predictions.length === 0
        ? null
        : regressionMetrics(
            predictions.map((row) => row.actual),
            predictions.map((row) => row.predicted),
          ),
    unavailable: fit ? null : "The lag model could not be solved.",
    testPredictions: predictions,
  };
}

/** Fit the baselines, the two valid linear models, the lag model, and the leaked model. */
export function fitModels(train: CleanRecord[], test: CleanRecord[], all: readonly CleanRecord[]): FittedModel[] {
  return [
    fitConstant("mean", "Training mean", "Predict every test row with the mean of training units.", train, test, mean),
    fitConstant(
      "median",
      "Training median",
      "Predict every test row with the median of training units.",
      train,
      test,
      median,
    ),
    fitValidLinear(train, test, "ols"),
    fitValidLinear(train, test, "ridge"),
    fitLagModel(train, test, all),
    fitRevenueLeak(train, test),
  ];
}

/**
 * Tag test errors. Positive error means the prediction is above the actual units.
 * Tags are rules a reviewer can check. They are not diagnoses of a cause.
 */
export function describeErrors(
  model: FittedModel,
  rows: readonly CleanRecord[],
  trainPrices: number[],
): ErrorRow[] {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const metrics = model.metrics;
  const cutoff = metrics ? Math.max(5, metrics.mae * 1.5) : 5;
  const minPrice = trainPrices.length ? Math.min(...trainPrices) : 0;
  const maxPrice = trainPrices.length ? Math.max(...trainPrices) : 0;
  return model.testPredictions.map((prediction) => {
    const row = byId.get(prediction.id);
    const error = prediction.predicted - prediction.actual;
    const tags: string[] = [];
    if (error <= -cutoff) tags.push("large-underprediction");
    if (error >= cutoff) tags.push("large-overprediction");
    if ((row?.inventory ?? 0) <= 5) tags.push("low-inventory");
    if (row?.promotion === 1) tags.push("promotional");
    if (row && (row.price < minPrice || row.price > maxPrice)) tags.push("price-outside-train");
    if (tags.length === 0) tags.push("within-typical-error");
    return {
      id: prediction.id,
      productName: row?.productName ?? prediction.id,
      category: row?.category ?? "",
      day: row?.day ?? 0,
      promotion: row?.promotion ?? 0,
      inventory: row?.inventory ?? 0,
      price: row?.price ?? 0,
      actual: prediction.actual,
      predicted: prediction.predicted,
      error,
      tags,
    };
  });
}

/**
 * Linear partial dependence for one feature: other features are held at their training means.
 * This is a property of the fitted line, not an observed demand curve.
 */
export function partialDependence(
  model: FittedModel,
  feature: (typeof LINEAR_FEATURES)[number],
  train: readonly CleanRecord[],
  points: number[],
): { feature: number; prediction: number }[] {
  const coef = new Map((model.coefficients ?? []).map((item) => [item.name, item.value]));
  if (!coef.has("intercept") || !coef.has(feature)) return [];
  const means = Object.fromEntries(
    LINEAR_FEATURES.map((name) => [name, mean(train.map((row) => featureValue(row, name))) ?? 0]),
  ) as Record<(typeof LINEAR_FEATURES)[number], number>;
  return points.map((value) => {
    let prediction = coef.get("intercept") ?? 0;
    for (const name of LINEAR_FEATURES) {
      const used = name === feature ? value : means[name];
      prediction += (coef.get(name) ?? 0) * used;
    }
    return { feature: value, prediction };
  });
}
