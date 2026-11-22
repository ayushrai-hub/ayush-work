/**
 * Case studies under /work/:slug: problem, context, role, thinking, execution, outcome and lessons for each piece of work.
 *
 * `work` holds every case study; `selected: true` marks the ones featured on
 * the homepage. Projects and products point here through `relatedWorkSlug`.
 * Unverified impact metrics are softened or omitted, and the claims behind
 * them are recorded per item in `needsConfirmation`.
 *
 * Connects to:
 * - WorkPage, WorkDetailPage, HomePage (`selectedWork`, re-ordered for the
 *   "Role view" by src/lib/agent/audiences.ts) and
 *   src/components/editorial/WorkRow.tsx.
 * - Markdown twins /work.md and /work/:slug.md; /index.md and llms.txt list
 *   `selectedWork`; search items of type "work"; sitemap and prerender routes
 *   in src/lib/publicRoutes.ts.
 * - `getWorkBySlug` resolves project `relatedWorkSlug` links in search and in
 *   the REST API / MCP records (src/lib/agent/projectsQuery.ts).
 * - Uses `WorkItem` from types.ts.
 */
import type { WorkItem } from "./types";

/**
 * All case studies, in display order. Soften or omit unverified impact
 * metrics. Per-item `needsConfirmation` entries appear as public caveats on the
 * HTML detail page and in the Markdown twin, so write them as public text.
 */
export const work: WorkItem[] = [
  {
    slug: "revenueroles",
    title: "RevenueRoles",
    type: "product",
    summary:
      "How I built a multi-source job discovery and classification pipeline for technical revenue roles (GTM Engineer, RevOps Engineer, Forward Deployed Engineer) that classifies postings by the work described rather than the job title.",
    problem:
      "Technical revenue roles are scattered across employer applicant tracking systems under inconsistent titles. A role titled 'Growth Operations' at one company is a Python-and-Clay GTM Engineering role at another, while 'GTM Engineer' elsewhere is a quota-carrying SDR role. Candidates and hiring teams have to read every posting to tell what the job actually does.",
    context:
      "RevenueRoles (revenueroles.in) is a monorepo created on 30 June 2026 with Next.js web and API applications, a Python FastAPI classification service, Inngest scheduled discovery functions, and Supabase Postgres with pgvector and row-level security. On 18 October 2026 the live homepage listed 71 verified roles (last updated 23 September 2026) with 58% compensation coverage.",
    role:
      "Sole builder across the ingestion connectors, normalization schema, Python classification worker, deduplication rules, Supabase migrations, and Next.js application.",
    thinking:
      "Classification has to read the responsibilities and required stack, not match a title regex. Deduplicating the same posting across Greenhouse, Lever, Ashby, and aggregators like RemoteOK must be conservative: merging two records is only valid if the canonical employer application link is preserved.",
    execution:
      "Built source connectors for Greenhouse, Lever, Ashby, and RemoteOK with recorded fixtures. Scheduled discovery runs through Inngest with concurrency locks. The Python FastAPI pipeline normalizes postings into a single schema, classifies role family and required stack, verifies publication eligibility, and writes to Supabase Postgres. The repository contains 45 Python pytest tests and 294 TypeScript test cases across unit and integration suites.",
    outcome:
      "The public site and discovery pipeline were deployed to production in July 2026, ingesting real ATS postings. What works today: multi-source ATS connectors with fixture tests, work-based role taxonomy, conservative deduplication, and the public listing surface. What remains incomplete: salary unit/range validation edge cases, production verification of all signed-in candidate/admin flows, and saved-job alerts. No user or revenue figures are claimed.",
    lessons: [
      "Work-based classification costs more per record than title matching, and that specificity is the entire value of the dataset.",
      "Entity resolution on job postings must treat the original employer apply URL as an invariant that deduplication can never drop.",
    ],
    status: "in-progress",
    selected: true,
    yearStart: 2026,
    yearEnd: "present",
    technologies: [
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "Supabase Postgres",
      "pgvector",
      "Inngest",
      "Vercel",
    ],
    links: {
      demo: "https://revenueroles.in",
      github: "https://github.com/ayushrai-hub/RevenueRoles",
    },
    relatedSlugs: ["revenueroles"],
  },
  {
    slug: "gtm-strato",
    title: "GTM-Strato (ICP Finder)",
    type: "project",
    summary:
      "An ICP discovery and prospecting-filter engine that extracts public company pages with SSRF guards, separates cited website facts from LLM hypotheses, scores fit on a deterministic 100-point rubric, and generates Apollo, Sales Navigator, and Clay filters.",
    problem:
      "When GTM teams ask a language model to define an Ideal Customer Profile from a company website, the model blends stated product facts with plausible-sounding guesses and invents opaque fit scores. Reps cannot tell which claims came from a real page and which need verification.",
    context:
      "Built in November 2026 in the public GTM-Strato repository (`icp-finder/`). Runs locally as a Python 3.11+ and Streamlit workbench backed by SQLite (`data/icp_finder.sqlite`) and the NVIDIA Build API (`https://integrate.api.nvidia.com/v1`).",
    role:
      "Designed and implemented the SSRF-hardened website extractor, Pydantic schemas, NVIDIA Build client, evidence-vs-hypothesis separator, deterministic 5-component scoring engine, platform filter generator, SQLite run store, and 48 pytest tests.",
    thinking:
      "Three constraints keep an AI GTM research tool honest: first, untrusted website text must be fetched safely (ports 80/443 only, DNS resolution checked against private/loopback/reserved IP ranges before every hop, `robots.txt` respected, no JS execution); second, every profile field must carry an explicit evidence state (`Website fact` with cited URL, `Hypothesis`, or `Not found` — pricing is forced to `Not found` when no pricing text was extracted); third, the fit score must be computed by deterministic local code, never by another model prompt.",
    execution:
      "The extractor fetches up to five public pages per domain and passes delimited untrusted text to the analyzer. The generator produces a company profile, three distinct ICP segments, buyer personas, and platform-specific search filters for Apollo.io, LinkedIn Sales Navigator, and Clay. `scoring_engine.py` computes a 0–100 score across five weighted components: Evidence (30%), Problem Fit (25%), Buying Triggers (15%), Reachability (15%), and Commercial Clarity (15%). Automated tests (`tests/test_grounding.py`, `test_scoring.py`, `test_security.py`, `test_nvidia_client.py`, `test_database.py`, `test_features.py`, `test_streamlit_ui.py`) cover 48 test cases.",
    outcome:
      "Complete local GTM research workbench in a public repository with 48 passing tests and SQLite run persistence. What works today: SSRF-safe extraction, fact/hypothesis grounding, deterministic 100-point fit scoring, and Apollo/Sales Nav/Clay filter output. Limits: requires a user-supplied `NVIDIA_API_KEY` for live inference, does not execute client-side JavaScript on target sites, and is a starting point for discovery rather than verified market research.",
    lessons: [
      "Forcing pricing and commercial fields to 'Not found' when the scraped text has no evidence eliminates the most common GTM hallucination.",
      "Generating concrete Apollo, Sales Navigator, and Clay filter definitions turns an abstract ICP document into something an operator can run immediately.",
    ],
    status: "active",
    selected: true,
    yearStart: 2026,
    yearEnd: "present",
    technologies: [
      "Python",
      "Streamlit",
      "SQLite",
      "NVIDIA Build API",
      "Pydantic",
      "pytest",
    ],
    links: {
      github: "https://github.com/ayushrai-hub/GTM-Strato",
    },
  },
  {
    slug: "revenue-intelligence-engine",
    title: "Revenue Intelligence Engine",
    type: "experiment",
    summary:
      "A synthetic-data GTM pipeline that scores 42 fictional companies on a transparent 100-point rubric, runs temperature-0 account research with a deterministic fallback, and gates CRM-ready export behind human approval.",
    problem:
      "GTM teams routinely stitch together account research, signal hunting, qualification scoring, and outbound drafting by hand — or hand the entire loop to an LLM that assigns unexplainable scores and pushes unreviewed copy toward a CRM.",
    context:
      "Built in 2026 as an end-to-end systems demonstration (`REVENUE-INTELLIGENCE-ENGINE`) with a Python FastAPI backend, SQLAlchemy persistence, a Next.js GTM console, and 40 pytest tests. All 42 bundled companies, contacts, and buying signals are explicitly synthetic.",
    role:
      "Architected and built the staged Python workflow (`app/workflows/revenue_intelligence.py`), deterministic 100-point scorer, signal detector, temperature-0 research service with deterministic fallback, human approval queue, and Next.js operator console.",
    thinking:
      "Prioritization scores should never come from an LLM guess. A deterministic 100-point rubric (ICP fit 30, growth signal 20, hiring signal 15, technology fit 15, GTM need 10, contactability 10) lets an operator audit exactly why an account ranked first. Language models belong in bounded synthesis — drafting the account problem, why-now trigger, and personalization — and every output must pause in a human approval queue before export.",
    execution:
      "Each workflow run assigns a `run_id`, normalizes and deduplicates records by domain, runs a mock enrichment provider, detects five signal types (hiring, funding, expansion, product launch, technology adoption), scores accounts deterministically, generates labeled research briefs, and holds exports (CSV, JSON, XLSX) until a human approves the queue row. Re-runs perform idempotent upserts.",
    outcome:
      "Runnable full-stack GTM reference architecture with 40 pytest tests and a six-stage operator console. Limits: all data is synthetic, enrichment uses `MockEnrichmentProvider`, and no live Clay, Apollo, HubSpot, or outbound sending is wired in.",
    lessons: [
      "Separating deterministic qualification from generative account research makes pipeline rankings reproducible across runs.",
      "An approval queue between research and export is the simplest architectural control against automated outbound mistakes.",
    ],
    status: "active",
    selected: true,
    yearStart: 2026,
    yearEnd: "present",
    technologies: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "Next.js",
      "TypeScript",
      "pytest",
    ],
    links: {
      demo: "https://cashmaker-two.vercel.app",
      github: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE",
    },
  },
  {
    slug: "relationship-intelligence-engine",
    title: "Relationship Intelligence Engine",
    type: "project",
    summary:
      "A public-source entity-resolution and relationship-intelligence pipeline that tracks value, source URL, retrieval time, confidence, and a 5-state verification status on every field.",
    problem:
      "Most prospect and founder discovery scripts optimize for row count and overwrite fields silently, leaving no record of where a title, email domain, or hiring signal came from or whether two sources disagreed.",
    context:
      "Built in 2026 (`SYSTEM-job`) as a TypeScript CLI and local dashboard backed by PGlite / PostgreSQL and Playwright, with 34 automated tests. Targets public sources: the Y Combinator public directory, GitHub technical signals, and Techstars, Antler, and 500 Global portfolios.",
    role:
      "Built the ten-stage pipeline: discovery, normalization, entity resolution, enrichment, verification, signal detection, explainable scoring, deduplication, export, and refresh.",
    thinking:
      "Every important field on a company or person record should be a provenance envelope (`value`, `source`, `sourceUrl`, `retrievedAt`, `confidence`) carrying one of five explicit states: `verified`, `inferred`, `unverified`, `conflicting`, or `missing`. Unknown values stay empty rather than being guessed.",
    execution:
      "Implemented public-source collectors with rate limiting, company/person/job entity resolution, GitHub technical signal extraction, quality gates, explainable scoring, XLSX/CSV/JSON export, and a local inspection dashboard.",
    outcome:
      "Working local vertical slice with 34 tests across discovery, provenance, and scoring. Limits: personal research tool rather than a bulk lead factory; no paid enrichment vendors (Apollo, Clay, Hunter) are wired in; audit notes in the repository are self-recorded.",
    lessons: [
      "Treating 'conflicting' and 'missing' as first-class field states prevents bad merges from corrupting downstream outreach.",
      "Public directories plus GitHub signals provide strong technical-hiring intent before any paid enrichment credit is spent.",
    ],
    status: "in-progress",
    selected: true,
    yearStart: 2026,
    yearEnd: "present",
    technologies: [
      "TypeScript",
      "Node.js",
      "PGlite",
      "PostgreSQL",
      "Playwright",
    ],
    links: {
      github: "https://github.com/ayushrai-hub/SYSTEM-job",
    },
  },
  {
    slug: "aiworks-leads",
    title: "AIworks Lead Qualification Pipeline",
    type: "project",
    summary:
      "A zero-dependency Python lead-verification CLI and SQLite audit store that enforces per-field source URLs, direct-phone rules, and cross-run deduplication.",
    problem:
      "Human-researched lead spreadsheets drift fast: researchers paste company switchboards in place of direct phones, omit source URLs, include out-of-scope geographies or junior titles, and re-deliver prospects who were already accepted in an earlier batch.",
    context:
      "Built in October 2026 (`ayushrai-hub/leads`) as a zero-dependency Python 3.9+ package (`aiworks_leads`) with SQLite persistence (`data/aiworks_leads.sqlite3`), automatic pre-run database backups, and unittest coverage on synthetic `example.*` fixtures.",
    role:
      "Author of the rule engine (`rules.py`), CSV parser (`source_csv.py`), SQLite observation store (`store.py`), pipeline runner (`pipeline.py`), immutable run exporter (`export.py`), and CLI (`cli.py`).",
    thinking:
      "Qualification rules belong in deterministic code with an immutable audit trail. A lead is only accepted when every mandatory field (first/last name, senior decision-maker role, in-scope tech industry, non-India geography, corporate email matching the company website domain, and a 7–15 digit `direct_business` phone distinct from `company_switchboard_phone`) carries a public `*_source_url`. Anything relevant but incomplete belongs in `research_only.csv`, never silently promoted.",
    execution:
      "Each `python3 -m aiworks_leads import` run copies the SQLite database to `data/backups/`, computes a deterministic `lead_id` from normalized name and company domain, rejects previously accepted leads as `duplicate_previous_run`, flags same-name/same-company/different-email rows as `possible_duplicate_identity` without merging, upgrades previously incomplete leads when full evidence arrives, and writes an immutable `output/runs/<UTC timestamp>/` directory with `accepted_leads.csv`, `research_only.csv`, `rejections.csv`, `run_report.txt`, and `run_report.json`.",
    outcome:
      "Self-contained Python qualification CLI with zero third-party runtime dependencies and passing unit tests. Limits: validates provenance metadata and field rules locally; it does not crawl the source URLs or run SMTP/telephony ping checks.",
    lessons: [
      "Separating `research_only.csv` from `rejections.csv` preserves high-fit accounts that only need one missing direct phone or source URL.",
      "Refusing to auto-merge same-name/different-email records at the same company catches identity collisions before CRM import.",
    ],
    status: "active",
    selected: true,
    yearStart: 2026,
    yearEnd: "present",
    technologies: ["Python", "SQLite", "CLI", "CSV", "Data Verification"],
    links: {
      github: "https://github.com/ayushrai-hub/leads",
    },
  },
  {
    slug: "the-open-framework",
    title: "The Open Framework",
    type: "product",
    summary:
      "How I framed a civil-society coordination layer, and why the public prototype cannot be described as the infrastructure it points at.",
    problem:
      "NGOs, donors, talent, and institutions need discovery that carries verification and consent with it. A directory without those constraints recreates the trust problem it claims to solve.",
    context:
      "The audience is civil-society operators, donors, people looking for sector work, and oversight institutions. The repository was created on 26 Dec 2025. The live site is a visitable prototype of that idea.",
    role:
      "I set the direction and published the prototype. When I reviewed the repository, most commits were attributed to the Lovable bot. The ayushrai-hub commits remove that branding and record the Vercel setup. I am not claiming authorship of a production verification service.",
    thinking:
      "Verification, consent, governance, and an audit trail have to be product requirements before any backend is chosen. Naming NestJS, Spring Boot, PostgreSQL, or Kubernetes in the portfolio would describe a design wish, not this repository. DigiLocker or UPI can be a seriousness bar for institutional design. They are not a claim of equivalence.",
    execution:
      "The shipped artifact is a Vite, React, and TypeScript app with Tailwind, shadcn/ui, React Router, and TanStack Query. Sign-in stores a mock user in localStorage. Screens cover NGO, donor, and talent entry, governance, and a registry search. None of those screens talk to a verification service.",
    outcome:
      "The concept site is public at the-open-frameworks.vercel.app, and the source is public. It is not deployed infrastructure, and it has no evidenced institutional adoption. The live copy still shows illustrative scale figures and partner names. Those are prototype text. What works today: a clickable Vite/React prototype covering NGO, donor, and talent journeys. What remains incomplete: any verification service, institutional deployment, and production-shaped backend claims.",
    lessons: [
      "A wide clickable prototype teaches the journeys, and it also makes unfinished systems look operational.",
      "Architecture claims have to name the file that implements them. This repo implements a front end.",
    ],
    status: "in-progress",
    selected: true,
    yearStart: 2025,
    yearEnd: "present",
    technologies: [
      "Vite",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "React Router",
      "TanStack Query",
    ],
    links: {
      demo: "https://the-open-frameworks.vercel.app/",
      github: "https://github.com/ayushrai-hub/the-open-framework",
    },
    relatedSlugs: ["the-open-framework"],
    needsConfirmation: [
      "The public prototype includes illustrative scale, partner, and operational-status copy that the repository does not support.",
      "No institutional partner or deployment is documented.",
    ],
  },
  {
    slug: "agenyra",
    title: "AGENYRA",
    type: "product",
    summary:
      "Why a distribution layer for AI products has to start as structured data, and why the public repo only proves the site that says so.",
    problem:
      "People cannot reliably discover, understand, evaluate, and reach AI products. Marketing pages and keyword lists collapse task, inputs, deployment, and cost into adjectives.",
    context:
      "AGENYRA is aimed at people with a task and at builders who should describe a product once. The public site, agenyra.space, went up with the repository on 29 Sep 2026. It is a waitlist and an explanation, not an open catalog.",
    role:
      "I built the public Next.js site, the waitlist, and the stage model in AGENYRA_product. The site describes a private build for taxonomy, profiles, search, and builder onboarding. That build is not in the public repository, so this note does not walk through its code.",
    thinking:
      "Discovery and distribution are different jobs. Search can run over structured fields before any product is placed inside another tool or agent. Intent-aware matching is a research question until a system does it. I kept the stage vocabulary in one module so a feature cannot quietly become 'launched'.",
    execution:
      "The public app is Next.js 16, React 19, and Tailwind CSS v4 on Vercel. Waitlist rows go to Supabase through server-side access, with row-level security and no client key. The product model on the site is six stages: discover, understand, classify, match, distribute, and measure. Foundation work is marked building. Structured search is experimental. Distribution is exploring. Network capabilities are planned. Contextual intelligence is research.",
    outcome:
      "Visitors can read the model and join a waitlist. They cannot search a public product graph, and the site says the private build is not open. No usage, customer, or revenue figures are part of this write-up. What works today: the public Next.js site, waitlist to Supabase, and an explicit stage vocabulary. What remains incomplete: a public product graph, intent-aware matching, and any claim that distribution is launched.",
    lessons: [
      "A stage enum is a product decision. Without it, the homepage and the roadmap drift apart.",
      "Publishing the ambition early is useful only if the repository boundary stays visible: this repo is the site, not the matcher.",
    ],
    status: "in-progress",
    selected: true,
    yearStart: 2026,
    yearEnd: "present",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Vercel",
    ],
    links: {
      demo: "https://agenyra.space/",
      github: "https://github.com/ayushrai-hub/AGENYRA_product",
    },
    relatedSlugs: ["agenyra"],
    needsConfirmation: [
      "Behavior of the private product graph is taken from the public site's own stage copy, not from code in AGENYRA_product.",
    ],
  },
  {
    slug: "medvoice",
    title: "MedVoice",
    type: "product",
    summary:
      "How a wholesale billing workflow can accept speech without letting a model decide the medicine, the price, or the tax.",
    problem:
      "At a pharmaceutical wholesaler, the person on the floor speaks or writes a line and someone else types the invoice. Look-alike names, strengths, and pack sizes make a silent guess expensive.",
    context:
      "The users are floor workers, plus the owners, accountants, and managers who have to stand behind GST invoices. MedVoice is meant to sit beside Marg, Busy, or Tally, not replace them in the first version. The repository was created on 3 Aug 2026. There is no public demo.",
    role:
      "The repository is under my GitHub account. Commits I sampled are attributed to MedVoice Agent, not to a personal git author, so I am not using commit messages as a diary of what I typed. The reasoning below follows the product and safety documents in MedVoiceERP.",
    thinking:
      "The engineering constraint is the product. Speech is an input. Medicine identity comes from the tenant catalog. Ambiguity forces a confirmation. Quantity, price, and tax stay on deterministic code. An invoice write has to be idempotent, and a failed ERP sync cannot be shown as a completed sale.",
    execution:
      "The repo is a pnpm monorepo. Domain code and a NestJS API implement matching, order state, confirmation, integer-paise GST on the voice path, and in-memory idempotent invoicing. A Next.js admin can search the demo catalog, list orders, and inspect voice sessions without raw audio. Mock and CSV ERP adapters exist. The Android worker is a Kotlin scaffold with a push-to-talk recorder. Speech defaults to a mock provider. Postgres and Redis are prepared. The API still runs on an in-memory demo catalog unless that wiring is finished.",
    outcome:
      "The documented founding loop can run locally with mock speech and fixture medicines. A real warehouse catalog, production speech, a field-ready Android app, stock reservation, invoice PDFs, and live ERP posting are still ahead. The stack choice is explicitly provisional. What works today: domain matching, order state, confirmation, integer-paise GST on the voice path, in-memory idempotent invoicing, Next.js admin over a demo catalog, and mock/CSV ERP adapters. What remains incomplete: production speech, live ERP posting, stock reservation, invoice PDFs, and a field-ready Android app.",
    lessons: [
      "In a billing system, the model's job ends at a candidate list.",
      "A local mock loop is real engineering, and it is not a deployment. The docs are right to keep those sentences apart.",
    ],
    status: "in-progress",
    selected: true,
    yearStart: 2026,
    yearEnd: "present",
    technologies: [
      "TypeScript",
      "NestJS",
      "Next.js",
      "Kotlin",
      "PostgreSQL",
      "Redis",
    ],
    links: {
      github: "https://github.com/ayushrai-hub/MedVoiceERP",
    },
    relatedSlugs: ["medvoice"],
    needsConfirmation: [
      "Which portions were written by me versus coding agents. Sampled commits use the author name MedVoice Agent.",
      "A 26 Aug 2026 commit message mentions Supabase, Tally, Razorpay, and e-invoice work that the 25 Aug 2026 product overview still lists as incomplete. I did not promote those names to done.",
      "No public demo URL has been verified.",
    ],
  },
  {
    slug: "ayushmushrooms",
    title: "AyushMushrooms",
    type: "product",
    summary:
      "A content-first agrotech brand site for organic mushroom and spawn cultivation, marketing, expert profile, and lead capture, with room to grow into B2B commerce.",
    problem:
      "Specialty agritech brands often need a credible web presence that can collect leads and educate buyers without jumping straight into a heavy e-commerce build.",
    context:
      "Built as an SEO-aware multi-page MVP: products, services, training, and contact flows. Designed so a CMS and shop can land later without a rewrite.",
    role: "Product engineer, structure, implementation, and lead/CRM-oriented architecture.",
    thinking:
      "Separate brand storytelling from commerce. Optimize for clarity and lead quality first; keep login and shop as staged readiness, not fake completeness.",
    execution:
      "Next.js site with Tailwind, headless CMS direction (Sanity/Strapi), serverless form handling, PDF datasheet generation path, and webhook hooks for CRM. Hosted on Vercel.",
    outcome:
      "MVP live as a marketing and lead-generation surface. Commerce and full CMS content ops are still evolving.",
    lessons: [
      "Agrotech buyers care about credibility and specifics more than flashy UI.",
      "Lead → datasheet → CRM is a useful vertical slice before full shop.",
    ],
    status: "in-progress",
    selected: true,
    yearStart: 2024,
    yearEnd: "present",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Serverless APIs",
      "Headless CMS",
    ],
    links: {
      demo: "https://ayush-mushroom.vercel.app/",
    },
  },
  {
    slug: "shiksha-mitra",
    title: "Shiksha-Mitra",
    type: "project",
    summary:
      "A collaborative learning platform where peers share resources, acknowledge progress, and support each other's career and education journeys.",
    problem:
      "Learning is social, but most tools optimize for courses or feeds, not for mutual recognition and resource exchange among peers.",
    context:
      "Built as a community education experiment: mentorship-friendly, progress acknowledgement, and resource sharing without pretending to be a full LMS.",
    role: "Builder, product framing and full-stack implementation.",
    thinking:
      "Start from culture (appreciation, peer support) then add features. Avoid vanity engagement metrics; design for useful exchanges.",
    execution:
      "Next.js / React / TypeScript with Tailwind; Firebase and MongoDB for backend pieces; deployed on Vercel.",
    outcome:
      "Public app live as an early platform. Scale and retention claims are not part of this write-up.",
    lessons: [
      "Community products fail quietly when acknowledgement loops are weak.",
      "Serverless + document stores are fine early; schema discipline still matters.",
    ],
    status: "in-progress",
    selected: true,
    yearStart: 2024,
    yearEnd: "present",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Firebase",
      "MongoDB",
      "Vercel",
    ],
    links: {
      demo: "https://shiksha-mitra.vercel.app/",
      github: "https://github.com/ayushrai-hub/Shiksha-Mitra",
    },
  },
  {
    slug: "expert-o",
    title: "Expert-O",
    type: "project",
    summary:
      "A collective / studio site for multi-disciplinary digital work in India, services, portfolio framing, and recruitment narrative with AI-assisted workflows in mind.",
    problem:
      "Small interdisciplinary teams need a clear public face without overselling speed or 'transformative' jargon.",
    context:
      "I treated Expert-O as a positioning and operating-system site for a polymath-style collective: mission, services, thought leadership, hiring.",
    role: "Designer-developer, narrative, UI, and deployment.",
    thinking:
      "Rewrite away from '5x faster' marketing. Show how AI is used as leverage in workflows, not as decoration. Keep recruitment and services honest about stage.",
    execution:
      "Next.js / React / TypeScript / Tailwind / Framer Motion site, with Three.js accents where they earned their place; hosted on Vercel.",
    outcome:
      "Live site at expert-o.vercel.app. Treat it as a studio presence, not proof of national-scale impact.",
    lessons: [
      "Collective brands collapse if the copy outruns the delivery capacity.",
      "Motion and 3D should support hierarchy, not substitute for clarity.",
    ],
    status: "shipped",
    selected: true,
    yearStart: 2024,
    yearEnd: "present",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Three.js",
      "Vercel",
    ],
    links: {
      demo: "https://expert-o.vercel.app/",
    },
    // Older portfolio copy claimed "5x faster" execution, omit as unverified
    needsConfirmation: [
      "Any quantitative speed or delivery multipliers previously used in marketing copy",
    ],
  },
  {
    slug: "overlay-text-box",
    title: "Overlay Text Box",
    type: "open-source",
    summary:
      "A Chrome extension that overlays a text box and types into page fields character-by-character, useful for testing, demos, and more comfortable input flows.",
    problem:
      "Some workflows need simulated typing into arbitrary fields with control over pace and start/stop, browser defaults don't cover that well.",
    context:
      "Manifest V3 extension with a resizable overlay, trigger near focused fields, and random delays for more human-like typing.",
    role: "Author, design and implementation.",
    thinking:
      "Keep the surface small: one job, clear controls, broad compatibility. Accessibility and testing use-cases beat novelty.",
    execution:
      "Vanilla JS + HTML + Chrome Extension APIs (Manifest V3). Start/stop, visual feedback, and temporary field disable during typing.",
    outcome:
      "Open-sourced on GitHub. Not claiming store download or accessibility certification metrics.",
    lessons: [
      "Small tools teach a lot about permission models and DOM edge cases.",
      "Random delays feel nicer for demos but must stay optional and controllable.",
    ],
    status: "active",
    selected: true,
    yearStart: 2024,
    yearEnd: "present",
    technologies: ["JavaScript", "HTML", "Chrome Extension API", "Manifest V3"],
    links: {
      github: "https://github.com/ayushrai-hub/overlay-text-box-extension",
      demo: "https://github.com/ayushrai-hub/overlay-text-box-extension",
    },
  },
  {
    slug: "iha-by-himani",
    title: "Iha by Himani",
    type: "client",
    summary:
      "A responsive marketing site for an art studio, gallery, services, and contact, built to make the studio easier to find and approach online.",
    problem:
      "The studio needed a modern web presence that showcased work and reduced friction for inquiries.",
    context:
      "Short engagement (Jan–Feb 2023): portfolio gallery, motion, contact form, SEO basics, mobile-first layout.",
    role: "Web developer for the client site.",
    thinking:
      "Art sites should get out of the way of the work. Prioritize images, load behavior, and a clear contact path.",
    execution:
      "React + TypeScript with CSS Modules and Framer Motion; email-integrated contact form.",
    outcome:
      "Site live at ihabyhimani.com. Older '300% inquiry' style metrics are not repeated here, I don't have a verified baseline for that claim.",
    lessons: [
      "Client trust comes from reliable delivery and editable structure, not from inflated ROI numbers.",
      "Motion helps if it respects performance on image-heavy pages.",
    ],
    status: "shipped",
    selected: true,
    yearStart: 2023,
    yearEnd: 2023,
    technologies: [
      "React",
      "TypeScript",
      "CSS Modules",
      "Framer Motion",
    ],
    links: {
      demo: "https://www.ihabyhimani.com/",
      github: "https://github.com/ayushrai-hub/IHA-art-studio",
    },
    needsConfirmation: [
      "Previously stated 'increased client inquiries by 300%', needs baseline data before reuse",
    ],
  },
  {
    slug: "praful-h",
    title: "Praful H. Professional Site",
    type: "client",
    summary:
      "A professional portfolio for a UK-based technology leader, credibility-first layout for experience, leadership narrative, and contact.",
    problem:
      "Senior operators need a site that communicates depth without looking like a generic template or a startup splash page.",
    context:
      "2024 client engagement focused on performance, SEO, timeline of work, and a restrained visual system.",
    role: "Developer, implementation and structure for the client's narrative.",
    thinking:
      "Enterprise credibility is typography, hierarchy, and evidence, not tech-name soup. Keep stack claims aligned with what the site actually uses.",
    execution:
      "React / TypeScript / Next.js-oriented portfolio with strong content structure, contact flows, and deploy on Netlify.",
    outcome:
      "Live at praful-h.netlify.app. Client outcomes beyond launch are theirs to describe.",
    lessons: [
      "For leadership sites, restraint reads as confidence.",
      "Don't list infrastructure the marketing page doesn't actually run.",
    ],
    status: "shipped",
    selected: false,
    yearStart: 2024,
    yearEnd: 2024,
    technologies: ["React", "TypeScript", "Next.js", "Netlify"],
    links: {
      demo: "https://praful-h.netlify.app/",
      github: "https://github.com/ayushrai-hub/client-portfolio-praful",
    },
    // Older copy listed TensorFlow/K8s/OAuth heavily, verify before emphasizing
    needsConfirmation: [
      "Full production stack previously listed (TensorFlow, Kubernetes, PostgreSQL, OAuth), confirm what shipped vs aspirational",
    ],
  },
];

/** Case studies with `selected: true`: the homepage, /index.md and llms.txt "Case studies" list. */
export const selectedWork = work.filter((w) => w.selected);

/**
 * Look up a case study by slug. Used by WorkDetailPage, and by search and
 * projectsQuery.ts to decide whether a project links to /work/:slug.
 */
export function getWorkBySlug(slug: string): WorkItem | undefined {
  return work.find((w) => w.slug === slug);
}
