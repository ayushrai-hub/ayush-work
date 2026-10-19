/**
 * Clickable architecture map for ORBIT.
 *
 * Selecting a node shows what it receives, what it emits, and who is allowed to decide.
 * The loop under the map is the bounded execution order. Nothing here is animated as a live system.
 *
 * Connects to:
 * - src/content/agenticPow.ts (`agenticNodes`, `agenticLoop`).
 * - src/pages/AgenticPowPage.tsx.
 */
import { useState } from "react";
import { agenticLoop, agenticNodes } from "../../content/agenticPow";

/** Node list, detail, and the execution loop. */
export default function ArchitectureMap() {
  const [id, setId] = useState(agenticNodes[0].id);
  const node = agenticNodes.find((item) => item.id === id) ?? agenticNodes[0];
  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {agenticNodes.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === node.id}
            onClick={() => setId(item.id)}
            className={`border px-3 py-3 text-left text-sm ${item.id === node.id ? "border-ink" : "border-rule"}`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="mt-6 max-w-measure border border-rule p-4" aria-live="polite">
        <h3 className="font-display text-xl text-ink">{node.name}</h3>
        <p className="mt-2 text-sm text-ink-muted">{node.summary}</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="label">Receives</dt>
            <dd className="mt-1 text-ink-muted">{node.receives}</dd>
          </div>
          <div>
            <dt className="label">Emits</dt>
            <dd className="mt-1 text-ink-muted">{node.emits}</dd>
          </div>
          <div>
            <dt className="label">Who decides</dt>
            <dd className="mt-1 text-ink-muted">{node.authority}</dd>
          </div>
        </dl>
      </div>
      <ol className="mt-6 flex flex-wrap gap-2" aria-label="Bounded execution loop">
        {agenticLoop.map((item, index) => (
          <li key={item} className="border border-rule px-2 py-1 font-mono text-xs text-ink-muted">
            {index + 1}. {item}
          </li>
        ))}
      </ol>
    </div>
  );
}
