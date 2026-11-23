/**
 * GTM engineering: the record behind /gtm and its Markdown twin /gtm.md.
 *
 * Holds what is specific to the GTM and revenue-systems showcase: positioning, the skill stack,
 * a concise systems index, agentic motion rows, vision for precision GTM and autonomous revenue
 * systems, the walkthrough video slot, per-project evidence labels,
 * problem/solution/architecture/scale/outcomes/limits for seven real GTM and revenue builds,
 * autonomous agent workflows, the GTM infrastructure layer map, the structured toolkit tables
 * with honest levels, active research and experiments, lessons learned, reading resources,
 * and next builds. Product and project facts (summaries, stacks, links, maturity) stay in
 * products.ts and projects.ts and are looked up by slug, so /products, /projects, search, the API,
 * and MCP say the same thing as this page. `renderGtmBody` builds the Markdown body from the same
 * record.
 *
 * Connects to:
 * - src/pages/GtmPage.tsx (HTML) and `buildPages()` in src/lib/agent/markdown.ts (/gtm.md).
 * - searchIndex.ts adds one item pointing at /gtm.
 * - Depends on `getProductBySlug` (products.ts) and `getProjectBySlug` (projects.ts).
 */
import { getProductBySlug } from "./products";
import { getProjectBySlug } from "./projects";

/** How strong the evidence behind a proof is. */
export type GtmEvidence = "live" | "local" | "synthetic";

/** Display label and one-line meaning for each evidence level. */
export const gtmEvidenceLabels: Record<GtmEvidence, { label: string; meaning: string }> = {
  live: {
    label: "Live",
    meaning: "A public URL serves it today.",
  },
  local: {
    label: "Runs locally",
    meaning: "Code and tests are in a public repository; there is no hosted deployment.",
  },
  synthetic: {
    label: "Synthetic demo",
    meaning: "The workflow runs end to end on fictional data with mock enrichment.",
  },
};

/** One proof on /gtm: a product or project record plus problem, solution, architecture, verifiable metrics, and limits. */
export interface GtmProof {
  slug: string;
  kind: "product" | "project";
  evidence: GtmEvidence;
  /** Short stack labels for products, which have prose architecture instead of a technology list. */
  stack?: string[];
  /** Specific revenue or GTM problem addressed. */
  problem?: string;
  /** How the system solves it. */
  solution?: string;
  /** Concrete architecture and data flow in the repository. */
  architectureNote?: string;
  /** Verifiable repository metrics (tests, connectors, schema states, dataset counts, never invented adoption). */
  verifiableMetrics?: string[];
  /** One sentence for the systems index at the top of /gtm. */
  blurb: string;
  /** GTM concepts the work demonstrates. */
  shows: string[];
  /** Stated limits. Shown next to the proof, never hidden. */
  limits: string[];
}

/** One layer of GTM infrastructure, what exists for it, and the gap. */
export interface GtmLayer {
  name: string;
  description: string;
  built: string[];
  gap: string;
}

/** How well a tool or practice is known: in public code, used without a public project, or being studied. */
export type GtmSkillLevel = "shipped" | "used" | "studying";

/** Display label for each skill level. */
export const gtmSkillLevelLabels: Record<GtmSkillLevel, string> = {
  shipped: "In public code",
  used: "Used, no public project",
  studying: "Studying now",
};

/** One tool, framework, or practice with its level and where it shows up. */
export interface GtmSkill {
  name: string;
  level: GtmSkillLevel;
  note: string;
}

/** A named group of skills. */
export interface GtmSkillGroup {
  heading: string;
  items: GtmSkill[];
}

/** One topic being studied, with the questions it has to answer. */
export interface GtmStudyTopic {
  topic: string;
  questions: string[];
}

/** A reading resource. */
export interface GtmResource {
  label: string;
  href: string;
  note?: string;
  /** ISO date (YYYY-MM-DD) the resource was finished. Unset means not read yet. */
  completedOn?: string;
}

/** A group of reading resources. */
export interface GtmResourceGroup {
  heading: string;
  items: GtmResource[];
}

/** One row in the skill-stack table: a domain, the work it covers, and the tools. */
export interface GtmSkillStackRow {
  domain: string;
  scope: string;
  tools: string;
}

/** One row in the agentic-depth table: what runs, what code enforces, and which system. */
export interface GtmMotionRow {
  motion: string;
  autonomous: string;
  control: string;
  system: string;
  href: string;
}

/** One capability row in the GTM engineering capability matrix table. */
export interface GtmCapabilityRow {
  domain: string;
  engineeringFocus: string;
  toolsAndStack: string;
  proofInRepo: string;
  evidenceStatus: GtmSkillLevel;
}

/** One autonomous agent or AI-driven revenue workflow pattern and its control boundary. */
export interface GtmAgentWorkflow {
  name: string;
  roleOfModel: string;
  deterministicGuardrail: string;
  humanGate: string;
  implementedIn: string;
  href: string;
}

/** One engineering thesis or lesson learned from building GTM and revenue systems. */
export interface GtmThesisPillar {
  title: string;
  statement: string;
  implementationDetail: string;
}

/** The whole /gtm record. */
export interface GtmPortfolio {
  title: string;
  description: string;
  positioning: string;
  vision: {
    headline: string;
    paragraphs: string[];
    pillars: GtmThesisPillar[];
  };
  skillStack: GtmSkillStackRow[];
  agentMotions: GtmMotionRow[];
  capabilityMatrix: GtmCapabilityRow[];
  agentWorkflows: GtmAgentWorkflow[];
  walkthrough: {
    /** Loom share or embed URL. Leave unset until the video is recorded. */
    loomUrl?: string;
    plannedTopics: string[];
  };
  proofs: GtmProof[];
  layers: GtmLayer[];
  toolkit: GtmSkillGroup[];
  studying: { intro: string; topics: GtmStudyTopic[] };
  lessonsLearned: Array<{ title: string; detail: string; sourceSlug: string }>;
  resources: { note: string; groups: GtmResourceGroup[] };
  nextBuilds: string[];
}

/**
 * The /gtm record. Levels and limits are deliberately conservative: a tool is "in public code"
 * only when a linked repository uses it, and no figure appears here that the linked repositories
 * or sites do not state.
 */
export const gtmPortfolio: GtmPortfolio = {
  title: "GTM engineering",
  description:
    "Ayush Rai on GTM engineering and revenue systems: 7 real GTM and revenue-data products/projects (RevenueRoles, GTM-Strato ICP Finder, Revenue Intelligence Engine, Relationship Intelligence Engine, AIworks Lead Qualification Pipeline, SpiderWeb, MailU), structured capability tables, human-gated autonomous agent workflows, and an honest map of what is shipped versus studied.",
  positioning:
    "I build data, qualification, and agentic decision systems for revenue teams: public-source discovery pipelines, SSRF-hardened company research, field-level provenance, deterministic 100-point ICP and lead scoring, and human-approval gates before anything touches a CRM or outbound channel.",
  vision: {
    headline: "Precision GTM and the future of autonomous revenue systems",
    paragraphs: [
      "Volume-first outbound is collapsing under its own noise. Cheap generative copy and bulk contact exports made it trivial to blast thousands of inboxes, which destroyed reply rates and forced mailbox providers to tighten sender thresholds. The next generation of revenue infrastructure is not a louder sequence sender, it is precision GTM: identifying the exact accounts with a verifiable technical or commercial trigger, proving where every field came from, and routing only high-conviction actions to humans.",
      "In an autonomous revenue system, language models and deterministic software have strict, non-overlapping jobs. Models excel at reading unstructured inputs, parsing five pages of a prospect's website, extracting a job description's actual responsibilities, or summarizing why an account's recent hiring matters. They are terrible systems of record. Entity resolution, duplicate detection, 0–100 fit scoring, credit budgets, idempotency keys, and CRM schema validation must stay in deterministic code with unit tests.",
      "Autonomy in revenue operations should be earned stage by stage. Routine discovery, normalization, waterfall enrichment, signal extraction, and draft preparation can run on schedules or webhooks without human intervention. Anything that mutates a system of record or contacts a customer belongs behind an explicit human approval gate, with every claim linked to its source URL and timestamp.",
    ],
    pillars: [
      {
        title: "Provenance over row count",
        statement:
          "A smaller lead table where every email, direct phone, and buying signal carries a source URL, retrieval timestamp, and verification state beats a 50,000-row CSV with silent guesses.",
        implementationDetail:
          "Implemented in Relationship Intelligence Engine (5-state field status: verified, inferred, unverified, conflicting, missing) and AIworks Lead Pipeline (mandatory *_source_url per field).",
      },
      {
        title: "Deterministic scoring, generative synthesis",
        statement:
          "Never ask an LLM for a lead score. Compute fit, trigger weight, reachability, and confidence in tested code; use the model at temperature 0 to synthesize evidence-labeled research briefs.",
        implementationDetail:
          "Implemented in GTM-Strato (5-component local rubric) and Revenue Intelligence Engine (6-component 100-point rubric + deterministic fallback).",
      },
      {
        title: "Human approval gates at the system boundary",
        statement:
          "Autonomous agents should prepare the research, filter definitions, and draft payload, then pause in an approval queue before any CRM write or outbound send.",
        implementationDetail:
          "Implemented in Revenue Intelligence Engine (approval queue gating CSV/JSON/XLSX export) and the ORBIT / REVFLOW proof-of-work workbenches.",
      },
      {
        title: "Cost-aware model routing",
        statement:
          "Running a frontier model on every row of an unsegmented list wastes budget. Filter deterministically first, route structured extraction to fast models or local weights, and reserve deep synthesis for top-decile accounts.",
        implementationDetail:
          "Implemented across AIworks (zero-LLM rule pre-filter), GTM-Strato (NVIDIA Build NIM endpoints), and MailU (local Ollama + ChromaDB).",
      },
    ],
  },
  skillStack: [
    {
      domain: "GTM systems",
      scope:
        "GTM automation, lead research, account intelligence, lead qualification, revenue intelligence, relationship intelligence, data enrichment, research automation, workflow automation.",
      tools: "Clay, Apollo, Sales Navigator, n8n, HubSpot",
    },
    {
      domain: "Business and market intelligence",
      scope:
        "ICP and segmentation, TAM SAM SOM, buyer personas, buying committees, ABM, PLG and SLG, positioning, sales cycles, territory planning, acquisition economics.",
      tools: "LinkedIn Sales Navigator, Apollo, Crunchbase, Similarweb, G2, BuiltWith",
    },
    {
      domain: "Prospecting, data, and enrichment",
      scope:
        "Account and contact discovery, waterfall enrichment, email and phone verification, firmographics, technographics, entity resolution, dedup, buying intent, job-change, funding, and hiring signals, lead scoring.",
      tools: "Clay, Claygent, Apollo, 11x, Overloop, Common Room, 6sense, Unify",
    },
    {
      domain: "Outbound",
      scope:
        "Cold email architecture, LinkedIn outreach, multichannel sequences, signal-based and AI personalization, follow-ups, reply classification, meeting booking, SDR handoff.",
      tools: "Smartlead, Instantly, Apollo, HubSpot",
    },
    {
      domain: "Deliverability",
      scope:
        "Sending domains, SPF, DKIM, DMARC, mailbox provisioning, reputation, bounce and suppression handling, verification, sending volume.",
      tools: "Smartlead, Instantly, Cloudflare",
    },
    {
      domain: "Agentic automation",
      scope:
        "Workflow architecture, webhooks, retries, scheduled jobs, autonomous web research, AI prospect research, AI SDR preparation, agentic lead qualification, personalization pipelines, human approval, tool calling, state.",
      tools: "n8n, Make, Zapier, Claygent, Claude Code, Codex, MCP, Playwright",
    },
    {
      domain: "CRM and revenue operations",
      scope:
        "Lifecycle stages, lead routing, assignment rules, pipeline, duplicate control, sales handoff, opportunity management, renewal and expansion workflows.",
      tools: "HubSpot, Salesforce",
    },
    {
      domain: "Engineering, data, and analytics",
      scope:
        "Python, TypeScript, SQL, REST, webhooks, FastAPI, ETL, data modeling, PostgreSQL, Redis, auth, Docker, CI/CD. Reply rate, meetings, pipeline attribution, CAC, LTV, ARR, MRR.",
      tools: "Python, TypeScript, FastAPI, Next.js, React, Streamlit, PostgreSQL, Supabase, Redis, Docker, Vercel, Inngest",
    },
  ],
  agentMotions: [
    {
      motion: "Waterfall enrichment and scoring",
      autonomous: "Hiring, funding, expansion, product, and technology signals are detected, then a fixed rubric ranks the account before a model is called.",
      control: "Python owns the 0–100 score. The model writes research, and the score stays in code.",
      system: "GTM-Strato and Revenue Intelligence Engine",
      href: "/work/gtm-strato",
    },
    {
      motion: "Clay, Apollo, and Sales Navigator",
      autonomous: "A company run emits ready-to-use filter payloads for Clay, Apollo.io, and LinkedIn Sales Navigator.",
      control: "The repository generates the filters. The vendor APIs stay outside the run.",
      system: "GTM-Strato",
      href: "https://github.com/ayushrai-hub/GTM-Strato",
    },
    {
      motion: "Autonomous account research",
      autonomous: "A temperature-0 pass reads public pages and returns segments, personas, and a research brief with each claim labeled.",
      control: "A price with no source text is stored as Not found. Each claim is a website fact, a hypothesis, or missing.",
      system: "GTM-Strato",
      href: "https://github.com/ayushrai-hub/GTM-Strato",
    },
    {
      motion: "Agentic lead qualification",
      autonomous: "Rules sort every row into accepted, research-only, or rejected, and block a lead already delivered.",
      control: "Each required field carries a public source URL. A direct phone that matches the switchboard is refused.",
      system: "AIworks Lead Pipeline",
      href: "/work/aiworks-leads",
    },
    {
      motion: "Human approval before a write",
      autonomous: "Research, filter files, and CRM-ready exports are prepared on a schedule or a run id.",
      control: "Export and any outbound write wait in an approval queue. Approving still requires a read-back of the stored row.",
      system: "Revenue Intelligence Engine and ORBIT",
      href: "/pow/agentic-ai",
    },
    {
      motion: "Tool calling and MCP",
      autonomous: "Typed tools and two read-only MCP servers answer an agent from the public record.",
      control: "The tool payload cannot grant its own approval. The portfolio servers expose no write tools.",
      system: "ORBIT and this site",
      href: "/developers",
    },
  ],
  capabilityMatrix: [
    {
      domain: "Account discovery & signal ingestion",
      engineeringFocus: "ATS connectors, public directory scraping, SSRF-safe web extraction, scheduled re-discovery",
      toolsAndStack: "Python, TypeScript, Inngest, Playwright, Greenhouse/Lever/Ashby/RemoteOK APIs",
      proofInRepo: "RevenueRoles (4 ATS sources), GTM-Strato (5-page SSRF-guarded extractor), Relationship Intelligence Engine (YC + GitHub signals)",
      evidenceStatus: "shipped",
    },
    {
      domain: "Entity resolution & deduplication",
      engineeringFocus: "Cross-source record merging, domain/name normalization, collision detection without silent overwrites",
      toolsAndStack: "PostgreSQL, PGlite, SQLite, TypeScript, Python",
      proofInRepo: "AIworks Leads (lead_id collision & duplicate_previous_run checks), SpiderWeb (2-stage CSV detection & person/company dedup), RevenueRoles",
      evidenceStatus: "shipped",
    },
    {
      domain: "Field provenance & lead qualification",
      engineeringFocus: "Per-field source URLs, 5-state verification envelopes, direct-phone vs switchboard validation",
      toolsAndStack: "Python (zero-dep rules), TypeScript, Pydantic, Zod, SQLite",
      proofInRepo: "Relationship Intelligence Engine (verified/inferred/unverified/conflicting/missing), AIworks Lead Pipeline (accepted vs research_only vs rejections)",
      evidenceStatus: "shipped",
    },
    {
      domain: "Explainable ICP & account scoring",
      engineeringFocus: "Deterministic 0–100 rubrics with inspectable component weights and zero LLM score hallucination",
      toolsAndStack: "Python, FastAPI, Streamlit, SQLAlchemy, pytest",
      proofInRepo: "GTM-Strato (Evidence 30%, Problem Fit 25%, Triggers 15%, Reachability 15%, Clarity 15%), Revenue Intelligence Engine (100-pt rubric)",
      evidenceStatus: "shipped",
    },
    {
      domain: "Prospecting filter & enrichment orchestration",
      engineeringFocus: "Generating platform-ready search filters, waterfall design, provider adapters, credit & rate-limit control",
      toolsAndStack: "Clay, Apollo.io, LinkedIn Sales Navigator, HTTP API columns, MockEnrichmentProvider",
      proofInRepo: "GTM-Strato (generates Apollo, Sales Nav, and Clay filter payloads); Apollo product used; live Clay/Apollo API wiring in active study",
      evidenceStatus: "used",
    },
    {
      domain: "Bounded AI agents & account research",
      engineeringFocus: "Fact-vs-hypothesis separation, temperature-0 JSON synthesis, deterministic fallbacks, local RAG",
      toolsAndStack: "NVIDIA Build API, OpenAI-compatible APIs, Ollama, ChromaDB, pgvector, MCP",
      proofInRepo: "GTM-Strato ([Website fact] vs [Hypothesis]), Revenue Intelligence Engine, MailU (local Gmail RAG), this site's dual MCP servers",
      evidenceStatus: "shipped",
    },
    {
      domain: "CRM sync, governance & human approval gates",
      engineeringFocus: "Approval queues before export, idempotent upserts, object associations, lifecycle conflict guards",
      toolsAndStack: "HubSpot CRM API, FastAPI, Next.js, SQLite/Postgres audit logs, CSV/JSON/XLSX exporters",
      proofInRepo: "Revenue Intelligence Engine (human approval queue + run_id logs), REVFLOW workbench (/pow/revops-engineering); HubSpot API in active study",
      evidenceStatus: "studying",
    },
  ],
  agentWorkflows: [
    {
      name: "Fact-grounded ICP & persona discovery agent",
      roleOfModel:
        "Reads up to 5 delimited public web pages via NVIDIA Build API and proposes company profile fields, 3 ICP segments, buyer personas, and Apollo / Sales Navigator / Clay search filters.",
      deterministicGuardrail:
        "SSRF/DNS validation blocks private/loopback IPs; pricing is forced to 'Not found' if no pricing text was extracted; 0–100 fit score is computed locally in Python, never by the model.",
      humanGate:
        "Every field is labeled [Website fact] (with cited URL), [Hypothesis], or [Not found] so an operator verifies hypotheses before launching a campaign.",
      implementedIn: "GTM-Strato (ICP Finder), 48 pytest tests",
      href: "https://github.com/ayushrai-hub/GTM-Strato",
    },
    {
      name: "Account research & qualification pipeline agent",
      roleOfModel:
        "Synthesizes structured GTM problem, why-now trigger, and outreach angle at temperature 0 for top-ranked accounts, with a deterministic template fallback when no API key is present.",
      deterministicGuardrail:
        "100-point account ranking runs before the model is called; required JSON schema fields are validated; idempotent upserts prevent duplicate run artifacts.",
      humanGate:
        "Researched accounts enter a human approval queue; only approved records can be exported to CRM-ready CSV, JSON, or XLSX.",
      implementedIn: "Revenue Intelligence Engine, 40 pytest tests",
      href: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE",
    },
    {
      name: "Deterministic agent controller & tool-boundary lab (ORBIT)",
      roleOfModel:
        "Demonstrates how an agent plan is separated from state transitions: read tools execute against a typed registry while high-impact writes require explicit controller transition and read-back verification.",
      deterministicGuardrail:
        "Zod-validated tool inputs, retry budgets, 8 scripted failure modes (hallucinated tool, schema mismatch, rate limit, partial write), and post-write store verification.",
      humanGate:
        "Proposed -> Approved -> Executed -> Verified state machine; rejecting a proposal blocks the write, and approving still checks the store row.",
      implementedIn: "Agentic AI POW (/pow/agentic-ai), 13 Vitest tests",
      href: "/pow/agentic-ai",
    },
    {
      name: "Stateless MCP portfolio & documentation servers",
      roleOfModel:
        "Exposes structured read-only tools (list_projects, get_project, compare_projects, search_portfolio, list_pages, get_page, search_docs) over Streamable HTTP and stdio to external AI agents.",
      deterministicGuardrail:
        "JSON-RPC -32602 schema validation, 60 req/60s draft-11 RateLimit headers, lexical ranking without hallucinated summaries, and SEP-2127 Server Cards.",
      humanGate:
        "Strictly read-only public data from src/content/; zero write tools exposed to external agents.",
      implementedIn: "ayushrai.site (/api/mcp & /api/mcp/docs)",
      href: "/developers",
    },
  ],
  walkthrough: {
    plannedTopics: [
      "RevenueRoles: one posting from source to published listing.",
      "GTM-Strato & Revenue Intelligence Engine: an ICP run, fact-vs-hypothesis grounding, the 100-point score breakdown, and the approval queue.",
      "Where each project sits in the data, orchestration, execution, and agent layers.",
    ],
  },
  proofs: [
    {
      slug: "revenueroles",
      kind: "product",
      evidence: "live",
      blurb:
        "Pulls Greenhouse, Lever, Ashby, and RemoteOK postings and classifies technical revenue roles by the work in the description.",
      stack: ["Next.js", "FastAPI", "Supabase Postgres", "pgvector", "Inngest", "Vercel"],
      problem:
        "Technical revenue roles (GTM Engineer, RevOps Engineer, Forward Deployed Engineer) are buried across employer ATS boards under inconsistent titles, forcing candidates and analysts to read every description.",
      solution:
        "Ingests postings directly from Greenhouse, Lever, Ashby, and RemoteOK, normalizes them into one schema, classifies each role by the actual work and stack described, and deduplicates conservatively.",
      architectureNote:
        "Next.js web and API apps + Inngest scheduled discovery jobs + Python FastAPI classification worker + Supabase Postgres with pgvector and row-level security.",
      verifiableMetrics: [
        "4 ATS/job connectors (Greenhouse, Lever, Ashby, RemoteOK) with recorded fixture tests",
        "71 verified roles and 58% compensation coverage on the live homepage snapshot (checked 2026-10-18)",
        "45 Python pytest tests + 294 TypeScript test cases in the repository",
      ],
      shows: [
        "Data layer: ingestion from four job sources into one schema.",
        "Entity resolution: deduplicating the same posting across sources.",
        "Classification by the work described, not the title.",
        "Signal freshness: scheduled re-discovery through Inngest.",
      ],
      limits: [
        "Listing freshness and salary extraction still need checks (units, ranges).",
        "Several signed-in features are not verified in production.",
        "No user or revenue numbers exist yet.",
      ],
    },
    {
      slug: "gtm-strato",
      kind: "project",
      evidence: "local",
      blurb:
        "Reads a company site, keeps facts separate from guesses, scores fit in Python, and writes Apollo, Sales Navigator, and Clay filters.",
      problem:
        "LLM-generated ICPs usually mix real website facts with model guesses and invent arbitrary fit scores that GTM teams cannot audit or translate into prospecting filters.",
      solution:
        "Extracts up to five public pages from a company URL with SSRF and DNS guards, labels every extracted field as a cited Website fact, Hypothesis, or Not found, computes a deterministic 0–100 fit score, and outputs ready-to-use filters for Apollo.io, LinkedIn Sales Navigator, and Clay.",
      architectureNote:
        "Python 3.11 + Streamlit UI + SSRF-hardened HTTP extractor (`website_extractor.py`) + NVIDIA Build API client (`nvidia_client.py`) + 5-component local scoring engine (`scoring_engine.py`) + SQLite persistence (`data/icp_finder.sqlite`).",
      verifiableMetrics: [
        "48 automated pytest tests across grounding, scoring, SSRF security, database, and UI",
        "5-component deterministic fit rubric: Evidence (30%), Problem Fit (25%), Buying Triggers (15%), Reachability (15%), Commercial Clarity (15%)",
        "3 platform filter generators (Apollo.io, LinkedIn Sales Navigator, Clay) per run",
      ],
      shows: [
        "Fact-vs-hypothesis grounding: every company profile field is labeled Website fact (with cited URL), Hypothesis, or Not found; pricing is forced to Not found when no pricing text was extracted.",
        "Deterministic local 0–100 fit scoring across five weighted components, never produced by an LLM prompt.",
        "Actionable GTM output: generates platform-specific prospecting filters for Apollo.io, LinkedIn Sales Navigator, and Clay.",
        "Security discipline: blocks private, loopback, link-local, and reserved IPs on every DNS hop, ignores system proxies, respects robots.txt, and never executes page JavaScript.",
      ],
      limits: [
        "Runs locally with Streamlit and SQLite; requires a user-supplied NVIDIA_API_KEY for live inference.",
        "Does not render client-side JavaScript SPAs and is a discovery starting point, not verified market research.",
      ],
    },
    {
      slug: "revenue-intelligence-engine",
      kind: "project",
      evidence: "synthetic",
      blurb:
        "Scores accounts on a 100-point rubric, drafts the research, and holds the export until a person approves it.",
      problem:
        "Revenue teams either research and score accounts manually in spreadsheets or let an unconstrained LLM assign opaque scores and push unreviewed copy toward outreach.",
      solution:
        "Runs a staged GTM pipeline over a 42-company synthetic universe: normalizes and deduplicates records, detects five buying-signal types, scores fit on a transparent 100-point rubric, runs temperature-0 account research with a deterministic fallback, and holds export behind a human approval queue.",
      architectureNote:
        "Python FastAPI service (`app/workflows/revenue_intelligence.py`) + SQLAlchemy models + deterministic scorer + temperature-0 LLM research adapter + Next.js 6-stage operator console.",
      verifiableMetrics: [
        "42 synthetic companies scored across a 6-component 100-point deterministic rubric",
        "40 automated pytest tests covering ingestion, scoring, research fallback, and approval gating",
        "6 operator console stages with committed repository screenshots and run_id audit logs",
      ],
      shows: [
        "ICP-driven account scoring on a transparent 100-point rubric. The score is never produced by an LLM.",
        "Buying-signal detection: hiring, funding, expansion, product launch, technology adoption.",
        "LLM account research at temperature 0 with labeled claims, and a deterministic fallback when no key is set.",
        "A human approval gate between research and any CRM-ready export.",
        "Run IDs, stage logs, and idempotent upserts on re-runs.",
      ],
      limits: [
        "All companies, contacts, and signals are fictional, and enrichment is a mock provider.",
        "No Clay, Apollo, or CRM integration. No outbound, real leads, users, or revenue.",
      ],
    },
    {
      slug: "relationship-intelligence-engine",
      kind: "project",
      evidence: "local",
      blurb:
        "Finds technical founders and hiring signals from public sources and stores a verification state on every field.",
      problem:
        "Public-source prospect scrapers overwrite fields without recording provenance, making it impossible to tell whether a founder's role or hiring signal was verified, inferred, or conflicting.",
      solution:
        "Ten-stage TypeScript pipeline that discovers technical founders and companies hiring AI/ML engineers from the YC directory, GitHub signals, and accelerator portfolios, wrapping every field in a provenance envelope with an explicit verification state.",
      architectureNote:
        "TypeScript CLI + Node.js pipeline + PGlite / PostgreSQL storage + Playwright collectors + XLSX/CSV/JSON exporters + local inspection dashboard.",
      verifiableMetrics: [
        "10 pipeline stages: discovery, normalization, entity resolution, enrichment, verification, signal detection, scoring, deduplication, export, refresh",
        "5 explicit field verification states: verified, inferred, unverified, conflicting, missing",
        "34 automated Vitest test cases in the repository",
      ],
      shows: [
        "Account and people discovery from public sources: the YC directory, GitHub signals, accelerator portfolios.",
        "A staged pipeline: discovery, normalization, entity resolution, enrichment, verification, signal detection, scoring, deduplication, export, refresh.",
        "Provenance on every important field (value, source, URL, time, confidence) and an explicit status: verified, inferred, unverified, conflicting, or missing. Unknown values stay empty.",
      ],
      limits: [
        "A personal research tool, not a lead factory.",
        "No paid enrichment vendors are wired in.",
        "Audit figures in the repository are its own notes and have not been re-run.",
      ],
    },
    {
      slug: "aiworks-leads",
      kind: "project",
      evidence: "local",
      blurb:
        "Qualifies a lead sheet in code: a source URL on each required field, a direct phone distinct from the switchboard, and no repeat from an earlier run.",
      problem:
        "Researched B2B lead sheets frequently mix company switchboards with direct phones, lack source URLs, violate geography or seniority rules, and re-import leads already delivered in prior batches.",
      solution:
        "Zero-dependency Python CLI and SQLite observation store that validates every row against strict qualification rules, requires a public source URL per mandatory field, separates incomplete high-fit prospects into `research_only.csv`, and blocks cross-run duplicates.",
      architectureNote:
        "Python 3.9+ standard-library package (`aiworks_leads`) + deterministic rule validator (`rules.py`) + SQLite store with automatic pre-run backups (`store.py`) + immutable timestamped run exporter (`export.py`).",
      verifiableMetrics: [
        "0 external runtime dependencies (pure Python standard library + SQLite3)",
        "3 deterministic output buckets per run: accepted_leads.csv, research_only.csv, rejections.csv + JSON/text run reports",
        "6 end-to-end unittest suites on synthetic example.* fixtures verifying dedup, identity collisions, and upgrade paths",
      ],
      shows: [
        "Strict field-level provenance enforcement: name, senior role, tech industry, non-India geography, domain-matched corporate email, and direct business phone each require a public `*_source_url`.",
        "Phone hygiene: distinguishes `direct_business` and `mobile_business` from `company_switchboard` and refuses any direct number identical to the switchboard.",
        "Cross-run state & identity collision safety: tracks `lead_id` (normalized name + company domain) in SQLite, rejects prior deliveries, flags same-name/different-email collisions for manual review without merging, and backs up the database before every run.",
      ],
      limits: [
        "Enforces provenance and formatting rules on researched CSVs; does not crawl source URLs or ping SMTP servers.",
        "Local CLI workflow with synthetic test fixtures; no direct CRM push.",
      ],
    },
    {
      slug: "spiderweb",
      kind: "project",
      evidence: "local",
      blurb:
        "Turns a personal LinkedIn export into a local graph of people, companies, and the rule that surfaced each path.",
      problem:
        "LinkedIn data exports are a pile of inconsistent CSVs that bury relationship history, shared companies, and warm-intro paths.",
      solution:
        "Ingests a personal LinkedIn archive through two-stage file detection, resolves person and company entities with per-file audit counts, and surfaces rule-based relationship signals in a local graph UI.",
      architectureNote:
        "TypeScript + Next.js local app + PostgreSQL + optional Redis-backed ingestion worker + Docker Compose.",
      verifiableMetrics: [
        "2-stage CSV detector (filename match followed by column-signature fallback)",
        "4 per-file audit counters on every import: imported, updated, deduplicated, rejected",
      ],
      shows: [
        "Two-stage file detection (filename, then column signature) for messy exports.",
        "Person and company resolution with per-file import, update, dedup, and reject counts.",
        "Rule-based relationship signals that state why each person surfaced.",
      ],
      limits: [
        "Works only on your own LinkedIn export. No production deployment.",
      ],
    },
    {
      slug: "mailu",
      kind: "project",
      evidence: "local",
      blurb:
        "Syncs one mailbox, categorizes it, and answers questions with a local model.",
      problem:
        "High-volume inbox history is hard to search by intent or relationship context without shipping private correspondence to a hosted third-party model.",
      solution:
        "Syncs a mailbox via the Gmail API, runs zero-shot categorization, indexes embeddings in ChromaDB, and serves local RAG Q&A through Ollama.",
      architectureNote:
        "Python + FastAPI + Gmail API OAuth sync + ChromaDB vector store + local Ollama inference.",
      verifiableMetrics: [
        "Local-first RAG pipeline: Gmail API sync -> zero-shot categorization -> ChromaDB -> Ollama chat",
      ],
      shows: [
        "Email data handling: Gmail API sync, parsing, and storage.",
        "Zero-shot categorization, semantic search, and RAG chat on a local model.",
      ],
      limits: [
        "A local tool for one mailbox. The repository's test summary has not been re-run.",
      ],
    },
  ],
  layers: [
    {
      name: "Data",
      description: "Discover, collect, enrich, validate, and organize company, contact, and signal records.",
      built: [
        "RevenueRoles ingestion, normalization, and deduplication across Greenhouse, Lever, Ashby, and RemoteOK.",
        "SSRF-hardened website extraction and fact-vs-hypothesis separation in GTM-Strato (ICP Finder).",
        "Field-level provenance and 5-state verification status in the Relationship Intelligence Engine.",
        "Mandatory source-URL and direct-phone verification in the AIworks Lead Qualification Pipeline.",
        "Person and company resolution in SpiderWeb.",
      ],
      gap: "No paid enrichment provider (Apollo, Clay) is wired into a live backend yet.",
    },
    {
      name: "Orchestration",
      description: "Coordinate workflows, apply business rules, manage dependencies, and decide what happens next.",
      built: [
        "Inngest scheduled discovery with concurrency locks in RevenueRoles.",
        "A staged pipeline with run IDs and idempotent upserts in the Revenue Intelligence Engine.",
        "Immutable timestamped run folders and automatic pre-run SQLite backups in the AIworks Lead Pipeline.",
        "An optional Redis-backed ingestion worker in SpiderWeb.",
      ],
      gap: "No CRM-triggered or webhook-driven production workflows yet.",
    },
    {
      name: "Execution",
      description: "Update CRM records, create tasks, trigger approved outreach, notify reps.",
      built: [
        "Platform prospecting filter generation for Apollo.io, LinkedIn Sales Navigator, and Clay in GTM-Strato.",
        "CSV, JSON, and XLSX exports, gated by an approval queue in the Revenue Intelligence Engine.",
        "Tri-bucket qualification exports (accepted_leads.csv, research_only.csv, rejections.csv) in AIworks Leads.",
      ],
      gap: "No live CRM writes, no outbound sending, and no deliverability infrastructure.",
    },
    {
      name: "Agents",
      description: "Use LLMs and tools for contextual research, unstructured data, and bounded decisions.",
      built: [
        "NVIDIA Build API company & ICP analyzer in GTM-Strato with [Website fact] vs [Hypothesis] grounding.",
        "LLM account research at temperature 0 with labeled claims and a deterministic fallback in the Revenue Intelligence Engine.",
        "RAG over a mailbox in MailU, plus deterministic agent control simulation in ORBIT (/pow/agentic-ai).",
        "Evaluation discipline from contract evaluation work: judging model output against explicit rubrics.",
      ],
      gap: "No autonomous outbound agent operating on live customer pipeline.",
    },
    {
      name: "Revenue operations",
      description: "ICP definition, qualification, pipeline metrics, and the people who use the system.",
      built: [
        "Deterministic 100-point ICP and account scoring rubrics in GTM-Strato and the Revenue Intelligence Engine.",
        "Strict B2B lead acceptance and identity-collision rules in AIworks Leads.",
        "Interactive funnel, routing, and CRM sync simulation in REVFLOW (/pow/revops-engineering).",
      ],
      gap: "No live HubSpot or Salesforce production administration, and no pipeline metrics from commercial use.",
    },
  ],
  toolkit: [
    {
      heading: "Languages and frameworks",
      items: [
        { name: "Python", level: "shipped", note: "FastAPI services, Streamlit workbenches, zero-dep CLIs, and pytest/unittest suites (GTM-Strato, Revenue Intelligence Engine, AIworks Leads, MailU, RevenueRoles worker)." },
        { name: "TypeScript", level: "shipped", note: "Next.js apps, CLIs, MCP servers, and pipelines (RevenueRoles, Relationship Intelligence Engine, SpiderWeb, this site)." },
        { name: "Next.js and React", level: "shipped", note: "The RevenueRoles web app, the Revenue Intelligence Engine console, and the ORBIT / REVFLOW workbenches." },
        { name: "FastAPI and Streamlit", level: "shipped", note: "The Revenue Intelligence Engine API, the RevenueRoles classification worker, and the GTM-Strato ICP Finder UI." },
      ],
    },
    {
      heading: "Data and storage",
      items: [
        { name: "PostgreSQL and SQL", level: "shipped", note: "Supabase with pgvector and row-level security in RevenueRoles. PGlite or Postgres in the Relationship Intelligence Engine." },
        { name: "SQLite and SQLAlchemy", level: "shipped", note: "Run persistence in GTM-Strato, backed-up lead observation store in AIworks Leads, and SQLAlchemy models in Revenue Intelligence Engine." },
        { name: "Vector stores", level: "shipped", note: "pgvector in RevenueRoles, ChromaDB in MailU." },
        { name: "Entity resolution and deduplication", level: "shipped", note: "Across ATS job sources, public company data, researched lead batches, and LinkedIn exports." },
      ],
    },
    {
      heading: "Orchestration and automation",
      items: [
        { name: "Inngest", level: "shipped", note: "Scheduled discovery jobs and concurrency control in RevenueRoles." },
        { name: "Queues and workers", level: "shipped", note: "Redis-backed ingestion worker in SpiderWeb; resume and classification queues in RevenueRoles." },
        { name: "n8n, Make, Zapier", level: "used", note: "Familiar with the platforms and webhook patterns. No public repository uses them yet." },
      ],
    },
    {
      heading: "AI and autonomous agents",
      items: [
        { name: "Structured LLM output & grounding", level: "shipped", note: "Fact-vs-hypothesis separation via NVIDIA Build in GTM-Strato; temperature-0 JSON account research with deterministic fallback in Revenue Intelligence Engine." },
        { name: "Model Context Protocol (MCP) & tool schemas", level: "shipped", note: "Two stateless Streamable HTTP MCP servers (/api/mcp and /api/mcp/docs) plus the ORBIT deterministic tool-registry controller." },
        { name: "RAG and embeddings", level: "shipped", note: "MailU on a local model through Ollama and ChromaDB." },
        { name: "LLM evaluation and RLHF rubrics", level: "used", note: "SDE, AI Engineer at FoCDoT, and contract evaluation through Outlier. Task materials stay confidential." },
      ],
    },
    {
      heading: "GTM platforms",
      items: [
        { name: "Apollo.io", level: "used", note: "Used as a product; GTM-Strato generates Apollo prospecting filter definitions. Direct REST enrichment API is not wired into a repo yet." },
        { name: "Clay", level: "studying", note: "GTM-Strato generates Clay filter definitions; actively studying waterfalls, HTTP API columns, and where Clay hands off to a custom backend." },
        { name: "HubSpot", level: "studying", note: "CRM object model, associations, and idempotent create-or-update through the v3 API." },
      ],
    },
    {
      heading: "Testing and delivery",
      items: [
        { name: "pytest, unittest, Vitest, Playwright", level: "shipped", note: "48 pytest tests in GTM-Strato, 40 in Revenue Intelligence Engine, 45 pytest + 294 TS tests in RevenueRoles, 34 in Relationship Intelligence Engine, 242+ Vitest tests on this site." },
        { name: "Vercel, Netlify, Docker", level: "shipped", note: "RevenueRoles and Revenue Intelligence Engine on Vercel; this site on Vercel and Netlify; Docker Compose for local Postgres and Redis." },
      ],
    },
    {
      heading: "GTM engineering practices",
      items: [
        { name: "Provenance and verification status per field", level: "shipped", note: "Relationship Intelligence Engine (5 states), GTM-Strato (Website fact vs Hypothesis), and AIworks Leads (mandatory source URLs)." },
        { name: "Explainable, deterministic 100-point scoring", level: "shipped", note: "GTM-Strato (5 weighted components) and Revenue Intelligence Engine (6 weighted components)." },
        { name: "Human approval gates before export", level: "shipped", note: "Revenue Intelligence Engine approval queue and ORBIT / REVFLOW control gates." },
        { name: "SSRF-safe & rate-limited public collection", level: "shipped", note: "DNS/IP validation in GTM-Strato and rate-limited public collectors in Relationship Intelligence Engine." },
      ],
    },
  ],
  studying: {
    intro:
      "I study how B2B companies build and operate production revenue systems: how they discover accounts, design cost-controlled enrichment waterfalls, verify contact data, read buying signals, qualify leads, sync with a CRM without creating duplicates, and keep a human in the loop. I read primary API documentation, inspect request/response contracts, and build against them.",
    topics: [
      {
        topic: "Clay",
        questions: [
          "How does a data waterfall choose providers, handle missing values, and control enrichment cost?",
          "Which steps belong in Clay, which in a custom backend, which in the CRM, and which need a human?",
          "How do HTTP API columns connect Clay to my own services?",
        ],
      },
      {
        topic: "Apollo API",
        questions: [
          "What is the difference between finding a person, enriching a record, and verifying it?",
          "How do credits and rate limits shape batching, retries, and pipeline design?",
        ],
      },
      {
        topic: "HubSpot CRM API",
        questions: [
          "How do contacts, companies, and deals relate through associations?",
          "How do unique identifiers and create-or-update calls prevent duplicate records?",
          "How should sync conflicts between an enrichment source and the system of record be resolved?",
        ],
      },
      {
        topic: "Workflow orchestration",
        questions: [
          "When are n8n, Make, or Zapier enough for production, and when is a queue, database, and event-driven backend the better choice?",
          "How do triggers, webhooks, retries, idempotency, and human approval steps fit together reliably?",
        ],
      },
      {
        topic: "Commercial metrics",
        questions: [
          "How are pipeline generated, enrichment coverage, reply rate, meetings booked, and cost per qualified lead measured?",
          "How do you decide whether an automation is worth building?",
        ],
      },
      {
        topic: "Compliance and deliverability",
        questions: [
          "What do CAN-SPAM and Google's sender guidelines require: authentication, unsubscribe handling, and spam-rate limits?",
          "How should consent, suppression lists, and sender reputation shape an outbound system?",
        ],
      },
    ],
  },
  lessonsLearned: [
    {
      title: "Force missing commercial facts to 'Not found' before scoring",
      detail:
        "In GTM-Strato, language models routinely guessed pricing tiers when a company's public pages had no pricing table. Adding a deterministic check in `website_extractor.py` and `ai_analyzer.py` that forces pricing to 'Not found' whenever no pricing tokens were extracted removed those fabricated claims and made the Commercial Clarity score component honest.",
      sourceSlug: "gtm-strato",
    },
    {
      title: "Separate `research_only` from `rejections` in lead pipelines",
      detail:
        "In the AIworks Lead Qualification Pipeline, early rules treated a senior VP missing a direct phone the same as an out-of-scope industry row. Splitting the output into `accepted_leads.csv`, `research_only.csv`, and `rejections.csv` meant high-fit accounts with one missing source URL were queued for targeted enrichment rather than discarded.",
      sourceSlug: "aiworks-leads",
    },
    {
      title: "Never let deduplication drop the working action link",
      detail:
        "In RevenueRoles, the same job appears on an employer's Greenhouse board and on aggregators like RemoteOK. Merging records by normalized company + title only works if the canonical employer apply URL is treated as a protected field that an aggregator row cannot overwrite.",
      sourceSlug: "revenueroles",
    },
    {
      title: "Keep the 100-point rubric out of the prompt",
      detail:
        "In both the Revenue Intelligence Engine and GTM-Strato, moving the 0–100 score calculation into pure Python functions made every ranking diffable in pytest and let operators see the exact point contribution of each signal.",
      sourceSlug: "revenue-intelligence-engine",
    },
  ],
  resources: {
    note: "Mostly vendor documentation. Customer results in vendor blogs are vendor-reported, not audited.",
    groups: [
      {
        heading: "How GTM engineering teams work",
        items: [
          {
            label: "Clay: the building blocks of a GTM engineering system",
            href: "https://www.clay.com/blog/gtm-infrastructure",
            note: "The four layers: data, orchestration, execution, agents.",
            completedOn: "2026-10-18",
          },
          {
            label: "Clay: how we built a GTM engineering function",
            href: "https://www.clay.com/blog/how-we-built-gtm-engineering-function",
            completedOn: "2026-10-18",
          },
          {
            label: "Clay: inside Clay's GTM engineering lab",
            href: "https://www.clay.com/blog/inside-clays-gtm-engineering-lab",
            note: "Skimmed.",
            completedOn: "2026-10-18",
          },
          {
            label: "Clay: GTM engineering guide",
            href: "https://www.clay.com/blog/gtm-engineering",
            note: "Skimmed.",
            completedOn: "2026-10-18",
          },
        ],
      },
      {
        heading: "Clay mechanics",
        items: [
          { label: "Clay University documentation", href: "https://university.clay.com/docs" },
          { label: "Clay: waterfalls", href: "https://university.clay.com/docs/building-a-data-waterfall" },
          { label: "Clay: HTTP API integration", href: "https://university.clay.com/docs/http-api-integration-overview" },
        ],
      },
      {
        heading: "Data providers and CRM",
        items: [
          { label: "Apollo developer docs", href: "https://docs.apollo.io/" },
          { label: "Apollo: people enrichment", href: "https://docs.apollo.io/reference/people-enrichment" },
          { label: "Apollo: rate limits", href: "https://docs.apollo.io/reference/rate-limits" },
          { label: "HubSpot API reference overview", href: "https://developers.hubspot.com/docs/api-reference/latest/overview" },
        ],
      },
      {
        heading: "Compliance",
        items: [
          {
            label: "FTC: CAN-SPAM Act compliance guide for business",
            href: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business",
          },
          { label: "Google: email sender guidelines", href: "https://support.google.com/mail/answer/81126" },
        ],
      },
    ],
  },
  nextBuilds: [
    "Add a real Apollo enrichment provider to the Revenue Intelligence Engine behind its existing provider interface, with rate-limit handling and credit accounting. Synthetic mode stays the default.",
    "Push approved accounts from the Revenue Intelligence Engine and AIworks Lead Pipeline to a HubSpot developer sandbox as companies and contacts with associations, keyed on domain so re-runs update instead of duplicating.",
    "Call the GTM-Strato and Revenue Intelligence scoring endpoints from a Clay table through an HTTP API column, and compare enrichment coverage and cost per provider in a small waterfall.",
    "Write an architecture note for each flagship: why it is designed this way, what failed, what it costs to run, and how I know it works.",
    "Build an autonomous personal agentic system for GTM operations. Agents run routine research, enrichment, scoring, and follow-up preparation on their own, and a person approves anything that leaves the system. It improves over time from logged outcomes, new data, and evaluation evidence. Design goal: run at a fraction of the cost of sending every step to a hosted frontier model, by routing routine steps to smaller or local models and measuring cost per task.",
    "Record the Loom walkthrough and embed it on this page.",
  ],
};

/** Proof records resolved against products.ts and projects.ts. A slug with no record is dropped. */
export function gtmProofs(): Array<
  GtmProof & {
    title: string;
    summary: string;
    stack: string[];
    href: string;
    demoUrl?: string;
    githubUrl?: string;
  }
> {
  return gtmPortfolio.proofs.flatMap((proof) => {
    if (proof.kind === "product") {
      const product = getProductBySlug(proof.slug);
      if (!product) return [];
      return [
        {
          ...proof,
          title: product.title,
          summary: product.summary,
          stack: proof.stack ?? [],
          href: `/products/${product.slug}`,
          demoUrl: product.demoUrl,
          githubUrl: product.githubUrl,
        },
      ];
    }
    const project = getProjectBySlug(proof.slug);
    if (!project) return [];
    return [
      {
        ...proof,
        title: project.title,
        summary: project.summary,
        stack: project.technologies,
        href: project.relatedWorkSlug ? `/work/${project.relatedWorkSlug}` : `/projects#${project.slug}`,
        demoUrl: project.links?.demo,
        githubUrl: project.links?.github,
      },
    ];
  });
}

/** How many listed resources have a `completedOn` date, out of all listed resources. */
export function gtmReadingProgress(): { read: number; total: number } {
  const items = gtmPortfolio.resources.groups.flatMap((group) => group.items);
  return { read: items.filter((item) => item.completedOn).length, total: items.length };
}

/** Loom share URL to its embed URL (`/share/` becomes `/embed/`); other URLs pass through. */
export function loomEmbedUrl(url: string): string {
  return url.replace("loom.com/share/", "loom.com/embed/");
}

/** Converts a Loom, YouTube (watch/short/shorts/embed), or Vimeo URL into an iframe-safe embed URL. */
export function videoEmbedUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.includes("loom.com/share/")) {
    return loomEmbedUrl(trimmed);
  }
  const ytWatch = trimmed.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/,
  );
  if (ytWatch?.[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytWatch[1]}`;
  }
  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo?.[1]) {
    return `https://player.vimeo.com/video/${vimeo[1]}`;
  }
  return loomEmbedUrl(trimmed);
}

/** Markdown body for /gtm.md, built from `gtmPortfolio` and the resolved proofs. */
export function renderGtmBody(): string {
  const {
    vision,
    skillStack,
    agentMotions,
    capabilityMatrix,
    agentWorkflows,
    walkthrough,
    layers,
    toolkit,
    studying,
    lessonsLearned,
    resources,
    nextBuilds,
  } = gtmPortfolio;
  const video = walkthrough.loomUrl
    ? `Loom walkthrough: ${walkthrough.loomUrl}`
    : `Not recorded yet. It will cover:\n\n${walkthrough.plannedTopics.map((t) => `- ${t}`).join("\n")}`;
  const evidenceKey = (Object.keys(gtmEvidenceLabels) as GtmEvidence[])
    .map((key) => `- ${gtmEvidenceLabels[key].label}: ${gtmEvidenceLabels[key].meaning}`)
    .join("\n");
  const visionText = [
    ...vision.paragraphs,
    "",
    ...vision.pillars.map(
      (p) => `### ${p.title}\n\n${p.statement}\n\nProof: ${p.implementationDetail}`,
    ),
  ].join("\n\n");
  const skillTable = [
    "| Domain | Scope | Tools |",
    "| --- | --- | --- |",
    ...skillStack.map((row) => `| ${row.domain} | ${row.scope} | ${row.tools} |`),
  ].join("\n");
  const systemTable = [
    "| System | What it does | Stage | Links |",
    "| --- | --- | --- | --- |",
    ...gtmProofs().map((proof) => {
      const links = [
        `[On this site](${proof.href})`,
        proof.githubUrl && `[GitHub](${proof.githubUrl})`,
        proof.demoUrl && `[Live](${proof.demoUrl})`,
      ]
        .filter(Boolean)
        .join(", ");
      return `| ${proof.title} | ${proof.blurb} | ${gtmEvidenceLabels[proof.evidence].label} | ${links} |`;
    }),
  ].join("\n");
  const motionTable = [
    "| Motion | Autonomous step | Control | System |",
    "| --- | --- | --- | --- |",
    ...agentMotions.map(
      (row) => `| ${row.motion} | ${row.autonomous} | ${row.control} | [${row.system}](${row.href}) |`,
    ),
  ].join("\n");
  const capabilityTable = [
    "| Capability domain | Engineering focus | Tools & stack | Repository proof | Status |",
    "| --- | --- | --- | --- | --- |",
    ...capabilityMatrix.map(
      (row) =>
        `| ${row.domain} | ${row.engineeringFocus} | ${row.toolsAndStack} | ${row.proofInRepo} | ${gtmSkillLevelLabels[row.evidenceStatus]} |`,
    ),
  ].join("\n");
  const proofs = gtmProofs()
    .map((proof) => {
      const links = [
        proof.demoUrl && `Live: ${proof.demoUrl}`,
        proof.githubUrl && `GitHub: ${proof.githubUrl}`,
        `On this site: ${proof.href}`,
      ]
        .filter(Boolean)
        .join(" · ");
      return [
        `### ${proof.title} (${proof.kind}, ${gtmEvidenceLabels[proof.evidence].label})`,
        "",
        proof.summary,
        proof.problem ? `\nProblem: ${proof.problem}` : "",
        proof.solution ? `\nSolution: ${proof.solution}` : "",
        proof.architectureNote ? `\nArchitecture: ${proof.architectureNote}` : "",
        "",
        proof.stack.length ? `Stack: ${proof.stack.join(", ")}` : "",
        links,
        proof.verifiableMetrics?.length
          ? `\nVerifiable repository metrics:\n\n${proof.verifiableMetrics.map((m) => `- ${m}`).join("\n")}`
          : "",
        "",
        "What it shows:",
        "",
        proof.shows.map((s) => `- ${s}`).join("\n"),
        "",
        "Limits:",
        "",
        proof.limits.map((l) => `- ${l}`).join("\n"),
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
  const agentsText = agentWorkflows
    .map(
      (wf) =>
        `### ${wf.name}\n\n- Model role: ${wf.roleOfModel}\n- Deterministic guardrail: ${wf.deterministicGuardrail}\n- Human approval gate: ${wf.humanGate}\n- Implemented in: ${wf.implementedIn} (${wf.href})`,
    )
    .join("\n\n");
  const layerRows = layers
    .map(
      (layer) =>
        `### ${layer.name}\n\n${layer.description}\n\nBuilt:\n\n${layer.built.map((b) => `- ${b}`).join("\n")}\n\nGap: ${layer.gap}`,
    )
    .join("\n\n");
  const skills = toolkit
    .map(
      (group) =>
        `### ${group.heading}\n\n${group.items
          .map((item) => `- **${item.name}** (${gtmSkillLevelLabels[item.level]}): ${item.note}`)
          .join("\n")}`,
    )
    .join("\n\n");
  const topics = studying.topics
    .map((topic) => `### ${topic.topic}\n\n${topic.questions.map((q) => `- ${q}`).join("\n")}`)
    .join("\n\n");
  const lessonsText = lessonsLearned
    .map((l) => `### ${l.title}\n\n${l.detail}`)
    .join("\n\n");
  const reading = resources.groups
    .map(
      (group) =>
        `### ${group.heading}\n\n${group.items
          .map(
            (item) =>
              `- [${item.label}](${item.href})${item.completedOn ? ` (read ${item.completedOn})` : ""}${item.note ? `: ${item.note}` : ""}`,
          )
          .join("\n")}`,
    )
    .join("\n\n");
  return [
    gtmPortfolio.positioning,
    "",
    "## Skill stack",
    "",
    "Eight domains. The systems table is the work you can open.",
    "",
    skillTable,
    "",
    "## GTM systems",
    "",
    systemTable,
    "",
    "## Agentic depth",
    "",
    "What runs on its own, and the control that stays in code.",
    "",
    motionTable,
    "",
    `## ${vision.headline}`,
    "",
    visionText,
    "",
    "## GTM engineering capabilities",
    "",
    capabilityTable,
    "",
    "## Walkthrough video",
    "",
    video,
    "",
    "## How to read the evidence",
    "",
    evidenceKey,
    "",
    "## Product and projects",
    "",
    proofs,
    "",
    "## Autonomous agents and AI-driven revenue workflows",
    "",
    agentsText,
    "",
    "## GTM infrastructure layers: built and missing",
    "",
    layerRows,
    "",
    "## What I already know",
    "",
    skills,
    "",
    "## Experiments and lessons learned",
    "",
    lessonsText,
    "",
    "## What I am studying now",
    "",
    studying.intro,
    "",
    topics,
    "",
    "## Resources I am using",
    "",
    `${gtmReadingProgress().read} of ${gtmReadingProgress().total} read. ${resources.note}`,
    "",
    reading,
    "",
    "## What I will build next",
    "",
    nextBuilds.map((item) => `- ${item}`).join("\n"),
  ].join("\n");
}
