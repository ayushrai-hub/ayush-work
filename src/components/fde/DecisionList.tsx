/**
 * Expandable engineering decisions for /pow/fde.
 *
 * Renders `fdeDecisions` as a tablist. The open panel shows the problem, alternatives, the
 * selected approach, the reason, the trade-off, and the evidence that would change the choice.
 *
 * Connects to:
 * - src/pages/FdePowPage.tsx
 * - src/content/fde.ts (`fdeDecisions`)
 * - src/components/fde/roving.ts
 */
import { useRef, useState, type KeyboardEvent } from "react";
import { fdeDecisions } from "../../content/fde";
import { nextRovingIndex } from "./roving";

/** Decision browser. The first decision starts open. */
export default function DecisionList() {
  const [index, setIndex] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const decision = fdeDecisions[index] ?? fdeDecisions[0];

  /** Moves the roving tab and focuses the newly selected decision button. */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextRovingIndex(event.key, index, fdeDecisions.length);
    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div role="tablist" aria-label="Engineering decisions" aria-orientation="vertical" onKeyDown={onKeyDown}>
        {fdeDecisions.map((item, itemIndex) => {
          const selected = item.id === decision.id;
          return (
            <button
              key={item.id}
              ref={(node) => {
                buttons.current[itemIndex] = node;
              }}
              id={`decision-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="decision-panel"
              tabIndex={selected ? 0 : -1}
              className={`block min-h-11 w-full border-b border-rule px-1 py-3 text-left text-sm ${
                selected ? "text-ink" : "text-ink-muted hover:text-ink"
              }`}
              onClick={() => setIndex(itemIndex)}
            >
              <span className="font-mono text-xs text-ink-faint">
                {String(itemIndex + 1).padStart(2, "0")}
              </span>
              <span className="mt-1 block leading-snug">{item.title}</span>
            </button>
          );
        })}
      </div>
      <div
        id="decision-panel"
        role="tabpanel"
        aria-labelledby={`decision-tab-${decision.id}`}
        className="border border-rule bg-paper-elevated p-5"
      >
        <h3 className="font-display text-xl text-ink">{decision.title}</h3>
        <dl className="mt-5 grid gap-4 text-sm leading-relaxed">
          <div>
            <dt className="label">Problem</dt>
            <dd className="mt-1 text-ink">{decision.problem}</dd>
          </div>
          <div>
            <dt className="label">Alternatives</dt>
            <dd>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-ink">
                {decision.alternatives.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="label">Selected approach</dt>
            <dd className="mt-1 text-ink">{decision.selected}</dd>
          </div>
          <div>
            <dt className="label">Reason</dt>
            <dd className="mt-1 text-ink">{decision.reason}</dd>
          </div>
          <div>
            <dt className="label">Trade-off</dt>
            <dd className="mt-1 text-ink">{decision.tradeoff}</dd>
          </div>
          <div>
            <dt className="label">What would change the decision</dt>
            <dd className="mt-1 text-ink">{decision.revisit}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
