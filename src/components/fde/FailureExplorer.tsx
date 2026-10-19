/**
 * Failure-scenario explorer for the proposed RELAY design on /pow/fde.
 *
 * Renders `fdeFailures` as a tablist. The panel states the behavior I would design. Copy elsewhere
 * on the page says these mechanisms are not running services.
 *
 * Connects to:
 * - src/pages/FdePowPage.tsx
 * - src/content/fde.ts (`fdeFailures`)
 * - src/components/fde/roving.ts
 */
import { useRef, useState, type KeyboardEvent } from "react";
import { fdeFailures } from "../../content/fde";
import { nextRovingIndex } from "./roving";

/** Failure browser. The first scenario starts selected. */
export default function FailureExplorer() {
  const [index, setIndex] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const failure = fdeFailures[index] ?? fdeFailures[0];

  /** Moves the roving tab and focuses the newly selected scenario button. */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextRovingIndex(event.key, index, fdeFailures.length);
    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="grid gap-4 md:grid-cols-[16rem_minmax(0,1fr)]">
      <div role="tablist" aria-label="Failure scenarios" aria-orientation="vertical" onKeyDown={onKeyDown}>
        {fdeFailures.map((item, itemIndex) => {
          const selected = item.id === failure.id;
          return (
            <button
              key={item.id}
              ref={(node) => {
                buttons.current[itemIndex] = node;
              }}
              id={`failure-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="failure-panel"
              tabIndex={selected ? 0 : -1}
              className={`block min-h-11 w-full border-b border-rule px-1 py-3 text-left text-sm ${
                selected ? "text-ink" : "text-ink-muted hover:text-ink"
              }`}
              onClick={() => setIndex(itemIndex)}
            >
              {item.title}
            </button>
          );
        })}
      </div>
      <div
        id="failure-panel"
        role="tabpanel"
        aria-labelledby={`failure-tab-${failure.id}`}
        className="border border-rule bg-paper p-5"
      >
        <p className="label">Proposed behavior</p>
        <h3 className="mt-2 font-display text-xl text-ink">{failure.title}</h3>
        <p className="mt-4 max-w-measure text-sm leading-relaxed text-ink">{failure.behavior}</p>
      </div>
    </div>
  );
}
