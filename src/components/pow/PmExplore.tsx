/**
 * Discovery, framework, journey, and case-study interactions for the product-management notebook.
 *
 * Each section is a tab set. The copy comes from src/content/productManagementPow.ts, which already
 * marks facts, hypotheses, and proposals. These components do not add claims.
 *
 * Connects to:
 * - src/pages/ProductManagementPowPage.tsx
 * - src/components/pow/PmChrome.tsx
 * - src/content/productManagementPow.ts
 */
import { useState } from "react";
import {
  assumptions,
  caseBoundary,
  caseParts,
  discoveryGroups,
  frameworkStages,
  journeySteps,
} from "../../content/productManagementPow";
import { BulletList, StatusMark, TabSet } from "./PmChrome";

/** Interactive six-stage product framework. Selecting a stage shows its question, decisions, and failure. */
export function FrameworkPanel() {
  const [selected, setSelected] = useState(frameworkStages[0].id);
  return (
    <TabSet
      label="Product development stages"
      tabs={frameworkStages.map((stage) => ({ id: stage.id, label: stage.name }))}
      selected={selected}
      onSelect={setSelected}
      renderPanel={(id) => {
        const stage = frameworkStages.find((item) => item.id === id);
        if (!stage) return null;
        return (
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="label">Question</p>
              <p className="mt-2 font-display text-xl text-ink">{stage.question}</p>
              <p className="label mt-6">Evidence needed to proceed</p>
              <p className="mt-2 text-ink-muted">{stage.evidence}</p>
              <p className="label mt-6">Common failure</p>
              <p className="mt-2 text-ink">{stage.failure}</p>
            </div>
            <div className="border-t border-rule pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <p className="label">Decisions</p>
              <BulletList items={stage.decisions} />
              <p className="label mt-6">Artifacts</p>
              <BulletList items={stage.artifacts} />
            </div>
          </div>
        );
      }}
    />
  );
}

/** Problem-discovery workspace: facts, hypotheses, open questions, and proposed methods. */
export function DiscoveryPanel() {
  const [selected, setSelected] = useState(discoveryGroups[0].id);
  return (
    <div>
      <TabSet
        label="Discovery workspace"
        tabs={discoveryGroups.map((group) => ({ id: group.id, label: group.title }))}
        selected={selected}
        onSelect={setSelected}
        renderPanel={(id) => {
          const group = discoveryGroups.find((item) => item.id === id);
          if (!group) return null;
          return (
            <ol className="space-y-4">
              {group.rows.map((row) => (
                <li key={row.label} className="border-b border-rule pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-ink-faint">{row.label}</span>
                    <StatusMark kind={row.status} />
                  </div>
                  <p className="mt-2 max-w-measure leading-relaxed text-ink-muted">{row.body}</p>
                </li>
              ))}
            </ol>
          );
        }}
      />
      <div className="mt-8 border-t border-rule pt-6">
        <h3 className="font-display text-xl text-ink">Assumptions and the evidence they need</h3>
        <p className="mt-2 max-w-measure text-ink-muted">
          The methods above are a plan. They are not completed research, and there are no interview quotes on this page.
        </p>
        <ul className="mt-4 divide-y divide-rule border-y border-rule">
          {assumptions.map((row) => (
            <li key={row.label} className="grid gap-2 py-4 md:grid-cols-[12rem_minmax(0,1fr)_auto] md:items-start">
              <span className="font-medium text-ink">{row.label}</span>
              <p className="text-ink-muted">{row.body}</p>
              <StatusMark kind={row.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Candidate journey. The control list stacks vertically on small screens and runs in a row from `md`.
 * Selecting a step replaces the detail. It does not claim the later steps are shipped.
 */
export function JourneyPanel() {
  const [selected, setSelected] = useState(journeySteps[0].id);
  return (
    <TabSet
      label="User journey"
      layout="stack"
      tabs={journeySteps.map((step, index) => ({
        id: step.id,
        label: `${index + 1}. ${step.title}`,
      }))}
      selected={selected}
      onSelect={setSelected}
      renderPanel={(id) => {
        const step = journeySteps.find((item) => item.id === id);
        if (!step) return null;
        const fields = [
          ["User objective", step.objective],
          ["Friction", step.friction],
          ["Product intervention", step.intervention],
          ["Relevant data", step.data],
          ["Possible failure", step.failure],
          ["Measurement opportunity", step.measurement],
        ] as const;
        return (
          <dl className="grid gap-5 md:grid-cols-2">
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
  );
}

/** Case narrative. The boundary between the live product and the proposal stays visible above the parts. */
export function CaseStudyPanel() {
  const [selected, setSelected] = useState(caseParts[0].id);
  return (
    <div>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="font-display text-xl text-ink">In the product now</h3>
          <BulletList items={caseBoundary.now} />
        </div>
        <div>
          <h3 className="font-display text-xl text-ink">Proposed in this notebook</h3>
          <BulletList items={caseBoundary.proposed} />
        </div>
      </div>
      <div className="mt-8">
        <TabSet
          label="Case study"
          tabs={caseParts.map((part, index) => ({
            id: part.id,
            label: `${index + 1}. ${part.title}`,
          }))}
          selected={selected}
          onSelect={setSelected}
          renderPanel={(id) => {
            const part = caseParts.find((item) => item.id === id);
            if (!part) return null;
            return (
              <div>
                <StatusMark kind={part.status} />
                {part.paragraphs.map((paragraph) => (
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
