/**
 * Approval panel for a proposed ORBIT write.
 *
 * Approve executes the waiting tool. Reject does not. A later approve click cannot
 * create a second row. Execution and verification are separate labels.
 *
 * Connects to:
 * - src/lib/orbit/simulation.ts (`approveProposedAction`, `rejectProposedAction`, `runNext`).
 * - src/pages/AgenticPowPage.tsx shares the workbench `Run`.
 */
import { approveProposedAction, rejectProposedAction, runNext } from "../../lib/orbit/simulation";
import type { Run } from "../../lib/orbit/types";

/** Props: the shared run and a setter. */
interface ApprovalPanelProps {
  run: Run;
  onRun: (run: Run) => void;
}

/** Proposed action, decision buttons, and the audit list. */
export default function ApprovalPanel({ run, onRun }: ApprovalPanelProps) {
  const proposed = run.steps.find((step) => step.tool === "create_internal_task");
  const verify = run.steps.find((step) => step.tool === "verify_task_created");
  const executed = run.store.tasks.length > 0;
  const verified = verify?.status === "succeeded";
  return (
    <div className="border border-rule p-4 sm:p-6">
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="label">Requested action</dt>
          <dd className="mt-1 text-ink">{proposed ? "create_internal_task" : "No write has been proposed."}</dd>
        </div>
        <div>
          <dt className="label">Why</dt>
          <dd className="mt-1 text-ink-muted">{proposed?.why ?? "Run a task that proposes a task."}</dd>
        </div>
        <div>
          <dt className="label">Evidence</dt>
          <dd className="mt-1 text-ink-muted">{run.evidence.length} collected item{run.evidence.length === 1 ? "" : "s"}.</dd>
        </div>
        <div>
          <dt className="label">Consequences</dt>
          <dd className="mt-1 text-ink-muted">Stores one internal task in this browser session. Does not email anyone.</dd>
        </div>
        <div>
          <dt className="label">Permission</dt>
          <dd className="mt-1 font-mono text-xs text-ink">tasks:write</dd>
        </div>
        <div>
          <dt className="label">Approval</dt>
          <dd className="mt-1 font-mono text-xs text-ink">{run.approval}</dd>
        </div>
        <div>
          <dt className="label">Execution</dt>
          <dd className="mt-1 text-ink">{executed ? "Executed" : "Not executed"}</dd>
        </div>
        <div>
          <dt className="label">Verification</dt>
          <dd className="mt-1 text-ink">{verified ? "Verified" : verify?.status === "failed" ? "Failed" : "Not verified"}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={() => onRun(approveProposedAction(run))}>
          Approve action
        </button>
        <button type="button" className="btn-secondary" onClick={() => onRun(rejectProposedAction(run))}>
          Reject action
        </button>
        <button type="button" className="btn-ghost" onClick={() => onRun(runNext(run))}>
          Verify task record
        </button>
      </div>
      {run.duplicatePrevented && (
        <p className="mt-3 text-sm text-ink" role="status">Duplicate write prevented. The store still has one task.</p>
      )}
      <h3 className="mt-6 label">Audit</h3>
      <ol className="mt-2 space-y-1">
        {run.audit.map((event) => (
          <li key={event.seq} className="font-mono text-xs text-ink-muted">
            {event.seq}. {event.event}: {event.detail}
          </li>
        ))}
      </ol>
    </div>
  );
}
