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

/** Empty on-site essays intentionally — structure ready */
export const onSiteWriting: WritingItem[] = [];
