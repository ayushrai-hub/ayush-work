/**
 * Capability map: five skill domains, each with a summary and named skills backed by evidence slugs.
 *
 * Each skill lists `evidenceSlugs` from other modules (work, products,
 * projects, research, experience, leadership, ideas, principles). Pages and
 * Markdown currently show only the skill names; the slugs are not rendered.
 *
 * Connects to:
 * - AboutPage (capabilities section, anchors /about#capability-<domain>).
 * - Markdown twin /about.md; search items of type "capability".
 * - Uses `Capability` from types.ts.
 */
import type { Capability } from "./types";

/**
 * Capability map. Skills cite evidence by slug from work, products, projects,
 * research, experience, leadership, ideas and principles.
 */
export const capabilities: Capability[] = [
  {
    domain: "Intelligence",
    summary:
      "Judgment-heavy AI engineering: LLM evaluation rubrics, fact-vs-hypothesis grounding, deterministic scoring, and bounded agent workflows.",
    skills: [
      {
        name: "RLHF / human feedback loops",
        evidenceSlugs: ["focdot-sde-ai", "outlier-genai"],
      },
      {
        name: "LLM evaluation & rubrics",
        evidenceSlugs: ["focdot-sde-ai", "outlier-genai", "code-eval-rubrics"],
      },
      {
        name: "Structured LLM grounding & agents",
        evidenceSlugs: ["gtm-strato", "revenue-intelligence-engine", "medvoice"],
      },
      {
        name: "Python for AI & GTM pipelines",
        evidenceSlugs: [
          "gtm-strato",
          "aiworks-leads",
          "revenue-intelligence-engine",
          "revenueroles",
          "focdot-sde-ai",
        ],
      },
    ],
  },
  {
    domain: "Software",
    summary:
      "Full-stack and data engineering across Python/FastAPI workers, TypeScript/Node pipelines, Next.js and React apps, and stateless MCP servers.",
    skills: [
      {
        name: "React + TypeScript",
        evidenceSlugs: [
          "personal-portfolio",
          "relationship-intelligence-engine",
          "the-open-framework",
          "iha-by-himani",
          "praful-h",
          "shiksha-mitra",
        ],
      },
      {
        name: "Next.js & FastAPI services",
        evidenceSlugs: [
          "revenueroles",
          "revenue-intelligence-engine",
          "agenyra",
          "medvoice",
          "ayushmushrooms",
        ],
      },
      {
        name: "Entity resolution, SQL & provenance",
        evidenceSlugs: [
          "relationship-intelligence-engine",
          "aiworks-leads",
          "spiderweb",
          "revenueroles",
        ],
      },
      {
        name: "Browser extensions & MCP servers",
        evidenceSlugs: ["overlay-text-box", "personal-portfolio"],
      },
    ],
  },
  {
    domain: "Product",
    summary:
      "Revenue systems, GTM engineering tools, and stage-honest product builds where deterministic rules and human approval gates bound model output.",
    skills: [
      {
        name: "GTM & revenue intelligence systems",
        evidenceSlugs: [
          "revenueroles",
          "gtm-strato",
          "revenue-intelligence-engine",
          "relationship-intelligence-engine",
          "aiworks-leads",
        ],
      },
      {
        name: "Stage-honest product framing",
        evidenceSlugs: ["the-open-framework", "agenyra", "medvoice", "revenueroles"],
      },
      {
        name: "Human-gated automation & billing loops",
        evidenceSlugs: ["medvoice", "revenue-intelligence-engine"],
      },
      {
        name: "Client delivery & lead-capture MVPs",
        evidenceSlugs: ["ayushmushrooms", "iha-by-himani", "praful-h"],
      },
    ],
  },
  {
    domain: "Research",
    summary:
      "Investigations and experiments with cautious claims, notes, not peer-reviewed papers.",
    skills: [
      {
        name: "Applied NLP exploration",
        evidenceSlugs: ["legal-nlp-contracts"],
      },
      {
        name: "Computer vision / agri prototypes",
        evidenceSlugs: ["agri-advisory-ai"],
      },
      {
        name: "IoT / monitoring notes",
        evidenceSlugs: ["smart-campus-energy"],
      },
      {
        name: "Evidence discipline",
        evidenceSlugs: ["evidence-over-adjectives"],
      },
    ],
  },
  {
    domain: "Leadership",
    summary:
      "Grounded community and campus roles, teaching and events, without inflated reach metrics.",
    skills: [
      {
        name: "Workshop & champion work",
        evidenceSlugs: ["uipath-champion", "uipath-champion-leadership"],
      },
      {
        name: "Event organization",
        evidenceSlugs: ["mun-lnct", "hack2skill"],
      },
      {
        name: "Education volunteering",
        evidenceSlugs: ["bachpanshala", "we-care", "raahat"],
      },
    ],
  },
];
