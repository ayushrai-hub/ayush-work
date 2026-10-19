/**
 * Statistical reading of the EVALFORGE demonstration sample.
 *
 * Shows sample size, Wilson intervals, a paired sign test, an unpaired
 * overlap check, a Bonferroni cutoff for the comparisons this page makes
 * available, and a difficulty slice that changes the counts. The slice is
 * the same fixture with rows removed. It is not a new draw from a shifted
 * population.
 *
 * Connects to:
 * - src/pages/BenchmarkEngineeringPage.tsx.
 * - aggregate.ts and stats.ts.
 */
import { useMemo, useState } from "react";
import {
  comparePaired,
  filterCases,
  rateBy,
  scoreRun,
} from "../../lib/benchmark/aggregate";
import {
  bonferroniAlpha,
  comparisonNote,
  intervalsOverlap,
} from "../../lib/benchmark/stats";
import type { EvaluationRun } from "../../lib/benchmark/types";

/** Props: the demonstration run. */
interface ReliabilityPanelProps {
  run: EvaluationRun;
}

/** Difficulty slice and a paired comparison of two profiles. */
export default function ReliabilityPanel({ run }: ReliabilityPanelProps) {
  const ids = run.models.map((model) => model.id);
  const [difficulty, setDifficulty] = useState("all");
  const [modelA, setModelA] = useState(ids[0] ?? "");
  const [modelB, setModelB] = useState(ids[1] ?? "");
  const cases = useMemo(
    () =>
      scoreRun(
        run.tasks,
        run.outputs,
        run.models.map((model) => model.id),
      ),
    [run],
  );
  const sliced = filterCases(cases, difficulty);
  const rates = rateBy(sliced, "all");
  const paired = comparePaired(sliced, modelA, modelB);
  const rateA = rates.find((rate) => rate.modelId === modelA);
  const rateB = rates.find((rate) => rate.modelId === modelB);
  const overlap =
    rateA && rateB ? intervalsOverlap(rateA.wilson, rateB.wilson) : true;
  const pairs = (run.models.length * (run.models.length - 1)) / 2;
  const family = pairs * 2;
  const alpha = bonferroniAlpha(family);

  return (
    <div className="space-y-8">
      <p className="max-w-measure text-sm leading-relaxed text-ink-muted">
        Eight accepted tasks is a small sample. A different eight tasks could reorder these profiles. The intervals below are recomputed from the rows in the selected slice.
      </p>
      <fieldset>
        <legend className="label">Dataset slice</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            ["all", "All difficulties"],
            ["easy", "Easy only"],
            ["medium", "Medium only"],
            ["hard", "Hard only"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={difficulty === value}
              onClick={() => setDifficulty(value)}
              className={`border px-3 py-1.5 text-sm ${
                difficulty === value ? "border-ink bg-accent-soft text-ink" : "border-rule text-ink-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      <ul className="grid gap-3 md:grid-cols-3">
        {rates.map((rate) => {
          const model = run.models.find((item) => item.id === rate.modelId);
          const low = Math.round(rate.wilson.low * 100);
          const high = Math.round(rate.wilson.high * 100);
          return (
            <li key={rate.modelId} className="border border-rule p-4">
              <h3 className="text-sm text-ink">{model?.label}</h3>
              <p className="mt-2 font-mono text-sm text-ink">
                {rate.successes}/{rate.n}
              </p>
              <p className="mt-1 text-sm text-ink-muted">95% Wilson {low}–{high}%</p>
              <div className="mt-3 h-2 bg-rule" aria-hidden>
                <div
                  className="h-2 bg-accent"
                  style={{ marginLeft: `${low}%`, width: `${Math.max(high - low, 1)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border border-rule p-4">
        <h3 className="font-display text-xl text-ink">Paired and unpaired</h3>
        <p className="mt-2 max-w-measure text-sm text-ink-muted">
          These profiles saw the same tasks, so a paired comparison uses the tasks where they disagree. An unpaired reading treats the two pass rates as independent samples and ignores that shared set. The unpaired check here only asks whether the Wilson intervals overlap.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <ProfileSelect label="First profile" value={modelA} ids={ids} models={run.models} onChange={setModelA} />
          <ProfileSelect label="Second profile" value={modelB} ids={ids} models={run.models} onChange={setModelB} />
        </div>
        {modelA === modelB ? (
          <p className="mt-4 text-sm text-ink-muted">Choose two different profiles. A profile compared with itself has no discordant tasks.</p>
        ) : (
          <div className="mt-4 text-sm text-ink-muted">
            <p>
              {paired.n} tasks in this slice · {paired.bothPass} both pass · {paired.bothFail} both fail · {paired.aOnly} only the first · {paired.bOnly} only the second.
            </p>
            <p className="mt-2">
              Exact sign test on {paired.discordant.n} discordant task{paired.discordant.n === 1 ? "" : "s"}: p = {paired.discordant.pValue.toFixed(3)}. Unadjusted.
            </p>
            <p className="mt-2">{rateA && rateB ? comparisonNote(overlap, rateA.n) : ""}</p>
          </div>
        )}
      </div>
      <div className="border border-rule p-4 text-sm leading-relaxed text-ink-muted">
        <h3 className="font-display text-xl text-ink">Multiple comparisons</h3>
        <p className="mt-2">
          {pairs} unordered profile pairs, each read in two categories, make {family} contrasts available on this page. A Bonferroni cutoff for a family of that size, starting from 0.05, is {alpha.toFixed(4)}. This demonstration did not pre-register one contrast. Reporting only the slice that separates two profiles would overstate the sample.
        </p>
        <h3 className="mt-6 font-display text-xl text-ink">Dataset composition</h3>
        <p className="mt-2">
          Changing the difficulty control removes rows from the same eight tasks. The pass count moves because the mixture changed, not because a new sample was drawn. If a later batch were all hard coding tasks, the interval from this slice would not transfer. That is a shift in the task mixture. Detecting it requires the new tasks, not a second chart of these ones.
        </p>
      </div>
    </div>
  );
}

/** Selects a demonstration profile by id. */
function ProfileSelect({
  label,
  value,
  ids,
  models,
  onChange,
}: {
  label: string;
  value: string;
  ids: string[];
  models: EvaluationRun["models"];
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm text-ink">
      <span className="label block">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 border border-rule bg-paper px-2 py-1 text-sm text-ink"
      >
        {ids.map((id) => (
          <option key={id} value={id}>
            {models.find((model) => model.id === id)?.label ?? id}
          </option>
        ))}
      </select>
    </label>
  );
}
