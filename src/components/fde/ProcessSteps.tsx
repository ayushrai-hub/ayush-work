/**
 * Selectable deployment sequence for /pow/fde.
 *
 * Renders `fdeProcess` as a tablist. The panel shows the step summary and the artifacts I would
 * hand over. The surrounding page labels the sequence as an approach, not a finished engagement.
 *
 * Connects to:
 * - src/pages/FdePowPage.tsx
 * - src/content/fde.ts (`fdeProcess`)
 * - src/components/fde/roving.ts
 */
import { useRef, useState, type KeyboardEvent } from "react";
import { fdeProcess } from "../../content/fde";
import { nextRovingIndex } from "./roving";

/** Deployment sequence. Discovery starts selected. */
export default function ProcessSteps() {
  const [index, setIndex] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const step = fdeProcess[index] ?? fdeProcess[0];

  /** Moves the roving tab and focuses the newly selected step button. */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextRovingIndex(event.key, index, fdeProcess.length);
    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div role="tablist" aria-label="Deployment sequence" aria-orientation="vertical" onKeyDown={onKeyDown}>
        {fdeProcess.map((item, itemIndex) => {
          const selected = item.id === step.id;
          return (
            <button
              key={item.id}
              ref={(node) => {
                buttons.current[itemIndex] = node;
              }}
              id={`process-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="process-panel"
              tabIndex={selected ? 0 : -1}
              className={`flex min-h-11 w-full items-baseline gap-3 border-b border-rule px-1 py-3 text-left text-sm ${
                selected ? "text-ink" : "text-ink-muted hover:text-ink"
              }`}
              onClick={() => setIndex(itemIndex)}
            >
              <span className="font-mono text-xs text-ink-faint">{item.step}</span>
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>
      <div
        id="process-panel"
        role="tabpanel"
        aria-labelledby={`process-tab-${step.id}`}
        className="border border-rule p-5"
      >
        <h3 className="font-display text-xl text-ink">
          {step.step}. {step.title}
        </h3>
        <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">{step.summary}</p>
        <p className="label mt-5">What I would deliver</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink">
          {step.deliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
