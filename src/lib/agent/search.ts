import type { SearchItem } from "../../content";
import { searchIndex } from "../../content";
import { paginate } from "./pagination";

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
  "domain",
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

function searchLimit(query: string, filters: SearchFilters): number {
  const fallback = normalizeQuery(query) ? SEARCH_QUERY_LIMIT : SEARCH_DEFAULT_LIMIT;
  return clampLimit(filters.limit, fallback);
}

/** Every match in ranked order. An empty query keeps content order. */
function rankPortfolio(query: string, type: string | undefined, items: SearchItem[]): SearchItem[] {
  const q = normalizeQuery(query);
  let pool = items;
  if (type) {
    const wanted = type.trim().toLowerCase();
    pool = pool.filter((item) => item.type === wanted);
  }
  if (!q) return pool;

  return pool
    .map((item, index) => ({ item, index, score: lexicalScore(item, q) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((row) => row.item);
}

export function searchPortfolio(
  query: string,
  filters: SearchFilters = {},
  items: SearchItem[] = searchIndex,
): SearchItem[] {
  return rankPortfolio(query, filters.type, items).slice(0, searchLimit(query, filters));
}

export function searchPayload(query: string, filters: SearchFilters & { offset?: number } = {}) {
  const page = paginate(
    rankPortfolio(query, filters.type, searchIndex),
    filters.offset ?? 0,
    searchLimit(query, filters),
  );
  return {
    query,
    match: "lexical",
    ranking:
      "Lexical only: exact title, title substring, tag or type, then summary. Ties keep content order. This is not semantic search.",
    results: page.items,
    nextCursor: page.nextCursor,
  };
}
