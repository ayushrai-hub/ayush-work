/**
 * Shared labels for the DevOps proof-of-work simulations.
 *
 * Status text is the signal. Color is not required to understand queued, running, passed,
 * failed, blocked, cancelled, or rolled back. The illustrative note is repeated beside
 * logs so a visitor does not read a synthetic line as a production event.
 *
 * Connects to:
 * - src/components/devops/ControlRoom.tsx, PipelineBuilder.tsx, and ReleaseGates.tsx.
 * - Stage statuses from src/lib/devopsPipeline.ts.
 */
import type { StageStatus } from "../../lib/devopsPipeline";

const STATUS_LABELS: Record<StageStatus, string> = {
  queued: "Queued",
  running: "Running",
  passed: "Passed",
  failed: "Failed",
  blocked: "Blocked",
  cancelled: "Cancelled",
  "rolled-back": "Rolled back",
};

/** Visible status word for a pipeline stage. */
export function StatusMark({ status }: { status: StageStatus }) {
  return (
    <span className="inline-block border border-rule px-2 py-0.5 font-mono text-[11px] uppercase tracking-label text-ink-muted">
      {STATUS_LABELS[status]}
    </span>
  );
}

/** Reminder that the surrounding numbers and logs are not from a live system. */
export function IllustrativeNote({ children }: { children?: string }) {
  return (
    <p className="font-mono text-xs text-ink-faint">
      {children ?? "Illustrative simulation. Logs, waves, and versions on this panel are synthetic."}
    </p>
  );
}
