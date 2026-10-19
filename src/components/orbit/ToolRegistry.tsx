/**
 * Closed tool registry with a local caller.
 *
 * The visitor can submit the published example or a malformed payload. Writes use a
 * checkbox that is not part of the JSON. The registry store is separate from the workbench run.
 *
 * Connects to:
 * - src/lib/orbit/tools.ts and fixtures.ts.
 * - src/pages/AgenticPowPage.tsx.
 */
import { useState } from "react";
import { createStore } from "../../lib/orbit/fixtures";
import { TOOL_CONTRACTS, invokeTool, validateToolInput } from "../../lib/orbit/tools";
import type { DemoStore, ToolContract, ToolResult } from "../../lib/orbit/types";
import { JsonBlock } from "./blocks";

/** Interactive contracts and a schema-checked caller. */
export default function ToolRegistry() {
  const [name, setName] = useState(TOOL_CONTRACTS[0].name);
  const [raw, setRaw] = useState(JSON.stringify(TOOL_CONTRACTS[0].example, null, 2));
  const [approved, setApproved] = useState(false);
  const [store, setStore] = useState<DemoStore>(() => createStore());
  const [result, setResult] = useState<ToolResult | { ok: false; message: string } | null>(null);
  const contract = TOOL_CONTRACTS.find((item) => item.name === name) ?? TOOL_CONTRACTS[0];

  /** Load a contract's example or its malformed sample into the editor. */
  function load(next: ToolContract, malformed: boolean) {
    setName(next.name);
    setRaw(JSON.stringify(malformed ? next.malformed : next.example, null, 2));
    setApproved(false);
    setResult(null);
  }

  /** Parse JSON, validate, and invoke against the registry's own store. */
  function submit() {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      setResult({ ok: false, message: "The arguments are not valid JSON." });
      return;
    }
    const validated = validateToolInput(name, parsed);
    if (!validated.ok) {
      setResult({ ok: false, message: validated.message });
      return;
    }
    const called = invokeTool(store, validated.name, validated.data, { approved });
    setStore(called.store);
    setResult(called);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
      <ul className="space-y-1" aria-label="Tools">
        {TOOL_CONTRACTS.map((tool) => (
          <li key={tool.name}>
            <button
              type="button"
              aria-pressed={tool.name === name}
              onClick={() => load(tool, false)}
              className={`w-full px-2 py-2 text-left font-mono text-xs ${tool.name === name ? "bg-accent-soft text-ink" : "text-ink-muted"}`}
            >
              {tool.name}
              <span className="mt-1 block font-sans text-[11px] uppercase tracking-label text-ink-faint">
                {tool.sideEffect}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div>
        <h3 className="font-display text-xl text-ink">{contract.name}</h3>
        <p className="mt-2 max-w-measure text-sm text-ink-muted">{contract.description}</p>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="label">Input schema</dt>
            <dd className="mt-1 font-mono text-xs text-ink">{contract.inputSchema}</dd>
          </div>
          <div>
            <dt className="label">Output schema</dt>
            <dd className="mt-1 font-mono text-xs text-ink">{contract.outputSchema}</dd>
          </div>
          <div>
            <dt className="label">Permissions</dt>
            <dd className="mt-1 text-ink-muted">{contract.permissions}</dd>
          </div>
          <div>
            <dt className="label">Side effect</dt>
            <dd className="mt-1 text-ink-muted">{contract.sideEffect}</dd>
          </div>
        </dl>
        <h4 className="mt-4 label">Failure modes</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
          {contract.failureModes.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <h4 className="mt-4 label">Validation</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
          {contract.validation.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <label className="mt-6 block text-sm text-ink" htmlFor="orbit-tool-json">
          Tool arguments (JSON)
        </label>
        <textarea
          id="orbit-tool-json"
          className="mt-2 w-full border border-rule bg-paper p-3 font-mono text-xs text-ink"
          rows={6}
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
        />
        {contract.sideEffect === "write" && (
          <label className="mt-3 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={approved}
              onChange={(event) => setApproved(event.target.checked)}
            />
            Controller approval (not part of the JSON payload)
          </label>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={submit}>
            Call tool
          </button>
          <button type="button" className="btn-secondary" onClick={() => load(contract, true)}>
            Load malformed example
          </button>
          <button type="button" className="btn-ghost" onClick={() => { setStore(createStore()); setResult(null); }}>
            Reset registry store
          </button>
        </div>
        <p className="mt-3 font-mono text-xs text-ink-faint">
          Registry writes: {store.writes}. Handler calls: {store.handlerCalls}. This store is not the workbench run.
        </p>
        {result && (
          <div role="status" className="mt-3">
            {"message" in result && !("code" in result) ? (
              <p className="text-sm text-signal">{result.message}</p>
            ) : (
              <JsonBlock value={result} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
