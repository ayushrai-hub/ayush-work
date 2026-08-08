import type { Note } from "./types";

/**
 * Short seed notes grounded in real product / AI work.
 */
export const notes: Note[] = [
  {
    slug: "dpi-language-invites-skepticism",
    title: "DPI language invites skepticism — earn it with specificity",
    kind: "learning",
    publishedAt: "2026-08-08",
    body: "Calling something Digital Public Infrastructure sets a high bar. People immediately compare you to UPI or DigiLocker. For Open Framework I learned to say what is actually shipped (a concept site and architecture direction) and what is not (national adoption). The metaphor is useful for seriousness; it is dangerous as a status claim.",
    relatedSlugs: ["the-open-framework"],
  },
  {
    slug: "eval-is-the-job",
    title: "In RLHF-shaped work, evaluation is the job",
    kind: "observation",
    publishedAt: "2026-08-08",
    body: "Model names get the headlines; judgment criteria get the results. When reviewing code-oriented LLM outputs, vague 'looks good' feedback trains noise. Explicit rubrics — correctness, edge cases, security smells — make human feedback something a training loop can use. Brand proximity to big AI labs is not a substitute for that discipline.",
    relatedSlugs: ["focdot-sde-ai", "outlier-genai"],
  },
  {
    slug: "leads-before-carts",
    title: "Leads before carts in specialty agrotech",
    kind: "process",
    publishedAt: "2026-08-08",
    body: "For AyushMushrooms, a full shop would have been premature. Growers and buyers needed credible product detail and a clean path to talk to a human. A lead plus datasheet plus CRM webhook is a smaller system that still teaches demand. Commerce can arrive when the questions from those leads stop changing every week.",
    relatedSlugs: ["ayushmushrooms"],
  },
];
