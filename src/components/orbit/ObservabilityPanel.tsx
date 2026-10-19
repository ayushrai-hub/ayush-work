/**
 * Observability view for one ORBIT run.
 *
 * Identifiers come from the in-memory run. Model request id, cost, and latency are shown
 * as not issued or not measured. The panel does not pretend to be a trace backend.
 *
 * Connects to:
 * - src/pages/AgenticPowPage.tsx.
 * - src/lib/orbit/types.ts.
 */
import type { Run } from "../../lib/orbit/types";

/** Field list a production trace would carry, filled from the simulation where it can be. */
export default function ObservabilityPanel({ run }: { run: Run }) {
  const rows = [
    ["Task ID", run.id],
    ["Trace ID", `${run.id}:trace`],
    ["Model request ID", "Not issued — no model call"],
    ["Approval events", String(run.audit.filter((event) => event.event.includes("approv") || event.event === "rejected").length)],
    ["Writes", String(run.store.writes)],
    ["Verification", run.steps.find((step) => step.tool === "verify_task_created")?.status ?? "not run"],
    ["Cost", "Not measured"],
    ["Latency", "Not measured"],
  ];
  return (
    <div>
      <p className="max-w-measure text-sm text-ink-muted">
        A live system would keep these records so a failed run can be reconstructed. This panel
        reads the current browser run. It is synthetic fixture data, not a customer trace.
      </p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="border border-rule px-3 py-3">
            <dt className="label">{label}</dt>
            <dd className="mt-1 font-mono text-xs text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="mt-6 font-display text-lg text-ink">Step records</h3>
      <div className="mt-3 max-w-full overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <caption className="sr-only">Steps in the current simulation trace</caption>
          <thead>
            <tr className="border-b border-rule font-mono text-xs uppercase tracking-label text-ink-faint">
              <th scope="col" className="py-2 pr-3">Step</th>
              <th scope="col" className="py-2 pr-3">Tool call</th>
              <th scope="col" className="py-2 pr-3">Status</th>
              <th scope="col" className="py-2">Error</th>
            </tr>
          </thead>
          <tbody>
            {run.steps.map((step) => (
              <tr key={step.id} className="border-b border-rule">
                <td className="py-2 pr-3 font-mono text-xs">{step.id}</td>
                <td className="py-2 pr-3 font-mono text-xs">{step.tool ?? "—"}</td>
                <td className="py-2 pr-3">{step.status}</td>
                <td className="py-2 text-ink-muted">{step.error ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
