import type { NowStatus } from "./types";

/**
 * Living "now" page. Update dates and bullets as reality changes.
 * TODO placeholders are intentional where details are not yet confirmed.
 */
export const now: NowStatus = {
  lastUpdated: "2026-08-08",
  workingOn: [
    "RLHF / generative AI evaluation work at FoCDoT (and related Outlier workflows)",
    "The Open Framework — early DPI concept and site for India's civil society ecosystem",
    "AyushMushrooms — agrotech brand MVP (content, leads, future shop readiness)",
  ],
  researching: [
    "Consent, verification, and trust patterns for NGO / donor discovery (Open Framework)",
    // TODO: name specific papers or datasets once locked
    "Practical eval criteria for code-oriented LLM outputs",
  ],
  learning: [
    "Stricter product thinking around DPI-like systems (auditability, RBAC, longevity)",
    // TODO: confirm current course / book
    "Deeper NestJS / Spring Boot tradeoffs for institutional backends",
  ],
  thinking: [
    "How to talk about AI work without borrowing other orgs' brand names as status",
    "What 'selected work' should mean on a personal site — fewer items, clearer roles",
    "Keeping research notes honest: investigation ≠ publication",
  ],
  reading: [
    // TODO: replace with actual current reading list
    "Notes and specs around DPDP-aligned consent and audit logs",
    "Build logs and architecture notes for Open Framework and AyushMushrooms",
  ],
  priorities: [
    "Ship and document real systems over polishing vanity copy",
    "Keep public claims cautious and evidence-linked",
    "Grow Open Framework and AyushMushrooms with clear next milestones",
    "Write short notes from product and AI eval learnings",
  ],
};
