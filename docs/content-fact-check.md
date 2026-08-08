# Content Fact-Check Log

**Purpose:** Track every claim that must be verified, softened, or removed before publish.  
**Rule:** Unverified quantitative claims do **not** ship. Prefer qualitative honesty over impressive numbers.

**Statuses:** `UNVERIFIED` · `VERIFYING` · `VERIFIED` · `SOFTEN` · `REMOVE` · `PRIVATE`

Do not put secrets (full phone, tokens) in public site copy. Phone appears here only as a **privacy action item**.

---

## 1. Privacy / PII

| Claim / asset | Location(s) | Status | Action |
| --- | --- | --- | --- |
| Phone number in `tel:` links | `Hero.tsx`, `Contact.tsx`, tests | **PRIVATE** | Remove from UI, tests, and public docs |
| Phone in JSON-LD | `src/lib/seo.ts` (`telephone`) | **PRIVATE** | Delete property from structured data |
| WhatsApp deep link with phone | `profilesData.ts`, Contact socials | **PRIVATE** | Remove WhatsApp entry or replace with email CTA |
| Email ayushrai0211@gmail.com | Contact, Hero | OK to keep public | Confirm preferred public address |
| Location Bhopal / India | About / Contact | OK | Confirm city-level OK |

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
| Service packages starting $800–$2000 / $150/hr | **REMOVE** from primary IA | Optional private rate discussion only |
| “100% success” / “24/7 support” CountUps | **REMOVE** | Delete from Projects, Certifications, ExtraCurriculars, etc. |
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
| 40+ links in `profilesData.ts` | **SOFTEN** | Curate to ≤12; verify each URL live |
| WhatsApp | **PRIVATE** | Remove |
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
5. Phone publication preference (default: private)
