/**
 * Read-only inspector for the current ORBIT run.
 *
 * Shows execution state separately from the persistent-memory explanation. This phase
 * has no store that survives a refresh.
 *
 * Connects to:
 * - src/pages/AgenticPowPage.tsx.
 * - The `Run` shape in src/lib/orbit/types.ts.
 */
import type { Run } from "../../lib/orbit/types";
import { OutcomeBanner } from "./blocks";

/** Current task, steps, evidence, and approval for one run. */
export default function StateInspector({ run }: { run: Run }) {
  const completed = run.steps.filter((step) => step.status === "succeeded" || step.status === "rejected" || step.status === "failed");
  const pending = run.steps.filter((step) => step.status === "pending" || step.status === "waiting_for_approval");
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="border border-rule p-4">
        <h3 className="font-display text-lg text-ink">Execution state</h3>
        <p className="mt-2 text-sm text-ink-muted">
          The current task, plan, step results, evidence, approval, and outcome. Cleared on refresh.
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-faint">Task</dt>
            <dd className="text-right text-ink">{run.title}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-faint">Phase</dt>
            <dd className="font-mono text-xs text-ink">{run.phase}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-faint">Approval</dt>
            <dd className="font-mono text-xs text-ink">{run.approval}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-faint">Model calls</dt>
            <dd className="font-mono text-xs text-ink">{run.modelCalls}</dd>
          </div>
        </dl>
        <div className="mt-4">
          <OutcomeBanner outcome={run.outcome} />
        </div>
        <h4 className="mt-4 label">Completed</h4>
        <p className="mt-1 font-mono text-xs text-ink-muted">{completed.map((step) => step.id).join(", ") || "—"}</p>
        <h4 className="mt-4 label">Still open</h4>
        <p className="mt-1 font-mono text-xs text-ink-muted">{pending.map((step) => step.id).join(", ") || "—"}</p>
      </div>
      <div className="border border-rule p-4">
        <h3 className="font-display text-lg text-ink">Working context</h3>
        <p className="mt-2 text-sm text-ink-muted">Evidence collected for this task only.</p>
        <ul className="mt-3 space-y-2">
          {run.evidence.length === 0 && <li className="text-sm text-ink-faint">No evidence yet.</li>}
          {run.evidence.map((item) => (
            <li key={item.id} className="text-sm text-ink-muted">
              <span className="font-mono text-xs text-ink-faint">{item.source}</span> {item.text}
            </li>
          ))}
        </ul>
        <h3 className="mt-6 font-display text-lg text-ink">Persistent memory</h3>
        <p className="mt-2 text-sm text-ink-muted">
          Not implemented. A later store would keep scoped facts with a retention rule. It would not
          keep an indiscriminate transcript. Refreshing this page forgets the run.
        </p>
      </div>
    </div>
  );
}
