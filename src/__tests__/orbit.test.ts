/**
 * Controller tests for the ORBIT demonstration.
 *
 * Covers the four tasks, the eight failure scenarios, schema rejection, approval,
 * idempotency, and the rule that a missing task row is not a qualified success.
 *
 * Connects to:
 * - src/lib/orbit/simulation.ts, tools.ts, and fixtures.ts.
 */
import { describe, expect, it } from "vitest";
import { scoreHealth, createStore } from "../lib/orbit/fixtures";
import {
  approveProposedAction,
  createRun,
  createRunFromPlan,
  evaluateDemoCorpus,
  isQualifiedOutcome,
  rejectProposedAction,
  runNext,
  runScenario,
  runUntilBlocked,
} from "../lib/orbit/simulation";
import { invokeTool, validateToolInput } from "../lib/orbit/tools";

/** Drive a task to the first stop, approve when it is waiting, then finish. */
function finishApproved(task: "investigate" | "escalation") {
  const waiting = runUntilBlocked(createRun(task));
  expect(waiting.phase).toBe("waiting_for_approval");
  expect(waiting.store.writes).toBe(0);
  return runUntilBlocked(approveProposedAction(waiting));
}

describe("ORBIT controller", () => {
  it("scores the fixture account at 15", () => {
    expect(scoreHealth(createStore()).score).toBe(15);
  });

  it("verifies an approved investigate run and ignores a second approval", () => {
    const done = finishApproved("investigate");
    expect(done.outcome.kind).toBe("verified");
    expect(done.store.writes).toBe(1);
    expect(done.modelCalls).toBe(0);
    expect(isQualifiedOutcome(done.outcome)).toBe(true);
    const again = approveProposedAction(done);
    expect(again.store.writes).toBe(1);
    expect(again.audit[again.audit.length - 1]?.event).toBe("approval_ignored");
  });

  it("does not execute a rejected escalation", () => {
    const waiting = runUntilBlocked(createRun("escalation"));
    const rejected = rejectProposedAction(waiting);
    expect(rejected.outcome.kind).toBe("rejected");
    expect(rejected.store.tasks).toHaveLength(0);
    expect(rejected.store.writes).toBe(0);
    expect(isQualifiedOutcome(rejected.outcome)).toBe(false);
    expect(runNext(rejected)).toBe(rejected);
    const ignored = rejectProposedAction(createRun("summarize_support"));
    expect(ignored.audit[ignored.audit.length - 1]?.event).toBe("rejection_ignored");
  });

  it("completes the read-only support summary and stops when the renewal date is missing", () => {
    const summary = runUntilBlocked(createRun("summarize_support"));
    expect(summary.outcome.kind).toBe("read_only_complete");
    const open = summary.evidence.filter((item) => item.source === "list_support_tickets").map((item) => item.text).join(" ");
    expect(open).toContain("tkt_sso");
    expect(open).toContain("tkt_export");
    expect(open).not.toContain("tkt_logo");
    const missing = runUntilBlocked(createRun("missing_information"));
    expect(missing.outcome).toMatchObject({ kind: "incomplete", missing: ["renewalDate"] });
    expect(missing.store.writes).toBe(0);
  });

  it("rejects unknown tools and malformed payloads before the handler", () => {
    expect(validateToolInput("drop_table", {}).ok).toBe(false);
    const malformed = validateToolInput("calculate_health_score", { accountId: "acct_northwind", approved: true });
    expect(malformed.ok).toBe(false);
    const invalid = runScenario("invalid_arguments");
    expect(invalid.outcome.kind).toBe("failed");
    expect(invalid.store.handlerCalls).toBe(0);
  });

  it("refuses a write that the payload tries to authorize", () => {
    const refused = invokeTool(
      createStore(),
      "create_internal_task",
      {
        accountId: "acct_northwind",
        title: "No",
        body: "No approval.",
        idempotencyKey: "idem:probe",
      },
      { approved: false },
    );
    expect(refused.ok).toBe(false);
    expect(refused.store.writes).toBe(0);
  });

  it("retries a scripted timeout once and exhausts a longer failure", () => {
    const recovered = runScenario("timeout");
    expect(recovered.steps[0]?.attempts).toHaveLength(2);
    expect(recovered.steps[0]?.status).toBe("succeeded");
    expect(recovered.store.handlerCalls).toBe(1);
    const exhausted = runUntilBlocked(createRunFromPlan({
      id: "exhaust",
      title: "Too many timeouts",
      steps: [{
        ...recovered.steps[0],
        id: "load_events",
        status: "pending",
        attempts: [],
        failTimes: 5,
        output: undefined,
        error: undefined,
      }],
    }));
    expect(exhausted.outcome.kind).toBe("failed");
    expect(exhausted.store.handlerCalls).toBe(0);
  });

  it("reports a conflict without choosing a winner", () => {
    const conflict = runScenario("conflicting_evidence");
    expect(conflict.outcome.kind).toBe("uncertain");
    expect(JSON.stringify(conflict.steps.find((step) => step.id === "assess")?.output)).toContain("\"resolution\":null");
    expect(isQualifiedOutcome(conflict.outcome)).toBe(false);
  });

  it("stores one task when the same write is requested twice", () => {
    const duplicate = runScenario("duplicate_action");
    expect(duplicate.store.tasks).toHaveLength(1);
    expect(duplicate.store.writes).toBe(1);
    expect(duplicate.duplicatePrevented).toBe(true);
    expect(duplicate.outcome.kind).toBe("verified");
  });

  it("does not treat a success claim as verification", () => {
    const unverified = runScenario("failed_verification");
    expect(unverified.store.tasks).toHaveLength(0);
    expect(unverified.outcome.kind).toBe("unverified");
    expect(isQualifiedOutcome(unverified.outcome)).toBe(false);
    expect(runScenario("rejected_approval").store.writes).toBe(0);
  });

  it("stops at the step budget and treats planted instructions as data", () => {
    const budget = runScenario("budget");
    expect(budget.outcome.kind).toBe("budget_exhausted");
    if (budget.outcome.kind === "budget_exhausted") expect(budget.outcome.unfinished.length).toBeGreaterThan(0);
    expect(budget.steps.some((step) => step.status === "cancelled")).toBe(true);
    expect(budget.steps.some((step) => step.status === "skipped")).toBe(true);
    const untrusted = runScenario("untrusted_output");
    expect(JSON.stringify(untrusted.report)).toContain("Ignore previous instructions");
    expect(untrusted.store.writes).toBe(0);
    expect(untrusted.steps.every((step) => step.tool !== "draft_notification")).toBe(true);
  });

  it("fails an empty plan", () => {
    const empty = runNext(createRunFromPlan({ id: "empty", title: "Empty", steps: [] }));
    expect(empty.outcome).toMatchObject({ kind: "failed", reason: "The plan was empty." });
  });

  it("computes illustrative metrics without counting unsafe completions", () => {
    const metrics = evaluateDemoCorpus();
    expect(metrics.find((metric) => metric.id === "completion")?.value).toBe("3 of 4 scripted tasks");
    expect(metrics.find((metric) => metric.id === "cost")?.value).toBe("Not measured");
    expect(metrics.every((metric) => metric.illustrative)).toBe(true);
  });
});
