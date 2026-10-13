/**
 * Writing entries: today only pointers to external writing hubs (Medium, Substack), plus an empty list reserved for on-site essays.
 *
 * `writing` entries with a `url` link out; search uses that URL as the href.
 * `onSiteWriting` is intentionally empty until essays are written here.
 *
 * Connects to:
 * - WritingPage (`writing`, `onSiteWriting`), WritingDetailPage and HomePage.
 * - Markdown twins /writing.md and /writing/:slug.md; search items of type
 *   "writing".
 * - Uses `WritingItem` from types.ts.
 */
import type { WritingItem } from "./types";

/**
 * On-site writing is thin for now.
 * TODO: migrate or write first essays into the digital home.
 */
export const writing: WritingItem[] = [
  {
    slug: "medium-hub",
    title: "Notes on Medium",
    kind: "external",
    summary:
      "Occasional technical and personal writing. Treat the Medium profile as the current writing hub until on-site essays exist.",
    url: "https://medium.com/@ayushrai0211",
    todo: "Pick 1–2 posts to seed as on-site Writing entries with proper titles/dates.",
  },
  {
    slug: "substack-hub",
    title: "Substack",
    kind: "external",
    summary:
      "Newsletter / longer-form experiments. Not yet mirrored on this site.",
    url: "https://substack.com/@ayushrai02",
    todo: "Confirm which Substack pieces are worth featuring; otherwise keep as elsewhere link only.",
  },
];

/** On-site essays. Intentionally empty; WritingPage renders an empty state for it. */
export const onSiteWriting: WritingItem[] = [];
