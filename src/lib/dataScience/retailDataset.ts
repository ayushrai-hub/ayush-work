/**
 * Synthetic retail panel for the Insight Lab workbench.
 *
 * Northline Goods is fictional. Generated rows follow the formula in `generatedUnits`.
 * Planted rows are separate and tagged `planted-issue`. They exist so the quality
 * inspector has something real to flag. None of these rows are a retailer's data,
 * and the formula is not a demand model fitted to a market.
 *
 * Connects to:
 * - src/lib/dataScience/quality.ts reads `RAW_RECORDS`.
 * - src/lib/dataScience/analysis.ts is the only caller the page uses.
 * - src/__tests__/aiDataScientistPow.test.tsx.
 */

/** How a row entered the extract. */
export type RecordOrigin = "synthetic-generated" | "planted-issue";

/**
 * One raw extract row. Price and units may be missing, mistyped, or invalid on purpose.
 * `unitsNextDay` is a future outcome. It is not known on the day the row describes.
 */
export interface RawRetailRecord {
  id: string;
  productId: string;
  productName: string;
  category: string;
  day: number;
  dayOfWeek: string;
  season: "winter" | "spring";
  price: number | string | null;
  units: number | string | null;
  discount: number | null;
  promotion: 0 | 1 | null;
  inventory: number | null;
  competitorPrice: number | null;
  rating: number | null;
  unitCost: number | null;
  unitsNextDay: number | null;
  origin: RecordOrigin;
}

/** A catalog item used by the generator and the pricing panel. */
export interface RetailSku {
  productId: string;
  productName: string;
  category: string;
  unitCost: number;
  referencePrice: number;
  baseDemand: number;
  rating: number;
}

/** Last day index the study window treats as in range. */
export const STUDY_LAST_DAY = 16;

/** Days 1–8 are labeled winter. Days 9–16 are labeled spring. The labels are part of the generator. */
export const WINTER_LAST_DAY = 8;

/** Temporal holdout starts after this day. Train is day <= this value. */
export const TRAIN_LAST_DAY = 12;

/** Units above this value are the planted extreme, not a generated sale. */
export const EXTREME_UNITS = 200;

/** Fixed noise added into `generatedUnits`, indexed by (day + sku index) mod 12. */
export const UNITS_NOISE = [0, 1, -1, 2, -2, 1, 0, -1, 2, 0, -2, 1] as const;

/** Weekday labels. Day 1 is Monday. */
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** The four generated products. Costs and reference prices are scenario constants. */
export const RETAIL_SKUS: readonly RetailSku[] = [
  {
    productId: "NL-01",
    productName: "Oak chair",
    category: "furniture",
    unitCost: 42,
    referencePrice: 90,
    baseDemand: 22,
    rating: 4.4,
  },
  {
    productId: "NL-02",
    productName: "Linen sheet",
    category: "home",
    unitCost: 11,
    referencePrice: 28,
    baseDemand: 30,
    rating: 4.1,
  },
  {
    productId: "NL-03",
    productName: "Steel bottle",
    category: "outdoors",
    unitCost: 7,
    referencePrice: 22,
    baseDemand: 34,
    rating: 4.6,
  },
  {
    productId: "NL-04",
    productName: "Wool scarf",
    category: "apparel",
    unitCost: 9,
    referencePrice: 34,
    baseDemand: 18,
    rating: 4.2,
  },
];

/**
 * Slots the generator leaves empty so a planted row can occupy them alone.
 * Key format is `productId:day`.
 */
const SKIPPED_SLOTS = new Set(["NL-01:13", "NL-02:16", "NL-03:15", "NL-04:14"]);

/** Season label for a study day. */
export function seasonForDay(day: number): "winter" | "spring" {
  return day <= WINTER_LAST_DAY ? "winter" : "spring";
}

/** Weekday label for a study day. Day 1 is Monday. */
export function weekdayForDay(day: number): string {
  const index = ((day - 1) % 7 + 7) % 7;
  return WEEKDAYS[index] ?? "Mon";
}

/**
 * Promotion rule used by the generator.
 * Winter promotions fall only on days divisible by 5. Spring promotions fall on even days.
 * The two rules are different on purpose, so promotion and season are confounded.
 */
export function generatedPromotion(day: number): 0 | 1 {
  if (day <= WINTER_LAST_DAY) return day % 5 === 0 ? 1 : 0;
  return day % 2 === 0 ? 1 : 0;
}

/**
 * Units the generator would record before rounding and clamping.
 * priceEffect is −0.25 per currency unit away from the SKU reference.
 * Promotion adds 8. A 15% discount adds 3. Spring adds 3. Then a fixed noise term.
 */
export function generatedUnits(sku: RetailSku, skuIndex: number, day: number, price: number): number {
  const noise = UNITS_NOISE[(day + skuIndex) % UNITS_NOISE.length] ?? 0;
  const discountLift = day % 4 === 0 ? 3 : 0;
  const raw =
    sku.baseDemand -
    0.25 * (price - sku.referencePrice) +
    8 * generatedPromotion(day) +
    discountLift +
    (seasonForDay(day) === "spring" ? 3 : 0) +
    noise;
  return Math.max(0, Math.min(80, Math.round(raw)));
}

/** Price around the SKU reference, in steps of 2 currency units, determined by day and SKU index. */
export function generatedPrice(sku: RetailSku, skuIndex: number, day: number): number {
  return sku.referencePrice + (((day + skuIndex) % 5) - 2) * 2;
}

/** Build one generated row. `nextUnits` is the next generated day for the same SKU, when that day exists. */
function generatedRow(sku: RetailSku, skuIndex: number, day: number, nextUnits: number | null): RawRetailRecord {
  const price = generatedPrice(sku, skuIndex, day);
  let inventory = 28 - (day % 5) * 3;
  if (sku.productId === "NL-03" && day === 9) inventory = 2;
  return {
    id: `${sku.productId}-d${day}`,
    productId: sku.productId,
    productName: sku.productName,
    category: sku.category,
    day,
    dayOfWeek: weekdayForDay(day),
    season: seasonForDay(day),
    price,
    units: generatedUnits(sku, skuIndex, day, price),
    discount: day % 4 === 0 ? 0.15 : 0,
    promotion: generatedPromotion(day),
    inventory,
    competitorPrice: sku.referencePrice - 2 + (day % 3),
    rating: sku.rating,
    unitCost: sku.unitCost,
    unitsNextDay: nextUnits,
    origin: "synthetic-generated",
  };
}

/** A planted row. Callers set only the fields that differ from a blank valid shell. */
function planted(partial: Pick<RawRetailRecord, "id" | "productId" | "productName" | "category" | "day"> & Partial<RawRetailRecord>): RawRetailRecord {
  return {
    price: 20,
    units: 10,
    discount: 0,
    promotion: 0,
    inventory: 20,
    competitorPrice: 19,
    rating: 4,
    unitCost: 8,
    unitsNextDay: null,
    origin: "planted-issue",
    dayOfWeek: weekdayForDay(partial.day),
    season: partial.day >= 1 && partial.day <= STUDY_LAST_DAY ? seasonForDay(partial.day) : "winter",
    ...partial,
  };
}

/** Generated rows for every SKU and day, except the four slots reserved for planted errors. */
function generatedRecords(): RawRetailRecord[] {
  const rows: RawRetailRecord[] = [];
  RETAIL_SKUS.forEach((sku, skuIndex) => {
    for (let day = 1; day <= STUDY_LAST_DAY; day += 1) {
      if (SKIPPED_SLOTS.has(`${sku.productId}:${day}`)) continue;
      const nextDay = day + 1;
      const nextExists =
        nextDay <= STUDY_LAST_DAY && !SKIPPED_SLOTS.has(`${sku.productId}:${nextDay}`);
      const nextUnits = nextExists ? generatedUnits(sku, skuIndex, nextDay, generatedPrice(sku, skuIndex, nextDay)) : null;
      rows.push(generatedRow(sku, skuIndex, day, nextUnits));
    }
  });
  return rows;
}

/**
 * The full extract: generated rows, then planted defects.
 * Order matters for duplicate keeping: the generated row is first.
 */
export function buildRawRecords(): RawRetailRecord[] {
  const generated = generatedRecords();
  const oakDay1 = generated.find((row) => row.id === "NL-01-d1");
  const plantedRows: RawRetailRecord[] = [
    planted({
      ...(oakDay1 ?? {}),
      id: "issue-duplicate",
      productId: "NL-01",
      productName: "Oak chair",
      category: "furniture",
      day: 1,
      origin: "planted-issue",
    }),
    planted({
      id: "issue-name-conflict",
      productId: "NL-01",
      productName: "Oak stool",
      category: "furniture",
      day: 3,
      price: 88,
      units: 20,
      unitCost: 42,
    }),
    planted({
      id: "issue-missing-price",
      productId: "NL-01",
      productName: "Oak chair",
      category: "furniture",
      day: 13,
      price: null,
      units: 12,
      unitCost: 42,
    }),
    planted({
      id: "issue-negative-price",
      productId: "NL-03",
      productName: "Steel bottle",
      category: "outdoors",
      day: 15,
      price: -3,
      units: 11,
      unitCost: 7,
    }),
    planted({
      id: "issue-negative-units",
      productId: "NL-04",
      productName: "Wool scarf",
      category: "apparel",
      day: 14,
      price: 34,
      units: -5,
      unitCost: 9,
    }),
    planted({
      id: "issue-extreme-units",
      productId: "NL-02",
      productName: "Linen sheet",
      category: "home",
      day: 16,
      price: 28,
      units: 900,
      unitCost: 11,
    }),
    planted({
      id: "issue-time",
      productId: "NL-03",
      productName: "Steel bottle",
      category: "outdoors",
      day: 0,
      price: 22,
      units: 10,
      unitCost: 7,
    }),
    planted({
      id: "issue-bad-category",
      productId: "NL-05",
      productName: "Pine stool",
      category: "Furnitur",
      day: 4,
      price: 48,
      units: 14,
      discount: 0.15,
      unitCost: 20,
    }),
    planted({
      id: "issue-string-types",
      productId: "NL-06",
      productName: "Ceramic cup",
      category: "home",
      day: 6,
      price: "24",
      units: "12",
      unitCost: 6,
    }),
  ];
  return [...generated, ...plantedRows];
}

/** The extract used by the workbench. Built once so every visitor starts from the same rows. */
export const RAW_RECORDS: readonly RawRetailRecord[] = buildRawRecords();
