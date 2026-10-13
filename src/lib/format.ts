/**
 * Small display formatters shared by the HTML pages and their Markdown twins, so both print the
 * same text for the same record.
 *
 * Connects to:
 * - src/components/editorial/WorkRow.tsx and src/pages/WorkDetailPage.tsx (year ranges on /work).
 * - src/lib/agent/markdown.ts (the `/work/{slug}.md` status line).
 */

/** Formats a work year range: "2024" for a single or open-ended year, otherwise "2023–2025" or "2023–present". */
export function yearLabel(start: number, end?: number | "present"): string {
  if (!end || end === start) return String(start);
  return `${start}–${end}`;
}
