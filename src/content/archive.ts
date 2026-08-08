import type { ArchiveItem } from "./types";

/**
 * Pointers to early / lesser / superseded work — not deleted, just de-emphasized.
 */
export const archive: ArchiveItem[] = [
  {
    slug: "super-site",
    title: "Super.site personal page",
    summary: "Earlier no-code personal site and link home.",
    year: 2022,
    pointer: "https://ayush-rai.super.site/",
    relatedSlug: "super-site-archive",
  },
  {
    slug: "notion-portfolio",
    title: "Notion portfolio",
    summary: "Long-form Notion dump of projects and notes.",
    year: 2022,
    pointer:
      "https://www.notion.so/Ayush-s-Portfolio-5d069b2fa8b64d7e8b939a0c9b946e7b",
    relatedSlug: "notion-portfolio-archive",
  },
  {
    slug: "linktree",
    title: "Linktree",
    summary: "Link aggregator — superseded by this digital home.",
    year: 2023,
    pointer: "https://linktr.ee/ayush_rai02",
  },
  {
    slug: "blogger",
    title: "Blogger",
    summary: "Older personal blog; not actively maintained.",
    year: 2021,
    pointer: "https://ayushrai02.blogspot.com/",
  },
  {
    slug: "portfolio-vanity-metrics",
    title: "Retired vanity metrics",
    summary:
      "Older UI showed 100% success, 24/7 support, and similar stats. Intentionally removed from the content layer.",
    year: 2024,
  },
];
