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
  lastUpdated: "2026-11-21",
  workingOn: [
    "GTM engineering and revenue data systems: GTM-Strato (ICP Finder with deterministic 100-point fit scoring and Apollo/Sales Nav/Clay filters), AIworks lead qualification CLI, RevenueRoles, and the Revenue Intelligence Engine",
    "Contract LLM evaluation and code/STEM review workflows through Outlier (following SDE — AI Engineer role at FoCDoT, Apr 2024 – Aug 2025)",
    "MedVoice — voice-assisted pharma wholesale billing where speech proposes candidate lines and deterministic rules decide medicine identity, integer-paise GST, and invoice posting",
    "AGENYRA — structured product data and stage-honest representation before agent placement, and The Open Framework civil-society coordination prototype",
  ],
  researching: [
    "Where deterministic rules must bound language models in revenue pipelines: separating scraped website facts from model hypotheses and keeping numerical scoring out of LLM prompts",
    "Cost-controlled enrichment waterfalls across public sources, Clay HTTP API columns, Apollo enrichment endpoints, and idempotent HubSpot CRM upserts",
    "Practical evaluation rubrics for code-oriented and tool-calling LLM outputs",
  ],
  learning: [
    "Clay waterfall design, credit accounting, and the boundary between spreadsheet orchestration and a typed Python/TypeScript backend",
    "HubSpot CRM object associations, domain-keyed deduplication, and conflict resolution between enrichment feeds and system-of-record fields",
    "CAN-SPAM, Google sender authentication guidelines, suppression lists, and why autonomous outbound without a human approval gate fails",
  ],
  thinking: [
    "Precision GTM: replacing high-volume sequence spam with evidence-backed account selection, field-level provenance, and transparent scoring",
    "Why an agent is an execution controller with state, tool schemas, and human approval checkpoints — not an unconstrained prompt loop",
    "Keeping public engineering claims verifiable: every project states whether it is live, runs locally, or runs on synthetic demo data",
  ],
  reading: [
    "Clay GTM engineering infrastructure docs, waterfall mechanics, and HTTP API integration guides",
    "Apollo People Enrichment & Rate Limit specifications and HubSpot CRM v3 association docs",
    "DPDP-aligned consent, audit-trail design, and evaluation methodology notes",
  ],
  priorities: [
    "Ship verifiable GTM and revenue-engineering systems with test suites, provenance, and explicit boundaries",
    "Wire live enrichment (Apollo) and CRM sandbox sync (HubSpot) behind existing provider adapters while keeping synthetic mode runnable without keys",
    "Keep every page, Markdown twin, API endpoint, and MCP tool synchronized from one typed content source",
  ],
};
