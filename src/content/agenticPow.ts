/**
 * Editorial record for the agentic AI proof-of-work page.
 *
 * ORBIT is a personal demonstration. The copy names what the page simulates and what the
 * linked repositories actually contain. It does not describe a deployed agent platform.
 *
 * Connects to:
 * - src/pages/AgenticPowPage.tsx and src/lib/agent/markdown.ts (`renderAgenticPowBody`).
 * - src/lib/orbit/simulation.ts and tools.ts for the tool and scenario names in the twin.
 * - products.ts and projects.ts for related-work links.
 */
import { getProductBySlug } from "./products";
import { getProjectBySlug } from "./projects";
import { SCENARIOS, TASK_CARDS } from "../lib/orbit/simulation";
import { TOOL_CONTRACTS } from "../lib/orbit/tools";

/** Route for the agentic proof of work. Matches `powPages`. */
export const AGENTIC_PATH = "/pow/agentic-ai";

/** Search and SEO description. States the simulation limit in the first sentences. */
export const agenticPowDescription =
  "A personal demonstration of agent control: scripted plans, typed tools, approval, and verification on fictional data. ORBIT does not call a model.";

/** Hero and positioning copy. */
export const agenticPow = {
  path: AGENTIC_PATH,
  title: "Agentic AI engineering",
  eyebrow: "Agentic AI engineering / proof of work",
  headline: "Agents that do the work—and prove what they did.",
  support:
    "I engineer AI systems that combine reasoning, tools, state, and verification to execute multi-step tasks with control.",
  status:
    "Personal engineering demonstration. The workbench is a deterministic simulation. It is not a deployed autonomous agent platform, and it does not call a model.",
} as const;

/** Thesis points. Reasoning proposes; the system that owns the state has to confirm the effect. */
export const agenticThesis = [
  "Task interpretation — name the outcome before choosing a tool.",
  "Planning and bounded execution — a plan is a proposal with a step budget, not a proof of completion.",
  "Tool selection — this page uses a fixed plan so the controller, not a model, decides the next call.",
  "State management — the run keeps the task, the step, the evidence, and the approval on one record.",
  "Evidence collection — claims cite fixture rows.",
  "Output validation — tool results have to match the contract the registry published.",
  "Error handling — a timeout can be retried once; a bad argument cannot.",
  "Human approval — a write waits. Approval is not the write.",
  "Result verification — the task counts only when the store contains the row.",
  "Observability — the trace shows inputs, outputs, and why a run stopped. Durations are not measured here.",
] as const;

/** The bounded loop the architecture section draws. */
export const agenticLoop = [
  "Request",
  "Plan",
  "Validate plan",
  "Select permitted tool",
  "Execute",
  "Validate result",
  "Update state",
  "Continue or stop",
  "Verify final outcome",
] as const;

/** Architecture nodes. The controller, not the model text, owns the transition. */
export const agenticNodes: { id: string; name: string; summary: string; receives: string; emits: string; authority: string }[] = [
  { id: "request", name: "User request", summary: "The analyst's ask, treated as data.", receives: "A selected task card.", emits: "An objective for the parser.", authority: "The visitor chooses a scripted task. They do not send free-form tool names." },
  { id: "parser", name: "Task parser", summary: "Turns the ask into an objective and constraints.", receives: "The task card.", emits: "The interpret step.", authority: "In this phase the parser is scripted. A later model could propose the parse; it would still be checked." },
  { id: "controller", name: "Execution controller", summary: "The only component that moves the run from one state to the next.", receives: "The plan, the policy, and tool results.", emits: "The next legal transition.", authority: "This is application code. A model response cannot skip approval or mark a missing row verified." },
  { id: "planner", name: "Planner", summary: "Produces an ordered list of steps and dependencies.", receives: "The objective.", emits: "A plan.", authority: "Here the plan is written in source. A model planner would be a proposal the controller can reject." },
  { id: "policy", name: "Policy and permissions", summary: "Decides which tools may run and which need a person.", receives: "The tool name and its side-effect class.", emits: "Allow, deny, or wait.", authority: "Write approval is a controller flag. It is not a field in the tool payload." },
  { id: "registry", name: "Tool registry", summary: "The closed set of tools, schemas, and permissions.", receives: "A tool name.", emits: "A contract, or an unknown-tool error.", authority: "Names outside the eight tools are rejected." },
  { id: "adapters", name: "Tool adapters", summary: "Functions that read or write the demonstration store.", receives: "Validated arguments and a separate authority flag.", emits: "A structured result.", authority: "Adapters do not see a prompt. They see arguments." },
  { id: "state", name: "State store", summary: "The run: task, step, approval, and outcome.", receives: "Controller transitions.", emits: "The current run.", authority: "Session state in the browser. Refreshing clears it. This is not persistent agent memory." },
  { id: "evidence", name: "Evidence store", summary: "Passages collected from tool results.", receives: "Tool evidence items.", emits: "Citations for the report.", authority: "Text from a ticket is stored as evidence, including text that looks like an instruction." },
  { id: "validation", name: "Validation layer", summary: "Checks arguments and whether required evidence exists.", receives: "Payloads and evidence sources.", emits: "Accept or a readable error.", authority: "Schema checks are deterministic. They are not another model call." },
  { id: "approval", name: "Approval manager", summary: "Holds a consequential write until a person decides.", receives: "A proposed create_internal_task.", emits: "Approved or rejected.", authority: "The visitor. Rejected means the adapter is not called." },
  { id: "verifier", name: "Result verifier", summary: "Reads the store after a claimed write.", receives: "A task id.", emits: "exists true or a not-found error.", authority: "The store. A success string from the writer is not enough." },
  { id: "observe", name: "Observability layer", summary: "The trace, the audit list, and the outcome.", receives: "Every transition.", emits: "The timeline on this page.", authority: "No model request id is issued, because no model is called. Latency is not measured." },
  { id: "response", name: "Final response generator", summary: "Assembles findings, actions, failures, and open questions.", receives: "The resolved outcome and the evidence.", emits: "The report.", authority: "It cannot upgrade an unverified or rejected run into a qualified completion." },
];

/** Design choices. The selected approach is the one this demonstration uses. */
export const agenticDecisions: { id: string; title: string; problem: string; alternatives: string[]; selected: string; tradeoffs: string[]; changeWhen: string[] }[] = [
  {
    id: "agents",
    title: "Single agent versus multiple agents",
    problem: "How many decision makers should a task have?",
    alternatives: ["One controller with a tool list.", "Several agents that message each other.", "A fixed workflow with no model choice at all."],
    selected: "One scripted controller. Multiple agents are not assumed to be better.",
    tradeoffs: ["One controller is easier to trace and to stop.", "It will be the wrong split if two permissions really must not share a context."],
    changeWhen: ["Independent duties need different credentials.", "A single context can no longer hold the evidence without hiding a side effect."],
  },
  {
    id: "planning",
    title: "Fixed workflow versus dynamic planning",
    problem: "Should the next step be chosen at runtime?",
    alternatives: ["A fixed plan in source.", "A model that proposes the next tool after every result.", "A model plan that the controller can still reject."],
    selected: "A fixed plan, so this page can show state transitions without pretending a model wrote them.",
    tradeoffs: ["Predictable and testable.", "Rigid when the request is outside the four cards."],
    changeWhen: ["A model planner exists and its proposals are validated before they run.", "The task family is too wide for a hand-written plan."],
  },
  {
    id: "permissions",
    title: "Model-controlled tools versus application-controlled permissions",
    problem: "Who is allowed to cause a side effect?",
    alternatives: ["Trust a tool name that appears in model text.", "Let the payload carry an approved flag.", "Keep permission in the application, outside the payload."],
    selected: "The registry and the controller decide. An approved key inside JSON is a schema error.",
    tradeoffs: ["The model cannot widen its own access.", "Every new tool needs an explicit contract."],
    changeWhen: ["Never toward trusting model text for authorization.", "The policy can grow; the boundary should not move into the prompt."],
  },
  {
    id: "memory",
    title: "Short context versus persistent memory",
    problem: "What should outlive the current task?",
    alternatives: ["Only the current run.", "A full transcript saved forever.", "Scoped facts with a retention rule."],
    selected: "Current-run state only. Persistent memory is described and not implemented.",
    tradeoffs: ["No leaked transcript and no fake memory.", "The next task cannot see this one after a refresh."],
    changeWhen: ["A store exists with scope, relevance, and a way to delete.", "Not before that, and not as a dump of every prompt."],
  },
  {
    id: "approval",
    title: "Automatic execution versus human approval",
    problem: "Which actions may run on their own?",
    alternatives: ["Run every tool.", "Approve every read.", "Approve writes and other consequential effects."],
    selected: "Reads and local drafts run. create_internal_task waits.",
    tradeoffs: ["A person can stop the side effect.", "The person becomes a bottleneck on safe reads if the line is drawn too early."],
    changeWhen: ["The effect can leave the account, spend money, or contact a person.", "Those stay behind approval even if the model is confident."],
  },
  {
    id: "retry",
    title: "Retry versus escalation",
    problem: "What should happen when a step fails?",
    alternatives: ["Retry forever.", "Fail the task immediately.", "Retry a transient read once, and stop for bad arguments or missing proof."],
    selected: "One retry for a scripted timeout. Invalid arguments, conflicts, and failed verification stop.",
    tradeoffs: ["A blip in a read can recover.", "Retrying a write would risk a second side effect, so writes rely on idempotency instead."],
    changeWhen: ["The error is a timeout or a 429 on a read.", "The error is a validation failure, a conflict, or a missing row after a claimed write."],
  },
  {
    id: "validation",
    title: "LLM validation versus deterministic validation",
    problem: "How do we decide that an output is acceptable?",
    alternatives: ["Ask a model if the answer looks right.", "Check a schema, then check the store.", "Use a model only where no rule exists, and label that judgment."],
    selected: "Schemas, fixture rules, and a store read. No model grades the result on this page.",
    tradeoffs: ["The checks are repeatable.", "They will not catch a fluent answer that is outside the rules we wrote."],
    changeWhen: ["A rule can be written.", "A model judge is a last resort and its output is not treated as a source of truth."],
  },
];

/** Security notes. `where` separates what this page shows from what a backend would have to enforce. */
export const agenticSafeguards: { threat: string; safeguard: string; where: "demonstrated" | "backend" }[] = [
  { threat: "Prompt injection", safeguard: "Retrieved ticket text is rendered as data. It does not add a tool or change the plan.", where: "demonstrated" },
  { threat: "Tool permission boundaries", safeguard: "Eight named tools. Unknown names are rejected. Writes check a controller flag.", where: "demonstrated" },
  { threat: "Untrusted external content", safeguard: "The injection scenario quotes the planted sentence and follows none of it.", where: "demonstrated" },
  { threat: "Secret exposure", safeguard: "The fixture has no credentials. A production runner would need a secret store and redaction.", where: "backend" },
  { threat: "Unauthorized side effects", safeguard: "Rejection skips the write. A direct call without approval does not insert a row.", where: "demonstrated" },
  { threat: "Cross-tenant data access", safeguard: "There is one fictional account. Tenant isolation is not implemented.", where: "backend" },
  { threat: "Excessive tool permissions", safeguard: "The draft tool can only target an internal audience, and it never delivers.", where: "demonstrated" },
  { threat: "Runaway execution", safeguard: "The budget scenario stops after two steps and lists the unfinished ones.", where: "demonstrated" },
  { threat: "Sensitive information in logs", safeguard: "The trace shows fixture rows. A real log pipeline would still need redaction rules.", where: "backend" },
  { threat: "Unsafe retries", safeguard: "Only the scripted read timeout is retried, and only once. Writes use an idempotency key.", where: "demonstrated" },
];

/** Roadmap. Statuses match this repository, not a plan presented as finished. */
export const agenticRoadmap: { phase: string; title: string; status: "implemented" | "partial" | "not_started"; detail: string }[] = [
  { phase: "1", title: "Website and deterministic simulation", status: "implemented", detail: "This page. Scripted tasks, local fixtures, and a controller in the browser." },
  { phase: "2", title: "Typed tool interfaces and an execution state machine", status: "partial", detail: "The types and the machine exist in this frontend. They are not a server runtime." },
  { phase: "3", title: "Persistent state and audit records", status: "not_started", detail: "The audit list lives in component state and disappears on refresh." },
  { phase: "4", title: "Real model provider integration", status: "not_started", detail: "No provider is called. modelCalls is 0." },
  { phase: "5", title: "Controlled tool execution and authorization", status: "not_started", detail: "The approval flag is local. There is no identity, tenancy, or service credential." },
  { phase: "6", title: "Retry policies, idempotency, and verification", status: "partial", detail: "The simulation shows one retry, one idempotency key, and a store read. They are not production policies." },
  { phase: "7", title: "Agent evaluation and observability", status: "partial", detail: "Metrics are computed from these scenarios and labeled illustrative. There is no trace backend." },
  { phase: "8", title: "Deployment hardening and security review", status: "not_started", detail: "This frontend is not a security boundary." },
];

/** Related work that is safe to describe from this site's records or from a README I inspected. */
export function agenticRelatedWork(): { title: string; detail: string; links: { href: string; label: string }[] }[] {
  const engine = getProjectBySlug("revenue-intelligence-engine");
  const spider = getProjectBySlug("spiderweb");
  const medvoice = getProductBySlug("medvoice");
  const agenyra = getProductBySlug("agenyra");
  const roles = getProductBySlug("revenueroles");
  const items = [];
  if (engine) {
    items.push({
      title: engine.title,
      detail: "A synthetic GTM pipeline: deterministic scoring, a research step with a fallback, and a human approval queue before export. It does not send outbound mail or write to a live CRM. That approval-before-effect pattern is the one ORBIT copies. It is not an autonomous agent.",
      links: [
        { href: "/projects#revenue-intelligence-engine", label: "On this site" },
        { href: "https://revopy.vercel.app/", label: "Live demo" },
        ...(engine.links?.github ? [{ href: engine.links.github, label: "GitHub" }] : []),
      ],
    });
  }
  if (medvoice) {
    items.push({
      title: medvoice.title,
      detail: "Speech proposes an order line. Catalog matching, tax, and invoice posting are deterministic, and an ERP failure is not reported as a sale. That is the same split between a proposal and a verified effect. It is not an agent orchestrator, and it has no public demo URL.",
      links: [
        { href: "/products/medvoice", label: "On this site" },
        ...(medvoice.githubUrl ? [{ href: medvoice.githubUrl, label: "GitHub" }] : []),
      ],
    });
  }
  if (agenyra) {
    items.push({
      title: agenyra.title,
      detail: "A public site and waitlist for structured product data. Search over structured fields is not the same thing as placing a product inside an agent. The public repository does not contain an agent runtime.",
      links: [
        { href: "/products/agenyra", label: "On this site" },
        ...(agenyra.demoUrl ? [{ href: agenyra.demoUrl, label: "Live site" }] : []),
        ...(agenyra.githubUrl ? [{ href: agenyra.githubUrl, label: "GitHub" }] : []),
      ],
    });
  }
  if (roles) {
    items.push({
      title: roles.title,
      detail: "A job-discovery pipeline: collect postings, normalize them, classify by the work described, and keep a link back to the original page. Useful pipeline and verification habits. Not an agent that applies to jobs.",
      links: [
        { href: "/products/revenueroles", label: "On this site" },
        ...(roles.demoUrl ? [{ href: roles.demoUrl, label: "Live site" }] : []),
        ...(roles.githubUrl ? [{ href: roles.githubUrl, label: "GitHub" }] : []),
      ],
    });
  }
  if (spider) {
    items.push({
      title: spider.title,
      detail: "Turns a LinkedIn data export into local people, companies, and conversation records. Counts are counts of imported rows. It runs locally and is not an agent.",
      links: [
        { href: "/projects#spiderweb", label: "On this site" },
        ...(spider.links?.github ? [{ href: spider.links.github, label: "GitHub" }] : []),
      ],
    });
  }
  items.push({
    title: "OpenAI-RLHF",
    detail: "An archive of coding-evaluation tasks and A/B completion pairs. The repository's own summary says it does not contain an RLHF, PPO, or DPO trainer. It shows evaluation artifacts, not an agent loop.",
    links: [{ href: "https://github.com/ayushrai-hub/OpenAI-RLHF", label: "GitHub" }],
  });
  items.push({
    title: "This website's agent interfaces",
    detail: "Markdown twins, lexical search, and a read-only MCP server over the public records. That is a surface an agent can call. It is not an agent that browses and acts.",
    links: [{ href: "/developers", label: "Developer docs" }, { href: "/ai-engineering/agents", label: "Agents dossier" }],
  });
  items.push({
    title: "adaptive-rag",
    detail: "The public repository describes a LangGraph routing demo. Commit history is mostly Dhruv Singhal's (12 commits to 1 on this account). I am not describing it as my agent system, and this site does not claim a production RAG deployment.",
    links: [{ href: "https://github.com/ayushrai-hub/adaptive-rag", label: "GitHub" }],
  });
  return items;
}

/** Markdown twin body. Interactive state is not copied; the limits are. */
export function renderAgenticPowBody(): string {
  const related = agenticRelatedWork();
  return [
    agenticPow.status,
    "",
    agenticPow.support,
    "",
    "## Thesis",
    "",
    "An agent is more than an LLM call. On this page the plan is scripted so the control flow can be inspected. A sentence that says a task was created is not completion. Completion is a row the store can read back.",
    "",
    ...agenticThesis.map((line) => `- ${line}`),
    "",
    "## Loop",
    "",
    agenticLoop.join(" → "),
    "",
    "## Tasks",
    "",
    ...TASK_CARDS.map((task) => `- ${task.title}: ${task.objective}`),
    "",
    "## Tools",
    "",
    ...TOOL_CONTRACTS.map((tool) => `- \`${tool.name}\` (${tool.sideEffect}, ${tool.permissions}): ${tool.description}`),
    "",
    "## Failure scenarios",
    "",
    ...SCENARIOS.map((scenario) => `- ${scenario.title}: ${scenario.expected}`),
    "",
    "## Roadmap",
    "",
    ...agenticRoadmap.map((phase) => `- Phase ${phase.phase} — ${phase.title} (${phase.status}). ${phase.detail}`),
    "",
    "## Related work",
    "",
    ...related.map((item) => `- ${item.title}. ${item.detail}`),
    "",
    "An agent is only as useful as the work it can reliably complete—and the evidence that it completed it.",
  ].join("\n");
}
