/**
 * Illustrative price calculator for one fictional SKU.
 *
 * Demand is an assumption written in this file: units fall by `DEMAND_SLOPE`
 * for each currency unit above the SKU reference, from `DEMAND_ANCHOR`.
 * It is not estimated from the panel and it is not a causal demand curve.
 * Contribution margin is (price − cost) × capped units.
 *
 * Connects to:
 * - src/lib/dataScience/retailDataset.ts (`RetailSku`).
 * - src/components/pow/ds/InsightLab.tsx.
 * - src/__tests__/dataScience.test.ts.
 */
import type { RetailSku } from "./retailDataset";

/** Units assumed at the SKU reference price. Not fitted. */
export const DEMAND_ANCHOR = 24;

/** Assumed drop in units for each currency unit of price above the reference. Not fitted. */
export const DEMAND_SLOPE = 0.35;

/** One price on the assumed curve. */
export interface PriceOutcome {
  price: number;
  unitsUncapped: number;
  units: number;
  revenue: number;
  margin: number;
  capped: boolean;
  belowCost: boolean;
}

/**
 * Assumed units at `price`. The result is never negative.
 * `referencePrice` only recenters the assumption; it is not an estimated intercept.
 */
export function assumedUnits(price: number, referencePrice: number): number {
  return Math.max(0, DEMAND_ANCHOR - DEMAND_SLOPE * (price - referencePrice));
}

/**
 * Revenue and contribution margin at one price.
 * Units are limited by `inventoryCap` when that cap is a non-negative number.
 * A price below unit cost produces a negative margin. That is arithmetic, not a recommendation.
 */
export function priceOutcome(price: number, sku: RetailSku, inventoryCap: number | null): PriceOutcome {
  const unitsUncapped = assumedUnits(price, sku.referencePrice);
  const capped = inventoryCap !== null && unitsUncapped > inventoryCap;
  const units = capped ? Math.max(0, inventoryCap ?? 0) : unitsUncapped;
  return {
    price,
    unitsUncapped,
    units,
    revenue: price * units,
    margin: (price - sku.unitCost) * units,
    capped,
    belowCost: price < sku.unitCost,
  };
}

/**
 * Integer prices from the unit cost through 1.8 × the reference price.
 * The listed maximum is the highest assumed margin on that grid.
 * Ties keep the lower price. This is the maximum of the assumption, not of a market.
 */
export function priceGrid(sku: RetailSku, inventoryCap: number | null): { rows: PriceOutcome[]; gridMax: PriceOutcome | null } {
  const ceiling = Math.round(sku.referencePrice * 1.8);
  const floor = Math.ceil(sku.unitCost);
  const rows: PriceOutcome[] = [];
  for (let price = floor; price <= ceiling; price += 1) {
    rows.push(priceOutcome(price, sku, inventoryCap));
  }
  let gridMax: PriceOutcome | null = null;
  for (const row of rows) {
    if (!gridMax || row.margin > gridMax.margin) gridMax = row;
  }
  return { rows, gridMax };
}
