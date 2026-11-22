/**
 * Curated visual artifacts, architecture flows, and defined replacement slots across the portfolio.
 *
 * Maps product, project, case-study, and GTM slugs to verified repository screenshots
 * (`public/images/work/*`), deterministic ASCII architecture diagrams, and explicit replacement
 * slots where a live capture is not yet bundled. Keeping this registry in `src/content` ensures
 * GtmPage, ProductDetailPage, WorkDetailPage, and HomePage render the same truthful provenance.
 *
 * Connects to:
 * - src/pages/GtmPage.tsx, ProductDetailPage.tsx, WorkDetailPage.tsx, HomePage.tsx.
 * - Uses `MediaGalleryItem` shape compatible with `src/components/editorial/MediaGallery.tsx`.
 */

/** One visual item (screenshot or replacement slot) attached to a content record. */
export interface VisualArtifact {
  label: string;
  src?: string;
  alt: string;
  caption?: string;
  badge?: string;
  slot?: string;
}

/** Visual gallery and architecture diagram for a product, project, or case study. */
export interface RecordVisuals {
  gallery: VisualArtifact[];
  diagram?: string;
}

/** Visuals keyed by product, project, or work slug. */
export const recordVisuals: Record<string, RecordVisuals> = {
  revenueroles: {
    gallery: [
      {
        label: "Platform home",
        src: "/images/work/revenueroles-homepage.png",
        alt: "RevenueRoles homepage showing technical revenue job categories and compensation coverage",
        caption: "RevenueRoles UI: role-family navigation and job discovery surface.",
        badge: "Repository artifact",
      },
      {
        label: "GTM Engineer taxonomy",
        src: "/images/work/revenueroles-gtm-role.png",
        alt: "RevenueRoles GTM Engineer role taxonomy detail view",
        caption: "GTM Engineer role breakdown: classified by the work described in the posting rather than job title.",
        badge: "Repository artifact",
      },
      {
        label: "Posting detail",
        src: "/images/work/revenueroles-job-detail.png",
        alt: "RevenueRoles single posting detail with normalized compensation and source link",
        caption: "Normalized job listing with extracted stack, eligibility verification, and direct ATS application link.",
        badge: "Repository artifact",
      },
      {
        label: "Taxonomy glossary",
        src: "/images/work/revenueroles-taxonomy.png",
        alt: "RevenueRoles taxonomy glossary index across GTM, RevOps, and FDE roles",
        caption: "Taxonomy index separating GTM Engineering, RevOps Engineering, and Forward Deployed roles.",
        badge: "Repository artifact",
      },
      {
        label: "Salary benchmarks",
        src: "/images/work/revenueroles-salary.png",
        alt: "RevenueRoles salary benchmark view",
        caption: "Compensation range distribution view across ingested postings.",
        badge: "Repository artifact",
      },
    ],
    diagram: [
      "Greenhouse / Lever / Ashby / RemoteOK",
      "    |",
      "    v",
      "Inngest scheduled discovery -> raw posting snapshot",
      "    |",
      "    v",
      "Python FastAPI worker -> schema normalization + work-based role classification",
      "    |",
      "    v",
      "Conservative deduplication (preserves working employer apply URL)",
      "    |",
      "    v",
      "Supabase Postgres + pgvector (RLS) -> Next.js app at revenueroles.in",
    ].join("\n"),
  },
  "revenue-intelligence-engine": {
    gallery: [
      {
        label: "01 · ICP config",
        src: "/images/work/rie-01-icp.jpg",
        alt: "Revenue Intelligence Engine ICP configuration screen",
        caption: "Stage 1: Define target industries, headcount bands, funding stages, and signal weights.",
        badge: "Repository screenshot",
      },
      {
        label: "02 · 100-pt scoring",
        src: "/images/work/rie-03-scoring.jpg",
        alt: "Revenue Intelligence Engine deterministic 100-point account scoring table",
        caption: "Stage 2: Deterministic 100-point rubric breakdown per synthetic account (no LLM score guessing).",
        badge: "Repository screenshot",
      },
      {
        label: "03 · Buying signals",
        src: "/images/work/rie-04-signals.jpg",
        alt: "Revenue Intelligence Engine buying signal detection view",
        caption: "Stage 3: Buying-signal extraction across hiring, funding, expansion, product launch, and tech stack.",
        badge: "Repository screenshot",
      },
      {
        label: "04 · Account research",
        src: "/images/work/rie-05-research.jpg",
        alt: "Revenue Intelligence Engine structured LLM account research with labeled claims",
        caption: "Stage 4: Structured account brief at temperature 0 with labeled claims and deterministic fallback.",
        badge: "Repository screenshot",
      },
      {
        label: "05 · Human approval gate",
        src: "/images/work/rie-06-approvals.jpg",
        alt: "Revenue Intelligence Engine human approval queue gating CRM export",
        caption: "Stage 5: Human approval queue holding researched accounts before any downstream export.",
        badge: "Repository screenshot",
      },
      {
        label: "06 · Approved GTM export",
        src: "/images/work/rie-07-export.jpg",
        alt: "Revenue Intelligence Engine approved GTM export payload",
        caption: "Stage 6: CRM-ready CSV/JSON/XLSX output restricted to human-approved records with run_id audit trail.",
        badge: "Repository screenshot",
      },
    ],
    diagram: [
      "ICP configuration + synthetic company universe (42 records)",
      "    |",
      "    v",
      "Load + normalize + domain deduplication -> MockEnrichmentProvider",
      "    |",
      "    v",
      "Signal engine (hiring / funding / expansion / launch / stack) + decision-maker match",
      "    |",
      "    v",
      "Deterministic 100-point scorer (ICP 30, Growth 20, Hiring 15, Tech 15, GTM need 10, Contact 10)",
      "    |",
      "    v",
      "Temperature-0 LLM account research (or deterministic fallback) -> Human approval queue -> Export",
    ].join("\n"),
  },
  "relationship-intelligence-engine": {
    gallery: [
      {
        label: "Provenance pipeline slot",
        alt: "Relationship Intelligence Engine CLI and local dashboard showing field-level provenance (value, source, URL, timestamp, confidence, verification status)",
        caption: "Local CLI & dashboard: every field carries verified, inferred, unverified, conflicting, or missing status.",
        badge: "Local CLI + PGlite",
        slot: "relationship-intelligence-dashboard",
      },
    ],
    diagram: [
      "Public sources (YC OSS directory, GitHub signals, Techstars / Antler / 500 Global)",
      "    |",
      "    v",
      "Discovery -> Normalization -> Entity resolution (company / founder / role)",
      "    |",
      "    v",
      "Field-level provenance wrapper { value, source, sourceUrl, retrievedAt, confidence, status }",
      "    |",
      "    v",
      "Verification gate -> Signal detection -> Explainable scoring -> PGlite / Postgres -> XLSX / CSV / JSON",
    ].join("\n"),
  },
  "gtm-strato": {
    gallery: [
      {
        label: "ICP Finder UI slot",
        alt: "GTM-Strato ICP Finder Streamlit workbench showing website facts separated from model hypotheses, 0-100 deterministic fit score, and generated Apollo / Sales Navigator / Clay filters",
        caption: "GTM-Strato ICP Finder: SSRF-hardened website extraction, NVIDIA Build inference, deterministic 5-component fit score, and platform prospecting filters.",
        badge: "Local Streamlit + SQLite",
        slot: "gtm-strato-icp-finder",
      },
    ],
    diagram: [
      "Public company URL (http/https ports 80/443, DNS/IP verified against private/loopback ranges, robots.txt checked)",
      "    |",
      "    v",
      "Website extractor (up to 5 pages, no JS execution, delimited untrusted text)",
      "    |",
      "    v",
      "NVIDIA Build API -> Company profile ([Website fact] vs [Hypothesis] vs [Not found]) + 3 ICPs + Personas",
      "    |",
      "    v",
      "Deterministic local scorer: Evidence 30% + Problem Fit 25% + Triggers 15% + Reachability 15% + Clarity 15%",
      "    |",
      "    v",
      "Platform prospecting filters (Apollo.io, LinkedIn Sales Navigator, Clay) -> SQLite run store",
    ].join("\n"),
  },
  "aiworks-leads": {
    gallery: [
      {
        label: "Qualification run report slot",
        alt: "AIworks lead pipeline CLI run report splitting researched leads into accepted_leads.csv, research_only.csv, and rejections.csv with pre-run SQLite backup",
        caption: "Zero-dependency Python qualification CLI: enforces mandatory per-field source URLs, direct-phone rules, and cross-run deduplication.",
        badge: "Zero-dep Python + SQLite",
        slot: "aiworks-leads-cli-report",
      },
    ],
    diagram: [
      "Researched CSV batch (every mandatory field requires a public *_source_url)",
      "    |",
      "    v",
      "Pre-run SQLite backup (data/backups/) -> schema & column check",
      "    |",
      "    v",
      "Deterministic rule engine: seniority check, industry scope, corporate email domain match, direct_business phone != switchboard",
      "    |",
      "    v",
      "Cross-run identity resolution (lead_id = normalized name + company domain) -> flags possible_duplicate_identity",
      "    |",
      "    v",
      "Immutable run folder: accepted_leads.csv | research_only.csv | rejections.csv | run_report.json",
    ].join("\n"),
  },
  spiderweb: {
    gallery: [
      {
        label: "Network graph & import report slot",
        alt: "SpiderWeb local Next.js interface showing two-stage LinkedIn export detection, entity resolution counts, and rule-based relationship signals",
        caption: "SpiderWeb: turns a personal LinkedIn archive into a deduplicated relationship graph with per-file import, dedup, and reject counts.",
        badge: "Local Next.js + Postgres + Redis",
        slot: "spiderweb-network-view",
      },
    ],
    diagram: [
      "LinkedIn data export archive (messy CSVs)",
      "    |",
      "    v",
      "Two-stage file detector (filename match -> column-signature fallback)",
      "    |",
      "    v",
      "Optional Redis ingestion worker -> Person & company entity resolution (import / update / dedup / reject counts)",
      "    |",
      "    v",
      "Rule-based relationship signals -> PostgreSQL -> Local searchable network graph",
    ].join("\n"),
  },
  mailu: {
    gallery: [
      {
        label: "Mailbox RAG & classification slot",
        alt: "MailU local email intelligence interface showing Gmail sync, zero-shot categorization, and local Ollama RAG chat over ChromaDB",
        caption: "MailU: local Gmail sync, zero-shot classification, semantic search, and RAG Q&A running on a local model.",
        badge: "Local FastAPI + ChromaDB + Ollama",
        slot: "mailu-local-rag",
      },
    ],
    diagram: [
      "Gmail API OAuth sync -> message parser & thread normalizer",
      "    |",
      "    v",
      "Zero-shot categorization + local embeddings -> ChromaDB vector store",
      "    |",
      "    v",
      "Semantic search & RAG chat via local Ollama model (single mailbox, stays on disk)",
    ].join("\n"),
  },
  "the-open-framework": {
    gallery: [
      {
        label: "Prototype interface slot",
        alt: "The Open Framework Vite and React prototype showing NGO, donor, talent, and governance entry screens",
        caption: "Clickable Vite/React front-end prototype for civil-society discovery and consent-scoped verification concepts.",
        badge: "Front-end prototype",
        slot: "the-open-framework-prototype",
      },
    ],
    diagram: [
      "Role entry points (NGO / Donor / Talent / Oversight)",
      "    |",
      "    v",
      "Vite + React + TypeScript prototype (mock localStorage session)",
      "    |",
      "    v",
      "[Design goal, not implemented]: consent-scoped statutory verification & federated audit log",
    ].join("\n"),
  },
  agenyra: {
    gallery: [
      {
        label: "Stage model & waitlist slot",
        alt: "AGENYRA public Next.js site showing the six-stage structured product representation model and Supabase waitlist",
        caption: "AGENYRA public surface: explicit stage vocabulary (building, experimental, exploring, planned, research) and RLS-backed waitlist.",
        badge: "Next.js 16 + Supabase",
        slot: "agenyra-stage-surface",
      },
    ],
    diagram: [
      "Builder submission -> Structured product profile (task, inputs, outputs, runtime, cost, verification state)",
      "    |",
      "    v",
      "Shared taxonomy classification -> Structured field comparison [Experimental internal build]",
      "    |",
      "    v",
      "[Planned / Research]: distribution surfaces, intent matching, and agent placement",
    ].join("\n"),
  },
  medvoice: {
    gallery: [
      {
        label: "Voice-to-invoice admin slot",
        alt: "MedVoice Next.js admin console showing medicine catalog search, draft order state machine, and integer-paise GST breakdown",
        caption: "MedVoice local admin: speech proposes candidate lines against the tenant catalog; deterministic code computes GST and enforces human confirmation.",
        badge: "NestJS + Next.js monorepo",
        slot: "medvoice-admin-console",
      },
    ],
    diagram: [
      "Spoken order line -> Speech adapter (mock default; Deepgram adapter behind key)",
      "    |",
      "    v",
      "Constrained alias matching against tenant medicine catalog only",
      "    |",
      "    v",
      "Ambiguous or risky match -> Unconfirmed draft line (requires explicit human confirmation)",
      "    |",
      "    v",
      "Deterministic GST calculation in integer paise -> Idempotent invoice post -> Mock / CSV ERP adapter",
    ].join("\n"),
  },
  "praful-h": {
    gallery: [
      {
        label: "Live client site",
        src: "/images/work/praful-h.jpg",
        alt: "Praful Hedau professional portfolio homepage live on Netlify",
        caption: "Live deployment at praful-h.netlify.app: credibility-first executive layout and timeline.",
        badge: "Live capture",
      },
    ],
  },
  mylifeos: {
    gallery: [
      {
        label: "Live archive site",
        src: "/images/work/mylifeos.jpg",
        alt: "MyLifeOS personal archive live at life.ayushrai.site",
        caption: "Live deployment at life.ayushrai.site: longer personal archive and working notes.",
        badge: "Live capture",
      },
    ],
  },
  "ayushmushrooms": {
    gallery: [
      {
        label: "Lead-to-datasheet MVP slot",
        alt: "AyushMushrooms Next.js marketing and lead-capture MVP for organic mushroom and spawn cultivation",
        caption: "Multi-page agritech brand MVP designed around lead capture, datasheet delivery, and CRM webhook readiness.",
        badge: "Next.js MVP",
        slot: "ayushmushrooms-mvp",
      },
    ],
    diagram: [
      "Product / training page -> Structured inquiry form",
      "    |",
      "    v",
      "Serverless handler -> Headless CMS lead record + PDF datasheet path + CRM webhook",
    ].join("\n"),
  },
  "shiksha-mitra": {
    gallery: [
      {
        label: "Peer learning platform slot",
        alt: "Shiksha-Mitra peer learning and acknowledgement platform interface",
        caption: "Next.js + Firebase + MongoDB community learning experiment focused on peer resource exchange.",
        badge: "Next.js + Firebase + MongoDB",
        slot: "shiksha-mitra-app",
      },
    ],
  },
  "expert-o": {
    gallery: [
      {
        label: "Collective site slot",
        alt: "Expert-O interdisciplinary digital studio and recruitment narrative site",
        caption: "Next.js + Tailwind + Framer Motion studio site with stage-honest service positioning.",
        badge: "Next.js + Framer Motion",
        slot: "expert-o-site",
      },
    ],
  },
  "overlay-text-box": {
    gallery: [
      {
        label: "Chrome extension overlay slot",
        alt: "Overlay Text Box Manifest V3 Chrome extension typing into a focused page input with pace controls",
        caption: "Manifest V3 extension: floating resizable overlay with character-by-character typing and start/stop control.",
        badge: "Chrome Extension MV3",
        slot: "overlay-text-box-extension",
      },
    ],
  },
  "iha-by-himani": {
    gallery: [
      {
        label: "Art studio site slot",
        alt: "Iha by Himani art studio responsive gallery and inquiry site",
        caption: "React + TypeScript + CSS Modules client site built for portfolio browsing and inquiry conversion.",
        badge: "Client delivery (2023)",
        slot: "iha-by-himani-gallery",
      },
    ],
  },
};

/** Look up visual artifacts and diagram for a product, project, or work slug. */
export function getRecordVisuals(slug: string): RecordVisuals | undefined {
  return recordVisuals[slug];
}
