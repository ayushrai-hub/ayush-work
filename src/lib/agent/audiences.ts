/**
 * Reader profiles for the homepage "Role view": section order and work ordering per audience.
 *
 * The audience comes from the `?audience=` query parameter. Each audience has a fixed homepage
 * section order, and work items are stably re-sorted by a keyword score over their type, title,
 * summary, and technologies. Nothing is added, hidden, or rewritten, and the Markdown twins do
 * not change.
 *
 * Connects to:
 * - `src/pages/HomePage.tsx` (`parseAudience`, `rankWorkForAudience`, `HOME_SECTION_ORDER`) and
 *   `src/components/site/RoleSelector.tsx` (`AUDIENCES`, `parseAudience`).
 * - Tested in `src/__tests__/agentSurfaces.test.ts`.
 * - Depends on the `WorkItem` type from `src/content`.
 */
import type { WorkItem } from "../../content";

/** Selectable audiences in menu order. `description` is the text the role selector shows. */
export const AUDIENCES = [
  {
    id: "general",
    label: "Overview",
    description: "Neutral default. The public page order, unchanged.",
  },
  {
    id: "recruiter",
    label: "Hiring",
    description:
      "Reorders the selected case studies already on this page, with shipped ones first. Nothing is added or rewritten.",
  },
  {
    id: "ai-ml",
    label: "AI / ML and LLM Engineering",
    description:
      "Work that already names evaluation, models, or machine-learning tools is listed first.",
  },
  {
    id: "software",
    label: "Software and Backend Engineering",
    description:
      "Work that already names application engineering is listed first.",
  },
  {
    id: "research",
    label: "Research and Evaluation",
    description:
      "Research sections come first. Work that already names research or evaluation is listed first.",
  },
  {
    id: "product",
    label: "Product and Systems Building",
    description: "Product-shaped work is listed first.",
  },
] as const;

export type AudienceId = (typeof AUDIENCES)[number]["id"];

/** Homepage sections that `HOME_SECTION_ORDER` can reorder. */
export type HomeSectionId =
  | "now"
  | "work"
  | "products"
  | "research"
  | "journey"
  | "writing"
  | "principles"
  | "contact";

/** Lowercase substrings matched against a work item's text by `scoreWork`. */
const AI_TERMS = [
  "rlhf",
  "llm",
  "machine learning",
  "generative",
  "evaluation",
  "python",
  "tensorflow",
  "nlp",
  "model",
];

const RESEARCH_TERMS = ["research", "evaluation", "nlp", "satellite", "paper", "dataset"];

const SOFTWARE_TERMS = [
  "typescript",
  "react",
  "next.js",
  "node",
  "api",
  "postgres",
  "docker",
  "vite",
];

/** Homepage section order for each audience. Every list contains every section exactly once. */
export const HOME_SECTION_ORDER: Record<AudienceId, HomeSectionId[]> = {
  general: [
    "now",
    "work",
    "products",
    "research",
    "journey",
    "writing",
    "principles",
    "contact",
  ],
  recruiter: [
    "work",
    "journey",
    "now",
    "products",
    "writing",
    "research",
    "principles",
    "contact",
  ],
  "ai-ml": [
    "research",
    "work",
    "now",
    "products",
    "writing",
    "principles",
    "journey",
    "contact",
  ],
  software: [
    "work",
    "products",
    "now",
    "research",
    "writing",
    "principles",
    "journey",
    "contact",
  ],
  research: [
    "research",
    "work",
    "now",
    "writing",
    "products",
    "principles",
    "journey",
    "contact",
  ],
  product: [
    "products",
    "work",
    "now",
    "research",
    "writing",
    "principles",
    "journey",
    "contact",
  ],
};

/** Friendlier `?audience=` values accepted in addition to the ids. */
const AUDIENCE_ALIASES: Record<string, AudienceId> = {
  overview: "general",
  hiring: "recruiter",
  backend: "software",
  systems: "product",
  evaluation: "research",
};

/** Resolves a `?audience=` value or alias to an id. Missing or unknown values become `general`. Case-sensitive. */
export function parseAudience(value: string | null | undefined): AudienceId {
  if (!value) return "general";
  const aliased = AUDIENCE_ALIASES[value] ?? value;
  const match = AUDIENCES.find((audience) => audience.id === aliased);
  return match?.id ?? "general";
}

/** Description text for an audience id, shown under RoleSelector's buttons. */
export function audienceDescription(id: AudienceId): string {
  return AUDIENCES.find((audience) => audience.id === id)?.description ?? "";
}

/** Lowercased type, title, summary, and technologies of a work item, for keyword matching. */
function workBlob(item: WorkItem): string {
  return [item.type, item.title, item.summary, ...item.technologies]
    .join(" ")
    .toLowerCase();
}

/**
 * Sort weight of a work item for an audience; higher sorts first. Recruiter favors selected,
 * then shipped work; product favors `type === "product"`; the rest score 10 on any keyword hit.
 */
function scoreWork(item: WorkItem, audience: AudienceId): number {
  const text = workBlob(item);
  if (audience === "recruiter") {
    return (item.selected ? 10 : 0) + (item.status === "shipped" ? 3 : 0);
  }
  if (audience === "ai-ml") {
    return AI_TERMS.some((term) => text.includes(term)) ? 10 : 0;
  }
  if (audience === "software") {
    return SOFTWARE_TERMS.some((term) => text.includes(term)) ? 10 : 0;
  }
  if (audience === "research") {
    return RESEARCH_TERMS.some((term) => text.includes(term)) ? 10 : 0;
  }
  if (audience === "product") {
    return item.type === "product" ? 10 : 0;
  }
  return 0;
}

/**
 * Stable reorder of the existing work records by `scoreWork`; ties keep content order.
 * General keeps the content order. Returns a new array and never drops items.
 */
export function rankWorkForAudience(
  audience: AudienceId,
  items: readonly WorkItem[],
): WorkItem[] {
  if (audience === "general") return [...items];
  return items
    .map((item, index) => ({ item, index, score: scoreWork(item, audience) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((row) => row.item);
}
