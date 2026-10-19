/**
 * Four scoring methods, each shown on a stored EVALFORGE case.
 *
 * Exact match, stored unit tests, and the rubric read ScoreResult. The
 * pairwise tab reads preference cases and does not add them to the pass rate.
 * No candidate code is executed.
 *
 * Connects to:
 * - src/pages/BenchmarkEngineeringPage.tsx.
 * - scoreRun and the preference records on the demonstration run.
 */
import { useState } from "react";
import { scoreRun, type ScoredCase } from "../../lib/benchmark/aggregate";
import type { EvaluationRun } from "../../lib/benchmark/types";

/** Props: the demonstration run the examples are drawn from. */
interface ScoringPanelProps {
  run: EvaluationRun;
}

const METHODS = [
  { id: "exact-match", label: "Exact match" },
  { id: "unit-test", label: "Unit tests" },
  { id: "rubric", label: "Rubric" },
  { id: "pairwise", label: "Pairwise preference" },
] as const;

/** Method switcher. Exact match starts selected because its failure mode is easy to misread. */
export default function ScoringPanel({ run }: ScoringPanelProps) {
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("exact-match");
  const cases = scoreRun(
    run.tasks,
    run.outputs,
    run.models.map((model) => model.id),
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Scoring method">
        {METHODS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={method === item.id}
            onClick={() => setMethod(item.id)}
            className={`border px-3 py-1.5 text-sm ${
              method === item.id ? "border-ink bg-accent-soft text-ink" : "border-rule text-ink-muted"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {method === "exact-match" && <ExactSection cases={cases} />}
        {method === "unit-test" && <UnitSection cases={cases} run={run} />}
        {method === "rubric" && <RubricSection cases={cases} run={run} />}
        {method === "pairwise" && <PairSection run={run} />}
      </div>
    </div>
  );
}

/** The fee task: the same number passes or fails depending on the surrounding words. */
function ExactSection({ cases }: { cases: ScoredCase[] }) {
  const rows = cases.filter((item) => item.task.id === "reason-fee");
  return (
    <div className="space-y-4">
      <p className="max-w-measure text-sm leading-relaxed text-ink-muted">
        Exact match fits when the task defines one string, as with a status code or a single letter. It is the wrong rule when a correct explanation can be worded more than one way. Profile East’s fee response shows the difference: the amount is right, and the rule still fails.
      </p>
      {rows.map((item) => (
        <CaseLine key={item.modelId} item={item} />
      ))}
    </div>
  );
}

/** Stored tests for the range task, including the count of passes and failures. */
function UnitSection({ cases, run }: { cases: ScoredCase[]; run: EvaluationRun }) {
  const rows = cases.filter((item) => item.task.id === "code-range");
  return (
    <div className="space-y-4">
      <p className="max-w-measure text-sm leading-relaxed text-ink-muted">
        A coding task can be scored against named tests. The outcomes below are stored with the demonstration. This page does not execute the functions, and it does not accept code typed into the browser.
      </p>
      {rows.map((item) => {
        const output = run.outputs.find((entry) => entry.taskId === item.task.id && entry.modelId === item.modelId);
        const tests = output?.tests ?? [];
        const passed = tests.filter((test) => test.passed).length;
        const model = run.models.find((entry) => entry.id === item.modelId);
        return (
          <article key={item.modelId} className="border border-rule p-4">
            <h3 className="text-sm text-ink">{model?.label}</h3>
            <p className="mt-2 font-mono text-xs text-ink-faint">
              {tests.length} tests · {passed} passed · {tests.length - passed} failed
            </p>
            <ul className="mt-3 space-y-1 text-sm text-ink-muted">
              {tests.map((test) => (
                <li key={test.name}>
                  {test.name}: {test.passed ? "pass" : `fail${test.errorCategory ? ` · ${test.errorCategory}` : ""}`}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink">{item.result.passed ? "Pass" : "Fail"} · {item.result.calculation}</p>
          </article>
        );
      })}
    </div>
  );
}

/** Rubric scorecards for the explanation task, with the pass rule restated. */
function RubricSection({ cases, run }: { cases: ScoredCase[]; run: EvaluationRun }) {
  const rows = cases.filter((item) => item.task.id === "reason-rubric");
  return (
    <div className="space-y-4">
      <p className="max-w-measure text-sm leading-relaxed text-ink-muted">
        An explanation that cannot be reduced to one string uses four criteria: correctness, completeness, instruction adherence, and evidence quality. Each is 0, 1, or 2. A pass needs Correctness of at least 1 and 75 percent of the maximum. One author’s points can drift toward style. This page has no second rater, so these points only show the rule.
      </p>
      {rows.map((item) => {
        const output = run.outputs.find((entry) => entry.taskId === item.task.id && entry.modelId === item.modelId);
        const model = run.models.find((entry) => entry.id === item.modelId);
        return (
          <article key={item.modelId} className="border border-rule p-4">
            <h3 className="text-sm text-ink">{model?.label}</h3>
            <p className="mt-2 text-sm text-ink-muted">{item.response}</p>
            <ul className="mt-3 space-y-1 text-sm text-ink-muted">
              {output?.rubric?.map((row) => (
                <li key={row.criterion}>
                  {row.criterion}: {row.score}/{row.max}. {row.note}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink">{item.result.calculation}</p>
          </article>
        );
      })}
    </div>
  );
}

/** Preference cases, including a tie and the limit of a single rater. */
function PairSection({ run }: { run: EvaluationRun }) {
  return (
    <div className="space-y-4">
      <p className="max-w-measure text-sm leading-relaxed text-ink-muted">
        Pairwise comparison asks which response better meets a stated criterion. The winner is not an accuracy point, and one rater is not ground truth. Disagreement and a bias toward fluent wording should be reviewed, not averaged away. A tie stays a tie.
      </p>
      {run.preferences.map((item) => (
        <article key={item.id} className="border border-rule p-4">
          <h3 className="text-sm text-ink">{item.criterion}</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <p className="text-sm text-ink-muted"><span className="label mr-2">A</span>{item.responseA}</p>
            <p className="text-sm text-ink-muted"><span className="label mr-2">B</span>{item.responseB}</p>
          </div>
          <p className="mt-3 text-sm text-ink">
            {item.winner === "tie" ? "Tie" : `Winner: ${item.winner}`} · {item.adjudication}
          </p>
          <p className="mt-2 text-sm text-ink-muted">{item.rationale}</p>
          <p className="mt-2 text-sm text-ink-muted">{item.limitation}</p>
        </article>
      ))}
    </div>
  );
}

/** One exact-match profile: response, flag, and the calculation. */
function CaseLine({ item }: { item: ScoredCase }) {
  return (
    <article className="border border-rule p-4">
      <h3 className="font-mono text-xs text-ink-faint">{item.modelId}</h3>
      <p className="mt-2 text-sm text-ink">{item.response || "(empty response)"}</p>
      <p className="mt-2 text-sm text-ink">{item.result.passed ? "Pass" : "Fail"} · {item.result.failure}</p>
      <p className="mt-2 text-sm text-ink-muted">{item.result.calculation}</p>
    </article>
  );
}
