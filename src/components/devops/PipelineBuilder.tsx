/**
 * Pipeline editor for the sample CI workflow on the DevOps proof-of-work page.
 *
 * Optional stages can be removed, the security policy can block or only report, and injected
 * failures show why a later stage does not run. The dependency list is `executionWaves` from
 * the same model the control room uses.
 *
 * Connects to:
 * - src/pages/DevopsPowPage.tsx
 * - src/lib/devopsPipeline.ts and pipelineOrderNotes in src/content/devopsPow.ts.
 */
import { useState } from "react";
import { pipelineOrderNotes } from "../../content/devopsPow";
import {
  createPipeline,
  dependenciesOf,
  executionWaves,
  isEnabled,
  PIPELINE_STAGES,
  releaseDecision,
  runToEnd,
  setSecurityPolicy,
  statusOf,
  toggleFailure,
  toggleStage,
  type PipelineConfig,
} from "../../lib/devopsPipeline";
import { IllustrativeNote, StatusMark } from "./StatusMark";

/** Editor for stage selection, policy, and a deterministic run. */
export default function PipelineBuilder() {
  const [config, setConfig] = useState<PipelineConfig>(() => createPipeline());
  const decision = releaseDecision(runToEnd(config));
  const waves = executionWaves(config);

  return (
    <div>
      <IllustrativeNote>
        Illustrative pipeline. Durations are not shown because this UI is not a CI system.
      </IllustrativeNote>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <fieldset>
          <legend className="label">Stages</legend>
          <ul className="mt-3 divide-y divide-rule border-y border-rule">
            {PIPELINE_STAGES.map((stage) => (
              <li key={stage.id} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-ink">{stage.name}</span>
                  {stage.optional ? (
                    <button
                      type="button"
                      className="btn-secondary"
                      aria-pressed={isEnabled(stage.id, config)}
                      onClick={() => setConfig((current) => toggleStage(current, stage.id))}
                    >
                      {isEnabled(stage.id, config) ? "Enabled" : "Disabled"}
                    </button>
                  ) : (
                    <span className="font-mono text-[11px] uppercase tracking-label text-ink-faint">Required</span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{stage.purpose}</p>
                <p className="mt-2 text-sm text-ink-muted">
                  Depends on{" "}
                  {dependenciesOf(stage.id, config).length === 0
                    ? "nothing earlier"
                    : dependenciesOf(stage.id, config)
                        .map((id) => PIPELINE_STAGES.find((item) => item.id === id)?.name)
                        .join(", ")}
                  .
                </p>
                <button
                  type="button"
                  className="btn-ghost mt-1 px-0"
                  aria-pressed={config.failing[stage.id] === true}
                  onClick={() => setConfig((current) => toggleFailure(current, stage.id))}
                >
                  {config.failing[stage.id] ? "Failure injected" : "Inject failure"}
                </button>
              </li>
            ))}
          </ul>
        </fieldset>
        <div>
          <fieldset>
            <legend className="label">Security policy</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["block", "report"] as const).map((policy) => (
                <button
                  key={policy}
                  type="button"
                  className="btn-secondary"
                  aria-pressed={config.securityPolicy === policy}
                  onClick={() => setConfig((current) => setSecurityPolicy(current, policy))}
                >
                  {policy === "block" ? "Block release" : "Report only"}
                </button>
              ))}
            </div>
          </fieldset>
          <h3 className="mt-8 font-display text-lg text-ink">Dependency graph</h3>
          <ol className="mt-3 space-y-3">
            {waves.map((wave) => (
              <li key={wave.wave} className="border border-rule p-3">
                <p className="font-mono text-xs text-ink-faint">
                  Wave {wave.wave} · {wave.parallel ? "Parallel" : "Sequential"}
                </p>
                <p className="mt-1 text-sm text-ink">{wave.stages.map((stage) => stage.name).join(", ")}</p>
              </li>
            ))}
          </ol>
          <h3 className="mt-8 font-display text-lg text-ink">If this configuration ran</h3>
          <p className="mt-2 text-sm text-ink" aria-live="polite">
            {decision.outcome}. {decision.reason}
          </p>
          <ul className="mt-4 space-y-2">
            {PIPELINE_STAGES.filter((stage) => isEnabled(stage.id, config)).map((stage) => (
              <li key={stage.id} className="flex items-center justify-between gap-3 text-sm">
                <span>{stage.name}</span>
                <StatusMark status={statusOf(stage.id, runToEnd(config))} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul className="mt-8 max-w-measure space-y-3 text-sm leading-relaxed text-ink-muted">
        {pipelineOrderNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
