/**
 * Inspectors for the rest of the founding-engineer page.
 *
 * Timeline, decision log, constraint choices, test map, system map, and the synthetic incident
 * each keep their own selection in component state. None of them call a backend.
 *
 * Connects to:
 * - src/content/foundingEngineer.ts.
 * - src/pages/FoundingEngineerPowPage.tsx mounts each inspector once.
 */
import { useState } from "react";
import {
  constraintScenarios,
  decisionRecords,
  stackViews,
  syntheticIncident,
  testingGuide,
  timelineStages,
} from "../../../content/foundingEngineer";

/** Reference timeline. Selecting a stage shows its tasks. */
export function EngineeringTimeline() {
  const [stageId, setStageId] = useState(timelineStages[0].id);
  const stage = timelineStages.find((item) => item.id === stageId) ?? timelineStages[0];
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto" role="listbox" aria-label="Engineering timeline">
        {timelineStages.map((item) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={item.id === stage.id}
            className={item.id === stage.id ? "btn-primary shrink-0" : "btn-secondary shrink-0"}
            onClick={() => setStageId(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="mt-4 border border-rule p-4 text-sm leading-relaxed text-ink-muted">
        <h3 className="font-display text-lg text-ink">{stage.name}</h3>
        <p className="mt-2">Deliverable: {stage.deliverable}</p>
        <p className="mt-2">Risk: {stage.risk}</p>
        <ul className="mt-2 list-disc pl-5">
          {stage.tasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Decision records. One record is open at a time. */
export function DecisionLog() {
  const [recordId, setRecordId] = useState(decisionRecords[0].id);
  const record = decisionRecords.find((item) => item.id === recordId) ?? decisionRecords[0];
  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
      <div className="flex flex-col gap-2" role="listbox" aria-label="Architecture decisions">
        {decisionRecords.map((item) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={item.id === record.id}
            className={item.id === record.id ? "btn-primary text-left" : "btn-secondary text-left"}
            onClick={() => setRecordId(item.id)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <article className="border border-rule p-4 text-sm leading-relaxed text-ink-muted">
        <p className="label">{record.kind}</p>
        <h3 className="mt-2 font-display text-xl text-ink">{record.title}</h3>
        <p className="mt-3">{record.context}</p>
        <p className="mt-3 text-ink">Problem. {record.problem}</p>
        <ul className="mt-3 list-disc pl-5">
          {record.alternatives.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 text-ink">Chosen approach. {record.chosen}</p>
        <ul className="mt-3 list-disc pl-5">
          {record.tradeoffs.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3">Failure modes. {record.failureModes.join(" ")}</p>
        <p className="mt-3">What would change it. {record.revisitWhen}</p>
      </article>
    </div>
  );
}

/** Constraint choices. Selecting an option explains it without scoring the visitor. */
export function ConstraintSimulator() {
  const [scenarioId, setScenarioId] = useState(constraintScenarios[0].id);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const scenario = constraintScenarios.find((item) => item.id === scenarioId) ?? constraintScenarios[0];
  const choice = scenario.options.find((item) => item.id === choiceId) ?? null;
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto" role="listbox" aria-label="Constraint scenarios">
        {constraintScenarios.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={item.id === scenario.id}
            className={item.id === scenario.id ? "btn-primary shrink-0" : "btn-secondary shrink-0"}
            onClick={() => {
              setScenarioId(item.id);
              setChoiceId(null);
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-ink">{scenario.prompt}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        {scenario.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={choice?.id === option.id ? "btn-primary" : "btn-secondary"}
            aria-pressed={choice?.id === option.id}
            onClick={() => setChoiceId(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {choice && (
        <dl className="grid gap-3 border border-rule p-4 text-sm leading-relaxed text-ink-muted sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs uppercase tracking-label text-ink-faint">Immediate benefit</dt>
            <dd className="mt-1">{choice.immediate}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-label text-ink-faint">Engineering cost</dt>
            <dd className="mt-1">{choice.engineeringCost}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-label text-ink-faint">Operational cost</dt>
            <dd className="mt-1">{choice.operationalCost}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-label text-ink-faint">Main risk</dt>
            <dd className="mt-1">{choice.risk}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-mono text-xs uppercase tracking-label text-ink-faint">Revisit when</dt>
            <dd className="mt-1">{choice.revisitWhen}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}

/** Illustrative test map and a critical-journey walkthrough. */
export function TestingPanel() {
  const [stepId, setStepId] = useState(testingGuide.journey[0].id);
  const step = testingGuide.journey.find((item) => item.id === stepId) ?? testingGuide.journey[0];
  return (
    <div className="space-y-4 text-sm leading-relaxed text-ink-muted">
      <p>{testingGuide.note}</p>
      <div className="flex flex-wrap gap-2" role="listbox" aria-label="Critical journey">
        {testingGuide.journey.map((item) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={item.id === step.id}
            className={item.id === step.id ? "btn-primary" : "btn-secondary"}
            onClick={() => setStepId(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="border border-rule p-4 text-ink">{step.check}</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {testingGuide.layers.map((layer) => (
          <li key={layer.name}>
            <span className="text-ink">{layer.name}.</span> {layer.when}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Switchable system map. Layers and a failure path are selectable. */
export function StackMap() {
  const [viewId, setViewId] = useState(stackViews[0].id);
  const view = stackViews.find((item) => item.id === viewId) ?? stackViews[0];
  const [layerId, setLayerId] = useState(view.layers[0].id);
  const [failureId, setFailureId] = useState(view.failures[0].id);
  const layer = view.layers.find((item) => item.id === layerId) ?? view.layers[0];
  const failure = view.failures.find((item) => item.id === failureId) ?? view.failures[0];

  /**
   * Switch maps and reset the layer selection to that map's first layer.
   */
  function selectView(nextId: string) {
    const next = stackViews.find((item) => item.id === nextId) ?? stackViews[0];
    setViewId(next.id);
    setLayerId(next.layers[0].id);
    setFailureId(next.failures[0].id);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="listbox" aria-label="System maps">
        {stackViews.map((item) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={item.id === view.id}
            className={item.id === view.id ? "btn-primary" : "btn-secondary"}
            onClick={() => selectView(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-muted">
        <span className="label mr-2">{view.kind}</span>
        {view.note}
      </p>
      <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
        <div className="flex flex-col gap-2" role="listbox" aria-label={`${view.name} layers`}>
          {view.layers.map((item) => (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={item.id === layer.id}
              className={item.id === layer.id ? "btn-primary text-left" : "btn-secondary text-left"}
              onClick={() => setLayerId(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="border border-rule p-4 text-sm leading-relaxed text-ink-muted">
          <h3 className="font-display text-lg text-ink">{layer.name}</h3>
          <p className="mt-2">{layer.responsibility}</p>
          <p className="mt-2">Inputs. {layer.inputs}</p>
          <p className="mt-2">Outputs. {layer.outputs}</p>
          <p className="mt-2">Failure mode. {layer.failure}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2" role="listbox" aria-label="Failure paths">
        {view.failures.map((item) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={item.id === failure.id}
            className={item.id === failure.id ? "btn-primary" : "btn-secondary"}
            onClick={() => setFailureId(item.id)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-ink-muted">{failure.path}</p>
    </div>
  );
}

/** Synthetic incident walkthrough. */
export function IncidentWalkthrough() {
  const [index, setIndex] = useState(0);
  const step = syntheticIncident.steps[index];
  return (
    <div className="border border-rule p-4 text-sm leading-relaxed text-ink-muted">
      <p className="label">Synthetic incident</p>
      <h3 className="mt-2 font-display text-lg text-ink">{syntheticIncident.title}</h3>
      <p className="mt-3 text-ink">
        {index + 1}. {step.name}
      </p>
      <p className="mt-2">{step.body}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setIndex((current) => Math.max(0, current - 1))}
          disabled={index === 0}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setIndex((current) => Math.min(syntheticIncident.steps.length - 1, current + 1))}
          disabled={index === syntheticIncident.steps.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
