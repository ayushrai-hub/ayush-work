/**
 * Case inspector for stored EVALFORGE responses.
 *
 * Filters accepted tasks by category and by the selected profile’s pass flag,
 * then shows the prompt, response, rule, calculated result, and failure
 * category. Results come from scoreRun. The component does not request a model.
 *
 * Connects to:
 * - src/pages/BenchmarkEngineeringPage.tsx.
 * - scoreRun in src/lib/benchmark/aggregate.ts.
 */
import { useMemo, useState } from "react";
import { executionLabel, scoreRun, type ScoredCase } from "../../lib/benchmark/aggregate";
import type { EvaluationRun } from "../../lib/benchmark/types";

/** Props: the demonstration run. Filtering does not mutate it. */
interface PlaygroundProps {
  run: EvaluationRun;
}

/** Task list and the selected case for each demonstration profile. */
export default function Playground({ run }: PlaygroundProps) {
  const [category, setCategory] = useState("all");
  const [result, setResult] = useState("all");
  const [modelId, setModelId] = useState(run.models[0]?.id ?? "");
  const [taskId, setTaskId] = useState("");

  const cases = useMemo(
    () =>
      scoreRun(
        run.tasks,
        run.outputs,
        run.models.map((model) => model.id),
      ),
    [run],
  );

  const visible = cases.filter((item) => {
    if (item.modelId !== modelId) return false;
    if (category !== "all" && item.task.category !== category) return false;
    if (result === "pass" && !item.result.passed) return false;
    if (result === "fail" && item.result.passed) return false;
    return true;
  });
  const selected = visible.find((item) => item.task.id === taskId) ?? visible[0];
  const siblings = selected
    ? cases.filter((item) => item.task.id === selected.task.id)
    : [];

  return (
    <div>
      <p className="border border-rule bg-accent-soft px-4 py-3 text-sm text-ink">{run.disclaimer}</p>
      <p className="mt-3 font-mono text-xs text-ink-faint">{executionLabel(run.executed)} · source {run.source}</p>
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:flex-wrap">
        <Choice
          label="Profile"
          value={modelId}
          onChange={setModelId}
          options={run.models.map((model) => ({ value: model.id, label: model.label }))}
        />
        <Choice
          label="Category"
          value={category}
          onChange={setCategory}
          options={[
            { value: "all", label: "All" },
            { value: "coding", label: "Coding" },
            { value: "reasoning", label: "Reasoning" },
          ]}
        />
        <Choice
          label="Result"
          value={result}
          onChange={setResult}
          options={[
            { value: "all", label: "All" },
            { value: "pass", label: "Pass" },
            { value: "fail", label: "Fail" },
          ]}
        />
      </div>
      <ul className="mt-4 divide-y divide-rule border border-rule" aria-label="Tasks">
        {visible.map((item) => (
          <li key={item.task.id}>
            <button
              type="button"
              onClick={() => setTaskId(item.task.id)}
              aria-pressed={selected?.task.id === item.task.id}
              className="flex w-full items-baseline justify-between gap-4 px-3 py-2 text-left text-sm hover:bg-paper-elevated"
            >
              <span className="text-ink">{item.task.id}</span>
              <span className="font-mono text-xs text-ink-faint">
                {item.result.passed ? "pass" : item.result.failure}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {selected ? <CaseDetail item={selected} siblings={siblings} models={run.models} /> : <p className="mt-4 text-sm text-ink-muted">No stored case matches this filter.</p>}
    </div>
  );
}

/** Button group used by the playground filters. */
function Choice({
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
    <fieldset>
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

/** Selected task across profiles, so a miss can be compared without leaving the case. */
function CaseDetail({
  item,
  siblings,
  models,
}: {
  item: ScoredCase;
  siblings: ScoredCase[];
  models: EvaluationRun["models"];
}) {
  return (
    <article className="mt-4 border border-rule bg-paper-elevated p-5" aria-live="polite">
      <h3 className="font-display text-xl text-ink">{item.task.id}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink">{item.task.prompt}</p>
      <p className="mt-3 text-sm text-ink-muted">
        <span className="label mr-2">Expected</span>
        {item.task.expectedSpec}
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        <span className="label mr-2">Rule</span>
        {item.task.scoringMethod}
      </p>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {siblings.map((sibling) => {
          const model = models.find((entry) => entry.id === sibling.modelId);
          return (
            <div key={sibling.modelId} className="border border-rule p-3">
              <h4 className="text-sm text-ink">{model?.label ?? sibling.modelId}</h4>
              <p className="mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed text-ink-muted">
                {sibling.response || "(empty response)"}
              </p>
              <p className="mt-3 text-sm text-ink">
                {sibling.result.passed ? "Pass" : "Fail"} · {sibling.result.failure}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{sibling.result.calculation}</p>
              <p className="mt-2 text-sm text-ink-muted">{sibling.explanation}</p>
            </div>
          );
        })}
      </div>
    </article>
  );
}
