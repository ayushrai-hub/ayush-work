/**
 * Expandable execution trace for one ORBIT run.
 *
 * Each row is a `<details>` element. Duration is labeled as not measured. The legend
 * includes Running even though this simulation never leaves a step there.
 *
 * Connects to:
 * - src/lib/orbit/types.ts (`STEP_STATUS_LABELS`).
 * - src/pages/AgenticPowPage.tsx passes the current `Run`.
 */
import type { Run } from "../../lib/orbit/types";
import { STEP_STATUS_LABELS } from "../../lib/orbit/types";
import { JsonBlock, StepMark } from "./blocks";

/** Full trace plus the status legend. */
export default function ExecutionTrace({ run }: { run: Run }) {
  return (
    <div>
      <ul className="flex flex-wrap gap-2" aria-label="Step statuses">
        {(Object.keys(STEP_STATUS_LABELS) as (keyof typeof STEP_STATUS_LABELS)[]).map((status) => (
          <li key={status}>
            <StepMark status={status} />
          </li>
        ))}
      </ul>
      <p className="mt-3 max-w-measure text-sm text-ink-muted">
        Running is part of the status contract for a live controller. This simulation finishes a step
        before it returns, so no row stays Running. Sample durations are not shown, because none were measured.
      </p>
      <ol className="mt-6 space-y-2">
        {run.steps.map((step) => (
          <li key={step.id} className="border border-rule">
            <details className="group">
              <summary className="flex cursor-pointer flex-wrap items-center gap-2 px-3 py-3 text-sm">
                <span className="font-mono text-xs text-ink-faint">{step.id}</span>
                <StepMark status={step.status} />
                <span className="text-ink">{step.action}</span>
                {step.tool && <span className="font-mono text-xs text-ink-muted">{step.tool}</span>}
              </summary>
              <div className="border-t border-rule px-3 py-3 text-sm">
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="label">Purpose</dt>
                    <dd className="mt-1 text-ink-muted">{step.purpose}</dd>
                  </div>
                  <div>
                    <dt className="label">Why this tool or step</dt>
                    <dd className="mt-1 text-ink-muted">{step.why}</dd>
                  </div>
                  <div>
                    <dt className="label">Depends on</dt>
                    <dd className="mt-1 font-mono text-xs text-ink-muted">{step.dependsOn.join(", ") || "—"}</dd>
                  </div>
                  <div>
                    <dt className="label">Attempts</dt>
                    <dd className="mt-1 font-mono text-xs text-ink-muted">{step.attempts.length}</dd>
                  </div>
                  <div>
                    <dt className="label">Duration</dt>
                    <dd className="mt-1 text-ink-muted">Not measured</dd>
                  </div>
                  <div>
                    <dt className="label">Evidence</dt>
                    <dd className="mt-1 font-mono text-xs text-ink-muted">{step.evidenceIds.join(", ") || "—"}</dd>
                  </div>
                </dl>
                {step.error && <p className="mt-3 text-signal">{step.error}</p>}
                {step.stateNote && <p className="mt-3 text-ink-muted">{step.stateNote}</p>}
                <p className="mt-3 label">Input</p>
                <JsonBlock value={step.input} />
                <p className="mt-3 label">Output</p>
                <JsonBlock value={step.output} />
                {step.attempts.length > 0 && (
                  <>
                    <p className="mt-3 label">Attempt log</p>
                    <JsonBlock value={step.attempts} />
                  </>
                )}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
