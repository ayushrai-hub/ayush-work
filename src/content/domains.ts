/**
 * Evidence-backed domain dossiers: the pages under `/ai-engineering` (and its
 * subpages), `/software-engineering`, `/gtm-revops`, `/software-services`,
 * `/experience`, and `/open-source`.
 *
 * Each `DomainRecord` holds a page's focus metrics (`stats`), journey (`journey`),
 * skill & capability matrix (`skillsTable`), core domain deep-dives (`coreBenchmarks`
 * with link, what it does, domain, category, and trade-offs), 2–3 scalable proof-of-work
 * solutions (`solutions` with what, how, why, where, for whom, and verified impact),
 * walkthrough video slot (`walkthrough`), agentic discovery paths (`agentAccess`),
 * concise prose sections, evidence links, related links, reading, and named gaps.
 *
 * Prose and structured records live here so HTML, Markdown twins, and lexical search
 * share one source of truth. Gaps stay visible: topics without evidence (for example
 * `/ai-engineering/inference` or `/software-engineering/distributed-systems`) are
 * listed as gaps, not given empty URLs.
 *
 * Connects to:
 * - src/pages/DomainPage.tsx renders each record (routes in src/App.tsx);
 *   HomePage lists `homeDomains()`.
 * - Markdown twins via `renderDomainBody` in src/lib/agent/markdown.ts;
 *   llms.txt "Domains" list; search items of type "domain" (searchIndex.ts).
 * - src/lib/publicRoutes.ts adds every `path` to the sitemap and prerender list.
 */

/** How much of a domain is backed by shipped work. Labels in `evidenceLevelLabels`. */
export type EvidenceLevel = "shipped" | "mixed" | "investigation";

/** A link inside a dossier: site-relative or external. */
export interface DomainLink {
  href: string;
  label: string;
  /** Short qualifier rendered after the label. */
  note?: string;
}

/** One headed prose block in a dossier. */
export interface DomainSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  /** Preformatted flow. Used when a diagram helps and a chart library does not. */
  diagram?: string;
}

/** One verifiable repository, test, or output counter in a domain header. */
export interface DomainStat {
  value: string;
  label: string;
  context: string;
}

/** One row in a domain's structured table of skills. */
export interface DomainSkillRow {
  skill: string;
  category: string;
  tools: string;
  depthAndProof: string;
  tradeoff: string;
  status: "shipped" | "contract" | "local" | "simulation" | "studying";
}

/** Status badge labels for `DomainSkillRow.status`. */
export const domainSkillStatusLabels: Record<DomainSkillRow["status"], string> = {
  shipped: "Live / shipped",
  contract: "Contract work",
  local: "Local repo + tests",
  simulation: "Interactive POW lab",
  studying: "Studying now",
};

/** In-depth core domain artifact, benchmark, or harness row. */
export interface DomainBenchmarkRow {
  name: string;
  href: string;
  whatItDoes: string;
  domain: string;
  category: string;
  metrics: string;
  tradeoff: string;
}

/** One top-notch scalable solution or live POW breakdown (What, How, Why, Where, For Whom, Impact). */
export interface DomainSolution {
  slug: string;
  title: string;
  badge: string;
  visualSlug?: string;
  what: string;
  how: string;
  why: string;
  where: string;
  forWhom: string;
  impact: string;
  tradeoff: string;
  links: DomainLink[];
}

/** Concise journey block: how we started, the grind, and what we achieved. */
export interface DomainJourney {
  started: string;
  grind: string;
  achieved: string;
}

/** Loom or YouTube video walkthrough slot for a domain page. */
export interface DomainWalkthrough {
  url?: string;
  title: string;
  slot: string;
  plannedTopics: string[];
}

/** Human and agentic discovery guide for a domain page. */
export interface DomainAgentAccess {
  markdownPath: string;
  searchQuery: string;
  mcpTool: string;
  powRoutes: DomainLink[];
  keywords: string[];
}

/** One dossier page. */
export interface DomainRecord {
  /**
   * Route path without a trailing slash, e.g. "/ai-engineering/rlhf". Child
   * pages are found by path prefix (`childDomains`).
   */
  path: string;
  /** Short title used for the SEO title, breadcrumbs, lists, search and llms.txt. */
  title: string;
  /** Page heading and Markdown title. */
  h1: string;
  /** Meta description; also the search summary and llms.txt blurb. */
  description: string;
  /** Eyebrow label above the heading; also a search tag. */
  label: string;
  /** Standfirst paragraph under the heading; also shown when the page is listed as a child or on the homepage. */
  dek: string;
  evidenceLevel: EvidenceLevel;
  /** Listed in the homepage domain section via `homeDomains()`. */
  showOnHome?: boolean;
  /** Hard numbers in the game: verified tests, connectors, stages, or records. */
  stats: DomainStat[];
  /** Concise journey: how we started, the grind, what we achieved. */
  journey: DomainJourney;
  /** Structured table of skills, tools, proof, and trade-offs. */
  skillsTable: DomainSkillRow[];
  /** Core domain benchmarks, harnesses, or architecture specs with links and trade-offs. */
  coreBenchmarks: DomainBenchmarkRow[];
  /** 2–3 scalable solutions and live POW systems with What/How/Why/Where/ForWhom/Impact. */
  solutions: DomainSolution[];
  /** Loom or YouTube walkthrough embed or structured topic slot. */
  walkthrough: DomainWalkthrough;
  /** How any human or agent can search, fetch, and verify work in this domain. */
  agentAccess: DomainAgentAccess;
  sections: DomainSection[];
  /** Links to records that support the page's claims. */
  evidence: DomainLink[];
  related: DomainLink[];
  /** Outside reading. Not evidence of production experience. */
  reading: DomainLink[];
  /** What is not evidenced. Kept visible on the page and in Markdown. */
  gaps: string[];
}

/** Human-readable label for each evidence level, shown on DomainPage and in Markdown. */
export const evidenceLevelLabels: Record<EvidenceLevel, string> = {
  shipped: "Grounded in work I can point to",
  mixed: "Mixed: shipped pieces and explicit limits",
  investigation: "Investigation or notes, not a production system",
};

/**
 * All dossier pages, parents before their children. This order is kept by the
 * homepage list, llms.txt, the sitemap and search ranking ties.
 */
export const domains: DomainRecord[] = [
  {
    path: "/ai-engineering",
    title: "AI engineering",
    h1: "AI engineering",
    label: "AI × Automation × GTM × Revenue",
    showOnHome: true,
    description:
      "Ayush Rai on AI engineering: LLM evaluation rubrics, RLHF preference data, fact-vs-hypothesis grounding, deterministic 100-point scoring, and human-gated AI products.",
    dek: "Models propose; deterministic code and human gates decide what sticks. Contract LLM evaluation plus shipped revenue and billing workflows.",
    evidenceLevel: "mixed",
    stats: [
      {
        value: "2 roles",
        label: "Contract & SDE eval",
        context: "FoCDoT and Outlier evaluation work",
      },
      {
        value: "427+",
        label: "Automated tests",
        context: "48 GTM-Strato + 40 RIE + 339 RevenueRoles across AI/GTM repos",
      },
      {
        value: "5",
        label: "Interactive AI POW labs",
        context: "EVALFORGE, ORBIT, Harbor Meter, ML Lifecycle, Insight Lab",
      },
      {
        value: "2",
        label: "Stateless MCP servers",
        context: "/api/mcp (portfolio) & /api/mcp/docs (documentation)",
      },
    ],
    journey: {
      started:
        "SDE (AI Engineer) at FoCDoT and contract evaluator on Outlier, grading Python, JavaScript, and STEM outputs where fluent wrong answers fail under real tests.",
      grind:
        "Saw every day how LLMs hallucinate pricing, skip edge-case branches, and invent scores. Built deterministic wrappers around models: SSRF-hardened extractors, 100-point Python rubrics, integer-paise tax engines, and human approval queues.",
      achieved:
        "Shipped GTM-Strato (48 pytest tests), Revenue Intelligence Engine (40 pytest tests), RevenueRoles (45 pytest + 294 TS tests), MedVoice (voice-to-invoice monorepo), and dual Streamable HTTP MCP servers on this site.",
    },
    skillsTable: [
      {
        skill: "LLM evaluation & rubric engineering",
        category: "Evaluation & QA",
        tools: "Python, pytest, unittest, multi-criterion rubrics, exact-match & AST checks",
        depthAndProof: "FoCDoT & Outlier evaluation workflows; EVALFORGE workbench (/pow/ai-benchmark); OpenAI-RLHF & RLHF-tasks archives",
        tradeoff: "Strict rubrics reject stylistically fluent answers that miss one boundary check; higher rejection rate, zero silent regressions.",
        status: "contract",
      },
      {
        skill: "Fact-vs-hypothesis grounding",
        category: "Structured Extraction",
        tools: "NVIDIA Build API, Pydantic, SSRF-safe HTTP extraction, JSON schema validation",
        depthAndProof: "GTM-Strato (ICP Finder) tags every claim [Website fact] with URL, [Hypothesis], or [Not found]; 48 pytest tests",
        tradeoff: "Forcing unverified pricing to 'Not found' leaves blanks instead of slick guesses, keeping downstream scoring honest.",
        status: "local",
      },
      {
        skill: "Deterministic scoring around LLMs",
        category: "Decision Engines",
        tools: "Python, FastAPI, SQLAlchemy, Streamlit, SQLite",
        depthAndProof: "5-component ICP rubric in GTM-Strato; 6-component 100-pt rubric in Revenue Intelligence Engine (40 pytest tests)",
        tradeoff: "Models never emit a priority score; weights live in versioned Python functions so rankings are diffable.",
        status: "shipped",
      },
      {
        skill: "Constrained domain workflows",
        category: "AI Product Systems",
        tools: "NestJS, Next.js, TypeScript, Deepgram adapter, integer-paise GST engine",
        depthAndProof: "MedVoice wholesale pharma billing: speech proposes candidate lines against tenant catalog; rules compute tax",
        tradeoff: "Requires human confirmation on ambiguous medicine aliases, trading picker speed for invoice accuracy.",
        status: "local",
      },
      {
        skill: "Agent protocols & tool control",
        category: "Agentic Infrastructure",
        tools: "Model Context Protocol (MCP), Streamable HTTP, SEP-2127 Server Cards, Zod, WebMCP",
        depthAndProof: "Live /api/mcp and /api/mcp/docs servers; ORBIT deterministic controller lab (/pow/agentic-ai)",
        tradeoff: "Stateless read-only MCP endpoints fit serverless cold starts and prevent unauthorized external writes.",
        status: "shipped",
      },
      {
        skill: "Local RAG & vector retrieval",
        category: "Retrieval Systems",
        tools: "pgvector, ChromaDB, Ollama, FastAPI, Gmail API",
        depthAndProof: "RevenueRoles (Supabase pgvector), MailU (local Gmail RAG), Harbor Meter retrieval experiment (/pow/ai-research-engineering)",
        tradeoff: "Local Ollama inference keeps private mail on disk at the cost of slower token generation than hosted APIs.",
        status: "local",
      },
    ],
    coreBenchmarks: [
      {
        name: "EVALFORGE (demo-0.1)",
        href: "/pow/ai-benchmark",
        whatItDoes: "Scores 8 synthetic coding and reasoning tasks across 3 stored profiles using unit tests, exact match, 4-criterion rubrics, Wilson intervals, and paired sign tests.",
        domain: "AI Evaluation & Benchmark Engineering",
        category: "Functional correctness & rubric conformance",
        metrics: "8 accepted tasks, 1 planted schema rejection, 3 profiles (North 6/8, East 6/8, West 3/8)",
        tradeoff: "Recomputes deterministically in browser without live LLM API calls; isolates scoring mechanics from model variance.",
      },
      {
        name: "ORBIT Controller Suite",
        href: "/pow/agentic-ai",
        whatItDoes: "Executes 4 multi-step agent tasks against 8 typed tools with controller-owned state transitions, human approval gates, read-back store verification, and 8 scripted failure modes.",
        domain: "Agentic AI & Tool Governance",
        category: "State-machine execution & failure recovery",
        metrics: "8 typed tools, 4 task plans, 8 deterministic failure scenarios, 13 Vitest tests",
        tradeoff: "Fixed plans expose permission and verification boundaries clearly but do not benchmark open-ended autonomous planning.",
      },
      {
        name: "Harbor Meter Retrieval Eval",
        href: "/pow/ai-research-engineering",
        whatItDoes: "Compares baseline completion against fixed-bundle retrieval across 12 maintenance examples (9 scorable, 3 excluded for planted defects) on exact match, schema validity, and recall.",
        domain: "AI Research & Retrieval Evaluation",
        category: "Controlled A/B retrieval comparison",
        metrics: "Baseline 6/9 exact match vs Retrieval 3/9 (retrieval helps 2, hurts 5 via distractor passages)",
        tradeoff: "Proves why unreranked retrieval degrades precision on noisy passages before any production RAG claim is made.",
      },
    ],
    solutions: [
      {
        slug: "gtm-strato",
        title: "GTM-Strato (ICP Finder)",
        badge: "Local repo · 48 pytest tests",
        visualSlug: "gtm-strato",
        what: "An AI-assisted ICP discovery and prospecting-filter workbench that separates scraped website facts from LLM hypotheses and scores fit on a 100-point Python rubric.",
        how: "Fetches up to 5 public pages per domain with DNS/IP SSRF guards, sends delimited text to NVIDIA Build API, enforces pricing = 'Not found' when no pricing tokens exist, computes a 5-component local score, and outputs Apollo, Sales Navigator, and Clay filters into SQLite.",
        why: "Raw LLM prompts blend real company facts with fabricated pricing and unexplainable scores that outbound teams cannot trust.",
        where: "Public GitHub repository (`ayushrai-hub/GTM-Strato`), Python 3.11 + Streamlit + SQLite workbench.",
        forWhom: "GTM engineers and technical founders turning a domain list into auditable ICP segments and platform search filters.",
        impact: "48 passing pytest tests across SSRF security, grounding, scoring, and UI; 3 ready-to-run filter payloads per company run; 0 LLM-invented scores.",
        tradeoff: "Blocks private/loopback IPs and skips client-side JS rendering, trading SPA scraping coverage for strict SSRF safety.",
        links: [
          { href: "/work/gtm-strato", label: "Case study" },
          { href: "https://github.com/ayushrai-hub/GTM-Strato", label: "GitHub repo" },
          { href: "/gtm#gtm-gtm-strato", label: "GTM showcase" },
        ],
      },
      {
        slug: "revenue-intelligence-engine",
        title: "Revenue Intelligence Engine",
        badge: "Live demo + repo · 40 pytest tests",
        visualSlug: "revenue-intelligence-engine",
        what: "A 6-stage GTM pipeline that scores 42 synthetic accounts on a deterministic 100-point rubric, runs temperature-0 account research with a deterministic fallback, and holds CRM exports behind a human approval queue.",
        how: "FastAPI + SQLAlchemy backend normalizes domains, runs MockEnrichmentProvider, detects 5 signal types, scores 6 weighted components in pure Python, generates structured research briefs, and gates CSV/JSON/XLSX export behind an operator approval table in Next.js.",
        why: "Autonomous GTM loops need an explicit boundary where code owns the score, the model owns synthesis, and a human owns the export trigger.",
        where: "Live demo (`cashmaker-two.vercel.app`) and public repo (`ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE`).",
        forWhom: "Revenue operations and GTM engineering teams evaluating human-in-the-loop account research architectures.",
        impact: "42 synthetic companies scored deterministically, 6 committed operator console stages, 40 automated pytest tests, and idempotent `run_id` audit logs.",
        tradeoff: "Uses synthetic accounts and mock enrichment by default so the control plane can be verified without burning paid API credits.",
        links: [
          { href: "/work/revenue-intelligence-engine", label: "Case study" },
          { href: "https://cashmaker-two.vercel.app", label: "Live console" },
          { href: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE", label: "GitHub repo" },
        ],
      },
      {
        slug: "medvoice",
        title: "MedVoice Wholesale Pharma Billing",
        badge: "Monorepo foundation · NestJS + Next.js",
        visualSlug: "medvoice",
        what: "A voice-assisted order and GST billing workflow for pharmaceutical wholesalers where speech proposes an order line and deterministic rules decide medicine identity, tax, and ERP posting.",
        how: "pnpm monorepo with a NestJS modular monolith, Next.js admin console, Kotlin Android scaffold, alias-aware tenant catalog matcher, integer-paise GST calculator, and idempotent invoice state machine.",
        why: "Floor pickers speak order lines to accountants who type bills; look-alike medicine names and pack sizes make unconstrained AI autocompletion dangerous.",
        where: "Public GitHub repository (`ayushrai-hub/MedVoiceERP`).",
        forWhom: "Pharmaceutical wholesale floor pickers, stockists, and accountants operating beside Marg, Busy, or Tally.",
        impact: "Runnable local phase-2 loop from mock speech to confirmed integer-paise GST draft invoice with mock/CSV ERP adapters and explicit confirmation on risky matches.",
        tradeoff: "Forces human confirmation on ambiguous catalog matches and refuses silent autocompletion.",
        links: [
          { href: "/products/medvoice", label: "Product spec" },
          { href: "/work/medvoice", label: "Case study" },
          { href: "https://github.com/ayushrai-hub/MedVoiceERP", label: "GitHub repo" },
        ],
      },
    ],
    walkthrough: {
      title: "AI engineering walkthrough: evaluation rubrics, grounded extraction, and human gates",
      slot: "ai-engineering-walkthrough",
      plannedTopics: [
        "How EVALFORGE scores coding vs reasoning tasks and why exact match fails closed on extra prose.",
        "Inside GTM-Strato: SSRF-safe extraction, [Website fact] vs [Hypothesis] tagging, and the 100-point Python scorer.",
        "MedVoice and ORBIT: keeping money, tax, and state mutations behind deterministic checks and human approval.",
      ],
    },
    agentAccess: {
      markdownPath: "/ai-engineering.md",
      searchQuery: "/api/v1/search?q=ai+evaluation+scoring",
      mcpTool: "search_portfolio({ query: \"evaluation\" })",
      powRoutes: [
        { href: "/pow/ai-benchmark", label: "EVALFORGE Benchmark Lab" },
        { href: "/pow/agentic-ai", label: "ORBIT Agent Controller" },
        { href: "/pow/ai-research-engineering", label: "Harbor Meter Research Lab" },
        { href: "/pow/ml-engineer", label: "ML Lifecycle Lab" },
        { href: "/pow/ai-data-scientist", label: "Insight Lab Data Science" },
      ],
      keywords: [
        "LLM evaluation",
        "RLHF",
        "deterministic scoring",
        "fact-vs-hypothesis grounding",
        "Model Context Protocol",
        "human-in-the-loop",
        "SSRF guard",
      ],
    },
    sections: [
      {
        heading: "Operating rule: the model is not the system of record",
        paragraphs: [
          "Across every AI build on this site, the boundary is identical: language models read messy text, propose candidate fields, or draft research summaries at temperature 0. They never assign priority scores, compute tax, merge duplicate identities, or write directly to an external database without a deterministic check and a human gate.",
          "The child pages below split contract evaluation work (/ai-engineering/llm-evaluation, /ai-engineering/rlhf) from product architectures (/ai-engineering/llm-systems, /ai-engineering/agents) and boundary investigations (/ai-engineering/rag).",
        ],
      },
    ],
    evidence: [
      {
        href: "/experience#focdot-sde-ai",
        label: "FoCDoT, SDE, AI Engineer",
        note: "Evaluation and STEM and coding-task analysis.",
      },
      {
        href: "/experience#outlier-genai",
        label: "Outlier, AI evaluation contributor",
        note: "Contract evaluation for frontier-lab programs via the platform.",
      },
      {
        href: "/work/gtm-strato",
        label: "GTM-Strato (ICP Finder) case study",
        note: "Fact-vs-hypothesis grounding + 100-pt deterministic fit rubric + 48 pytest tests.",
      },
      {
        href: "/work/medvoice",
        label: "MedVoice case study",
        note: "Speech proposes; deterministic rules decide medicine, price, and integer-paise GST.",
      },
      {
        href: "/notes/eval-is-the-job",
        label: "Note: evaluation is the job",
        note: "Why vague feedback is not a training signal.",
      },
    ],
    related: [
      { href: "/ai-engineering/llm-evaluation", label: "LLM evaluation" },
      { href: "/ai-engineering/rlhf", label: "RLHF and preference feedback" },
      { href: "/ai-engineering/llm-systems", label: "LLM systems" },
      { href: "/ai-engineering/agents", label: "Agents" },
      { href: "/ai-engineering/rag", label: "Retrieval" },
      { href: "/gtm", label: "GTM engineering showcase" },
      { href: "/software-engineering", label: "Software engineering" },
    ],
    reading: [
      {
        href: "https://huggingface.co/learn",
        label: "Hugging Face Learn",
        note: "Public courses. A study resource, not a credential I am claiming.",
      },
    ],
    gaps: [
      "No public eval harness, preference dataset, or benchmark table from the contract work. The engagements do not allow that dump.",
      "No production inference, quantization, or model-serving write-up. I am not publishing an inference page to fill the gap.",
      "No claim of training a frontier model, owning a lab pipeline, or leading an RLHF program.",
    ],
  },
  {
    path: "/ai-engineering/llm-evaluation",
    title: "LLM evaluation",
    h1: "LLM evaluation",
    label: "AI engineering · Evaluation & Benchmarks",
    showOnHome: true,
    description:
      "Ayush Rai on LLM evaluation and benchmark engineering: explicit rubrics, unit-test and exact-match scoring, dataset validation, failure taxonomy, and EVALFORGE.",
    dek: "Turn fluent model output into testable pass/fail evidence. Grounded in contract evaluation at FoCDoT and Outlier plus the EVALFORGE benchmark workbench.",
    evidenceLevel: "mixed",
    stats: [
      {
        value: "8 + 1",
        label: "EVALFORGE tasks",
        context: "8 accepted coding/reasoning tasks + 1 planted schema rejection",
      },
      {
        value: "3",
        label: "Scoring engines",
        context: "Stored unit tests, trimmed exact match, and 4-criterion rubric",
      },
      {
        value: "9",
        label: "Lifecycle stages",
        context: "Specify -> Prepare -> Validate -> Configure -> Execute -> Score -> Analyze -> Classify -> Report",
      },
      {
        value: "2",
        label: "Public task archives",
        context: "ayushrai-hub/OpenAI-RLHF and ayushrai-hub/RLHF-tasks on GitHub",
      },
    ],
    journey: {
      started:
        "Grading model completions at FoCDoT across Python, JavaScript, and STEM prompts where 'looks good' hides off-by-one bugs, reversed ranges, and injection flaws.",
      grind:
        "Auditing dataset quality on Outlier, writing adversarial prompts that break brittle completions, and separating syntax runs from safe-to-ship code.",
      achieved:
        "Built EVALFORGE (/pow/ai-benchmark) and Harbor Meter (/pow/ai-research-engineering) to show the exact specification, dataset validator, scoring engine, Wilson confidence intervals, and failure taxonomy in public code without leaking proprietary client tasks.",
    },
    skillsTable: [
      {
        skill: "Task specification & capability isolation",
        category: "Benchmark Design",
        tools: "TypeScript, JSON schema, explicit output contracts",
        depthAndProof: "EVALFORGE spec separates coding functional correctness from reasoning string/rubric conformance (/pow/ai-benchmark#specification)",
        tradeoff: "Refusing mixed capabilities in one prompt increases task count but makes every failure attributable to one cause.",
        status: "simulation",
      },
      {
        skill: "Dataset schema & contamination validation",
        category: "Data Hygiene",
        tools: "Deterministic validators, duplicate ID detection, provenance tags",
        depthAndProof: "EVALFORGE DatasetInspector flags `reject-ambiguous`, duplicate IDs, and invalid enums; Harbor Meter flags duplicate `HM-05`",
        tradeoff: "Fails closed on missing `expectedSpec` or mismatched capability labels before any scorer runs.",
        status: "simulation",
      },
      {
        skill: "Code evaluation & branch testing",
        category: "Code Review",
        tools: "Python, JavaScript, pytest, unittest, boundary test suites",
        depthAndProof: "FoCDoT & Outlier code-eval workflows; EVALFORGE `code-range` (`2-5` vs reversed `5-2` vs empty) & `code-dedupe` order checks",
        tradeoff: "Happy-path tests pass broken functions; requires explicit negative and boundary test cases on every prompt.",
        status: "contract",
      },
      {
        skill: "Multi-criterion rubric scoring",
        category: "Rubric Design",
        tools: "4-dimension 0–2 scales (Correctness, Completeness, Instruction adherence, Evidence quality)",
        depthAndProof: "EVALFORGE `reason-rubric` task and FoCDoT criteria-based evaluation",
        tradeoff: "Requires non-zero Correctness plus >=75% total points so fluent prose with a false premise still fails.",
        status: "contract",
      },
      {
        skill: "Statistical reading of small samples",
        category: "Statistical Rigor",
        tools: "Wilson score confidence intervals, paired sign tests on discordant tasks",
        depthAndProof: "EVALFORGE ReliabilityPanel (/pow/ai-benchmark#reliability) comparing Profile North (6/8) vs Profile East (6/8)",
        tradeoff: "Two profiles can tie at 6/8 while failing completely different tasks; paired discordant inspection beats single-number leaderboards.",
        status: "simulation",
      },
    ],
    coreBenchmarks: [
      {
        name: "EVALFORGE Coding Correctness Suite",
        href: "/pow/ai-benchmark#specification",
        whatItDoes: "Evaluates 4 Python function tasks (`sum_evens`, `slugify`, `parse_span`, `stable_unique`) against 3 named unit tests each (empty, boundary, type-safety, and order invariants).",
        domain: "Code Generation Evaluation",
        category: "Unit-test functional verification",
        metrics: "4 tasks × 3 tests × 3 profiles = 36 stored test assertions; Profile East 4/4, North 2/4, West 2/4",
        tradeoff: "One failed boundary test (`reversed` span or `sorted(set())` order break) fails the entire item. No partial credit for code that corrupts state.",
      },
      {
        name: "EVALFORGE Structured Reasoning Suite",
        href: "/pow/ai-benchmark#playground",
        whatItDoes: "Evaluates 3 exact-match tasks (`reason-fee`, `reason-steps`, `reason-json`) and 1 four-criterion rubric task (`reason-rubric`) explaining why happy-path tests are insufficient.",
        domain: "Reasoning & Format Conformance",
        category: "Exact-match & multi-criterion rubric",
        metrics: "Profile North 4/4, Profile East 2/4 (fails `The fee is 20.` format & rubric completeness), Profile West 1/4",
        tradeoff: "Exact match fails closed on extra conversational wrapper text (`The fee is 20.` vs `20`), exposing format-following failures.",
      },
      {
        name: "Harbor Meter A/B Retrieval Benchmark",
        href: "/pow/ai-research-engineering",
        whatItDoes: "Evaluates 12 industrial maintenance Q&A tasks across Baseline vs Fixed-Bundle Retrieval with planted data defects (duplicate `HM-05`, unverified target, missing passage).",
        domain: "RAG & Grounded Q&A Evaluation",
        category: "Exact match, JSON schema validity, retrieval recall",
        metrics: "9 scorable rows: Baseline 6/9 exact match vs Retrieval 3/9; Retrieval recall 8/9; Schema validity 1/1 on `HM-11`",
        tradeoff: "Separates retrieval recall (8/9) from answer accuracy (3/9), proving that high recall with distractor chunks hurts final accuracy.",
      },
    ],
    solutions: [
      {
        slug: "evalforge-workbench",
        title: "EVALFORGE Reproducible Evaluation Workbench",
        badge: "Live POW lab · /pow/ai-benchmark",
        visualSlug: "gtm-strato",
        what: "An interactive 9-stage benchmark engineering workbench with dataset validation, planted defect injection, multi-method scoring, failure classification, and paired statistical comparisons.",
        how: "Pure TypeScript scoring and aggregation engine (`src/lib/benchmark/aggregate.ts`) recomputes pass flags, Wilson intervals, and discordant pairs in real time from versioned task and response fixtures.",
        why: "Most benchmark portfolios show static charts without showing how ambiguous tasks are rejected or how exact match, unit tests, and rubrics disagree.",
        where: "Live at `/pow/ai-benchmark` with 8 Vitest suite checks in `src/__tests__/benchmarkPage.test.tsx`.",
        forWhom: "AI evaluation leads and research engineers inspecting rubric design and failure-mode analysis.",
        impact: "Demonstrates end-to-end evaluation lifecycle across 8 accepted tasks, 1 rejected ambiguous task, 2 audit-fixture defects, 3 profiles, and 2 pairwise preference cases.",
        tradeoff: "Uses stored synthetic fixtures rather than live API calls so every visitor and test runner gets identical, reproducible numbers.",
        links: [
          { href: "/pow/ai-benchmark", label: "Open EVALFORGE lab" },
          { href: "/pow/ai-benchmark#dataset", label: "Dataset inspector" },
          { href: "/pow/ai-benchmark#reliability", label: "Statistical reliability" },
        ],
      },
      {
        slug: "contract-llm-eval",
        title: "Production LLM Evaluation Loops (FoCDoT & Outlier)",
        badge: "FoCDoT and Outlier",
        what: "Criteria-based evaluation, adversarial prompting, and code/STEM verification for generative AI systems across two roles.",
        how: "Review model completions against explicit multi-axis rubrics, write unit tests to verify generated Python/JS code, isolate prompt leakage, and document failure rationales for training pipelines.",
        why: "Automated metrics miss subtle logic bugs, security smells (SQL/shell injection, unsafe defaults), and explanations that contradict the final code.",
        where: "FoCDoT Technologies Pvt. Ltd (SDE, AI Engineer) and Outlier (contract AI evaluation contributor).",
        forWhom: "Engineering and frontier-lab evaluation programs delivered through employer and vendor platforms.",
        impact: "Continuous human-feedback and rubric enforcement across Python, JavaScript, and STEM domains; public task patterns archived in `OpenAI-RLHF` and `RLHF-tasks`.",
        tradeoff: "NDA boundaries prohibit publishing proprietary customer prompts, agreement scores, or internal leaderboards.",
        links: [
          { href: "/experience#focdot-sde-ai", label: "FoCDoT experience" },
          { href: "/experience#outlier-genai", label: "Outlier experience" },
          { href: "/notes/eval-is-the-job", label: "Note: Evaluation is the job" },
        ],
      },
      {
        slug: "gtm-strato-grounding-eval",
        title: "GTM-Strato Grounding & Rubric Verifier",
        badge: "Local repo · 48 pytest tests",
        visualSlug: "gtm-strato",
        what: "A production-grade grounding validator and 100-point rubric scorer that audits LLM-extracted company profiles before any GTM filter is trusted.",
        how: "`tests/test_grounding.py` and `test_scoring.py` verify that every extracted field carries `[Website fact]` (with a scraped source URL), `[Hypothesis]`, or `[Not found]`, and that missing pricing tokens force pricing to `Not found`.",
        why: "In GTM automation, an unverified LLM claim sent to an outbound sequence is a live evaluation failure.",
        where: "Public repository `ayushrai-hub/GTM-Strato` (`icp-finder/`).",
        forWhom: "Revenue teams running automated company research.",
        impact: "48 automated pytest tests enforcing grounding, SSRF protection, and 5-component deterministic scoring.",
        tradeoff: "Rejects plausible LLM inferences when scraped text lacks direct token evidence.",
        links: [
          { href: "/work/gtm-strato", label: "GTM-Strato case study" },
          { href: "https://github.com/ayushrai-hub/GTM-Strato", label: "GitHub repository" },
        ],
      },
    ],
    walkthrough: {
      title: "LLM evaluation & benchmark engineering walkthrough",
      slot: "llm-evaluation-walkthrough",
      plannedTopics: [
        "Walking a task from capability spec to dataset validation and planted schema failure in EVALFORGE.",
        "Why Profile North and Profile East tie at 6/8 while failing opposite task categories.",
        "How I apply the same rubric discipline inside GTM-Strato and Revenue Intelligence Engine.",
      ],
    },
    agentAccess: {
      markdownPath: "/ai-engineering/llm-evaluation.md",
      searchQuery: "/api/v1/search?q=evaluation+benchmark+rubric",
      mcpTool: "get_page({ path: \"/pow/ai-benchmark\" })",
      powRoutes: [
        { href: "/pow/ai-benchmark", label: "EVALFORGE Benchmark Lab" },
        { href: "/pow/ai-research-engineering", label: "Harbor Meter Retrieval Eval" },
      ],
      keywords: [
        "benchmark engineering",
        "EVALFORGE",
        "rubric scoring",
        "Wilson interval",
        "dataset validation",
        "unit-test evaluation",
        "exact match",
      ],
    },
    sections: [
      {
        heading: "Four rules from the review loop",
        paragraphs: [
          "Whether I am grading a completion on Outlier or writing a pytest gate for a GTM pipeline, the failure modes are the same: rubrics drift toward style, pairwise preferences hide shared bugs when both answers miss a branch, and prompt examples leak the expected answer.",
        ],
        bullets: [
          "Name the capability and the disqualifying failure before looking at the completion.",
          "Separate 'code runs' from 'handles empty, reversed, non-integer, and injection inputs'.",
          "Treat any rubric edit as a new measurement version (`demo-0.1` -> `demo-0.2`), never a silent score bump.",
          "Never use an LLM judge where a deterministic unit test, schema check, or exact match exists.",
        ],
      },
    ],
    evidence: [
      {
        href: "/pow/ai-benchmark",
        label: "EVALFORGE benchmark engineering POW",
        note: "Interactive 9-stage evaluation lifecycle, dataset inspector, and statistical reliability panel.",
      },
      {
        href: "/experience#outlier-genai",
        label: "Outlier evaluation work",
        note: "Dataset quality, Python/JavaScript prompting, review of brittle outputs.",
      },
      {
        href: "/experience#focdot-sde-ai",
        label: "FoCDoT evaluation work",
        note: "Criteria-based review and STEM and coding-task analysis.",
      },
      {
        href: "/notes/eval-is-the-job",
        label: "Evaluation is the job",
        note: "Short note on explicit rubrics.",
      },
      {
        href: "/ideas",
        label: "Code-eval rubrics idea",
        note: "Status: exploring. Not a shipped rubric.",
      },
    ],
    related: [
      { href: "/ai-engineering/rlhf", label: "RLHF and preference feedback" },
      { href: "/ai-engineering", label: "AI engineering hub" },
      { href: "/work/medvoice", label: "MedVoice, where the model does not decide" },
      { href: "/pow/ai-benchmark", label: "EVALFORGE demonstration" },
      { href: "/pow/ai-research-engineering", label: "Harbor Meter research lab" },
    ],
    reading: [
      {
        href: "https://arxiv.org/abs/2203.02155",
        label: "Training language models to follow instructions with human feedback",
        note: "The InstructGPT paper. Background reading, not my result.",
      },
    ],
    gaps: [
      "No public inter-annotator agreement, sample size, or error analysis from paid review work.",
      "No side-by-side benchmark against a named model.",
      "The code-eval rubric idea is not written up as a reusable document yet.",
    ],
  },
  {
    path: "/ai-engineering/rlhf",
    title: "RLHF and preference feedback",
    h1: "RLHF and preference feedback",
    label: "AI engineering · Human Feedback & Alignment Signals",
    showOnHome: true,
    description:
      "Ayush Rai on RLHF-shaped work: pairwise preference judgment, tie adjudication, rubric-guided human feedback, and public task repositories.",
    dek: "Clean preference signals require explicit tie rules and verification tests before pairwise ranking. Grounded in FoCDoT, Outlier, and public task archives.",
    evidenceLevel: "mixed",
    stats: [
      {
        value: "2",
        label: "Evaluation roles",
        context: "FoCDoT SDE (AI) & Outlier contract evaluation contributor",
      },
      {
        value: "2",
        label: "Public RLHF repos",
        context: "OpenAI-RLHF (A/B pairs) & RLHF-tasks (task library with tests)",
      },
      {
        value: "2",
        label: "Adjudicated preference fixtures",
        context: "Single-rater & adjudicated-tie cases in EVALFORGE (/pow/ai-benchmark#scoring)",
      },
      {
        value: "5-state",
        label: "Provenance labels",
        context: "Verified, inferred, unverified, conflicting, missing in downstream pipelines",
      },
    ],
    journey: {
      started:
        "RLHF-oriented evaluation at FoCDoT, comparing model completions on coding and STEM prompts where two fluent answers can both be subtly wrong.",
      grind:
        "Contract dataset-quality and brittle-behavior review on Outlier, while documenting non-confidential coding task structures in `OpenAI-RLHF` and `RLHF-tasks`.",
      achieved:
        "Built pairwise preference inspection with explicit tie adjudication into EVALFORGE (/pow/ai-benchmark) and Harbor Meter (/pow/ai-research-engineering), and carried strict disagreement handling into AIworks Leads (`possible_duplicate_identity`).",
    },
    skillsTable: [
      {
        skill: "Pairwise preference & tie adjudication",
        category: "Preference Data",
        tools: "Criterion-locked A/B comparison, adjudicated-tie rules",
        depthAndProof: "FoCDoT & Outlier review loops; EVALFORGE `pref-rejects` and `pref-tie` fixtures (/pow/ai-benchmark#scoring)",
        tradeoff: "Allowing an adjudicated tie when both responses miss half the spec prevents noisy forced-winner gradients.",
        status: "contract",
      },
      {
        skill: "Code-task environment & test packaging",
        category: "RLHF Task Design",
        tools: "Python, JavaScript, instruction + environment + reference solution + unit tests",
        depthAndProof: "Public repositories `ayushrai-hub/RLHF-tasks` and `ayushrai-hub/OpenAI-RLHF`",
        tradeoff: "Packaging executable tests beside every preference prompt takes longer per item than prose-only rating.",
        status: "local",
      },
      {
        skill: "Disagreement & ambiguity isolation",
        category: "Dataset Hygiene",
        tools: "SQLite audit stores, explicit rejection codes, conflict state flags",
        depthAndProof: "EVALFORGE `reject-ambiguous` rule; Relationship Intelligence Engine `conflicting` state; AIworks Leads identity collision check",
        tradeoff: "Quarantining ambiguous prompts or conflicting rows shrinks raw dataset volume but keeps training/CRM signals clean.",
        status: "shipped",
      },
      {
        skill: "Adversarial prompt probing",
        category: "Red-Teaming & QA",
        tools: "Boundary inputs, constraint-violation prompts, format traps",
        depthAndProof: "Outlier contract evaluation for Python/JS tasks; Harbor Meter distractor-chunk tests",
        tradeoff: "Targets brittle edge behaviors rather than average-case chat fluency.",
        status: "contract",
      },
    ],
    coreBenchmarks: [
      {
        name: "EVALFORGE Pairwise Preference & Tie Suite",
        href: "/pow/ai-benchmark#scoring",
        whatItDoes: "Demonstrates single-rater preference (`pref-rejects`: concrete spec rejection vs clean wording) and adjudicated tie (`pref-tie`: Response A names reversed span, Response B names empty string).",
        domain: "RLHF Preference Data Engineering",
        category: "Criterion-locked pairwise adjudication",
        metrics: "2 structured preference cases (`single-rater` winner A, `adjudicated-tie` when each misses 1 required reject)",
        tradeoff: "Refuses to crown a stylistic winner when the prompt criterion requires two concrete negative test cases.",
      },
      {
        name: "OpenAI-RLHF & RLHF-tasks Public Archives",
        href: "https://github.com/ayushrai-hub/RLHF-tasks",
        whatItDoes: "Public GitHub repositories documenting coding-evaluation task structures, A/B completion pairs, instructions, environments, reference solutions, and unit tests.",
        domain: "Code Evaluation & Preference Artifacts",
        category: "Task & test packaging",
        metrics: "2 public repositories (`ayushrai-hub/OpenAI-RLHF` and `ayushrai-hub/RLHF-tasks`)",
        tradeoff: "Archives task and completion artifacts only; explicitly does not claim to be a PPO/DPO reward-model training framework.",
      },
    ],
    solutions: [
      {
        slug: "evalforge-preference-panel",
        title: "EVALFORGE Preference & Rubric Adjudicator",
        badge: "Live POW lab · /pow/ai-benchmark#scoring",
        visualSlug: "aiworks-leads",
        what: "Interactive scoring inspector that contrasts unit-test verification, 4-criterion rubric grading, and pairwise preference adjudication on the same task family.",
        how: "Renders side-by-side candidate responses (`responseA` vs `responseB`), explicit criterion rules, adjudication type (`single-rater` vs `adjudicated-tie`), rationale, and rater limitation notes.",
        why: "Shows why pairwise preference is a poor substitute for a failing unit test when a test exists, and how human feedback should be scoped to what tests cannot name.",
        where: "Live at `/pow/ai-benchmark#scoring` and `/pow/ai-research-engineering`.",
        forWhom: "RLHF data leads and evaluation engineers inspecting annotation guidelines.",
        impact: "Makes tie-handling and rubric-vs-preference boundaries inspectable in browser and Markdown.",
        tradeoff: "Single-author demonstration fixture; does not claim multi-rater Cohen's kappa.",
        links: [
          { href: "/pow/ai-benchmark#scoring", label: "EVALFORGE scoring engine" },
          { href: "/pow/ai-research-engineering", label: "Harbor Meter human-eval panel" },
        ],
      },
      {
        slug: "rlhf-task-repositories",
        title: "Public Coding-Eval & RLHF Task Archives",
        badge: "Public GitHub repos · OpenAI-RLHF & RLHF-tasks",
        what: "Two public repositories containing structured coding tasks, A/B completion comparisons, environment setups, and verification tests.",
        how: "Packages each coding problem with its instruction, execution environment, reference implementation, and test assertions so human preference sits on top of executable verification.",
        why: "A reviewer grading code without running tests rewards plausible variable names over working logic.",
        where: "`github.com/ayushrai-hub/OpenAI-RLHF` and `github.com/ayushrai-hub/RLHF-tasks`.",
        forWhom: "Engineers inspecting how code-oriented RLHF tasks are structured.",
        impact: "Publicly inspectable task and test layouts backing the evaluation methodology described on this site.",
        tradeoff: "Strictly scoped to task/eval artifacts; no reward model or policy-gradient trainer is claimed.",
        links: [
          { href: "https://github.com/ayushrai-hub/OpenAI-RLHF", label: "OpenAI-RLHF repo" },
          { href: "https://github.com/ayushrai-hub/RLHF-tasks", label: "RLHF-tasks repo" },
        ],
      },
      {
        slug: "aiworks-leads-verification",
        title: "AIworks Lead Qualification & Collision Store",
        badge: "Zero-dep Python CLI · SQLite audit store",
        visualSlug: "aiworks-leads",
        what: "Applies RLHF-style annotation hygiene to B2B lead datasets: mandatory per-field source URLs, tri-bucket sorting (`accepted`, `research_only`, `rejections`), and zero silent merges on identity collisions.",
        how: "Pure Python 3.9+ rule engine (`rules.py`) and SQLite store (`store.py`) validate every row, backup the DB before each run, and flag `possible_duplicate_identity` when name+company match on a different email.",
        why: "Whether curating training pairs or revenue leads, averaging away a conflict corrupts the dataset.",
        where: "Public repository `ayushrai-hub/leads`.",
        forWhom: "GTM and data operations teams auditing human-researched datasets.",
        impact: "0 external dependencies, 6 end-to-end unittest suites, immutable timestamped run reports.",
        tradeoff: "Quarantines incomplete high-fit rows into `research_only.csv` rather than auto-promoting them.",
        links: [
          { href: "/work/aiworks-leads", label: "Case study" },
          { href: "https://github.com/ayushrai-hub/leads", label: "GitHub repo" },
        ],
      },
    ],
    walkthrough: {
      title: "RLHF preference data & rubric adjudication walkthrough",
      slot: "rlhf-preference-walkthrough",
      plannedTopics: [
        "Where preference pairs fail: fluency bias, averaged disagreements, and missing negative tests.",
        "Walking through `pref-rejects` and `pref-tie` in EVALFORGE.",
        "How `RLHF-tasks` pairs unit tests with human review.",
      ],
    },
    agentAccess: {
      markdownPath: "/ai-engineering/rlhf.md",
      searchQuery: "/api/v1/search?q=rlhf+preference+evaluation",
      mcpTool: "get_page({ path: \"/ai-engineering/rlhf\" })",
      powRoutes: [
        { href: "/pow/ai-benchmark", label: "EVALFORGE Preference & Rubric Lab" },
        { href: "/pow/ai-research-engineering", label: "Harbor Meter Human-Eval Slice" },
      ],
      keywords: [
        "RLHF",
        "pairwise preference",
        "adjudicated tie",
        "human feedback",
        "OpenAI-RLHF",
        "RLHF-tasks",
        "annotation hygiene",
      ],
    },
    sections: [
      {
        heading: "Boundary: human-judgment signal vs policy training",
        paragraphs: [
          "I use 'RLHF-shaped' deliberately. My paid work at FoCDoT and through Outlier sits on the human-judgment and dataset-quality side: reviewing completions, writing test-backed prompts, and enforcing criteria. I did not design a reward model, run PPO/DPO training loops, or work as a direct employee of a frontier lab.",
          "For code and STEM tasks, human preference only matters after executable tests pass, catching insecure-but-passing code, right answers with fabricated explanations, or ignored prompt constraints.",
        ],
      },
    ],
    evidence: [
      {
        href: "/experience#focdot-sde-ai",
        label: "FoCDoT role",
        note: "RLHF-oriented evaluation and STEM/coding analysis.",
      },
      {
        href: "/experience#outlier-genai",
        label: "Outlier contract",
        note: "Dataset quality and review via vendor platform.",
      },
      {
        href: "https://github.com/ayushrai-hub/OpenAI-RLHF",
        label: "OpenAI-RLHF repository",
        note: "Public archive of coding-evaluation tasks and A/B completion pairs.",
      },
      {
        href: "https://github.com/ayushrai-hub/RLHF-tasks",
        label: "RLHF-tasks repository",
        note: "Public task library with instructions, environments, solutions, and tests.",
      },
      {
        href: "/ai-engineering/llm-evaluation",
        label: "LLM evaluation",
        note: "The rubric side of the same work.",
      },
    ],
    related: [
      { href: "/ai-engineering/llm-evaluation", label: "LLM evaluation" },
      { href: "/pow/ai-benchmark", label: "EVALFORGE benchmark lab" },
      { href: "/notes/eval-is-the-job", label: "Evaluation is the job" },
      { href: "/ai-engineering", label: "AI engineering hub" },
    ],
    reading: [
      {
        href: "https://arxiv.org/abs/1706.03741",
        label: "Deep reinforcement learning from human preferences",
        note: "Christiano et al. Foundational paper. Not my experiment.",
      },
      {
        href: "https://arxiv.org/abs/2203.02155",
        label: "InstructGPT",
        note: "The widely cited RLHF-for-language-models write-up.",
      },
    ],
    gaps: [
      "No reward-model training logs, preference UI, or policy-update results.",
      "No description of proprietary task content, guidelines, or customer names beyond what the experience page already says.",
      "Do not read this page as a research paper or as an alignment credential.",
    ],
  },
  {
    path: "/ai-engineering/llm-systems",
    title: "LLM systems",
    h1: "LLM systems in products",
    label: "AI engineering · Bounded AI Products",
    description:
      "Product architectures where an LLM or speech model proposes candidate structures and surrounding deterministic software decides pricing, tax, scoring, and state mutations.",
    dek: "The model is never the system. Four shipped or runnable product architectures: MedVoice, GTM-Strato, Revenue Intelligence Engine, and AGENYRA.",
    evidenceLevel: "mixed",
    stats: [
      {
        value: "4",
        label: "LLM-shaped systems",
        context: "MedVoice, GTM-Strato, Revenue Intelligence Engine, AGENYRA",
      },
      {
        value: "0",
        label: "Unconfirmed model writes",
        context: "Every invoice post, CRM export, or score passes deterministic code + human gate",
      },
      {
        value: "88+",
        label: "Python pipeline tests",
        context: "48 pytest in GTM-Strato + 40 pytest in Revenue Intelligence Engine",
      },
      {
        value: "100%",
        label: "Integer money & rubric math",
        context: "Paise GST in MedVoice; 0–100 pure-Python rubrics in GTM-Strato & RIE",
      },
    ],
    journey: {
      started:
        "Started designing product surfaces around speech and LLMs where a naive wrapper ('ask the model to generate the invoice or lead score') fails immediately on auditability.",
      grind:
        "Built adapter boundaries: Deepgram/mock speech behind a tenant catalog matcher in MedVoice, NVIDIA Build behind an SSRF-safe extractor in GTM-Strato, and temperature-0 OpenAI-compatible research with deterministic fallback in Revenue Intelligence Engine.",
      achieved:
        "Shipped runnable vertical slices with committed screenshots, integer-paise tax rules, 88+ pytest tests across GTM-Strato and RIE, and explicit stage vocabularies in AGENYRA.",
    },
    skillsTable: [
      {
        skill: "Proposal-vs-decision state machines",
        category: "System Architecture",
        tools: "NestJS, FastAPI, TypeScript, Python, SQLAlchemy",
        depthAndProof: "MedVoice draft-order confirmation flow; Revenue Intelligence Engine 6-stage pipeline with approval queue",
        tradeoff: "Adds an explicit unconfirmed/approval state table instead of one-click auto-commit.",
        status: "shipped",
      },
      {
        skill: "Deterministic financial & rubric computation",
        category: "Domain Logic",
        tools: "Integer paise arithmetic, pure Python weighted rubrics, Pydantic/Zod",
        depthAndProof: "MedVoice GST calculation; GTM-Strato 5-component score; RIE 6-component score",
        tradeoff: "Zero floating-point or LLM arithmetic drift.",
        status: "shipped",
      },
      {
        skill: "Provider adapters & deterministic fallbacks",
        category: "Resilience",
        tools: "NVIDIA Build NIM client, OpenAI-compatible client, Deepgram/Mock speech adapters",
        depthAndProof: "RIE temperature-0 research service falls back to deterministic template when API key is absent; MedVoice mock speech loop",
        tradeoff: "Every pipeline runs end-to-end in CI and local dev without live third-party credentials.",
        status: "shipped",
      },
      {
        skill: "SSRF-hardened untrusted input ingestion",
        category: "Security",
        tools: "DNS resolution checks, private/loopback IP blocklists, robots.txt check, delimited prompts",
        depthAndProof: "GTM-Strato `website_extractor.py` + `test_security.py`",
        tradeoff: "Refuses redirects to internal networks and strips script execution before model ingestion.",
        status: "local",
      },
    ],
    coreBenchmarks: [
      {
        name: "MedVoice Voice-to-Invoice State Machine",
        href: "/work/medvoice",
        whatItDoes: "Normalizes spoken order lines, matches only against the tenant's medicine master + aliases, holds ambiguous matches for human confirmation, computes GST in integer paise, and posts idempotently to mock/CSV ERP adapters.",
        domain: "Enterprise Workflow & Billing AI",
        category: "Constrained speech-to-ERP pipeline",
        metrics: "pnpm monorepo (NestJS API + Next.js admin + Kotlin scaffold), integer-paise GST, idempotent invoice keys",
        tradeoff: "Blocks silent fuzzy matches on look-alike medicine strengths; requires explicit human confirmation.",
      },
      {
        name: "GTM-Strato Fact-Grounding & Scoring Engine",
        href: "/work/gtm-strato",
        whatItDoes: "Extracts up to 5 public pages per company URL, separates `[Website fact]` from `[Hypothesis]`, forces missing pricing to `Not found`, computes a 0–100 fit score, and emits Apollo/Sales Nav/Clay filters.",
        domain: "GTM & Revenue AI Systems",
        category: "Grounded extraction + deterministic scoring",
        metrics: "48 pytest tests, 5 rubric weights (30/25/15/15/15), 3 prospecting platform filter generators",
        tradeoff: "Never lets the LLM score an ICP or guess pricing tiers.",
      },
      {
        name: "Revenue Intelligence Engine 6-Stage Console",
        href: "/work/revenue-intelligence-engine",
        whatItDoes: "Scores 42 synthetic accounts across 5 signal types on a 100-pt rubric, synthesizes account research at temperature 0, and gates CSV/JSON/XLSX export behind human approval.",
        domain: "Autonomous Revenue Operations",
        category: "Staged workflow + human approval gate",
        metrics: "42 synthetic companies, 40 pytest tests, 6 operator console views with repository screenshots",
        tradeoff: "Holds all researched accounts in an approval queue until an operator signs off.",
      },
    ],
    solutions: [
      {
        slug: "medvoice",
        title: "MedVoice: Speech Proposes, Rules Decide",
        badge: "Monorepo · NestJS + Next.js + Kotlin scaffold",
        visualSlug: "medvoice",
        what: "A voice-assisted wholesale pharma billing system that turns spoken floor lines into auditable draft invoices without letting a model pick medicine identity, price, or tax.",
        how: "Speech adapter feeds an alias-aware tenant catalog matcher; risky matches stay unconfirmed; confirmed lines pass through deterministic integer-paise GST logic and idempotent ERP adapters.",
        why: "In wholesale pharma, shipping the wrong strength or miscalculating GST on an invoice is an expensive compliance and safety failure.",
        where: "Public GitHub repository (`ayushrai-hub/MedVoiceERP`).",
        forWhom: "Pharmaceutical wholesaler floor workers, accountants, and owners using Marg, Busy, or Tally.",
        impact: "Phase-2 local loop implemented with order state machine, voice-session debug without raw audio, and mock/CSV ERP adapters.",
        tradeoff: "No public hosted demo; live warehouse catalog import and live Tally/Marg sync remain planned.",
        links: [
          { href: "/products/medvoice", label: "Product record" },
          { href: "/work/medvoice", label: "Case study" },
          { href: "https://github.com/ayushrai-hub/MedVoiceERP", label: "GitHub repo" },
        ],
      },
      {
        slug: "revenue-intelligence-engine",
        title: "Revenue Intelligence Engine",
        badge: "Live demo + 40 pytest tests",
        visualSlug: "revenue-intelligence-engine",
        what: "Full-stack GTM system combining deterministic 100-point scoring with temperature-0 account research and a human approval gate.",
        how: "FastAPI workflow (`app/workflows/revenue_intelligence.py`) + SQLAlchemy + Next.js 6-stage console with deterministic research fallback.",
        why: "Separates account ranking (pure Python math) from account narrative synthesis (bounded LLM call).",
        where: "Live at `cashmaker-two.vercel.app` and `github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE`.",
        forWhom: "GTM engineers and RevOps teams.",
        impact: "40 passing pytest tests, 6 verified operator stage screenshots, idempotent `run_id` upserts.",
        tradeoff: "Operates on a 42-company synthetic universe with mock enrichment.",
        links: [
          { href: "/work/revenue-intelligence-engine", label: "Case study" },
          { href: "https://cashmaker-two.vercel.app", label: "Live console" },
          { href: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE", label: "GitHub repo" },
        ],
      },
      {
        slug: "agenyra",
        title: "AGENYRA: Structured Product Data First",
        badge: "Live surface · Next.js 16 + Supabase RLS",
        visualSlug: "agenyra",
        what: "An AI product distribution layer that starts with structured representation (task, inputs, outputs, runtime, cost, verification state) before discovery or agent placement.",
        how: "Next.js 16 App Router + React 19 + Tailwind v4 public site with a single-module 6-stage enum (`building`, `experimental`, `exploring`, `planned`, `research`) and server-only Supabase RLS waitlist.",
        why: "Marketing directories collapse task, runtime, and cost into buzzwords; distribution into agents requires a structured schema first.",
        where: "Live at `agenyra.space` and `github.com/ayushrai-hub/AGENYRA_product`.",
        forWhom: "AI builders representing their product once and buyers comparing tools on shared fields.",
        impact: "Live stage-honest public surface and RLS waitlist; private taxonomy/search build documented by stage.",
        tradeoff: "Keeps the product graph private while proving the public stage contract and waitlist.",
        links: [
          { href: "/products/agenyra", label: "Product record" },
          { href: "/work/agenyra", label: "Case study" },
          { href: "https://agenyra.space/", label: "Live site" },
        ],
      },
    ],
    walkthrough: {
      title: "LLM systems in products walkthrough: MedVoice, RIE, and GTM-Strato",
      slot: "llm-systems-walkthrough",
      plannedTopics: [
        "MedVoice:spoken line -> catalog alias match -> human confirmation -> integer-paise GST -> idempotent invoice.",
        "Revenue Intelligence Engine: 6-stage operator console from ICP config to approved export.",
        "Why deterministic fallbacks make LLM product pipelines testable in CI.",
      ],
    },
    agentAccess: {
      markdownPath: "/ai-engineering/llm-systems.md",
      searchQuery: "/api/v1/search?q=medvoice+agenyra+llm+systems",
      mcpTool: "compare_projects({ slugs: [\"gtm-strato\", \"revenue-intelligence-engine\"] })",
      powRoutes: [
        { href: "/pow/founding-engineer", label: "BUILDLOG Founding Engineer Lab" },
        { href: "/pow/fde", label: "RELAY FDE Workflow" },
        { href: "/pow/revops-engineering", label: "REVFLOW RevOps Workbench" },
      ],
      keywords: [
        "MedVoice",
        "AGENYRA",
        "GTM-Strato",
        "Revenue Intelligence Engine",
        "idempotent invoice",
        "integer-paise GST",
        "temperature-0 fallback",
      ],
    },
    sections: [
      {
        heading: "MedVoice pipeline: speech proposes, rules decide",
        paragraphs: [
          "The worker speaks an order line. Speech is normalized and matched only against that tenant's medicine catalog. Ambiguous matches stay unconfirmed. Tax is computed with deterministic GST logic in integer paise. An ERP failure is never reported as a completed sale.",
        ],
        diagram: [
          "spoken line",
          "    |",
          "    v",
          "speech adapter (mock by default; Deepgram adapter exists, needs a key)",
          "    |",
          "    v",
          "match only against that tenant's catalog",
          "    |",
          "    v",
          "person confirms ambiguous or risky matches",
          "    |",
          "    v",
          "draft order -> integer GST rules -> confirmed invoice",
          "    |",
          "    v",
          "ERP adapter (mock and CSV exist; Marg, Busy, and Tally are specified, not live)",
        ].join("\n"),
      },
    ],
    evidence: [
      {
        href: "/work/medvoice",
        label: "MedVoice case study",
        note: "Problem, role, and what is not done.",
      },
      {
        href: "/products/medvoice",
        label: "MedVoice product record",
        note: "Stage: building. No public demo.",
      },
      {
        href: "https://github.com/ayushrai-hub/MedVoiceERP",
        label: "MedVoiceERP repository",
        note: "Source. Sampled commits may use the author name MedVoice Agent.",
      },
      {
        href: "/work/gtm-strato",
        label: "GTM-Strato case study",
        note: "SSRF-guarded website extraction + 100-pt deterministic fit rubric.",
      },
      {
        href: "/work/revenue-intelligence-engine",
        label: "Revenue Intelligence Engine case study",
        note: "6-stage GTM pipeline with temperature-0 research and human approval queue.",
      },
      {
        href: "/work/agenyra",
        label: "AGENYRA case study",
        note: "Structured data before distribution into other tools.",
      },
    ],
    related: [
      { href: "/ai-engineering/agents", label: "Agents" },
      { href: "/ai-engineering", label: "AI engineering hub" },
      { href: "/gtm", label: "GTM engineering" },
      { href: "/products", label: "Products" },
    ],
    reading: [
      {
        href: "https://martinfowler.com/articles/patterns-of-distributed-systems/",
        label: "Patterns of Distributed Systems",
        note: "Useful for the idempotency point. MedVoice is not itself a distributed-systems case study.",
      },
    ],
    gaps: [
      "No production speech traffic, live ERP, or wholesaler deployment to report.",
      "No general LLM gateway, prompt-management service, or multi-tenant model router.",
      "Which MedVoice commits were written by me versus coding agents is an open question already listed on the case study.",
    ],
  },
  {
    path: "/ai-engineering/agents",
    title: "AI agents",
    h1: "AI agents",
    label: "AI engineering · Agentic Control & MCP Infrastructure",
    description:
      "Bounded AI agents, dual stateless Streamable HTTP MCP servers (/api/mcp and /api/mcp/docs), SEP-2127 Server Cards, and the ORBIT deterministic agent controller lab.",
    dek: "Agents need typed tool registries, controller-owned permissions, human approval gates, and read-back store verification. Live MCP servers plus the ORBIT workbench.",
    evidenceLevel: "investigation",
    stats: [
      {
        value: "2",
        label: "Live MCP servers",
        context: "Portfolio MCP (/api/mcp, 4 tools) & Docs MCP (/api/mcp/docs, 3 tools)",
      },
      {
        value: "8",
        label: "ORBIT typed tools",
        context: "Read/draft tools separated from controller-gated create_internal_task write",
      },
      {
        value: "8",
        label: "Scripted failure labs",
        context: "Timeout retry, bad args, conflict, duplicate write, prompt injection, budget cap",
      },
      {
        value: "60/60s",
        label: "Draft-11 rate limits",
        context: "Per-client RateLimit headers, JSON-RPC -32602 validation, SEP-2127 cards",
      },
    ],
    journey: {
      started:
        "Started by rejecting unconstrained 'autonomous agent' demos where an LLM picks arbitrary tools, retries non-idempotent writes, and reports success without checking the database.",
      grind:
        "Built two production read-only Streamable HTTP MCP servers on this site (`/api/mcp` and `/api/mcp/docs`) with SEP-2127 Server Cards, ARD v0.91 discovery, WebMCP registration, and a zero-dependency CLI (`packages/cli`), then built the ORBIT controller lab (`/pow/agentic-ai`).",
      achieved:
        "Shipped a complete agent-facing web architecture tested by 50+ assertions in `agentReadiness.test.ts`, `agentSurfaces.test.ts`, and `agenticPowPage.test.tsx`, plus bounded research agents in GTM-Strato and Revenue Intelligence Engine.",
    },
    skillsTable: [
      {
        skill: "Stateless Streamable HTTP & stdio MCP servers",
        category: "Agent Protocols",
        tools: "@modelcontextprotocol/sdk, TypeScript, JSON-RPC 2.0, SEP-2127 Server Cards",
        depthAndProof: "Live `/api/mcp` (`list_projects`, `get_project`, `compare_projects`, `search_portfolio`) & `/api/mcp/docs` (`list_pages`, `get_page`, `search_docs`)",
        tradeoff: "Stateless per-request construction fits serverless functions with zero session memory overhead.",
        status: "shipped",
      },
      {
        skill: "Agent discovery & machine-readable surfaces",
        category: "Agentic Web",
        tools: "ARD v0.91 (`/.well-known/ard.json`), RFC 9727 api-catalog, OpenAPI 3.1, `llms.txt`, `.md` twins, WebMCP",
        depthAndProof: "Every public HTML route has a `.md` twin, `Accept: text/markdown` negotiation, `/ask` NLWeb SSE, and `/feeds/portfolio.jsonl`",
        tradeoff: "Single content source (`src/content/`) prevents drift between human HTML and agent JSON/Markdown.",
        status: "shipped",
      },
      {
        skill: "Controller-owned tool permissions & verification",
        category: "Agent Control",
        tools: "TypeScript state machine, schema validation, idempotency keys, read-back verification",
        depthAndProof: "ORBIT workbench (`/pow/agentic-ai`): Proposed -> Approved -> Executed -> Verified state machine + 8 failure scenarios",
        tradeoff: "An `approved: true` field inside model JSON is rejected as a schema error; permission lives in the controller.",
        status: "simulation",
      },
      {
        skill: "Prompt-injection & untrusted-content isolation",
        category: "Agent Security",
        tools: "Delimited data envelopes, fixed tool registries, step budgets",
        depthAndProof: "ORBIT untrusted ticket injection scenario (`Ignore previous instructions...` quoted as data, never executed); GTM-Strato delimited web text",
        tradeoff: "Retrieved text can never dynamically register a tool or alter the execution plan.",
        status: "shipped",
      },
    ],
    coreBenchmarks: [
      {
        name: "ORBIT Agent Control & Failure Lab",
        href: "/pow/agentic-ai",
        whatItDoes: "Simulates a 9-step bounded agent loop across 4 task cards, 8 typed tools, human write approval, post-write store verification, and 8 re-runnable failure scenarios.",
        domain: "Agentic AI Systems Engineering",
        category: "Deterministic state-machine & tool-boundary benchmark",
        metrics: "4 scripted tasks, 8 tools, 8 failure modes, 0 unverified completions, 13 Vitest tests",
        tradeoff: "Uses scripted plans (`modelCalls: 0`) so controller guardrails, retries, and approval gates are 100% deterministic.",
      },
      {
        name: "Dual Stateless MCP & ARD Discovery Surface",
        href: "/developers",
        whatItDoes: "Serves portfolio and documentation records over Streamable HTTP POST `/api/mcp` and `/api/mcp/docs`, REST `/api/v1/*`, batch `POST /api/v1/batch`, and NLWeb `/ask`.",
        domain: "Agent-Ready Web Infrastructure",
        category: "Protocol compliance & rate-limited read APIs",
        metrics: "7 MCP tools across 2 servers, 14 OpenAPI operations, 60 req/60s draft-11 rate limit, ETag 304 server cards",
        tradeoff: "Exposes strictly read-only tools to public agents; zero external write tools.",
      },
    ],
    solutions: [
      {
        slug: "stateless-mcp-agent-web",
        title: "Dual Streamable HTTP MCP Servers & Agent-Ready Web",
        badge: "Live in production · /api/mcp & /api/mcp/docs",
        visualSlug: "relationship-intelligence-engine",
        what: "A complete agent-native interface layer on `ayushrai.site`: two stateless MCP servers, SEP-2127 Server Cards, ARD v0.91 manifest, RFC 9727 API catalog, `.md` twins, and a zero-dep CLI.",
        how: "`src/lib/agent/mcpServer.ts` and `docsMcp.ts` handle JSON-RPC over Streamable HTTP and local stdio (`npx tsx mcp/server.ts`), returning typed errors (`-32602` `unknown_tool` / `invalid_arguments`) and draft-11 `RateLimit` headers.",
        why: "Agents visiting a portfolio shouldn't scrape brittle DOM nodes when they can call typed MCP tools or negotiate `Accept: text/markdown`.",
        where: "Live at `https://www.ayushrai.site/api/mcp`, `/api/mcp/docs`, and `/developers`.",
        forWhom: "Coding agents (Claude Code, Cursor, Antigravity, MCP clients) and developers verifying projects programmatically.",
        impact: "7 live MCP tools, 100% prerendered HTML-to-Markdown twin parity, and automated contract coverage in `agentReadiness.test.ts`.",
        tradeoff: "Lexical ranking over structured records rather than vector embeddings, ensuring predictable, zero-hallucination search hits.",
        links: [
          { href: "/developers", label: "Developer & MCP docs" },
          { href: "/pow/agentic-ai", label: "ORBIT Agent POW" },
        ],
      },
      {
        slug: "orbit-agent-workbench",
        title: "ORBIT Deterministic Agent Controller Workbench",
        badge: "Live POW lab · /pow/agentic-ai",
        what: "An interactive agent control room demonstrating tool registry validation, human approval state transitions, store read-back verification, and 8 failure scenarios.",
        how: "Browser state machine (`src/lib/orbit/simulation.ts`) separates `Proposed`, `Approved`, `Executed`, and `Verified` states and rejects malformed JSON or unauthorized write calls before any handler executes.",
        why: "A model saying 'I created the escalation task' is not proof; the controller must verify the row exists in the store.",
        where: "Live at `/pow/agentic-ai`.",
        forWhom: "AI systems engineers evaluating agent reliability, tool boundaries, and human-in-the-loop controls.",
        impact: "Interactive workbench, execution trace inspector, live tool-registry tester, and 8 replayable failure modes.",
        tradeoff: "Deterministic simulation rather than a hosted multi-agent LLM runtime.",
        links: [
          { href: "/pow/agentic-ai", label: "Open ORBIT workbench" },
          { href: "/pow/agentic-ai#failures", label: "Failure lab" },
          { href: "/pow/agentic-ai#tools", label: "Tool registry" },
        ],
      },
      {
        slug: "bounded-gtm-research-agents",
        title: "Bounded GTM Research Agents (GTM-Strato & RIE)",
        badge: "88 pytest tests across 2 repos",
        visualSlug: "revenue-intelligence-engine",
        what: "Two task-specific revenue agents where the model synthesizes structured company/account briefs and deterministic Python code owns scoring and export gates.",
        how: "GTM-Strato uses NVIDIA Build API with `[Website fact]` vs `[Hypothesis]` tags; Revenue Intelligence Engine runs temperature-0 account briefs with a deterministic fallback and human approval queue.",
        why: "Unbounded sales agents burn credits and send hallucinated claims to prospects.",
        where: "`ayushrai-hub/GTM-Strato` and `ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE`.",
        forWhom: "B2B GTM teams automating top-of-funnel account research safely.",
        impact: "88 combined pytest tests verifying schema validity, fallback behavior, and human approval gating.",
        tradeoff: "Stops at approved export/filter generation rather than autonomous outbound email sending.",
        links: [
          { href: "/gtm#gtm-agents", label: "GTM agent workflows table" },
          { href: "/work/gtm-strato", label: "GTM-Strato case study" },
          { href: "/work/revenue-intelligence-engine", label: "RIE case study" },
        ],
      },
    ],
    walkthrough: {
      title: "Agentic AI engineering walkthrough: MCP servers, ORBIT controller, and human gates",
      slot: "ai-agents-walkthrough",
      plannedTopics: [
        "Calling `/api/mcp` and `/api/mcp/docs` over Streamable HTTP and inspecting SEP-2127 Server Cards.",
        "Stepping through ORBIT: why `create_internal_task` pauses for controller approval and verifies the store row.",
        "Replaying prompt-injection and tool-timeout scenarios in the Failure Lab.",
      ],
    },
    agentAccess: {
      markdownPath: "/ai-engineering/agents.md",
      searchQuery: "/api/v1/search?q=agents+orbit+mcp",
      mcpTool: "list_projects({ category: \"data\" })",
      powRoutes: [
        { href: "/pow/agentic-ai", label: "ORBIT Agentic AI Lab" },
        { href: "/developers", label: "Live MCP & REST Docs" },
        { href: "/gtm#gtm-agents", label: "GTM Revenue Agents" },
      ],
      keywords: [
        "ORBIT",
        "Model Context Protocol",
        "Streamable HTTP MCP",
        "SEP-2127",
        "ARD v0.91",
        "tool registry",
        "human approval gate",
      ],
    },
    sections: [
      {
        heading: "Why the remote MCP servers are stateless and read-only",
        paragraphs: [
          "A long-lived MCP daemon does not fit a static-first edge deployment. `/api/mcp` and `/api/mcp/docs` build the server per request, validate JSON-RPC schemas, answer in JSON with draft-11 RateLimit headers, and exit. Read-only tools do not need server-initiated notifications or session state.",
          "Giving a public agent write tools against a portfolio or against MedVoice's invoice path would undo the core safety constraint of those systems.",
        ],
      },
    ],
    evidence: [
      {
        href: "/pow/agentic-ai",
        label: "ORBIT Agentic AI proof of work",
        note: "Interactive agent controller, tool registry, approval gate, and 8 failure scenarios.",
      },
      {
        href: "/developers",
        label: "Developer interfaces",
        note: "Markdown twins, OpenAPI 3.1, ARD v0.91, and dual Streamable HTTP MCP servers.",
      },
      {
        href: "/work/gtm-strato",
        label: "GTM-Strato case study",
        note: "Fact-grounded ICP agent with 48 pytest tests.",
      },
      {
        href: "/work/agenyra",
        label: "AGENYRA case study",
        note: "Distribution into agents is a later stage than structured data.",
      },
    ],
    related: [
      { href: "/ai-engineering/llm-systems", label: "LLM systems" },
      { href: "/ai-engineering/llm-evaluation", label: "LLM evaluation" },
      { href: "/ai-engineering", label: "AI engineering hub" },
      { href: "/pow/agentic-ai", label: "Agentic AI proof of work" },
      { href: "/gtm", label: "GTM engineering" },
    ],
    reading: [
      {
        href: "https://modelcontextprotocol.io/",
        label: "Model Context Protocol",
        note: "The protocol the site's MCP server speaks. Listing it is not a certification.",
      },
    ],
    gaps: [
      "No agent eval harness, trace viewer, or production tool-use metrics. The /pow/agentic-ai metrics are computed from scripted scenarios, not from model runs.",
      "No SDK or registry listing. The MCP endpoint is read-only and has no write tools.",
      "WebMCP search on this site registers only when the browser exposes the API. No experimental Chrome run was completed in this repository.",
    ],
  },
  {
    path: "/ai-engineering/rag",
    title: "Retrieval and RAG",
    h1: "Retrieval and RAG",
    label: "AI engineering · Retrieval, Grounding & Local RAG",
    description:
      "Retrieval and RAG engineering: Harbor Meter controlled A/B retrieval experiment, MailU local Gmail RAG on ChromaDB + Ollama, RevenueRoles pgvector schema, and legal NLP notes.",
    dek: "Measure retrieval recall separately from generation accuracy. Local ChromaDB + Ollama RAG in MailU, controlled A/B failure analysis in Harbor Meter, and legal-text notes.",
    evidenceLevel: "investigation",
    stats: [
      {
        value: "12",
        label: "Harbor Meter rows",
        context: "9 scorable + 3 excluded (duplicate HM-05, unverified target, missing passage)",
      },
      {
        value: "8/9 vs 3/9",
        label: "Recall vs accuracy",
        context: "Retrieval recall hits 8/9, yet distractor chunks drop exact match from 6/9 to 3/9",
      },
      {
        value: "100% local",
        label: "MailU RAG stack",
        context: "Gmail OAuth sync -> ChromaDB embeddings -> local Ollama Q&A on disk",
      },
      {
        value: "0",
        label: "Inflated corpus claims",
        context: "Unverified '10,000+ docs' and '60% time reduction' from older copy stay removed",
      },
    ],
    journey: {
      started:
        "Started with an academic/internal investigation into NLP for legal contract analysis (Aug–Dec 2023), exploring document structure, passage retrieval, and assisted review.",
      grind:
        "Stripped unverified volume and time-reduction numbers from older portfolio copy, built MailU (`ayushrai-hub/MailU`) for local Gmail semantic search on ChromaDB + Ollama, and designed the Harbor Meter retrieval experiment (`/pow/ai-research-engineering`).",
      achieved:
        "Demonstrated in Harbor Meter why naive top-k retrieval can hurt exact-match accuracy (6/9 baseline vs 3/9 retrieval when distractor chunks are injected) even when retrieval recall is 8/9.",
    },
    skillsTable: [
      {
        skill: "Retrieval-vs-generation decoupled evaluation",
        category: "RAG Evaluation",
        tools: "TypeScript, exact match, retrieval recall@k, JSON schema checks, causal blocker detection",
        depthAndProof: "Harbor Meter research workbench (`/pow/ai-research-engineering`) with 12 prepared rows and 4 Vitest suites",
        tradeoff: "Scoring recall (8/9) separately from answer accuracy (3/9) exposes distractor-passage interference instead of blaming the base model.",
        status: "simulation",
      },
      {
        skill: "Local vector indexing & private RAG",
        category: "Local RAG",
        tools: "Python, FastAPI, ChromaDB, Ollama, Gmail API OAuth",
        depthAndProof: "MailU (`ayushrai-hub/MailU`): local mailbox sync, zero-shot categorization, and RAG chat",
        tradeoff: "Runs on one local mailbox so private correspondence never leaves disk; not a multi-tenant cloud RAG service.",
        status: "local",
      },
      {
        skill: "Postgres vector schema & lexical hybrid design",
        category: "Data Layer",
        tools: "Supabase Postgres, pgvector, RLS migrations, lexical ranking (`src/lib/agent/search.ts`)",
        depthAndProof: "RevenueRoles pgvector migrations; `ayushrai.site` deterministic lexical search API (`/api/v1/search` & `/ask`)",
        tradeoff: "For small structured catalogs (<500 records), lexical title/tag/summary ranking beats noisy vector similarity.",
        status: "shipped",
      },
      {
        skill: "Domain document structure investigation",
        category: "Applied NLP",
        tools: "Python, Transformers, BERT, contract clause segmentation",
        depthAndProof: "NLP for legal document analysis investigation (`/research/legal-nlp-contracts`, Aug–Dec 2023)",
        tradeoff: "Scoped to assisted review exploration, never autonomous legal advice.",
        status: "studying",
      },
    ],
    coreBenchmarks: [
      {
        name: "Harbor Meter Controlled Retrieval Experiment",
        href: "/pow/ai-research-engineering",
        whatItDoes: "Tests whether adding a fixed bundle of retrieved maintenance passages improves exact-match accuracy over a baseline prompt across 12 industrial log questions.",
        domain: "Retrieval-Augmented Generation (RAG) Research",
        category: "Paired A/B experiment with distractor analysis",
        metrics: "12 rows (9 scorable): Baseline 6/9 exact match vs Retrieval 3/9 (helps 2, hurts 5, no effect 2); Recall 8/9",
        tradeoff: "Shows retrieval hurting accuracy when distractor passages (`40 °C` vs `70 °C` threshold) override correct baseline knowledge.",
      },
      {
        name: "MailU Local Mailbox RAG Pipeline",
        href: "https://github.com/ayushrai-hub/MailU",
        whatItDoes: "Syncs threads via Gmail API, categorizes messages zero-shot, stores embeddings in local ChromaDB, and answers questions through a local Ollama model.",
        domain: "Personal Knowledge & Email Intelligence",
        category: "Local-first vector retrieval & Q&A",
        metrics: "4-stage local pipeline (Gmail OAuth -> normalizer -> ChromaDB -> Ollama)",
        tradeoff: "Zero third-party LLM data leakage; throughput is bound by local hardware.",
      },
    ],
    solutions: [
      {
        slug: "harbor-meter-rag-lab",
        title: "Harbor Meter: When Retrieval Hurts Accuracy",
        badge: "Live POW lab · /pow/ai-research-engineering",
        visualSlug: "mailu",
        what: "An interactive research engineering notebook that scores a 12-row retrieval experiment, isolates data-quality defects, and inspects configuration diffs between baseline, retrieval, and unrun reranking.",
        how: "`src/lib/aiResearchEval.ts` computes normalized exact match, JSON schema validity (`HM-11`), retrieval recall, evidence support labels (`supported`, `partial`, `unsupported`), and causal blockers.",
        why: "Adding RAG is often treated as an automatic upgrade; Harbor Meter proves how unreranked distractor passages degrade exact match from 6/9 to 3/9.",
        where: "Live at `/pow/ai-research-engineering`.",
        forWhom: "AI research engineers and RAG builders evaluating chunk quality and distractor sensitivity.",
        impact: "Interactive dataset filter, metric definition inspector, failure-category breakdown, and config diff checker.",
        tradeoff: "Prepared experiment fixture (`No model was called`); reranking config is intentionally marked `Not run` to demonstrate causal blocker rules.",
        links: [
          { href: "/pow/ai-research-engineering", label: "Open Harbor Meter lab" },
          { href: "/ai-engineering/llm-evaluation", label: "LLM evaluation dossier" },
        ],
      },
      {
        slug: "mailu-local-rag",
        title: "MailU: Local Gmail Semantic Search & Ollama RAG",
        badge: "Public repo · FastAPI + ChromaDB + Ollama",
        visualSlug: "mailu",
        what: "A local email intelligence tool that indexes a personal Gmail inbox into ChromaDB and runs RAG Q&A on a local Ollama model.",
        how: "FastAPI backend syncs messages via Gmail OAuth, normalizes threads, categorizes zero-shot, embeds into ChromaDB, and retrieves context for local Ollama completions.",
        why: "Searching years of private inbox history by relationship context shouldn't require uploading personal mail to a hosted model API.",
        where: "Public GitHub repository (`ayushrai-hub/MailU`).",
        forWhom: "Operators who want local semantic search over their own mailbox.",
        impact: "End-to-end local RAG architecture keeping raw email and vector embeddings on local disk.",
        tradeoff: "Single-mailbox local tool; repository test summary has not been independently re-run in CI here.",
        links: [
          { href: "https://github.com/ayushrai-hub/MailU", label: "GitHub repository" },
          { href: "/gtm#gtm-mailu", label: "GTM showcase entry" },
        ],
      },
      {
        slug: "legal-nlp-contracts",
        title: "NLP for Legal Document Analysis (2023 Investigation)",
        badge: "Research log · Aug – Dec 2023",
        what: "An academic and internal investigation into transformer pipelines for contract structure, clause retrieval, and assisted human review.",
        how: "Explored BERT/transformer classification and passage extraction sketches for regulatory and contract text.",
        why: "Legal review needs passage location and structural assistance, not autonomous legal advice.",
        where: "Documented at `/research/legal-nlp-contracts`.",
        forWhom: "Academic exploration of domain-specific NLP evaluation pitfalls.",
        impact: "Grounded lessons on domain text chunking and why unverified '10,000+ documents' claims were stripped during the portfolio fact-check.",
        tradeoff: "Investigation log only. It is not a peer-reviewed paper or a deployed production legal RAG system.",
        links: [
          { href: "/research/legal-nlp-contracts", label: "Research record" },
          { href: "/research", label: "All research notes" },
        ],
      },
    ],
    walkthrough: {
      title: "Retrieval & RAG walkthrough: Harbor Meter distractor analysis and MailU local RAG",
      slot: "rag-retrieval-walkthrough",
      plannedTopics: [
        "Why Harbor Meter's retrieval recall is 8/9 while exact-match accuracy drops from 6/9 to 3/9.",
        "Inspecting `HM-03` and `HM-05`: distractor passages and duplicate ID hygiene.",
        "MailU architecture: Gmail OAuth -> ChromaDB -> local Ollama inference.",
      ],
    },
    agentAccess: {
      markdownPath: "/ai-engineering/rag.md",
      searchQuery: "/api/v1/search?q=rag+retrieval+mailu",
      mcpTool: "get_page({ path: \"/pow/ai-research-engineering\" })",
      powRoutes: [
        { href: "/pow/ai-research-engineering", label: "Harbor Meter Retrieval Lab" },
        { href: "/pow/ai-benchmark", label: "EVALFORGE Benchmark Lab" },
      ],
      keywords: [
        "RAG",
        "retrieval recall",
        "distractor passages",
        "Harbor Meter",
        "MailU",
        "ChromaDB",
        "Ollama",
        "pgvector",
      ],
    },
    sections: [
      {
        heading: "What I stripped from older copy, and what stands in its place",
        paragraphs: [
          "Earlier portfolio drafts claimed a '60% time reduction' and '10,000+ legal documents' processed, plus an unconfirmed grant name. Those numbers lacked a reproducible audit trail and were deleted.",
          "In their place are three things you can inspect directly: the Harbor Meter paired retrieval experiment (`/pow/ai-research-engineering`), the MailU local ChromaDB + Ollama repository (`ayushrai-hub/MailU`), and the honest research boundary on `/research/legal-nlp-contracts`.",
        ],
      },
    ],
    evidence: [
      {
        href: "/pow/ai-research-engineering",
        label: "Harbor Meter retrieval experiment POW",
        note: "12-row controlled baseline vs retrieval comparison with recall and distractor analysis.",
      },
      {
        href: "https://github.com/ayushrai-hub/MailU",
        label: "MailU repository",
        note: "Local Gmail sync, ChromaDB vector store, and Ollama RAG chat.",
      },
      {
        href: "/research/legal-nlp-contracts",
        label: "NLP for legal document analysis",
        note: "2023 investigation. Retrieval is mentioned; unverified volume metrics are withheld.",
      },
    ],
    related: [
      { href: "/ai-engineering", label: "AI engineering hub" },
      { href: "/pow/ai-research-engineering", label: "AI research engineering POW" },
      { href: "/research", label: "Research" },
      { href: "/ai-engineering/llm-evaluation", label: "LLM evaluation" },
    ],
    reading: [
      {
        href: "https://arxiv.org/abs/2005.11401",
        label: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        note: "Lewis et al. Background. Not my paper.",
      },
    ],
    gaps: [
      "No production multi-tenant vector index, custom embedding fine-tune, or hosted reranker service.",
      "No customer corpus and no permission to describe one.",
      "The public `adaptive-rag` fork on my GitHub is primarily Dhruv Singhal's commits (12 to 1) and is explicitly not claimed as my system.",
    ],
  },
  {
    path: "/software-engineering",
    title: "Software engineering",
    h1: "Software engineering",
    label: "Full-Stack · Data Pipelines · Agent-Ready Web",
    showOnHome: true,
    description:
      "Ayush Rai on software engineering: TypeScript/React/Next.js applications, Python/FastAPI workers, SQLite/Postgres entity-resolution pipelines, MV3 browser extensions, and prerendered agent surfaces.",
    dek: "Prerendered TypeScript/React systems, Python/FastAPI backends, deterministic data pipelines, and 600+ automated tests across public repositories.",
    evidenceLevel: "shipped",
    stats: [
      {
        value: "650+",
        label: "Automated test cases",
        context: "339 RevenueRoles + 242+ this site + 48 GTM-Strato + 40 RIE + 34 SYSTEM-job",
      },
      {
        value: "50+",
        label: "Prerendered routes",
        context: "1:1 HTML and Markdown (.md) twins with JSON-LD, OpenAPI 3.1, and dual MCP",
      },
      {
        value: "12+",
        label: "Public GitHub repos",
        context: "Next.js monorepos, FastAPI workers, zero-dep Python CLIs, Chrome MV3 extension",
      },
      {
        value: "4",
        label: "Infra & delivery POW labs",
        context: "Founding Engineer, DevOps Control Room, Cloud Ops Lab, FDE RELAY",
      },
    ],
    journey: {
      started:
        "Started in 2023 shipping responsive React + TypeScript client sites (Iha by Himani, Praful H.) and early Next.js community platforms (Shiksha-Mitra, Expert-O).",
      grind:
        "Moved from marketing front ends into full-stack monorepos and data pipelines in 2025–2026: building ATS ingestion connectors, PGlite/Postgres provenance stores, zero-dependency SQLite audit CLIs, NestJS domain state machines, and this site's static prerender + serverless MCP architecture.",
      achieved:
        "Shipped RevenueRoles (`revenueroles.in`, 339 tests), GTM-Strato (48 tests), Revenue Intelligence Engine (40 tests), Relationship Intelligence Engine (34 tests), Overlay Text Box MV3 extension, and an agent-native portfolio with 36 Vitest test files.",
    },
    skillsTable: [
      {
        skill: "TypeScript, React 19 & Next.js App Router",
        category: "Frontend & SSR/SSG",
        tools: "TypeScript, React, Next.js 16, Vite, Tailwind CSS, Playwright, Vitest",
        depthAndProof: "This site (`ayush-work`, prerendered to static HTML + `.md` twins), RevenueRoles (`revenueroles.in`), AGENYRA (`agenyra.space`), RIE console",
        tradeoff: "Build-time prerendering catches broken routes, missing canonicals, and leaked strings before deploy instead of at runtime.",
        status: "shipped",
      },
      {
        skill: "Python services, CLIs & FastAPI workers",
        category: "Backend & Pipelines",
        tools: "Python 3.11, FastAPI, SQLAlchemy, Pydantic, Streamlit, zero-dep stdlib CLIs, pytest",
        depthAndProof: "RevenueRoles classification worker (45 pytest), GTM-Strato (48 pytest), RIE backend (40 pytest), AIworks Leads zero-dep CLI (6 unittest suites)",
        tradeoff: "Keeps data normalization, SSRF validation, and 100-point scoring in fast, unit-tested Python modules.",
        status: "shipped",
      },
      {
        skill: "Relational databases & entity resolution",
        category: "Data & Storage",
        tools: "PostgreSQL, Supabase (RLS + pgvector), PGlite, SQLite, Redis queues",
        depthAndProof: "RevenueRoles Supabase migrations; Relationship Intelligence Engine PGlite/Postgres 5-state provenance; AIworks Leads pre-run SQLite backups; SpiderWeb",
        tradeoff: "Conservative entity resolution preserves canonical action links and flags identity collisions rather than auto-merging.",
        status: "shipped",
      },
      {
        skill: "Agent-native web & API contract engineering",
        category: "APIs & Protocols",
        tools: "OpenAPI 3.1, Streamable HTTP MCP, RFC 9727, ARD v0.91, draft-11 RateLimit headers, NLWeb SSE",
        depthAndProof: "`src/lib/agent/*` on this site: `/api/v1/*`, `/api/v1/batch`, `/api/mcp`, `/api/mcp/docs`, `packages/cli`",
        tradeoff: "Strict JSON error envelopes (`code`, `message`, `hint`, `docs`) and 60 req/60s rate limits keep public endpoints predictable.",
        status: "shipped",
      },
      {
        skill: "Browser extensions & DOM automation",
        category: "Client Tooling",
        tools: "Chrome Extension Manifest V3, Vanilla JS, DOM event simulation, Playwright",
        depthAndProof: "Overlay Text Box (`ayushrai-hub/overlay-text-box-extension`) character-by-character controlled input tool",
        tradeoff: "Zero external bundle dependencies inside the extension keeps permissions narrow and DOM injection fast.",
        status: "shipped",
      },
    ],
    coreBenchmarks: [
      {
        name: "Public Output & Agent Contract Test Suite",
        href: "https://github.com/ayushrai-hub/ayush-work",
        whatItDoes: "Prerenders every public route in Node, verifies 1:1 HTML/Markdown twin parity, validates all internal links and search hits, tests OpenAPI 3.1 and MCP JSON-RPC schemas, and scans every output byte for withheld claims or unapproved phone numbers.",
        domain: "Full-Stack Verification & CI Gates",
        category: "End-to-end build, contract, and leak verification",
        metrics: "36 Vitest test files + Playwright E2E suite; 14 OpenAPI operations; 0 leaked internal markers",
        tradeoff: "Every content or route change must pass prerender and contract assertions before merge.",
      },
      {
        name: "DevOps, Cloud & Founding Engineer Control Labs",
        href: "/pow/devops-engineer",
        whatItDoes: "Three interactive systems engineering workbenches modeling CI/CD dependency waves and release gates (`/pow/devops-engineer`), cloud request flow and scaling bottlenecks (`/pow/cloud-engineer`), and zero-to-one MVP scope/incident trade-offs (`/pow/founding-engineer`).",
        domain: "Delivery, Infrastructure & Systems Design",
        category: "Interactive simulation + repository evidence audit",
        metrics: "11-stage cloud deployment workbench, 8 release-gate failure modes, verified Dockerfile/CI audit across repos",
        tradeoff: "Separates what is verified in public repository Dockerfiles/workflows from simulated operational incidents.",
      },
    ],
    solutions: [
      {
        slug: "personal-portfolio",
        title: "Agent-Native Portfolio & Dual MCP Platform (This Site)",
        badge: "Live · Vite + React + Serverless REST & MCP",
        visualSlug: "mylifeos",
        what: "A single-source-of-truth publishing and API system where `src/content/` drives prerendered HTML, Markdown twins (`.md`), `llms.txt`, lexical search, an OpenAPI 3.1 REST API, and two Streamable HTTP MCP servers.",
        how: "Vite + React + TypeScript front end prerendered via `scripts/prerender.mjs`; Vercel/Netlify serverless handlers serve `/api/v1/*`, `/api/v1/batch`, `/ask` (NLWeb SSE), `/api/mcp`, and `/api/mcp/docs` with draft-11 RateLimit headers and ETag caching.",
        why: "Most portfolios are static brochures that break for coding agents or drift between pages; this system treats human readers and AI agents as equal first-class callers.",
        where: "Live at `https://www.ayushrai.site` and public repo `ayushrai-hub/ayush-work`.",
        forWhom: "Hiring managers, engineering leads, and autonomous coding agents verifying work.",
        impact: "50+ prerendered routes, 2 live MCP servers, zero-dependency CLI (`packages/cli`), and 36 automated Vitest test suites.",
        tradeoff: "All facts live in typed TypeScript modules rather than an external CMS, trading live web editing for compile-time and test-time guarantees.",
        links: [
          { href: "/developers", label: "Developer & API docs" },
          { href: "https://github.com/ayushrai-hub/ayush-work", label: "GitHub repository" },
          { href: "/pow/founding-engineer", label: "Founding Engineer POW" },
        ],
      },
      {
        slug: "revenueroles-platform",
        title: "RevenueRoles Multi-Source Job Discovery Monorepo",
        badge: "Live at revenueroles.in · 339 tests",
        visualSlug: "revenueroles",
        what: "A full-stack job platform that ingests postings from 4 ATS providers, classifies technical revenue roles by actual work described, and deduplicates conservatively.",
        how: "Next.js web/API monorepo + Inngest scheduled discovery with concurrency locks + Python FastAPI classification worker + Supabase Postgres with pgvector and RLS.",
        why: "Job titles across Greenhouse, Lever, Ashby, and RemoteOK are noisy; normalizing and classifying descriptions in a typed pipeline makes roles comparable.",
        where: "Live at `https://revenueroles.in` and `github.com/ayushrai-hub/RevenueRoles`.",
        forWhom: "GTM, RevOps, and Forward Deployed Engineers.",
        impact: "71 verified roles and 58% compensation coverage on the live homepage snapshot (18 Oct 2026); 45 pytest + 294 TypeScript tests.",
        tradeoff: "Conservative deduplication never overwrites the canonical employer apply link.",
        links: [
          { href: "/products/revenueroles", label: "Product spec" },
          { href: "/work/revenueroles", label: "Case study" },
          { href: "https://revenueroles.in", label: "Live site" },
        ],
      },
      {
        slug: "overlay-text-box",
        title: "Overlay Text Box (Chrome Extension MV3)",
        badge: "Open source · Manifest V3",
        visualSlug: "overlay-text-box",
        what: "A Manifest V3 Chrome extension that overlays a floating editor and types into target page inputs character-by-character with configurable pace and pause/resume controls.",
        how: "Vanilla JavaScript + HTML + Chrome Extension MV3 content scripts that dispatch controlled key/input events while temporarily locking focus traps.",
        why: "Browser automation demos and controlled input testing often fail on custom input handlers when text is pasted all at once.",
        where: "Public GitHub repository (`ayushrai-hub/overlay-text-box-extension`).",
        forWhom: "Developers and testers recording demos or testing character-level input handlers.",
        impact: "Lightweight zero-dependency MV3 extension with start/stop, random human-like jitter option, and visual progress feedback.",
        tradeoff: "Focused single-purpose DOM utility; no background telemetry or cloud sync.",
        links: [
          { href: "/work/overlay-text-box", label: "Case study" },
          { href: "https://github.com/ayushrai-hub/overlay-text-box-extension", label: "GitHub repo" },
        ],
      },
    ],
    walkthrough: {
      title: "Software engineering walkthrough: monorepo pipelines, prerendering, and MCP architecture",
      slot: "software-engineering-walkthrough",
      plannedTopics: [
        "How `src/content/` compiles into prerendered HTML, Markdown twins, OpenAPI 3.1, and dual MCP servers.",
        "Inside RevenueRoles: Inngest discovery locks, Python FastAPI worker, and 339 unit/integration tests.",
        "Walking the DevOps Control Room and Cloud Operations Lab.",
      ],
    },
    agentAccess: {
      markdownPath: "/software-engineering.md",
      searchQuery: "/api/v1/search?q=typescript+nextjs+fastapi",
      mcpTool: "list_projects({ limit: 10 })",
      powRoutes: [
        { href: "/pow/founding-engineer", label: "Founding Engineer POW" },
        { href: "/pow/devops-engineer", label: "DevOps Engineer POW" },
        { href: "/pow/cloud-engineer", label: "Cloud Engineer POW" },
        { href: "/pow/fde", label: "Forward Deployed Engineer POW" },
      ],
      keywords: [
        "TypeScript",
        "Next.js",
        "FastAPI",
        "PostgreSQL",
        "SQLite",
        "Manifest V3",
        "Vitest",
        "Playwright",
      ],
    },
    sections: [
      {
        heading: "Why distributed systems stay a named gap, not a doorway page",
        paragraphs: [
          "MedVoice specifies PostgreSQL, Redis, and idempotent invoice keys, and SpiderWeb includes an optional Redis ingestion worker in Docker Compose. That is careful application engineering. It is not a claim of operating multi-region consensus, Kafka clusters, or high-throughput distributed systems in production. There is no `/software-engineering/distributed-systems` URL on this site for that reason.",
        ],
      },
    ],
    evidence: [
      {
        href: "https://github.com/ayushrai-hub/ayush-work",
        label: "This site's repository (ayush-work)",
        note: "Content layer, prerender pipeline, REST API, dual MCP servers, 36 Vitest test files.",
      },
      {
        href: "/work/revenueroles",
        label: "RevenueRoles case study",
        note: "Next.js + FastAPI + Inngest + Supabase Postgres monorepo with 339 tests.",
      },
      {
        href: "/work/relationship-intelligence-engine",
        label: "Relationship Intelligence Engine",
        note: "10-stage TypeScript + PGlite/Postgres pipeline with 34 Vitest tests.",
      },
      {
        href: "/work/overlay-text-box",
        label: "Overlay Text Box",
        note: "Chrome extension (Manifest V3). Open source.",
      },
      {
        href: "/work/iha-by-himani",
        label: "Iha by Himani",
        note: "Client marketing site, 2023.",
      },
      {
        href: "/work/praful-h",
        label: "Praful H. Professional Site",
        note: "Client portfolio live on Netlify, 2024.",
      },
    ],
    related: [
      { href: "/gtm", label: "GTM engineering" },
      { href: "/software-services", label: "Software services" },
      { href: "/open-source", label: "Open source" },
      { href: "/products", label: "Products" },
      { href: "/ai-engineering/llm-systems", label: "LLM systems" },
    ],
    reading: [
      {
        href: "https://react.dev/",
        label: "React docs",
        note: "The UI library this site and several products use.",
      },
    ],
    gaps: [
      "No distributed-systems page. Idempotency in MedVoice is not a distributed-systems practice narrative.",
      "No published performance budget, load test, or multi-region design.",
      "Backend depth varies by project. I do not collapse Next.js sites and a NestJS monolith into one seniority claim.",
    ],
  },
  {
    path: "/gtm-revops",
    title: "GTM and RevOps",
    h1: "GTM and RevOps systems",
    label: "AI × Automation × GTM × Revenue",
    showOnHome: true,
    description:
      "Ayush Rai on GTM engineering and revenue operations: seven public GTM and revenue-data systems (RevenueRoles, GTM-Strato ICP Finder, Revenue Intelligence Engine, Relationship Intelligence Engine, AIworks Lead Qualification Pipeline, SpiderWeb, MailU) with deterministic scoring, field provenance, and human approval gates.",
    dek: "Seven revenue-data and GTM engineering systems I built, with 460+ automated tests, deterministic 100-point scoring, field provenance, and human approval gates.",
    evidenceLevel: "mixed",
    stats: [
      {
        value: "7",
        label: "Public GTM systems",
        context: "RevenueRoles, GTM-Strato, RIE, Relationship Engine, AIworks Leads, SpiderWeb, MailU",
      },
      {
        value: "467+",
        label: "Tests in GTM repos",
        context: "339 RevenueRoles + 48 GTM-Strato + 40 RIE + 34 SYSTEM-job + 6 AIworks suites",
      },
      {
        value: "0–100",
        label: "Deterministic rubrics",
        context: "5-component ICP scorer in GTM-Strato & 6-component account scorer in RIE",
      },
      {
        value: "5-state",
        label: "Field provenance",
        context: "verified, inferred, unverified, conflicting, missing + mandatory *_source_url",
      },
    ],
    journey: {
      started:
        "Started by examining why outbound and RevOps pipelines break: scraped CSVs without source URLs, switchboard numbers masquerading as direct phones, duplicate accounts across sources, and LLM-invented lead scores.",
      grind:
        "Built 7 focused GTM systems in 2026 across Python (FastAPI, Streamlit, SQLite, zero-dep CLI) and TypeScript (Next.js, PGlite, Postgres, Inngest), plus the interactive REVFLOW (`/pow/revops-engineering`) and RELAY (`/pow/fde`) workbenches.",
      achieved:
        "Shipped `revenueroles.in` in production (71 verified roles, 58% salary coverage on 18 Oct 2026), open-sourced 6 GTM pipelines with 467+ tests, and generated platform-ready filters for Apollo.io, LinkedIn Sales Navigator, and Clay.",
    },
    skillsTable: [
      {
        skill: "Multi-source discovery & SSRF-safe extraction",
        category: "Data Ingestion",
        tools: "Python, TypeScript, Inngest, Playwright, Greenhouse/Lever/Ashby/RemoteOK connectors",
        depthAndProof: "RevenueRoles (4 ATS connectors + fixtures); GTM-Strato (5-page SSRF-guarded extractor); Relationship Intelligence Engine (YC + GitHub signals)",
        tradeoff: "Strict DNS/IP validation and conservative scraping limits prevent SSRF and rate-limit bans.",
        status: "shipped",
      },
      {
        skill: "Entity resolution & cross-run deduplication",
        category: "Identity & Hygiene",
        tools: "PostgreSQL, PGlite, SQLite, deterministic `lead_id` hashing, 2-stage CSV detectors",
        depthAndProof: "AIworks Leads (`duplicate_previous_run` & `possible_duplicate_identity`); SpiderWeb (import/update/dedup/reject counters); RevenueRoles",
        tradeoff: "Flags same-name/different-email collisions for manual review instead of silently overwriting contact records.",
        status: "shipped",
      },
      {
        skill: "Field-level provenance & phone qualification",
        category: "Data Quality",
        tools: "Zero-dep Python rule engines, Pydantic, Zod, 5-state provenance wrappers",
        depthAndProof: "Relationship Intelligence Engine (`verified`/`inferred`/`unverified`/`conflicting`/`missing`); AIworks Leads (`direct_business` != switchboard + `*_source_url`)",
        tradeoff: "Routes high-fit leads missing one source URL into `research_only.csv` rather than polluting `accepted_leads.csv`.",
        status: "shipped",
      },
      {
        skill: "Deterministic 100-point ICP & account scoring",
        category: "Qualification",
        tools: "Pure Python scoring engines, FastAPI, Streamlit, pytest",
        depthAndProof: "GTM-Strato (Evidence 30, Problem 25, Triggers 15, Reachability 15, Clarity 15); RIE (ICP 30, Growth 20, Hiring 15, Tech 15, GTM 10, Contact 10)",
        tradeoff: "Zero LLM involvement in numeric scoring so every point is explainable and unit-tested.",
        status: "shipped",
      },
      {
        skill: "Prospecting filter & CRM gate orchestration",
        category: "Execution & Governance",
        tools: "Apollo.io, LinkedIn Sales Navigator, Clay filter schemas, HubSpot v3 API (studying), approval queues",
        depthAndProof: "GTM-Strato outputs Apollo/Sales Nav/Clay filter definitions; RIE gates CSV/JSON/XLSX export behind human approval; REVFLOW workbench",
        tradeoff: "Holds every researched account in an approval queue before any CRM write or export.",
        status: "shipped",
      },
    ],
    coreBenchmarks: [
      {
        name: "GTM-Strato 100-Point ICP Fit Rubric",
        href: "https://github.com/ayushrai-hub/GTM-Strato",
        whatItDoes: "Scores extracted company profiles and candidate ICP segments across Evidence (30%), Problem Fit (25%), Buying Triggers (15%), Reachability (15%), and Commercial Clarity (15%), then outputs Apollo, Sales Nav, and Clay filters.",
        domain: "GTM Engineering & ICP Discovery",
        category: "Fact-grounded extraction + deterministic rubric",
        metrics: "48 pytest tests, up to 5 scraped pages/run, 3 ICP segments + 3 platform filter payloads per company",
        tradeoff: "Forces pricing to 'Not found' when scraped pages lack pricing tokens, penalizing Commercial Clarity honestly.",
      },
      {
        name: "AIworks Zero-Dependency Lead Qualification Audit",
        href: "https://github.com/ayushrai-hub/leads",
        whatItDoes: "Audits B2B lead CSVs for mandatory per-field public `*_source_url`s, decision-maker seniority, domain-matched corporate email, non-switchboard direct phone, and cross-run SQLite deduplication.",
        domain: "B2B Lead Verification & Provenance",
        category: "Deterministic rule engine & immutable audit store",
        metrics: "0 external dependencies, pre-run SQLite backup, 3 output CSV buckets + JSON/text run report, 6 unittest suites",
        tradeoff: "Refuses leads where `direct_business` phone equals `company_switchboard_phone`.",
      },
      {
        name: "REVFLOW Revenue Operations Workbench",
        href: "/pow/revops-engineering",
        whatItDoes: "Simulates ingestion, canonical normalization, contact vs account dedupe, freshness-aware enrichment conflict resolution, 4-axis scoring, ordered routing, idempotent CRM sync, and 8 failure scenarios.",
        domain: "Revenue Operations Engineering",
        category: "Interactive pipeline & failure simulation",
        metrics: "12 architecture nodes, 8 deterministic failure scenarios, 7 live invariant checks",
        tradeoff: "Runs entirely on synthetic `.example` records in the browser so visitors can trigger rate limits and partial writes safely.",
      },
    ],
    solutions: [
      {
        slug: "revenueroles",
        title: "RevenueRoles: Live Technical Revenue Job Platform",
        badge: "Live at revenueroles.in · 45 pytest + 294 TS tests",
        visualSlug: "revenueroles",
        what: "A live job platform that discovers GTM Engineer, RevOps Engineer, and FDE openings directly from employer ATS boards and classifies them by the work described.",
        how: "Inngest scheduled discovery pulls from Greenhouse, Lever, Ashby, and RemoteOK; Python FastAPI worker normalizes schemas and classifies role families; Supabase Postgres (pgvector + RLS) powers the Next.js app.",
        why: "Companies post GTM Engineering work under dozens of inconsistent titles; title-keyword search misses half the market.",
        where: "Live at `https://revenueroles.in` and `github.com/ayushrai-hub/RevenueRoles`.",
        forWhom: "Engineers and hiring teams in GTM, RevOps, and Forward Deployed Engineering.",
        impact: "71 verified roles and 58% compensation coverage on the live homepage snapshot (checked 18 Oct 2026); 339 automated tests.",
        tradeoff: "Work-based classification costs more per posting than title regexes and preserves the original employer apply URL on every merge.",
        links: [
          { href: "https://revenueroles.in", label: "Live site" },
          { href: "/work/revenueroles", label: "Case study" },
          { href: "https://github.com/ayushrai-hub/RevenueRoles", label: "GitHub repo" },
        ],
      },
      {
        slug: "gtm-strato",
        title: "GTM-Strato (ICP Finder) & Platform Filter Generator",
        badge: "Public repo · 48 pytest tests",
        visualSlug: "gtm-strato",
        what: "Python + Streamlit workbench that turns a company URL into an evidence-labeled profile, 3 scored ICP segments, buyer personas, and ready-to-use Apollo.io, LinkedIn Sales Navigator, and Clay filters.",
        how: "`website_extractor.py` (SSRF-hardened) -> `nvidia_client.py` (`[Website fact]` vs `[Hypothesis]`) -> `scoring_engine.py` (100-pt deterministic rubric) -> `data/icp_finder.sqlite`.",
        why: "Bridges the gap between raw website text and executable prospecting filters without letting an LLM invent fit scores.",
        where: "Public repository `ayushrai-hub/GTM-Strato`.",
        forWhom: "GTM engineers building targeted outbound campaigns.",
        impact: "48 automated pytest tests across grounding, scoring, SSRF security, database, and UI.",
        tradeoff: "Local Streamlit app requiring user `NVIDIA_API_KEY` for live inference.",
        links: [
          { href: "/work/gtm-strato", label: "Case study" },
          { href: "https://github.com/ayushrai-hub/GTM-Strato", label: "GitHub repo" },
          { href: "/gtm", label: "Full /gtm showcase" },
        ],
      },
      {
        slug: "rie-and-aiworks",
        title: "Revenue Intelligence Engine & AIworks Lead Pipeline",
        badge: "40 pytest tests + Zero-dep SQLite CLI",
        visualSlug: "revenue-intelligence-engine",
        what: "Two complementary qualification systems: RIE scores 42 synthetic accounts and gates temperature-0 research behind an operator approval queue; AIworks Leads enforces per-field source URLs and direct-phone rules on researched CSV batches.",
        how: "RIE runs FastAPI + SQLAlchemy + Next.js across 6 operator stages (`cashmaker-two.vercel.app`); AIworks runs pure Python 3.9+ with pre-run SQLite backups and immutable timestamped output folders.",
        why: "Shows both sides of revenue data engineering: automated account scoring/research and strict provenance auditing on human-researched lists.",
        where: "`ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE` and `ayushrai-hub/leads`.",
        forWhom: "RevOps and GTM teams enforcing CRM hygiene before import.",
        impact: "40 pytest tests + 6 committed stage screenshots in RIE; 6 end-to-end unittest suites and 3 deterministic output CSV buckets in AIworks Leads.",
        tradeoff: "RIE uses synthetic data and mock enrichment; neither writes directly to a live production CRM.",
        links: [
          { href: "/work/revenue-intelligence-engine", label: "RIE case study" },
          { href: "/work/aiworks-leads", label: "AIworks Leads case study" },
          { href: "/pow/revops-engineering", label: "REVFLOW workbench" },
        ],
      },
    ],
    walkthrough: {
      title: "GTM & RevOps systems walkthrough: 7 repositories, 100-point scoring, and approval gates",
      slot: "gtm-revops-domain-walkthrough",
      plannedTopics: [
        "RevenueRoles: ATS ingestion -> FastAPI classification -> conservative deduplication.",
        "GTM-Strato & AIworks Leads: fact-vs-hypothesis grounding, mandatory source URLs, and Apollo/Sales Nav/Clay filters.",
        "Revenue Intelligence Engine & REVFLOW: 100-point rubric and human approval queue before CRM export.",
      ],
    },
    agentAccess: {
      markdownPath: "/gtm-revops.md",
      searchQuery: "/api/v1/search?q=gtm+revops+revenueroles+strato",
      mcpTool: "list_projects({ category: \"data\" })",
      powRoutes: [
        { href: "/gtm", label: "Flagship /gtm Engineering Showcase" },
        { href: "/pow/revops-engineering", label: "REVFLOW RevOps Workbench" },
        { href: "/pow/fde", label: "RELAY FDE Account Workflow" },
        { href: "/pow/product-management", label: "RevenueRoles PM Notebook" },
      ],
      keywords: [
        "GTM engineering",
        "RevOps",
        "RevenueRoles",
        "GTM-Strato",
        "Revenue Intelligence Engine",
        "AIworks Leads",
        "Relationship Intelligence Engine",
        "SpiderWeb",
        "Clay",
        "Apollo.io",
      ],
    },
    sections: [
      {
        heading: "Supporting systems: Relationship Intelligence Engine, SpiderWeb, and MailU",
        paragraphs: [
          "Relationship Intelligence Engine (`ayushrai-hub/SYSTEM-job`, 34 Vitest tests) discovers technical founders and companies hiring AI/ML engineers from the YC directory, GitHub signals, and accelerator portfolios, wrapping every field in a 5-state provenance envelope (`verified`, `inferred`, `unverified`, `conflicting`, `missing`).",
          "SpiderWeb (`ayushrai-hub/SpiderWeb`) turns a personal LinkedIn data export into a deduplicated relationship graph with 2-stage CSV detection and per-file import/update/dedup/reject counters. MailU (`ayushrai-hub/MailU`) syncs Gmail locally into ChromaDB for zero-shot categorization and Ollama RAG Q&A.",
        ],
      },
      {
        heading: "Next engineering milestones",
        paragraphs: [
          "Wire a live Apollo enrichment adapter behind the Revenue Intelligence Engine's provider interface with credit accounting and rate-limit retries; push approved records from RIE and AIworks Leads into a HubSpot developer sandbox keyed on company domain; call the GTM-Strato and RIE scoring endpoints from a Clay HTTP API column.",
        ],
      },
    ],
    evidence: [
      {
        href: "https://revenueroles.in",
        label: "RevenueRoles (live site)",
        note: "71 verified roles and 58% compensation coverage on 18 October 2026.",
      },
      {
        href: "https://github.com/ayushrai-hub/RevenueRoles",
        label: "RevenueRoles repository",
        note: "Web app, API, Python pipeline worker, 45 pytest + 294 TS tests.",
      },
      {
        href: "https://github.com/ayushrai-hub/GTM-Strato",
        label: "GTM-Strato (ICP Finder) repository",
        note: "SSRF-guarded website extraction, fact-vs-hypothesis separation, 100-pt fit score, Apollo/Sales Nav/Clay filters, 48 pytest tests.",
      },
      {
        href: "https://github.com/ayushrai-hub/leads",
        label: "AIworks Lead Qualification Pipeline repository",
        note: "Zero-dependency Python CLI and SQLite verification store with mandatory per-field source URLs.",
      },
      {
        href: "https://github.com/ayushrai-hub/SYSTEM-job",
        label: "Relationship Intelligence Engine repository",
        note: "Public-source pipeline with 5-state field-level provenance and 34 tests.",
      },
      {
        href: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE",
        label: "Revenue Intelligence Engine repository",
        note: "Synthetic-data demo with 40 pytest tests and a human approval queue.",
      },
      {
        href: "https://github.com/ayushrai-hub/SpiderWeb",
        label: "SpiderWeb repository",
        note: "LinkedIn export entity resolution and relationship graph.",
      },
      {
        href: "https://github.com/ayushrai-hub/MailU",
        label: "MailU repository",
        note: "Local Gmail sync and Ollama RAG tool.",
      },
    ],
    related: [
      { href: "/gtm", label: "Full GTM engineering showcase" },
      { href: "/pow/revops-engineering", label: "REVFLOW RevOps workbench" },
      { href: "/pow/fde", label: "RELAY FDE workflow" },
      { href: "/ai-engineering/llm-systems", label: "LLM systems in products" },
      { href: "/ai-engineering/llm-evaluation", label: "LLM evaluation" },
      { href: "/software-engineering", label: "Software engineering" },
      { href: "/contact", label: "Contact" },
    ],
    reading: [],
    gaps: [
      "No experience in a sales, RevOps or CRM-admin role, and no live paid CRM, Clay or Apollo API integration committed in these repositories yet.",
      "No customer, user or commercial pipeline-dollar figures for any system on this page.",
      "The Revenue Intelligence Engine uses fictional data only. It is not evidence of results on real leads.",
      "The Relationship Intelligence Engine is a personal research tool, and its own audit notes were not independently re-run.",
    ],
  },
  {
    path: "/software-services",
    title: "Software services",
    h1: "Software services",
    label: "Services · GTM Systems, AI Workflows & Web Products",
    showOnHome: true,
    description:
      "Ayush Rai freelance and contract software services: GTM data and qualification pipelines, bounded AI workflows, and high-trust product or client web applications.",
    dek: "Custom GTM pipelines, human-gated AI workflows, and stage-honest web applications, scoped from systems I have already shipped.",
    evidenceLevel: "shipped",
    stats: [
      {
        value: "3",
        label: "Shipped client & brand sites",
        context: "Praful H. (UK tech leader), Iha by Himani (art studio), AyushMushrooms MVP",
      },
      {
        value: "7",
        label: "Reference GTM/AI builds",
        context: "RevenueRoles, GTM-Strato, RIE, AIworks Leads, Relationship Engine, MedVoice, AGENYRA",
      },
      {
        value: "<24 hrs",
        label: "Direct response window",
        context: "Email, phone (+91 7440567944), WhatsApp, or Calendly scoping call",
      },
      {
        value: "100%",
        label: "Code & repo handoff",
        context: "Clean Git repository, automated tests, and operational runbook on delivery",
      },
    ],
    journey: {
      started:
        "Started in early 2023 delivering custom React + TypeScript sites for studio and executive clients (Iha by Himani, Praful H.) where credibility, load speed, and zero template fluff mattered.",
      grind:
        "Expanded into lead-capture MVPs (AyushMushrooms, Expert-O) and full-stack AI/GTM systems (RevenueRoles, GTM-Strato, AIworks Leads, MedVoice) with strict validation and automated test suites.",
      achieved:
        "A repeatable delivery practice: define the exact user action, cut scope to the smallest verifiable loop, keep AI proposals behind deterministic rules, and hand over tested code.",
    },
    skillsTable: [
      {
        skill: "GTM data & lead-qualification pipelines",
        category: "Revenue Engineering",
        tools: "Python, FastAPI, Streamlit, SQLite, PostgreSQL, Apollo/Sales Nav/Clay filter generation",
        depthAndProof: "GTM-Strato (48 pytest), AIworks Lead Qualification CLI (zero-dep SQLite), Revenue Intelligence Engine (40 pytest)",
        tradeoff: "Prioritizes field provenance (`*_source_url`) and deterministic 100-pt scoring over unverified bulk scraping.",
        status: "shipped",
      },
      {
        skill: "Bounded AI product workflows",
        category: "AI Engineering",
        tools: "NestJS, Next.js, FastAPI, OpenAI/NVIDIA Build APIs, deterministic fallbacks, approval gates",
        depthAndProof: "MedVoice voice-to-invoice state machine; RIE human approval queue; ORBIT tool controller",
        tradeoff: "Models propose drafts or candidate matches; deterministic code and humans confirm every state write.",
        status: "shipped",
      },
      {
        skill: "Credibility-first web apps & MVPs",
        category: "Web & Product",
        tools: "Next.js, React, TypeScript, Tailwind CSS, Supabase, Vercel, Netlify",
        depthAndProof: "Praful H. (`praful-h.netlify.app`), Iha by Himani (`ihabyhimani.com`), AyushMushrooms (`ayush-mushroom.vercel.app`), AGENYRA",
        tradeoff: "Ships clean typography, schema.org JSON-LD, and working inquiry flows before heavy commerce or auth bloat.",
        status: "shipped",
      },
      {
        skill: "Agent-ready documentation & MCP surfaces",
        category: "Developer Experience",
        tools: "OpenAPI 3.1, Streamable HTTP MCP, `.md` twins, `llms.txt`, SEP-2127 Server Cards",
        depthAndProof: "`ayushrai.site` dual MCP servers (`/api/mcp` & `/api/mcp/docs`) and prerender pipeline",
        tradeoff: "Makes documentation and product catalogs directly queryable by LLM agents without custom scrapers.",
        status: "shipped",
      },
    ],
    coreBenchmarks: [
      {
        name: "RELAY Forward-Deployed Delivery Sequence",
        href: "/pow/fde/relay#deployment",
        whatItDoes: "A 6-step engagement blueprint from problem scoping and data-contract definition to deterministic scoring, human approval gating, and runbook handoff.",
        domain: "Forward Deployed & Client Engineering",
        category: "Delivery & handoff architecture",
        metrics: "5 stage-flow gates, 4 failure-recovery patterns, operational runbook handoff",
        tradeoff: "Cuts scope until the first vertical slice is verifiable end-to-end before adding secondary integrations.",
      },
      {
        name: "BUILDLOG Zero-to-One MVP Scope & Release Gate",
        href: "/pow/founding-engineer",
        whatItDoes: "Interactive MVP scoping, architecture selection (monolith vs services), 12-item release checklist, and post-deploy incident triage.",
        domain: "Founding & Product Engineering",
        category: "MVP scoping & release discipline",
        metrics: "12 release checks, 6 architecture decision logs, stack maps across shipped products",
        tradeoff: "Defaults to a modular monolith and strict schema checks rather than premature microservices.",
      },
    ],
    solutions: [
      {
        slug: "praful-h",
        title: "Praful H. Executive Portfolio & Credibility Surface",
        badge: "Shipped client site · Live on Netlify",
        visualSlug: "praful-h",
        what: "A credibility-first professional site for a UK-based technology leader covering career timeline, leadership narrative, and direct contact.",
        how: "React + TypeScript + Next.js-oriented structure deployed on Netlify with restrained editorial hierarchy, fast asset loading, and clean SEO metadata.",
        why: "Senior technology leaders need a site that reads with executive authority rather than a flashy startup template.",
        where: "Live at `https://praful-h.netlify.app/` and `github.com/ayushrai-hub/client-portfolio-praful`.",
        forWhom: "Praful Hedau (UK technology leader).",
        impact: "Shipped to production in 2024 with public repository and live deployment capture.",
        tradeoff: "Keeps stack claims strictly aligned with what the static/serverless site actually runs.",
        links: [
          { href: "/work/praful-h", label: "Case study" },
          { href: "https://praful-h.netlify.app/", label: "Live site" },
          { href: "https://github.com/ayushrai-hub/client-portfolio-praful", label: "GitHub repo" },
        ],
      },
      {
        slug: "iha-by-himani",
        title: "Iha by Himani Art Studio & Inquiry Platform",
        badge: "Shipped client site · Live at ihabyhimani.com",
        visualSlug: "iha-by-himani",
        what: "A responsive art studio marketing site, visual gallery, services showcase, and inquiry workflow.",
        how: "React + TypeScript + CSS Modules + Framer Motion with mobile-first image loading and email-integrated contact routing.",
        why: "The studio needed an approachable, fast portfolio surface that lets artwork lead and removes friction from client inquiries.",
        where: "Live at `https://www.ihabyhimani.com/` and `github.com/ayushrai-hub/IHA-art-studio`.",
        forWhom: "Iha by Himani art studio.",
        impact: "Delivered in Jan–Feb 2023 and still live in production at `ihabyhimani.com`.",
        tradeoff: "Omits unverified '300% inquiry increase' marketing copy because no pre-launch baseline was recorded.",
        links: [
          { href: "/work/iha-by-himani", label: "Case study" },
          { href: "https://www.ihabyhimani.com/", label: "Live site" },
          { href: "https://github.com/ayushrai-hub/IHA-art-studio", label: "GitHub repo" },
        ],
      },
      {
        slug: "ayushmushrooms-and-gtm-tools",
        title: "AyushMushrooms Lead-Capture MVP & Custom GTM Workbenches",
        badge: "Live MVP + Python/TS GTM systems",
        visualSlug: "ayushmushrooms",
        what: "Multi-page lead-to-datasheet brand MVPs (`ayush-mushroom.vercel.app`) and custom internal GTM qualification tools (`GTM-Strato`, `AIworks Leads`).",
        how: "Next.js + serverless lead handlers for brand MVPs; Python + Streamlit/FastAPI + SQLite for internal GTM research and lead-verification pipelines.",
        why: "Businesses need structured lead capture and clean qualification rules before investing in heavy e-commerce or enterprise CRM licenses.",
        where: "Live at `https://ayush-mushroom.vercel.app/` and public GitHub repositories.",
        forWhom: "Specialty B2B/agritech brands and GTM teams needing custom qualification software.",
        impact: "Live multi-page MVP on Vercel plus reusable zero-dependency lead verification and ICP scoring engines.",
        tradeoff: "Defers full cart/checkout until quote-based lead flow proves demand.",
        links: [
          { href: "/products/ayushmushrooms", label: "AyushMushrooms product" },
          { href: "/work/gtm-strato", label: "GTM-Strato case study" },
          { href: "/contact", label: "Scope a project" },
        ],
      },
    ],
    walkthrough: {
      title: "Software services walkthrough: how we scope, build, and hand over a system",
      slot: "software-services-walkthrough",
      plannedTopics: [
        "Scoping: writing down the user, the action, and the sentence that would be false if we shipped only a demo.",
        "Walking through Praful H., Iha by Himani, and GTM-Strato as delivery templates.",
        "Handoff: repository structure, automated tests, and explicit stage boundaries.",
      ],
    },
    agentAccess: {
      markdownPath: "/software-services.md",
      searchQuery: "/api/v1/search?q=client+services+mvp",
      mcpTool: "list_projects({ category: \"client\" })",
      powRoutes: [
        { href: "/pow/fde", label: "RELAY FDE Engagement Blueprint" },
        { href: "/pow/founding-engineer", label: "BUILDLOG MVP Workbench" },
        { href: "/contact", label: "Direct Contact & Calendly" },
      ],
      keywords: [
        "software services",
        "contract AI engineer",
        "GTM pipeline development",
        "Next.js MVP",
        "client delivery",
        "forward deployed engineering",
      ],
    },
    sections: [
      {
        heading: "Who this is for",
        paragraphs: [
          "Founders, GTM teams, and operators who need a product, revenue pipeline, or site framed honestly and built as working software: an early product surface, a client marketing site, a lead-verification CLI, or a bounded AI feature where the model is not allowed to invent the business decision.",
          "I am a poor fit for vanity redesigns, promised growth multipliers, or model demos with no surrounding validation.",
        ],
      },
      {
        heading: "What I can deliver",
        paragraphs: [
          "Every delivery is scoped from systems I have already built and shipped in public repositories.",
        ],
        bullets: [
          "A stage-honest product site or MVP, with what is implemented written separately from what is planned (as with AyushMushrooms, AGENYRA, and The Open Framework).",
          "A credibility-first marketing or executive portfolio site for a studio or practice (as with Iha by Himani and Praful H.).",
          "A GTM data, ICP scoring, or lead-qualification pipeline with field-level provenance and platform filter generation (as with GTM-Strato and AIworks Leads).",
          "An AI-assisted workflow where the model proposes and deterministic rules or a human approval gate confirm (as with MedVoice and the Revenue Intelligence Engine).",
        ],
      },
      {
        heading: "How an engagement starts",
        paragraphs: [
          "Write down the user, the action, and the sentence that would be false if we shipped only a demo. Then cut scope until that sentence becomes true in code. I do not publish a static rate card or package ladder; budget and timeline are scoped directly on email, WhatsApp (+91 7440567944), or Calendly.",
        ],
      },
    ],
    evidence: [
      {
        href: "/work/iha-by-himani",
        label: "Iha by Himani",
        note: "Client site for an art studio (live at ihabyhimani.com).",
      },
      {
        href: "/work/praful-h",
        label: "Praful H.",
        note: "Client professional site (live at praful-h.netlify.app).",
      },
      {
        href: "/products/ayushmushrooms",
        label: "AyushMushrooms",
        note: "Lead-capture and datasheet MVP on Vercel.",
      },
      {
        href: "/products/the-open-framework",
        label: "The Open Framework",
        note: "Example of a prototype that refuses an infrastructure claim.",
      },
      {
        href: "/contact",
        label: "Contact",
        note: "Email, phone, WhatsApp, and Calendly.",
      },
    ],
    related: [
      { href: "/software-engineering", label: "Software engineering" },
      { href: "/gtm", label: "GTM engineering" },
      { href: "/products", label: "Products" },
      { href: "/work", label: "Work" },
      { href: "/contact", label: "Contact" },
    ],
    reading: [],
    gaps: [
      "No public rate, retainer, or SLA.",
      "No agency team and no claim of 24/7 support.",
      "AI evaluation contracts are employment or platform work, not a service package sold from this page.",
    ],
  },
  {
    path: "/experience",
    title: "Experience",
    h1: "Experience",
    label: "Background · Roles & Proof of Work",
    showOnHome: true,
    description:
      "Ayush Rai experience: SDE (AI Engineer) at FoCDoT, contract AI evaluation contributor at Outlier, UiPath Student Developer Champion, and Salesforce Virtual Intern.",
    dek: "Four recorded roles, backed by role-specific proof-of-work workbenches and shipped GTM and AI systems.",
    evidenceLevel: "shipped",
    stats: [
      {
        value: "4",
        label: "Recorded roles",
        context: "FoCDoT (full-time), Outlier (contract), UiPath (champion), Salesforce (intern)",
      },
      {
        value: "2024–present",
        label: "AI evaluation focus",
        context: "RLHF, coding & STEM task analysis, rubric design, dataset quality",
      },
      {
        value: "12",
        label: "Role POW pages",
        context: "/gtm + 11 interactive workbenches under /pow/*",
      },
      {
        value: "2",
        label: "Verified certificates",
        context: "UiPath Champion & Salesforce Virtual Internship links on record",
      },
    ],
    journey: {
      started:
        "Started in 2022 with automation and CRM fundamentals as a UiPath Student Developer Champion (Jul 2022–Jul 2023) and Salesforce Virtual Intern (Oct–Dec 2022).",
      grind:
        "AI engineering and technical evaluation as SDE (AI Engineer) at FoCDoT Technologies Pvt. Ltd, and contract AI evaluation on Outlier.",
      achieved:
        "Combined 2+ years of hands-on LLM evaluation and code/STEM verification with 7 public GTM/revenue systems and 11 interactive engineering workbenches.",
    },
    skillsTable: [
      {
        skill: "LLM technical evaluation & RLHF review",
        category: "FoCDoT & Outlier (2024–present)",
        tools: "Python, JavaScript, multi-criterion rubrics, unit-test verification",
        depthAndProof: "SDE (AI) at FoCDoT and contract evaluator on Outlier; EVALFORGE lab (/pow/ai-benchmark)",
        tradeoff: "Task content stays confidential under platform/employer NDAs; methodology is demonstrated on synthetic fixtures.",
        status: "contract",
      },
      {
        skill: "GTM & RevOps systems engineering",
        category: "Independent Builds (2026)",
        tools: "Next.js, FastAPI, Streamlit, Supabase Postgres, SQLite, Inngest, PGlite",
        depthAndProof: "7 public repositories (`RevenueRoles`, `GTM-Strato`, `RIE`, `SYSTEM-job`, `leads`, `SpiderWeb`, `MailU`) with 467+ tests",
        tradeoff: "Self-directed engineering proofs rather than a quota-carrying sales or CRM-admin seat.",
        status: "shipped",
      },
      {
        skill: "RPA workshops & developer community",
        category: "UiPath Champion (2022–2023)",
        tools: "UiPath, workflow automation, technical workshop delivery, mentoring",
        depthAndProof: "UiPath Student Developer Champion year with verified credential link",
        tradeoff: "Focused on practical student automation workshops without inflated attendance claims.",
        status: "shipped",
      },
      {
        skill: "CRM data model & platform fundamentals",
        category: "Salesforce Virtual Intern (2022)",
        tools: "Salesforce, CRM object relationships, Apex fundamentals, cloud coursework",
        depthAndProof: "Completed Oct–Dec 2022 virtual internship with verified certificate link; expanded in REVFLOW (/pow/revops-engineering)",
        tradeoff: "Virtual internship coursework, never claimed as production enterprise Salesforce administration.",
        status: "shipped",
      },
    ],
    coreBenchmarks: [
      {
        name: "12-Role Proof-of-Work Matrix (/gtm & /pow/*)",
        href: "/pow",
        whatItDoes: "Maps each target engineering role (GTM, FDE, Product, DevOps, Cloud, Benchmark, Agentic AI, RevOps, AI Research, Founding, ML, Data Science) to an interactive simulation workbench and verified repository evidence.",
        domain: "Role Verification & Technical Depth",
        category: "Interactive workbenches + repository audits",
        metrics: "12 role pages, each with a browser workbench, unit test suite, and Markdown twin",
        tradeoff: "Explicitly labels every browser simulation (`EVALFORGE`, `ORBIT`, `REVFLOW`, `RELAY`, `BUILDLOG`) so demonstrations are never confused with employment history.",
      },
    ],
    solutions: [
      {
        slug: "focdot-and-outlier-eval",
        title: "AI Engineering & Technical Evaluation (FoCDoT & Outlier)",
        badge: "FoCDoT and Outlier",
        visualSlug: "gtm-strato",
        what: "Criteria-driven evaluation of LLM outputs, dataset quality auditing, and Python/JavaScript/STEM task analysis across both roles.",
        how: "Grade model completions against explicit rubrics, write adversarial prompts that expose brittle logic, verify code with unit tests, and document failure causes.",
        why: "Frontier and production models need human evaluators who can read code and math rather than grade on conversational tone.",
        where: "FoCDoT Technologies Pvt. Ltd and Outlier, remote.",
        forWhom: "Employer and platform evaluation workflows (frontier labs are customers of the platform, not direct employers).",
        impact: "Directly shaped the deterministic rubric and grounding architecture used in EVALFORGE, GTM-Strato, and Revenue Intelligence Engine.",
        tradeoff: "No proprietary task dumps or internal inter-annotator metrics are published.",
        links: [
          { href: "/experience#focdot-sde-ai", label: "FoCDoT role anchor" },
          { href: "/experience#outlier-genai", label: "Outlier role anchor" },
          { href: "/pow/ai-benchmark", label: "EVALFORGE benchmark POW" },
        ],
      },
      {
        slug: "gtm-revenue-portfolio",
        title: "2026 GTM, Revenue & Product Engineering Builds",
        badge: "7 GTM repos + 3 flagship products",
        visualSlug: "revenueroles",
        what: "Full-stack execution across RevenueRoles (`revenueroles.in`), GTM-Strato, Revenue Intelligence Engine, Relationship Intelligence Engine, AIworks Leads, MedVoice, and AGENYRA.",
        how: "Architected, coded, tested (650+ automated tests across repos), and documented every system with public GitHub repositories and honest stage labels.",
        why: "Proves end-to-end ownership from database schema and Python scoring engines to Next.js operator consoles.",
        where: "Public GitHub profile `github.com/ayushrai-hub` and live deployments.",
        forWhom: "Technical revenue teams, wholesalers, and AI builders.",
        impact: "Live job platform (`revenueroles.in`), live GTM demo (`cashmaker-two.vercel.app`), live product site (`agenyra.space`), and 12 public repos.",
        tradeoff: "Stage-honest build logs show what is production vs local vs synthetic.",
        links: [
          { href: "/gtm", label: "GTM engineering showcase" },
          { href: "/products", label: "Products catalog" },
          { href: "/work", label: "Case studies" },
        ],
      },
    ],
    walkthrough: {
      title: "Experience & proof-of-work walkthrough: from LLM evaluation to GTM systems",
      slot: "experience-walkthrough",
      plannedTopics: [
        "How 2+ years of LLM evaluation at FoCDoT and Outlier shaped my rule-first engineering style.",
        "Connecting the 4 paid/program roles to the 12 interactive proof-of-work pages.",
        "Where to verify certificates, commit histories, and test suites.",
      ],
    },
    agentAccess: {
      markdownPath: "/experience.md",
      searchQuery: "/api/v1/search?q=focdot+outlier+experience",
      mcpTool: "get_page({ path: \"/resume\" })",
      powRoutes: [
        { href: "/pow", label: "All 12 Role POW Pages" },
        { href: "/gtm", label: "GTM Engineering Showcase" },
        { href: "/resume", label: "On-site Resume & PDF" },
        { href: "/timeline", label: "Chronological Timeline" },
      ],
      keywords: [
        "FoCDoT",
        "Outlier",
        "UiPath Student Developer Champion",
        "Salesforce Virtual Intern",
        "SDE AI Engineer",
        "LLM evaluation",
      ],
    },
    sections: [
      {
        heading: "How to read the role titles",
        paragraphs: [
          "UiPath was a student developer champion year (2022–2023). Salesforce was a virtual internship (Oct–Dec 2022).",
          "Titles match the exact experience records. No inflated staff, principal, or direct frontier-lab employment claims.",
        ],
      },
    ],
    evidence: [
      {
        href: "/about",
        label: "About",
        note: "The same roles, with education and principles beside them.",
      },
      {
        href: "/timeline",
        label: "Timeline",
        note: "Chronology across roles and builds.",
      },
      {
        href: "/resume",
        label: "Resume",
        note: "Short digest plus the PDF.",
      },
      {
        href: "/pow",
        label: "Proof of work index",
        note: "12 role-specific engineering workbenches.",
      },
    ],
    related: [
      { href: "/gtm", label: "GTM engineering" },
      { href: "/ai-engineering/rlhf", label: "RLHF and preference feedback" },
      { href: "/ai-engineering/llm-evaluation", label: "LLM evaluation" },
      { href: "/software-engineering", label: "Software engineering" },
    ],
    reading: [],
    gaps: [],
  },
  {
    path: "/open-source",
    title: "Open source",
    h1: "Open source",
    label: "Code · Public Repositories & Verifiable Tests",
    showOnHome: true,
    description:
      "Ayush Rai public GitHub repositories across GTM engineering, AI evaluation, browser extensions, products, client sites, and this agent-ready portfolio.",
    dek: "15+ public GitHub repositories under ayushrai-hub with runnable test suites, zero vanity star counts, and explicit maturity stages.",
    evidenceLevel: "shipped",
    stats: [
      {
        value: "15+",
        label: "Public repositories",
        context: "GTM pipelines, products, Chrome MV3 extension, RLHF task archives, client sites",
      },
      {
        value: "650+",
        label: "Committed test cases",
        context: "pytest, unittest, Vitest, and Playwright across public repos",
      },
      {
        value: "0",
        label: "Runtime deps in CLI/Leads",
        context: "packages/cli (Node) & ayushrai-hub/leads (Python) use pure standard library",
      },
      {
        value: "4",
        label: "MCP & API discovery files",
        context: "openapi.json, /.well-known/ard.json, plugin.json, mcp.json",
      },
    ],
    journey: {
      started:
        "Started publishing client and utility repositories on GitHub (`ayushrai-hub`), beginning with Iha by Himani (2023) and the Overlay Text Box Manifest V3 Chrome extension (2024).",
      grind:
        "Open-sourced the entire 2026 GTM and revenue-engineering stack (`RevenueRoles`, `GTM-Strato`, `REVENUE-INTELLIGENCE-ENGINE`, `SYSTEM-job`, `leads`, `SpiderWeb`, `MailU`), plus `MedVoiceERP`, `AGENYRA_product`, `the-open-framework`, and this site (`ayush-work`).",
      achieved:
        "Every flagship claim on this site points to an inspectable GitHub repository where anyone, human or coding agent, can clone, read the schema, and run `pytest` or `vitest`.",
    },
    skillsTable: [
      {
        skill: "Zero-dependency CLI & audit package design",
        category: "Python & Node Tooling",
        tools: "Python 3.9+ stdlib (`sqlite3`, `csv`, `unittest`), Node.js ESM (`packages/cli/bin/ayushrai.mjs`)",
        depthAndProof: "`ayushrai-hub/leads` (AIworks Lead Pipeline) and `packages/cli` in `ayush-work`",
        tradeoff: "Zero third-party dependency churn; runs on any machine with Python 3.9+ or Node 20+.",
        status: "shipped",
      },
      {
        skill: "Full-stack monorepo & test architecture",
        category: "Application Repos",
        tools: "pnpm workspaces, Next.js, FastAPI, NestJS, Supabase migrations, pytest, Vitest",
        depthAndProof: "`RevenueRoles` (45 pytest + 294 TS tests), `MedVoiceERP` (pnpm monorepo), `ayush-work` (36 Vitest files + Playwright)",
        tradeoff: "Keeps API contracts, database migrations, and tests in one versioned tree.",
        status: "shipped",
      },
      {
        skill: "Browser extension & developer protocol packaging",
        category: "Extensions & Plugins",
        tools: "Chrome Extension MV3, Agent Plugins (`plugin.json`, `mcp.json`, `SKILL.md`), MCP servers",
        depthAndProof: "`overlay-text-box-extension` and root `plugin.json` / `mcp.json` / `skills/portfolio-discovery`",
        tradeoff: "Follows standard manifest schemas so browsers and coding agents can load tools directly.",
        status: "shipped",
      },
    ],
    coreBenchmarks: [
      {
        name: "Repository Test & Provenance Matrix",
        href: "https://github.com/ayushrai-hub",
        whatItDoes: "Every active engineering repository ships with automated tests and an explicit stage/evidence label (`Live`, `Runs locally`, or `Synthetic demo`) cross-checked by `src/__tests__/`.",
        domain: "Open-Source Verification",
        category: "Reproducible builds & test suites",
        metrics: "RevenueRoles (339 tests), ayush-work (242+ tests), GTM-Strato (48 tests), RIE (40 tests), SYSTEM-job (34 tests), leads (6 suites)",
        tradeoff: "Omits GitHub star/fork badges and drive-by PR counts; ranks repositories by test coverage and architectural clarity.",
      },
    ],
    solutions: [
      {
        slug: "gtm-open-source-suite",
        title: "Open-Source GTM & Revenue Data Suite (7 Repositories)",
        badge: "Public on GitHub · 467+ tests",
        visualSlug: "gtm-strato",
        what: "Seven public repositories covering job discovery (`RevenueRoles`), ICP extraction & scoring (`GTM-Strato`), synthetic pipeline orchestration (`REVENUE-INTELLIGENCE-ENGINE`), field provenance (`SYSTEM-job`), lead verification (`leads`), LinkedIn graph resolution (`SpiderWeb`), and local email RAG (`MailU`).",
        how: "Published under `github.com/ayushrai-hub` with READMEs, architecture notes, Pydantic/Zod/SQLite/Postgres schemas, and automated test suites.",
        why: "Most GTM engineering work is hidden inside proprietary Clay tables or closed SaaS tools; publishing the code proves how scoring, provenance, and dedupe actually work.",
        where: "`https://github.com/ayushrai-hub` and `/gtm`.",
        forWhom: "GTM engineers, RevOps teams, and technical founders inspecting revenue infrastructure.",
        impact: "7 clonable repositories with 467+ automated test cases.",
        tradeoff: "Each repo documents its exact limits (e.g., local-only execution or synthetic fixtures).",
        links: [
          { href: "/gtm", label: "GTM engineering showcase" },
          { href: "https://github.com/ayushrai-hub/GTM-Strato", label: "GTM-Strato repo" },
          { href: "https://github.com/ayushrai-hub/leads", label: "AIworks Leads repo" },
        ],
      },
      {
        slug: "overlay-text-box",
        title: "Overlay Text Box Chrome Extension (Manifest V3)",
        badge: "Open-source utility · Vanilla JS + MV3",
        visualSlug: "overlay-text-box",
        what: "An open-source Chrome extension for controlled character-by-character typing into arbitrary web page inputs.",
        how: "Manifest V3 extension injecting a resizable floating overlay near focused inputs with configurable typing speed, random delay jitter, and pause/stop controls.",
        why: "Solves controlled input simulation for live product demos and form-handler testing without heavy external automation runners.",
        where: "`https://github.com/ayushrai-hub/overlay-text-box-extension`.",
        forWhom: "Developers, QA testers, and demo creators.",
        impact: "Self-contained open-source browser utility listed in the public project API (`/api/v1/projects/overlay-text-box`).",
        tradeoff: "Unpacked/GitHub distribution without Chrome Web Store download vanity claims.",
        links: [
          { href: "/work/overlay-text-box", label: "Case study" },
          { href: "https://github.com/ayushrai-hub/overlay-text-box-extension", label: "GitHub repo" },
        ],
      },
      {
        slug: "ayush-work-agent-repo",
        title: "ayush-work: Agent-Ready Portfolio, CLI & MCP Servers",
        badge: "This repository · OpenAPI 3.1 + Dual MCP",
        visualSlug: "mylifeos",
        what: "The open-source codebase powering `ayushrai.site`, including two Streamable HTTP MCP servers, an RFC 9727 API catalog, ARD v0.91 manifest, Agent Plugins (`plugin.json`), and a zero-dependency Node CLI (`packages/cli`).",
        how: "TypeScript content modules in `src/content/` compile into prerendered HTML, `.md` twins, `/llms.txt`, `/feeds/portfolio.jsonl`, and serverless REST/MCP handlers.",
        why: "Serves as a reference implementation for making a personal site natively readable and verifiable by both humans and autonomous AI agents.",
        where: "`https://github.com/ayushrai-hub/ayush-work`.",
        forWhom: "Developers building agent-friendly web applications and MCP servers.",
        impact: "100% open-source agent discovery stack with 36 Vitest test files and Playwright E2E checks.",
        tradeoff: "CLI (`node packages/cli/bin/ayushrai.mjs`) runs from the repository and is not published to npm yet.",
        links: [
          { href: "https://github.com/ayushrai-hub/ayush-work", label: "GitHub repo" },
          { href: "/developers", label: "Developer docs" },
        ],
      },
    ],
    walkthrough: {
      title: "Open-source repositories walkthrough: cloning, running tests, and querying via MCP",
      slot: "open-source-walkthrough",
      plannedTopics: [
        "Navigating the 15+ public repositories on `ayushrai-hub` by domain (GTM, AI products, utilities, client work).",
        "Running `npx vitest run` in `ayush-work` and `pytest` in `GTM-Strato` and `REVENUE-INTELLIGENCE-ENGINE`.",
        "Using `node packages/cli/bin/ayushrai.mjs` or `/api/mcp` to query repository records programmatically.",
      ],
    },
    agentAccess: {
      markdownPath: "/open-source.md",
      searchQuery: "/api/v1/projects",
      mcpTool: "list_projects({})",
      powRoutes: [
        { href: "/developers", label: "REST API & MCP Docs" },
        { href: "/projects", label: "Projects Catalog" },
        { href: "/products", label: "Products Catalog" },
      ],
      keywords: [
        "ayushrai-hub",
        "open source",
        "GTM-Strato",
        "RevenueRoles",
        "Overlay Text Box",
        "MCP server",
        "Agent Plugins",
      ],
    },
    sections: [
      {
        heading: "What a public repository link means here",
        paragraphs: [
          "A repository link on this site means the source code is public and inspectable today. It does not mean every product is finished. Where commits were generated with coding-agent assistance (such as `MedVoice Agent` in MedVoiceERP or Lovable scaffolding in `the-open-framework`), the case study states that attribution explicitly.",
        ],
      },
    ],
    evidence: [
      {
        href: "/work/overlay-text-box",
        label: "Overlay Text Box",
        note: "Chrome extension that types into page fields. The clearest open-source utility.",
      },
      {
        href: "https://github.com/ayushrai-hub/GTM-Strato",
        label: "GTM-Strato repository",
        note: "ICP discovery & 100-pt deterministic fit scorer with 48 pytest tests.",
      },
      {
        href: "https://github.com/ayushrai-hub/leads",
        label: "AIworks Lead Qualification Pipeline",
        note: "Zero-dependency Python CLI and SQLite verification store.",
      },
      {
        href: "https://github.com/ayushrai-hub/ayush-work",
        label: "ayush-work repository",
        note: "This site's source, prerender pipeline, and dual MCP servers.",
      },
      {
        href: "https://github.com/ayushrai-hub",
        label: "GitHub profile",
        note: "ayushrai-hub",
      },
    ],
    related: [
      { href: "/projects", label: "Projects index" },
      { href: "/products", label: "Products" },
      { href: "/gtm", label: "GTM engineering" },
      { href: "/software-engineering", label: "Software engineering" },
    ],
    reading: [],
    gaps: [
      "No inventory of drive-by pull requests to other organizations. If that work matters later, it needs its own evidence.",
      "Public client repositories are listed only when this site already links them.",
    ],
  },
];

/** Find the dossier for a pathname, ignoring trailing slashes. Used by DomainPage. */
export function getDomainByPath(pathname: string): DomainRecord | undefined {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
  return domains.find((page) => page.path === path);
}

/**
 * Every dossier whose path starts with `path/` (all descendants, not only
 * direct children). Feeds the "In this section" list on DomainPage and in Markdown.
 */
export function childDomains(path: string): DomainRecord[] {
  const prefix = path.endsWith("/") ? path : `${path}/`;
  return domains.filter((page) => page.path.startsWith(prefix));
}

/** Dossiers flagged `showOnHome`, in `domains` order, for the HomePage domain list. */
export function homeDomains(): DomainRecord[] {
  return domains.filter((page) => page.showOnHome);
}

/**
 * Markdown body for a dossier's Markdown twin (used by
 * src/lib/agent/markdown.ts): evidence level, stats, journey, skills table,
 * core benchmarks, scalable solutions (What/How/Why/Where/ForWhom/Impact/Tradeoff),
 * walkthrough video, agentic discovery paths, child pages, prose sections,
 * evidence, related links, further reading, gaps and a contact pointer.
 */
export function renderDomainBody(page: DomainRecord): string {
  const children = childDomains(page.path)
    .map((child) => `- [${child.title}](${child.path}.md): ${child.description}`)
    .join("\n");

  const statsBlock = page.stats.length
    ? [
        "## Numbers in the game",
        "",
        ...page.stats.map((s) => `- **${s.value} ${s.label}**: ${s.context}`),
      ].join("\n")
    : "";

  const journeyBlock = [
    "## Journey: how we started and what we achieved",
    "",
    `- **How we started:** ${page.journey.started}`,
    `- **The grind:** ${page.journey.grind}`,
    `- **What we achieved:** ${page.journey.achieved}`,
  ].join("\n");

  const skillsTableBlock = page.skillsTable.length
    ? [
        "## Skills & capability matrix",
        "",
        "| Skill / capability | Category | Tools & stack | Depth & repository proof | Trade-off | Status |",
        "| --- | --- | --- | --- | --- | --- |",
        ...page.skillsTable.map(
          (row) =>
            `| ${row.skill} | ${row.category} | ${row.tools} | ${row.depthAndProof} | ${row.tradeoff} | ${domainSkillStatusLabels[row.status]} |`,
        ),
      ].join("\n")
    : "";

  const benchmarksBlock = page.coreBenchmarks.length
    ? [
        "## Core domain benchmarks & harnesses",
        "",
        "| Benchmark / harness | What it does | Domain & category | Verifiable metrics | Trade-off |",
        "| --- | --- | --- | --- | --- |",
        ...page.coreBenchmarks.map(
          (b) =>
            `| [${b.name}](${b.href}) | ${b.whatItDoes} | ${b.domain} · ${b.category} | ${b.metrics} | ${b.tradeoff} |`,
        ),
      ].join("\n")
    : "";

  const solutionsBlock = page.solutions.length
    ? [
        "## Scalable solutions & live proof of work",
        "",
        ...page.solutions.map((sol, idx) => {
          const links = sol.links.map((l) => `[${l.label}](${l.href})`).join(" · ");
          return [
            `### 0${idx + 1}. ${sol.title} (${sol.badge})`,
            "",
            `- **What we did:** ${sol.what}`,
            `- **How we built it:** ${sol.how}`,
            `- **Why it matters:** ${sol.why}`,
            `- **Where it lives:** ${sol.where}`,
            `- **For whom:** ${sol.forWhom}`,
            `- **Impact & numbers:** ${sol.impact}`,
            `- **Engineering trade-off:** ${sol.tradeoff}`,
            links ? `- **Links:** ${links}` : "",
          ]
            .filter(Boolean)
            .join("\n");
        }),
      ].join("\n\n")
    : "";

  const walkthroughBlock = [
    "## Walkthrough video",
    "",
    page.walkthrough.url
      ? `Video: ${page.walkthrough.url}`
      : `Slot \`${page.walkthrough.slot}\` (coming soon). Planned topics:\n\n${page.walkthrough.plannedTopics.map((t) => `- ${t}`).join("\n")}`,
  ].join("\n");

  const agentAccessBlock = [
    "## Human & agent discovery",
    "",
    `- **Markdown twin:** \`${page.agentAccess.markdownPath}\``,
    `- **Lexical search API:** \`GET ${page.agentAccess.searchQuery}\``,
    `- **MCP tool call:** \`${page.agentAccess.mcpTool}\``,
    `- **Interactive POW workbenches:** ${page.agentAccess.powRoutes.map((r) => `[${r.label}](${r.href})`).join(" · ")}`,
    `- **Domain keywords:** ${page.agentAccess.keywords.join(", ")}`,
  ].join("\n");

  const sections = page.sections
    .map((section) => {
      const diagram = section.diagram ? `\n\n\`\`\`\n${section.diagram}\n\`\`\`` : "";
      const bullets = section.bullets?.length
        ? `\n\n${section.bullets.map((item) => `- ${item}`).join("\n")}`
        : "";
      return `## ${section.heading}\n\n${section.paragraphs.join("\n\n")}${diagram}${bullets}`;
    })
    .join("\n\n");
  const evidence = page.evidence
    .map((item) => `- [${item.label}](${item.href})${item.note ? `: ${item.note}` : ""}`)
    .join("\n");
  const related = page.related
    .map((item) => `- [${item.label}](${item.href})`)
    .join("\n");
  const reading = page.reading
    .map((item) => `- [${item.label}](${item.href})${item.note ? `: ${item.note}` : ""}`)
    .join("\n");
  const gaps = page.gaps.map((item) => `- ${item}`).join("\n");
  return [
    `Evidence level: ${evidenceLevelLabels[page.evidenceLevel]}.`,
    "",
    statsBlock,
    journeyBlock,
    children ? `## In this section\n\n${children}` : "",
    skillsTableBlock,
    benchmarksBlock,
    solutionsBlock,
    walkthroughBlock,
    agentAccessBlock,
    sections,
    "## Evidence",
    "",
    evidence || "_None listed._",
    "## Related",
    "",
    related || "_None listed._",
    reading ? `\n## Further reading\n\n${reading}` : "",
    gaps ? "## Gaps" : "",
    "",
    gaps,
    "",
    "Contact: /contact",
  ]
    .filter((part) => part !== "")
    .join("\n\n");
}
