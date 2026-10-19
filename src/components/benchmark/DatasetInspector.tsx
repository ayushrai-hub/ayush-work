/**
 * Dataset inspector for the synthetic EVALFORGE tasks.
 *
 * Filters by category, difficulty, and validation status, and runs the
 * quality checks in src/lib/benchmark/quality.ts. An audit control appends
 * deliberately invalid rows so duplicate and schema findings can be seen.
 * Those rows are not part of the scored run.
 *
 * Connects to:
 * - src/pages/BenchmarkEngineeringPage.tsx.
 * - inspectDataset and auditFixtureTasks.
 */
import { useMemo, useState } from "react";
import { auditFixtureTasks, benchmarkTasks } from "../../content";
import { failingFindings, inspectDataset } from "../../lib/benchmark/quality";
import type { TaskRecord } from "../../lib/benchmark/types";

/** One filter group: the value `all` clears that dimension. */
function FilterGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="label">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`border px-2 py-1 text-xs ${
              value === option.value ? "border-ink bg-accent-soft text-ink" : "border-rule text-ink-muted"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Table of tasks, one selected record, and the quality findings for the rows in view. */
export default function DatasetInspector() {
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const [audit, setAudit] = useState(false);
  const [selectedId, setSelectedId] = useState("reject-ambiguous");

  const rows = useMemo(() => {
    const source = audit ? [...benchmarkTasks, ...auditFixtureTasks()] : benchmarkTasks;
    return source.filter((task) => {
      if (category !== "all" && task.category !== category) return false;
      if (difficulty !== "all" && task.difficulty !== difficulty) return false;
      if (status !== "all" && task.validationStatus !== status) return false;
      return true;
    });
  }, [audit, category, difficulty, status]);

  const findings = useMemo(() => inspectDataset(rows), [rows]);
  const failures = failingFindings(findings);
  const selected = rows.find((task) => task.id === selectedId) ?? rows[0];

  return (
    <div>
      <p className="max-w-measure text-sm text-ink-muted">
        Every row is a synthetic demonstration example written for this page. The rejected row is included so a bad task can be inspected. It is not scored.
      </p>
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:flex-wrap">
        <FilterGroup
          label="Category"
          value={category}
          onChange={setCategory}
          options={[
            { value: "all", label: "All" },
            { value: "coding", label: "Coding" },
            { value: "reasoning", label: "Reasoning" },
          ]}
        />
        <FilterGroup
          label="Difficulty"
          value={difficulty}
          onChange={setDifficulty}
          options={[
            { value: "all", label: "All" },
            { value: "easy", label: "Easy" },
            { value: "medium", label: "Medium" },
            { value: "hard", label: "Hard" },
          ]}
        />
        <FilterGroup
          label="Validation"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All" },
            { value: "accepted", label: "Accepted" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
      </div>
      <button
        type="button"
        aria-pressed={audit}
        onClick={() => setAudit((current) => !current)}
        className="btn-secondary mt-4"
      >
        {audit ? "Hide audit fixture" : "Add a duplicate and a schema break"}
      </button>
      <p className="mt-4 font-mono text-xs text-ink-faint">
        {rows.length} row{rows.length === 1 ? "" : "s"} in view · {failures.length} fail finding{failures.length === 1 ? "" : "s"}
      </p>
      <div className="mt-4 overflow-x-auto border border-rule">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <caption className="sr-only">Synthetic demonstration tasks</caption>
          <thead className="border-b border-rule bg-paper-elevated font-mono text-xs text-ink-faint">
            <tr>
              <th scope="col" className="px-3 py-2 font-normal">Task</th>
              <th scope="col" className="px-3 py-2 font-normal">Category</th>
              <th scope="col" className="px-3 py-2 font-normal">Difficulty</th>
              <th scope="col" className="px-3 py-2 font-normal">Status</th>
              <th scope="col" className="px-3 py-2 font-normal">Scoring</th>
              <th scope="col" className="px-3 py-2 font-normal">Version</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((task, index) => (
              <tr key={`${task.id}-${index}`} className="border-b border-rule last:border-0">
                <th scope="row" className="px-3 py-2 font-normal">
                  <button
                    type="button"
                    onClick={() => setSelectedId(task.id)}
                    className="text-left text-ink underline decoration-rule underline-offset-4"
                    aria-pressed={selected?.id === task.id}
                  >
                    {task.id}
                  </button>
                </th>
                <td className="px-3 py-2 text-ink-muted">{task.category}</td>
                <td className="px-3 py-2 text-ink-muted">{task.difficulty}</td>
                <td className="px-3 py-2 text-ink-muted">{task.validationStatus}</td>
                <td className="px-3 py-2 text-ink-muted">{task.scoringMethod}</td>
                <td className="px-3 py-2 font-mono text-xs text-ink-faint">{task.version || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && <TaskDetail task={selected} />}
      <div className="mt-6">
        <h3 className="font-display text-xl text-ink">Quality checks</h3>
        <ul className="mt-3 space-y-2">
          {findings.map((finding) => (
            <li key={`${finding.check}-${finding.taskId ?? "run"}-${finding.message}`} className="border border-rule px-3 py-2 text-sm">
              <span className="font-mono text-xs text-ink-faint">
                {finding.severity} · {finding.check}
              </span>
              <p className="mt-1 text-ink-muted">{finding.message}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** The selected task’s prompt, expected specification, provenance, and rejection reason. */
function TaskDetail({ task }: { task: TaskRecord }) {
  return (
    <article className="mt-4 border border-rule bg-paper-elevated p-5" aria-live="polite">
      <h3 className="font-display text-xl text-ink">{task.id}</h3>
      <p className="mt-1 font-mono text-xs text-ink-faint">
        {task.provenance} · declared {task.declaredCapability} · {task.validationStatus}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-ink">{task.prompt}</p>
      <p className="mt-3 text-sm text-ink-muted">
        <span className="label mr-2">Expected</span>
        {task.expectedSpec || "None. This row cannot be scored."}
      </p>
      {task.rejectionReason && (
        <p className="mt-3 text-sm text-ink-muted">
          <span className="label mr-2">Why it is rejected</span>
          {task.rejectionReason}
        </p>
      )}
    </article>
  );
}
