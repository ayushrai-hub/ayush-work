/**
 * Reproducible failure scenarios for ORBIT.
 *
 * Choosing a scenario replays `runScenario`. The same choice always returns the same
 * outcome. There is no random fault injection.
 *
 * Connects to:
 * - src/lib/orbit/simulation.ts (`SCENARIOS`, `runScenario`).
 * - src/components/orbit/blocks.tsx.
 */
import { useState } from "react";
import { SCENARIOS, isQualifiedOutcome, runScenario } from "../../lib/orbit/simulation";
import type { ScenarioId } from "../../lib/orbit/types";
import { OutcomeBanner, SimulationNote } from "./blocks";

/** Scenario picker and the terminal run it produces. */
export default function FailureLab() {
  const [id, setId] = useState<ScenarioId>(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((item) => item.id === id) ?? SCENARIOS[0];
  const run = runScenario(id);
  return (
    <div>
      <SimulationNote />
      <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label="Failure scenarios">
        {SCENARIOS.map((item) => (
          <label key={item.id} className="flex items-start gap-2 text-sm text-ink">
            <input
              type="radio"
              name="orbit-scenario"
              value={item.id}
              checked={item.id === id}
              onChange={() => setId(item.id)}
            />
            {item.title}
          </label>
        ))}
      </div>
      <button type="button" className="btn-secondary mt-4" onClick={() => setId(scenario.id)}>
        Run this scenario again
      </button>
      <div className="mt-6 border border-rule p-4" aria-live="polite">
        <h3 className="font-display text-xl text-ink">{scenario.title}</h3>
        <p className="mt-3 text-sm text-ink-muted">{scenario.expected}</p>
        <p className="mt-3 text-sm text-ink">{scenario.mechanism}</p>
        <div className="mt-4">
          <OutcomeBanner outcome={run.outcome} />
        </div>
        <p className="mt-3 font-mono text-xs text-ink-faint">
          Writes: {run.store.writes}. Handler calls: {run.store.handlerCalls}. Qualified completion: {isQualifiedOutcome(run.outcome) ? "yes" : "no"}.
        </p>
        {run.report && (
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="label">Findings</dt>
              <dd className="mt-1 text-ink-muted">{run.report.findings.join(" ") || "—"}</dd>
            </div>
            <div>
              <dt className="label">Failures</dt>
              <dd className="mt-1 text-ink-muted">{run.report.failures.join(" ") || "—"}</dd>
            </div>
            <div>
              <dt className="label">Unresolved</dt>
              <dd className="mt-1 text-ink-muted">{run.report.unresolved.join(" ") || "—"}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}
