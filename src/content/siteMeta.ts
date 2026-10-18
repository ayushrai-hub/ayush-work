/**
 * Content freshness dates for the site and its main pages, plus helpers that read and format them.
 *
 * Update a date when the corresponding content meaningfully changes, not on
 * every deploy. `pageUpdatedAt(key)` resolves a page's date, falling back to
 * `siteUpdatedAt`; `formatUpdated` turns an ISO date into a short label.
 *
 * Connects to:
 * - "Updated" labels via `pageUpdatedAt`: HomePage, AboutPage, WorkPage,
 *   ProductsPage, NowPage, ContactPage, PrivacyPage, DevelopersPage, GtmPage and
 *   DomainPage (also their JSON-LD `dateModified`), PageSEO's homepage
 *   `dateModified`, and the /now.md Markdown twin.
 * - `formatUpdated`: SiteFooter, HomePage and UpdatedMeta.
 * - `siteMeta.siteUpdatedAt`: SiteFooter's "Site info updated" line.
 * - No types from types.ts.
 */

/**
 * Freshness dates. `siteUpdatedAt` is the whole-site content pass; `pages`
 * holds per-area overrides keyed by the names passed to `pageUpdatedAt`.
 */
export const siteMeta = {
  /** Whole-site content pass */
  siteUpdatedAt: "2026-10-16",
  /**
   * Per-area dates. Only set when that slice of content last meaningfully changed.
   * Omit a key to fall back to siteUpdatedAt. Keys are free strings, so a key
   * no page passes to `pageUpdatedAt` is silently unused (`resume` currently is).
   */
  pages: {
    home: "2026-10-16",
    domains: "2026-10-18",
    "gtm-revops": "2026-10-18",
    now: "2026-08-08",
    about: "2026-10-16",
    work: "2026-10-16",
    products: "2026-10-18",
    contact: "2026-10-14",
    privacy: "2026-10-14",
    developers: "2026-10-16",
    gtm: "2026-10-18",
    resume: "2026-08-08",
  } as Record<string, string>,
};

/**
 * Format an ISO date (YYYY-MM-DD) as an en-GB label such as "11 Oct 2026".
 * Parses at local noon to avoid off-by-one-day shifts; returns the input
 * unchanged if it is not a valid date.
 */
export function formatUpdated(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * ISO date to show as a page's "Updated" label: `siteMeta.pages[page]`, or
 * `siteMeta.siteUpdatedAt` when the key is not set.
 */
export function pageUpdatedAt(page: string): string {
  return siteMeta.pages[page] ?? siteMeta.siteUpdatedAt;
}
