/**
 * Causal feature construction for the synthetic demand task.
 *
 * A feature at week t may use that week's known price, promotion, and inventory, plus sales from
 * earlier weeks only. The target for week t is never an input. Random splitting and a full-series
 * median are computed only so the page can show how those choices leak.
 *
 * Connects to:
 * - src/lib/mlEngineer/validate.ts for the clean-row filter.
 * - src/lib/mlEngineer/metrics.ts, which scores the time-ordered holdout from `timeSplit`.
 */
import { DEMAND_ROWS, parseIsoDate, type DemandRow } from "./dataset";
import { validateDataset } from "./validate";

/** One supervised example. `actual` is the target and is not listed as a model input. */
export interface SupervisedRow {
  id: string;
  sku: string;
  category: string;
  observedOn: string;
  actual: number;
  lag1: number;
  rolling3: number;
  promo: 0 | 1;
  price: number;
  priceRelativeToPriorCategoryMedian: number | null;
  dayOfWeek: number;
  categoryGrocery: 0 | 1;
  categoryBeverage: 0 | 1;
  categoryHousehold: 0 | 1;
  inventory: number;
}

/** Feature names a safe serving request is allowed to send. The target is absent. */
export const SAFE_FEATURE_NAMES = [
  "lag1",
  "rolling3",
  "promo",
  "price",
  "priceRelativeToPriorCategoryMedian",
  "dayOfWeek",
  "categoryGrocery",
  "categoryBeverage",
  "categoryHousehold",
  "inventory",
] as const;

/**
 * Median of a non-empty numeric list.
 * Even counts use the mean of the two central values.
 */
export function median(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Numeric units from a raw row, or null when the cell is not a number. */
function numericUnits(row: DemandRow): number | null {
  return typeof row.unitsSold === "number" ? row.unitsSold : null;
}

/** Numeric price from a raw row, or null when the cell is not a number. */
function numericPrice(row: DemandRow): number | null {
  return typeof row.price === "number" ? row.price : null;
}

/**
 * Builds supervised rows from clean history.
 * The first week of each product is dropped because it has no lag. That drop is counted.
 */
export function buildSupervised(rows: readonly DemandRow[] = DEMAND_ROWS): {
  supervised: SupervisedRow[];
  cleanCount: number;
  droppedForHistory: number;
} {
  const report = validateDataset(rows);
  const passed = new Set(report.rows.filter((row) => row.status === "pass").map((row) => row.id));
  const clean = rows.filter((row) => passed.has(row.id));
  const supervised: SupervisedRow[] = [];
  let droppedForHistory = 0;

  for (const row of clean) {
    const when = parseIsoDate(row.observedOn);
    const units = numericUnits(row);
    const price = numericPrice(row);
    if (!when || units === null || price === null || typeof row.promo !== "boolean") continue;
    const priors = clean
      .filter((other) => other.sku === row.sku && other.id !== row.id)
      .filter((other) => {
        const earlier = parseIsoDate(other.observedOn);
        return earlier !== null && earlier.getTime() < when.getTime();
      })
      .sort((a, b) => a.observedOn.localeCompare(b.observedOn));
    const priorUnits = priors
      .map(numericUnits)
      .filter((value): value is number => value !== null);
    if (priorUnits.length === 0) {
      droppedForHistory += 1;
      continue;
    }
    const lag1 = priorUnits[priorUnits.length - 1];
    const window = priorUnits.slice(-3);
    const rolling3 = window.reduce((sum, value) => sum + value, 0) / window.length;
    const priorCategoryPrices = clean
      .filter((other) => other.category === row.category && other.id !== row.id)
      .filter((other) => {
        const earlier = parseIsoDate(other.observedOn);
        return earlier !== null && earlier.getTime() < when.getTime();
      })
      .map(numericPrice)
      .filter((value): value is number => value !== null);
    const categoryMedian = median(priorCategoryPrices);
    supervised.push({
      id: row.id,
      sku: row.sku,
      category: row.category,
      observedOn: row.observedOn,
      actual: units,
      lag1,
      rolling3,
      promo: row.promo ? 1 : 0,
      price,
      priceRelativeToPriorCategoryMedian:
        categoryMedian !== null && categoryMedian !== 0 ? price / categoryMedian - 1 : null,
      dayOfWeek: when.getUTCDay(),
      categoryGrocery: row.category === "grocery" ? 1 : 0,
      categoryBeverage: row.category === "beverage" ? 1 : 0,
      categoryHousehold: row.category === "household" ? 1 : 0,
      inventory: typeof row.inventory === "number" ? row.inventory : 0,
    });
  }

  supervised.sort((a, b) => a.observedOn.localeCompare(b.observedOn) || a.sku.localeCompare(b.sku));
  return { supervised, cleanCount: clean.length, droppedForHistory };
}

/**
 * Holds out the last `testSize` weeks of each product.
 * Every test date is on or after every train date for that product.
 */
export function timeSplit(
  rows: readonly SupervisedRow[],
  testSize = 2,
): { train: SupervisedRow[]; test: SupervisedRow[] } {
  const bySku = new Map<string, SupervisedRow[]>();
  for (const row of rows) {
    const list = bySku.get(row.sku) ?? [];
    list.push(row);
    bySku.set(row.sku, list);
  }
  const train: SupervisedRow[] = [];
  const test: SupervisedRow[] = [];
  for (const list of bySku.values()) {
    const ordered = [...list].sort((a, b) => a.observedOn.localeCompare(b.observedOn));
    const cut = Math.max(1, ordered.length - testSize);
    if (ordered.length <= testSize) {
      train.push(...ordered);
      continue;
    }
    train.push(...ordered.slice(0, cut));
    test.push(...ordered.slice(cut));
  }
  return { train, test };
}

/**
 * True when some training row for a product is dated after a test row for the same product.
 * Used to show that a random split can break time order.
 */
export function splitBreaksTime(train: readonly SupervisedRow[], test: readonly SupervisedRow[]): string | null {
  for (const held of test) {
    const later = train.find((row) => row.sku === held.sku && row.observedOn > held.observedOn);
    if (later) {
      return `${held.sku} test week ${held.observedOn} is earlier than training week ${later.observedOn}.`;
    }
  }
  return null;
}

/**
 * Shuffles a copy with a fixed linear congruential generator.
 * The same seed returns the same order. This is not a cryptographic shuffle.
 */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const copy = [...items];
  let state = seed >>> 0 || 1;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (1664525 * state + 1013904223) >>> 0;
    const swap = state % (index + 1);
    const current = copy[index];
    copy[index] = copy[swap];
    copy[swap] = current;
  }
  return copy;
}

/**
 * Puts about 30 percent of rows in test without looking at the date.
 * Returns the time-order violation when one exists.
 */
export function randomSplit(rows: readonly SupervisedRow[], seed: number): {
  train: SupervisedRow[];
  test: SupervisedRow[];
  violation: string | null;
} {
  const shuffled = seededShuffle(rows, seed);
  const testCount = Math.max(1, Math.round(shuffled.length * 0.3));
  const test = shuffled.slice(0, testCount);
  const train = shuffled.slice(testCount);
  return { train, test, violation: splitBreaksTime(train, test) };
}

/**
 * Compares a causal rolling mean with a mean taken over the whole product history.
 * The second number uses future weeks and is the leakage example.
 */
export function rollingLeakageExample(rows: readonly SupervisedRow[] = buildSupervised().supervised): {
  id: string;
  observedOn: string;
  causal: number;
  leaky: number;
} | null {
  const milk = rows.filter((row) => row.sku === "MILK").sort((a, b) => a.observedOn.localeCompare(b.observedOn));
  const target = milk[1];
  if (!target) return null;
  const all = milk.map((row) => row.actual);
  const leaky = all.reduce((sum, value) => sum + value, 0) / all.length;
  return { id: target.id, observedOn: target.observedOn, causal: target.rolling3, leaky };
}

/**
 * Compares a category median fit on every week with one fit only on weeks before a cutoff.
 * Using the full median before the split lets the test weeks influence a training feature.
 */
export function preprocessingLeakageExample(rows: readonly DemandRow[] = DEMAND_ROWS): {
  cutoff: string;
  fullMedian: number | null;
  pastMedian: number | null;
} {
  const cutoff = "2024-01-22";
  const prices = rows
    .filter((row) => row.category === "grocery" && typeof row.price === "number")
    .map((row) => row.price as number);
  const past = rows
    .filter(
      (row) =>
        row.category === "grocery" &&
        typeof row.price === "number" &&
        row.observedOn < cutoff &&
        parseIsoDate(row.observedOn) !== null,
    )
    .map((row) => row.price as number);
  return { cutoff, fullMedian: median(prices), pastMedian: median(past) };
}
