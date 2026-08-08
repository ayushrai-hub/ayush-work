import type { Capability } from "./types";

/**
 * Capability map — skills linked to work / product / experience slugs as evidence.
 */
export const capabilities: Capability[] = [
  {
    domain: "Intelligence",
    summary:
      "Judgment-heavy AI work: evaluation, prompting, and reliability for generative systems — not demo theater.",
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
          "iha-by-himani",
          "praful-h",
          "shiksha-mitra",
        ],
      },
      {
        name: "Next.js apps",
        evidenceSlugs: [
          "the-open-framework",
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
        evidenceSlugs: ["ayushmushrooms", "the-open-framework", "shiksha-mitra"],
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
      "Investigations and experiments with cautious claims — notes, not peer-reviewed papers.",
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
      "Grounded community and campus roles — teaching, events, and WebOps — without inflated reach metrics.",
    skills: [
      {
        name: "Workshop & champion work",
        evidenceSlugs: ["uipath-champion", "uipath-champion-leadership"],
      },
      {
        name: "Event organization",
        evidenceSlugs: ["beyond-the-words", "mun-lnct", "hack2skill"],
      },
      {
        name: "Education volunteering",
        evidenceSlugs: ["bachpanshala", "we-care", "raahat"],
      },
      {
        name: "Campus WebOps",
        evidenceSlugs: ["kanha-webops", "kanha-webops-leadership"],
      },
    ],
  },
];
