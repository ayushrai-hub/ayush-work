import type { Principle } from "./types";

export const principles: Principle[] = [
  {
    slug: "usefulness-over-hype",
    title: "Usefulness over hype",
    statement:
      "If a sentence could appear on any AI startup homepage, it probably shouldn't appear on mine.",
    inPractice:
      "Rewrote Expert-O and portfolio stats to drop '5x', '100% success', and '24/7' theater.",
  },
  {
    slug: "ship-to-learn",
    title: "Ship to learn",
    statement:
      "A live MVP with open questions beats a perfect deck that never meets users.",
    inPractice:
      "Open Framework and AyushMushrooms ship as MVPs with explicit unfinished edges.",
  },
  {
    slug: "evidence-over-adjectives",
    title: "Evidence over adjectives",
    statement:
      "Prefer links, dates, and roles over 'visionary', 'elite', or 'transformative'.",
    inPractice:
      "Research and leadership claims that lack evidence go to needsConfirmation or get omitted.",
  },
  {
    slug: "interdisciplinary-leverage",
    title: "Interdisciplinary leverage",
    statement:
      "Crossing AI, web, and domain context is useful when it clarifies the problem — not as a personality brand.",
    inPractice:
      "Civil society DPI and agrotech work borrow product + compliance thinking, not buzzword stacks.",
  },
  {
    slug: "ai-for-problems-not-decoration",
    title: "AI for problems, not decoration",
    statement:
      "Use models where evaluation and feedback loops matter; don't sprinkle 'AI-powered' on static pages.",
    inPractice:
      "RLHF day job stays evaluation-heavy; marketing sites don't fake AI features.",
  },
  {
    slug: "trust-in-products",
    title: "Trust is a product requirement",
    statement:
      "Consent, auditability, and progressive verification are features — especially in civil society tooling.",
    inPractice:
      "Open Framework architecture starts from RBAC, consent, and audit logs.",
  },
  {
    slug: "clarity-before-complexity",
    title: "Clarity before complexity",
    statement:
      "Name the job of the page or system before adding motion, 3D, or platform sprawl.",
    inPractice:
      "Client sites (Iha, Praful) prioritize hierarchy and contact paths over stack peacocking.",
  },
  {
    slug: "systems-over-features",
    title: "Systems over features",
    statement:
      "Prefer durable loops (lead → datasheet → CRM, peer acknowledgement) over feature checklists.",
    inPractice:
      "AyushMushrooms and Shiksha-Mitra are framed around loops, not feature grids.",
  },
];
