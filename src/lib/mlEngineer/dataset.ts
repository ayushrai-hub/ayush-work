/**
 * Synthetic weekly retail-demand rows for the machine-learning proof of work.
 *
 * Every later count, feature, and metric on `/pow/ml-engineer` is derived from `DEMAND_ROWS`.
 * The series is invented for the demonstration. It is not a customer extract and not a public dataset.
 * Clean weeks are Monday observations for three products. Extra rows are planted failures.
 *
 * Connects to:
 * - src/lib/mlEngineer/validate.ts, features.ts, and metrics.ts.
 * - src/components/pow/ml/Lab.tsx and src/content/mlEngineerPow.ts.
 */

/** Banner copy for any number or chart that comes from this file. */
export const DEMO_DATASET_LABEL =
  "Synthetic demonstration. Not a customer system, and not a measured production dataset.";

/** Categories the training contract accepts. Matching is case-sensitive on purpose. */
export const ALLOWED_CATEGORIES = ["grocery", "beverage", "household"] as const;

/** Highest price, in the demonstration's currency units, that the contract allows. */
export const PRICE_MAX = 30;

/** Highest weekly unit count the contract allows. */
export const UNITS_MAX = 400;

/** One raw demand record, including values that are intentionally the wrong type. */
export interface DemandRow {
  id: string;
  observedOn: string;
  sku: string;
  category: string;
  unitsSold: number | string | null;
  price: number | string | null;
  promo: boolean | string | null;
  inventory: number | string | null;
  /** Forbidden copy of the target. Null on rows that do not carry the leak. */
  sameWeekUnits: number | null;
  schemaVersion: 1 | 2;
  /** Set only when schema version 2 renamed `price`. */
  unitPrice: number | null;
}

/**
 * Builds one clean version-1 row.
 * Defect rows copy this shape and then override the broken field.
 */
function clean(
  id: string,
  observedOn: string,
  sku: string,
  category: string,
  unitsSold: number,
  price: number,
  promo: boolean,
  inventory: number,
): DemandRow {
  return {
    id,
    observedOn,
    sku,
    category,
    unitsSold,
    price,
    promo,
    inventory,
    sameWeekUnits: null,
    schemaVersion: 1,
    unitPrice: null,
  };
}

/**
 * The full demonstration table, in a fixed order.
 * The first 18 rows are the three product histories. The rest are planted defects.
 */
export const DEMAND_ROWS: readonly DemandRow[] = [
  clean("m1", "2024-01-01", "MILK", "grocery", 20, 4, false, 40),
  clean("m2", "2024-01-08", "MILK", "grocery", 22, 4, false, 38),
  clean("m3", "2024-01-15", "MILK", "grocery", 18, 3.5, true, 50),
  clean("m4", "2024-01-22", "MILK", "grocery", 25, 4.2, false, 30),
  clean("m5", "2024-01-29", "MILK", "grocery", 21, 4.2, false, 28),
  clean("m6", "2024-02-05", "MILK", "grocery", 19, 4, false, 35),
  clean("t1", "2024-01-01", "TEA", "beverage", 10, 3, false, 20),
  clean("t2", "2024-01-08", "TEA", "beverage", 12, 3, false, 18),
  clean("t3", "2024-01-15", "TEA", "beverage", 16, 2.5, true, 22),
  clean("t4", "2024-01-22", "TEA", "beverage", 11, 3.1, false, 15),
  clean("t5", "2024-01-29", "TEA", "beverage", 13, 3.1, false, 16),
  clean("t6", "2024-02-05", "TEA", "beverage", 14, 3, false, 19),
  clean("s1", "2024-01-01", "SOAP", "household", 8, 6, false, 12),
  clean("s2", "2024-01-08", "SOAP", "household", 9, 6, false, 11),
  clean("s3", "2024-01-15", "SOAP", "household", 14, 5, true, 20),
  clean("s4", "2024-01-22", "SOAP", "household", 8, 6.2, false, 10),
  clean("s5", "2024-01-29", "SOAP", "household", 10, 6.2, false, 9),
  clean("s6", "2024-02-05", "SOAP", "household", 9, 6, false, 14),
  {
    ...clean("d-missing", "2024-02-12", "MILK", "grocery", 0, 4, false, 10),
    unitsSold: null,
  },
  { ...clean("d-dup", "2024-01-01", "MILK", "grocery", 20, 4, false, 40) },
  {
    ...clean("d-type", "2024-02-12", "TEA", "beverage", 0, 3, false, 10),
    unitsSold: "twelve",
  },
  clean("d-category", "2024-02-12", "SOAP", "electronics", 9, 6, false, 10),
  clean("d-negative", "2024-02-12", "MILK", "grocery", -3, 4, false, 10),
  {
    ...clean("d-schema", "2024-02-12", "TEA", "beverage", 12, 0, false, 10),
    price: null,
    schemaVersion: 2,
    unitPrice: 3,
  },
  clean("d-range", "2024-02-12", "SOAP", "household", 9, 80, false, 10),
  clean("d-zero", "2024-02-12", "MILK", "grocery", 18, 0, false, 10),
  {
    ...clean("d-leak", "2024-02-12", "SOAP", "household", 11, 6, false, 12),
    sameWeekUnits: 11,
  },
  clean("d-baddate", "2024-02-31", "TEA", "beverage", 12, 3, false, 10),
  clean("d-format", "02/12/2024", "MILK", "grocery", 18, 4, false, 10),
  {
    ...clean("d-skew", "2024-02-12", "MILK", "grocery", 18, 4, false, 10),
    category: "Grocery",
  },
  clean("d-stock", "2024-02-12", "TEA", "beverage", 12, 3, false, -1),
];

/**
 * Parses a strict `YYYY-MM-DD` calendar date.
 * Returns null for the wrong shape or for an impossible day such as 31 February.
 */
export function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}
