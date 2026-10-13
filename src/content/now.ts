/**
 * Current focus for the /now page: what Ayush is working on, researching, learning, thinking about, reading and prioritizing.
 *
 * One `now` object with a date and six string lists. Update the date and the
 * bullets as reality changes. TODO comments mark bullets whose specifics
 * (papers, courses, reading list) are not yet confirmed.
 *
 * Connects to:
 * - NowPage renders every list; HomePage shows the first three `workingOn`
 *   items and the `lastUpdated` date; SiteFooter shows `lastUpdated`.
 * - Markdown twins: /now.md (all lists) and /index.md (first three
 *   `workingOn` items), also included in llms-full.txt.
 * - Uses `NowStatus` from types.ts.
 */
import type { NowStatus } from "./types";

/**
 * The current /now record. `lastUpdated` is the date shown as "Now section
 * updated"; the /now page's own Updated label comes from
 * `pageUpdatedAt("now")` in siteMeta.ts, which is maintained separately.
 */
export const now: NowStatus = {
  lastUpdated: "2026-09-29",
  workingOn: [
    "Independent AI evaluation and product building (FoCDoT role ended August 2025)",
    "The Open Framework, a public front-end prototype for civil-society coordination",
    "AyushMushrooms — agrotech brand MVP (content, leads, future shop readiness)",
    "AGENYRA, a distribution layer for AI products, still early and stage-labeled",
    "MedVoice, voice-assisted wholesale billing with deterministic tax and confirmation",
  ],
  researching: [
    "Consent, verification, and trust patterns for NGO / donor discovery (Open Framework)",
    // TODO: name specific papers or datasets once locked
    "Practical eval criteria for code-oriented LLM outputs",
  ],
  learning: [
    "Stricter product thinking around DPI-like systems (auditability, RBAC, longevity)",
    // TODO: confirm current course / book
    "Where a model must stop in a billing workflow, and where a product stage label has to stay narrow",
  ],
  thinking: [
    "How to talk about AI work without borrowing other orgs' brand names as status",
    "What 'selected work' should mean on a personal site, fewer items, clearer roles",
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
    "Keep Open Framework, AGENYRA, and MedVoice stage boundaries visible as they move",
    "Write short notes from product and AI eval learnings",
  ],
};
