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
      "Judgment-heavy AI work: evaluation, prompting, and reliability for generative systems, not demo theater.",
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
        name: "Prompting for code tasks",
        evidenceSlugs: ["outlier-genai"],
      },
      {
        name: "Python for ML workflows",
        evidenceSlugs: ["focdot-sde-ai", "agri-advisory-ai", "legal-nlp-contracts"],
      },
    ],
  },
  {
    domain: "Software",
    summary:
      "Full-stack web engineering across Vite/React portfolios, Next.js products, and small open-source tools.",
    skills: [
      {
        name: "React + TypeScript",
        evidenceSlugs: [
          "personal-portfolio",
          "the-open-framework",
          "iha-by-himani",
          "praful-h",
          "shiksha-mitra",
        ],
      },
      {
        name: "Next.js apps",
        evidenceSlugs: [
          "agenyra",
          "medvoice",
          "ayushmushrooms",
          "shiksha-mitra",
          "expert-o",
        ],
      },
      {
        name: "Browser extensions",
        evidenceSlugs: ["overlay-text-box"],
      },
      {
        name: "Tailwind + motion UI",
        evidenceSlugs: ["personal-portfolio", "expert-o", "iha-by-himani"],
      },
    ],
  },
  {
    domain: "Product",
    summary:
      "Framing problems, shipping MVPs, and designing durable loops (leads, acknowledgement, trust) before feature sprawl.",
    skills: [
      {
        name: "MVP scoping",
        evidenceSlugs: ["ayushmushrooms", "shiksha-mitra"],
      },
      {
        name: "Stage-honest product framing",
        evidenceSlugs: ["the-open-framework", "agenyra", "medvoice"],
      },
      {
        name: "DPI / institutional product thinking",
        evidenceSlugs: ["the-open-framework", "consent-first-ngo-discovery"],
      },
      {
        name: "Client delivery",
        evidenceSlugs: ["iha-by-himani", "praful-h"],
      },
      {
        name: "Lead-generation systems",
        evidenceSlugs: ["ayushmushrooms", "agrotech-lead-to-datasheet"],
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
