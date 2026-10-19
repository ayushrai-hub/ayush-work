/**
 * Prioritization explorer and the example PRD for the product-management notebook.
 *
 * Scores start from the estimates in content and change only in component state. The ranking calls
 * `rankInitiatives`. Resetting restores the starting estimates. Nothing here is written back to a product.
 *
 * Connects to:
 * - src/pages/ProductManagementPowPage.tsx
 * - src/lib/productManagementScore.ts
 * - src/content/productManagementPow.ts (`initiatives`, `prdSections`, `scoreLimitations`)
 */
import { useMemo, useState } from "react";
import { initiatives, prdSections, scoreLimitations } from "../../content/productManagementPow";
import {
  clampScore,
  DEFAULT_WEIGHTS,
  explainScore,
  normalizeWeights,
  rankInitiatives,
  type ScoreInput,
} from "../../lib/productManagementScore";
import { BulletList } from "./PmChrome";

const FIELDS: { key: keyof ScoreInput; label: string }[] = [
  { key: "userValue", label: "User value" },
  { key: "alignment", label: "Strategic alignment" },
  { key: "confidence", label: "Confidence in the evidence" },
  { key: "effort", label: "Implementation effort" },
  { key: "risk", label: "Operational or technical risk" },
];

/** Builds the initial estimate map from the content record. */
function startingEstimates(): Record<string, ScoreInput> {
  return Object.fromEntries(initiatives.map((item) => [item.id, { ...item.estimate }]));
}

/**
 * Adjustable 1–5 scores and a user-value weight. The ranked list follows `rankInitiatives`.
 * The formula and its limits stay on screen so a high rank cannot be read as validated impact.
 */
export function PrioritizationExplorer() {
  const [estimates, setEstimates] = useState(startingEstimates);
  const [userWeight, setUserWeight] = useState(DEFAULT_WEIGHTS.userValue);
  const [selected, setSelected] = useState(initiatives[0].id);
  const weights = normalizeWeights(userWeight);
  const ranked = rankInitiatives(
    initiatives.map((item) => ({ ...item, ...estimates[item.id] })),
    weights,
  );
  const startingRank = useMemo(() => {
    const start = rankInitiatives(
      initiatives.map((item) => ({ ...item, ...item.estimate })),
      DEFAULT_WEIGHTS,
    );
    return new Map(start.map((item) => [item.id, item.rank]));
  }, []);
  const current = ranked.find((item) => item.id === selected) ?? ranked[0];

  /** Writes one clamped field for the initiative currently being edited. */
  const setField = (field: keyof ScoreInput, value: number) => {
    setEstimates((existing) => ({
      ...existing,
      [current.id]: { ...existing[current.id], [field]: clampScore(value) },
    }));
  };

  /** Restores the notebook's starting estimates and the default user-value weight. */
  const reset = () => {
    setEstimates(startingEstimates());
    setUserWeight(DEFAULT_WEIGHTS.userValue);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div>
        <ol aria-label="Initiative ranking" className="divide-y divide-rule border-y border-rule">
          {ranked.map((item) => {
            const start = startingRank.get(item.id);
            const active = item.id === current.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelected(item.id)}
                  aria-pressed={active}
                  className={`flex w-full items-baseline justify-between gap-4 py-3 text-left ${
                    active ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <span>
                    <span className="mr-3 font-mono text-xs text-ink-faint">{item.rank}</span>
                    {item.title}
                  </span>
                  <span className="font-mono text-sm">{item.score.toFixed(2)}</span>
                </button>
                {start && start !== item.rank ? (
                  <p className="pb-2 font-mono text-xs text-ink-faint">Starting rank {start}</p>
                ) : null}
              </li>
            );
          })}
        </ol>
        <p className="mt-4 max-w-measure text-sm text-ink-muted">
          {current.state} Changing a score changes this notebook only.
        </p>
      </div>
      <div className="border border-rule p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl text-ink">{current.title}</h3>
          <button type="button" onClick={reset} className="btn-secondary px-3 py-1.5 text-xs">
            Reset scores
          </button>
        </div>
        <p className="mt-2 text-sm text-ink-muted">{current.summary}</p>
        <div className="mt-5 space-y-4">
          {FIELDS.map((field) => (
            <label key={field.key} className="block">
              <span className="flex items-baseline justify-between gap-3 font-mono text-xs text-ink-faint">
                <span>{field.label}</span>
                <span>{current[field.key]}</span>
              </span>
              <input
                className="mt-2 w-full accent-accent"
                type="range"
                min={1}
                max={5}
                step={1}
                value={current[field.key]}
                aria-label={`${current.title} ${field.label}`}
                onChange={(event) => setField(field.key, Number(event.target.value))}
              />
            </label>
          ))}
          <label className="block">
            <span className="flex items-baseline justify-between gap-3 font-mono text-xs text-ink-faint">
              <span>Weight on user value</span>
              <span>{weights.userValue.toFixed(2)}</span>
            </span>
            <input
              className="mt-2 w-full accent-accent"
              type="range"
              min={0.2}
              max={0.8}
              step={0.05}
              value={userWeight}
              aria-label="Weight on user value versus strategic alignment"
              onChange={(event) => setUserWeight(Number(event.target.value))}
            />
          </label>
        </div>
        <p className="mt-5 font-mono text-xs leading-relaxed text-ink">{explainScore(weights)}</p>
        <p className="label mt-4">Limitations</p>
        <BulletList items={scoreLimitations} />
      </div>
    </div>
  );
}

/**
 * Example PRD, opened as disclosure sections so each part can be read without leaving the page.
 * The first section starts open. The requirements are a specification, not a claim of current behavior.
 */
export function PrdDocument() {
  return (
    <div className="border-t border-rule">
      {prdSections.map((section, index) => (
        <details key={section.id} open={index === 0} className="border-b border-rule">
          <summary className="cursor-pointer py-3 text-ink">{section.heading}</summary>
          <div className="pb-4">
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-2 max-w-measure leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
            {section.items ? <BulletList items={section.items} /> : null}
          </div>
        </details>
      ))}
    </div>
  );
}
