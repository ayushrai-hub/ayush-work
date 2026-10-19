/**
 * Decision explorer for the ORBIT demonstration.
 *
 * Each choice shows the problem, the alternatives, the approach this page uses, the
 * trade-off, and what would change the choice. Nothing is marked as a measured result.
 *
 * Connects to:
 * - src/content/agenticPow.ts (`agenticDecisions`).
 * - src/pages/AgenticPowPage.tsx.
 */
import { useState } from "react";
import { agenticDecisions } from "../../content/agenticPow";

/** Selectable design decisions. */
export default function DecisionExplorer() {
  const [id, setId] = useState(agenticDecisions[0].id);
  const decision = agenticDecisions.find((item) => item.id === id) ?? agenticDecisions[0];
  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <div role="tablist" aria-label="Design decisions" className="flex flex-col gap-1">
        {agenticDecisions.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === decision.id}
            onClick={() => setId(item.id)}
            className={`px-3 py-2 text-left text-sm ${item.id === decision.id ? "bg-accent-soft text-ink" : "text-ink-muted"}`}
          >
            {item.title}
          </button>
        ))}
      </div>
      <article role="tabpanel" className="border border-rule p-4">
        <h3 className="font-display text-xl text-ink">{decision.title}</h3>
        <p className="mt-3 text-sm text-ink-muted">{decision.problem}</p>
        <h4 className="mt-4 label">Alternatives</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
          {decision.alternatives.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <h4 className="mt-4 label">Selected here</h4>
        <p className="mt-2 text-sm text-ink">{decision.selected}</p>
        <h4 className="mt-4 label">Trade-offs</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
          {decision.tradeoffs.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <h4 className="mt-4 label">What would change the choice</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
          {decision.changeWhen.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </article>
    </div>
  );
}
