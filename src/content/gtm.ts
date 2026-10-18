/**
 * GTM engineering: the record behind /gtm and its Markdown twin /gtm.md.
 *
 * Holds only what is specific to the GTM framing: positioning, the walkthrough video slot,
 * per-project evidence labels and limits, the infrastructure layer map, the toolkit with honest
 * levels, what is being studied, reading resources, and next builds. Product and project facts
 * (summaries, stacks, links, maturity) stay in products.ts and projects.ts and are looked up by
 * slug, so /products, /projects, search, the API, and MCP say the same thing as this page.
 * `renderGtmBody` builds the Markdown body from the same record.
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

/** One proof on /gtm: a product or project record plus what it shows for GTM work and its limits. */
export interface GtmProof {
  slug: string;
  kind: "product" | "project";
  evidence: GtmEvidence;
  /** Short stack labels for products, which have prose architecture instead of a technology list. */
  stack?: string[];
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

/** The whole /gtm record. */
export interface GtmPortfolio {
  title: string;
  description: string;
  positioning: string;
  background: string;
  walkthrough: {
    /** Loom share or embed URL. Leave unset until the video is recorded. */
    loomUrl?: string;
    plannedTopics: string[];
  };
  proofs: GtmProof[];
  layers: GtmLayer[];
  toolkit: GtmSkillGroup[];
  studying: { intro: string; topics: GtmStudyTopic[] };
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
    "Ayush Rai on GTM engineering: a live revenue-role job product, public-source data pipelines with provenance, an explainable scoring demo with a human approval gate, and an honest map of what is built, what is being studied, and what comes next.",
  positioning:
    "I build data and decision systems for revenue work: job-market data pipelines, entity resolution, explainable scoring, and human-approval workflows.",
  background:
    "From April 2024 to August 2025 I worked as an AI engineer at FoCDoT Technologies, on AI engineering and technical evaluation. Since then I have built my own products and done contract evaluation work for frontier-lab programs. I am now studying GTM engineering on top of that background, and this page separates what I have built from what I am still learning.",
  walkthrough: {
    plannedTopics: [
      "RevenueRoles: one posting from source to published listing.",
      "Revenue Intelligence Engine: an ICP run, the score breakdown, and the approval queue.",
      "Where each project sits in the data, orchestration, execution, and agent layers.",
    ],
  },
  proofs: [
    {
      slug: "revenueroles",
      kind: "product",
      evidence: "live",
      stack: ["Next.js", "FastAPI", "Supabase Postgres", "pgvector", "Inngest", "Vercel"],
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
      slug: "revenue-intelligence-engine",
      kind: "project",
      evidence: "synthetic",
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
      slug: "spiderweb",
      kind: "project",
      evidence: "local",
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
        "Field-level provenance and verification status in the Relationship Intelligence Engine.",
        "Person and company resolution in SpiderWeb.",
      ],
      gap: "No paid enrichment provider (Apollo, Clay) is wired into any project.",
    },
    {
      name: "Orchestration",
      description: "Coordinate workflows, apply business rules, manage dependencies, and decide what happens next.",
      built: [
        "Inngest scheduled discovery in RevenueRoles.",
        "A staged pipeline with run IDs and idempotent upserts in the Revenue Intelligence Engine.",
        "An optional Redis-backed ingestion worker in SpiderWeb.",
      ],
      gap: "No CRM-triggered or webhook-driven workflows yet.",
    },
    {
      name: "Execution",
      description: "Update CRM records, create tasks, trigger approved outreach, notify reps.",
      built: [
        "CSV, JSON, and XLSX exports, gated by an approval queue in the Revenue Intelligence Engine.",
      ],
      gap: "No CRM writes, no outbound sending, and no deliverability work.",
    },
    {
      name: "Agents",
      description: "Use LLMs and tools for contextual research, unstructured data, and bounded decisions.",
      built: [
        "LLM account research with labeled claims and a deterministic fallback.",
        "RAG over a mailbox in MailU.",
        "Evaluation discipline from contract evaluation work: judging model output against criteria.",
      ],
      gap: "No production agent with measured outcomes.",
    },
    {
      name: "Revenue operations",
      description: "ICP definition, qualification, pipeline metrics, and the people who use the system.",
      built: [
        "ICP definition, explainable scoring, and an approval gate, all in a synthetic demo.",
      ],
      gap: "No HubSpot or Salesforce work shown, and no pipeline metrics from real use.",
    },
  ],
  toolkit: [
    {
      heading: "Languages and frameworks",
      items: [
        { name: "Python", level: "shipped", note: "FastAPI services, pipelines, and pytest suites (Revenue Intelligence Engine, MailU, the RevenueRoles worker)." },
        { name: "TypeScript", level: "shipped", note: "Next.js apps, CLIs, and pipelines (RevenueRoles, Relationship Intelligence Engine, SpiderWeb, this site)." },
        { name: "Next.js and React", level: "shipped", note: "The RevenueRoles web app and the Revenue Intelligence Engine console." },
        { name: "FastAPI", level: "shipped", note: "The Revenue Intelligence Engine API and the RevenueRoles classification worker." },
      ],
    },
    {
      heading: "Data",
      items: [
        { name: "PostgreSQL and SQL", level: "shipped", note: "Supabase with pgvector and row-level security in RevenueRoles. PGlite or Postgres in the Relationship Intelligence Engine." },
        { name: "SQLAlchemy", level: "shipped", note: "Persistence for the Revenue Intelligence Engine, SQLite locally with Postgres-compatible models." },
        { name: "Vector stores", level: "shipped", note: "pgvector in RevenueRoles, ChromaDB in MailU." },
        { name: "Entity resolution and deduplication", level: "shipped", note: "Across job sources, public company data, and LinkedIn exports." },
      ],
    },
    {
      heading: "Orchestration and automation",
      items: [
        { name: "Inngest", level: "shipped", note: "Scheduled discovery jobs in RevenueRoles." },
        { name: "Queues and workers", level: "shipped", note: "Redis-backed ingestion worker in SpiderWeb; a resume queue in RevenueRoles." },
        { name: "n8n, Make, Zapier", level: "used", note: "Familiar with the platforms. No public project uses them yet." },
      ],
    },
    {
      heading: "AI",
      items: [
        { name: "Structured LLM output", level: "shipped", note: "JSON account research with required-field checks and a deterministic fallback in the Revenue Intelligence Engine." },
        { name: "Tool calling and agent loops", level: "used", note: "Understood and used in experiments. No public project of mine shows it yet." },
        { name: "RAG and embeddings", level: "shipped", note: "MailU on a local model through Ollama." },
        { name: "LLM evaluation", level: "used", note: "Contract evaluation work for frontier-lab programs: reviewing model output against criteria. Task materials are not public." },
      ],
    },
    {
      heading: "GTM platforms",
      items: [
        { name: "Apollo.io", level: "used", note: "Used as a product. Its API is not integrated in any project yet." },
        { name: "Clay", level: "studying", note: "Waterfalls, HTTP API columns, and where Clay ends and a backend begins." },
        { name: "HubSpot", level: "studying", note: "CRM object model, associations, and safe create-or-update through the API." },
      ],
    },
    {
      heading: "Testing and delivery",
      items: [
        { name: "pytest, Vitest, Playwright", level: "shipped", note: "Test suites across the projects on this page." },
        { name: "Vercel, Netlify, Docker", level: "shipped", note: "RevenueRoles and the Revenue Intelligence Engine on Vercel; this site on Netlify; Docker Compose for local Postgres and Redis." },
      ],
    },
    {
      heading: "Practices",
      items: [
        { name: "Provenance and verification status per field", level: "shipped", note: "Relationship Intelligence Engine." },
        { name: "Explainable, deterministic scoring", level: "shipped", note: "Revenue Intelligence Engine." },
        { name: "Human approval gates before export", level: "shipped", note: "Revenue Intelligence Engine." },
        { name: "Rate-limited collection from public sources", level: "shipped", note: "Relationship Intelligence Engine." },
      ],
    },
  ],
  studying: {
    intro:
      "I am studying how B2B companies build and run revenue systems: how they find accounts, enrich and verify records, read buying signals, qualify leads, orchestrate workflows, sync with a CRM, and use agents with a human in the loop. I read documentation, trace real API requests and responses, and build against them, rather than watching tool tours.",
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
    "Push approved accounts to a HubSpot developer sandbox as companies and contacts with associations, keyed on domain so re-runs update instead of duplicating.",
    "Call the scoring API from a Clay table through an HTTP API column, and compare enrichment coverage and cost per provider in a small waterfall.",
    "Write an architecture note for each flagship: why it is designed this way, what failed, what it costs to run, and how I know it works.",
    "Build an autonomous personal agentic system for GTM operations. Agents run routine research, enrichment, scoring, and follow-up preparation on their own, and a person approves anything that leaves the system. It improves over time from logged outcomes, new data, and evaluation evidence. Design goal: run at a fraction of the cost of sending every step to a hosted frontier model, by routing routine steps to smaller or local models and measuring cost per task. Not started.",
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
        href: `/projects#${project.slug}`,
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

/** Markdown body for /gtm.md, built from `gtmPortfolio` and the resolved proofs. */
export function renderGtmBody(): string {
  const { walkthrough, layers, toolkit, studying, resources, nextBuilds } = gtmPortfolio;
  const video = walkthrough.loomUrl
    ? `Loom walkthrough: ${walkthrough.loomUrl}`
    : `Not recorded yet. It will cover:\n\n${walkthrough.plannedTopics.map((t) => `- ${t}`).join("\n")}`;
  const evidenceKey = (Object.keys(gtmEvidenceLabels) as GtmEvidence[])
    .map((key) => `- ${gtmEvidenceLabels[key].label}: ${gtmEvidenceLabels[key].meaning}`)
    .join("\n");
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
        "",
        proof.stack.length ? `Stack: ${proof.stack.join(", ")}` : "",
        links,
        "",
        "What it shows:",
        "",
        proof.shows.map((s) => `- ${s}`).join("\n"),
        "",
        "Limits:",
        "",
        proof.limits.map((l) => `- ${l}`).join("\n"),
      ].join("\n");
    })
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
    gtmPortfolio.background,
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
    "## GTM infrastructure layers: built and missing",
    "",
    layerRows,
    "",
    "## What I already know",
    "",
    skills,
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
