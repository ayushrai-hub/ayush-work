/**
 * Task runner for the ORBIT workbench.
 *
 * The visitor picks one of four scripted tasks and steps the controller. Switching or
 * resetting replaces the run. The component does not invent latency.
 *
 * Connects to:
 * - src/lib/orbit/simulation.ts (`createRun`, `runNext`, `runUntilBlocked`, `TASK_CARDS`).
 * - src/pages/AgenticPowPage.tsx owns the `Run` so the approval panel shares it.
 */
import { TASK_CARDS, createRun, runNext, runUntilBlocked } from "../../lib/orbit/simulation";
import type { Run, TaskId } from "../../lib/orbit/types";
import { JsonBlock, SimulationNote, StepMark } from "./blocks";

/** Props for the workbench. `run` is the shared controller state. */
interface WorkbenchProps {
  run: Run;
  onRun: (run: Run) => void;
}

/** Interactive plan, latest step, and runner controls. */
export default function Workbench({ run, onRun }: WorkbenchProps) {
  const card = TASK_CARDS.find((item) => item.id === run.taskId) ?? TASK_CARDS[0];
  const latest = [...run.steps].reverse().find((step) => step.status !== "pending");

  return (
    <div className="border border-rule bg-paper-elevated p-4 sm:p-6">
      <SimulationNote />
      <p className="mt-3 text-sm text-ink-muted">
        Fixture account: Northwind Analytical (`acct_northwind`). Not a customer.
      </p>
      <fieldset className="mt-6">
        <legend className="label">Tasks</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {TASK_CARDS.map((task) => (
            <button
              key={task.id}
              type="button"
              aria-pressed={run.taskId === task.id}
              onClick={() => onRun(createRun(task.id as TaskId))}
              className={`border px-3 py-3 text-left text-sm ${run.taskId === task.id ? "border-ink text-ink" : "border-rule text-ink-muted"}`}
            >
              {task.title}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-lg text-ink">Task specification</h3>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="label">Objective</dt>
              <dd className="mt-1 text-ink-muted">{card.objective}</dd>
            </div>
            <div>
              <dt className="label">Context</dt>
              <dd className="mt-1 text-ink-muted">{card.context}</dd>
            </div>
            <div>
              <dt className="label">Constraints</dt>
              <dd className="mt-1 text-ink-muted">{card.constraints.join(" ")}</dd>
            </div>
            <div>
              <dt className="label">Expected output</dt>
              <dd className="mt-1 text-ink-muted">{card.expectedOutput}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className="font-display text-lg text-ink">Plan</h3>
          <ol className="mt-3 space-y-2">
            {run.steps.map((step) => (
              <li key={step.id} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-mono text-xs text-ink-faint">{step.id}</span>
                <StepMark status={step.status} />
                <span className="text-ink-muted">{step.purpose}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={() => onRun(runNext(run))}>
          Run next step
        </button>
        <button type="button" className="btn-secondary" onClick={() => onRun(runUntilBlocked(run))}>
          Run until it stops
        </button>
        <button type="button" className="btn-ghost" onClick={() => onRun(createRun(run.taskId as TaskId))}>
          Reset run
        </button>
      </div>

      {latest && (
        <div className="mt-6 border-t border-rule pt-4">
          <h3 className="font-display text-lg text-ink">Latest step</h3>
          <p className="mt-2 text-sm text-ink-muted">{latest.why}</p>
          {latest.tool && (
            <p className="mt-2 font-mono text-xs text-ink">
              Tool {latest.tool}
              {latest.dependsOn.length > 0 ? ` · depends on ${latest.dependsOn.join(", ")}` : ""}
            </p>
          )}
          <p className="mt-2 text-sm text-ink-muted">{latest.stateNote || "No state note."}</p>
          <p className="mt-3 label">Input</p>
          <JsonBlock value={latest.input} />
          <p className="mt-3 label">Output</p>
          <JsonBlock value={latest.output} />
          <p className="mt-2 font-mono text-xs text-ink-faint">Duration: not measured</p>
        </div>
      )}
    </div>
  );
}
