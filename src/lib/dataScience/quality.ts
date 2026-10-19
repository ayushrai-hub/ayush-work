/**
 * Data-quality checks and explicit cleaning for the Insight Lab extract.
 *
 * `inspectRaw` always reads the original rows and does not drop anything.
 * `cleanRetail` applies only the options that are turned on, and it returns
 * every drop and edit so the page can show the decision.
 *
 * Connects to:
 * - src/lib/dataScience/retailDataset.ts for the row shape and the extreme-unit cutoff.
 * - src/lib/dataScience/analysis.ts.
 * - src/__tests__/dataScience.test.ts.
 */
import { EXTREME_UNITS, STUDY_LAST_DAY, type RawRetailRecord } from "./retailDataset";

/** Which cleaning decisions are active. Each one is reported, not applied in secret. */
export interface CleaningOptions {
  coerceNumbers: boolean;
  dropMissingOrInvalidPrice: boolean;
  dropImpossibleUnits: boolean;
  dropDuplicateProductDay: boolean;
  reconcileCategory: boolean;
  dropTimeConflicts: boolean;
  dropConflictingNames: boolean;
  dropExtremeUnits: boolean;
  stripFutureUnits: boolean;
}

/** Defaults used on first render. Extreme units are excluded until the visitor turns that off. */
export const DEFAULT_CLEANING: CleaningOptions = {
  coerceNumbers: true,
  dropMissingOrInvalidPrice: true,
  dropImpossibleUnits: true,
  dropDuplicateProductDay: true,
  reconcileCategory: true,
  dropTimeConflicts: true,
  dropConflictingNames: true,
  dropExtremeUnits: true,
  stripFutureUnits: true,
};

/** A row that can enter a model. Future units are not a field here. */
export interface CleanRecord {
  id: string;
  productId: string;
  productName: string;
  category: string;
  day: number;
  dayOfWeek: string;
  season: "winter" | "spring";
  price: number;
  units: number;
  discount: number;
  promotion: 0 | 1;
  inventory: number;
  competitorPrice: number;
  rating: number;
  unitCost: number;
  origin: RawRetailRecord["origin"];
}

/** One issue found in the raw extract. */
export interface QualityFinding {
  check: string;
  recordId: string;
  detail: string;
}

/** A row removed by the active options, with every reason that applied. */
export interface DroppedRow {
  id: string;
  reasons: string[];
}

/** A field rewritten on a kept row. */
export interface FieldEdit {
  id: string;
  field: string;
  from: string;
  to: string;
}

/** Result of one cleaning pass. */
export interface CleaningResult {
  kept: CleanRecord[];
  dropped: DroppedRow[];
  edits: FieldEdit[];
  futureUnitsStripped: number;
}

/** What each toggle does to a later analysis. Shown next to the control. */
export const CLEANING_EFFECTS: readonly { key: keyof CleaningOptions; label: string; effect: string }[] = [
  {
    key: "coerceNumbers",
    label: "Coerce numeric strings",
    effect: "A price stored as text becomes a number. Downstream averages change if the coerced row was previously unusable.",
  },
  {
    key: "dropMissingOrInvalidPrice",
    label: "Drop missing or non-positive prices",
    effect:
      "Drops a non-positive price. A missing price cannot enter the numeric model either way, and it stays in the dropped list.",
  },
  {
    key: "dropImpossibleUnits",
    label: "Drop negative units",
    effect: "Negative sales cannot be a count. Leaving them in pulls means and errors downward.",
  },
  {
    key: "dropDuplicateProductDay",
    label: "Drop duplicate product-days",
    effect: "Keeps the first row for a repeated product and day so that day is not counted twice.",
  },
  {
    key: "reconcileCategory",
    label: "Map the known category typo",
    effect: "Furnitur becomes furniture. Grouped comparisons then put that row with furniture instead of its own group.",
  },
  {
    key: "dropTimeConflicts",
    label: "Drop days outside 1–16",
    effect: "A day of 0 is not in the study window. Keeping it would invent a time point the split does not define.",
  },
  {
    key: "dropConflictingNames",
    label: "Drop conflicting names on one product-day",
    effect: "When one product-day has two names, the later name is removed. The first row stays.",
  },
  {
    key: "dropExtremeUnits",
    label: "Drop units above 200",
    effect: "The planted value 900 dominates squared error. Turning this off shows that sensitivity. A large but plausible value under 200 is kept.",
  },
  {
    key: "stripFutureUnits",
    label: "Strip next-day units",
    effect: "Removes a column that is not known yet. Leaving it available would let a model train on the future.",
  },
];

const CATEGORY_FIX: Record<string, string> = {
  furnitur: "furniture",
  furniture: "furniture",
  home: "home",
  outdoors: "outdoors",
  apparel: "apparel",
};

/** Parse a finite number from a number or a numeric string. Null otherwise. */
function asNumber(value: number | string | null): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

/** True when two raw rows describe the same product on the same day. */
function slotKey(record: RawRetailRecord): string {
  return `${record.productId}:${record.day}`;
}

/**
 * Findings on the raw extract. The count is the length of this list, not a stored constant.
 * A row can appear more than once when it fails more than one check.
 */
export function inspectRaw(records: readonly RawRetailRecord[]): QualityFinding[] {
  const findings: QualityFinding[] = [];
  const bySlot = new Map<string, RawRetailRecord[]>();
  for (const record of records) {
    const slot = bySlot.get(slotKey(record)) ?? [];
    slot.push(record);
    bySlot.set(slotKey(record), slot);
    if (record.price === null) {
      findings.push({ check: "missing-price", recordId: record.id, detail: "Price is missing." });
    } else if (typeof record.price === "string") {
      findings.push({
        check: "incorrect-type",
        recordId: record.id,
        detail: `Price is text (${record.price}), not a number.`,
      });
    } else if (!(record.price > 0)) {
      findings.push({
        check: "invalid-price",
        recordId: record.id,
        detail: `Price ${record.price} is not positive.`,
      });
    }
    if (typeof record.units === "string") {
      findings.push({
        check: "incorrect-type",
        recordId: record.id,
        detail: `Units are text (${record.units}), not a number.`,
      });
    } else if (typeof record.units === "number" && record.units < 0) {
      findings.push({
        check: "impossible-units",
        recordId: record.id,
        detail: `Units ${record.units} are negative.`,
      });
    } else if (typeof record.units === "number" && record.units > EXTREME_UNITS) {
      findings.push({
        check: "extreme-units",
        recordId: record.id,
        detail: `Units ${record.units} are above ${EXTREME_UNITS}. This cutoff flags the planted error. It is not proof the value is impossible in a real shop.`,
      });
    }
    if (!Number.isInteger(record.day) || record.day < 1 || record.day > STUDY_LAST_DAY) {
      findings.push({
        check: "time-conflict",
        recordId: record.id,
        detail: `Day ${record.day} is outside the study window 1–${STUDY_LAST_DAY}.`,
      });
    }
    if (!(record.category.trim().toLowerCase() in CATEGORY_FIX)) {
      findings.push({
        check: "inconsistent-category",
        recordId: record.id,
        detail: `Category “${record.category}” is not one of furniture, home, outdoors, or apparel.`,
      });
    }
    if (typeof record.unitsNextDay === "number") {
      findings.push({
        check: "potential-leakage",
        recordId: record.id,
        detail: "unitsNextDay is the next generated day's units. It is not known yet.",
      });
    }
  }
  for (const group of bySlot.values()) {
    if (group.length < 2) continue;
    const names = new Set(group.map((row) => row.productName));
    for (const row of group.slice(1)) {
      findings.push({
        check: names.size > 1 ? "conflicting-identifier" : "duplicate",
        recordId: row.id,
        detail:
          names.size > 1
            ? `Product ${row.productId} on day ${row.day} has more than one name.`
            : `Product ${row.productId} on day ${row.day} is repeated. The first row is the one a keep-first rule retains.`,
      });
    }
  }
  return findings;
}

/** Apply the selected cleaning decisions and list every drop and edit. */
export function cleanRetail(records: readonly RawRetailRecord[], options: CleaningOptions): CleaningResult {
  const edits: FieldEdit[] = [];
  const dropped: DroppedRow[] = [];
  let futureUnitsStripped = 0;
  const prepared: { source: RawRetailRecord; row: CleanRecord }[] = [];

  for (const source of records) {
    const reasons: string[] = [];
    let price = asNumber(source.price);
    let units = asNumber(source.units);
    if (options.coerceNumbers && typeof source.price === "string" && price !== null) {
      edits.push({ id: source.id, field: "price", from: source.price, to: String(price) });
    }
    if (options.coerceNumbers && typeof source.units === "string" && units !== null) {
      edits.push({ id: source.id, field: "units", from: source.units, to: String(units) });
    }
    if (!options.coerceNumbers) {
      if (typeof source.price === "string") price = null;
      if (typeof source.units === "string") units = null;
    }
    let category = source.category;
    const fixed = CATEGORY_FIX[category.trim().toLowerCase()];
    if (options.reconcileCategory && fixed && fixed !== category) {
      edits.push({ id: source.id, field: "category", from: category, to: fixed });
      category = fixed;
    }
    if (options.dropTimeConflicts && (!Number.isInteger(source.day) || source.day < 1 || source.day > STUDY_LAST_DAY)) {
      reasons.push("Day is outside 1–16.");
    }
    if (options.dropMissingOrInvalidPrice && !(price !== null && price > 0)) {
      reasons.push("Price is missing or not positive.");
    }
    if (options.dropImpossibleUnits && !(units !== null && units >= 0)) {
      reasons.push("Units are missing or negative.");
    }
    if (options.dropExtremeUnits && units !== null && units > EXTREME_UNITS) {
      reasons.push(`Units are above ${EXTREME_UNITS}.`);
    }
    if (
      price === null ||
      units === null ||
      source.discount === null ||
      source.promotion === null ||
      source.inventory === null ||
      source.competitorPrice === null ||
      source.rating === null ||
      source.unitCost === null
    ) {
      if (!reasons.some((reason) => reason.startsWith("Price") || reason.startsWith("Units"))) {
        reasons.push("A required numeric field is missing.");
      }
    }
    if (reasons.length > 0 || price === null || units === null) {
      dropped.push({ id: source.id, reasons: reasons.length > 0 ? reasons : ["A required numeric field is missing."] });
      continue;
    }
    if (options.stripFutureUnits && typeof source.unitsNextDay === "number") futureUnitsStripped += 1;
    prepared.push({
      source,
      row: {
        id: source.id,
        productId: source.productId,
        productName: source.productName,
        category,
        day: source.day,
        dayOfWeek: source.dayOfWeek,
        season: source.season,
        price,
        units,
        discount: source.discount ?? 0,
        promotion: source.promotion ?? 0,
        inventory: source.inventory ?? 0,
        competitorPrice: source.competitorPrice ?? 0,
        rating: source.rating ?? 0,
        unitCost: source.unitCost ?? 0,
        origin: source.origin,
      },
    });
  }

  const seen = new Set<string>();
  const kept: CleanRecord[] = [];
  for (const item of prepared) {
    const key = `${item.row.productId}:${item.row.day}`;
    if (seen.has(key)) {
      const first = kept.find((row) => `${row.productId}:${row.day}` === key);
      const conflict = first !== undefined && first.productName !== item.row.productName;
      if (conflict && options.dropConflictingNames) {
        dropped.push({ id: item.row.id, reasons: ["Another name is already recorded for this product-day."] });
        continue;
      }
      if (!conflict && options.dropDuplicateProductDay) {
        dropped.push({ id: item.row.id, reasons: ["This product-day was already kept."] });
        continue;
      }
      if (conflict && !options.dropConflictingNames) {
        kept.push(item.row);
        continue;
      }
      if (!options.dropDuplicateProductDay) {
        kept.push(item.row);
        continue;
      }
    }
    seen.add(key);
    kept.push(item.row);
  }
  return { kept, dropped, edits, futureUnitsStripped };
}
