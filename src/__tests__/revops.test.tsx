/**
 * Tests the REVFLOW simulation and the /pow/revops-engineering page.
 *
 * The engine tests walk the branches a visitor can reach and the ones the failure
 * lab reaches. The page test drives the workbench through the browser controls.
 *
 * Connects to:
 * - src/lib/revops/engine.ts, checks.ts, and src/pages/RevopsPowPage.tsx.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { ThemeProvider } from "../contexts/ThemeContext";
import { revopsNode } from "../content/revopsPow";
import { RAW_RECORDS, REPS } from "../lib/revops/fixtures";
import { runRevopsChecks, allTrue } from "../lib/revops/checks";
import {
  actionFromControl,
  applyCrmWrite,
  applyEnrichmentChoices,
  applyResolutions,
  buildMetrics,
  compareRecords,
  createFollowUp,
  daysBeforeAsOf,
  filterRecords,
  findDuplicatePairs,
  initialWorkbench,
  isLifecycleDowngrade,
  isSyntacticallyValidEmail,
  normalizeAll,
  normalizeScoreWeights,
  presentRecords,
  proposeEnrichment,
  reconcileAggregate,
  repName,
  routeRecord,
  runFailure,
  runWorkflow,
  scoreRecord,
  similarCompany,
  workbenchReducer,
} from "../lib/revops/engine";
import type { CanonicalRecord, RecordView } from "../lib/revops/types";
import { CheckMark } from "../pages/RevopsPowPage";

/** A normalized fixture row with overrides. */
function row(id: string, patch: Partial<CanonicalRecord> = {}): CanonicalRecord {
  const found = normalizeAll(RAW_RECORDS).find((record) => record.id === id);
  if (!found) throw new Error(id);
  return { ...found, ...patch };
}

/** Wraps a canonical row as a view. */
function view(record: CanonicalRecord): RecordView {
  return { ...record, mergedFrom: [], decisions: [] };
}

/** Engine behavior that the workbench and the failure lab share. */
describe("revops engine", () => {
  it("passes the checks the page prints", () => {
    const checks = runRevopsChecks();
    expect(checks.every((check) => check.passed)).toBe(true);
    expect(checks.map((check) => check.id)).toContain("crm-gate");
    expect(allTrue([true, true])).toBe(true);
    expect(allTrue([true, false])).toBe(false);
  });

  it("normalizes syntax, enums, and blanks without dropping rows", () => {
    expect(isSyntacticallyValidEmail("a@b")).toBe(false);
    expect(isSyntacticallyValidEmail("a@b.c")).toBe(true);
    expect(similarCompany("", "Northwind")).toBe(false);
    expect(similarCompany("Northwind Ledger", "North Wind Ledger")).toBe(true);
    expect(daysBeforeAsOf("nope")).toBeNull();
    const pebble = row("csv-pebble");
    expect(pebble.issues.some((issue) => issue.code === "invalid_enum")).toBe(true);
    expect(pebble.issues.some((issue) => issue.code === "invalid_syntax")).toBe(true);
    const hello = row("signup-hello");
    expect(hello.issues.some((issue) => issue.code === "generic_inbox")).toBe(true);
    expect(hello.issues.some((issue) => issue.code === "missing")).toBe(true);
  });

  it("refuses a domain-only merge and merges an exact email after a click", () => {
    const records = normalizeAll(RAW_RECORDS);
    const pairs = findDuplicatePairs(records);
    const account = pairs.find((pair) => pair.kind === "account");
    const contact = pairs.find((pair) => pair.autoMergeAllowed);
    expect(account).toBeTruthy();
    expect(contact).toBeTruthy();
    expect(compareRecords(records[0], records[0])).toBeNull();
    const refused = applyResolutions(records, pairs, { [account!.id]: "merge" });
    expect(refused.refused).toContain(account!.id);
    const merged = applyResolutions(records, pairs, { [contact!.id]: "merge" });
    expect(merged.views.some((item) => item.mergedFrom.length > 0)).toBe(true);
    expect(merged.views.length).toBeLessThan(records.length);
  });

  it("keeps a stale value unless the visitor accepts it", () => {
    const priya = view(row("web-priya"));
    const proposal = proposeEnrichment(priya).find((item) => item.field === "employeeRange");
    expect(proposal?.recommendation).toBe("keep");
    const kept = applyEnrichmentChoices(priya, { [`${priya.id}:employeeRange`]: "keep" });
    expect(kept.employeeRange).toBe(priya.employeeRange);
    const accepted = applyEnrichmentChoices(priya, { [`${priya.id}:employeeRange`]: "accept" });
    expect(accepted.employeeRange).toBe("11-50");
    expect(proposeEnrichment(row("web-noah"))[0].reliability).toBe("failed");
    expect(proposeEnrichment(row("referral-harbor"))[0].reliability).toBe("rate_limited");
    expect(proposeEnrichment(row("signup-chris"))[0].reliability).toBe("unavailable");
    expect(proposeEnrichment(row("csv-north-wind"))[0].reliability).toBe("unavailable");
    const kite = proposeEnrichment(row("csv-elena")).find((item) => item.field === "industry");
    expect(kite?.recommendation).toBe("accept");
  });

  it("splits the score and changes fit when the weights change", () => {
    const theo = row("referral-theo");
    const low = scoreRecord(theo, normalizeScoreWeights(0.2, 0.1));
    const high = scoreRecord(theo, normalizeScoreWeights(0.7, 0.5));
    expect(low.fit).not.toBe(high.fit);
    const sparse = row("csv-elena", { country: "", lastActivity: "" });
    expect(scoreRecord(sparse, normalizeScoreWeights(Number.NaN, Number.NaN)).band).toBe("Low confidence");
    expect(scoreRecord(row("csv-elena"), normalizeScoreWeights(0.5, 0.3)).band).toBe("Deprioritize");
    expect(scoreRecord(row("referral-theo"), normalizeScoreWeights(0.5, 0.3)).intent).toBe(100);
  });

  it("routes with explicit review and unassigned outcomes", () => {
    const weights = normalizeScoreWeights(0.5, 0.3);
    expect(routeRecord(row("web-priya"), scoreRecord(row("web-priya"), weights)).finalOwner).toBe("sam");
    expect(routeRecord(row("referral-theo"), scoreRecord(row("referral-theo"), weights)).finalOwner).toBe("leo");
    expect(routeRecord(row("csv-elena"), scoreRecord(row("csv-elena"), weights)).outcome).toBe("unassigned");
    expect(routeRecord(row("referral-harbor"), scoreRecord(row("referral-harbor"), weights)).outcome).toBe("blocked");
    expect(routeRecord(row("signup-chris"), scoreRecord(row("signup-chris"), weights)).outcome).toBe("review");
    const thin = row("referral-theo", { intent: "", employeeRange: "", industry: "", seniority: "", lastActivity: "" });
    expect(routeRecord(thin, scoreRecord(thin, weights)).outcome).toBe("review");
    const owned = row("referral-theo", { ownerHint: "leo" });
    expect(routeRecord(owned, scoreRecord(owned, weights)).rules.find((rule) => rule.applied)?.id).toBe("existing_owner");
    const ownedThin = row("referral-theo", {
      ownerHint: "leo",
      intent: "",
      employeeRange: "",
      industry: "",
      seniority: "",
      lastActivity: "",
    });
    expect(routeRecord(ownedThin, scoreRecord(ownedThin, weights)).outcome).toBe("review");
    const available = REPS.map((rep) => (rep.id === "noor" ? { ...rep, available: true } : rep));
    const enterprise = row("signup-chris", { ownerHint: "", country: "Germany" });
    expect(routeRecord(enterprise, scoreRecord(enterprise, weights), available).finalOwner).toBe("noor");
    const quietSam = REPS.map((rep) => (rep.id === "sam" ? { ...rep, available: false } : rep));
    const quietPriya = routeRecord(row("web-priya"), scoreRecord(row("web-priya"), weights), quietSam);
    expect(quietPriya.outcome).toBe("review");
    expect(quietPriya.finalOwner).toBeNull();
    expect(quietPriya.suggestedOwner).toBe("sam");
    const noCountry = row("referral-theo", { country: "", industry: "Logistics", employeeRange: "51-200" });
    expect(routeRecord(noCountry, scoreRecord(noCountry, weights)).outcome).toBe("unassigned");
    expect(repName(null)).toBe("Unassigned");
    expect(repName("missing")).toBe("missing");
  });

  it("blocks, conflicts, retries, and deduplicates CRM writes and tasks", () => {
    const theo = row("referral-theo");
    expect(applyCrmWrite([], [], theo, "leo", false).event.status).toBe("blocked");
    const created = applyCrmWrite([], [], theo, "leo", true);
    expect(created.event.status).toBe("applied");
    expect(applyCrmWrite(created.store, created.events, theo, "leo", true).event.status).toBe("duplicate_prevented");
    const older = row("referral-theo", { lifecycle: "lead" });
    const ahead = [{ ...created.store[0], lifecycle: "sql" }];
    expect(applyCrmWrite(ahead, [], older, "leo", true).event.status).toBe("conflict");
    expect(isLifecycleDowngrade("closed_won", "lead")).toBe(true);
    expect(isLifecycleDowngrade("closed_lost", "lead")).toBe(true);
    expect(isLifecycleDowngrade("", "lead")).toBe(false);
    expect(isLifecycleDowngrade("lead", "mystery")).toBe(false);
    const imani = row("event-imani");
    let events = applyCrmWrite([], [], imani, "leo", true).events;
    events = applyCrmWrite([], events, imani, "leo", true).events;
    expect(applyCrmWrite([], events, imani, "leo", true).event.status).toBe("failed");
    expect(applyCrmWrite([], [], row("web-noah"), "leo", true).event.status).toBe("partial");
    expect(createFollowUp(createFollowUp([], "a", "leo").tasks, "a", "leo").status).toBe("duplicate_prevented");
  });

  it("runs workflows until they wait, fail, or finish once", () => {
    const weights = normalizeScoreWeights(0.5, 0.3);
    const theo = view(row("referral-theo"));
    const score = scoreRecord(theo, weights);
    const route = routeRecord(theo, score);
    const waiting = runWorkflow(theo, score, route, false, [], [], [], 0);
    expect(waiting.run.status).toBe("waiting_for_approval");
    const done = runWorkflow(theo, score, route, true, [], [], [], 0);
    expect(done.run.status).toBe("completed");
    const again = runWorkflow(theo, score, route, true, done.store, done.events, done.tasks, 1);
    expect(again.run.steps.find((step) => step.id === "task")?.detail).toMatch(/already exists/);
    const harbor = view(row("referral-harbor"));
    expect(runWorkflow(harbor, scoreRecord(harbor, weights), routeRecord(harbor, scoreRecord(harbor, weights)), true, [], [], [], 0).run.status).toBe("failed");
    const noah = view(row("web-noah"));
    expect(runWorkflow(noah, scoreRecord(noah, weights), routeRecord(noah, scoreRecord(noah, weights)), true, [], [], [], 0).run.status).toBe("failed");
    const hello = view(row("signup-hello"));
    const helloRoute = routeRecord(hello, scoreRecord(hello, weights));
    expect(runWorkflow({ ...hello, issues: hello.issues.filter((issue) => issue.code !== "missing") }, scoreRecord(hello, weights), helloRoute, true, [], [], [], 0).run.steps.some((step) => step.status === "waiting_for_approval")).toBe(true);
  });

  it("computes metrics, reconciliation, and every failure scenario", () => {
    expect(buildMetrics([], [], [], [])[0].value).toBe("n/a");
    expect(reconcileAggregate(2, 2, "Rows").matches).toBe(true);
    for (const id of ["duplicate-event", "rate-limit", "ownership", "incomplete", "stale", "partial", "duplicate-task", "discrepancy", "nope"]) {
      expect(runFailure(id).outcome.length).toBeGreaterThan(0);
    }
  });

  it("reduces workbench actions", () => {
    let state = initialWorkbench();
    expect(workbenchReducer(state, { type: "noop" })).toBe(state);
    state = workbenchReducer(state, { type: "query", query: "oak" });
    expect(filterRecords(presentRecords(state).views, "all", "zzzz").length).toBe(0);
    state = workbenchReducer(state, { type: "source", source: "event" });
    state = workbenchReducer(state, { type: "weights", which: "size", value: 0.4 });
    state = workbenchReducer(state, { type: "weights", which: "industry", value: 0.6 });
    state = workbenchReducer(state, { type: "confirm", value: true });
    state = workbenchReducer(state, { type: "select", id: "missing" });
    state = workbenchReducer(state, { type: "select", id: "referral-theo" });
    state = workbenchReducer(state, { type: "resolve", pairId: "missing", action: "merge" });
    const account = presentRecords(state).pairs.find((pair) => !pair.autoMergeAllowed);
    state = workbenchReducer(state, { type: "resolve", pairId: account!.id, action: "merge" });
    expect(state.notice).toMatch(/not merged/);
    const contact = presentRecords(state).pairs.find((pair) => pair.autoMergeAllowed);
    state = workbenchReducer(state, { type: "resolve", pairId: contact!.id, action: "separate" });
    state = workbenchReducer(state, { type: "enrich", recordId: "referral-theo", field: "industry", choice: "keep" });
    state = workbenchReducer(state, { type: "apply-crm" });
    expect(state.events.length).toBeGreaterThan(0);
    state = workbenchReducer(state, { type: "run-workflow" });
    state = workbenchReducer(state, { type: "failure", id: "partial" });
    state = workbenchReducer(state, { type: "run-failure" });
    expect(state.failureTrace?.id).toBe("partial");
    state = workbenchReducer(state, { type: "metric", id: "duplicates" });
    state = workbenchReducer(state, { type: "clear-metric" });
    state = workbenchReducer(state, { type: "architecture", id: "crm" });
    state = workbenchReducer(state, { type: "commit-queue" });
    expect(state.rejectedIds).toContain("web-mira-dup");
    state = workbenchReducer(state, { type: "commit-queue" });
    expect(state.notice).toMatch(/No duplicate/);
    expect(workbenchReducer(state, { type: "reset" }).selectedId).toBe("web-mira");
    expect(actionFromControl({}, "", false).type).toBe("noop");
    expect(actionFromControl({ act: "select" }, "", false)).toMatchObject({ id: "" });
    expect(actionFromControl({ act: "source" }, "", false)).toMatchObject({ source: "all" });
    expect(actionFromControl({ act: "resolve" }, "", false)).toMatchObject({ pairId: "", action: "review" });
    expect(actionFromControl({ act: "enrich" }, "", false)).toMatchObject({ field: "", choice: "accept" });
    expect(actionFromControl({ act: "metric" }, "", false)).toMatchObject({ id: "" });
    expect(actionFromControl({ act: "architecture", id: "crm" }, "", false)).toMatchObject({ type: "architecture", id: "crm" });
    expect(actionFromControl({ act: "weights", which: "size" }, "0.2", false).type).toBe("weights");
    expect(actionFromControl({ act: "enrich", choice: "keep" }, "", false)).toMatchObject({ choice: "keep" });
    expect(revopsNode("nope").id).toBe("ingestion");
    expect(revopsNode("routing").name).toBe("Routing");
  });
});

/** Renders the route and exercises the controls a visitor can reach. */
describe("revops page", () => {
  it("renders the workbench and runs a simulated write", async () => {
    render(
      <HelmetProvider>
        <ThemeProvider>
          <MemoryRouter initialEntries={["/pow/revops-engineering"]}>
            <AppRoutes />
          </MemoryRouter>
        </ThemeProvider>
      </HelmetProvider>,
    );
    expect(await screen.findByRole("heading", { level: 1, name: "Engineer the system behind the revenue." }, { timeout: 15000 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "RevOps" })).toHaveAttribute("href", "/pow/revops-engineering");
    fireEvent.click(document.querySelector('[data-id="web-mira-dup"]') as HTMLButtonElement);
    fireEvent.click(screen.getByRole("button", { name: "Commit queue with idempotency" }));
    expect(screen.getByText(/Rejected duplicate deliveries: web-mira-dup/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search company or contact"), { target: { value: "zzzz" } });
    expect(screen.getByText("No rows match the current filter.")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search company or contact"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Acquisition source"), { target: { value: "referral" } });
    fireEvent.click(screen.getByRole("button", { name: "Harbor Grid" }));
    fireEvent.click(screen.getAllByRole("button", { name: /Keep separate/ })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /Flag for review/ })[0]);
    const merge = screen.getAllByRole("button", { name: /^Merge / }).find((button) => !button.hasAttribute("disabled"));
    expect(merge).toBeTruthy();
    fireEvent.click(merge as HTMLButtonElement);
    fireEvent.change(screen.getByLabelText("Acquisition source"), { target: { value: "all" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Northwind Ledger" })[0]);
    expect(screen.getAllByText(/kept "/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole("button", { name: /^Accept / })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /^Keep current / })[0]);
    fireEvent.change(screen.getByLabelText(/Industry weight/), { target: { value: "0.6" } });
    fireEvent.change(screen.getByLabelText(/Size weight/), { target: { value: "0.2" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /confirm this simulated write/i }));
    fireEvent.click(screen.getByRole("button", { name: "Apply simulated CRM change" }));
    expect(screen.getByRole("status").textContent).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Run workflow/ }));
    fireEvent.change(screen.getByLabelText("Scenario"), { target: { value: "duplicate-task" } });
    fireEvent.click(screen.getByRole("button", { name: "Run failure scenario" }));
    expect(screen.getAllByText("Duplicate follow-up task").length).toBeGreaterThan(1);
    fireEvent.click(screen.getByRole("button", { name: /Contact duplicate rate/ }));
    fireEvent.click(screen.getByRole("button", { name: "Clear metric filter" }));
    fireEvent.click(screen.getByRole("button", { name: "Commit queue with idempotency" }));
    fireEvent.click(screen.getByRole("button", { name: "Routing" }));
    expect(screen.getByText(/Failure mode/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset simulation" }));
    expect(screen.getByText("No workflow has been started.")).toBeInTheDocument();
    render(<CheckMark passed={false} />);
    expect(screen.getByText("Failed")).toBeInTheDocument();
  }, 60000);
});
