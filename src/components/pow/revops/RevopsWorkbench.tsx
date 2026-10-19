/**
 * Interactive REVFLOW workbench.
 *
 * The visitor filters synthetic prospects, resolves duplicates, accepts or keeps
 * enrichment, changes score weights, previews a CRM write, runs a workflow, and
 * opens the rows behind a metric. State stays in the reducer. No request leaves
 * the browser.
 *
 * Connects to:
 * - src/lib/revops/engine.ts and fixtures.ts.
 * - src/pages/RevopsPowPage.tsx renders it inside the proof-of-work page.
 */
import { useReducer, type ChangeEvent, type MouseEvent } from "react";
import { SOURCE_LABELS } from "../../../lib/revops/fixtures";
import {
  actionFromControl,
  buildMetrics,
  countBy,
  filterRecords,
  findCrmAccount,
  initialWorkbench,
  normalizeScoreWeights,
  presentRecords,
  proposeEnrichment,
  repName,
  routeRecord,
  scoreRecord,
  selectedRecord,
  simulationFor,
  workbenchReducer,
} from "../../../lib/revops/engine";
import type { SourceId } from "../../../lib/revops/types";

/** Shared control handler for selects, text fields, ranges, and the confirmation checkbox. */
function onField(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
  const checked = event.currentTarget instanceof HTMLInputElement ? event.currentTarget.checked : false;
  return actionFromControl(event.currentTarget.dataset, event.currentTarget.value, checked);
}

/** The local revenue-operations simulation. */
export default function RevopsWorkbench() {
  const [state, dispatch] = useReducer(workbenchReducer, undefined, initialWorkbench);
  const { baseline, pairs, views } = presentRecords(state);
  const selected = selectedRecord(state, views);
  const weights = normalizeScoreWeights(state.industryWeight, state.sizeWeight);
  const score = scoreRecord(selected, weights);
  const routing = routeRecord(selected, score);
  const proposals = proposeEnrichment(selected);
  const metrics = buildMetrics(views, pairs, state.runs, state.events);
  const metric = metrics.find((item) => item.id === state.metricId);
  const sourceFiltered = filterRecords(views, state.source, state.query);
  const visible = metric
    ? sourceFiltered.filter((record) => metric.recordIds.includes(record.id))
    : sourceFiltered;
  const raw = state.raw.find((row) => row.id === selected.id);
  const crm = findCrmAccount(state.crm, selected);
  const stages = ["inquiry", "lead", "mql", "sql", "opportunity", "closed_won", "closed_lost"];
  const stageCounts = countBy(views, "lifecycle");
  const sourceCounts = countBy(views, "source");
  const missingSource = views.filter((record) => !record.source).length;
  const lastRun = state.runs[state.runs.length - 1];

  /** Dispatches a field control. */
  const change = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    dispatch(onField(event));
  };
  /** Dispatches a button. */
  const click = (event: MouseEvent<HTMLButtonElement>) => {
    dispatch(actionFromControl(event.currentTarget.dataset, "", false));
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-sm text-ink">
          <span className="label mb-1 block">Acquisition source</span>
          <select data-act="source" value={state.source} onChange={change} className="border border-rule bg-paper px-3 py-2">
            <option value="all">All sources</option>
            {(Object.keys(SOURCE_LABELS) as SourceId[]).map((source) => (
              <option key={source} value={source}>
                {SOURCE_LABELS[source]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-ink">
          <span className="label mb-1 block">Search company or contact</span>
          <input
            data-act="query"
            value={state.query}
            onChange={change}
            className="border border-rule bg-paper px-3 py-2"
            placeholder="Northwind"
          />
        </label>
        <button type="button" data-act="commit-queue" onClick={click} className="btn-secondary">
          Commit queue with idempotency
        </button>
        <button type="button" data-act="reset" onClick={click} className="btn-ghost">
          Reset simulation
        </button>
      </div>
      {state.notice ? (
        <p role="status" className="border border-rule bg-paper-elevated px-4 py-3 text-sm text-ink">
          {state.notice}
        </p>
      ) : (
        <p className="text-sm text-ink-faint">No action yet. Select a row and run one step.</p>
      )}
      {state.rejectedIds.length > 0 && (
        <p className="text-sm text-ink-muted">Rejected duplicate deliveries: {state.rejectedIds.join(", ")}.</p>
      )}

      <div className="overflow-x-auto border border-rule">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <caption className="px-3 py-2 text-left text-ink-muted">
            {metric ? `Rows behind ${metric.label}. ${visible.length} shown.` : `${visible.length} synthetic prospects.`}
          </caption>
          <thead className="border-b border-rule text-ink-faint">
            <tr>
              <th scope="col" className="px-3 py-2 font-normal">Company</th>
              <th scope="col" className="px-3 py-2 font-normal">Contact</th>
              <th scope="col" className="px-3 py-2 font-normal">Source</th>
              <th scope="col" className="px-3 py-2 font-normal">Issues</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-ink-muted">
                  No rows match the current filter.
                </td>
              </tr>
            ) : (
              visible.map((record) => (
                <tr key={record.id} className={record.id === selected.id ? "bg-accent-soft/40" : undefined}>
                  <td className="px-3 py-2">
                    <button type="button" data-act="select" data-id={record.id} onClick={click} className="link-underline text-left">
                      {record.accountName || "(missing company)"}
                    </button>
                  </td>
                  <td className="px-3 py-2">{record.contactName || "(missing contact)"}</td>
                  <td className="px-3 py-2">{SOURCE_LABELS[record.source]}</td>
                  <td className="px-3 py-2">{record.issues.length}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {metric && (
        <button type="button" data-act="clear-metric" onClick={click} className="btn-secondary">
          Clear metric filter
        </button>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-xl text-ink">Inbound fields</h3>
          <dl className="mt-3 space-y-1 text-sm">
            {Object.entries(raw!.fields).map(([key, value]) => (
              <div key={key} className="grid grid-cols-[10rem_1fr] gap-2 border-t border-rule py-1">
                <dt className="font-mono text-ink-faint">{key}</dt>
                <dd>{value || "(blank)"}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h3 className="font-display text-xl text-ink">Canonical prospect</h3>
          <dl className="mt-3 space-y-1 text-sm">
            {(
              [
                ["account", selected.accountName],
                ["domain", selected.domain],
                ["contact", selected.contactName],
                ["email", selected.email],
                ["title", selected.jobTitle],
                ["seniority", selected.seniority],
                ["employees", selected.employeeRange],
                ["industry", selected.industry],
                ["country", selected.country],
                ["intent", selected.intent],
                ["stage", selected.lifecycle],
                ["activity", selected.lastActivity],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="grid grid-cols-[10rem_1fr] gap-2 border-t border-rule py-1">
                <dt className="font-mono text-ink-faint">{label}</dt>
                <dd>{value || "(blank)"}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-ink-muted">
            Merged from: {selected.mergedFrom.join(", ") || "none"}.
          </p>
          {selected.issues.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm">
              {selected.issues.map((issue) => (
                <li key={`${issue.field}-${issue.code}`} className="border border-rule px-3 py-2">
                  <span className="font-mono text-xs text-ink-faint">{issue.code}</span>
                  <span className="mt-1 block">{issue.message}</span>
                </li>
              ))}
            </ul>
          )}
          {selected.unmapped.length > 0 && (
            <p className="mt-3 text-sm text-ink-muted">
              Unmapped keys kept on the row: {selected.unmapped.map((field) => field.key).join(", ")}.
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl text-ink">Duplicate resolution</h3>
        <p className="mt-2 max-w-measure text-sm text-ink-muted">
          Scores are heuristic rule totals, not probabilities. A domain match never merges two contacts.
        </p>
        <ul className="mt-4 space-y-4">
          {pairs.map((pair) => (
            <li key={pair.id} className="border border-rule p-4">
              <p className="text-sm text-ink">
                {pair.leftId} and {pair.rightId} · {pair.kind} · heuristic {pair.heuristicScore}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{pair.explanation}</p>
              <ul className="mt-2 space-y-1 text-sm text-ink-muted">
                {pair.reasons.map((reason) => (
                  <li key={reason.rule}>
                    {reason.rule} (+{reason.points}): {reason.detail}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  data-act="resolve"
                  data-pair={pair.id}
                  data-choice="merge"
                  onClick={click}
                  disabled={!pair.autoMergeAllowed}
                  className="btn-secondary disabled:opacity-40"
                >
                  Merge {pair.leftId}
                </button>
                <button type="button" data-act="resolve" data-pair={pair.id} data-choice="separate" onClick={click} className="btn-secondary">
                  Keep separate
                </button>
                <button type="button" data-act="resolve" data-pair={pair.id} data-choice="review" onClick={click} className="btn-secondary">
                  Flag for review
                </button>
              </div>
              <p className="mt-2 text-xs text-ink-faint">
                Decision: {state.resolutions[pair.id] ?? "none"}.
                {pair.autoMergeAllowed ? " Merge is available because the contact rules cleared the bar." : " Merge stays disabled."}
              </p>
            </li>
          ))}
        </ul>
        {selected.decisions.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-ink-muted">
            {selected.decisions.map((decision) => (
              <li key={`${decision.field}-${decision.dropped}`}>
                {decision.field}: kept "{decision.kept || "(blank)"}", dropped "{decision.dropped || "(blank)"}". {decision.reason}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="font-display text-xl text-ink">Simulated enrichment</h3>
        <ul className="mt-4 space-y-3">
          {proposals.map((proposal) => (
            <li key={proposal.field} className="border border-rule p-4 text-sm">
              <p className="text-ink">
                {proposal.field}: current "{proposal.current || "(blank)"}", proposed "{proposal.proposed || "(none)"}"
              </p>
              <p className="mt-1 text-ink-muted">
                {proposal.source} · {proposal.observedAt || "no timestamp"} · {proposal.reliability} · {proposal.freshness}
                {proposal.conflict ? " · conflict" : ""} · recommendation {proposal.recommendation}
              </p>
              <p className="mt-1 text-ink-muted">{proposal.note}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  data-act="enrich"
                  data-id={selected.id}
                  data-field={proposal.field}
                  data-choice="accept"
                  onClick={click}
                  className="btn-secondary"
                >
                  Accept {proposal.field}
                </button>
                <button
                  type="button"
                  data-act="enrich"
                  data-id={selected.id}
                  data-field={proposal.field}
                  data-choice="keep"
                  onClick={click}
                  className="btn-secondary"
                >
                  Keep current {proposal.field}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-display text-xl text-ink">Qualification</h3>
        <p className="mt-2 max-w-measure text-sm text-ink-muted">{score.formula}</p>
        <p className="mt-3 text-sm text-ink">
          Illustrative band: {score.band}. Fit {score.fit}. Intent {score.intent}. Engagement {score.engagement}. Confidence {score.confidence}.
        </p>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="text-sm">
            Industry weight {weights.industry.toFixed(2)}
            <input
              data-act="weights"
              data-which="industry"
              type="range"
              min="0.2"
              max="0.7"
              step="0.05"
              value={state.industryWeight}
              onChange={change}
              className="mt-1 block"
            />
          </label>
          <label className="text-sm">
            Size weight {weights.size.toFixed(2)}
            <input
              data-act="weights"
              data-which="size"
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={state.sizeWeight}
              onChange={change}
              className="mt-1 block"
            />
          </label>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-ink-muted">
          {score.contributions.map((line) => (
            <li key={line.dimension}>
              {line.label}: {line.points}. {line.note}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-display text-xl text-ink">Routing</h3>
        <p className="mt-2 text-sm text-ink">{routing.explanation}</p>
        <p className="mt-1 text-sm text-ink-muted">
          Outcome {routing.outcome}. Final owner {repName(routing.finalOwner)}. Suggested {repName(routing.suggestedOwner)}.
        </p>
        <ol className="mt-4 space-y-2">
          {routing.rules.map((rule) => (
            <li key={rule.id} className="border border-rule px-3 py-2 text-sm">
              {rule.priority}. {rule.label}: {rule.matched ? "matched" : "not matched"}
              {rule.applied ? ", applied" : ""}. {rule.detail}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="font-display text-xl text-ink">Simulated CRM</h3>
        <p className="mt-2 text-sm text-ink-muted">
          Adapter simulation for this domain: {simulationFor(selected)}. Existing CRM row: {crm ? crm.id : "none, so this would be a create"}.
          Target lifecycle {selected.lifecycle || "(blank)"}. Owner {repName(routing.finalOwner)}.
        </p>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input data-act="confirm" type="checkbox" checked={state.confirmed} onChange={change} />
          I confirm this simulated write. It does not leave the browser.
        </label>
        <button type="button" data-act="apply-crm" onClick={click} className="btn-primary mt-3">
          Apply simulated CRM change
        </button>
        {state.events.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm">
            {state.events.map((event) => (
              <li key={event.id} className="border-t border-rule py-2">
                {event.status}: {event.message} Written: {event.fieldsWritten.join(", ") || "none"}. Failed: {event.fieldsFailed.join(", ") || "none"}.
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="font-display text-xl text-ink">Workflow</h3>
        <button type="button" data-act="run-workflow" onClick={click} className="btn-secondary mt-3">
          Run workflow for {selected.accountName || selected.id}
        </button>
        {lastRun ? (
          <ol className="mt-4 space-y-2">
            {lastRun.steps.map((step) => (
              <li key={step.id} className="border border-rule px-3 py-2 text-sm">
                {step.label}: {step.status.replace(/_/g, " ")}. {step.detail}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-ink-muted">No workflow has been started.</p>
        )}
        <p className="mt-2 text-sm text-ink-faint">Follow-up tasks stored: {state.tasks.length}.</p>
      </div>

      <div>
        <h3 className="font-display text-xl text-ink">Failure lab</h3>
        <label className="mt-3 block text-sm">
          Scenario
          <select data-act="failure" value={state.failureId} onChange={change} className="mt-1 block border border-rule bg-paper px-3 py-2">
            <option value="duplicate-event">Duplicate event</option>
            <option value="rate-limit">CRM rate limit</option>
            <option value="ownership">Conflicting ownership</option>
            <option value="incomplete">Incomplete prospect</option>
            <option value="stale">Stale enrichment</option>
            <option value="partial">Partial CRM update</option>
            <option value="duplicate-task">Duplicate follow-up task</option>
            <option value="discrepancy">Analytics discrepancy</option>
          </select>
        </label>
        <button type="button" data-act="run-failure" onClick={click} className="btn-secondary mt-3">
          Run failure scenario
        </button>
        {state.failureTrace ? (
          <div className="mt-4">
            <p className="text-sm text-ink">{state.failureTrace.title}</p>
            <ul className="mt-2 space-y-2 text-sm text-ink-muted">
              {state.failureTrace.steps.map((step) => (
                <li key={step.label}>
                  {step.label}: {step.status}. {step.detail}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-ink">{state.failureTrace.outcome}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-muted">Choose a scenario and run it. The result is computed, not a saved screenshot.</p>
        )}
      </div>

      <div>
        <h3 className="font-display text-xl text-ink">Analytics from this simulation</h3>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {metrics.map((item) => (
            <li key={item.id} className="border border-rule p-4">
              <button type="button" data-act="metric" data-id={item.id} onClick={click} className="text-left">
                <span className="block text-ink">{item.label}</span>
                <span className="mt-1 block font-mono text-sm">{item.value}</span>
              </button>
              <p className="mt-2 text-sm text-ink-muted">{item.definition}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-display text-xl text-ink">Source to stage</h3>
        <p className="mt-2 max-w-measure text-sm text-ink-muted">
          Each row has one acquisition source, so this is first-touch association for the fixture, not multi-touch attribution and not a causal claim. Records with no source: {missingSource}. Closed-won and closed-lost are present in the stage list so an empty cell stays visible.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Lifecycle counts in the synthetic set</caption>
            <thead>
              <tr>
                <th scope="col" className="py-1 pr-4 font-normal text-ink-faint">Stage</th>
                <th scope="col" className="py-1 font-normal text-ink-faint">Rows</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage) => (
                <tr key={stage} className="border-t border-rule">
                  <th scope="row" className="py-1 pr-4 font-normal">{stage}</th>
                  <td>{stageCounts.find((item) => item.key === stage)?.count ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-4 space-y-1 text-sm text-ink-muted">
          {sourceCounts.map((item) => (
            <li key={item.key}>
              {SOURCE_LABELS[item.key as SourceId] ?? item.key}: {item.count}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-ink-faint">Baseline rows before merge: {baseline.length}.</p>
    </div>
  );
}
