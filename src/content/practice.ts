/**
 * Three public blocks for the homepage and about page: work done, work in progress, and direction.
 *
 * The lines name companies and systems already recorded elsewhere on the site. They do not
 * add tenure dates, headcount, revenue, or a current-employer label.
 *
 * Connects to:
 * - src/pages/HomePage.tsx and src/pages/AboutPage.tsx render `practice`.
 * - src/lib/agent/markdown.ts includes the same lines on `/` and `/about`.
 */
export const practice = {
  did: [
    "FoCDoT, SDE, AI Engineer. Review model outputs against a written criterion. Take coding and STEM tasks apart when a fluent answer is still the wrong one.",
    "Outlier, contract evaluation for frontier-lab programs. Dataset quality, Python and JavaScript task prompting, and review of outputs that pass a glance and fail the task. The labs are not the employer.",
    "Revenue and GTM systems. RevenueRoles collects technical job postings and classifies them by the work. GTM-Strato scores an account on a fixed rubric and writes filters for Apollo, Sales Navigator, and Clay. The Revenue Intelligence Engine keeps research and export behind a person who can reject the write.",
    "Software for an actual operation. MedVoice takes a spoken wholesale line and lets rules decide the medicine, the tax in paise, and whether an invoice posts. AGENYRA starts from structured product data. Client sites, including Praful H., are the same job: build the thing the business asked for.",
  ],
  doing: [
    "GTM and revenue data: account scoring, lead qualification, and RevenueRoles.",
    "Evaluation work through Outlier on code, STEM, and dataset quality.",
    "MedVoice, AGENYRA, and The Open Framework.",
  ],
  aspirations: [
    "Qualification and scoring a company can audit, with the source of each field sitting on the record.",
    "Agents that stop before a write, and that can show the row they changed.",
    "Evaluation kept as a practice. Every system on this site says what it does and where it stops.",
  ],
} as const;
