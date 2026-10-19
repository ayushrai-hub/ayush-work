/**
 * Copy and records for the founding-engineer proof-of-work page.
 *
 * Case studies restate what the product records, repository READMEs, and live URLs support.
 * BUILDLOG is an on-page demonstration with a fictional team. Its companies, feedback, weights,
 * and incident are synthetic. `renderFoundingEngineerBody` serializes the same records for the
 * Markdown twin.
 *
 * Connects to:
 * - src/pages/FoundingEngineerPowPage.tsx and src/components/pow/founding/*.
 * - src/lib/foundingWorkbench.ts reads the feature, task, checklist, and feedback arrays.
 * - src/lib/agent/markdown.ts (`/pow/founding-engineer.md`) and src/content/searchIndex.ts.
 */

/** Where a case-study claim was checked. */
export type EvidenceKind = "live" | "repository" | "prototype";

/** One section inside a case study. The nine headings are fixed by the page. */
export interface CaseSection {
  heading: string;
  body: string;
}

/** A verified project used as engineering evidence. */
export interface FoundingCase {
  id: string;
  title: string;
  evidence: EvidenceKind;
  evidenceLabel: string;
  links: { label: string; href: string }[];
  sections: CaseSection[];
}

/** One backlog item in the synthetic BUILDLOG scenario. */
export interface ScopeFeature {
  id: string;
  name: string;
  defaultBand: "required" | "defer" | "cut";
  /** Illustrative weight. Not a measured effort estimate. */
  weight: number;
  dependsOn: string[];
  reason: string;
}

/** Architecture option the visitor can inspect. The judgment is illustrative. */
export interface ArchitectureOption {
  id: string;
  name: string;
  summary: string;
  fit: string;
  dimensions: { label: string; note: string }[];
  failure: string;
}

/** A task on the synthetic implementation sequence. */
export interface WorkbenchTask {
  id: string;
  name: string;
  requires: string[];
  note: string;
}

/** One release-readiness check. Checking it is local state, not a test run. */
export interface ChecklistItem {
  id: string;
  group: string;
  label: string;
}

/** Synthetic post-launch note. */
export interface FeedbackNote {
  id: string;
  text: string;
  signal: string;
  suggested: "now" | "later" | "ignore";
  why: string;
}

/** One stage on the reference engineering timeline. */
export interface TimelineStage {
  id: string;
  name: string;
  deliverable: string;
  risk: string;
  tasks: string[];
}

/** An architecture decision the visitor can open. */
export interface DecisionRecord {
  id: string;
  title: string;
  kind: "illustrative" | "from the code";
  context: string;
  problem: string;
  alternatives: string[];
  chosen: string;
  tradeoffs: string[];
  failureModes: string[];
  revisitWhen: string;
}

/** A constrained choice with no single correct answer. */
export interface ConstraintScenario {
  id: string;
  prompt: string;
  options: {
    id: string;
    label: string;
    immediate: string;
    engineeringCost: string;
    operationalCost: string;
    risk: string;
    revisitWhen: string;
  }[];
}

/** One layer in a system map. */
export interface StackLayer {
  id: string;
  name: string;
  responsibility: string;
  inputs: string;
  outputs: string;
  failure: string;
}

/** A system map the visitor can switch. Proposed pieces are not drawn as shipped. */
export interface StackView {
  id: string;
  name: string;
  kind: "verified shape" | "synthetic";
  note: string;
  layers: StackLayer[];
  failures: { id: string; title: string; path: string }[];
}

/** Page-level copy that is not a list record. */
export const foundingEngineer = {
  title: "Founding engineer",
  description:
    "Ayush Rai on founding engineering: taking an ambiguous product problem through architecture, implementation, deployment, and the next iteration, with the unfinished parts named.",
  positioning: "I build products from zero to one—and take ownership of what happens after launch.",
  support:
    "I work across product thinking, full-stack engineering, AI systems, infrastructure, and iteration to turn ambiguous problems into working software.",
  headline: "I don't just build features. I build the system that makes the product work.",
  heroDek:
    "Product thinking, full-stack engineering, AI systems, infrastructure, and iteration—under one roof.",
  workbenchName: "BUILDLOG",
  workbenchNote:
    "BUILDLOG is the name of this on-page demonstration. Nothing else on this site uses that name. Northline is a fictional team. Every weight, user, and result inside the workbench is synthetic.",
} as const;

/** What the role is, in working terms. */
export const foundingDuties: { title: string; body: string }[] = [
  {
    title: "Clarify the problem",
    body: "Turn a vague request into a user, a workflow, and the assumption that still needs evidence.",
  },
  {
    title: "Pick a first architecture",
    body: "Choose the smallest shape that can ship the workflow, and write down what that choice refuses to solve yet.",
  },
  {
    title: "Build the critical path",
    body: "Implement the workflow people actually complete: data in, decision, result out.",
  },
  {
    title: "Own the contracts",
    body: "APIs, data models, validation, and permissions are part of the product, not a later cleanup.",
  },
  {
    title: "Integrate on purpose",
    body: "Put third-party services behind an edge the product can replace or mock.",
  },
  {
    title: "Ship and stay",
    body: "Deploy, read failures, and change the system from what the running product does.",
  },
  {
    title: "Keep the scope honest",
    body: "Speed matters. So does knowing which complexity is premature.",
  },
];

/** Synthetic scenario shown at the start of BUILDLOG. */
export const buildLogProblem = {
  company: "Northline",
  label: "Synthetic",
  user: "One operator on a small B2B team who decides which accounts to pursue this week.",
  pain: "Prospect data is split across a spreadsheet, inboxes, and memory. Nothing ranks the list the same way twice.",
  workaround: "The operator re-sorts a spreadsheet and asks a colleague which names feel warm.",
  cost: "The cost inside this demonstration is missed follow-up and arguments about priority. It is not a measured revenue number.",
  assumptions: [
    "A ranked list with a visible rubric is more useful than another inbox.",
    "The first user will upload a CSV rather than connect a CRM.",
    "One operator can share a login later. Multi-tenant access is not required to learn.",
  ],
  validated: [
    "Nothing in this scenario has been validated with a real customer. The statements above are the brief, not findings.",
  ],
  stillNeeded: [
    "Whether the operator trusts a score they can inspect.",
    "Which columns a real export actually contains.",
    "Whether a human pursue/skip decision is the action that matters.",
  ],
};

/** Synthetic backlog. Default bands are a judgment for this brief, not a universal backlog. */
export const scopeFeatures: ScopeFeature[] = [
  {
    id: "csv-import",
    name: "CSV account import",
    defaultBand: "required",
    weight: 2,
    dependsOn: [],
    reason: "The brief starts from a spreadsheet. Without import, there is no list to rank.",
  },
  {
    id: "icp",
    name: "ICP fields the operator can edit",
    defaultBand: "required",
    weight: 1,
    dependsOn: ["csv-import"],
    reason: "A score with hidden criteria is not inspectable.",
  },
  {
    id: "rubric",
    name: "Deterministic fit score with visible weights",
    defaultBand: "required",
    weight: 3,
    dependsOn: ["icp"],
    reason: "The product promise is a repeatable ranking, not a generated paragraph.",
  },
  {
    id: "ranked",
    name: "Ranked account list",
    defaultBand: "required",
    weight: 1,
    dependsOn: ["rubric"],
    reason: "This is the screen the operator opens.",
  },
  {
    id: "decision",
    name: "Pursue or skip, recorded on the account",
    defaultBand: "required",
    weight: 2,
    dependsOn: ["ranked"],
    reason: "A list that cannot record the decision does not change the workaround.",
  },
  {
    id: "auth",
    name: "Sign-in before the list is shared",
    defaultBand: "defer",
    weight: 3,
    dependsOn: [],
    reason: "A local or single-operator build can wait. Sharing the list across people should not.",
  },
  {
    id: "notes",
    name: "Free-text notes",
    defaultBand: "defer",
    weight: 1,
    dependsOn: ["ranked"],
    reason: "Useful, and not required to prove the ranking workflow.",
  },
  {
    id: "enrichment",
    name: "Paid enrichment vendor",
    defaultBand: "defer",
    weight: 4,
    dependsOn: ["csv-import"],
    reason: "The CSV already holds the fields the rubric needs. A vendor adds cost and a failure mode.",
  },
  {
    id: "research",
    name: "Model-written account research",
    defaultBand: "defer",
    weight: 4,
    dependsOn: ["rubric"],
    reason: "Research can explain a row later. It should not be the score.",
  },
  {
    id: "crm",
    name: "CRM sync",
    defaultBand: "cut",
    weight: 5,
    dependsOn: ["decision", "auth"],
    reason: "Sync before a recorded decision exists writes noise into someone else's system.",
  },
  {
    id: "sequences",
    name: "Outbound email sequences",
    defaultBand: "cut",
    weight: 4,
    dependsOn: ["crm"],
    reason: "Sending mail is a different product, with deliverability and consent obligations.",
  },
  {
    id: "tenancy",
    name: "Multi-tenant billing",
    defaultBand: "cut",
    weight: 5,
    dependsOn: ["auth"],
    reason: "There is one fictional team. Billing infrastructure does not answer their ranking problem.",
  },
];

/** Illustrative architecture choices for the Northline brief. */
export const architectureOptions: ArchitectureOption[] = [
  {
    id: "modular-monolith",
    name: "Modular monolith",
    summary: "One deployable application. Import, scoring, and decisions live in separate modules behind explicit functions.",
    fit: "For this brief, this is the shortest reliable path. One operator, one database, one workflow.",
    dimensions: [
      { label: "Implementation speed", note: "Fastest. One language boundary and one local loop." },
      { label: "Operational complexity", note: "Low. One process to log, restart, and roll back." },
      { label: "Deployment", note: "One build. A bad release takes the whole app down together." },
      { label: "Scaling", note: "Fine while the work is request-sized. A long import will need a job inside the same app." },
      { label: "Testing", note: "Module tests plus one path through import, score, and decision." },
      { label: "Failure isolation", note: "Weak across modules. A scoring bug and an import bug share a process." },
    ],
    failure: "The monolith becomes a trap when a second team needs to deploy a different cadence, or when a slow import blocks ordinary reads and nobody extracts that job.",
  },
  {
    id: "split",
    name: "Separate frontend and backend",
    summary: "A UI and an API deploy separately. The API owns the database.",
    fit: "Reasonable once a second client, or a worker in another language, must call the same rules.",
    dimensions: [
      { label: "Implementation speed", note: "Slower. Two apps, a contract, and a local proxy." },
      { label: "Operational complexity", note: "Two deploy targets and a version skew problem." },
      { label: "Deployment", note: "The UI can ship without an API migration, and the reverse." },
      { label: "Scaling", note: "The API can scale without rebuilding the UI." },
      { label: "Testing", note: "Contract tests become the seam that unit tests cannot see." },
      { label: "Failure isolation", note: "A UI outage and an API outage look different, which helps diagnosis." },
    ],
    failure: "The split is waste when the only client is the one UI and the contract changes every day.",
  },
  {
    id: "events",
    name: "Event-driven processing",
    summary: "The request records the upload. A worker scores accounts after the response returns.",
    fit: "Fits when import or research is slow enough that the request should not wait.",
    dimensions: [
      { label: "Implementation speed", note: "Slower than a synchronous function. You now own retries." },
      { label: "Operational complexity", note: "A queue, a worker, and dead letters." },
      { label: "Deployment", note: "The worker can restart without taking the read path down." },
      { label: "Scaling", note: "Bursts of uploads do not tie up web workers." },
      { label: "Testing", note: "You test the happy path and the retry path." },
      { label: "Failure isolation", note: "A stuck worker leaves the UI up and the list stale. That must be visible." },
    ],
    failure: "A queue for a score that finishes in milliseconds adds failure modes and hides a simple bug behind 'eventual'.",
  },
  {
    id: "microservices",
    name: "Several services",
    summary: "Import, scoring, identity, and export each deploy alone.",
    fit: "Not the starting point for this brief. The team is one engineer and the workflow is one path.",
    dimensions: [
      { label: "Implementation speed", note: "Slowest. Network, auth between services, and local orchestration." },
      { label: "Operational complexity", note: "Highest. Distributed traces, partial deploys, and compatibility." },
      { label: "Deployment", note: "Independent release is real, and so is deploying half of a workflow." },
      { label: "Scaling", note: "You can scale scoring alone. Nothing in the brief requires that yet." },
      { label: "Testing", note: "End-to-end tests become the only tests that see the product." },
      { label: "Failure isolation", note: "Best on paper. A scoring outage can spare import, if the UI explains the hole." },
    ],
    failure: "The usual failure is coordination: a change needs three releases, and the product is not faster.",
  },
];

/** Illustrative data and API sketch for the synthetic product. */
export const buildLogContract = {
  entities: [
    "Account: id, name, domain, industry, employee count, region, source file, created at.",
    "IcpProfile: industry allow-list, minimum and maximum size, regions, weights that sum to 100.",
    "Score: account id, profile id, component points, total, computed at. Recomputed when the profile changes.",
    "Decision: account id, pursue or skip, note optional, decided at. One current decision per account.",
  ],
  endpoints: [
    "POST /imports — accepts a CSV, validates columns, writes accounts, returns counts and row errors.",
    "PUT /icp — replaces the profile. Rejects weights that do not sum to 100.",
    "GET /accounts?sort=score — returns the ranked list and the latest decision.",
    "POST /accounts/:id/decision — records pursue or skip.",
  ],
  boundaries: [
    "The UI talks only to the API.",
    "The API owns validation and the score. The browser does not reimplement the rubric.",
    "The database is the source of truth for accounts, profiles, scores, and decisions.",
    "A background job appears only if import or research cannot finish inside the request.",
    "Enrichment and mail providers are adapters. The first version has neither.",
  ],
};

/** Synthetic implementation sequence. */
export const workbenchTasks: WorkbenchTask[] = [
  { id: "schema", name: "Tables and constraints for accounts, profiles, scores, and decisions", requires: [], note: "Critical path. The score and the decision need a place to live." },
  { id: "import", name: "CSV parser, column checks, and row errors", requires: ["csv-import"], note: "Critical if import is required." },
  { id: "score", name: "Rubric function with tests for the weight sum and each component", requires: ["rubric"], note: "Critical. This is the product rule." },
  { id: "list", name: "Ranked list and the pursue/skip write", requires: ["ranked", "decision"], note: "Critical. This is the workflow." },
  { id: "auth-task", name: "Sign-in and a single workspace", requires: ["auth"], note: "Off the first path until the list is shared." },
  { id: "research-task", name: "Optional research paragraph with a fallback when no model key is set", requires: ["research"], note: "Optional. Must not change the score." },
  { id: "crm-task", name: "CRM export adapter", requires: ["crm"], note: "Out of the first version in the default scope." },
];

/** Release checks. Toggling them does not run anything. */
export const releaseChecklist: ChecklistItem[] = [
  { id: "authn", group: "Access", label: "Authentication" },
  { id: "authz", group: "Access", label: "Authorization" },
  { id: "validation", group: "Data", label: "Input validation" },
  { id: "migrations", group: "Data", label: "Database migrations" },
  { id: "errors", group: "Runtime", label: "Error handling" },
  { id: "logging", group: "Runtime", label: "Logging" },
  { id: "env", group: "Release", label: "Environment variables" },
  { id: "secrets", group: "Release", label: "Secrets management" },
  { id: "deploy", group: "Release", label: "Deployment" },
  { id: "smoke", group: "Release", label: "Smoke tests" },
  { id: "rollback", group: "Release", label: "Rollback" },
  { id: "analytics", group: "Learning", label: "Analytics on the critical workflow" },
];

/** Synthetic feedback after a fictional launch. */
export const feedbackNotes: FeedbackNote[] = [
  {
    id: "columns",
    text: "Three uploads failed because the size column was named Headcount.",
    signal: "Import errors on a real column alias. Synthetic.",
    suggested: "now",
    why: "The critical path is blocked. Accept the alias or show the expected column name beside the error.",
  },
  {
    id: "tie",
    text: "Two accounts tied and the operator did not know which row was stable.",
    signal: "A sort needs a deterministic tie break. Synthetic.",
    suggested: "now",
    why: "A ranking people argue about is the original problem, repeated.",
  },
  {
    id: "slack",
    text: "Someone asked for a Slack ping when a score changes.",
    signal: "A request with no repeated pain. Synthetic.",
    suggested: "later",
    why: "Notification infrastructure before the score is trusted adds a channel to debug.",
  },
  {
    id: "theme",
    text: "A visitor asked for a darker chart palette.",
    signal: "Preference, not a failed workflow. Synthetic.",
    suggested: "ignore",
    why: "It does not change who gets pursued. Revisit if the list is unreadable, not because a chart was requested.",
  },
];

/** Reference timeline. Not a history of any project. */
export const timelineStages: TimelineStage[] = [
  { id: "discover", name: "Problem discovery", deliverable: "A user, a workaround, and the assumption to test.", risk: "Solving a problem nobody repeats.", tasks: ["Write the workaround in one sentence.", "Name the evidence you do not have."] },
  { id: "requirements", name: "Requirements", deliverable: "Required, deferrable, and cut, with reasons.", risk: "A demo that skips the decision the user came to make.", tasks: ["Mark the critical workflow.", "List dependencies before estimates."] },
  { id: "architecture", name: "Architecture", deliverable: "One deployable shape and the failure it accepts.", risk: "A distributed design for a single workflow.", tasks: ["Choose the simplest shape that fits.", "Name what would force a split."] },
  { id: "data", name: "Data modeling", deliverable: "Entities, constraints, and the API that mutates them.", risk: "A schema that cannot record the decision.", tasks: ["Put constraints in the database.", "Keep the score recomputable."] },
  { id: "implement", name: "Core implementation", deliverable: "The workflow, runnable locally.", risk: "Polish on a path that does not finish.", tasks: ["Build import, score, and decision.", "Leave adapters unwired."] },
  { id: "integrate", name: "Integration", deliverable: "External systems behind adapters, or an explicit decision to skip them.", risk: "A vendor outage becoming your product outage.", tasks: ["Mock the adapter.", "Timeouts and a visible failure."] },
  { id: "test", name: "Testing", deliverable: "Tests on the rules and one path through the UI.", risk: "A green suite that never uploads a bad file.", tasks: ["Test the rubric.", "Test one rejected import."] },
  { id: "deploy", name: "Deployment", deliverable: "A known environment, a migration, and a rollback.", risk: "A build that succeeded and a migration that did not.", tasks: ["Separate build from release.", "Write the smoke check."] },
  { id: "monitor", name: "Monitoring", deliverable: "Logs and a signal on the critical action.", risk: "Silence that looks like success.", tasks: ["Log import counts and decision writes.", "Alert on error rate, not on vibes."] },
  { id: "feedback", name: "Feedback", deliverable: "Notes tied to a failed or finished workflow.", risk: "Treating every request as the next sprint.", tasks: ["Separate blocked work from preference.", "Write what would change your mind."] },
  { id: "iterate", name: "Iteration", deliverable: "One change, shipped, with the old failure in mind.", risk: "A rewrite that abandons the evidence.", tasks: ["Change the smallest layer that failed.", "Keep the score deterministic unless the rubric itself is wrong."] },
];

/** Decision log. Project examples are limited to what the repositories support. */
export const decisionRecords: DecisionRecord[] = [
  {
    id: "monolith",
    title: "Monolith versus microservices",
    kind: "from the code",
    context: "RevenueRoles is a monorepo with a Next.js web app, a Next.js API, and a Python classification worker. SpiderWeb is a web app, an API, and an optional ingestion worker. Neither is a fleet of services.",
    problem: "How many deployable units does the first useful system need?",
    alternatives: ["One application.", "A small split: UI, API, and one worker.", "A service per domain concept."],
    chosen: "A small number of processes, split where the runtime or the schedule is actually different. The worker exists because classification or ingestion is not the web request.",
    tradeoffs: ["More than one process means more than one thing to deploy and observe.", "Fewer processes make a bad release wider."],
    failureModes: ["The worker is down and the site still looks healthy.", "A shared database becomes the hidden coupling between processes."],
    revisitWhen: "Independent teams need independent release cadence, or one workload has a scaling shape the others do not.",
  },
  {
    id: "async",
    title: "Synchronous versus asynchronous processing",
    kind: "from the code",
    context: "RevenueRoles uses Inngest for scheduled discovery. SpiderWeb processes an import in-process unless INGESTION_MODE=queue, in which case a worker must be running. The Revenue Intelligence Engine runs a pipeline with a run id rather than blocking a page render on research.",
    problem: "Should the user wait for the work to finish?",
    alternatives: ["Finish inside the request.", "Accept the request and process it afterward.", "Poll on a schedule."],
    chosen: "Wait when the result is small and the user is blocked on it. Move discovery, import, and research off the request when they are slow, retryable, or scheduled.",
    tradeoffs: ["Async work needs a visible pending state.", "Synchronous work is easier to test and easier to time out badly."],
    failureModes: ["A queue with no worker leaves imports stuck.", "A scheduled job overlaps itself and double-writes."],
    revisitWhen: "A 'fast' step starts timing out, or a background step is so reliable and small that the queue is ceremony.",
  },
  {
    id: "storage",
    title: "Relational database versus specialized storage",
    kind: "from the code",
    context: "RevenueRoles uses Supabase Postgres, including pgvector. SpiderWeb uses Postgres for people, companies, and messages. The Revenue Intelligence Engine uses SQLAlchemy, SQLite locally and Postgres-compatible models. The choice follows rows, constraints, and queries.",
    problem: "Where should the system of record live?",
    alternatives: ["Postgres for relational rows and constraints.", "A document store for sparse payloads.", "A search or vector index as the only store."],
    chosen: "Postgres where the product is records and relationships. pgvector sits beside the rows in RevenueRoles. It is not a second source of truth.",
    tradeoffs: ["A vector index helps similarity and does not replace unique keys or transactions.", "A document store is flexible until you need a constraint you can trust."],
    failureModes: ["Two stores disagree about the same account.", "A migration adds a constraint the existing rows cannot satisfy."],
    revisitWhen: "The query shape is mostly unstructured search, or the working set no longer fits one relational model.",
  },
  {
    id: "build-buy",
    title: "Build versus buy",
    kind: "illustrative",
    context: "The Revenue Intelligence Engine uses a mock enrichment provider. Its README says Clay, Apollo, and CRM integrations are not wired. AGENYRA's public site buys waitlist storage from Supabase instead of building auth and a database from scratch.",
    problem: "Which edges are the product, and which are commodities?",
    alternatives: ["Build the workflow and mock the vendor.", "Buy the vendor and wrap it.", "Buy a platform and accept its model."],
    chosen: "Build the ranking, classification, or representation that is the product. Buy or defer the commodity, and keep it behind an adapter.",
    tradeoffs: ["A vendor is faster until the contract, the cost, or the outage owns you.", "A mock lets the workflow run and says nothing about vendor data quality."],
    failureModes: ["The adapter leaks vendor fields into the core schema.", "The mock stays in production because replacing it was never scheduled."],
    revisitWhen: "Real records need the vendor's data, and you can name the failure you will accept when the vendor is down.",
  },
  {
    id: "hosting",
    title: "Managed service versus self-hosting",
    kind: "from the code",
    context: "The public sites I ship for these products use Vercel. SpiderWeb's local path is Docker Compose for Postgres and Redis, and its README also documents a Vercel and self-host shape. This portfolio is a Vite app with thin serverless functions.",
    problem: "Who runs the database, the build, and the restarts?",
    alternatives: ["A managed host for the app and the database.", "Self-host when the data or the process must stay on a machine you control.", "Managed app, self-hosted data."],
    chosen: "Managed hosting for public web apps. Local or self-hosted data when the product is a private export, as with SpiderWeb.",
    tradeoffs: ["Managed hosting removes a class of operational work and adds a platform constraint.", "Self-hosting keeps the data close and adds upgrades, backups, and the night something fills the disk."],
    failureModes: ["A platform limit on request size or function duration shows up as a product bug.", "A self-hosted database with no backup is one disk away from data loss."],
    revisitWhen: "Cost, data residency, or a long-running worker no longer fit the managed defaults.",
  },
  {
    id: "realtime",
    title: "Real-time updates versus scheduled processing",
    kind: "from the code",
    context: "RevenueRoles rediscovers postings on a schedule through Inngest. SpiderWeb changes when you upload a new export. It does not hold a live LinkedIn session.",
    problem: "How fresh does the data have to be for the decision to stay useful?",
    alternatives: ["Push on every external change.", "Refresh on a schedule.", "Refresh when the user imports."],
    chosen: "Schedule or import when the source is a batch and the decision is not sub-minute. Live updates need a source that can push and a user who acts on the push.",
    tradeoffs: ["Scheduled data can be stale and still be honest if you show when it was checked.", "Real-time pipelines fail in partial ways that a nightly job does not."],
    failureModes: ["A schedule that overlaps.", "A live socket that drops and leaves the UI looking current."],
    revisitWhen: "The user acts inside the same minute the source changes, and you can see the missed updates.",
  },
  {
    id: "ai-logic",
    title: "AI inference versus deterministic logic",
    kind: "from the code",
    context: "In the Revenue Intelligence Engine the 100-point score is deterministic. Model research is optional and has a fallback when no API key is set. MedVoice's product record keeps medicine identity, price, and GST on deterministic rules. Speech only proposes a line.",
    problem: "Where does a model improve the workflow, and where does it make the result unauditable?",
    alternatives: ["Deterministic rules for the decision.", "A model for language in or language out, checked by rules.", "A model as the system of record."],
    chosen: "Rules own the score, the tax, and the identity decision. A model may draft language or transcribe speech, and the product still completes when the model is absent or wrong.",
    tradeoffs: ["Rules are narrower than a model and easier to explain.", "A model handles messy text and can be confidently wrong."],
    failureModes: ["A fallback that silently looks like research.", "A model output written into a ledger without confirmation."],
    revisitWhen: "The language task is the product, you can evaluate it, and a wrong answer has a bounded cost.",
  },
];

/** Constraint simulator. Each option is defensible. */
export const constraintScenarios: ConstraintScenario[] = [
  {
    id: "ship-or-refactor",
    prompt: "The ranking workflow works. A module that nothing calls is messy. You have a few days.",
    options: [
      { id: "ship", label: "Ship the workflow", immediate: "Someone can use the ranking.", engineeringCost: "The messy module stays.", operationalCost: "Low, if the messy module is not on the path.", risk: "The mess spreads if the next feature imports it.", revisitWhen: "The next change has to touch that module." },
      { id: "refactor", label: "Refactor first", immediate: "The unused module is easier to read.", engineeringCost: "The workflow waits.", operationalCost: "None, until it ships.", risk: "You polish code with no user evidence.", revisitWhen: "A second feature needs that module this week." },
    ],
  },
  {
    id: "managed-or-host",
    prompt: "The first version needs a database. Budget and on-call time are both small.",
    options: [
      { id: "managed", label: "Use a managed database", immediate: "Backups and hosting come with the service.", engineeringCost: "You learn the vendor's limits.", operationalCost: "A bill, and a console you do not fully control.", risk: "A limit or an outage you cannot patch yourself.", revisitWhen: "The bill or the residency requirement no longer fits." },
      { id: "self", label: "Run the database yourself", immediate: "Full control of the box.", engineeringCost: "You own upgrades, backups, and disk.", operationalCost: "Time, every month, including when nothing is on fire.", risk: "A backup you meant to configure.", revisitWhen: "You have a restore drill and a reason the managed service cannot hold the data." },
    ],
  },
  {
    id: "feature-or-observe",
    prompt: "Users can complete the workflow on your laptop. Production has no error reporting.",
    options: [
      { id: "observe", label: "Add error reporting before the next feature", immediate: "The next failure has a stack trace.", engineeringCost: "A small integration and a redaction pass.", operationalCost: "Someone has to read the reports.", risk: "Logging secrets or personal data.", revisitWhen: "The volume is noise and you need better grouping, not more features in the dark." },
      { id: "feature", label: "Ship the next feature", immediate: "The product does one more thing.", engineeringCost: "You still cannot see production failures.", operationalCost: "Debugging becomes a user complaint.", risk: "A broken critical path that looks like low usage.", revisitWhen: "You already have a signal on the critical path and the feature is the thing blocking a user." },
    ],
  },
  {
    id: "automate",
    prompt: "The import is a script you run by hand once a day. It has run correctly three times.",
    options: [
      { id: "manual", label: "Keep it manual", immediate: "You see each run.", engineeringCost: "Your time, daily.", operationalCost: "The job does not run when you do not.", risk: "You forget, and the list goes stale without a signal.", revisitWhen: "The steps are stable and missing a day has a cost you can name." },
      { id: "schedule", label: "Schedule it", immediate: "The list refreshes without you.", engineeringCost: "Locking, retries, and a failure notice.", operationalCost: "A scheduler to watch.", risk: "A bad run repeats until someone notices.", revisitWhen: "The manual steps are still changing every run." },
    ],
  },
  {
    id: "queue",
    prompt: "CSV imports under a few hundred rows finish in the request. You expect larger files later.",
    options: [
      { id: "sync", label: "Stay synchronous", immediate: "Errors return in the response.", engineeringCost: "None beyond a timeout.", operationalCost: "A large file can tie up a worker.", risk: "A timeout that leaves a partial import.", revisitWhen: "Real files hit the timeout." },
      { id: "queue-it", label: "Add a queue now", immediate: "The design matches the larger file you expect.", engineeringCost: "A worker, retries, and a pending state.", operationalCost: "Another process.", risk: "You operate a queue for a problem you have not seen.", revisitWhen: "You have a file that fails the synchronous path." },
    ],
  },
  {
    id: "model",
    prompt: "The rubric is explainable. A model could write a paragraph under each account.",
    options: [
      { id: "rules", label: "Keep the score on the rubric", immediate: "The ranking stays auditable.", engineeringCost: "The paragraph does not exist yet.", operationalCost: "None from a model vendor.", risk: "The list is correct and terse.", revisitWhen: "Operators misread a row that a checked paragraph would explain." },
      { id: "tune", label: "Fine-tune a model for the ranking", immediate: "The score looks sophisticated.", engineeringCost: "Data, evals, and a training loop.", operationalCost: "Cost, drift, and a result you cannot decompose.", risk: "You cannot say why an account moved.", revisitWhen: "The rubric cannot express a distinction you can evaluate." },
    ],
  },
  {
    id: "tenancy",
    prompt: "One team uses the tool. A second team asked for access.",
    options: [
      { id: "gate", label: "Add workspace separation before the second team", immediate: "Their rows cannot leak into the first workspace.", engineeringCost: "Every query gains a workspace constraint.", operationalCost: "Access bugs become security bugs.", risk: "You delay them.", revisitWhen: "You have a test that a query without the workspace id returns nothing." },
      { id: "share", label: "Share the instance", immediate: "The second team is in today.", engineeringCost: "Low today.", operationalCost: "You will untangle rows later.", risk: "One export contains both teams.", revisitWhen: "Never, if the data is sensitive. Only if both parties already share the same records." },
    ],
  },
  {
    id: "scope",
    prompt: "The design has four services. The useful workflow is one screen.",
    options: [
      { id: "simplify", label: "Cut the architecture back to the screen", immediate: "You can ship the workflow.", engineeringCost: "You delete design, not code that users need.", operationalCost: "Lower.", risk: "You feel early and unimpressive.", revisitWhen: "A second runtime or a second team makes the split pay for itself." },
      { id: "complex", label: "Build the four services", immediate: "The diagram matches the ambition.", engineeringCost: "The screen waits on the platform.", operationalCost: "Four things to deploy.", risk: "No user ever sees the workflow.", revisitWhen: "The single screen is live and a measured limit forces a split." },
    ],
  },
];

/** Illustrative test map. Not a report of a run. */
export const testingGuide = {
  note: "This panel is a risk map for the synthetic product. It is not a test run, and it is not a claim about any repository's latest suite.",
  journey: [
    { id: "upload", name: "Upload a CSV", check: "A missing column returns row errors and writes nothing partial that the list treats as complete." },
    { id: "icp", name: "Save an ICP", check: "Weights that do not sum to 100 are rejected." },
    { id: "rank", name: "Read the ranked list", check: "Ties break on a stable key. The components are visible." },
    { id: "decide", name: "Record pursue or skip", check: "The decision persists and is the one the list shows." },
    { id: "export", name: "Export the decided rows", check: "Only decided rows leave, and a second click does not duplicate them." },
  ],
  layers: [
    { name: "Unit", when: "The rubric, parsers, and pure decisions. Cheap, and blind to wiring." },
    { name: "Integration", when: "The API against a database, including constraints and a rejected body." },
    { name: "API contract", when: "A client and a server that deploy separately." },
    { name: "End to end", when: "One critical journey in a browser. Few of these." },
    { name: "Database constraints", when: "Uniqueness, foreign keys, and the migration on existing rows." },
    { name: "Input validation", when: "Every write boundary. The database is the second check, not the only one." },
    { name: "Authentication", when: "Before anyone but the operator can open the list." },
    { name: "Authorization", when: "A second workspace exists, or an admin route does." },
    { name: "Error handling", when: "Vendor and database failures return a code and leave the ledger consistent." },
    { name: "Accessibility", when: "The ranked list and the decision control can be used from the keyboard." },
    { name: "Performance", when: "You have a slow path worth measuring. Not before." },
    { name: "Deployment smoke", when: "After release: sign-in if it exists, one read, one write." },
    { name: "Regression", when: "A bug that escaped, pinned with the fixture that caused it." },
  ],
};

/** System maps. Verified views only include pieces the repositories describe. */
export const stackViews: StackView[] = [
  {
    id: "revenueroles",
    name: "RevenueRoles",
    kind: "verified shape",
    note: "Taken from the repository layout and the product record. Sign-in and the production worker are implemented and not all verified in production.",
    layers: [
      { id: "ui", name: "Web app", responsibility: "Next.js UI at revenueroles.in.", inputs: "Job queries and filters.", outputs: "Listings that link to the original application.", failure: "A page can render while the jobs API is stale." },
      { id: "api", name: "API", responsibility: "Next.js API and Inngest endpoint.", inputs: "Discovery schedules and resume jobs.", outputs: "Normalized postings and queue runs.", failure: "Overlapping discovery if a lock fails." },
      { id: "worker", name: "Classification worker", responsibility: "Python FastAPI pipeline. Classify from the description.", inputs: "Normalized postings.", outputs: "Role-family labels.", failure: "The site looks fine while classification stops." },
      { id: "data", name: "Postgres", responsibility: "Supabase, migrations, row-level security, pgvector.", inputs: "Postings and classification rows.", outputs: "The listing query.", failure: "A migration the current rows cannot satisfy." },
      { id: "sources", name: "Source connectors", responsibility: "Greenhouse, Lever, Ashby, RemoteOK.", inputs: "Employer board pages and APIs.", outputs: "Raw postings and fixtures.", failure: "A board changes markup and the connector returns nothing." },
    ],
    failures: [
      { id: "stale", title: "Listings go quiet", path: "Check the Inngest run, then the connector fixture, then whether the worker accepted the batch. The homepage being up does not mean discovery ran." },
      { id: "auth", title: "Sign-in fails", path: "Treat it as unverified in production until that path is exercised. The public listing and the signed-in app are different checks." },
    ],
  },
  {
    id: "rie",
    name: "Revenue Intelligence Engine",
    kind: "verified shape",
    note: "Dashboard at revopy.vercel.app. API at cashmaker-two.vercel.app. Companies in the bundle are synthetic.",
    layers: [
      { id: "ui", name: "GTM console", responsibility: "Next.js dashboard, runner, accounts, approvals, export.", inputs: "ICP and approval actions.", outputs: "Ranked accounts and an export of approved rows.", failure: "The UI can load while a run is stuck." },
      { id: "api", name: "FastAPI", responsibility: "Run the pipeline, assign a run id, upsert.", inputs: "ICP and the synthetic company file.", outputs: "Scores, research, approvals.", failure: "A second run must upsert, not clone companies." },
      { id: "score", name: "Deterministic scorer", responsibility: "100-point rubric. Not a model.", inputs: "Normalized company and signals.", outputs: "Component scores and a total.", failure: "A weight change without a test moves every rank silently." },
      { id: "research", name: "Research step", responsibility: "Optional model text, or a deterministic fallback.", inputs: "Top accounts.", outputs: "Labeled claims and a fallback flag.", failure: "Fallback text presented as model research." },
      { id: "data", name: "SQL database", responsibility: "SQLAlchemy. SQLite locally, Postgres if DATABASE_URL is set.", inputs: "Run rows.", outputs: "The report.", failure: "A cold start on an empty database reseeds the fixture. That is demo behavior." },
    ],
    failures: [
      { id: "empty", title: "The dashboard looks reset", path: "Confirm whether DATABASE_URL points at Postgres. An empty store reseeds synthetic companies. That is not a new customer list." },
      { id: "export", title: "Export contains the wrong rows", path: "Check approval state. The gate is the point. Unapproved research is not an export." },
    ],
  },
  {
    id: "site",
    name: "This website",
    kind: "verified shape",
    note: "The portfolio itself: a Vite and React app, content in src/content, thin serverless adapters for contact and read APIs.",
    layers: [
      { id: "ui", name: "React UI", responsibility: "Routes, pages, and the proof-of-work workbench.", inputs: "Content modules.", outputs: "HTML, including this page.", failure: "A new route missing from the prerender list 404s on the host." },
      { id: "content", name: "Content layer", responsibility: "Typed records. Pages, Markdown, search, and MCP read them.", inputs: "Edits in src/content.", outputs: "The same facts on every surface.", failure: "A second copy of a fact drifts." },
      { id: "api", name: "Serverless routes", responsibility: "Search, projects, ask, contact.", inputs: "HTTP requests.", outputs: "JSON or a sent email.", failure: "Contact returns 500 when the mail env vars are missing. That is intentional." },
      { id: "host", name: "Netlify and Vercel", responsibility: "Static files plus functions. Existing HTML must win over the SPA fallback.", inputs: "The build.", outputs: "www.ayushrai.site.", failure: "A forced SPA rewrite shadows a real HTML or Markdown file." },
    ],
    failures: [
      { id: "rewrite", title: "A real file 404s or the wrong page appears", path: "Check that the host rewrite does not force every path to index.html. Prerendered HTML and Markdown have to win." },
    ],
  },
  {
    id: "buildlog",
    name: "BUILDLOG sketch",
    kind: "synthetic",
    note: "A sketch of the fictional Northline product. These boxes are not deployed.",
    layers: [
      { id: "ui", name: "Ranked-list UI", responsibility: "Upload, ICP form, list, decision.", inputs: "Operator actions.", outputs: "API calls.", failure: "The browser recomputes a score the server does not agree with." },
      { id: "api", name: "Application API", responsibility: "Validation, rubric, decisions.", inputs: "CSV and decisions.", outputs: "Rows and errors.", failure: "A partial import committed before validation finished." },
      { id: "auth", name: "Access", responsibility: "Deferred in the default scope. Required before a second person.", inputs: "Session.", outputs: "Workspace id.", failure: "A missing workspace filter." },
      { id: "data", name: "Relational database", responsibility: "Accounts, profiles, scores, decisions.", inputs: "Transactions.", outputs: "The list query.", failure: "A migration without a default on existing rows." },
      { id: "jobs", name: "Background work", responsibility: "Absent until a step cannot finish in the request.", inputs: "A queued import or research task.", outputs: "A status the UI can show.", failure: "A queue with no worker." },
      { id: "observe", name: "Logs", responsibility: "Import counts, decision writes, error codes.", inputs: "The API.", outputs: "A place to look after release.", failure: "Logging the CSV itself." },
    ],
    failures: [
      { id: "partial", title: "Half an import is visible", path: "The write should be one transaction. If the list shows new rows and an error, the boundary is wrong." },
    ],
  },
];

/** Synthetic incident. Not a record from any project. */
export const syntheticIncident = {
  title: "Ranks disappear after a release",
  steps: [
    { id: "notice", name: "Notice", body: "The list page loads and shows no accounts. The host says the deployment succeeded. Synthetic." },
    { id: "separate", name: "Separate build from health", body: "The build compiled. The release swapped. Health is the read. A green deploy does not mean the query works." },
    { id: "trace", name: "Read the error", body: "The API log shows a NOT NULL violation on account.region. The migration added the column without a default, and existing rows are null." },
    { id: "contain", name: "Contain", body: "Roll back the application if the old build tolerates the new column. If it does not, roll the migration forward with a backfill in the same change." },
    { id: "repair", name: "Repair", body: "Backfill region from the source file or set an explicit unknown. Then enforce NOT NULL." },
    { id: "learn", name: "Learn", body: "Add a migration check against a copy of production-shaped rows, and a smoke test that reads the list after deploy." },
  ],
};

/** Principles, each with a working meaning. */
export const foundingPrinciples: { title: string; body: string }[] = [
  { title: "Ship the smallest useful system", body: "A useful system finishes the workflow. A demo that cannot record the decision is smaller and unfinished." },
  { title: "Prefer explicit contracts", body: "Column names, weight sums, and API errors should be visible. Hidden defaults become the next outage." },
  { title: "Keep architecture proportional", body: "Add a process when the runtime, the language, or the schedule is different. Not because a diagram has boxes left." },
  { title: "Make failure observable", body: "A stuck worker, a rejected row, and a missing env var need a signal that is not a user email." },
  { title: "Protect data and permissions early", body: "Row-level scope and secret handling are cheaper on the first table than on the fifth integration." },
  { title: "Test the workflow people use", body: "Pin the rubric and one bad upload. Leave the rest until a failure teaches you." },
  { title: "Measure before optimizing", body: "A timeout you have seen is a queue. A timeout you imagine is a guess." },
  { title: "Automate a workflow you understand", body: "Schedule the job after the manual run is boring and the failure mode is known." },
  { title: "Use a model when it beats a rule", body: "Language in, language out, with a fallback. Scores, tax, and identity stay on rules unless you can evaluate the alternative." },
  { title: "Treat deployment as engineering", body: "Migrations, env vars, smoke checks, and rollback are part of the change, not an ops favor." },
  { title: "Make the trade-off explicit", body: "Write what you deferred and what evidence would bring it back." },
  { title: "Say what is unfinished", body: "A live URL proves the host answered. It does not prove every screen behind it." },
];

/** Generic next milestone. Links are existing artifacts only. */
export const nextBuildSteps: { step: string; detail: string }[] = [
  { step: "Name the unresolved problem", detail: "One workflow that still fails or still does not exist. Not a theme." },
  { step: "Check the assumption", detail: "Separate what the code does from what a user would need. Leave unknowns marked." },
  { step: "Write acceptance", detail: "The inputs, the output, and the failure that must stay visible." },
  { step: "Pick the smallest architecture", detail: "Extend the process you have unless a boundary is already hurting." },
  { step: "Implement the critical path", detail: "Skip the adjacent feature." },
  { step: "Test the important failure", detail: "The bad file, the missing key, the overlapping job, the unauthorized read." },
  { step: "Deploy with a rollback", detail: "Migration and smoke check included." },
  { step: "Instrument the workflow", detail: "Count the action you care about. Do not log the private payload." },
  { step: "Read the evidence", detail: "Errors, empty results, and finished tasks. Not a vanity total." },
  { step: "Choose the next iteration", detail: "The failure you can reproduce outranks the feature you can imagine." },
];

/** Existing artifacts a reader can open. */
export const foundingArtifacts: { label: string; href: string }[] = [
  { label: "RevenueRoles", href: "https://revenueroles.in/" },
  { label: "RevenueRoles repository", href: "https://github.com/ayushrai-hub/RevenueRoles" },
  { label: "Revenue Intelligence dashboard", href: "https://revopy.vercel.app/" },
  { label: "Revenue Intelligence API", href: "https://cashmaker-two.vercel.app/" },
  { label: "Revenue Intelligence repository", href: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE" },
  { label: "AGENYRA", href: "https://agenyra.space/" },
  { label: "AGENYRA repository", href: "https://github.com/ayushrai-hub/AGENYRA_product" },
  { label: "SpiderWeb repository", href: "https://github.com/ayushrai-hub/SpiderWeb" },
  { label: "The Open Framework", href: "https://the-open-frameworks.vercel.app/" },
  { label: "The Open Framework repository", href: "https://github.com/ayushrai-hub/the-open-framework" },
  { label: "MedVoice repository", href: "https://github.com/ayushrai-hub/MedVoiceERP" },
  { label: "Product notes on this site", href: "/products" },
];

/** Case studies. Wording stays inside the product records and the READMEs inspected for this page. */
export const foundingCases: FoundingCase[] = [
  {
    id: "revenueroles",
    title: "RevenueRoles",
    evidence: "live",
    evidenceLabel: "Live site and repository",
    links: [
      { label: "revenueroles.in", href: "https://revenueroles.in/" },
      { label: "Repository", href: "https://github.com/ayushrai-hub/RevenueRoles" },
      { label: "Product note", href: "/products/revenueroles" },
    ],
    sections: [
      { heading: "Problem", body: "Technical revenue roles are posted under inconsistent titles across employer boards. Comparing them means reading each description." },
      { heading: "Constraints", body: "The useful output is a listing that still links to the original application. Deduplication cannot drop that link. There is no published user or revenue figure, and this page does not add one." },
      { heading: "Design decisions", body: "Classify from the work described, not the title. Pull Greenhouse, Lever, Ashby, and RemoteOK into one schema. Run discovery on a schedule instead of inside a page view. Keep Postgres, including pgvector, as the store, with row-level security in the migrations." },
      { heading: "Implementation", body: "The repository is a monorepo: a Next.js web app, a Next.js API with Inngest for scheduled discovery and a resume queue, and a Python FastAPI classification worker. The site is on Vercel. The homepage answers. Commit notes record production deploys of job discovery and the jobs API in July 2026." },
      { heading: "Trade-offs", body: "Description classification costs more per posting than a title match. That cost is the product. Deduplication stays conservative so a merged row keeps a working apply link." },
      { heading: "Failure modes", body: "A connector can return nothing when a board changes. A scheduled run can overlap. The public page can be up while classification or a signed-in screen is not." },
      { heading: "What is verified", body: "The homepage is live. Connectors have recorded fixtures and tests. The Python pipeline has passing local tests, as recorded on the product note. I have not re-run that suite for this page." },
      { heading: "What remains unfinished", body: "Sign-in, Google OAuth, profiles, resume parsing, the dashboard, and the admin console are implemented and not all verified in production. Saved jobs, applications, notifications, and error monitoring are not built. Transactional email through Resend is partly wired." },
      { heading: "What I would do next", body: "Verify the signed-in path in production or mark it off, then watch discovery freshness: when a run last succeeded, and which source returned zero. Salary display stays blocked on a check of units and ranges." },
    ],
  },
  {
    id: "rie",
    title: "Revenue Intelligence Engine",
    evidence: "repository",
    evidenceLabel: "Demo on synthetic data",
    links: [
      { label: "Dashboard", href: "https://revopy.vercel.app/" },
      { label: "API host", href: "https://cashmaker-two.vercel.app/" },
      { label: "Repository", href: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE" },
      { label: "Project note", href: "/projects#revenue-intelligence-engine" },
    ],
    sections: [
      { heading: "Problem", body: "The engine is a systems demo of an explainable account workflow: define an ICP, score accounts, research the top ones, and hold export behind a person. It is not a live sales tool." },
      { heading: "Constraints", body: "The bundled universe is 42 fictional companies. Enrichment is a mock. There is no outbound mail and no CRM write. A 200 from the dashboard does not turn those rows into customers." },
      { heading: "Design decisions", body: "The score is a transparent 100-point rubric, never a model. Research is a later step, optional, at temperature 0 when a key exists, with a deterministic fallback when it does not. Approval is a state: pending, approved, or rejected. Re-runs get a new run id and upsert companies." },
      { heading: "Implementation", body: "FastAPI and SQLAlchemy on the API. Next.js for the console. The repository README names two Vercel projects: the API at cashmaker-two.vercel.app and the dashboard at revopy.vercel.app, which calls the API through /backend. An empty database reseeds the synthetic fixture unless DATABASE_URL points at Postgres." },
      { heading: "Trade-offs", body: "A mock enricher lets the pipeline finish and teaches nothing about vendor coverage. Keeping the model off the score makes the rank explainable and leaves messy qualitative judgment to the research paragraph." },
      { heading: "Failure modes", body: "A cold start can look like new data when it is the fixture again. Fallback research can be mistaken for a model result if the fallback flag is ignored. Export without checking approval defeats the gate." },
      { heading: "What is verified", body: "Both hosts responded when this page was written. The README and the project record agree on the synthetic universe, the rubric, the approval gate, and the absence of CRM or outbound. I did not treat the dashboard as evidence of revenue." },
      { heading: "What remains unfinished", body: "No Clay, Apollo, or CRM integration. No real leads. Contacts and signals in the bundle are fictional. The site's project record still points its demo field at the API host. The README is the source for the dashboard URL." },
      { heading: "What I would do next", body: "Make the fallback flag obvious in the UI, and make a cold start say that the rows are the seeded fixture. A real source waits until the approval path is the habit." },
    ],
  },
  {
    id: "agenyra",
    title: "AGENYRA",
    evidence: "live",
    evidenceLabel: "Public site is the waitlist",
    links: [
      { label: "agenyra.space", href: "https://agenyra.space/" },
      { label: "Repository", href: "https://github.com/ayushrai-hub/AGENYRA_product" },
      { label: "Product note", href: "/products/agenyra" },
    ],
    sections: [
      { heading: "Problem", body: "The product aim is to represent AI products as structured data before distributing them. The public site is the explanation and the waitlist, not an open catalog." },
      { heading: "Constraints", body: "The public repository can prove the website and the waitlist. It does not contain the product graph. I do not infer search, ranking, or distribution from the name." },
      { heading: "Design decisions", body: "Stage labels live in one module: building, experimental, exploring, planned, and research. Waitlist rows go to Supabase with row-level security and no policies for anon or authenticated roles. The service role is the only writer. Secrets are server-only." },
      { heading: "Implementation", body: "Next.js 16 App Router, React 19, Tailwind CSS v4, deployed on Vercel. The form is a server action with validation, a honeypot, a minimum fill time, and rate limits. Duplicate emails get the same confirmation. No email is sent on signup. Without Supabase env vars the form says it is temporarily unavailable." },
      { heading: "Trade-offs", body: "Publishing the stage model early makes the ambition visitable and requires every sentence to say which layer is real. Keeping the graph private means this repository cannot be cited as the search implementation." },
      { heading: "Failure modes", body: "A missing env var looks like a product bug if the copy does not say the form is unavailable. A service-role key in a client bundle would bypass the row-level lock. The export route is token-protected and unlinked. An unset token returns 404." },
      { heading: "What is verified", body: "agenyra.space responded. The repository README matches the product note: marketing site, stage model, waitlist storage, and a private graph that is not in this public tree. Structured search is described as an internal experiment, not a public capability." },
      { heading: "What remains unfinished", body: "Distribution beyond the site, analytics, personalization, public APIs, and contextual intelligence are later stages. Intent matching is explicitly not the public product." },
      { heading: "What I would do next", body: "Keep the public copy tied to the stage module. The next engineering proof belongs in a described, reviewable slice of structured profiles, not in a broader claim." },
    ],
  },
  {
    id: "spiderweb",
    title: "SpiderWeb",
    evidence: "repository",
    evidenceLabel: "Local product, not a public deployment",
    links: [
      { label: "Repository", href: "https://github.com/ayushrai-hub/SpiderWeb" },
      { label: "Project note", href: "/projects#spiderweb" },
    ],
    sections: [
      { heading: "Problem", body: "A LinkedIn data export is a pile of CSVs. SpiderWeb turns that export into people, companies, roles, and conversations you can search, with a graph of your own network." },
      { heading: "Constraints", body: "It only knows what the export contains. Connections.csv has no location or industry. Emails are mostly absent. This build has no sign-in. The README says not to expose it on a public network as-is." },
      { heading: "Design decisions", body: "Detect files by name, then by column signature. Scope every query by workspace id. Delete raw uploads after parse unless KEEP_RAW_UPLOADS is set. Skip advertising and security files. Relationship signals are rules that state why a person surfaced. Imports run in-process unless you opt into a Redis queue." },
      { heading: "Implementation", body: "A pnpm monorepo: Next.js web app, Fastify API, Postgres, Redis, and an optional ingestion worker. Docker Compose brings up the data stores. The API refuses to start when the database is down or the schema is behind. The README documents a Vercel split and a self-host path. The project record on this site says there is no production deployment. I am treating that as the status." },
      { heading: "Trade-offs", body: "No authentication made the local loop smaller and makes a public deploy unsafe. Inline ingestion is simple and will not drain a queue you forgot to start. A queue is available when you set the mode and run the worker." },
      { heading: "Failure modes", body: "Queue mode with no worker leaves imports queued. A partial archive imports what it can and says which files failed. Job-change signals need two imports. A single export is one snapshot." },
      { heading: "What is verified", body: "The README and the project record. The README cites its own test commands, including a large unit and integration run and a Playwright pass. I have not re-run them for this page, so I am not pasting those counts as a fresh result." },
      { heading: "What remains unfinished", body: "Real authentication. The design docs mention an assistant, enrichment, and vector search that this build does not implement. There is no production deployment to point at." },
      { heading: "What I would do next", body: "Replace the seeded local identity with a real session before any hosted demo, and keep the workspace constraint under test. A public URL without that step would be a data leak." },
    ],
  },
  {
    id: "open-framework",
    title: "The Open Framework",
    evidence: "prototype",
    evidenceLabel: "Front-end prototype",
    links: [
      { label: "Live prototype", href: "https://the-open-frameworks.vercel.app/" },
      { label: "Repository", href: "https://github.com/ayushrai-hub/the-open-framework" },
      { label: "Product note", href: "/products/the-open-framework" },
    ],
    sections: [
      { heading: "Problem", body: "Civil-society organizations, donors, talent, and institutions lack a shared, consent-aware way to discover one another and to see which claims have been checked." },
      { heading: "Constraints", body: "The repository is a front end. It does not run verification, consent, or a durable institutional backend. Illustrative figures and partner names on the live copy are prototype text." },
      { heading: "Design decisions", body: "Publish the journeys so the idea is visitable, and keep federated discovery, audit logs, and the institutional backend in the design-goal column until a service exists." },
      { heading: "Implementation", body: "Vite, React, TypeScript, Tailwind, shadcn/ui, React Router, and TanStack Query, deployed on Vercel. Sign-in writes a mock user to localStorage. The product log notes that most early commits are attributed to the Lovable bot. Later commits under ayushrai-hub remove that branding and record the Vercel setup. I am not treating the prototype as a system I founded as national infrastructure." },
      { heading: "Trade-offs", body: "A wide clickable prototype makes unfinished portals look more real than they are. That is the risk of showing the concept before the backend." },
      { heading: "Failure modes", body: "A reader can mistake mock sign-in and illustrative scale for a running registry. The copy has to keep saying prototype." },
      { heading: "What is verified", body: "The public site responded. The repository matches the product note: client routes, role screens, and a mock session." },
      { heading: "What remains unfinished", body: "Verification, consent records, governance, and any backend that could support them." },
      { heading: "What I would do next", body: "Cut the prototype's implied operations language, and specify the thinnest verification step before adding another portal screen." },
    ],
  },
  {
    id: "medvoice",
    title: "MedVoice",
    evidence: "repository",
    evidenceLabel: "Repository, no public demo",
    links: [
      { label: "Repository", href: "https://github.com/ayushrai-hub/MedVoiceERP" },
      { label: "Product note", href: "/products/medvoice" },
    ],
    sections: [
      { heading: "Problem", body: "A pharmaceutical wholesaler bills through a handoff from the person picking stock to the person typing the invoice. Look-alike medicines, pack sizes, and tax make that handoff expensive." },
      { heading: "Constraints", body: "There is no public demo URL. The API still defaults to an in-memory demo catalog. Real catalog import, production speech, the Android app, and live ERP sync are not complete." },
      { heading: "Design decisions", body: "Speech proposes a line. Deterministic rules decide identity, GST, and posting. Ambiguous matches stay unconfirmed. Invoice posting is idempotent. An ERP failure is not a successful sale. Money is integer paise." },
      { heading: "Implementation", body: "A NestJS modular monolith, a Next.js admin, and a Kotlin Android scaffold. Postgres is the intended store. Docker Compose prepares Postgres and Redis. Speech sits behind an adapter: mock by default, Deepgram only with a key. ERP adapters that exist are mock and CSV." },
      { heading: "Trade-offs", body: "Refusing a silent match slows the picker on purpose. A wrong strength is more expensive than an extra confirmation. Coexisting with an existing ERP is slower than pretending to replace it." },
      { heading: "Failure modes", body: "Mock speech says nothing about a noisy warehouse. An in-memory catalog disappears on restart. A model that writes tax or identity would be a product bug, not a feature." },
      { heading: "What is verified", body: "The product note, grounded in the repository: matching, order state, confirmation, deterministic GST on the voice-to-invoice path, and in-memory idempotent invoicing. I have not run a warehouse pilot." },
      { heading: "What remains unfinished", body: "Durable database wiring is partial. Multi-tenant roles are started. Marg, Busy, and Tally are specified, not live. Stock reservation, invoice PDF, and a production rollout are planned." },
      { heading: "What I would do next", body: "Replace the in-memory catalog with Postgres for one real export, and keep the confirmation rule. Speech credentials come after the ledger is durable." },
    ],
  },
];

/** How product and engineering decisions meet, using systems that exist. */
export const feedbackLoop = {
  steps: [
    "User problem",
    "Product hypothesis",
    "Smallest useful implementation",
    "Release",
    "Observe behavior",
    "Investigate failures",
    "Gather feedback",
    "Reprioritize",
    "Iterate",
  ],
  body: "RevenueRoles shows the loop in the pipeline I can point at: titles are a poor hypothesis, so the implementation classifies the description, publishes a listing, and leaves freshness and salary units as open checks. I do not have a published set of user interviews to cite, so I am not inventing one. The Revenue Intelligence Engine shows the same shape on synthetic data: an ICP hypothesis, a rubric, a run, an approval, and an export. Changing the rubric is a product decision that the score function has to make visible. Adding a CRM write would be an engineering cost that the current evidence, a fictional universe, does not justify.",
};

/** AI work a founding engineer has to place, limited to what this site already supports. */
export const aiEngineering = {
  body: "A founding engineer decides where a model belongs. On the Revenue Intelligence Engine the score stays a rubric and the model, when a key exists, writes research text with a fallback. On MedVoice, speech is an input and GST, identity, and posting stay on rules. AGENYRA's public site does not call a model. MailU, a local mailbox tool, is the place I have put retrieval and a local model over one person's mail. It is not a multi-tenant product.",
  limits: "Contract evaluation work at FoCDoT and, later, through Outlier is RLHF-shaped review of model output. The engagements limit how much of that I can publish. I am not citing an Adaptive RAG system on this page. This site does not publish one as a shipped implementation of mine.",
  duties: [
    "Choose a model or a rule for the actual task.",
    "Keep tool and API boundaries narrow.",
    "Evaluate output against a criterion you can show.",
    "Handle a missing key, a timeout, and a wrong answer.",
    "Watch cost and latency before adding a call.",
    "Keep private text out of logs.",
    "Prefer a deterministic fallback when the workflow must finish.",
    "Monitor the output, not only the uptime of the API.",
  ],
};

/**
 * Markdown body for `/pow/founding-engineer.md`.
 * Uses the same records as the page so the twin does not invent a second set of claims.
 */
export function renderFoundingEngineerBody(): string {
  const cases = foundingCases
    .map((item) => {
      const links = item.links.map((link) => `[${link.label}](${link.href})`).join(" · ");
      const sections = item.sections.map((section) => `### ${section.heading}\n\n${section.body}`).join("\n\n");
      return `## ${item.title}\n\n${item.evidenceLabel}. ${links}\n\n${sections}`;
    })
    .join("\n\n");
  const principles = foundingPrinciples.map((item) => `- **${item.title}.** ${item.body}`).join("\n");
  return [
    foundingEngineer.positioning,
    "",
    foundingEngineer.support,
    "",
    foundingEngineer.workbenchNote,
    "",
    "The interactive workbench runs in the browser on the HTML page. This Markdown twin records the case studies, the decision log, and the limits.",
    "",
    cases,
    "",
    "## Decision log",
    "",
    decisionRecords
      .map(
        (item) =>
          `### ${item.title} (${item.kind})\n\n${item.chosen}\n\nRevisit when: ${item.revisitWhen}`,
      )
      .join("\n\n"),
    "",
    "## Principles",
    "",
    principles,
    "",
    "## AI placement",
    "",
    aiEngineering.body,
    "",
    aiEngineering.limits,
  ].join("\n");
}
