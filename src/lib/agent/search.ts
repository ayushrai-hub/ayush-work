import type { SearchItem } from "../../content";
import { searchIndex } from "../../content";

/** Empty-query size used by the search dialog. */
export const SEARCH_DEFAULT_LIMIT = 8;
/** Match limit used by the search dialog and API when `limit` is omitted. */
export const SEARCH_QUERY_LIMIT = 12;
export const SEARCH_MAX_LIMIT = 20;
export const SEARCH_MAX_QUERY = 200;

export const SEARCH_TYPES = [
  "person",
  "work",
  "product",
  "project",
  "research",
  "experience",
  "education",
  "leadership",
  "recognition",
  "idea",
  "principle",
  "note",
  "writing",
  "elsewhere",
  "capability",
] as const;

export type SearchType = (typeof SEARCH_TYPES)[number];

export interface SearchFilters {
  type?: string;
  limit?: number;
}

export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function clampLimit(value: number | undefined, fallback: number): number {
  if (value === undefined || Number.isNaN(value)) return fallback;
  return Math.min(SEARCH_MAX_LIMIT, Math.max(1, Math.trunc(value)));
}

/**
 * Lexical score only. This is not semantic or model-based search.
 * Exact title, then title substring, then tag or type, then summary.
 * Ties keep the original content order.
 */
export function lexicalScore(item: SearchItem, query: string): number {
  const title = item.title.toLowerCase();
  const summary = item.summary.toLowerCase();
  const tags = item.tags.join(" ").toLowerCase();
  const type = item.type.toLowerCase();
  if (title === query) return 100;
  if (title.includes(query)) return 80;
  if (type === query || tags.includes(query)) return 50;
  if (`${title} ${summary} ${type} ${tags}`.includes(query)) return 20;
  return 0;
}

export function searchPortfolio(
  query: string,
  filters: SearchFilters = {},
  items: SearchItem[] = searchIndex,
): SearchItem[] {
  const q = normalizeQuery(query);
  const fallback = q ? SEARCH_QUERY_LIMIT : SEARCH_DEFAULT_LIMIT;
  const limit = clampLimit(filters.limit, fallback);
  let pool = items;
  if (filters.type) {
    const type = filters.type.trim().toLowerCase();
    pool = pool.filter((item) => item.type === type);
  }
  if (!q) return pool.slice(0, limit);

  return pool
    .map((item, index) => ({ item, index, score: lexicalScore(item, q) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((row) => row.item);
}

export function searchPayload(query: string, filters: SearchFilters = {}) {
  return {
    query,
    match: "lexical",
    ranking:
      "Lexical only: exact title, title substring, tag or type, then summary. Ties keep content order. This is not semantic search.",
    results: searchPortfolio(query, filters),
  };
}
