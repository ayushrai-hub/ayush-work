/**
 * Release-gate simulator and rollback panel.
 *
 * Each gate can pass or fail and can be mandatory. `evaluateRelease` blocks the first hop that
 * needs a mandatory failing gate, and every hop after it. Version names are the synthetic
 * constants in the pipeline module.
 *
 * Connects to:
 * - src/pages/DevopsPowPage.tsx
 * - src/lib/devopsPipeline.ts and rollbackChecks in src/content/devopsPow.ts.
 */
import { useState } from "react";
import { rollbackChecks } from "../../content/devopsPow";
import {
  RELEASE_GATES,
  defaultGates,
  evaluateRelease,
  type GateSetting,
} from "../../lib/devopsPipeline";
import { IllustrativeNote } from "./StatusMark";

/** Gate toggles plus the rollback record for a failed promotion. */
export default function ReleaseGates() {
  const [gates, setGates] = useState<GateSetting[]>(() => defaultGates());
  const progress = evaluateRelease(gates);

  /** Flips one boolean on a gate and leaves the others alone. */
  const update = (id: string, key: "passing" | "mandatory") => {
    setGates((current) =>
      current.map((gate) => (gate.id === id ? { ...gate, [key]: !gate[key] } : gate)),
    );
  };

  /** Fails the smoke gate and keeps it mandatory, which is the simulated failed release. */
  const simulateFailure = () => {
    setGates((current) =>
      current.map((gate) => (gate.id === "smoke" ? { ...gate, passing: false, mandatory: true } : gate)),
    );
  };

  return (
    <div>
      <IllustrativeNote>
        Deterministic sample state. Version names are not releases of a real application.
      </IllustrativeNote>
      <ul className="mt-6 divide-y divide-rule border-y border-rule">
        {RELEASE_GATES.map((gate) => {
          const setting = gates.find((item) => item.id === gate.id);
          if (!setting) return null;
          return (
            <li key={gate.id} className="py-4">
              <p className="text-sm text-ink">{gate.label}</p>
              <p className="mt-1 text-sm text-ink-muted">{gate.detail}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-secondary"
                  aria-pressed={setting.passing}
                  onClick={() => update(gate.id, "passing")}
                >
                  {setting.passing ? "Passing" : "Failing"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  aria-pressed={setting.mandatory}
                  onClick={() => update(gate.id, "mandatory")}
                >
                  {setting.mandatory ? "Mandatory" : "Optional"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4">
        <button type="button" className="btn-primary" onClick={simulateFailure}>
          Simulate a failed release
        </button>
      </div>
      <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {progress.steps.map((step) => (
          <li key={step.id} className="border border-rule p-3">
            <p className="font-mono text-xs uppercase tracking-label text-ink-faint">{step.status}</p>
            <p className="mt-1 text-sm text-ink">{step.label}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 border border-rule p-4" aria-live="polite">
        <h3 className="font-display text-lg text-ink">Rollback</h3>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-muted">Current version</dt>
            <dd className="font-mono text-ink">{progress.activeVersion}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Candidate version</dt>
            <dd className="font-mono text-ink">{progress.candidateVersion}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Last known approved version</dt>
            <dd className="font-mono text-ink">{progress.lastApprovedVersion}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Rollback eligibility</dt>
            <dd className="text-ink">{progress.rollbackEligible ? "Eligible" : "Not required"}</dd>
          </div>
        </dl>
        <p className="mt-3 text-sm text-ink">
          {progress.failureReason ?? "No mandatory gate is failing. The candidate stays the active sample."}
        </p>
        {progress.rollbackEligible ? (
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            {rollbackChecks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
}
