/**
 * Deterministic checks for the synthetic demand table.
 *
 * A failing row is recorded and kept out of the clean training set. Nothing is deleted without
 * an issue. Counts are tallied from `DEMAND_ROWS`, not typed in as rates.
 *
 * Connects to:
 * - src/lib/mlEngineer/dataset.ts for the rows and the date parser.
 * - src/lib/mlEngineer/features.ts, which trains only on rows this module marks as passed.
 * - src/components/pow/ml/Lab.tsx.
 */
import {
  ALLOWED_CATEGORIES,
  DEMAND_ROWS,
  PRICE_MAX,
  UNITS_MAX,
  parseIsoDate,
  type DemandRow,
} from "./dataset";

/** Stable issue codes. The UI groups failures by these codes. */
export type IssueCode =
  | "missing_value"
  | "invalid_type"
  | "unexpected_category"
  | "impossible_value"
  | "out_of_range"
  | "duplicate_row"
  | "schema_change"
  | "target_leakage"
  | "timestamp_error"
  | "training_serving_skew";

/** What a pipeline should do. Quarantine still keeps the row in the report. */
export type IssueAction = "quarantine" | "reject_feature";

/** One failed check on one row. */
export interface RowIssue {
  code: IssueCode;
  field: string;
  message: string;
  action: IssueAction;
}

/** Checks for a single raw row. */
export interface RowValidation {
  id: string;
  issues: RowIssue[];
  status: "pass" | "fail";
}

/** Dataset-level report. `byCode` counts issues, which can exceed the row count. */
export interface ValidationReport {
  rows: RowValidation[];
  total: number;
  passed: number;
  failed: number;
  byCode: Record<IssueCode, number>;
}

const CODES: IssueCode[] = [
  "missing_value",
  "invalid_type",
  "unexpected_category",
  "impossible_value",
  "out_of_range",
  "duplicate_row",
  "schema_change",
  "target_leakage",
  "timestamp_error",
  "training_serving_skew",
];

/**
 * Records one issue.
 * `action` is quarantine for data that must not enter training, and reject_feature for a leaky column.
 */
function issue(
  code: IssueCode,
  field: string,
  message: string,
  action: IssueAction = "quarantine",
): RowIssue {
  return { code, field, message, action };
}

/** Ids whose sku and valid date are shared with another row. Both copies are flagged. */
function duplicateIds(rows: readonly DemandRow[]): Set<string> {
  const groups = new Map<string, string[]>();
  for (const row of rows) {
    if (!parseIsoDate(row.observedOn)) continue;
    const key = `${row.sku}|${row.observedOn}`;
    const list = groups.get(key) ?? [];
    list.push(row.id);
    groups.set(key, list);
  }
  const ids = new Set<string>();
  for (const list of groups.values()) {
    if (list.length > 1) list.forEach((id) => ids.add(id));
  }
  return ids;
}

/**
 * Checks one row against the demonstration contract.
 * `duplicates` comes from `duplicateIds` so a row can be judged without rescanning the table.
 */
export function validateRow(row: DemandRow, duplicates: ReadonlySet<string>): RowIssue[] {
  const issues: RowIssue[] = [];

  if (row.schemaVersion !== 1) {
    issues.push(
      issue(
        "schema_change",
        "schemaVersion",
        "Schema version 2 renamed price to unitPrice. The row stays quarantined until a mapping is approved.",
      ),
    );
  } else if (row.price === null) {
    issues.push(issue("missing_value", "price", "Price is missing."));
  } else if (typeof row.price !== "number") {
    issues.push(issue("invalid_type", "price", "Price is not a number."));
  } else if (row.price <= 0) {
    issues.push(issue("impossible_value", "price", "Price is not positive."));
  } else if (row.price > PRICE_MAX) {
    issues.push(issue("out_of_range", "price", `Price is above the contract maximum of ${PRICE_MAX}.`));
  }

  if (row.unitsSold === null) {
    issues.push(issue("missing_value", "unitsSold", "Units sold is missing."));
  } else if (typeof row.unitsSold !== "number") {
    issues.push(issue("invalid_type", "unitsSold", "Units sold is not a number."));
  } else if (row.unitsSold < 0) {
    issues.push(issue("impossible_value", "unitsSold", "Units sold cannot be negative."));
  } else if (row.unitsSold > UNITS_MAX) {
    issues.push(issue("out_of_range", "unitsSold", `Units sold is above ${UNITS_MAX}.`));
  }

  if (row.inventory === null) {
    issues.push(issue("missing_value", "inventory", "Inventory is missing."));
  } else if (typeof row.inventory !== "number") {
    issues.push(issue("invalid_type", "inventory", "Inventory is not a number."));
  } else if (row.inventory < 0) {
    issues.push(issue("impossible_value", "inventory", "Inventory cannot be negative."));
  }

  if (row.promo === null) {
    issues.push(issue("missing_value", "promo", "Promotion flag is missing."));
  } else if (typeof row.promo !== "boolean") {
    issues.push(issue("invalid_type", "promo", "Promotion flag is not a boolean."));
  }

  const allowed = (ALLOWED_CATEGORIES as readonly string[]).includes(row.category);
  const allowedIgnoringCase = (ALLOWED_CATEGORIES as readonly string[]).includes(
    row.category.toLowerCase(),
  );
  if (!allowed && allowedIgnoringCase) {
    issues.push(
      issue(
        "training_serving_skew",
        "category",
        "The category matches the training vocabulary only after changing case. Serving must use the same spelling.",
      ),
    );
  } else if (!allowed) {
    issues.push(
      issue("unexpected_category", "category", `Category "${row.category}" is outside the training vocabulary.`),
    );
  }

  const date = parseIsoDate(row.observedOn);
  if (!date || date.getUTCFullYear() !== 2024) {
    issues.push(
      issue(
        "timestamp_error",
        "observedOn",
        "The date is not a real calendar day in 2024, written as YYYY-MM-DD.",
      ),
    );
  }

  if (duplicates.has(row.id)) {
    issues.push(
      issue(
        "duplicate_row",
        "sku",
        "Another row has the same product and date. Both copies are quarantined until a person chooses one.",
      ),
    );
  }

  if (row.sameWeekUnits !== null) {
    issues.push(
      issue(
        "target_leakage",
        "sameWeekUnits",
        "sameWeekUnits copies the target. The feature is rejected. The row is not silently kept in the clean set.",
        "reject_feature",
      ),
    );
  }

  return issues;
}

/**
 * Validates every row in `rows`.
 * Defaults to the bundled demonstration table.
 */
export function validateDataset(rows: readonly DemandRow[] = DEMAND_ROWS): ValidationReport {
  const duplicates = duplicateIds(rows);
  const checked = rows.map((row) => {
    const issues = validateRow(row, duplicates);
    return {
      id: row.id,
      issues,
      status: issues.length === 0 ? "pass" : "fail",
    } as RowValidation;
  });
  const byCode = Object.fromEntries(CODES.map((code) => [code, 0])) as Record<IssueCode, number>;
  for (const row of checked) {
    for (const item of row.issues) byCode[item.code] += 1;
  }
  const passed = checked.filter((row) => row.status === "pass").length;
  return {
    rows: checked,
    total: checked.length,
    passed,
    failed: checked.length - passed,
    byCode,
  };
}

/**
 * Share of rows as a percentage with one decimal.
 * Returns "0.0" when the table is empty so the UI does not invent a rate.
 */
export function percentOf(count: number, total: number): string {
  if (total <= 0) return "0.0";
  return ((count / total) * 100).toFixed(1);
}
