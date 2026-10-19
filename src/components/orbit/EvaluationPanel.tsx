/**
 * Illustrative evaluation panel for the scripted ORBIT corpus.
 *
 * Numbers come from `evaluateDemoCorpus`. The panel says they are not production results
 * and not model scores. Cost and latency stay "Not measured".
 *
 * Connects to:
 * - src/lib/orbit/simulation.ts.
 * - src/pages/AgenticPowPage.tsx.
 */
import { useMemo } from "react";
import { evaluateDemoCorpus } from "../../lib/orbit/simulation";

/** Metric definitions and the values computed from the fixtures. */
export default function EvaluationPanel() {
  const metrics = useMemo(() => evaluateDemoCorpus(), []);
  return (
    <div>
      <p className="max-w-measure text-sm text-ink-muted">
        Illustrative metrics computed from the scenarios on this page. Not production traffic.
        Not model scores. A run that writes without approval, or that fails verification, is not counted as complete.
      </p>
      <div className="mt-6 max-w-full overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <caption className="sr-only">Illustrative agent metrics from scripted scenarios</caption>
          <thead>
            <tr className="border-b border-rule text-ink-faint">
              <th scope="col" className="py-2 pr-4 font-mono text-xs uppercase tracking-label">Metric</th>
              <th scope="col" className="py-2 pr-4 font-mono text-xs uppercase tracking-label">Value</th>
              <th scope="col" className="py-2 font-mono text-xs uppercase tracking-label">How it is computed</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.id} className="border-b border-rule align-top">
                <th scope="row" className="py-3 pr-4 font-normal text-ink">
                  {metric.name}
                  <span className="mt-1 block text-xs text-ink-muted">{metric.definition}</span>
                </th>
                <td className="py-3 pr-4 text-ink">{metric.value}</td>
                <td className="py-3 text-ink-muted">{metric.howComputed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
