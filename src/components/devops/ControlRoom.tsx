/**
 * DevOps Control Room: one fictional change walked through the delivery model.
 *
 * The visitor picks a change, steps the pipeline or runs it to the end, and reads whether
 * the simulated release may proceed. Failures come from the change preset. The component
 * does not call a runner.
 *
 * Connects to:
 * - src/pages/DevopsPowPage.tsx
 * - src/lib/devopsPipeline.ts and the change list in src/content/devopsPow.ts.
 */
import { useState } from "react";
import { devopsChanges } from "../../content/devopsPow";
import {
  applyChange,
  cancelRun,
  createPipeline,
  illustrativeLogs,
  PIPELINE_STAGES,
  releaseDecision,
  requestRollback,
  resetProgress,
  runToEnd,
  advance,
  isEnabled,
  statusOf,
  type PipelineConfig,
} from "../../lib/devopsPipeline";
import { IllustrativeNote, StatusMark } from "./StatusMark";

/** Interactive control room for one synthetic change. */
export default function ControlRoom() {
  const [changeId, setChangeId] = useState(devopsChanges[0].id);
  const [config, setConfig] = useState<PipelineConfig>(() => createPipeline());
  const change = devopsChanges.find((item) => item.id === changeId) ?? devopsChanges[0];
  const decision = releaseDecision(config);
  const logs = illustrativeLogs(config);

  /** Loads a preset and clears progress so the new failure is what the next run evaluates. */
  const selectChange = (id: string) => {
    const next = devopsChanges.find((item) => item.id === id) ?? devopsChanges[0];
    setChangeId(next.id);
    setConfig((current) => applyChange(current, next.failing));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div>
        <p className="label">Change</p>
        <div className="mt-3 flex flex-col gap-2" role="listbox" aria-label="Synthetic change">
          {devopsChanges.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === changeId}
              onClick={() => selectChange(item.id)}
              className={`border px-3 py-2 text-left text-sm ${
                item.id === changeId ? "border-ink text-ink" : "border-rule text-ink-muted"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
      <div>
        <IllustrativeNote />
        <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink">{change.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={() => setConfig((current) => advance(current))}>
            Step
          </button>
          <button type="button" className="btn-secondary" onClick={() => setConfig((current) => runToEnd(current))}>
            Run to end
          </button>
          <button type="button" className="btn-secondary" onClick={() => setConfig((current) => cancelRun(current))}>
            Cancel
          </button>
          <button type="button" className="btn-secondary" onClick={() => setConfig((current) => requestRollback(current))}>
            Roll back
          </button>
          <button type="button" className="btn-ghost" onClick={() => setConfig((current) => resetProgress(current))}>
            Reset
          </button>
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-label text-ink-faint" aria-live="polite">
          Release: {decision.outcome}. {decision.reason}
        </p>
        <ol className="mt-4 divide-y divide-rule border-y border-rule">
          {PIPELINE_STAGES.filter((stage) => isEnabled(stage.id, config)).map((stage) => (
            <li key={stage.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span className="text-sm text-ink">{stage.name}</span>
              <StatusMark status={statusOf(stage.id, config)} />
            </li>
          ))}
        </ol>
        <h3 className="mt-8 font-display text-lg text-ink">Illustrative log</h3>
        {logs.length === 0 ? (
          <p className="mt-2 text-sm text-ink-muted">No log lines yet. Step the pipeline to append some.</p>
        ) : (
          <ol className="mt-3 space-y-2">
            {logs.map((line) => (
              <li key={`${line.id}-${line.status}`} className="border border-rule p-3 text-sm">
                <p className="font-mono text-xs text-ink-faint">
                  {line.stamp} · illustrative
                </p>
                <p className="mt-1 text-ink">
                  {line.stage}: {line.message}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
