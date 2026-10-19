/**
 * Metric definitions, the proposed experiment, and the synthetic funnel.
 *
 * Metric baselines are the words “Baseline not yet measured”. The experiment is labeled proposed.
 * Funnel counts come from `syntheticFunnel` and are named as demonstration data in the section chrome.
 *
 * Connects to:
 * - src/pages/ProductManagementPowPage.tsx
 * - src/content/productManagementPow.ts
 * - src/components/pow/PmChrome.tsx
 */
import { useState } from "react";
import {
  analyticsLimits,
  experimentBlocks,
  funnelSteps,
  metrics,
  syntheticFunnel,
  syntheticSegments,
  syntheticStepRatio,
  syntheticWindows,
} from "../../content/productManagementPow";
import { BulletList, StatusMark, TabSet } from "./PmChrome";

/** Selectable metric definitions. The group label keeps the north star from looking adopted. */
export function MetricPanel() {
  const [selected, setSelected] = useState(metrics[0].id);
  return (
    <TabSet
      label="Metric definitions"
      tabs={metrics.map((metric) => ({ id: metric.id, label: metric.name }))}
      selected={selected}
      onSelect={setSelected}
      renderPanel={(id) => {
        const metric = metrics.find((item) => item.id === id);
        if (!metric) return null;
        const fields = [
          ["Definition", metric.definition],
          ["Numerator", metric.numerator],
          ["Denominator", metric.denominator],
          ["Time window", metric.window],
          ["Data source", metric.source],
          ["Segmentation", metric.segmentation],
          ["Known limitation", metric.limitation],
          ["Why it matters", metric.why],
        ] as const;
        return (
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusMark kind="unmeasured" />
              <span className="font-mono text-xs text-ink-faint">{metric.group}</span>
            </div>
            <p className="mt-3 font-mono text-sm text-ink">Baseline not yet measured.</p>
            <dl className="mt-4 grid gap-4 md:grid-cols-2">
              {fields.map(([label, value]) => (
                <div key={label} className="border-t border-rule pt-3">
                  <dt className="label">{label}</dt>
                  <dd className="mt-2 leading-relaxed text-ink-muted">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      }}
    />
  );
}

/** Proposed experiment, one block at a time. The status line is outside the tabs so it cannot be scrolled away as easily. */
export function ExperimentExplorer() {
  const [selected, setSelected] = useState(experimentBlocks[0].id);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <StatusMark kind="proposed" />
        <p className="text-sm text-ink">Proposed experiment. It has not been run.</p>
      </div>
      <div className="mt-4">
        <TabSet
          label="Experiment design"
          tabs={experimentBlocks.map((block) => ({ id: block.id, label: block.title }))}
          selected={selected}
          onSelect={setSelected}
          renderPanel={(id) => {
            const block = experimentBlocks.find((item) => item.id === id);
            if (!block) return null;
            return (
              <div>
                {block.body.map((paragraph) => (
                  <p key={paragraph} className="mt-3 max-w-measure leading-relaxed text-ink-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

/**
 * Synthetic funnel with segment and window filters.
 * Ratios are shares of the previous illustrated step. A zero previous step renders an em dash.
 */
export function AnalyticsSample() {
  const [segment, setSegment] = useState<(typeof syntheticSegments)[number]["id"]>("all");
  const [windowId, setWindowId] = useState<(typeof syntheticWindows)[number]["id"]>("28d");
  const counts = syntheticFunnel[`${segment}:${windowId}`] ?? syntheticFunnel["all:28d"];
  const peak = Math.max(...counts, 1);

  return (
    <div>
      <div className="border border-signal/40 bg-paper-elevated px-4 py-3">
        <p className="font-mono text-xs uppercase tracking-label text-signal">Synthetic demonstration data</p>
        <p className="mt-2 max-w-measure text-sm text-ink-muted">
          These numbers were written for this page so a funnel can be inspected. They are not RevenueRoles
          performance, and they are not a forecast.
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-4">
        <label className="block text-sm" htmlFor="synthetic-segment">
          <span className="label">Segment</span>
          <select
            id="synthetic-segment"
            className="mt-2 block border border-rule bg-paper px-3 py-2 text-ink"
            value={segment}
            onChange={(event) => setSegment(event.target.value as typeof segment)}
          >
            {syntheticSegments.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm" htmlFor="synthetic-window">
          <span className="label">Window</span>
          <select
            id="synthetic-window"
            className="mt-2 block border border-rule bg-paper px-3 py-2 text-ink"
            value={windowId}
            onChange={(event) => setWindowId(event.target.value as typeof windowId)}
          >
            {syntheticWindows.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <table className="mt-6 w-full border-t border-rule text-left text-sm">
        <caption className="sr-only">Synthetic funnel counts for the selected segment and window</caption>
        <thead>
          <tr className="border-b border-rule font-mono text-xs text-ink-faint">
            <th scope="col" className="py-2 font-normal">Step</th>
            <th scope="col" className="py-2 font-normal">Synthetic count</th>
            <th scope="col" className="py-2 font-normal">Share of previous step</th>
          </tr>
        </thead>
        <tbody>
          {funnelSteps.map((step, index) => {
            const count = counts[index] ?? 0;
            const ratio = index === 0 ? null : syntheticStepRatio(count, counts[index - 1] ?? 0);
            return (
              <tr key={step.id} className="border-b border-rule align-top">
                <th scope="row" className="py-3 pr-4 font-normal text-ink">
                  {step.name}
                  <span className="mt-1 block font-mono text-xs text-ink-faint">{step.event}</span>
                </th>
                <td className="py-3 pr-4">
                  <span className="font-mono text-ink">{count}</span>
                  <span className="mt-2 block h-1.5 max-w-[12rem] bg-rule" aria-hidden="true">
                    <span className="block h-1.5 bg-accent" style={{ width: `${Math.round((count / peak) * 100)}%` }} />
                  </span>
                </td>
                <td className="py-3 font-mono text-ink-muted">{ratio === null ? "—" : `${ratio}%`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-6">
        <h3 className="font-display text-xl text-ink">Event definitions</h3>
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {funnelSteps.map((step) => (
            <li key={step.id} className="py-3">
              <p className="font-mono text-xs text-ink-faint">{step.event}</p>
              <p className="mt-1 text-ink-muted">{step.instrumentation}</p>
            </li>
          ))}
        </ul>
      </div>
      <p className="label mt-6">What this sample can establish</p>
      <BulletList items={analyticsLimits} />
    </div>
  );
}
