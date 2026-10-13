/**
 * Lexical search over the site's search index, shared by the on-site dialog, the REST API, and MCP.
 *
 * Each record gets a fixed score by where the normalized query appears (exact title, title
 * substring, tag or type, any field). Matches are sorted by score with ties in content order.
 * There is no stemming, tokenizing, or semantic matching; the whole query is one substring.
 *
 * Connects to:
 * - `src/components/site/SearchDialog.tsx` (`searchPortfolio`), `http.ts` for `/api/search` and
 *   `/api/v1/search` (`searchPayload`), and `searchTool.ts` for MCP `search_portfolio` and WebMCP.
 * - `openapi.ts` and `validate.ts` read `SEARCH_TYPES` and `SEARCH_MAX_QUERY`.
 * - Depends on `searchIndex` from `src/content` and `pagination.ts`.
 */
import type { SearchItem } from "../../content";
import { searchIndex } from "../../content";
import { paginate } from "./pagination";

/** Empty-query size used by the search dialog. */
export const SEARCH_DEFAULT_LIMIT = 8;
/** Match limit used by the search dialog and API when `limit` is omitted. */
export const SEARCH_QUERY_LIMIT = 12;
/** Largest page size `clampLimit` allows. */
export const SEARCH_MAX_LIMIT = 20;
/** Longest accepted query, in characters. Enforced by `validateQuery`. */
export const SEARCH_MAX_QUERY = 200;

/** Record types that may appear in the index and in the `type` filter. */
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

/** Optional record type and page size. */
export interface SearchFilters {
  type?: string;
  limit?: number;
}

/** Trims, lowercases, and collapses whitespace runs to single spaces. */
export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Integer page size in 1..`SEARCH_MAX_LIMIT`; `fallback` when the value is missing or NaN. */
export function clampLimit(value: number | undefined, fallback: number): number {
  if (value === undefined || Number.isNaN(value)) return fallback;
  return Math.min(SEARCH_MAX_LIMIT, Math.max(1, Math.trunc(value)));
}

/**
 * Lexical score only. This is not semantic or model-based search.
 * Exact title, then title substring, then tag or type, then summary.
 * Ties keep the original content order.
 * Scores are 100, 80, 50, 20, or 0 (no match). `query` must already be normalized.
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

/** Page size for a query: the requested limit, else 12 with a query and 8 without. */
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

/** First page of ranked matches as a plain array. Used by the on-site search dialog. */
export function searchPortfolio(
  query: string,
  filters: SearchFilters = {},
  items: SearchItem[] = searchIndex,
): SearchItem[] {
  return rankPortfolio(query, filters.type, items).slice(0, searchLimit(query, filters));
}

/**
 * JSON body for the search API and search tools: the query, a description of the ranking,
 * one page of results from `offset`, and `nextCursor`. Matches the `SearchResponse` schema.
 */
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
