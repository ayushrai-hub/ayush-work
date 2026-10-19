/**
 * Inspectable evaluation lifecycle for the EVALFORGE demonstration.
 *
 * Nine stages are buttons. The selected stage shows its inputs, processing,
 * outputs, validation, failure modes, and the evidence that would show the
 * stage was done. Nothing here starts a job.
 *
 * Connects to:
 * - src/pages/BenchmarkEngineeringPage.tsx.
 * - benchmarkStages in src/content/benchmarkEngineering.ts.
 */
import { useState } from "react";
import { benchmarkStages } from "../../content";

/** Fields shown for the selected stage, in reading order. */
const FIELDS = [
  ["inputs", "Inputs"],
  ["processing", "Processing"],
  ["outputs", "Outputs"],
  ["validation", "Validation"],
  ["failureModes", "Failure modes"],
  ["evidence", "Evidence"],
] as const;

/** Stage buttons plus the detail for the selected stage. The first stage starts selected. */
export default function LifecyclePanel() {
  const [stageId, setStageId] = useState(benchmarkStages[0]?.id ?? "");
  const stage = benchmarkStages.find((item) => item.id === stageId) ?? benchmarkStages[0];

  return (
    <div>
      <p className="max-w-measure text-sm text-ink-muted">
        Demonstration of the lifecycle. Selecting a stage reveals the contract for that step. It does not run the step.
      </p>
      <ol className="mt-6 grid gap-2 sm:grid-cols-3" aria-label="Evaluation lifecycle">
        {benchmarkStages.map((item, index) => {
          const selected = item.id === stage?.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => setStageId(item.id)}
                className={`w-full border px-3 py-3 text-left text-sm ${
                  selected ? "border-ink bg-accent-soft" : "border-rule bg-paper-elevated hover:border-ink"
                }`}
              >
                <span className="font-mono text-xs text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-1 block text-ink">{item.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {stage && (
        <div className="mt-6 border border-rule bg-paper-elevated p-5" aria-live="polite">
          <h3 className="font-display text-xl text-ink">{stage.title}</h3>
          <dl className="mt-4 grid gap-4 md:grid-cols-2">
            {FIELDS.map(([key, label]) => (
              <div key={key}>
                <dt className="label">{label}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{stage[key]}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
