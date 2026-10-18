# Content Fact-Check Log

**Purpose:** Track every claim that must be verified, softened, or removed before publish.  
**Rule:** Unverified quantitative claims do **not** ship. Prefer qualitative honesty over impressive numbers.

**Statuses:** `UNVERIFIED` · `VERIFYING` · `VERIFIED` · `SOFTEN` · `REMOVE` · `PRIVATE`

Do not put secrets (tokens, keys, private links) in public site copy.

**Where the claims live now.** Sections 2–10 were written against the old single-page components (`Experience.tsx`, `CommunityLeadership.tsx`, `profilesData.ts`, and so on), which have been deleted. The same claims now live in `src/content/` (`experience.ts`, `projects.ts`, `work.ts`, `research.ts`, `leadership.ts`, `education.ts`, `elsewhere.ts`). Withheld awards, funding, and leadership claims sit in `researchAwardsNeedsConfirmation`, `researchFundingNeedsConfirmation`, and `leadershipNeedsConfirmation`, which no public output reads. The statuses below still apply.

---

## 1. Privacy / PII

| Claim / asset | Location(s) | Status | Action |
| --- | --- | --- | --- |
| Phone +91 7440567944, call link, WhatsApp | `person.phone`, `person.whatsappUrl` in `src/content/person.ts`; contact, home, footer, JSON-LD `telephone`, Markdown, `llms.txt` | VERIFIED, public by decision (14 Oct 2026) | `publicOutput.test.ts` fails on any other number. |
| Email ayushrai0211@gmail.com | `person.email` | VERIFIED, public | — |
| Location | `person.location` = "Remote" | VERIFIED | Do not publish a current city. Historical places (LNCTS Bhopal, past role cities) stay. |

---

## 2. Experience & affiliations

| Claim | Source in code | Status | Needed evidence | Suggested rewrite if unverified |
| --- | --- | --- | --- | --- |
| SDE–AI at FoCDoT, Apr 2024–Present | `Experience.tsx` | VERIFYING | Offer letter / LinkedIn role / manager OK | Keep role if employed; verify title spelling |
| Specialized in RLHF | Experience | VERIFYING | Project descriptions, NDAs permitting | “Worked on RLHF / human-feedback evaluation pipelines” |
| Collaborated with Turing, OpenAI, ScaleAI, Outlier | Experience | **UNVERIFIED** | Clarify: employer vendor platforms vs employer of record | “Worked on tasks/projects delivered via [platforms] as part of FoCDoT work” — **never imply direct OpenAI employment** |
| Generative AI Engineer at Outlier, Aug 2025–Present | Experience | VERIFYING | Confirm dates (future-relative in older snapshots) and title | Align dates with LinkedIn |
| Web Developer RaSoR–IITM, Dec 2023 | Experience | VERIFYING | Certificate / supervisor | Keep internship framing |
| UiPath Student Developer Champion 2022–23 | Experience + Drive link | VERIFYING | Certificate link works | Keep if link valid |
| Salesforce virtual intern 2022 | Experience + Drive link | VERIFYING | Certificate | Keep if link valid |
| Kanha House WebOps 2022–23 | Experience | VERIFYING | Confirmation | Keep if true |

---

## 3. Products

| Claim | Status | Needed evidence | Notes |
| --- | --- | --- | --- |
| The Open Framework — DPI for Indian NGOs, in progress | VERIFYING | Live demo URL ownership, repo, one-pager accuracy | Ambition language OK if labeled **vision / in progress**; avoid “national-scale deployed” tone until true |
| Comparable to DigiLocker / UPI seriousness | **SOFTEN** | N/A | Aspiration framing only; easy to read as overclaim |
| AyushMushrooms — agrotech MVP in progress | VERIFYING | Live URL, what MVP includes | Label MVP honestly |

---

## 4. Projects

| Claim | Status | Needed evidence | Suggested action |
| --- | --- | --- | --- |
| Overlay Text Box Extension | VERIFYING | Store link / GitHub | Keep if shippable artifact exists |
| Portfolio site as featured project | **SOFTEN** | N/A | Demote from featured; colophon only |
| Expert-O | VERIFYING | Demo, role clarity | Clarify personal vs collective |
| Shiksha-Mitra | VERIFYING | Demo, outcomes | Evidence-based summary |
| Iha-By-Himani — **300% inquiries** | **UNVERIFIED** | Analytics before/after, client OK to publish | Remove % or replace with “redesigned marketing site for …” |
| Praful H. professional site | VERIFYING | Live URL, permission to list client | Client work OK with permission |
| Expert-O / polymath marketing copy | **REMOVE** fluff | N/A | Rewrite in plain language |

---

## 5. Research

| Claim | Status | Needed evidence | Soften / remove |
| --- | --- | --- | --- |
| AI Ag Advisory — **85% prediction accuracy** | **UNVERIFIED** | Eval methodology, dataset, write-up | “Prototype advisory system using satellite / weather signals” |
| Deployed for **20+ farmers** | **UNVERIFIED** | Deployment notes, partners | “Pilot aimed at smallholder advisory” or exact N if true |
| Funding: IIT Madras BS Program | **UNVERIFIED** | Confirm funding vs coursework | Label correctly (course / thesis / grant) |
| NLP Legal Docs — **60% time reduction** | **UNVERIFIED** | Baseline study | Remove % or cite method |
| Analyzed **10,000+** legal documents | **UNVERIFIED** | Logs / paper | Soften to corpus size if known |
| Funding: LNCT Internal Research Grant | **UNVERIFIED** | Grant letter | Confirm or remove “funding” |
| Smart Campus Energy — **15% energy savings** | **UNVERIFIED** | Measurement period, baseline | Soften to “monitoring dashboard / IoT prototype” |
| Funding: Bhopal Smart City Initiative | **UNVERIFIED** | Partnership letter | Confirm affiliation carefully |
| SIH 2024 Top 5 — blockchain voting | **UNVERIFIED** | Certificate, team listing, year | Confirm year/problem statement; remove if false |
| Best Research Paper — Federated Learning healthcare | **UNVERIFIED** | Certificate, conference name, DOI | Remove until proven |
| ACM SRC finalist — CCSE 2023 | **UNVERIFIED** | Official listing | Remove until proven |

---

## 6. Leadership (high inflation risk)

| Claim | Status | Needed evidence | Default action |
| --- | --- | --- | --- |
| Tech Innovation Hub Coordinator — **$30K+ funding** | **UNVERIFIED** | Grant docs | **REMOVE** $ amount until proven |
| Mentored **100+** / impact **500+** students | **UNVERIFIED** | Rosters / event data | Soften to role + activities |
| GDSC Lead — **200+** developers, **50+** workshops, **95%** satisfaction, **1000+** empowered | **UNVERIFIED** | GDSC dashboard, photos, forms | Keep title if true; strip vanity metrics |
| Digital Skills Training — **200+** trained, **15+** orgs | **UNVERIFIED** | Partners list | Soften |
| Microsoft Learn Student Ambassador — **50K+** reach | **UNVERIFIED** | Analytics | Remove reach; keep title if appointed |
| Open Source workshops — **500+** contributors mentored | **UNVERIFIED** | Event list | Soften heavily |
| Other leadership cards in `CommunityLeadership.tsx` | **UNVERIFIED** | Case-by-case | Prefer extracurriculars list over this page |

**Policy:** Leadership ships as **role + org + dates + 1 concrete initiative**, not impact theater.

---

## 7. Extracurriculars (prefer these)

Generally more grounded. Still verify:

| Activity | Status | Notes |
| --- | --- | --- |
| Beyond The Words (IITM open mic) | VERIFYING | Dates, role |
| BachpanShala | VERIFYING | Role, duration |
| MUN / Raahat / Dragonfly Festival / others in component | VERIFYING | Keep specificity; drop “100%” vanity footer stats |

---

## 8. Services & vanity UI metrics

| Claim | Status | Action |
| --- | --- | --- |
| Service packages starting $800–$2000 / $150/hr | **REMOVE** — done | The services page was removed; `/services` redirects to `/contact`. `/software-services` has no prices. |
| “100% success” / “24/7 support” CountUps | **REMOVE** — done | Went with the deleted legacy components. |
| Hero stats (years, companies, projects…) | **SOFTEN** | Prefer none on hero; if kept, must be accurate and non-vanity |

---

## 9. Education (likely OK; still confirm formatting)

| Claim | Status | Notes |
| --- | --- | --- |
| B.Tech CSE LNCTS 2020–2024 CGPA 8.47 | VERIFYING | Matches transcript? |
| BS Data Science IIT Madras 2021–2024 CGPA 6.86 | VERIFYING | Degree name exact? |
| HS Seoni 78.2% | VERIFYING | Optional to omit on public site |

---

## 10. Profiles

| Item | Status | Action |
| --- | --- | --- |
| About 40 links in `src/content/elsewhere.ts` | **SOFTEN** | Curate to ≤12; verify each URL live |
| WhatsApp | Public by decision (14 Oct 2026) | Kept, from `person.whatsappUrl` |
| Dead or unused platforms | **REMOVE** | Audit quarterly |

---

## 11. Verification workflow

1. Owner (Ayush) marks each row with evidence link (Drive, cert PDF, analytics screenshot — private).  
2. Editor softens or removes before merge to main content files.  
3. Tests must not assert removed vanity strings or phone numbers.  
4. Re-run this log when adding any new %.

---

## 12. Questions that block publish

See `questions-for-ayush.md` for the decision list. Highest blockers:

1. OpenAI/Turing/ScaleAI relationship wording  
2. Research metrics & awards  
3. Leadership dollar/reach claims  
4. Iha-By-Himani 300%  
5. ~~Phone publication preference~~ Answered 14 Oct 2026: public.

---

## 13. Flagship products (October 2026)

Full audit: `docs/flagship-products-audit.md`.

| Claim | Status | Notes |
| --- | --- | --- |
| The Open Framework public site is a Vite/React prototype with mock auth | VERIFIED | Repository README, `package.json`, `AuthContext.tsx`. Not Next.js, NestJS, Spring Boot, PostgreSQL, or Kubernetes. |
| The Open Framework is deployed national infrastructure or partnered with ministries | REMOVE | Live prototype copy shows illustrative figures and partner names. Do not repeat them. |
| AGENYRA foundation / search / distribution / network / intelligence stages | VERIFIED as labels | From `src/content/status.ts` in AGENYRA_product. Private product-graph code is not in that public repo. |
| AGENYRA waitlist admin, tokens, service-role key | PRIVATE | Do not publish. |
| MedVoice safety rules and phase status | VERIFIED as documentation | `docs/product/PRODUCT_OVERVIEW.md` dated 2026-08-25. |
| MedVoice production speech, Android field app, live ERP, warehouse deployment | REMOVE | Documented as partial, planned, or blocked. |
| MedVoice public demo URL | UNVERIFIED | None added. |
| MedVoice commit-level personal authorship | UNVERIFIED | Sampled commits are authored as MedVoice Agent. |
| 26 Aug 2026 MedVoice commit mentioning Tally, Razorpay, e-invoice, Supabase | UNVERIFIED against the overview | Not promoted to implemented. |

---

## 14. Domain pages (11 October 2026)

Positioning line **AI Engineer & AI Product Builder** is a self-description, not a ranking, certification, or years-of-experience claim. Status: **self-reported**, consistent with the FoCDoT title "SDE — AI Engineer" and the product work. It does not replace the fact-check rows above.

| Claim on the new pages | Status | Where it lives |
| --- | --- | --- |
| FoCDoT, April 2024–August 2025, evaluation and STEM/coding-task analysis | SELF-REPORTED | `src/content/experience.ts`. Still VERIFYING against an offer letter. |
| Outlier contract from August 2025, frontier-lab programs via the platform | SELF-REPORTED | Same file. Not direct lab employment. |
| RLHF-oriented evaluation, without reward-model or policy training | SELF-REPORTED, scoped | Experience highlights say "RLHF-oriented evaluation". The domain page refuses training claims. |
| MedVoice: speech proposes, rules decide; no public demo; ERP adapters mock/CSV only | VERIFIED as site documentation | Product and case-study records. Not a live wholesaler deployment. |
| AGENYRA public repo proves the site, not a placement network | VERIFIED as site documentation | Case study. |
| Legal NLP retrieval page is an investigation, metrics withheld | VERIFIED as the research record | Older percentages stay UNVERIFIED and are not repeated. |
| Inference, quantization, and distributed systems as shipped specialties | NOT CLAIMED | No URLs were created. |
| Software services rates, SLAs, or team size | NOT CLAIMED | `/software-services` has no prices. |
| Open-source star counts or third-party maintainer roles | NOT CLAIMED | Only repositories already linked from this site. |
| RevenueRoles: 71 verified roles (last updated 23 Sep 2026) and 58% compensation coverage (41 jobs with compensation fields) | VERIFIED against the live revenueroles.in homepage on 18 Oct 2026 | `/gtm-revops`, dated as the site's own counts. Not user or revenue numbers. Re-check before reusing. |
| Revenue Intelligence Engine: 42 fictional companies, deterministic 100-point score, approval gate | VERIFIED against the repository README | `/gtm-revops`, `/gtm`, `/projects`. All data synthetic. |
| Relationship Intelligence Engine provenance fields and five statuses | VERIFIED against the SYSTEM-job README | `/gtm-revops`, `/gtm`. Repository audit figures not re-run and not quoted. |
| Sales, RevOps, CRM-admin experience; CRM, Clay, or Apollo integration | NOT CLAIMED | Listed as gaps on `/gtm-revops`. |

---

## 15. Inconsistencies found in the code review (14 October 2026)

Found while documenting every source file. Status as of 18 October 2026, from the remediation table in `known-issues.md`: the funding notes, `/uses` and `/principles` wording, IIT Madras empty range in Markdown, `EmptyNote` copy, `/resume` description, and legacy components are fixed in code (issues 1, 2, 4, 7, 8, 9). Still open: timeline and `/now` dates (issue 6). `/uses` and `/privacy` now both name Netlify and Vercel; picking one host is issue 24. The wording decisions marked "Ayush:" in that table still need him.

| Issue | Where | Suggested resolution |
| --- | --- | --- |
| Research `fundingNote` values such as "LNCT Internal Research Grant — needsConfirmation." and "BHOPAL SMART CITY INITIATIVE — needsConfirmation." render verbatim on the public research pages and their Markdown twins | `src/content/research.ts` | Remove the funding note until confirmed, or move it into the record's `needsConfirmation` list. |
| The Open Framework is listed under Next.js, PostgreSQL, and Docker on `/uses`, and `/principles` says it "starts from RBAC" and "ships as MVP", while the case study says it is a Vite/React prototype with mock auth at the `building` stage | `src/content/uses.ts`, `src/content/principles.ts` vs `work.ts`, `products.ts` | Align `/uses` and `/principles` with section 13. |
| Timeline dates disagree with other records: The Open Framework appears under 2024 (repository and work record start in 2025); the Google Cloud entry is 2020 while recognition says 2020–2024 | `src/content/timeline.ts` | Confirm dates. |
| `/now` shows two dates: `now.lastUpdated` 2026-09-29 and `siteMeta.pages.now` 2026-08-08 | `src/content/now.ts`, `siteMeta.ts` | Keep one. |
| IIT Madras entry has empty start and end; the Markdown twin prints a bare " – " | `src/content/education.ts` | Add dates or omit the range in Markdown. |
| `uses.ts` says Netlify hosts the site; the privacy page says Netlify and possibly Vercel | `src/content/uses.ts`, `policies.ts` | Both hosts now build from `main`; state it once. |
| `EmptyNote` shows the internal path `docs/questions-for-ayush.md` to visitors on `/writing`, `/uses`, and `/now` | `src/components/editorial/EmptyNote.tsx` | Replace with visitor-facing copy. |
| `/resume` meta description promises a download; the page has no download link | `src/pages/ResumePage.tsx` | Add the file or change the description. |
| Legacy components and tests still contain the phone number, withheld awards, and old service prices | `src/components/Hero.tsx`, `Contact.tsx`, `Research.tsx`, `Services.tsx`, `src/lib/profilesData.ts`, `src/__tests__/legacy/` | Not shipped (not imported by the live site). Delete the legacy folder or scrub it. |

Fixed in code on the same day: the timeline's Legal NLP entry linked to a non-existent `/work/legal-nlp-contracts` and now links to `/research/legal-nlp-contracts`; `/writing/:slug` pages had Markdown twins but no HTML and are now prerendered.

