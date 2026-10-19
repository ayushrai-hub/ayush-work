/**
 * Copy and illustrative contracts for the RevOps engineering proof of work.
 *
 * The page and the Markdown twin both read this module. REVFLOW is the name of the
 * portfolio demonstration, not a shipped product. Case-study sentences describe the
 * Revenue Intelligence Engine only as far as its repository and live shell were checked.
 *
 * Connects to:
 * - src/pages/RevopsPowPage.tsx.
 * - src/lib/agent/markdown.ts (`renderRevopsBody`).
 * - src/content/searchIndex.ts.
 */

/** Route for this proof of work. */
export const REVOPS_PATH = "/pow/revops-engineering";

/** Title used in the document head and the Markdown twin. */
export const REVOPS_TITLE = "RevOps engineering";

/** Description used for search, SEO, and the Markdown twin. */
export const REVOPS_DESCRIPTION =
  "A synthetic revenue-operations workbench: normalization, deduplication, enrichment, scoring, routing, simulated CRM writes, and failure handling. No live CRM and no real prospects.";

/** Hero and thesis lines the page is required to say. */
export const revopsHero = {
  eyebrow: "REVOPS ENGINEERING / PROOF OF WORK",
  headline: "Engineer the system behind the revenue.",
  support:
    "I build connected GTM systems that turn fragmented data and manual processes into reliable, measurable revenue workflows.",
  positioning: "I engineer the systems behind predictable revenue operations.",
  supporting:
    "From messy prospect data to actionable pipeline intelligence, I build the data pipelines, automations, controls, and analytics that help revenue teams operate more reliably.",
  projectName: "REVFLOW",
  projectLine: "Revenue Operations Workbench",
  nameNote:
    "REVFLOW is a name for this portfolio demonstration. It is not a shipped product and it does not replace RevenueRoles or the Revenue Intelligence Engine.",
};

/** Ways a revenue workflow breaks, used as the thesis list. */
export const revopsBreaks = [
  "Prospect records are duplicated, so two owners work the same person.",
  "CRM fields arrive under different names, so reports group the same fact apart.",
  "Enrichment data is stale and overwrites a newer value a person already checked.",
  "Routing rules match more than one owner, and the system hides which rule won.",
  "Sales activity is stored in a tool the CRM never hears about.",
  "A workflow trigger runs twice and creates two follow-up tasks.",
  "Pipeline stages are updated by different tools with different stage names.",
  "Attribution is missing, and a dashboard fills the gap with a silent default.",
  "A dashboard aggregate does not match the rows underneath it.",
  "An automation fails and the only trace is an empty queue.",
] as const;

/** One box in the architecture diagram. */
export interface RevopsNode {
  id: string;
  name: string;
  timing: "Synchronous" | "Asynchronous" | "Either";
  responsibility: string;
  inputs: string;
  outputs: string;
  failure: string;
}

/** Components of the proposed revenue system. Click targets on the page. */
export const revopsNodes: RevopsNode[] = [
  {
    id: "ingestion",
    name: "Ingestion",
    timing: "Asynchronous",
    responsibility: "Accept a demo form, a CSV, an event file, a signup, or a referral without dropping a bad row.",
    inputs: "Source payloads and an idempotency key.",
    outputs: "A stored raw row and a receipt.",
    failure: "A repeated key must not create a second prospect.",
  },
  {
    id: "canonical",
    name: "Canonical model",
    timing: "Synchronous",
    responsibility: "Map source field names onto one prospect shape and keep provenance.",
    inputs: "Raw rows.",
    outputs: "Canonical prospects plus unmapped keys.",
    failure: "An unknown key is reported, not deleted.",
  },
  {
    id: "validation",
    name: "Validation",
    timing: "Synchronous",
    responsibility: "Check required fields, enums, and email syntax. Syntax is not deliverability.",
    inputs: "Canonical prospects.",
    outputs: "Issues attached to the same rows.",
    failure: "A missing email stops routing. The row stays visible.",
  },
  {
    id: "identity",
    name: "Identity resolution",
    timing: "Synchronous",
    responsibility: "Score contact duplicates and account links with explicit rules.",
    inputs: "Canonical prospects.",
    outputs: "Pairs, a heuristic score, and a merge decision.",
    failure: "A shared domain must not merge two people.",
  },
  {
    id: "enrichment",
    name: "Enrichment adapters",
    timing: "Asynchronous",
    responsibility: "Propose values with a source, a time, and a freshness label. This demo uses a local fixture.",
    inputs: "A domain and the current field values.",
    outputs: "Proposals, conflicts, and provider errors.",
    failure: "A rate limit, a timeout, or a stale value must not be written as fact.",
  },
  {
    id: "qualification",
    name: "Qualification",
    timing: "Synchronous",
    responsibility: "Explain fit, intent, engagement, and confidence separately.",
    inputs: "A canonical prospect and the current weights.",
    outputs: "Four numbers and an illustrative band.",
    failure: "Missing fields lower confidence. They are not guessed.",
  },
  {
    id: "routing",
    name: "Routing",
    timing: "Synchronous",
    responsibility: "Apply ordered rules and leave an explicit unassigned or review state.",
    inputs: "The prospect, the score, and the fictional roster.",
    outputs: "The matching rules and one owner, or none.",
    failure: "An unavailable owner is not silently replaced.",
  },
  {
    id: "workflow",
    name: "Workflow orchestration",
    timing: "Asynchronous",
    responsibility: "Move one prospect through validate, match, score, assign, preview, write, and verify.",
    inputs: "A prospect and a confirmation.",
    outputs: "A step list with completed, failed, skipped, or waiting states.",
    failure: "A failed step skips the follow-up instead of pretending the run finished.",
  },
  {
    id: "crm",
    name: "CRM adapter",
    timing: "Asynchronous",
    responsibility: "Turn a canonical prospect into a create or update. This phase only stores the result in memory.",
    inputs: "A confirmed preview.",
    outputs: "A simulated response and a verification diff.",
    failure: "Partial writes, rate limits, and conflicts stay visible.",
  },
  {
    id: "activity",
    name: "Activity and tasks",
    timing: "Asynchronous",
    responsibility: "Record the follow-up once.",
    inputs: "A successful CRM write.",
    outputs: "One task keyed by the prospect.",
    failure: "A retry must not create a second task.",
  },
  {
    id: "analytics",
    name: "Analytics",
    timing: "Either",
    responsibility: "Aggregate the same rows the workbench is showing, with the definition beside the number.",
    inputs: "Prospects, pairs, workflow runs, and CRM events.",
    outputs: "Rates and the row ids behind them.",
    failure: "A claimed total that disagrees with a recount is a discrepancy, not a new number.",
  },
  {
    id: "observability",
    name: "Observability",
    timing: "Asynchronous",
    responsibility: "Keep the idempotency key, the rule trace, and the adapter response.",
    inputs: "Every state change.",
    outputs: "An audit a person can read.",
    failure: "A silent success with no event is treated as a bug.",
  },
];

/** One engineering choice the visitor can open. */
export interface RevopsDecision {
  id: string;
  title: string;
  problem: string;
  alternatives: string;
  demo: string;
  tradeoff: string;
  change: string;
}

/** Decisions the demonstration actually makes. */
export const revopsDecisions: RevopsDecision[] = [
  {
    id: "canonical",
    title: "CRM-centric model or a canonical model",
    problem: "Source fields do not share names, and a CRM field list changes when the CRM does.",
    alternatives: "Write each source straight into CRM fields, or map every source into one internal prospect first.",
    demo: "REVFLOW maps into a canonical prospect, then into a simulated CRM shape. The CRM is a destination, not the only schema.",
    tradeoff: "A canonical model is extra surface area. It is useful when more than one source and more than one destination exist. A single form that only creates CRM leads does not need it.",
    change: "If there is one source and one CRM, mapping at the edge is enough.",
  },
  {
    id: "enrichment-timing",
    title: "Real-time enrichment or batch enrichment",
    problem: "A person waiting on a form wants an answer now. A provider charges per call and limits the rate.",
    alternatives: "Enrich on arrival, or enrich a queue on a schedule.",
    demo: "The workbench proposes fixture values when a row is inspected. It does not call a provider.",
    tradeoff: "Real-time enrichment lowers the wait and raises cost and failure during the request. Batch enrichment is easier to retry and slower to show.",
    change: "A production adapter needs a contract, a cache, a budget, and a way to mark stale fields. Those controls are not built here.",
  },
  {
    id: "routing-style",
    title: "Deterministic routing or AI-assisted routing",
    problem: "Ownership decides who is accountable for a person. An opaque suggestion is hard to audit.",
    alternatives: "Ordered rules, or a model that proposes an owner.",
    demo: "Rules run in a fixed order. A model is not asked to pick an owner.",
    tradeoff: "Rules are auditable and brittle when the business changes. A model can notice messy cases and can also assign the wrong person without a trace.",
    change: "A model could suggest a review case later. It should not be the only writer of the owner field.",
  },
  {
    id: "merge",
    title: "Automatic merge or human review",
    problem: "Exact emails are usually the same person. Similar company names are often not.",
    alternatives: "Merge anything over a threshold, or require a click except for the clearest matches.",
    demo: "An exact email may be merged after a click. A shared domain never merges two contacts by itself.",
    tradeoff: "Automatic merges are fast and can combine two people. Review is slower and safer.",
    change: "A calibrated model would still need a refusal list for generic inboxes and a way to undo a merge.",
  },
  {
    id: "orchestration",
    title: "Native CRM workflows or an external orchestrator",
    problem: "CRM automation is close to the record. It is also hard to test, version, and retry outside that CRM.",
    alternatives: "Keep the flow in the CRM, or run it in a service that calls the CRM through an adapter.",
    demo: "REVFLOW is the external orchestrator, and the CRM is a simulated adapter behind a preview.",
    tradeoff: "An external service can be tested and can also drift from CRM permissions and field limits.",
    change: "A short flow that only a CRM user edits can stay in the CRM. A flow that must be idempotent across several systems earns a service.",
  },
  {
    id: "processing",
    title: "Event-driven processing or a schedule",
    problem: "Events are timely and can arrive twice. A schedule is easier to replay and slower.",
    alternatives: "React to each submission, or poll a bucket of files.",
    demo: "The queue is event-shaped, and the idempotency key is what makes a repeat safe. Nothing is deployed as a worker.",
    tradeoff: "Events need keys, ordering, and a dead-letter path. Schedules need a watermark and can leave a person waiting.",
    change: "CSV drops fit a schedule. A demo form fits an event. Both can land in the same canonical model.",
  },
  {
    id: "metrics",
    title: "One dashboard or explicit metric definitions",
    problem: "Two charts can use the same words and different denominators.",
    alternatives: "Publish one number, or publish the definition and the rows.",
    demo: "Each rate names its numerator and denominator, and the rows behind it can be opened.",
    tradeoff: "Definitions take space on the page. Without them, a duplicate rate can be argued forever.",
    change: "A warehouse metric should name its grain, its source of truth, and what it does with nulls before anyone treats it as a target.",
  },
];

/** Roadmap. Only the first phase is implemented, and only as this page. */
export const revopsRoadmap = [
  { phase: "Phase 1", title: "Frontend workbench and deterministic simulation", status: "Implemented on this page" },
  { phase: "Phase 2", title: "Typed schemas and a reusable workflow engine", status: "Proposed" },
  { phase: "Phase 3", title: "Persistent storage and audit records", status: "Proposed" },
  { phase: "Phase 4", title: "CRM adapter against a vendor sandbox", status: "Proposed" },
  { phase: "Phase 5", title: "Scheduled and event-driven ingestion", status: "Proposed" },
  { phase: "Phase 6", title: "Production enrichment with provider controls", status: "Proposed" },
  { phase: "Phase 7", title: "Analytics reconciliation and monitoring", status: "Proposed" },
  { phase: "Phase 8", title: "Permission hardening, operational tests, and deployment", status: "Proposed" },
] as const;

/** Illustrative JSON contracts. They are not a production API. */
export const revopsContracts: { name: string; body: string }[] = [
  {
    name: "Prospect event",
    body: `{
  "schemaVersion": 1,
  "idempotencyKey": "demo:mira:2026-10-12",
  "source": "website_demo",
  "receivedAt": "2026-10-12",
  "externalIds": { "formSubmissionId": "synthetic-form-1" },
  "fields": { "company": "Northwind Ledger", "email_address": "mira.chen@northwind-ledger.example" }
}`,
  },
  {
    name: "Canonical prospect",
    body: `{
  "id": "web-mira",
  "accountName": "Northwind Ledger",
  "domain": "northwind-ledger.example",
  "email": "mira.chen@northwind-ledger.example",
  "provenance": [{ "field": "email", "source": "website_demo", "recordedAt": "2026-10-12" }]
}`,
  },
  {
    name: "CRM sync event",
    body: `{
  "key": "update:northwind-ledger.example:mira.chen@northwind-ledger.example",
  "operation": "update",
  "status": "applied",
  "fieldsWritten": ["lifecycle", "owner"],
  "fieldsFailed": []
}`,
  },
];

/** What the Revenue Intelligence Engine repository and live shell actually show. */
export const revopsCaseStudy = {
  title: "Revenue Intelligence Engine",
  repo: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE",
  demo: "https://revopy.vercel.app/",
  recordedDemo: "https://cashmaker-two.vercel.app/",
  problem:
    "The project addresses a GTM list that is researched by hand: fit, timing, a contact, and a reason to talk, with no shared trace of why an account was prioritized.",
  flow:
    "A run loads a synthetic company file, normalizes domain and name, drops later rows that share a domain or a normalized name, calls a mock enrichment provider, reads signals that are already on the fixture, scores the account with a fixed 100-point rubric, researches the top accounts, and waits for a person to approve an export.",
  architecture:
    "The repository is a FastAPI service and a Next.js console. Scoring lives in app/scoring/icp.py. The weights are ICP fit 25, growth 20, hiring 20, technology fit 15, GTM need 10, and contactability 10. The numeric score is not produced by a model. Research uses an OpenAI-compatible client only when a key is set, and otherwise a deterministic fallback.",
  presentation:
    "The console has a dashboard, an ICP runner, account pages, an approval queue, and an output view. The live shell says the companies, contacts, and signals are fictional and that it does not write to a live CRM or send outbound messages.",
  synthetic:
    "Companies, contacts, signals, and enrichment are synthetic. The default path described in the repository is 42 companies, 3 duplicates dropped, and the top 5 researched. I did not re-run that count for this page.",
  complete:
    "The workflow, the first-wins dedupe, the mock provider, the signal classifier, the score, the approval states, and the report code are in the repository, with pytest modules beside them.",
  missing:
    "There is no Clay, Apollo, or CRM adapter. There is no outbound send. Without a database URL, the deployed store is SQLite in a temporary directory and does not survive a cold start; the report route seeds a run when the store is empty.",
  next:
    "The next engineering step is a real provider boundary with cost, cache, and provenance controls, still in front of a human approval gate. That boundary is not built.",
  checked:
    "On 19 Oct 2026, revopy.vercel.app and cashmaker-two.vercel.app both returned a page titled Revenue Intelligence Engine with the same synthetic-data banner. The project record on this site stores the cashmaker URL. I did not treat either host as proof that a CRM is connected.",
};

/** The architecture node for an id, or ingestion when the id is unknown. */
export function revopsNode(id: string): RevopsNode {
  return revopsNodes.find((item) => item.id === id) ?? revopsNodes[0];
}

/** Markdown body for /pow/revops-engineering.md. */
export function renderRevopsBody(): string {
  return [
    revopsHero.positioning,
    "",
    revopsHero.supporting,
    "",
    `${revopsHero.projectName} is ${revopsHero.projectLine}. ${revopsHero.nameNote}`,
    "",
    "The workbench uses fictional companies and `.example` addresses. It does not call an enrichment API, write to a CRM, or send email.",
    "",
    "## Thesis",
    "",
    ...revopsBreaks.map((line) => `- ${line}`),
    "",
    "The point of the engineering is a system that is observable and consistent. Better tools do not by themselves produce revenue.",
    "",
    "## Architecture",
    "",
    ...revopsNodes.map(
      (node) =>
        `### ${node.name} (${node.timing})\n\n${node.responsibility}\n\nInputs: ${node.inputs}\n\nOutputs: ${node.outputs}\n\nFailure: ${node.failure}`,
    ),
    "",
    "## Decisions",
    "",
    ...revopsDecisions.map(
      (decision) =>
        `### ${decision.title}\n\n${decision.problem}\n\nDemo: ${decision.demo}\n\nTrade-off: ${decision.tradeoff}`,
    ),
    "",
    "## Revenue Intelligence Engine",
    "",
    revopsCaseStudy.problem,
    "",
    revopsCaseStudy.flow,
    "",
    revopsCaseStudy.architecture,
    "",
    revopsCaseStudy.synthetic,
    "",
    revopsCaseStudy.missing,
    "",
    revopsCaseStudy.checked,
    "",
    `Repository: ${revopsCaseStudy.repo}`,
    "",
    `Demo: ${revopsCaseStudy.demo}`,
    "",
    "## Roadmap",
    "",
    ...revopsRoadmap.map((phase) => `- ${phase.phase}: ${phase.title} — ${phase.status}`),
    "",
    "Illustrative contracts on the HTML page are not a production API.",
  ].join("\n");
}
