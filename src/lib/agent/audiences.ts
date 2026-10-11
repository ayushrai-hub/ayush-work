import type { WorkItem } from "../../content";

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

export type HomeSectionId =
  | "now"
  | "work"
  | "products"
  | "research"
  | "journey"
  | "writing"
  | "principles"
  | "contact";

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

const AUDIENCE_ALIASES: Record<string, AudienceId> = {
  overview: "general",
  hiring: "recruiter",
  backend: "software",
  systems: "product",
  evaluation: "research",
};

export function parseAudience(value: string | null | undefined): AudienceId {
  if (!value) return "general";
  const aliased = AUDIENCE_ALIASES[value] ?? value;
  const match = AUDIENCES.find((audience) => audience.id === aliased);
  return match?.id ?? "general";
}

export function audienceDescription(id: AudienceId): string {
  return AUDIENCES.find((audience) => audience.id === id)?.description ?? "";
}

function workBlob(item: WorkItem): string {
  return [item.type, item.title, item.summary, ...item.technologies]
    .join(" ")
    .toLowerCase();
}

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

/** Stable reorder of the existing work records. General keeps the content order. */
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
