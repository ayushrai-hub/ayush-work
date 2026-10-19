/**
 * Results for the EVALFORGE demonstration, computed from scored cases.
 *
 * Category rates, failure tallies, and Wilson intervals are counts over the
 * filtered rows. Choosing a cell lists the cases inside it. There is no
 * single rank across categories.
 *
 * Connects to:
 * - src/pages/BenchmarkEngineeringPage.tsx.
 * - rateBy, tallyFailures, and scoreRun in src/lib/benchmark/aggregate.ts.
 */
import { useMemo, useState } from "react";
import { rateBy, scoreRun, tallyFailures, type RateSummary } from "../../lib/benchmark/aggregate";
import type { EvaluationRun } from "../../lib/benchmark/types";

/** Props: the demonstration run. */
interface ResultsDashboardProps {
  run: EvaluationRun;
}

/** Category filter, rate table, failure tally, and the cases behind a selected rate. */
export default function ResultsDashboard({ run }: ResultsDashboardProps) {
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState("north");
  const cases = useMemo(
    () =>
      scoreRun(
        run.tasks,
        run.outputs,
        run.models.map((model) => model.id),
      ),
    [run],
  );
  const rates = rateBy(cases, category);
  const coding = rateBy(cases, "coding");
  const reasoning = rateBy(cases, "reasoning");
  const failures = tallyFailures(
    cases.filter((item) => category === "all" || item.task.category === category),
  );
  const active = rates.find((rate) => rate.modelId === selected) ?? rates[0];

  return (
    <div>
      <p className="border border-rule bg-accent-soft px-4 py-3 text-sm text-ink">{run.disclaimer}</p>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Result category">
        {[
          ["all", "All accepted tasks"],
          ["coding", "Coding"],
          ["reasoning", "Reasoning"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
            className={`border px-3 py-1.5 text-sm ${
              category === value ? "border-ink bg-accent-soft text-ink" : "border-rule text-ink-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto border border-rule">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <caption className="sr-only">Demonstration pass counts by profile and category</caption>
          <thead className="border-b border-rule font-mono text-xs text-ink-faint">
            <tr>
              <th scope="col" className="px-3 py-2 font-normal">Profile</th>
              <th scope="col" className="px-3 py-2 font-normal">This filter</th>
              <th scope="col" className="px-3 py-2 font-normal">Coding</th>
              <th scope="col" className="px-3 py-2 font-normal">Reasoning</th>
              <th scope="col" className="px-3 py-2 font-normal">95% Wilson</th>
            </tr>
          </thead>
          <tbody>
            {run.models.map((model) => {
              const current = rates.find((rate) => rate.modelId === model.id);
              const code = coding.find((rate) => rate.modelId === model.id);
              const reason = reasoning.find((rate) => rate.modelId === model.id);
              return (
                <tr key={model.id} className="border-b border-rule last:border-0">
                  <th scope="row" className="px-3 py-2 font-normal">
                    <button
                      type="button"
                      onClick={() => setSelected(model.id)}
                      aria-pressed={active?.modelId === model.id}
                      className="text-left text-ink underline decoration-rule underline-offset-4"
                    >
                      {model.label}
                    </button>
                  </th>
                  <td className="px-3 py-2 text-ink">{fraction(current)}</td>
                  <td className="px-3 py-2 text-ink-muted">{fraction(code)}</td>
                  <td className="px-3 py-2 text-ink-muted">{fraction(reason)}</td>
                  <td className="px-3 py-2 font-mono text-xs text-ink-faint">{interval(current)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_1fr]">
        <div>
          <h3 className="font-display text-xl text-ink">Failure categories</h3>
          <ul className="mt-3 space-y-1 text-sm text-ink-muted">
            {failures.map((item) => (
              <li key={item.failure} className="flex justify-between gap-4 border-b border-rule py-1">
                <span>{item.failure}</span>
                <span className="font-mono text-xs">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
        {active && (
          <div aria-live="polite">
            <h3 className="font-display text-xl text-ink">
              {run.models.find((model) => model.id === active.modelId)?.label} · {active.successes}/{active.n}
            </h3>
            <p className="mt-2 text-sm text-ink-muted">
              The rate is the number of passed cases in this filter divided by the number of cases. The interval is a 95% Wilson interval on that count.
            </p>
            <ul className="mt-3 divide-y divide-rule border border-rule">
              {active.cases.map((item) => (
                <li key={item.task.id} className="px-3 py-2 text-sm">
                  <span className="text-ink">{item.task.id}</span>
                  <span className="ml-3 font-mono text-xs text-ink-faint">
                    {item.result.passed ? "pass" : item.result.failure}
                  </span>
                  <p className="mt-1 text-ink-muted">{item.result.calculation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/** Renders successes/n, or an em dash when the filter has no rows. */
function fraction(rate: RateSummary | undefined): string {
  if (!rate || rate.n === 0) return "—";
  return `${rate.successes}/${rate.n}`;
}

/** Renders the Wilson interval as integer percentages. */
function interval(rate: RateSummary | undefined): string {
  if (!rate || rate.n === 0) return "—";
  const low = Math.round(rate.wilson.low * 100);
  const high = Math.round(rate.wilson.high * 100);
  return `${low}–${high}%`;
}
