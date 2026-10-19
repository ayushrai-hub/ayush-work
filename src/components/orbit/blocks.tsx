/**
 * Small display pieces for the ORBIT demonstration.
 *
 * `JsonBlock` pretty-prints a value. `StepMark` and `OutcomeBanner` use words, not color alone.
 * Durations are not rendered as measurements.
 *
 * Connects to:
 * - src/components/orbit/* and src/pages/AgenticPowPage.tsx.
 * - Status maps in src/lib/orbit/types.ts.
 */
import { outcomeLabel } from "../../lib/orbit/simulation";
import type { Outcome, StepStatus } from "../../lib/orbit/types";
import { STEP_STATUS_LABELS } from "../../lib/orbit/types";

/** Pretty-printed JSON, or an em dash when the value is missing. */
export function JsonBlock({ value }: { value: unknown }) {
  const text = value === undefined ? "—" : JSON.stringify(value, null, 2);
  return (
    <pre className="mt-2 max-h-64 overflow-auto border border-rule bg-paper-elevated p-3 font-mono text-xs leading-relaxed text-ink">
      {text}
    </pre>
  );
}

/** Text label for a step status. */
export function StepMark({ status }: { status: StepStatus }) {
  return (
    <span className="inline-block border border-rule px-2 py-0.5 font-mono text-[11px] uppercase tracking-label text-ink-muted">
      {STEP_STATUS_LABELS[status]}
    </span>
  );
}

/** Outcome label. Qualified outcomes are named; others say what stopped the run. */
export function OutcomeBanner({ outcome }: { outcome: Outcome }) {
  const qualified = outcome.kind === "verified" || outcome.kind === "read_only_complete";
  return (
    <p className={qualified ? "text-ink" : "text-signal"} role="status">
      <span className="font-mono text-xs uppercase tracking-label">{outcomeLabel(outcome.kind)}</span>
      {outcome.kind === "unverified" && " — a reported success was not found in the store."}
      {outcome.kind === "rejected" && " — the action was not executed."}
      {outcome.kind === "uncertain" && ` — ${outcome.question}`}
      {outcome.kind === "incomplete" && ` — missing ${outcome.missing.join(", ")}.`}
      {outcome.kind === "failed" && ` — ${outcome.reason}`}
      {outcome.kind === "budget_exhausted" && " — unfinished steps are listed in the report."}
    </p>
  );
}

/** Persistent honesty label for every interactive block. */
export function SimulationNote() {
  return (
    <p className="font-mono text-xs text-ink-faint">
      Simulation · no model call · fixture data · durations are not measured
    </p>
  );
}
