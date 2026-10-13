/**
 * Evidence-backed domain dossiers: the pages under /ai-engineering (and its
 * subpages), /software-engineering, /software-services, /experience and /open-source.
 *
 * Each `DomainRecord` holds a page's prose, evidence links, related links,
 * further reading and named gaps. Prose lives here so HTML, Markdown, and
 * search share it. Evidence links point at records already in this content
 * layer. Gaps stay visible: reading about a topic is not treated as production
 * experience, and topics without evidence (for example inference or
 * distributed systems) are listed as gaps, not given empty pages.
 *
 * Connects to:
 * - src/pages/DomainPage.tsx renders each record (routes in src/App.tsx);
 *   HomePage lists `homeDomains()`.
 * - Markdown twins via `renderDomainBody` in src/lib/agent/markdown.ts;
 *   llms.txt "Domains" list; search items of type "domain" (searchIndex.ts).
 * - src/lib/publicRoutes.ts adds every `path` to the sitemap and prerender list.
 * - Defines its own types (`EvidenceLevel`, `DomainLink`, `DomainSection`,
 *   `DomainRecord`); nothing from types.ts.
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
    label: "Domain",
    showOnHome: true,
    description:
      "How I approach LLM evaluation, preference feedback, and AI products, with the work and the limits named.",
    dek: "A map of the AI work I can point to. It is not a claim that every subfield below is a production specialty.",
    evidenceLevel: "mixed",
    sections: [
      {
        heading: "Scope",
        paragraphs: [
          "On this site, AI engineering means the practical work of making model-shaped systems usable: judging outputs, constraining what a model is allowed to decide, and shipping the software around that judgment.",
          "The pages under this hub separate contract evaluation work from product work and from research notes. Those are different kinds of evidence.",
        ],
      },
      {
        heading: "What I have actually done",
        paragraphs: [
          "From April 2024 to August 2025 I did AI engineering and technical evaluation at FoCDoT, reviewing model outputs against criteria and analyzing coding and STEM tasks. Since August 2025 I have contributed, through Outlier, to generative-AI evaluation workflows for frontier-lab programs. That is contract evaluation work, not employment by those labs.",
          "The product work is separate. MedVoice is a voice-assisted wholesale billing workflow where speech proposes a line and deterministic rules decide identity, tax, and posting. AGENYRA is a distribution layer that starts as structured product data. The Open Framework is an early civil-society coordination prototype, not an LLM platform.",
        ],
      },
      {
        heading: "What this hub does not claim",
        paragraphs: [
          "I do not publish benchmark scores, user counts, or a ranking against other engineers. I also do not treat model-serving, quantization, or a general inference platform as a shipped specialty. Those topics stay off their own URLs until there is a system to show.",
        ],
        bullets: [
          "LLM evaluation and RLHF-shaped review: contract work, with detail limited by the engagement.",
          "LLM-shaped products: MedVoice and AGENYRA, both still building.",
          "Retrieval: an older legal-text investigation, not a production RAG stack.",
          "Agents: product and interface thinking, not a multi-agent runtime I operate in production.",
        ],
      },
    ],
    evidence: [
      {
        href: "/experience#focdot-sde-ai",
        label: "FoCDoT, SDE — AI Engineer",
        note: "April 2024–August 2025. Evaluation and STEM/coding-task analysis.",
      },
      {
        href: "/experience#outlier-genai",
        label: "Outlier, AI evaluation contributor",
        note: "Contract work from August 2025. Frontier-lab programs via the platform, not direct employment.",
      },
      {
        href: "/work/medvoice",
        label: "MedVoice case study",
        note: "Speech proposes. Rules decide medicine, price, and tax.",
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
    label: "AI engineering",
    showOnHome: true,
    description:
      "How I think about rubrics, review loops, and reliability for LLM outputs, grounded in contract evaluation work.",
    dek: "Judgment criteria, not model names, are the part of this work I can talk about in public.",
    evidenceLevel: "mixed",
    sections: [
      {
        heading: "Scope",
        paragraphs: [
          "LLM evaluation here means deciding whether an output is acceptable for a stated task, recording why, and noticing when the rubric itself is vague. It includes code-oriented review, STEM and coding-task analysis, and dataset-quality work described on the experience page.",
          "It does not mean I am publishing a leaderboard, a pairwise arena, or a statistically powered benchmark. I have not released those artifacts.",
        ],
      },
      {
        heading: "Problems this work is for",
        paragraphs: [
          "A fluent wrong answer is expensive when the task is code, a calculation, or a workflow that will be trusted later. 'Looks good' feedback does not tell a later training or review step what failed.",
          "The practical problems are rubric design, disagreement, and leakage of the answer into the prompt. Those show up in review work even when the employer cannot be described in detail.",
        ],
      },
      {
        heading: "What I do in the review loop",
        paragraphs: [
          "At FoCDoT I reviewed model outputs against evaluation criteria and analyzed coding and STEM tasks. Through Outlier I have worked on dataset quality, prompting strategies for Python and JavaScript tasks, and review loops aimed at brittle behavior. The public description stops where the task materials stop.",
          "The note I am willing to stand behind is simple: correctness, edge cases, and security smells need to be explicit criteria. Brand proximity to a lab is not a substitute for that.",
        ],
        bullets: [
          "Name the task and the failure that matters before scoring.",
          "Separate 'runs' from 'is safe to ship' for code outputs.",
          "Treat a rubric change as a change of the measurement, not as a quiet quality improvement.",
          "Do not cite a win rate I cannot show.",
        ],
      },
      {
        heading: "Failure modes",
        paragraphs: [
          "Rubrics drift toward style. Reviewers reward familiar patterns. A pairwise preference can hide a shared blind spot if both outputs miss the same bug. Prompt examples can leak the expected answer.",
          "I keep an idea note, Honest rubrics for code-oriented LLM eval, in the exploring state. It is not a published rubric pack.",
        ],
      },
      {
        heading: "Security and reliability",
        paragraphs: [
          "For code tasks, a review that ignores injection, unsafe defaults, and tests that do not exercise the branch is incomplete. I treat those as evaluation criteria, not as a separate security audit practice I am selling on its own.",
        ],
      },
    ],
    evidence: [
      {
        href: "/experience#outlier-genai",
        label: "Outlier evaluation work",
        note: "Dataset quality, Python/JavaScript prompting, review of brittle outputs.",
      },
      {
        href: "/experience#focdot-sde-ai",
        label: "FoCDoT evaluation work",
        note: "Criteria-based review and STEM/coding-task analysis, through August 2025.",
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
    label: "AI engineering",
    showOnHome: true,
    description:
      "What I mean by RLHF-shaped work: human review and preference signals for model outputs, and the limits of what I can show.",
    dek: "I have done human-feedback evaluation. I have not trained the reward model or the policy those signals might update.",
    evidenceLevel: "mixed",
    sections: [
      {
        heading: "Scope",
        paragraphs: [
          "RLHF, reinforcement learning from human feedback, is a family of training methods that turn human judgments into a learning signal. The public part of my work sits on the human-judgment side: reviewing outputs, applying criteria, and working on dataset quality for LLM training workflows.",
          "I use 'RLHF-shaped' on purpose. The experience record says evaluation and model-reliability work. It does not say I designed a reward model, ran PPO, or owned an alignment research agenda.",
        ],
      },
      {
        heading: "Where preference data goes wrong",
        paragraphs: [
          "Preference pairs are only as good as the instruction the reviewer was given. If the rubric rewards fluency, the signal teaches fluency. If two reviewers disagree and the disagreement is averaged away, the dataset hides the ambiguity.",
          "For code and STEM tasks, a preference is a poor substitute for a failing test when a failing test exists. Human feedback still matters for the cases tests do not name: insecure-but-passing code, a right answer with a wrong explanation, a solution that ignores the constraint in the prompt.",
        ],
      },
      {
        heading: "What the roles were",
        paragraphs: [
          "FoCDoT, April 2024 to August 2025: AI engineering and technical evaluation, including RLHF-oriented evaluation. Outlier, from August 2025: contract evaluation for frontier-lab programs, including dataset-quality and review loops. I do not list the labs as employers.",
          "Older portfolio copy that implied direct collaboration with a lab, as opposed to work delivered through a vendor platform, was the thing the fact-check log told this site to stop saying. This page keeps that distinction.",
        ],
      },
      {
        heading: "How I would evaluate a feedback loop",
        paragraphs: [
          "If I were publishing a loop of my own, I would want the guideline, a small set of double-reviewed items, and a written rule for what happens on disagreement. I do not have that packet for the contract work, so I do not invent the numbers.",
        ],
      },
    ],
    evidence: [
      {
        href: "/experience#focdot-sde-ai",
        label: "FoCDoT role",
        note: "RLHF-oriented evaluation is the phrase the experience record uses.",
      },
      {
        href: "/experience#outlier-genai",
        label: "Outlier contract",
        note: "Dataset quality and review. Not a keynote role and not lab employment.",
      },
      {
        href: "/ai-engineering/llm-evaluation",
        label: "LLM evaluation",
        note: "The rubric side of the same work.",
      },
    ],
    related: [
      { href: "/ai-engineering/llm-evaluation", label: "LLM evaluation" },
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
    label: "AI engineering",
    description:
      "Product systems where a model proposes and surrounding software decides. MedVoice is the clearest case. AGENYRA is the structured-data case.",
    dek: "I can show two products that take model-shaped input seriously. I cannot show a general production LLM platform.",
    evidenceLevel: "mixed",
    sections: [
      {
        heading: "Scope",
        paragraphs: [
          "An LLM system, as I use the term on this page, is the application around a model: what it may see, what it may decide, how a person confirms it, and what is stored. The model is not the system.",
          "MedVoice is the implementation I will talk about in detail. AGENYRA is included because it is explicit that placing a product inside another tool or agent is a later stage than representing the product as data.",
        ],
      },
      {
        heading: "MedVoice: speech proposes, rules decide",
        paragraphs: [
          "The worker speaks an order line. Speech is normalized and matched only against that tenant's medicine catalog. Ambiguous matches stay unconfirmed. Tax is computed with deterministic GST logic in integer money. An ERP failure is not reported as a successful sale.",
          "The repository has phase-2 foundations, including a mock path from speech to a confirmed draft invoice. Real catalog import, production speech, the Android field app, inventory hardening, and live ERP sync are not complete. There is no public demo URL.",
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
      {
        heading: "Trade-offs I accepted there",
        paragraphs: [
          "A model that 'just fills the invoice' would be shorter to demo and harder to audit. The constraint is the product: the model does not choose the medicine, the price, or the tax.",
          "An in-memory demo catalog is enough to exercise the state machine and dishonest as a claim of a live wholesaler deployment. The product page keeps those stages separate.",
        ],
      },
      {
        heading: "AGENYRA is a different kind of system",
        paragraphs: [
          "AGENYRA starts with structured representation and builder onboarding. Discovery over those fields is not the same thing as inserting a product into someone else's agent. The public repository proves the site that says so. It is still building.",
        ],
      },
      {
        heading: "Security and reliability",
        paragraphs: [
          "MedVoice's reliability claims that I will make are the ones in the case study: confirmation before a risky match, idempotent invoice posting, and no success message when the ERP write fails. I do not add a latency budget or a throughput number, because I have not published a measurement.",
        ],
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
        href: "/work/agenyra",
        label: "AGENYRA case study",
        note: "Structured data before distribution into other tools.",
      },
    ],
    related: [
      { href: "/ai-engineering/agents", label: "Agents" },
      { href: "/ai-engineering", label: "AI engineering hub" },
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
    label: "AI engineering",
    description:
      "Agent-shaped product thinking and the read-only agent interfaces on this site. Not a production agent orchestrator.",
    dek: "I can show where an agent should not be trusted yet, and how this website exposes itself to one.",
    evidenceLevel: "investigation",
    sections: [
      {
        heading: "Scope",
        paragraphs: [
          "An agent, here, means software that can choose tools and take a sequence of actions toward a goal. That is a higher bar than a chatbot, and a higher bar than a page that happens to mention agents.",
          "This page is narrow on purpose. I do not have a production multi-agent system, a tool-calling eval suite, or an orchestration runtime to publish as a case study.",
        ],
      },
      {
        heading: "What I have built that touches the idea",
        paragraphs: [
          "AGENYRA's public position is that search over structured product fields is not the same thing as placing a product inside another tool or agent. Intent-aware matching stays a research question until a system does it. The stage vocabulary is there so a feature cannot quietly become 'launched'.",
          "This website is the other artifact. It publishes Markdown twins, llms.txt, a read-only search API, and an MCP server with list, get, compare, and search tools over the same public records, over stdio locally and Streamable HTTP at /api/mcp. That is an interface for agents. It is not an agent that browses the web and acts.",
        ],
      },
      {
        heading: "Trade-offs",
        paragraphs: [
          "A long-lived MCP process is a service this static host does not run. The remote endpoint is stateless instead: each request builds the server, answers in JSON, and exits, so it fits an ordinary serverless function. The cost is no sessions and no server-initiated messages, which read-only tools do not need.",
          "Giving an agent write tools against a portfolio, or against MedVoice's invoice path, would be a demo. MedVoice's point is that a model does not post the invoice. I am not undoing that for an agent demo.",
        ],
      },
      {
        heading: "Failure modes I care about",
        paragraphs: [
          "Tool selection that looks confident and calls the wrong function. A loop that retries a non-idempotent write. A prompt that treats retrieved marketing copy as a source of truth. Those are reasons to keep early agent work on read-only public data.",
        ],
      },
    ],
    evidence: [
      {
        href: "/work/agenyra",
        label: "AGENYRA case study",
        note: "Distribution into agents is a later stage than structured data.",
      },
      {
        href: "/developers",
        label: "Developer interfaces",
        note: "Markdown, search, OpenAPI, and the MCP server.",
      },
      {
        href: "/products/agenyra",
        label: "AGENYRA product",
        note: "Stage: building. Live site is the public site, not a placement network.",
      },
    ],
    related: [
      { href: "/ai-engineering/llm-systems", label: "LLM systems" },
      { href: "/ai-engineering/llm-evaluation", label: "LLM evaluation" },
      { href: "/ai-engineering", label: "AI engineering hub" },
    ],
    reading: [
      {
        href: "https://modelcontextprotocol.io/",
        label: "Model Context Protocol",
        note: "The protocol the site's MCP server speaks. Listing it is not a certification.",
      },
    ],
    gaps: [
      "No agent eval harness, trace viewer, or production tool-use metrics.",
      "No SDK or registry listing. The MCP endpoint is read-only and has no write tools.",
      "WebMCP search on this site registers only when the browser exposes the API. No experimental Chrome run was completed in this repository.",
    ],
  },
  {
    path: "/ai-engineering/rag",
    title: "Retrieval and RAG",
    h1: "Retrieval and RAG",
    label: "AI engineering",
    description:
      "An honest page about retrieval: one legal-text investigation mentioned it. I have not shipped a production RAG system.",
    dek: "This is a boundary page. It exists so the topic is not implied by the AI hub and not inflated into a case study.",
    evidenceLevel: "investigation",
    sections: [
      {
        heading: "Scope",
        paragraphs: [
          "Retrieval-augmented generation, RAG, usually means fetching passages and asking a model to answer from them. Chunking, embeddings, indexes, rerankers, and citation checks are the engineering. I am not going to teach that stack here as if I had operated it in production.",
          "The evidence I do have is an investigation: NLP for legal document analysis, from August to December 2023. The summary says document structure, retrieval, and assisted review, not autonomous legal advice. It is not a peer-reviewed paper and not a production legal tool.",
        ],
      },
      {
        heading: "What I will not carry forward from older copy",
        paragraphs: [
          "Earlier materials claimed a time reduction and a document volume. Those numbers are unverified and are not repeated here. A possible LNCT internal research grant is also unverified. The research record keeps them in needsConfirmation.",
        ],
      },
      {
        heading: "What a real RAG page would need",
        paragraphs: [
          "A corpus I can describe, a chunking choice, an index, a way to score retrieval separately from the model's prose, and at least one failure where the model answered from the wrong passage. I do not have that write-up. Until I do, this page should not rank as a production RAG portfolio piece, and I am not building doorway pages for synonyms of the same absence.",
        ],
      },
    ],
    evidence: [
      {
        href: "/research/legal-nlp-contracts",
        label: "NLP for legal document analysis",
        note: "Investigation. Retrieval is mentioned. Metrics are not.",
      },
    ],
    related: [
      { href: "/ai-engineering", label: "AI engineering hub" },
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
      "No production index, embedding model choice, reranker, or citation eval.",
      "No customer corpus and no permission to describe one.",
      "Treat any future RAG claim as new evidence, not as an extension of this paragraph.",
    ],
  },
  {
    path: "/software-engineering",
    title: "Software engineering",
    h1: "Software engineering",
    label: "Domain",
    showOnHome: true,
    description:
      "Application engineering across product sites, client sites, and small tools, with the stack taken from the projects rather than from a wishlist.",
    dek: "React and TypeScript, Next.js products, one browser extension, and client marketing sites. Distributed systems are a gap, not a page.",
    evidenceLevel: "shipped",
    sections: [
      {
        heading: "Scope",
        paragraphs: [
          "Software engineering on this site means the application work I can open: interfaces, content models, APIs that read public data, and the occasional extension. It includes how a product is staged so a prototype is not described as infrastructure.",
          "It does not include a distributed-systems portfolio. MedVoice specifies PostgreSQL, a Redis-shaped cache beside it, and idempotent invoice posting. The API still defaults to an in-memory catalog. That is a plan plus a constraint, not a case study in consensus, queues, or multi-region failover. I am not publishing a distributed-systems URL for it.",
        ],
      },
      {
        heading: "Stacks I have actually used",
        paragraphs: [
          "This site is Vite, React, and TypeScript, prerendered to HTML. Flagship products and several MVPs use Next.js. Overlay Text Box is a Chrome extension. Client sites for Iha by Himani and Praful H. are marketing and portfolio sites with public repositories.",
          "MedVoice's recorded architecture is a Next.js admin, a NestJS modular monolith, and an Android worker app that is still a scaffold. I cite that as the product's own stage explanation, not as a completed enterprise rollout.",
        ],
      },
      {
        heading: "How I try to keep the software honest",
        paragraphs: [
          "Stage labels live in one module so a page cannot quietly upgrade itself. Public pages and Markdown twins read the same content records. Phone numbers and withheld award claims are omitted from machine-readable output as well as from the HTML.",
          "For client work, the outcome I will write down is the one in the case study. Iha by Himani is a responsive studio site. An older '300% inquiries' line was unverified and is not used.",
        ],
      },
      {
        heading: "Testing and failure",
        paragraphs: [
          "This repository uses Vitest and Playwright. The interesting failures are content failures: a soft 404 that returns the homepage, a function that does not return a response the host accepts, a canonical URL that disagrees with the redirect. Those are the defects the SEO audit records, and they are ordinary software defects.",
        ],
      },
    ],
    evidence: [
      {
        href: "/work/the-open-framework",
        label: "The Open Framework",
        note: "Front-end prototype. Not national infrastructure.",
      },
      {
        href: "/work/overlay-text-box",
        label: "Overlay Text Box",
        note: "Chrome extension. Open source.",
      },
      {
        href: "/work/iha-by-himani",
        label: "Iha by Himani",
        note: "Client marketing site, 2023.",
      },
      {
        href: "/work/shiksha-mitra",
        label: "Shiksha-Mitra",
        note: "Learning platform MVP.",
      },
      {
        href: "https://github.com/ayushrai-hub/ayush-work",
        label: "This site's repository",
        note: "The content layer and the prerender pipeline.",
      },
    ],
    related: [
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
    path: "/software-services",
    title: "Software services",
    h1: "Software services",
    label: "Services",
    showOnHome: true,
    description:
      "What I can actually take on: product framing, web applications, and careful AI features, scoped from work I have already shipped.",
    dek: "No rate card and no package ladder. If the work fits, the next step is a conversation.",
    evidenceLevel: "shipped",
    sections: [
      {
        heading: "Who this is for",
        paragraphs: [
          "People who need a product or a site framed honestly and built as software: an early product surface, a client marketing site, or an AI feature that is not allowed to invent the business decision.",
          "I am a poor fit for vanity redesigns, guaranteed growth numbers, or an engagement whose success is a model demo with no surrounding system.",
        ],
      },
      {
        heading: "What I can deliver",
        paragraphs: [
          "The deliveries I will name are the ones the work already resembles.",
        ],
        bullets: [
          "A stage-honest product site or MVP, with what is implemented written separately from what is planned.",
          "A marketing or portfolio site for a studio or an individual practice, as with Iha by Himani and Praful H.",
          "An AI-assisted workflow where the model proposes and deterministic rules or a person confirm, as MedVoice is designed to do.",
          "Evaluation thinking for LLM outputs: rubrics and review, not a promise to fine-tune a model.",
        ],
      },
      {
        heading: "How an engagement starts",
        paragraphs: [
          "Write down the user, the action, and the sentence that would be false if we shipped only the demo. Then cut scope until that sentence can become true. Client work and product work on this site both got better when the first loop was smaller than the vision.",
          "I don't publish hourly rates or starting prices. Older copy that did was removed. Budget is part of the conversation, not part of the page.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "Email is the reliable path. Calendly is there if a call is easier. I usually reply within the window listed on the contact page.",
        ],
      },
    ],
    evidence: [
      {
        href: "/work/iha-by-himani",
        label: "Iha by Himani",
        note: "Client site for an art studio.",
      },
      {
        href: "/work/praful-h",
        label: "Praful H.",
        note: "Client professional site.",
      },
      {
        href: "/products/the-open-framework",
        label: "The Open Framework",
        note: "Example of a prototype that refuses an infrastructure claim.",
      },
      {
        href: "/contact",
        label: "Contact",
        note: "Email and Calendly. No phone number on the public site.",
      },
    ],
    related: [
      { href: "/software-engineering", label: "Software engineering" },
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
    label: "Background",
    showOnHome: true,
    description:
      "Employment, contract evaluation, and earlier internships and community roles, in the words already used on this site.",
    dek: "Roles with dates. The narratives stay on the records below rather than being rewritten into a highlight reel.",
    evidenceLevel: "shipped",
    sections: [
      {
        heading: "How to read this",
        paragraphs: [
          "The current contract is AI evaluation through Outlier, from August 2025. The FoCDoT role ended in August 2025. UiPath and Salesforce entries are a student champion year and a virtual internship, not ongoing employment.",
          "Titles are the ones stored in the experience records. I am not adding a staff, principal, or research-scientist line.",
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
    ],
    related: [
      { href: "/ai-engineering/rlhf", label: "RLHF and preference feedback" },
      { href: "/ai-engineering/llm-evaluation", label: "LLM evaluation" },
      { href: "/software-engineering", label: "Software engineering" },
    ],
    reading: [],
    gaps: [
      "Offer letters and manager confirmation are not published here. The fact-check log still marks several role details as verifying.",
      "Do not infer direct employment by a frontier lab from the Outlier contract.",
    ],
  },
  {
    path: "/open-source",
    title: "Open source",
    h1: "Open source",
    label: "Code",
    showOnHome: true,
    description:
      "Public repositories for tools, products, client work, and this site. No star counts and no contribution graph.",
    dek: "A repository link means the code is public. It does not mean the product is finished.",
    evidenceLevel: "shipped",
    sections: [
      {
        heading: "Scope",
        paragraphs: [
          "Open source here means a public GitHub repository I am willing to point at. Overlay Text Box is the tool that is primarily an open-source utility. Several product and client repositories are public as well, at the stages their product pages describe.",
          "I do not list stars, forks, or download counts. I also do not imply maintainer status on projects I have not described.",
        ],
      },
    ],
    evidence: [
      {
        href: "/work/overlay-text-box",
        label: "Overlay Text Box",
        note: "Chrome extension that types into page fields. The clearest open-source tool.",
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
 * src/lib/agent/markdown.ts): evidence level, child pages, sections,
 * evidence, related links, further reading, gaps and a contact pointer.
 * Empty evidence, related and gap lists render as "_None listed._".
 */
export function renderDomainBody(page: DomainRecord): string {
  const children = childDomains(page.path)
    .map((child) => `- [${child.title}](${child.path}.md): ${child.description}`)
    .join("\n");
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
    children ? `## In this section\n\n${children}` : "",
    sections,
    "## Evidence",
    "",
    evidence || "_None listed._",
    "## Related",
    "",
    related || "_None listed._",
    reading ? `\n## Further reading\n\n${reading}` : "",
    "## Gaps",
    "",
    gaps || "_None listed._",
    "",
    "Contact: /contact",
  ]
    .filter((part) => part !== "")
    .join("\n\n");
}
