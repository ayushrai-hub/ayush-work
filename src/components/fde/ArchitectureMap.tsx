/**
 * Clickable architecture layers for the proposed RELAY system on /pow/fde.
 *
 * Each layer in `fdeLayers` is a tab. The panel lists components, responsibility, interfaces,
 * and the boundary with neighboring parts of the system. Arrow keys move the selection.
 *
 * Connects to:
 * - src/pages/FdePowPage.tsx
 * - src/content/fde.ts (`fdeLayers`)
 * - src/components/fde/roving.ts
 */
import { useRef, useState, type KeyboardEvent } from "react";
import { fdeLayers } from "../../content/fde";
import { nextRovingIndex } from "./roving";

/** Proposed architecture. The first layer starts selected. */
export default function ArchitectureMap() {
  const [index, setIndex] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const layer = fdeLayers[index] ?? fdeLayers[0];

  /** Moves the roving tab and focuses the newly selected layer button. */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextRovingIndex(event.key, index, fdeLayers.length);
    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div
        role="tablist"
        aria-label="Proposed architecture layers"
        aria-orientation="vertical"
        className="flex flex-col"
        onKeyDown={onKeyDown}
      >
        {fdeLayers.map((item, itemIndex) => {
          const selected = item.id === layer.id;
          return (
            <button
              key={item.id}
              ref={(node) => {
                buttons.current[itemIndex] = node;
              }}
              id={`layer-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="layer-panel"
              tabIndex={selected ? 0 : -1}
              className={`min-h-11 border-b border-l-2 px-3 py-3 text-left text-sm ${
                selected
                  ? "border-b-rule border-l-accent bg-paper-elevated text-ink"
                  : "border-b-rule border-l-transparent text-ink-muted hover:text-ink"
              }`}
              onClick={() => setIndex(itemIndex)}
            >
              <span className="font-mono text-xs text-ink-faint">
                {String(itemIndex + 1).padStart(2, "0")}
              </span>
              <span className="mt-1 block">{item.name}</span>
            </button>
          );
        })}
      </div>
      <div
        id="layer-panel"
        role="tabpanel"
        aria-labelledby={`layer-tab-${layer.id}`}
        className="border border-rule p-5"
      >
        <h3 className="font-display text-xl text-ink">{layer.name}</h3>
        <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">{layer.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {layer.components.map((component) => (
            <li key={component} className="border border-rule px-2 py-1 font-mono text-xs text-ink">
              {component}
            </li>
          ))}
        </ul>
        <dl className="mt-5 grid gap-4 text-sm leading-relaxed">
          <div>
            <dt className="label">Responsibility</dt>
            <dd className="mt-1 text-ink">{layer.responsibility}</dd>
          </div>
          <div>
            <dt className="label">Interfaces</dt>
            <dd className="mt-1 text-ink">{layer.interfaces}</dd>
          </div>
          <div>
            <dt className="label">Boundary</dt>
            <dd className="mt-1 text-ink">{layer.boundary}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
