import type { UseItem } from "./types";

/**
 * Honest tooling from the known stack.
 * Items marked todo: true are plausible but not confirmed as daily drivers.
 */
export const uses: UseItem[] = [
  {
    name: "Cursor",
    category: "editor",
    notes: "Primary AI-assisted editor for this portfolio and product work.",
  },
  {
    name: "VS Code",
    category: "editor",
    notes: "Still used depending on context.",
    todo: true, // confirm current share of editing time
  },
  {
    name: "Vite",
    category: "runtime",
    notes: "Dev server and build for this React portfolio.",
  },
  {
    name: "React",
    category: "framework",
    notes: "UI library across portfolio, client sites, and several products.",
  },
  {
    name: "TypeScript",
    category: "language",
    notes: "Default for app code and now the content layer.",
  },
  {
    name: "Python",
    category: "language",
    notes: "AI / evaluation / data work and research experiments.",
  },
  {
    name: "Next.js",
    category: "framework",
    notes:
      "Used on Open Framework, AyushMushrooms, Shiksha-Mitra, Expert-O, and related apps — not this Vite portfolio.",
  },
  {
    name: "Tailwind CSS",
    category: "styling",
    notes: "Utility styling across most recent front-ends.",
  },
  {
    name: "Framer Motion",
    category: "framework",
    notes: "Motion on portfolio and several marketing sites.",
  },
  {
    name: "GitHub",
    category: "ops",
    notes: "Source control and open-source hosting (ayushrai-hub).",
  },
  {
    name: "Netlify",
    category: "hosting",
    notes: "This site (ayush-me.netlify.app) and some client deploys.",
  },
  {
    name: "Vercel",
    category: "hosting",
    notes: "Product and project demos (Open Framework, mushrooms, Shiksha-Mitra, Expert-O).",
  },
  {
    name: "Firebase",
    category: "other",
    notes: "Used in Shiksha-Mitra backend pieces.",
    todo: true, // confirm current usage depth
  },
  {
    name: "MongoDB",
    category: "other",
    notes: "Used in Shiksha-Mitra data layer.",
    todo: true,
  },
  {
    name: "PostgreSQL",
    category: "other",
    notes: "Target data store in Open Framework architecture.",
    todo: true, // architecture intent vs. production today
  },
  {
    name: "Docker",
    category: "ops",
    notes: "Part of Open Framework infra direction.",
    todo: true,
  },
];
