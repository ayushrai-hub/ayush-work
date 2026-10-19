/**
 * Forward deployed engineering proof of work: the record behind /pow/fde and /pow/fde.md.
 *
 * RELAY is a personal demonstration scenario for customer-operations intelligence. The accounts,
 * scores, and workflow are predefined in this module so the page can show them without a backend.
 * Phase 1 is this page. Later phases stay `planned`. Product and project facts in the related-work
 * list are read from products.ts and projects.ts by slug.
 *
 * Connects to:
 * - src/pages/FdePowPage.tsx and src/components/fde/* render these records.
 * - `buildPages()` in src/lib/agent/markdown.ts calls `renderFdeBody` for /pow/fde.md.
 * - searchIndex.ts adds one item from `fdePow`.
 * - Depends on getProductBySlug (products.ts), getProjectBySlug (projects.ts), and person.ts.
 */
import { person } from "./person";
import { getProductBySlug } from "./products";
import { getProjectBySlug } from "./projects";

/** Route path for the proof-of-work page. Prerendered and indexed. */
export const FDE_PATH = "/pow/fde";

/** How far a RELAY roadmap phase has actually gone. */
export type FdePhaseStatus = "planned" | "in-progress" | "implemented" | "tested" | "deployed";

/** Display label for each roadmap status. */
export const fdePhaseStatusLabels: Record<FdePhaseStatus, string> = {
  planned: "Planned",
  "in-progress": "In progress",
  implemented: "Implemented",
  tested: "Tested",
  deployed: "Deployed",
};

/** Who performs a workflow stage. */
export type FdeStageKind = "deterministic" | "ai-assisted" | "human";

/** Short label for a workflow stage kind. */
export const fdeStageKindLabels: Record<FdeStageKind, string> = {
  deterministic: "Deterministic",
  "ai-assisted": "AI-assisted",
  human: "Human gate",
};

/** Shell surfaces in the product preview. */
export type FdeShellViewId =
  | "overview"
  | "explorer"
  | "investigation"
  | "signals"
  | "workflow"
  | "approvals"
  | "integrations"
  | "audit";

/** One engineering principle in the thesis section. */
export interface FdePrinciple {
  id: string;
  title: string;
  body: string;
}

/** One step in the fragmented-operations story. */
export interface FdeProblemStep {
  id: string;
  title: string;
  body: string;
}

/** One stage of the proposed RELAY workflow. */
export interface FdeStage {
  id: string;
  step: number;
  title: string;
  kind: FdeStageKind;
  enters: string;
  happens: string;
  leaves: string;
  fails: string;
  verified: string;
}

/** One cited observation inside a synthetic account signal. */
export interface FdeEvidence {
  id: string;
  source: string;
  observation: string;
}

/** A scoring rule and the evidence behind it, for one synthetic account. */
export interface FdeSignal {
  id: string;
  name: string;
  points: number;
  rule: string;
  reading: string;
  evidence: FdeEvidence[];
}

/** A predefined customer account used only in the simulated preview. */
export interface FdeAccount {
  id: string;
  name: string;
  segment: string;
  signals: FdeSignal[];
  recommendation: string;
  action: {
    title: string;
    detail: string;
    approval: string;
  };
}

/** One proposed architecture layer. */
export interface FdeLayer {
  id: string;
  name: string;
  summary: string;
  components: string[];
  responsibility: string;
  interfaces: string;
  boundary: string;
}

/** One engineering trade-off. */
export interface FdeDecision {
  id: string;
  title: string;
  problem: string;
  alternatives: string[];
  selected: string;
  reason: string;
  tradeoff: string;
  revisit: string;
}

/** Expected behavior for one failure, described as a design intent. */
export interface FdeFailure {
  id: string;
  title: string;
  behavior: string;
}

/** One step in the proposed deployment sequence. */
export interface FdeProcessStep {
  id: string;
  step: number;
  title: string;
  summary: string;
  deliverables: string[];
}

/** One RELAY development phase and its verified status. */
export interface FdeRoadmapPhase {
  phase: number;
  title: string;
  summary: string;
  status: FdePhaseStatus;
  note: string;
}

/** In-page section used by the jump navigation. */
export interface FdeSection {
  id: string;
  label: string;
}

/** A related project or product, resolved from the content records. */
export interface FdeRelatedWork {
  slug: string;
  title: string;
  problem: string;
  demonstrates: string;
  links: { href: string; label: string }[];
}

/** Page identity, hero copy, and the lines that must stay attached to the proposal. */
export const fdePow = {
  path: FDE_PATH,
  title: "Forward deployed engineering",
  description:
    "A personal proof of work for forward deployed engineering: the proposed RELAY customer-operations workflow, the architecture, and the decisions behind it.",
  eyebrow: "Forward deployed engineering / proof of work",
  headline: "I build systems that solve real operational problems.",
  dek: "From ambiguous problem statements to working software: I investigate workflows, connect systems, build AI-powered solutions, and validate the result.",
  status:
    "In progress. Personal engineering project. RELAY is a proposed demonstration on this page, not a product deployed for a customer.",
  closing:
    "I like working where the problem is still messy, the systems are fragmented, and the solution needs to be engineered.",
  relayName: "RELAY",
  relayLabel: "Customer operations intelligence",
  relayRepository: null as string | null,
};

/** Jump targets, in page order. */
export const fdeSections: FdeSection[] = [
  { id: "thesis", label: "Thesis" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "preview", label: "Preview" },
  { id: "architecture", label: "Architecture" },
  { id: "decisions", label: "Decisions" },
  { id: "failures", label: "Failures" },
  { id: "deployment", label: "Deployment" },
  { id: "roadmap", label: "Roadmap" },
  { id: "related", label: "Related work" },
];

/** Working principles. Each one is a constraint on the design, not a slogan. */
export const fdePrinciples: FdePrinciple[] = [
  {
    id: "workflow",
    title: "Understand the workflow first",
    body: "Read how the work happens today: who looks, which system they open, what they write down, and where the handoff breaks.",
  },
  {
    id: "friction",
    title: "Name the operational friction",
    body: "The useful problem is the delay, the missed signal, or the decision that cannot be reconstructed. A new screen is not the problem statement.",
  },
  {
    id: "boundaries",
    title: "Inspect data and system boundaries",
    body: "Find which system owns the account, the ticket, the usage event, and the permission to act. The design follows those boundaries.",
  },
  {
    id: "simplest",
    title: "Choose the simplest architecture that meets the requirement",
    body: "Add a service, a model, or a queue when the requirement needs it. Until then, keep the path short enough to test.",
  },
  {
    id: "integrate",
    title: "Integrate systems",
    body: "The result has to meet the CRM, the support tool, and the analytics product where the teams already work.",
  },
  {
    id: "ai-where",
    title: "Use AI where it changes the work",
    body: "Use a model to summarize retrieved evidence and to draft a recommendation. Use rules where the output must be repeatable.",
  },
  {
    id: "control",
    title: "Keep outputs inspectable and actions controllable",
    body: "A person can see the records behind a claim. A consequential write waits for an explicit approval.",
  },
  {
    id: "validate",
    title: "Validate the result",
    body: "Sending the request is not the same as the account changing. Check the outcome, and record what was true.",
  },
];

/** The demonstration scenario, in the order the friction compounds. */
export const fdeProblemSteps: FdeProblemStep[] = [
  {
    id: "fragmented",
    title: "Fragmented customer data",
    body: "Account facts sit in the CRM, the support system, product analytics, and internal chat.",
  },
  {
    id: "manual",
    title: "Manual investigation",
    body: "Someone opens each tool, copies notes, and tries to reconstruct the week.",
  },
  {
    id: "delayed",
    title: "Delayed identification",
    body: "A deteriorating account is noticed when a person happens to look, not when the signals line up.",
  },
  {
    id: "inconsistent",
    title: "Inconsistent decisions",
    body: "Two reviewers can see different slices and choose different next steps, with no shared evidence.",
  },
  {
    id: "untracked",
    title: "Untracked follow-up",
    body: "The message, the CRM edit, or the decision not to act leaves no single trail.",
  },
];

/** Proposed sources. The preview lists them as not connected. */
export const fdeSources = ["CRM", "Support platform", "Product analytics", "Internal event streams"] as const;

/** Proposed workflow. Kind separates rules, model assistance, and the human gate. */
export const fdeStages: FdeStage[] = [
  {
    id: "ingest",
    step: 1,
    title: "Ingest events",
    kind: "deterministic",
    enters: "A payload from a source adapter: CRM, support, product analytics, or an internal event stream.",
    happens: "The adapter checks the payload shape and attaches a source name and a source event id.",
    leaves: "A validated raw event, or a rejection.",
    fails: "A timeout, or a payload the adapter does not recognize.",
    verified: "The raw event is stored once. The same source event id does not create a second raw event.",
  },
  {
    id: "normalize",
    step: 2,
    title: "Normalize records",
    kind: "deterministic",
    enters: "A validated raw event.",
    happens: "Fields map into a shared account, person, and event schema. Unmapped fields stay attached as source extras.",
    leaves: "A normalized event with a pointer back to the raw payload.",
    fails: "A required field is missing or has the wrong type.",
    verified: "The normalized record traces back to the raw payload. Invalid events stay out of the domain model.",
  },
  {
    id: "signals",
    step: 3,
    title: "Detect operational signals",
    kind: "deterministic",
    enters: "Normalized events for one account.",
    happens: "Rules look for repeated severe tickets, a usage drop, a missing owner, an overdue invoice, and similar conditions.",
    leaves: "Signal records that name the rule and the event ids that triggered it.",
    fails: "The rule's input is missing, or two sources disagree.",
    verified: "Each signal cites event ids. A missing input is recorded as missing.",
  },
  {
    id: "score",
    step: 4,
    title: "Calculate transparent risk scores",
    kind: "deterministic",
    enters: "The signal records for one account.",
    happens: "Each triggered rule adds its points. The score is the sum. A model does not set or adjust it.",
    leaves: "A score and the rule lines that produced it.",
    fails: "A signal that does not belong to a known rule.",
    verified: "Adding the stored point lines again reproduces the score.",
  },
  {
    id: "investigate",
    step: 5,
    title: "Investigate the underlying evidence",
    kind: "ai-assisted",
    enters: "The account, its signals, and the records those signals cite.",
    happens: "Retrieval is a query. A model may summarize only those records. If the model is unavailable, the evidence list still stands.",
    leaves: "An evidence packet, and a summary only when the model output passes validation.",
    fails: "The summary cites a record that was not retrieved, or the provider returns nothing usable.",
    verified: "A person can open every cited record. A rejected summary is withheld.",
  },
  {
    id: "recommend",
    step: 6,
    title: "Generate recommendations",
    kind: "ai-assisted",
    enters: "The evidence packet and the score breakdown.",
    happens: "A model may draft a next step that cites the packet. A template can restate the rule result with no model. Uncited claims are discarded.",
    leaves: "A recommendation marked as a draft or a template, plus the evidence ids it used.",
    fails: "The draft cites nothing, cites unknown ids, or the provider times out.",
    verified: "The visible recommendation cites only ids in the packet. Otherwise no recommendation is shown.",
  },
  {
    id: "approve",
    step: 7,
    title: "Request human approval",
    kind: "human",
    enters: "A recommendation and one concrete proposed action.",
    happens: "The action waits. A person approves or rejects it. The system does not approve itself.",
    leaves: "A decision that names the person and the time, or a proposal that is still waiting.",
    fails: "The proposal is incomplete, or the person rejects it.",
    verified: "A waiting or rejected proposal has no successful execution.",
  },
  {
    id: "execute",
    step: 8,
    title: "Execute an authorized action",
    kind: "deterministic",
    enters: "An approved action and the idempotency key for that approval.",
    happens: "The workflow calls the target system and stores the adapter result.",
    leaves: "An execution record: succeeded, failed, or retrying.",
    fails: "The target times out, returns an error, or the approval was already used.",
    verified: "The response or the timeout is on the execution record. Sending the request is not treated as success.",
  },
  {
    id: "verify",
    step: 9,
    title: "Verify the result",
    kind: "deterministic",
    enters: "An execution record.",
    happens: "A follow-up read checks the condition the action was meant to change, when the target allows a read.",
    leaves: "Confirmed, not confirmed, or not checkable.",
    fails: "The read times out, or the target state does not match the intended change.",
    verified: "The write result and the later read are stored as separate facts.",
  },
  {
    id: "audit",
    step: 10,
    title: "Record the audit trail",
    kind: "deterministic",
    enters: "The event ids, score breakdown, recommendation, approval, execution, and verification.",
    happens: "Those identifiers and decisions are appended to an audit history.",
    leaves: "An audit entry a person can read later.",
    fails: "A required identifier is missing, so the entry is stored as incomplete.",
    verified: "From the entry, a person can walk back to the evidence, the rules, the approver, and the execution result.",
  },
];

/** Surfaces in the application shell. Investigation is the one working preview. */
export const fdeShellViews: { id: FdeShellViewId; label: string; summary: string }[] = [
  {
    id: "overview",
    label: "Overview",
    summary:
      "A later home for accounts ordered by the deterministic score. This preview does not roll up a portfolio.",
  },
  {
    id: "explorer",
    label: "Account Explorer",
    summary: "Choose a synthetic account to open its investigation. The names are invented.",
  },
  {
    id: "investigation",
    label: "Account Investigation",
    summary: "Working preview. Risk rules, evidence, the score sum, a sample recommendation, and the approval gate.",
  },
  {
    id: "signals",
    label: "Signals",
    summary: "The rules that fired for the selected account. A shared signal catalog is a later phase.",
  },
  {
    id: "workflow",
    label: "Workflow Center",
    summary: "The proposed action for the selected account. Execution is not connected.",
  },
  {
    id: "approvals",
    label: "Approvals",
    summary: "What a person would have to approve. The control on this page records nothing outside the browser.",
  },
  {
    id: "integrations",
    label: "Integrations",
    summary: "The proposed source systems. None of them are connected in this phase.",
  },
  {
    id: "audit",
    label: "Audit Trail",
    summary: "The shape of an audit row for the selected account. Nothing is written to a database.",
  },
];

/** Invented accounts. Point values are the scoring rules, summed in the preview. */
export const fdeAccounts: FdeAccount[] = [
  {
    id: "northline",
    name: "Northline Analytics",
    segment: "Synthetic · mid-market",
    signals: [
      {
        id: "northline-tickets",
        name: "Repeated severe tickets",
        points: 25,
        rule: "Add 25 when two or more severity-1 tickets open in 14 days.",
        reading: "Three severity-1 tickets opened in 14 days.",
        evidence: [
          {
            id: "nl-t1",
            source: "Support platform",
            observation: "Ticket 4411, severity 1, billing export failing, opened day 2.",
          },
          {
            id: "nl-t2",
            source: "Support platform",
            observation: "Ticket 4418, severity 1, same export, opened day 6.",
          },
          {
            id: "nl-t3",
            source: "Support platform",
            observation: "Ticket 4427, severity 1, opened day 11, still unresolved.",
          },
        ],
      },
      {
        id: "northline-usage",
        name: "Usage drop",
        points: 20,
        rule: "Add 20 when weekly active users fall by more than half against the prior 4-week median.",
        reading: "Weekly active users moved from 40 to 11.",
        evidence: [
          {
            id: "nl-u1",
            source: "Product analytics",
            observation: "Prior 4-week median: 40 weekly active users.",
          },
          {
            id: "nl-u2",
            source: "Product analytics",
            observation: "Latest complete week: 11 weekly active users.",
          },
        ],
      },
      {
        id: "northline-owner",
        name: "No current owner",
        points: 30,
        rule: "Add 30 when the CRM champion is inactive and no successor is set.",
        reading: "The champion is marked inactive. The owner field is empty.",
        evidence: [
          {
            id: "nl-c1",
            source: "CRM",
            observation: "Primary contact marked inactive on day 4.",
          },
          {
            id: "nl-c2",
            source: "CRM",
            observation: "Account owner field is empty.",
          },
        ],
      },
      {
        id: "northline-invoice",
        name: "Overdue invoice",
        points: 15,
        rule: "Add 15 when an invoice is more than 14 days past due.",
        reading: "One invoice is 18 days past due.",
        evidence: [
          {
            id: "nl-b1",
            source: "CRM",
            observation: "Invoice INV-188, due day minus 18, status open.",
          },
        ],
      },
    ],
    recommendation:
      "Sample text, written for this preview: ask the account's sales owner to confirm a successor and to review the open billing-export tickets before any customer message is sent.",
    action: {
      title: "Draft an internal handoff",
      detail:
        "Create an internal note that lists the three tickets, the usage drop, the empty owner, and the open invoice. Do not email the customer from this step.",
      approval: "A person has to approve the internal note before it is written to the CRM.",
    },
  },
  {
    id: "harbor",
    name: "Harbor & Co",
    segment: "Synthetic · mid-market",
    signals: [
      {
        id: "harbor-usage",
        name: "Usage steady",
        points: 0,
        rule: "Add 0 when weekly active users stay within 10 percent of the prior median.",
        reading: "Weekly active users stayed at 28 against a median of 27.",
        evidence: [
          {
            id: "hb-u1",
            source: "Product analytics",
            observation: "Prior median 27. Latest week 28.",
          },
        ],
      },
      {
        id: "harbor-ticket",
        name: "Single severe ticket",
        points: 10,
        rule: "Add 10 for one open severity-2 ticket and no severity-1 ticket.",
        reading: "One severity-2 ticket is open.",
        evidence: [
          {
            id: "hb-t1",
            source: "Support platform",
            observation: "Ticket 5102, severity 2, report timeout, opened day 3.",
          },
        ],
      },
      {
        id: "harbor-conflict",
        name: "Conflicting owner notes",
        points: 10,
        rule: "Add 10 when two sources disagree about the account owner. Do not pick a winner.",
        reading: "CRM names Priya Shah. The support thread names an empty owner.",
        evidence: [
          {
            id: "hb-c1",
            source: "CRM",
            observation: "Owner field: Priya Shah.",
          },
          {
            id: "hb-c2",
            source: "Support platform",
            observation: "Latest internal note: owner unknown after the renewal call.",
          },
        ],
      },
    ],
    recommendation:
      "Sample text, written for this preview: do not contact the customer while the owner notes disagree. Ask an operator to resolve the owner, then re-read the severity-2 ticket.",
    action: {
      title: "Hold external contact",
      detail: "Leave the customer message unsent. Open an internal task to reconcile the owner field.",
      approval: "A person has to confirm the hold. The preview does not create the task.",
    },
  },
  {
    id: "fieldnote",
    name: "Fieldnote",
    segment: "Synthetic · startup",
    signals: [
      {
        id: "fieldnote-usage",
        name: "Usage steady",
        points: 0,
        rule: "Add 0 when weekly active users stay within 10 percent of the prior median.",
        reading: "Weekly active users are 16 against a median of 15.",
        evidence: [
          {
            id: "fn-u1",
            source: "Product analytics",
            observation: "Prior median 15. Latest week 16.",
          },
        ],
      },
      {
        id: "fieldnote-support",
        name: "No severe tickets",
        points: 0,
        rule: "Add 0 when no severity-1 or severity-2 ticket is open.",
        reading: "No severe tickets are open.",
        evidence: [
          {
            id: "fn-t1",
            source: "Support platform",
            observation: "Open queue: one severity-4 question, answered.",
          },
        ],
      },
      {
        id: "fieldnote-owner",
        name: "Owner present",
        points: 0,
        rule: "Add 0 when the CRM owner and champion are both active.",
        reading: "Owner and champion are active.",
        evidence: [
          {
            id: "fn-c1",
            source: "CRM",
            observation: "Owner and primary contact both active.",
          },
        ],
      },
    ],
    recommendation:
      "Sample text, written for this preview: no customer action. The rules that ran did not add points.",
    action: {
      title: "No external action",
      detail: "Record that the account was reviewed and that no write was proposed.",
      approval: "Nothing is waiting for approval.",
    },
  },
];

/** Proposed layers. The page documents them as a design, not as running services. */
export const fdeLayers: FdeLayer[] = [
  {
    id: "sources",
    name: "Data sources",
    summary: "Systems that already hold the customer record. RELAY would read them through adapters.",
    components: ["CRM", "Support platform", "Product analytics", "Internal event streams"],
    responsibility: "Remain the systems of record for their own objects. RELAY does not replace them.",
    interfaces: "Each source is reached only through an adapter. The rest of the system sees normalized events.",
    boundary: "External systems. Credentials and tenant permissions stay in the adapter configuration.",
  },
  {
    id: "ingestion",
    name: "Ingestion",
    summary: "The door for events. It validates, normalizes, and refuses duplicates.",
    components: ["Source adapters", "Validation", "Event normalization", "Idempotency"],
    responsibility: "Turn source payloads into normalized events exactly once.",
    interfaces: "Adapters implement a shared ingest contract. Valid events are written for the domain layer to read.",
    boundary: "Sits between external systems and domain logic. It does not score and it does not act.",
  },
  {
    id: "domain",
    name: "Domain logic",
    summary: "Account identity, signals, the score, and the evidence attached to both.",
    components: ["Account resolution", "Signal detection", "Deterministic risk scoring", "Evidence aggregation"],
    responsibility: "Decide which account an event belongs to, which rules fire, and which records support them.",
    interfaces: "Reads normalized events and writes account, signal, and score records. Returns an evidence packet to the application and to the AI module.",
    boundary: "Pure domain rules. No model call and no external write.",
  },
  {
    id: "ai",
    name: "AI services",
    summary: "Optional language help on top of retrieved evidence.",
    components: ["Investigation summaries", "Evidence-grounded recommendations", "Structured output validation"],
    responsibility: "Draft a summary and a recommendation that cite retrieved records, then reject output that fails the schema or the citations.",
    interfaces: "Receives an evidence packet. Returns structured text or a typed failure. The domain score is an input, not a field the model may overwrite.",
    boundary: "A provider sits behind this module. The application shows a summary only after validation.",
  },
  {
    id: "workflow",
    name: "Workflow engine",
    summary: "Turns an approved proposal into one external write, and records the outcome.",
    components: ["Action generation", "Approval gates", "Execution", "Retry and failure handling"],
    responsibility: "Hold an action until a person approves it, execute it once, and retry without double-applying.",
    interfaces: "Reads an approved action. Calls an execution adapter. Writes an execution record the audit trail can cite.",
    boundary: "The only path to an external write. The UI cannot call a source system around it.",
  },
  {
    id: "persistence",
    name: "Persistence",
    summary: "The proposed system of record for RELAY's own facts.",
    components: ["PostgreSQL", "Domain records", "Execution records", "Audit history"],
    responsibility: "Keep accounts, signals, scores, approvals, executions, and audit entries across restarts.",
    interfaces: "Domain, workflow, and audit modules read and write through the application database. The browser preview does not.",
    boundary: "One database for this phase of the design. Caches, if added later, do not replace these records.",
  },
  {
    id: "application",
    name: "Application",
    summary: "The surfaces an operator would use. This page previews them.",
    components: ["Account explorer", "Investigation interface", "Approval queue", "Operations dashboard"],
    responsibility: "Show evidence, scores, and proposals, and collect an approval. It does not score or execute on its own.",
    interfaces: "Would call an application API for accounts, investigations, and approvals. Phase 1 implements the investigation with predefined data in the browser.",
    boundary: "UI. It is not the domain layer and it is not the database.",
  },
  {
    id: "observability",
    name: "Observability",
    summary: "How an operator would see that the pipeline is unhealthy.",
    components: ["Processing errors", "Execution outcomes", "Integration health", "Auditability"],
    responsibility: "Surface rejected events, failed executions, adapter timeouts, and the audit trail.",
    interfaces: "Reads processing and execution records. It does not invent a success to clear an alert.",
    boundary: "A read model over the records the other layers write.",
  },
];

/** Trade-offs. Each one is a design choice for RELAY, not a measured benchmark. */
export const fdeDecisions: FdeDecision[] = [
  {
    id: "scoring",
    title: "Deterministic scoring versus LLM-generated scores",
    problem: "A risk number that changes when the prompt changes cannot be explained after an incident.",
    alternatives: [
      "Ask a model for a score.",
      "Let a model adjust a rule score.",
      "Add points from versioned rules and keep the model away from the number.",
    ],
    selected: "Rules add the points. A model may discuss the evidence. It does not author the score.",
    reason: "The same signals must produce the same score, and an operator can see which rule fired.",
    tradeoff: "Rules miss situations nobody encoded. A model might notice a new pattern and still be wrong.",
    revisit:
      "Revisit if a review set shows the rules disagree with how operators judge risk, and a model score can be reproduced. No such review exists.",
  },
  {
    id: "approval",
    title: "Human approval versus unrestricted autonomous execution",
    problem: "The interesting actions write to another system or contact a customer.",
    alternatives: [
      "Execute when the score crosses a threshold.",
      "Require approval for every action, including reads.",
      "Require approval for every external write, and let investigation stay read-only.",
    ],
    selected: "Every external write waits for an explicit human approval. Reading evidence does not.",
    reason: "The system proposes. A person accepts the consequence.",
    tradeoff: "Approval adds delay, and a noisy queue can become a rubber stamp.",
    revisit:
      "A specific action could use a narrower gate once it is shown to be reversible and low-consequence. RELAY has no customer operating history to show that.",
  },
  {
    id: "idempotency",
    title: "Idempotent event processing versus naive ingestion",
    problem: "Source systems retry. A second delivery of the same ticket must not double the score.",
    alternatives: [
      "Insert every payload.",
      "Hide duplicates in the UI after storing them.",
      "Store a source plus source event id, and ignore a repeat.",
    ],
    selected: "An event is identified by its source and source event id. A repeat does not create a second domain effect.",
    reason: "The score should follow the world, not the number of webhook attempts.",
    tradeoff: "A source that reuses ids for genuinely new events would drop the later event. The adapter has to match that source's id contract.",
    revisit: "If a source cannot provide a stable id, give that adapter a documented fallback key and a replay test.",
  },
  {
    id: "adapters",
    title: "Simulated adapters versus real integrations during development",
    problem: "This proof of work does not have a customer's CRM, support tenant, or analytics sandbox.",
    alternatives: [
      "Wait to build anything until a live tenant exists.",
      "Call live APIs with personal tokens and treat the result as a demo.",
      "Define the adapter contract and return fixed payloads from a simulated adapter.",
    ],
    selected: "Simulated adapters that return the payloads this page already shows. The contract is what a real adapter would implement.",
    reason: "Domain behavior can be inspected without implying a customer system is connected.",
    tradeoff: "A fixture will not reveal that tenant's rate limits, schema drift, or permission errors.",
    revisit: "Replace a simulated adapter when a sandbox, a written data contract, and a replay test exist.",
  },
  {
    id: "grounding",
    title: "Evidence-grounded recommendations versus unsupported model output",
    problem: "A fluent next step that cites nothing cannot be checked.",
    alternatives: [
      "Let the model write from the account name.",
      "Retrieve records and require the draft to cite them.",
      "Use templates only, with no model.",
    ],
    selected: "Recommendations cite retrieved records. A template may restate a rule. Uncited claims are rejected.",
    reason: "The operator's job is to check the claim against the evidence.",
    tradeoff: "The draft can only know what retrieval returned. A missed record becomes a missed recommendation.",
    revisit: "If citations pass and operators still find the prose misleading, prefer the template for that action.",
  },
  {
    id: "modular",
    title: "A modular application versus premature microservices",
    problem: "The diagram has several layers. They do not yet have independent traffic, teams, or failure budgets.",
    alternatives: [
      "Deploy a service per stage now.",
      "One application with module boundaries and one database.",
      "One script with no internal boundaries.",
    ],
    selected: "One application. Ingestion, domain, AI, and workflow are modules behind interfaces, with PostgreSQL as the store.",
    reason: "The boundaries are for clarity and later extraction. Extra deployables would add network failures first.",
    tradeoff: "A module that later needs its own scale or release cycle has to be extracted. The interfaces should allow that.",
    revisit: "Extract a service when one module has a scaling, security, or release constraint the single application cannot meet.",
  },
  {
    id: "persistence",
    title: "Persistent records versus transient in-memory state",
    problem: "An approval and an audit row have to survive a restart, or they are not operational records.",
    alternatives: [
      "Keep the demo in memory and call it the product.",
      "Persist domain, execution, and audit records in PostgreSQL.",
      "Persist only the final audit line and recompute everything else.",
    ],
    selected: "PostgreSQL for domain records, execution records, and audit history. This page's preview lives in the browser and is not that database.",
    reason: "A later reader has to be able to ask what was approved and what the adapter returned.",
    tradeoff: "A database needs migrations, backups, and a local setup that this phase does not include.",
    revisit: "A cache or a queue may sit beside the database for throughput. It does not replace the approved-action record.",
  },
  {
    id: "audit",
    title: "Auditability versus opaque automated decisions",
    problem: "If the only stored fact is that a message was sent, the reason is gone.",
    alternatives: [
      "Log the final action only.",
      "Store evidence ids, the score breakdown, the recommendation, the approver, and the execution result.",
      "Store raw prompts and full customer payloads indefinitely.",
    ],
    selected:
      "Store the evidence identifiers, the rule breakdown, the recommendation text, the approval, and the execution result.",
    reason: "An operator should be able to read the trail without opening a hidden prompt.",
    tradeoff: "A tighter record omits some debugging detail. A wider record copies customer data into a second system.",
    revisit: "If an incident cannot be explained from the stored fields, add the missing field on purpose.",
  },
];

/** Proposed responses. These mechanisms are specified here and are not implemented services. */
export const fdeFailures: FdeFailure[] = [
  {
    id: "duplicate",
    title: "Duplicate events",
    behavior:
      "The source and source event id match an event already stored. The duplicate is acknowledged and not applied again. The score stays as it was, and the processing log notes the duplicate.",
  },
  {
    id: "invalid",
    title: "Invalid input",
    behavior:
      "Validation rejects the payload. It is not normalized and it does not enter scoring. The rejection is a processing error, with the source id when one was present.",
  },
  {
    id: "unknown-account",
    title: "Unknown accounts",
    behavior:
      "An event that cannot be resolved to an account is parked as unresolved. It does not create a score and it does not propose an action.",
  },
  {
    id: "model-down",
    title: "Unavailable model providers",
    behavior:
      "Scoring and evidence retrieval still run. The summary and the drafted recommendation are marked unavailable. No action is proposed from an empty model response. A template may restate the rule result.",
  },
  {
    id: "timeout",
    title: "Integration timeouts",
    behavior:
      "The adapter records the timeout and does not report success. The workflow step stays retryable. A timeout is not an approval.",
  },
  {
    id: "execution-failed",
    title: "Failed workflow execution",
    behavior:
      "The execution record stores the failure. The action stays incomplete. A retry uses the same idempotency key so a write that actually landed is not sent twice.",
  },
  {
    id: "repeat-execution",
    title: "Repeated execution requests",
    behavior:
      "A second request for the same approved action returns the existing execution record. It does not send a second message or a second CRM write.",
  },
  {
    id: "rejected",
    title: "Rejected approvals",
    behavior:
      "The proposal closes as rejected. Nothing is executed. The person and the time are stored with the rejection. The score is unchanged.",
  },
  {
    id: "evidence",
    title: "Missing or conflicting evidence",
    behavior:
      "The score uses only rules whose inputs are present. Missing inputs are shown as missing. Conflicting records are shown together, and a recommendation that would have to pick one silently is withheld.",
  },
];

/** How I would take a real customer problem to a deployment. This is the approach, not a completed engagement. */
export const fdeProcess: FdeProcessStep[] = [
  {
    id: "discovery",
    step: 1,
    title: "Discovery",
    summary: "Sit with the workflow and the business objective. Write down what a good week looks like for the operator.",
    deliverables: ["Workflow map", "Problem statement", "List of decisions the system must not make alone"],
  },
  {
    id: "mapping",
    step: 2,
    title: "Mapping",
    summary: "Name the people, the systems, the fields, and the constraints, including what we are not allowed to write.",
    deliverables: ["Stakeholder map", "System inventory", "Data-source notes"],
  },
  {
    id: "design",
    step: 3,
    title: "Design",
    summary: "Turn the workflow into requirements, interfaces, and checks that can fail a build.",
    deliverables: ["Architecture notes", "Data contracts", "Acceptance tests"],
  },
  {
    id: "integration",
    step: 4,
    title: "Integration",
    summary: "Connect one source at a time and compare the normalized records with the source.",
    deliverables: ["Integration specification", "Fixture or sandbox sample", "Validation notes"],
  },
  {
    id: "implementation",
    step: 5,
    title: "Implementation",
    summary: "Build the smallest workflow that completes one useful loop, including the unhappy path for that loop.",
    deliverables: ["Working slice", "Architecture decision records for the choices that were expensive to reverse"],
  },
  {
    id: "evaluation",
    step: 6,
    title: "Evaluation",
    summary: "Check correctness, failure behavior, and whether an operator can explain the score.",
    deliverables: ["Validation report", "Failure-case notes", "Usability notes from the operator"],
  },
  {
    id: "deployment",
    step: 7,
    title: "Deployment",
    summary: "Configure the environment, run the system against the agreed checks, and watch the first real events.",
    deliverables: ["Deployment checklist", "Configuration notes", "Rollback note"],
  },
  {
    id: "handoff",
    step: 8,
    title: "Handoff",
    summary: "Leave the limits, the operating steps, and the next increment in writing.",
    deliverables: ["Operational runbook", "Known limitations", "Next-step list"],
  },
];

/**
 * RELAY phases. Phase 1 is this page. The later phases are planned and must stay that way
 * until the corresponding software exists.
 */
export const fdeRoadmap: FdeRoadmapPhase[] = [
  {
    phase: 1,
    title: "Website and interactive architecture preview",
    summary: "This page: the narrative, the diagrams, and a simulated investigation with predefined accounts.",
    status: "implemented",
    note: "Implemented in this repository as a client-side page. It is not a separate RELAY service.",
  },
  {
    phase: 2,
    title: "Working application and persistent data model",
    summary: "An application shell backed by PostgreSQL tables for accounts, signals, approvals, and audit rows.",
    status: "planned",
    note: "Planned. The preview on this page does not persist.",
  },
  {
    phase: 3,
    title: "Event ingestion, normalization, signals, and scoring",
    summary: "Adapters, validation, idempotency, signal rules, and the deterministic score.",
    status: "planned",
    note: "Planned. The preview sums points that are written into the page.",
  },
  {
    phase: 4,
    title: "AI-assisted investigations and recommendations",
    summary: "Summaries and recommendations that cite retrieved evidence and fail closed when validation fails.",
    status: "planned",
    note: "Planned. This page does not call a model.",
  },
  {
    phase: 5,
    title: "Human approvals, workflow execution, and auditability",
    summary: "An approval queue, idempotent execution, and an audit history.",
    status: "planned",
    note: "Planned. The approval control in the preview stays in the browser.",
  },
  {
    phase: 6,
    title: "Real integration adapters, deployment hardening, and operational validation",
    summary: "Sandbox adapters, failure drills, and a deployment checklist run against a real environment.",
    status: "planned",
    note: "Planned. No customer environment is connected.",
  },
];

/** Slugs resolved against products.ts and projects.ts. `demonstrates` stays inside those records. */
const FDE_RELATED_REFS: {
  source: "product" | "project";
  slug: string;
  demonstrates: string;
}[] = [
  {
    source: "product",
    slug: "revenueroles",
    demonstrates:
      "Employer-system connectors, a classification pipeline, and a live homepage. The product record says saved jobs and applications are not built, and that no user or revenue numbers are published.",
  },
  {
    source: "project",
    slug: "revenue-intelligence-engine",
    demonstrates:
      "A deterministic rubric over fictional companies, with export held for a person. The project record says there are no real leads, CRM writes, or outbound.",
  },
  {
    source: "product",
    slug: "agenyra",
    demonstrates:
      "A public site and waitlist. The product record keeps structured search experimental and says intent-aware discovery is not a public capability.",
  },
  {
    source: "project",
    slug: "spiderweb",
    demonstrates:
      "A local map of a LinkedIn data export, deduplicated. The project record says there is no production deployment.",
  },
  {
    source: "product",
    slug: "medvoice",
    demonstrates:
      "Speech proposes an order line. Deterministic rules handle identity, tax, and posting, and a person confirms risky matches. The product record says there is no public demo and no warehouse deployment.",
  },
  {
    source: "product",
    slug: "the-open-framework",
    demonstrates:
      "A front-end prototype for a coordination concept. The product record places verification, consent, and the institutional backend in the design-goal column.",
  },
  {
    source: "project",
    slug: "personal-portfolio",
    demonstrates:
      "This website. Its pages, Markdown, search, and public API read one content layer.",
  },
];

/**
 * Sum of a synthetic account's rule points. The preview shows this sum rather than a second number.
 */
export function accountScore(account: FdeAccount): number {
  return account.signals.reduce((sum, signal) => sum + signal.points, 0);
}

/**
 * Related work with titles, problems, and links taken from the product and project records.
 * Throws if a slug in `FDE_RELATED_REFS` does not resolve, so the page cannot drift from those records.
 */
export function fdeRelatedWork(): FdeRelatedWork[] {
  return FDE_RELATED_REFS.map((ref) => {
    if (ref.source === "product") {
      const product = getProductBySlug(ref.slug);
      if (!product) throw new Error(`Missing product for FDE related work: ${ref.slug}`);
      const links = [
        { href: `/products/${product.slug}`, label: "On this site" },
        ...(product.demoUrl ? [{ href: product.demoUrl, label: "Live" }] : []),
        ...(product.githubUrl ? [{ href: product.githubUrl, label: "GitHub" }] : []),
      ];
      return {
        slug: product.slug,
        title: product.title,
        problem: product.problem,
        demonstrates: ref.demonstrates,
        links,
      };
    }
    const project = getProjectBySlug(ref.slug);
    if (!project) throw new Error(`Missing project for FDE related work: ${ref.slug}`);
    const links = [
      { href: `/projects#${project.slug}`, label: "On this site" },
      ...(project.links?.demo ? [{ href: project.links.demo, label: "Recorded demo" }] : []),
      ...(project.links?.github ? [{ href: project.links.github, label: "GitHub" }] : []),
    ];
    return {
      slug: project.slug,
      title: project.title,
      problem: project.summary,
      demonstrates: ref.demonstrates,
      links,
    };
  });
}

/** Markdown body for /pow/fde.md, generated from the same records as the page. */
export function renderFdeBody(): string {
  const principles = fdePrinciples.map((item) => `### ${item.title}\n\n${item.body}`).join("\n\n");
  const problem = fdeProblemSteps.map((step, index) => `${index + 1}. ${step.title}. ${step.body}`).join("\n");
  const stages = fdeStages
    .map(
      (stage) =>
        [
          `### ${stage.step}. ${stage.title} (${fdeStageKindLabels[stage.kind]})`,
          "",
          `Enters: ${stage.enters}`,
          "",
          `Happens: ${stage.happens}`,
          "",
          `Leaves: ${stage.leaves}`,
          "",
          `Can fail: ${stage.fails}`,
          "",
          `Verified by: ${stage.verified}`,
        ].join("\n"),
    )
    .join("\n\n");
  const accounts = fdeAccounts
    .map((account) => {
      const lines = account.signals
        .map(
          (signal) =>
            `- ${signal.name}: ${signal.points} points. ${signal.rule} ${signal.reading}`,
        )
        .join("\n");
      return [
        `### ${account.name} (${account.segment})`,
        "",
        `Score: ${accountScore(account)} (sum of the rule points).`,
        "",
        lines,
        "",
        `Sample recommendation: ${account.recommendation}`,
        "",
        `Proposed action: ${account.action.title}. ${account.action.detail} ${account.action.approval}`,
      ].join("\n");
    })
    .join("\n\n");
  const layers = fdeLayers
    .map(
      (layer) =>
        `### ${layer.name}\n\n${layer.summary}\n\nComponents: ${layer.components.join(", ")}.\n\nResponsibility: ${layer.responsibility}\n\nInterfaces: ${layer.interfaces}\n\nBoundary: ${layer.boundary}`,
    )
    .join("\n\n");
  const decisions = fdeDecisions
    .map(
      (decision) =>
        [
          `### ${decision.title}`,
          "",
          `Problem: ${decision.problem}`,
          "",
          "Alternatives:",
          "",
          decision.alternatives.map((item) => `- ${item}`).join("\n"),
          "",
          `Selected: ${decision.selected}`,
          "",
          `Reason: ${decision.reason}`,
          "",
          `Trade-off: ${decision.tradeoff}`,
          "",
          `What would change it: ${decision.revisit}`,
        ].join("\n"),
    )
    .join("\n\n");
  const failures = fdeFailures.map((item) => `### ${item.title}\n\n${item.behavior}`).join("\n\n");
  const process = fdeProcess
    .map(
      (step) =>
        `### ${step.step}. ${step.title}\n\n${step.summary}\n\nDeliverables:\n\n${step.deliverables.map((item) => `- ${item}`).join("\n")}`,
    )
    .join("\n\n");
  const roadmap = fdeRoadmap
    .map(
      (phase) =>
        `### Phase ${phase.phase}. ${phase.title} (${fdePhaseStatusLabels[phase.status]})\n\n${phase.summary}\n\n${phase.note}`,
    )
    .join("\n\n");
  const related = fdeRelatedWork()
    .map((item) => {
      const links = item.links.map((link) => `- ${link.label}: ${link.href}`).join("\n");
      return `### ${item.title}\n\n${item.problem}\n\nWhat it demonstrates here: ${item.demonstrates}\n\n${links}`;
    })
    .join("\n\n");
  const repository = fdePow.relayRepository
    ? `RELAY repository: ${fdePow.relayRepository}`
    : "RELAY has no public repository yet.";

  return [
    fdePow.headline,
    "",
    fdePow.dek,
    "",
    fdePow.status,
    "",
    "The company, accounts, and scores below are a proposed demonstration scenario.",
    "",
    "## Engineering starts with the problem, not the technology.",
    "",
    principles,
    "",
    `## ${fdePow.relayName} — ${fdePow.relayLabel}`,
    "",
    "Personal proof-of-work project. A B2B SaaS company, in this scenario, has customer information spread across its CRM, support system, product analytics, and internal communication tools. Teams lack one place to see a deteriorating account, the evidence, and the next action. Investigation is manual, signals are missed, and decisions lack a shared trail.",
    "",
    problem,
    "",
    "## From fragmented signals to an actionable decision.",
    "",
    "Deterministic stages apply rules. AI-assisted stages may draft text from retrieved evidence and must fail closed. The human gate is an approval, not a model.",
    "",
    stages,
    "",
    "## Simulated product preview",
    "",
    "The accounts are predefined. No model is called and no workflow is executed.",
    "",
    accounts,
    "",
    "## Proposed system architecture",
    "",
    "Documented as a proposal. The UI, API, domain logic, database, model provider, and external systems are separate boundaries.",
    "",
    layers,
    "",
    "## Why the system is designed this way.",
    "",
    decisions,
    "",
    "## Failure is part of the design.",
    "",
    "The behaviors below are the ones I would build. They are not running mechanisms.",
    "",
    failures,
    "",
    "## How I would take this from a customer problem to a working deployment.",
    "",
    "This is my working sequence for a real engagement. It is not a claim that the engagement has happened.",
    "",
    process,
    "",
    "## Technical roadmap",
    "",
    roadmap,
    "",
    "## Related work",
    "",
    related,
    "",
    "## Closing",
    "",
    fdePow.closing,
    "",
    `- GitHub: ${person.primaryProfiles.github}`,
    `- LinkedIn: ${person.primaryProfiles.linkedin}`,
    `- Portfolio: ${person.siteUrl}`,
    `- ${repository}`,
  ].join("\n");
}
