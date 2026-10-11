/**
 * Freshness dates for the digital home.
 * Update these when you change the corresponding content, not on every deploy.
 */

export const siteMeta = {
  /** Whole-site content pass */
  siteUpdatedAt: "2026-10-11",
  /**
   * Per-area dates. Only set when that slice of content last meaningfully changed.
   * Omit a key to fall back to siteUpdatedAt.
   */
  pages: {
    home: "2026-10-11",
    now: "2026-08-08",
    about: "2026-10-11",
    work: "2026-10-11",
    products: "2026-10-11",
    contact: "2026-08-08",
    resume: "2026-08-08",
  } as Record<string, string>,
};

/** Format ISO date (YYYY-MM-DD) for quiet UI labels. */
export function formatUpdated(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function pageUpdatedAt(page: string): string {
  return siteMeta.pages[page] ?? siteMeta.siteUpdatedAt;
}
