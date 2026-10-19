/**
 * Deployment-strategy comparison for the DevOps proof-of-work page.
 *
 * Scores are qualitative assumptions for a hypothetical, stored on each strategy. The component
 * does not claim a live project uses the selected strategy.
 *
 * Connects to:
 * - src/pages/DevopsPowPage.tsx
 * - deploymentStrategies and strategyCriteria in src/content/devopsPow.ts.
 */
import { useState } from "react";
import { deploymentStrategies, strategyCriteria } from "../../content/devopsPow";

/** Selector and comparison table for five deployment strategies. */
export default function StrategyCompare() {
  const [selected, setSelected] = useState(deploymentStrategies[0].id);
  const strategy = deploymentStrategies.find((item) => item.id === selected) ?? deploymentStrategies[0];

  return (
    <div>
      <p className="font-mono text-xs text-ink-faint">
        Hypothetical comparison. These levels are assumptions, not measurements from a project.
      </p>
      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Deployment strategies">
        {deploymentStrategies.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === strategy.id}
            className={`border px-3 py-2 text-sm ${
              item.id === strategy.id ? "border-ink text-ink" : "border-rule text-ink-muted"
            }`}
            onClick={() => setSelected(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="mt-6 max-w-measure text-sm leading-relaxed text-ink">{strategy.summary}</p>
      <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">{strategy.assumption}</p>
      <table className="mt-6 w-full border-collapse text-sm">
        <caption className="sr-only">Assumed tradeoffs for {strategy.name}</caption>
        <tbody>
          {strategyCriteria.map((criterion) => (
            <tr key={criterion} className="border-b border-rule">
              <th scope="row" className="py-3 pr-4 text-left font-normal text-ink-muted">
                {criterion}
              </th>
              <td className="py-3 text-ink">{strategy.scores[criterion]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
