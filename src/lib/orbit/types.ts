/**
 * Types for the ORBIT demonstration on /pow/agentic-ai.
 *
 * These are the contracts the page and the tests share: tool names, step statuses,
 * run outcomes, and the local fixture store. Nothing here talks to a model or a network.
 *
 * Connects to:
 * - src/lib/orbit/fixtures.ts, tools.ts, and simulation.ts.
 * - src/components/orbit/* and src/pages/AgenticPowPage.tsx.
 */

/** Tools the demonstration registry is allowed to call. */
export const TOOL_NAMES = [
  "get_account",
  "get_recent_events",
  "list_support_tickets",
  "calculate_health_score",
  "search_evidence",
  "create_internal_task",
  "draft_notification",
  "verify_task_created",
] as const;

/** One name from `TOOL_NAMES`. */
export type ToolName = (typeof TOOL_NAMES)[number];

/** Lifecycle of a single planned step. `running` is reserved for a live controller. */
export type StepStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "waiting_for_approval"
  | "rejected"
  | "skipped"
  | "cancelled";

/** Words for each step status. The label is the status; color is optional. */
export const STEP_STATUS_LABELS: Record<StepStatus, string> = {
  pending: "Pending",
  running: "Running",
  succeeded: "Succeeded",
  failed: "Failed",
  waiting_for_approval: "Waiting for approval",
  rejected: "Rejected",
  skipped: "Skipped",
  cancelled: "Cancelled",
};

/** Where a run is in the controller, distinct from the outcome label. */
export type RunPhase = "ready" | "in_progress" | "waiting_for_approval" | "finished";

/** Terminal or in-progress judgment. Only `verified` and `read_only_complete` are qualified. */
export type Outcome =
  | { kind: "in_progress" }
  | { kind: "verified"; taskId: string }
  | { kind: "read_only_complete" }
  | { kind: "uncertain"; question: string }
  | { kind: "rejected" }
  | { kind: "unverified"; claimedTaskId: string; reason: string }
  | { kind: "failed"; reason: string }
  | { kind: "budget_exhausted"; unfinished: string[] }
  | { kind: "incomplete"; missing: string[] };

/** Visitor-facing outcome words. Qualified outcomes are named; they are not a bare "success". */
export const OUTCOME_LABELS: Record<Outcome["kind"], string> = {
  in_progress: "In progress",
  verified: "Verified",
  read_only_complete: "Read-only task complete",
  uncertain: "Uncertain",
  rejected: "Rejected",
  unverified: "Unverified",
  failed: "Failed",
  budget_exhausted: "Stopped at budget",
  incomplete: "Incomplete",
};

/** Scripted tasks the workbench can start. */
export type TaskId = "investigate" | "summarize_support" | "escalation" | "missing_information";

/** Scripted failure labs. Each one is reproducible. */
export type ScenarioId =
  | "timeout"
  | "invalid_arguments"
  | "conflicting_evidence"
  | "duplicate_action"
  | "rejected_approval"
  | "failed_verification"
  | "budget"
  | "untrusted_output";

/** Which fixture overlay a store uses. */
export type StoreVariant = "base" | "conflict" | "injection";

/** Fictional account. `segment` is the honesty label, not a CRM field from a customer. */
export interface AccountRecord {
  id: string;
  name: string;
  plan: string;
  owner: string;
  renewalDate: string | null;
  mrrUsd: number;
  segment: "fictional";
}

/** One dated fixture event. */
export interface EventRecord {
  id: string;
  accountId: string;
  at: string;
  kind: "usage_drop" | "invoice_overdue" | "invoice_paid" | "champion_left";
  summary: string;
}

/** One fixture support record. */
export interface TicketRecord {
  id: string;
  accountId: string;
  status: "open" | "pending" | "closed";
  priority: "low" | "medium" | "high";
  subject: string;
  body: string;
}

/** Internal task created only by an approved write. */
export interface TaskRecord {
  id: string;
  accountId: string;
  title: string;
  body: string;
  idempotencyKey: string;
  status: "open";
}

/** Mutable demonstration database. Each run owns one copy. */
export interface DemoStore {
  variant: StoreVariant;
  account: AccountRecord;
  events: EventRecord[];
  tickets: TicketRecord[];
  tasks: TaskRecord[];
  writes: number;
  handlerCalls: number;
}

/** A passage the controller is willing to cite. */
export interface EvidenceItem {
  id: string;
  source: string;
  text: string;
}

/** One recorded try inside a step. Timeouts are scripted, not measured. */
export interface AttemptRecord {
  n: number;
  status: "failed" | "succeeded";
  error?: string;
}

/** One row in the execution trace. `durationMs` stays null because this page has no clock. */
export interface TraceStep {
  id: string;
  action: "interpret" | "plan" | "tool" | "validate" | "report";
  purpose: string;
  why: string;
  dependsOn: string[];
  tool?: ToolName;
  input?: unknown;
  output?: unknown;
  status: StepStatus;
  attempts: AttemptRecord[];
  error?: string;
  evidenceIds: string[];
  stateNote: string;
  durationMs: null;
  needsApproval: boolean;
  failTimes: number;
  claimSuccessWithoutWrite: boolean;
  check?: "coverage" | "tickets" | "missing_renewal" | "conflict" | "untrusted_data";
}

/** Structured end-of-run report. */
export interface RunReport {
  findings: string[];
  actions: string[];
  failures: string[];
  unresolved: string[];
  outcome: Outcome["kind"];
}

/** Audit line. `seq` is an order index, not a timestamp. */
export interface AuditEvent {
  seq: number;
  event: string;
  detail: string;
}

/** A full demonstration run. `modelCalls` is always 0. */
export interface Run {
  id: string;
  taskId: string;
  title: string;
  simulation: true;
  modelCalls: 0;
  phase: RunPhase;
  steps: TraceStep[];
  evidence: EvidenceItem[];
  approval: "not_required" | "proposed" | "approved" | "rejected";
  taskRecordId: string | null;
  claimedTaskId: string | null;
  duplicatePrevented: boolean;
  uncertainty: string | null;
  blockers: string[];
  outcome: Outcome;
  report: RunReport | null;
  audit: AuditEvent[];
  store: DemoStore;
  maxSteps: number | null;
  executedSteps: number;
}

/** Plan passed to the controller. */
export interface Plan {
  id: string;
  title: string;
  steps: TraceStep[];
  store?: DemoStore;
  maxSteps?: number;
}

/** Whether a write was authorized by the controller, never by the tool payload. */
export interface ToolAuthority {
  approved: boolean;
}

/** Successful tool result, including the next store. */
export interface ToolSuccess {
  ok: true;
  data: unknown;
  evidence: EvidenceItem[];
  sideEffect: "none" | "draft" | "write";
  store: DemoStore;
}

/** Refused or failed tool result. `executed` is false when the handler did not run. */
export interface ToolFailure {
  ok: false;
  code: "invalid_input" | "unknown_tool" | "unauthorized" | "not_found";
  message: string;
  executed: false;
  store: DemoStore;
}

/** Either tool outcome. */
export type ToolResult = ToolSuccess | ToolFailure;

/** Display contract for one tool. The Zod validator is the one that actually rejects input. */
export interface ToolContract {
  name: ToolName;
  description: string;
  inputSchema: string;
  outputSchema: string;
  permissions: string;
  sideEffect: "read" | "draft" | "write";
  failureModes: string[];
  validation: string[];
  example: unknown;
  malformed: unknown;
}

/** Visitor-facing task card. The executable steps live in the simulation. */
export interface TaskCard {
  id: TaskId;
  title: string;
  objective: string;
  context: string;
  constraints: string[];
  expectedOutput: string;
}
