/**
 * Engineering chain and the outcome roadmap for the product-management notebook.
 *
 * The chain is a proposed path from a user problem to a measurement. The roadmap is organized by
 * outcome. Non-goals and the conditions that would change the order are always visible.
 *
 * Connects to:
 * - src/pages/ProductManagementPowPage.tsx
 * - src/content/productManagementPow.ts
 * - src/components/pow/PmChrome.tsx
 */
import { useState } from "react";
import {
  engineeringConcerns,
  engineeringSteps,
  nonGoals,
  roadmap,
  roadmapTriggers,
} from "../../content/productManagementPow";
import { BulletList, StatusMark, TabSet } from "./PmChrome";

/** Selectable chain from the user problem through a proposed release. The design is marked proposed. */
export function EngineeringChain() {
  const [selected, setSelected] = useState(engineeringSteps[0].id);
  return (
    <div>
      <TabSet
        label="Product and engineering chain"
        layout="stack"
        tabs={engineeringSteps.map((step, index) => ({
          id: step.id,
          label: `${index + 1}. ${step.title}`,
        }))}
        selected={selected}
        onSelect={setSelected}
        renderPanel={(id) => {
          const step = engineeringSteps.find((item) => item.id === id);
          if (!step) return null;
          return (
            <div>
              <StatusMark kind={step.state === "fact" ? "fact" : step.state} />
              <p className="mt-3 max-w-measure leading-relaxed text-ink-muted">{step.body}</p>
            </div>
          );
        }}
      />
      <h3 className="mt-8 font-display text-xl text-ink">Technical considerations</h3>
      <p className="mt-2 max-w-measure text-ink-muted">
        These are the engineering consequences of the proposed freshness and duplicate work. They are not a description of a schema I re-read for this page.
      </p>
      <dl className="mt-4 grid gap-4 md:grid-cols-2">
        {engineeringConcerns.map((concern) => (
          <div key={concern.title} className="border-t border-rule pt-3">
            <dt className="text-ink">{concern.title}</dt>
            <dd className="mt-2 text-ink-muted">{concern.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Outcome roadmap. Selecting a theme shows the trade-off fields. Non-goals stay below the selector. */
export function RoadmapBoard() {
  const [selected, setSelected] = useState(roadmap[0].id);
  return (
    <div>
      <p className="max-w-measure text-ink-muted">
        <StatusMark kind="proposed" />{" "}
        <span className="ml-2">Proposed roadmap. It is not a committed plan, and it changes when the evidence changes.</span>
      </p>
      <div className="mt-4">
        <TabSet
          label="Roadmap themes"
          tabs={roadmap.map((item) => ({ id: item.id, label: item.title }))}
          selected={selected}
          onSelect={setSelected}
          renderPanel={(id) => {
            const item = roadmap.find((theme) => theme.id === id);
            if (!item) return null;
            const fields = [
              ["Problem addressed", item.problem],
              ["Expected user benefit", item.benefit],
              ["Dependencies", item.dependencies],
              ["Confidence", item.confidence],
              ["Effort", item.effort],
              ["Key risk", item.risk],
              ["Success measure", item.measure],
            ] as const;
            return (
              <dl className="grid gap-4 md:grid-cols-2">
                {fields.map(([label, value]) => (
                  <div key={label} className="border-t border-rule pt-3">
                    <dt className="label">{label}</dt>
                    <dd className="mt-2 leading-relaxed text-ink-muted">{value}</dd>
                  </div>
                ))}
              </dl>
            );
          }}
        />
      </div>
      <h3 className="mt-8 font-display text-xl text-ink">What would change the order</h3>
      <BulletList items={roadmapTriggers} />
      <h3 className="mt-8 font-display text-xl text-ink">Deliberate non-goals</h3>
      <p className="mt-2 max-w-measure text-ink-muted">
        Attractive, and not next. They wait until the decision problem is better understood.
      </p>
      <BulletList items={nonGoals} />
    </div>
  );
}
