/**
 * Deterministic controller for the ORBIT demonstration.
 *
 * `createRun` builds a scripted plan. `runNext` applies one step. Approval is a separate
 * transition from execution, and verification reads the store rather than the tool's claim.
 * No function in this file calls a model. `modelCalls` on every run is 0.
 *
 * Connects to:
 * - src/lib/orbit/fixtures.ts and tools.ts.
 * - src/components/orbit/* and src/pages/AgenticPowPage.tsx.
 * - src/__tests__/orbit.test.ts.
 */
import { createStore, INJECTION_TEXT } from "./fixtures";
import { invokeTool, validateToolInput } from "./tools";
import type {
  Outcome,
  Plan,
  Run,
  RunReport,
  ScenarioId,
  TaskCard,
  TaskId,
  TraceStep,
  ToolName,
} from "./types";
import { OUTCOME_LABELS } from "./types";

/** Maximum tries for a scripted timeout: the first call plus one retry. */
const MAX_ATTEMPTS = 2;

/** Task cards shown before a run starts. */
export const TASK_CARDS: TaskCard[] = [
  {
    id: "investigate",
    title: "Investigate a deteriorating account",
    objective: "Explain why Northwind Analytical looks unhealthy and, if the evidence supports it, store one internal follow-up.",
    context: "Fictional account acct_northwind. The fixture includes a usage drop, an overdue invoice row, a departed contact, and two open tickets.",
    constraints: [
      "Do not email the account.",
      "A write requires approval.",
      "The run is not verified until the task row is read back.",
    ],
    expectedOutput: "A report citing the fixture rows, plus a verified internal task if the write is approved.",
  },
  {
    id: "summarize_support",
    title: "Summarize unresolved support issues",
    objective: "List the open support records and leave the store unchanged.",
    context: "The same fictional account. One ticket is already closed and should stay out of the open list.",
    constraints: ["Read-only.", "Do not invent a priority the fixture does not store."],
    expectedOutput: "A read-only report of the open tickets.",
  },
  {
    id: "escalation",
    title: "Prepare an internal escalation",
    objective: "Draft an internal note and propose one escalation task.",
    context: "Uses the health score and the open tickets. Sending the note is out of scope.",
    constraints: ["The draft is not delivery.", "Rejecting the task must leave the store without a new row."],
    expectedOutput: "A proposed task that becomes a stored row only after approval, then a verification read.",
  },
  {
    id: "missing_information",
    title: "Find missing information before acting",
    objective: "Decide whether a renewal follow-up can be recommended.",
    context: "The fixture account has no renewal date.",
    constraints: ["Do not fill the missing date.", "Do not recommend an action the record cannot support."],
    expectedOutput: "An incomplete outcome that names the missing field.",
  },
];

/** Failure-lab copy. The runner is `runScenario`. */
export const SCENARIOS: { id: ScenarioId; title: string; expected: string; mechanism: string }[] = [
  {
    id: "timeout",
    title: "Tool timeout",
    expected: "The read fails once, the controller retries once, and the second attempt returns the fixture events.",
    mechanism: "The timeout is scripted. The retry bound is two attempts. A domain error would not use this retry.",
  },
  {
    id: "invalid_arguments",
    title: "Invalid tool arguments",
    expected: "The call is rejected before the handler. The handler counter stays at zero.",
    mechanism: "Zod validation runs in the controller. An empty accountId never reaches calculate_health_score.",
  },
  {
    id: "conflicting_evidence",
    title: "Conflicting evidence",
    expected: "The run stops as uncertain and does not pick a winning invoice status.",
    mechanism: "Both the overdue row and the paid row stay in the store. The validator records the disagreement.",
  },
  {
    id: "duplicate_action",
    title: "Duplicate action request",
    expected: "The second write returns the original task. The store still has one row.",
    mechanism: "create_internal_task keys on idempotencyKey. A repeat after approval does not increment the write count.",
  },
  {
    id: "rejected_approval",
    title: "Rejected approval",
    expected: "The proposed task is not stored. Later steps are skipped.",
    mechanism: "Rejection is a controller transition. The write tool is not called.",
  },
  {
    id: "failed_verification",
    title: "Failed verification",
    expected: "The adapter reports success, the store has no row, and the outcome is unverified.",
    mechanism: "verify_task_created reads the store. A success string from the writer is not evidence.",
  },
  {
    id: "budget",
    title: "Maximum execution budget",
    expected: "The run stops after two executed steps and names the work it did not do.",
    mechanism: "maxSteps is enforced by the controller. Remaining steps are cancelled or skipped, not guessed.",
  },
  {
    id: "untrusted_output",
    title: "Untrusted tool output",
    expected: "The planted instruction is quoted as ticket text. No send tool runs, and no task is written.",
    mechanism: "Retrieved body is stored on the tool result. The controller has no path that treats that string as a plan.",
  },
];

/** Build a pending trace step. */
function pending(step: Omit<TraceStep, "status" | "attempts" | "evidenceIds" | "stateNote" | "durationMs" | "needsApproval" | "failTimes" | "claimSuccessWithoutWrite"> & Partial<Pick<TraceStep, "needsApproval" | "failTimes" | "claimSuccessWithoutWrite" | "check">>): TraceStep {
  return {
    status: "pending",
    attempts: [],
    evidenceIds: [],
    stateNote: "",
    durationMs: null,
    needsApproval: false,
    failTimes: 0,
    claimSuccessWithoutWrite: false,
    ...step,
  };
}

/** Shared read of the fictional account. */
function accountStep(id: string, dependsOn: string[]): TraceStep {
  return pending({
    id,
    action: "tool",
    purpose: "Load the account the request named.",
    why: "Later steps need the account id and the renewal field from the fixture, not from the prompt.",
    dependsOn,
    tool: "get_account",
    input: { accountId: "acct_northwind" },
  });
}

/** Plans for the four workbench tasks. */
function taskPlan(taskId: TaskId): { title: string; steps: TraceStep[] } {
  if (taskId === "investigate") {
    return {
      title: "Investigate a deteriorating account",
      steps: [
        pending({ id: "interpret", action: "interpret", purpose: "Name the outcome the request is asking for.", why: "The controller needs an objective before it chooses tools.", dependsOn: [] }),
        pending({ id: "plan", action: "plan", purpose: "List the bounded steps and their dependencies.", why: "The plan is a proposal. It is not evidence that the work happened.", dependsOn: ["interpret"] }),
        accountStep("load_account", ["plan"]),
        pending({ id: "load_events", action: "tool", purpose: "Read recent account events.", why: "Health claims need the event rows.", dependsOn: ["load_account"], tool: "get_recent_events", input: { accountId: "acct_northwind", limit: 10 } }),
        pending({ id: "load_tickets", action: "tool", purpose: "Read open support records.", why: "Unresolved support is part of the health picture.", dependsOn: ["load_account"], tool: "list_support_tickets", input: { accountId: "acct_northwind", status: "open" } }),
        pending({ id: "score", action: "tool", purpose: "Compute the fixture health score.", why: "The score is a function of stored rows, not a sentence from the planner.", dependsOn: ["load_events", "load_tickets"], tool: "calculate_health_score", input: { accountId: "acct_northwind" } }),
        pending({ id: "search", action: "tool", purpose: "Collect passages that mention the overdue invoice.", why: "The follow-up should cite a row, not a paraphrase alone.", dependsOn: ["load_events"], tool: "search_evidence", input: { accountId: "acct_northwind", query: "overdue" } }),
        pending({ id: "assess", action: "validate", purpose: "Check that account, events, tickets, and score were all collected.", why: "A plan step is not complete just because it was listed.", dependsOn: ["score", "search"], check: "coverage" }),
        pending({ id: "draft", action: "tool", purpose: "Store an internal draft of the follow-up.", why: "The draft is local. Delivery is a different action and is not available.", dependsOn: ["assess"], tool: "draft_notification", input: { accountId: "acct_northwind", audience: "internal", summary: "Fixture health is low. Invoice inv_1044 is overdue in the event row. SSO ticket tkt_sso is open." } }),
        pending({ id: "propose_task", action: "tool", purpose: "Propose one internal follow-up task.", why: "Creating a task changes the store, so the controller must stop for approval.", dependsOn: ["draft"], tool: "create_internal_task", needsApproval: true, input: { accountId: "acct_northwind", title: "Follow up on Northwind Analytical health", body: "Review evt_invoice and tkt_sso. Do not email the account from this simulation.", idempotencyKey: "idem:northwind:health-follow-up" } }),
        pending({ id: "verify", action: "tool", purpose: "Read the store to see whether the task row exists.", why: "The writer saying it created a task is not verification.", dependsOn: ["propose_task"], tool: "verify_task_created" }),
        pending({ id: "report", action: "report", purpose: "Summarize findings, actions, failures, and open questions.", why: "The caller needs the outcome and the evidence in one place.", dependsOn: ["verify"] }),
      ],
    };
  }
  if (taskId === "summarize_support") {
    return {
      title: "Summarize unresolved support issues",
      steps: [
        pending({ id: "interpret", action: "interpret", purpose: "Confirm the request is a read of open tickets.", why: "A summary should not grow a write step that the request did not ask for.", dependsOn: [] }),
        pending({ id: "plan", action: "plan", purpose: "Plan a read-only pass.", why: "The smallest plan that answers the question is the one to run.", dependsOn: ["interpret"] }),
        pending({ id: "load_tickets", action: "tool", purpose: "List open tickets.", why: "The open filter is applied by the tool, not by dropping rows in the prose.", dependsOn: ["plan"], tool: "list_support_tickets", input: { accountId: "acct_northwind", status: "open" } }),
        pending({ id: "search", action: "tool", purpose: "Find the export-timeout passage.", why: "The summary should point at a stored subject.", dependsOn: ["load_tickets"], tool: "search_evidence", input: { accountId: "acct_northwind", query: "export" } }),
        pending({ id: "assess", action: "validate", purpose: "Confirm ticket evidence was collected.", why: "An empty tool result should not become a confident summary.", dependsOn: ["search"], check: "tickets" }),
        pending({ id: "report", action: "report", purpose: "Report the open tickets.", why: "The closed logo request is not an unresolved issue.", dependsOn: ["assess"] }),
      ],
    };
  }
  if (taskId === "escalation") {
    return {
      title: "Prepare an internal escalation",
      steps: [
        pending({ id: "interpret", action: "interpret", purpose: "Treat the request as an internal escalation, not a customer email.", why: "The audience changes which tools are permitted.", dependsOn: [] }),
        pending({ id: "plan", action: "plan", purpose: "Plan the reads, the draft, and the approval stop.", why: "The write stays behind the approval step.", dependsOn: ["interpret"] }),
        accountStep("load_account", ["plan"]),
        pending({ id: "score", action: "tool", purpose: "Read the health score that motivates the escalation.", why: "The recommendation should cite the score.", dependsOn: ["load_account"], tool: "calculate_health_score", input: { accountId: "acct_northwind" } }),
        pending({ id: "load_tickets", action: "tool", purpose: "Read open tickets to attach to the escalation.", why: "The task body should name a real ticket id.", dependsOn: ["load_account"], tool: "list_support_tickets", input: { accountId: "acct_northwind", status: "open" } }),
        pending({ id: "draft", action: "tool", purpose: "Draft the internal escalation note.", why: "Drafting is not sending.", dependsOn: ["score", "load_tickets"], tool: "draft_notification", input: { accountId: "acct_northwind", audience: "internal", summary: "Escalate Northwind Analytical internally. Fixture score is low and tkt_sso is open." } }),
        pending({ id: "propose_task", action: "tool", purpose: "Propose the escalation task.", why: "This write waits for approval.", dependsOn: ["draft"], tool: "create_internal_task", needsApproval: true, input: { accountId: "acct_northwind", title: "Internal escalation for Northwind Analytical", body: "Escalation draft is local. Ticket tkt_sso is the open high-priority item.", idempotencyKey: "idem:northwind:escalation" } }),
        pending({ id: "verify", action: "tool", purpose: "Verify the escalation task row.", why: "Approval is not verification.", dependsOn: ["propose_task"], tool: "verify_task_created" }),
        pending({ id: "report", action: "report", purpose: "Report the escalation outcome.", why: "The caller needs to see whether the row exists.", dependsOn: ["verify"] }),
      ],
    };
  }
  return {
    title: "Find missing information before acting",
    steps: [
      pending({ id: "interpret", action: "interpret", purpose: "Ask what would have to be known before a renewal action.", why: "Missing data should stop the recommendation.", dependsOn: [] }),
      pending({ id: "plan", action: "plan", purpose: "Plan a lookup, not a write.", why: "There is no basis for a task yet.", dependsOn: ["interpret"] }),
      accountStep("load_account", ["plan"]),
      pending({ id: "search", action: "tool", purpose: "Search for a renewal owner or date.", why: "If the fixture does not contain it, the run should say so.", dependsOn: ["load_account"], tool: "search_evidence", input: { accountId: "acct_northwind", query: "renewal owner" } }),
      pending({ id: "assess", action: "validate", purpose: "Record the missing renewal date.", why: "The controller must not invent the date.", dependsOn: ["search"], check: "missing_renewal" }),
      pending({ id: "report", action: "report", purpose: "Report the gap and stop.", why: "An incomplete result is the honest output.", dependsOn: ["assess"] }),
    ],
  };
}

/** True only for outcomes this page is willing to call qualified. */
export function isQualifiedOutcome(outcome: Outcome): boolean {
  return outcome.kind === "verified" || outcome.kind === "read_only_complete";
}

/** Visitor label for an outcome kind. */
export function outcomeLabel(kind: Outcome["kind"]): string {
  return OUTCOME_LABELS[kind];
}

/** Append an audit row. The sequence is the next integer, not a clock time. */
function audit(run: Run, event: string, detail: string): Run["audit"] {
  return [...run.audit, { seq: run.audit.length + 1, event, detail }];
}

/** Replace one step immutably. */
function withStep(run: Run, index: number, step: TraceStep): Run {
  const steps = run.steps.map((item, itemIndex) => (itemIndex === index ? step : item));
  return { ...run, steps };
}

/** Mark every still-pending step after `index` as skipped. */
function skipAfter(run: Run, index: number): Run {
  const steps = run.steps.map((step, stepIndex) => {
    if (stepIndex <= index || step.status !== "pending") return step;
    return { ...step, status: "skipped" as const, stateNote: "Skipped because an earlier step stopped the run." };
  });
  return { ...run, steps };
}

/** Build the terminal report from whatever the run actually collected. */
function buildReport(run: Run, outcome: Outcome): RunReport {
  const actions: string[] = [];
  if (run.steps.some((step) => step.tool === "draft_notification" && step.status === "succeeded")) {
    actions.push("Stored an internal draft. Nothing was sent.");
  }
  for (const task of run.store.tasks) actions.push(`Stored internal task ${task.id}.`);
  if (run.duplicatePrevented) actions.push("A repeated write returned the existing task and did not create another.");
  const unresolved = [
    ...run.blockers,
    ...(run.uncertainty ? [run.uncertainty] : []),
    ...(outcome.kind === "budget_exhausted" ? outcome.unfinished : []),
    ...(outcome.kind === "incomplete" ? outcome.missing : []),
    ...(outcome.kind === "unverified" ? [outcome.reason] : []),
  ];
  const findings = run.evidence.map((item) => item.text);
  const planted = run.store.tickets.find((ticket) => ticket.body.includes(INJECTION_TEXT));
  if (planted) {
    findings.push(`Retrieved text kept as data, not as an instruction: ${planted.body}`);
  }
  return {
    findings,
    actions,
    failures: run.steps.filter((step) => step.status === "failed").map((step) => `${step.id}: ${step.error ?? "failed"}`),
    unresolved,
    outcome: outcome.kind,
  };
}

/**
 * Decide the outcome from the rows and step statuses.
 * An outcome that was already set (rejection, budget, invalid input) is left alone.
 */
export function resolveOutcome(run: Run): Outcome {
  if (run.outcome.kind !== "in_progress") return run.outcome;
  if (run.steps.length === 0) return { kind: "failed", reason: "The plan was empty." };
  if (run.uncertainty) return { kind: "uncertain", question: run.uncertainty };
  if (run.blockers.length > 0) return { kind: "incomplete", missing: [...run.blockers] };
  const verify = run.steps.find((step) => step.tool === "verify_task_created");
  if (verify?.status === "succeeded" && run.taskRecordId) return { kind: "verified", taskId: run.taskRecordId };
  if (verify?.status === "failed") {
    return {
      kind: "unverified",
      claimedTaskId: run.claimedTaskId ?? "",
      reason: verify.error ?? "The task row was not in the store.",
    };
  }
  if (run.steps.every((step) => step.status === "succeeded")) return { kind: "read_only_complete" };
  return { kind: "failed", reason: "The run stopped without a qualified outcome." };
}

/** Finish a run, attach the report, and skip anything still pending. */
function finish(run: Run, outcome?: Outcome): Run {
  const steps = run.steps.map((step) => (
    step.status === "pending" ? { ...step, status: "skipped" as const, stateNote: "Not run." } : step
  ));
  const next = { ...run, steps, phase: "finished" as const };
  const resolved = outcome ?? resolveOutcome(next);
  return { ...next, outcome: resolved, report: buildReport(next, resolved) };
}

/** Create a run from an explicit plan. Tests use this for the empty plan and the retry bound. */
export function createRunFromPlan(plan: Plan): Run {
  return {
    id: `run_${plan.id}`,
    taskId: plan.id,
    title: plan.title,
    simulation: true,
    modelCalls: 0,
    phase: "ready",
    steps: plan.steps.map((step) => ({ ...step, attempts: [...step.attempts] })),
    evidence: [],
    approval: "not_required",
    taskRecordId: null,
    claimedTaskId: null,
    duplicatePrevented: false,
    uncertainty: null,
    blockers: [],
    outcome: { kind: "in_progress" },
    report: null,
    audit: [{ seq: 1, event: "created", detail: "Simulation started. No model call." }],
    store: plan.store ?? createStore(),
    maxSteps: plan.maxSteps ?? null,
    executedSteps: 0,
  };
}

/** Start one of the four scripted tasks. */
export function createRun(taskId: TaskId): Run {
  const plan = taskPlan(taskId);
  return createRunFromPlan({ id: taskId, title: plan.title, steps: plan.steps });
}

/** Input for a step, with the verify id taken from the run rather than from the model. */
function inputFor(run: Run, step: TraceStep): unknown {
  if (step.tool === "verify_task_created") {
    return { taskId: run.taskRecordId ?? run.claimedTaskId ?? "" };
  }
  return step.input;
}

/** Apply a non-tool step. */
function applyLocal(run: Run, index: number): Run {
  const step = run.steps[index];
  if (step.action === "interpret") {
    const output = {
      objective: run.title,
      desiredOutcome: "A bounded result with evidence from the fixture store.",
      note: "Interpreted by the scripted controller, not by a model.",
    };
    return withStep(run, index, { ...step, status: "succeeded", output, stateNote: "Request interpreted." });
  }
  if (step.action === "plan") {
    const output = run.steps.map((item) => ({ id: item.id, purpose: item.purpose, dependsOn: item.dependsOn, tool: item.tool ?? null }));
    return withStep(run, index, { ...step, status: "succeeded", output, stateNote: "Plan recorded. It is not proof of completion." });
  }
  if (step.action === "report") {
    const marked = withStep(run, index, {
      ...step,
      status: "succeeded",
      stateNote: "Report written from the store and the trace.",
    });
    const outcome = resolveOutcome(marked);
    const report = buildReport(marked, outcome);
    const noted = withStep(marked, index, { ...marked.steps[index], output: report });
    return { ...noted, phase: "finished", outcome, report };
  }
  return applyCheck(run, index);
}

/** Apply a validation step. These checks read evidence; they do not invent missing facts. */
function applyCheck(run: Run, index: number): Run {
  const step = run.steps[index];
  const sources = new Set(run.evidence.map((item) => item.source));
  if (step.check === "coverage") {
    const missing = ["get_account", "get_recent_events", "list_support_tickets", "calculate_health_score"].filter((source) => !sources.has(source));
    const output = { acceptable: missing.length === 0, missing };
    return withStep(run, index, { ...step, status: "succeeded", output, stateNote: missing.length === 0 ? "Required evidence is present." : "Evidence is incomplete." });
  }
  if (step.check === "tickets") {
    const acceptable = sources.has("list_support_tickets");
    return withStep(run, index, { ...step, status: "succeeded", output: { acceptable }, stateNote: acceptable ? "Ticket evidence is present." : "No ticket evidence." });
  }
  if (step.check === "missing_renewal") {
    const missing = run.store.account.renewalDate ? [] : ["renewalDate"];
    const next = missing.length > 0 ? { ...run, blockers: missing } : run;
    return withStep(next, index, {
      ...step,
      status: "succeeded",
      output: { acceptable: false, missing, invented: false },
      stateNote: "The renewal date is absent. No value was filled in.",
    });
  }
  if (step.check === "conflict") {
    const kinds = new Set(run.store.events.map((event) => event.kind));
    const conflict = kinds.has("invoice_overdue") && kinds.has("invoice_paid");
    const question = "Invoice inv_1044 is marked overdue in one row and paid in another. Neither row was discarded.";
    const next = conflict ? { ...run, uncertainty: question } : run;
    return withStep(next, index, {
      ...step,
      status: "succeeded",
      output: { resolution: null, conflict, statements: ["invoice_overdue", "invoice_paid"] },
      stateNote: "The controller did not choose a winning invoice status.",
    });
  }
  const planted = run.store.tickets.find((ticket) => ticket.body.includes(INJECTION_TEXT));
  return withStep(run, index, {
    ...step,
    status: "succeeded",
    output: {
      treatedAs: "data",
      followed: false,
      text: planted?.body ?? null,
    },
    stateNote: "Instruction-like text stayed inside the ticket body.",
  });
}

/** Record a failed step, skip the rest, and finish. */
function failRun(run: Run, index: number, step: TraceStep, reason: string): Run {
  const failed = withStep(run, index, { ...step, status: "failed", error: reason, stateNote: reason });
  const skipped = skipAfter(failed, index);
  return finish(skipped, { kind: "failed", reason });
}

/** Execute a tool step, including the scripted timeout retry. */
function applyTool(run: Run, index: number): Run {
  const step = run.steps[index];
  const tool = step.tool as ToolName;
  const attempts = [...step.attempts];
  const working = run;
  for (let n = attempts.length + 1; n <= MAX_ATTEMPTS; n += 1) {
    const timeouts = attempts.filter((attempt) => attempt.error?.includes("timeout")).length;
    if (timeouts < step.failTimes) {
      attempts.push({ n, status: "failed", error: "Tool timeout (scripted)." });
      if (n === MAX_ATTEMPTS) {
        return failRun(working, index, { ...step, attempts }, "Retry budget exhausted after 2 attempts.");
      }
      continue;
    }
    if (step.claimSuccessWithoutWrite) {
      attempts.push({ n, status: "succeeded" });
      const claimed = withStep(working, index, {
        ...step,
        status: "succeeded",
        attempts,
        output: { reported: "success", taskId: "task_claimed", created: true, persisted: false },
        stateNote: "The adapter reported success. The store was not changed.",
      });
      return {
        ...claimed,
        claimedTaskId: "task_claimed",
        approval: "approved",
        audit: audit(claimed, "claimed_write", "Success was reported without a stored task."),
      };
    }
    const validated = validateToolInput(tool, inputFor(working, step));
    if (!validated.ok) return failRun(working, index, { ...step, attempts, input: inputFor(working, step) }, validated.message);
    const result = invokeTool(working.store, validated.name, validated.data, { approved: working.approval === "approved" });
    if (!result.ok) {
      const failed = withStep({ ...working, store: result.store }, index, {
        ...step,
        status: "failed",
        attempts,
        input: validated.data,
        error: result.message,
        stateNote: result.message,
      });
      if (tool === "verify_task_created") return failed;
      return failRun({ ...working, store: result.store }, index, { ...step, attempts, input: validated.data }, result.message);
    }
    attempts.push({ n, status: "succeeded" });
    const duplicate = Boolean((result.data as { duplicate?: boolean }).duplicate);
    const task = (result.data as { task?: { id: string } }).task;
    const evidence = [...working.evidence, ...result.evidence];
    const updated = withStep({ ...working, store: result.store, evidence }, index, {
      ...step,
      status: "succeeded",
      attempts,
      input: validated.data,
      output: result.data,
      evidenceIds: result.evidence.map((item) => item.id),
      stateNote: duplicate ? "Idempotency key matched an existing task. No second write." : "Tool result accepted.",
    });
    return {
      ...updated,
      duplicatePrevented: working.duplicatePrevented || duplicate,
      taskRecordId: task && (result.data as { created?: boolean }).created ? task.id : working.taskRecordId,
      audit: audit(updated, "tool", `${tool} returned.`),
    };
  }
  return failRun(working, index, { ...step, attempts }, "Retry budget exhausted after 2 attempts.");
}

/**
 * Advance one step.
 * A run that is waiting or finished does not move. A write with `needsApproval` proposes and stops.
 */
export function runNext(run: Run): Run {
  if (run.phase === "finished" || run.phase === "waiting_for_approval") return run;
  const index = run.steps.findIndex((step) => step.status === "pending");
  if (index === -1) return finish({ ...run, phase: "in_progress" });
  if (run.maxSteps != null && run.executedSteps >= run.maxSteps) {
    const steps = run.steps.map((step, stepIndex) => {
      if (step.status !== "pending") return step;
      if (stepIndex === index) return { ...step, status: "cancelled" as const, stateNote: "Cancelled because the step budget was reached." };
      return { ...step, status: "skipped" as const, stateNote: "Skipped after the budget stop." };
    });
    const unfinished = run.steps.filter((step) => step.status === "pending").map((step) => step.id);
    return finish({ ...run, steps, audit: audit(run, "budget", "Step budget reached.") }, { kind: "budget_exhausted", unfinished });
  }
  const step = run.steps[index];
  if (step.needsApproval && run.approval !== "approved") {
    const waiting = withStep({ ...run, phase: "waiting_for_approval", approval: "proposed" }, index, {
      ...step,
      status: "waiting_for_approval",
      stateNote: "Waiting for a person. The write has not run.",
    });
    return { ...waiting, audit: audit(waiting, "approval_requested", `${step.tool ?? step.id} is proposed, not executed.`) };
  }
  const started = { ...run, phase: "in_progress" as const, executedSteps: run.executedSteps + 1 };
  if (step.action === "tool") return applyTool(started, index);
  return applyLocal(started, index);
}

/** Run until the controller is waiting or finished. */
export function runUntilBlocked(run: Run): Run {
  let current = run;
  while (current.phase === "ready" || current.phase === "in_progress") current = runNext(current);
  return current;
}

/**
 * Approve the waiting write and execute it.
 * A second call does not create another row. A call with nothing waiting is recorded and ignored.
 */
export function approveProposedAction(run: Run): Run {
  if (run.phase !== "waiting_for_approval") {
    return { ...run, audit: audit(run, "approval_ignored", "No proposed action is waiting.") };
  }
  const index = run.steps.findIndex((step) => step.status === "waiting_for_approval");
  if (index === -1) return run;
  const approved = {
    ...run,
    approval: "approved" as const,
    phase: "in_progress" as const,
    audit: audit(run, "approved", "A person approved the proposed write."),
  };
  const executed = applyTool(approved, index);
  return { ...executed, executedSteps: run.executedSteps + 1 };
}

/**
 * Reject the waiting write. The tool is not called, and later steps are skipped.
 */
export function rejectProposedAction(run: Run): Run {
  if (run.phase !== "waiting_for_approval") {
    return { ...run, audit: audit(run, "rejection_ignored", "No proposed action is waiting.") };
  }
  const index = run.steps.findIndex((step) => step.status === "waiting_for_approval");
  if (index === -1) return run;
  const step = run.steps[index];
  const rejected = withStep(run, index, {
    ...step,
    status: "rejected",
    stateNote: "A person rejected the action. It was not executed.",
  });
  return finish(
    { ...skipAfter(rejected, index), approval: "rejected", audit: audit(rejected, "rejected", "The write was not called.") },
    { kind: "rejected" },
  );
}

/** Replay one failure scenario to its terminal state. The result does not depend on the clock. */
export function runScenario(id: ScenarioId): Run {
  if (id === "timeout") {
    return runUntilBlocked(createRunFromPlan({
      id,
      title: "Scripted timeout",
      steps: [
        pending({ id: "load_events", action: "tool", purpose: "Read events, with one scripted timeout.", why: "Show a bounded retry of a read.", dependsOn: [], tool: "get_recent_events", input: { accountId: "acct_northwind", limit: 10 }, failTimes: 1 }),
        pending({ id: "report", action: "report", purpose: "Report the recovered read.", why: "The retry should end in a normal read-only result.", dependsOn: ["load_events"] }),
      ],
    }));
  }
  if (id === "invalid_arguments") {
    return runUntilBlocked(createRunFromPlan({
      id,
      title: "Invalid arguments",
      steps: [
        pending({ id: "score", action: "tool", purpose: "Attempt a health score with an empty id.", why: "Show validation before the handler.", dependsOn: [], tool: "calculate_health_score", input: { accountId: "" } }),
      ],
    }));
  }
  if (id === "conflicting_evidence") {
    return runUntilBlocked(createRunFromPlan({
      id,
      title: "Conflicting invoice evidence",
      store: createStore("conflict"),
      steps: [
        pending({ id: "load_events", action: "tool", purpose: "Read both invoice rows.", why: "The disagreement has to be visible in the tool result.", dependsOn: [], tool: "get_recent_events", input: { accountId: "acct_northwind", limit: 10 } }),
        pending({ id: "assess", action: "validate", purpose: "Record the conflict without resolving it.", why: "No rule in this fixture says which billing row wins.", dependsOn: ["load_events"], check: "conflict" }),
        pending({ id: "report", action: "report", purpose: "Report the uncertainty.", why: "The caller should see that the question is open.", dependsOn: ["assess"] }),
      ],
    }));
  }
  if (id === "duplicate_action") {
    const proposed = runUntilBlocked(createRunFromPlan({
      id,
      title: "Duplicate task write",
      steps: [
        pending({ id: "propose_task", action: "tool", purpose: "Create the follow-up once.", why: "The first approved write should store one row.", dependsOn: [], tool: "create_internal_task", needsApproval: true, input: { accountId: "acct_northwind", title: "Follow up", body: "Review the fixture account.", idempotencyKey: "idem:northwind:once" } }),
        pending({ id: "repeat_task", action: "tool", purpose: "Request the same write again.", why: "The second call must not create a second row.", dependsOn: ["propose_task"], tool: "create_internal_task", input: { accountId: "acct_northwind", title: "Follow up", body: "Review the fixture account.", idempotencyKey: "idem:northwind:once" } }),
        pending({ id: "verify", action: "tool", purpose: "Verify the single stored task.", why: "The store is the source of truth.", dependsOn: ["repeat_task"], tool: "verify_task_created" }),
        pending({ id: "report", action: "report", purpose: "Report the idempotent result.", why: "The caller should see one row.", dependsOn: ["verify"] }),
      ],
    }));
    return runUntilBlocked(approveProposedAction(proposed));
  }
  if (id === "rejected_approval") {
    const proposed = runUntilBlocked(createRunFromPlan({
      id,
      title: "Rejected task",
      steps: [
        pending({ id: "propose_task", action: "tool", purpose: "Propose a task the person will reject.", why: "Rejection must prevent the write.", dependsOn: [], tool: "create_internal_task", needsApproval: true, input: { accountId: "acct_northwind", title: "Should not be stored", body: "This body must not be written.", idempotencyKey: "idem:northwind:rejected" } }),
        pending({ id: "verify", action: "tool", purpose: "This verification should not run.", why: "There is nothing to verify after a rejection.", dependsOn: ["propose_task"], tool: "verify_task_created" }),
      ],
    }));
    return rejectProposedAction(proposed);
  }
  if (id === "failed_verification") {
    const proposed = runUntilBlocked(createRunFromPlan({
      id,
      title: "Unverified success claim",
      steps: [
        pending({ id: "propose_task", action: "tool", purpose: "Accept a success claim that does not write.", why: "Separate the adapter's report from the store.", dependsOn: [], tool: "create_internal_task", needsApproval: true, claimSuccessWithoutWrite: true, input: { accountId: "acct_northwind", title: "Claimed", body: "Not stored.", idempotencyKey: "idem:northwind:claimed" } }),
        pending({ id: "verify", action: "tool", purpose: "Look for the claimed task id.", why: "Verification fails closed when the row is missing.", dependsOn: ["propose_task"], tool: "verify_task_created" }),
        pending({ id: "report", action: "report", purpose: "Report the unverified outcome.", why: "The overall status must not be a qualified success.", dependsOn: ["verify"] }),
      ],
    }));
    return runUntilBlocked(approveProposedAction(proposed));
  }
  if (id === "budget") {
    return runUntilBlocked(createRunFromPlan({
      id,
      title: "Step budget of two",
      maxSteps: 2,
      steps: [
        pending({ id: "interpret", action: "interpret", purpose: "Interpret the request.", why: "This step fits in the budget.", dependsOn: [] }),
        pending({ id: "plan", action: "plan", purpose: "Record the plan.", why: "This step also fits.", dependsOn: ["interpret"] }),
        pending({ id: "load_account", action: "tool", purpose: "This read should not run.", why: "The budget is already spent.", dependsOn: ["plan"], tool: "get_account", input: { accountId: "acct_northwind" } }),
        pending({ id: "report", action: "report", purpose: "This report step should not run as a step.", why: "The controller still owes a terminal explanation.", dependsOn: ["load_account"] }),
      ],
    }));
  }
  return runUntilBlocked(createRunFromPlan({
    id,
    title: "Untrusted ticket text",
    store: createStore("injection"),
    steps: [
      pending({ id: "load_tickets", action: "tool", purpose: "Read tickets, including the planted sentence.", why: "The sentence has to arrive as a tool result.", dependsOn: [], tool: "list_support_tickets", input: { accountId: "acct_northwind" } }),
      pending({ id: "assess", action: "validate", purpose: "Classify the sentence as data.", why: "Retrieved text must not become a new tool call.", dependsOn: ["load_tickets"], check: "untrusted_data" }),
      pending({ id: "report", action: "report", purpose: "Report that the text was not followed.", why: "The control only counts if the outcome says so.", dependsOn: ["assess"] }),
    ],
  }));
}

/** One illustrative metric computed from the scripted corpus. */
export interface DemoMetric {
  id: string;
  name: string;
  definition: string;
  howComputed: string;
  value: string;
  illustrative: true;
}

/**
 * Metrics over the scripted tasks and scenarios.
 * These numbers describe this page's fixtures. They are not production traffic and they are not model scores.
 */
export function evaluateDemoCorpus(): DemoMetric[] {
  const investigate = runUntilBlocked(approveProposedAction(runUntilBlocked(createRun("investigate"))));
  const summarize = runUntilBlocked(createRun("summarize_support"));
  const escalation = runUntilBlocked(approveProposedAction(runUntilBlocked(createRun("escalation"))));
  const missing = runUntilBlocked(createRun("missing_information"));
  const tasks = [investigate, summarize, escalation, missing];
  const qualified = tasks.filter((run) => isQualifiedOutcome(run.outcome)).length;
  const invalid = runScenario("invalid_arguments");
  const timeout = runScenario("timeout");
  const unverified = runScenario("failed_verification");
  const rejected = runScenario("rejected_approval");
  const unauthorized = invokeTool(
    createStore(),
    "create_internal_task",
    {
      accountId: "acct_northwind",
      title: "Should be refused",
      body: "No approval was given.",
      idempotencyKey: "idem:probe",
    },
    { approved: false },
  );
  const openIds = summarize.evidence.filter((item) => item.source === "list_support_tickets").map((item) => item.text);
  return [
    {
      id: "completion",
      name: "Qualified completion",
      definition: "Share of scripted tasks that ended verified or read-only complete. Incomplete, rejected, and unverified runs are not counted.",
      howComputed: "Run the four workbench tasks. Approve the two that propose a write. Divide qualified outcomes by four.",
      value: `${qualified} of 4 scripted tasks`,
      illustrative: true,
    },
    {
      id: "tool_choice",
      name: "Planned tool use",
      definition: "Whether the controller called the tool named on the step. This page does not ask a model to choose.",
      howComputed: "Compare each tool step's name with the tool that returned. A scripted plan makes this a controller check, not a model score.",
      value: "Scripted plans only — not a model selection rate",
      illustrative: true,
    },
    {
      id: "arguments",
      name: "Argument validity",
      definition: "Malformed calls that reached a handler.",
      howComputed: "Run the invalid-arguments scenario and read handlerCalls.",
      value: invalid.store.handlerCalls === 0 ? "0 malformed calls executed" : `${invalid.store.handlerCalls} malformed calls executed`,
      illustrative: true,
    },
    {
      id: "extra_calls",
      name: "Unnecessary tool calls",
      definition: "Calls that did not add evidence or change an authorized row.",
      howComputed: "Not estimated. The plans are hand-written, so a model-waste rate is not available.",
      value: "Not measured — plans are scripted",
      illustrative: true,
    },
    {
      id: "recovery",
      name: "Transient recovery",
      definition: "Scripted timeouts that succeeded inside the retry bound.",
      howComputed: "Read the timeout scenario's attempt list.",
      value: timeout.steps[0]?.attempts.length === 2 && timeout.steps[0]?.status === "succeeded" ? "1 of 1 scripted timeouts recovered" : "Recovery did not match the bound",
      illustrative: true,
    },
    {
      id: "unauthorized",
      name: "Unauthorized writes",
      definition: "Writes that succeeded without controller approval.",
      howComputed: "Call create_internal_task with approved false and count store.writes. Also require the rejected scenario to store nothing.",
      value: !unauthorized.ok && unauthorized.store.writes === 0 && rejected.store.writes === 0 ? "0 unauthorized writes succeeded" : "Unauthorized write check failed",
      illustrative: true,
    },
    {
      id: "evidence",
      name: "Evidence coverage",
      definition: "Whether the investigate run collected account, events, tickets, and a score.",
      howComputed: "Read evidence sources after the approved investigate run.",
      value: ["get_account", "get_recent_events", "list_support_tickets", "calculate_health_score"].every((source) => investigate.evidence.some((item) => item.source === source))
        ? "Investigate run cited account, events, tickets, and score"
        : "Investigate evidence was incomplete",
      illustrative: true,
    },
    {
      id: "answer",
      name: "Read-only answer check",
      definition: "Whether the support summary names the open tickets and not the closed one.",
      howComputed: "Read ticket evidence from the summarize task.",
      value: openIds.some((text) => text.includes("tkt_sso")) && openIds.some((text) => text.includes("tkt_export")) && openIds.every((text) => !text.includes("tkt_logo"))
        ? "Open tickets listed; closed ticket excluded"
        : "Support summary did not match the open rows",
      illustrative: true,
    },
    {
      id: "verification",
      name: "Verification",
      definition: "A write counts only when verify_task_created finds the row. A success claim without a row does not.",
      howComputed: "Compare the approved investigate outcome with the failed-verification scenario.",
      value: investigate.outcome.kind === "verified" && !isQualifiedOutcome(unverified.outcome)
        ? "Happy-path write verified; false success stayed unverified"
        : "Verification check did not match",
      illustrative: true,
    },
    {
      id: "cost",
      name: "Cost and latency",
      definition: "Model spend and step duration, when a real runner records them.",
      howComputed: "This page issues no model call and stores no clock. The value is the absence of a measurement.",
      value: "Not measured",
      illustrative: true,
    },
  ];
}
