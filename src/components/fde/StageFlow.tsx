/**
 * Vertical stage list for the proposed RELAY workflow on /pow/fde.
 *
 * Renders `fdeStages` as a tablist. Arrow keys, Home, and End move the selection. The panel
 * states what enters, what happens, what leaves, what can fail, and how the result is checked,
 * plus whether the stage is deterministic, AI-assisted, or a human gate.
 *
 * Connects to:
 * - src/pages/FdePowPage.tsx
 * - src/content/fde.ts (`fdeStages`, `fdeStageKindLabels`)
 * - src/components/fde/roving.ts
 */
import { useRef, useState, type KeyboardEvent } from "react";
import { fdeStageKindLabels, fdeStages } from "../../content/fde";
import type { FdeStage } from "../../content/fde";
import { nextRovingIndex } from "./roving";

/** One labeled fact inside the open stage panel. */
function StageFact({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

/** Interactive workflow. The first stage is selected so the panel is never blank. */
export default function StageFlow() {
  const [index, setIndex] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const stage: FdeStage = fdeStages[index] ?? fdeStages[0];

  /** Moves the roving tab and focuses the newly selected stage button. */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextRovingIndex(event.key, index, fdeStages.length);
    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div
        role="tablist"
        aria-label="Proposed workflow stages"
        aria-orientation="vertical"
        className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
        onKeyDown={onKeyDown}
      >
        {fdeStages.map((item, itemIndex) => {
          const selected = item.id === stage.id;
          return (
            <button
              key={item.id}
              ref={(node) => {
                buttons.current[itemIndex] = node;
              }}
              id={`stage-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="stage-panel"
              tabIndex={selected ? 0 : -1}
              className={`min-h-11 shrink-0 border px-3 py-2 text-left text-sm lg:w-full ${
                selected
                  ? "border-ink bg-paper-elevated text-ink"
                  : "border-rule bg-transparent text-ink-muted hover:text-ink"
              }`}
              onClick={() => setIndex(itemIndex)}
            >
              <span className="font-mono text-xs text-ink-faint">{item.step}</span>
              <span className="mt-1 block">{item.title}</span>
            </button>
          );
        })}
      </div>
      <div
        id="stage-panel"
        role="tabpanel"
        aria-labelledby={`stage-tab-${stage.id}`}
        className="border border-rule bg-paper-elevated p-5"
      >
        <p className="label">{fdeStageKindLabels[stage.kind]}</p>
        <h3 className="mt-2 font-display text-xl text-ink">{stage.title}</h3>
        <dl className="mt-5 grid gap-4">
          <StageFact label="What enters">{stage.enters}</StageFact>
          <StageFact label="What happens">{stage.happens}</StageFact>
          <StageFact label="What comes out">{stage.leaves}</StageFact>
          <StageFact label="What can fail">{stage.fails}</StageFact>
          <StageFact label="How it is verified">{stage.verified}</StageFact>
        </dl>
      </div>
    </div>
  );
}
