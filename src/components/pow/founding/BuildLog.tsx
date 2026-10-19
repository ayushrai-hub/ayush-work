/**
 * BUILDLOG, the in-browser zero-to-one workbench.
 *
 * Seven steps share one local state object: feature bands, architecture id, checklist marks,
 * and selected feedback. Helpers in foundingWorkbench.ts turn that state into consequences.
 * Northline and every number in the panel are synthetic.
 *
 * Connects to:
 * - src/content/foundingEngineer.ts for the scenario records.
 * - src/lib/foundingWorkbench.ts for scope, tasks, checklist, and feedback.
 * - Rendered by src/pages/FoundingEngineerPowPage.tsx.
 */
import { useState, type KeyboardEvent } from "react";
import {
  architectureOptions,
  buildLogContract,
  buildLogProblem,
  feedbackNotes,
  releaseChecklist,
  scopeFeatures,
  workbenchTasks,
} from "../../../content/foundingEngineer";
import {
  architectureById,
  assessScope,
  checklistProgress,
  planFeedback,
  tasksForScope,
  type FeatureBand,
} from "../../../lib/foundingWorkbench";

const STEPS = [
  { id: "problem", label: "Problem" },
  { id: "scope", label: "MVP scope" },
  { id: "architecture", label: "Architecture" },
  { id: "contract", label: "Data and API" },
  { id: "tasks", label: "Implementation" },
  { id: "release", label: "Release" },
  { id: "feedback", label: "After launch" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

/**
 * The seven-step demonstration. State stays in the browser.
 */
export default function BuildLog() {
  const [step, setStep] = useState<StepId>("problem");
  const [bands, setBands] = useState<Record<string, FeatureBand>>({});
  const [architectureId, setArchitectureId] = useState("modular-monolith");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const scope = assessScope(scopeFeatures, bands);
  const tasks = tasksForScope(workbenchTasks, scopeFeatures, bands);
  const release = checklistProgress(releaseChecklist, checked);
  const feedback = planFeedback(feedbackNotes, selectedNotes);
  const architecture = architectureById(architectureOptions, architectureId);

  /**
   * Move the step tab with arrows, Home, and End.
   */
  function onTabsKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = STEPS.findIndex((item) => item.id === step);
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? STEPS[(index + 1) % STEPS.length]
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? STEPS[(index - 1 + STEPS.length) % STEPS.length]
          : event.key === "Home"
            ? STEPS[0]
            : event.key === "End"
              ? STEPS[STEPS.length - 1]
              : null;
    if (!next) return;
    event.preventDefault();
    setStep(next.id);
    document.getElementById(`buildlog-tab-${next.id}`)?.focus();
  }

  return (
    <div>
      <p className="label">Synthetic demonstration</p>
      <div
        role="tablist"
        aria-label="BUILDLOG steps"
        aria-orientation="horizontal"
        className="mt-4 flex gap-2 overflow-x-auto"
        onKeyDown={onTabsKeyDown}
      >
        {STEPS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`buildlog-tab-${item.id}`}
            aria-selected={step === item.id}
            aria-controls={`buildlog-panel-${item.id}`}
            tabIndex={step === item.id ? 0 : -1}
            className={step === item.id ? "btn-primary shrink-0" : "btn-secondary shrink-0"}
            onClick={() => setStep(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`buildlog-panel-${step}`}
        aria-labelledby={`buildlog-tab-${step}`}
        className="mt-4 border border-rule p-4 sm:p-5"
      >
        {step === "problem" && <ProblemStep />}
        {step === "scope" && (
          <ScopeStep
            bands={bands}
            summary={scope.summary}
            blocked={scope.blocked}
            load={scope.load}
            onBand={(id, band) => setBands((current) => ({ ...current, [id]: band }))}
          />
        )}
        {step === "architecture" && (
          <ArchitectureStep
            selectedId={architecture.id}
            summary={architecture.summary}
            fit={architecture.fit}
            dimensions={architecture.dimensions}
            failure={architecture.failure}
            onSelect={setArchitectureId}
          />
        )}
        {step === "contract" && <ContractStep />}
        {step === "tasks" && <TaskStep critical={tasks.critical} optional={tasks.optional} />}
        {step === "release" && (
          <ReleaseStep
            done={release.done}
            total={release.total}
            ready={release.ready}
            openGroups={release.openGroups}
            checked={checked}
            onToggle={(id) => setChecked((current) => ({ ...current, [id]: !current[id] }))}
          />
        )}
        {step === "feedback" && (
          <FeedbackStep
            selected={selectedNotes}
            now={feedback.now.map((note) => note.text)}
            parked={feedback.parked.map((note) => note.text)}
            warning={feedback.warning}
            onToggle={(id) =>
              setSelectedNotes((current) =>
                current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
              )
            }
          />
        )}
      </div>
    </div>
  );
}

/** Step 1. Assumptions and gaps for the fictional team. */
function ProblemStep() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-ink-muted">
      <p>
        <span className="label mr-2">Synthetic</span>
        {buildLogProblem.company} is not a customer. The brief is a teaching scenario.
      </p>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Fact term="Target user" value={buildLogProblem.user} />
        <Fact term="Pain" value={buildLogProblem.pain} />
        <Fact term="Current workaround" value={buildLogProblem.workaround} />
        <Fact term="Cost inside the demo" value={buildLogProblem.cost} />
      </dl>
      <div>
        <h3 className="font-display text-lg text-ink">Assumptions, not findings</h3>
        <ul className="mt-2 list-disc pl-5">
          {buildLogProblem.assumptions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-display text-lg text-ink">Validated findings</h3>
        <ul className="mt-2 list-disc pl-5">
          {buildLogProblem.validated.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-display text-lg text-ink">Evidence still needed</h3>
        <ul className="mt-2 list-disc pl-5">
          {buildLogProblem.stillNeeded.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** One term in the problem definition. */
function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-label text-ink-faint">{term}</dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  );
}

/** Step 2. Reclassify the backlog and read the consequence. */
function ScopeStep({
  bands,
  summary,
  blocked,
  load,
  onBand,
}: {
  bands: Record<string, FeatureBand>;
  summary: string;
  blocked: { feature: string; missing: string }[];
  load: string;
  onBand: (id: string, band: FeatureBand) => void;
}) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-ink-muted">
      <p>
        Illustrative load: <span className="text-ink">{load}</span>. Weights are a teaching scale, not measured effort. {summary}
      </p>
      {blocked.length > 0 && (
        <ul className="list-disc pl-5 text-ink">
          {blocked.map((item) => (
            <li key={`${item.feature}-${item.missing}`}>
              {item.feature} depends on {item.missing}, which is not in the required set.
            </li>
          ))}
        </ul>
      )}
      <ul className="space-y-4">
        {scopeFeatures.map((feature) => {
          const band = bands[feature.id] ?? feature.defaultBand;
          return (
            <li key={feature.id} className="border-t border-rule pt-3">
              <p className="text-ink">{feature.name}</p>
              <p className="mt-1">{feature.reason}</p>
              <fieldset className="mt-2">
                <legend className="sr-only">Classification for {feature.name}</legend>
                <div className="flex flex-wrap gap-3">
                  {(["required", "defer", "cut"] as const).map((option) => (
                    <label key={option} className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name={`band-${feature.id}`}
                        value={option}
                        checked={band === option}
                        aria-label={`${feature.name}: ${option}`}
                        onChange={() => onBand(feature.id, option)}
                      />
                      <span className="capitalize">{option === "defer" ? "Deferrable" : option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Step 3. Architecture trade-offs for the fictional brief. */
function ArchitectureStep({
  selectedId,
  summary,
  fit,
  dimensions,
  failure,
  onSelect,
}: {
  selectedId: string;
  summary: string;
  fit: string;
  dimensions: { label: string; note: string }[];
  failure: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-ink-muted">
      <fieldset>
        <legend className="text-ink">Architecture for this brief</legend>
        <div className="mt-2 flex flex-col gap-2">
          {architectureOptions.map((option) => (
            <label key={option.id} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="architecture"
                value={option.id}
                checked={selectedId === option.id}
                onChange={() => onSelect(option.id)}
              />
              {option.name}
            </label>
          ))}
        </div>
      </fieldset>
      <p className="text-ink">{summary}</p>
      <p>{fit}</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        {dimensions.map((item) => (
          <div key={item.label}>
            <dt className="font-mono text-xs uppercase tracking-label text-ink-faint">{item.label}</dt>
            <dd className="mt-1">{item.note}</dd>
          </div>
        ))}
      </dl>
      <p>{failure}</p>
    </div>
  );
}

/** Step 4. Illustrative schema and routes. */
function ContractStep() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-ink-muted">
      <p>This contract is a sketch for Northline. It is not a deployed API.</p>
      <h3 className="font-display text-lg text-ink">Entities</h3>
      <ul className="list-disc pl-5">
        {buildLogContract.entities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h3 className="font-display text-lg text-ink">API</h3>
      <ul className="list-disc pl-5">
        {buildLogContract.endpoints.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h3 className="font-display text-lg text-ink">Boundaries</h3>
      <ul className="list-disc pl-5">
        {buildLogContract.boundaries.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** Step 5. Critical path versus work the current scope does not need. */
function TaskStep({
  critical,
  optional,
}: {
  critical: { id: string; name: string; note: string }[];
  optional: { id: string; name: string; note: string }[];
}) {
  return (
    <div className="grid gap-6 text-sm leading-relaxed text-ink-muted md:grid-cols-2">
      <div>
        <h3 className="font-display text-lg text-ink">On the critical path</h3>
        <ul className="mt-2 space-y-2">
          {critical.map((task) => (
            <li key={task.id}>
              <span className="text-ink">{task.name}.</span> {task.note}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-display text-lg text-ink">Off the path for this scope</h3>
        <ul className="mt-2 space-y-2">
          {optional.length === 0 ? <li>Nothing is off the path.</li> : null}
          {optional.map((task) => (
            <li key={task.id}>
              <span className="text-ink">{task.name}.</span> {task.note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Step 6. Local checklist. Marks are not a test report. */
function ReleaseStep({
  done,
  total,
  ready,
  openGroups,
  checked,
  onToggle,
}: {
  done: number;
  total: number;
  ready: boolean;
  openGroups: string[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-ink-muted">
      <p>
        {done} of {total} marked. {ready ? "Every box is marked." : `Still open: ${openGroups.join(", ")}.`} Marking a box does not run a check.
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {releaseChecklist.map((item) => (
          <li key={item.id}>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(checked[item.id])}
                onChange={() => onToggle(item.id)}
              />
              <span>
                {item.label} <span className="text-ink-faint">({item.group})</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Step 7. Choose which synthetic notes to act on. */
function FeedbackStep({
  selected,
  now,
  parked,
  warning,
  onToggle,
}: {
  selected: string[];
  now: string[];
  parked: string[];
  warning: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-ink-muted">
      <p>Sample notes from a fictional launch. None of them came from a customer.</p>
      <ul className="space-y-3">
        {feedbackNotes.map((note) => (
          <li key={note.id} className="border-t border-rule pt-3">
            <label className="inline-flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={selected.includes(note.id)}
                onChange={() => onToggle(note.id)}
              />
              <span>
                <span className="text-ink">{note.text}</span>
                <span className="mt-1 block">{note.signal}</span>
                <span className="mt-1 block">{note.why}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p>Act on now: {now.length === 0 ? "nothing selected." : now.join(" ")}</p>
      <p>Parked: {parked.length === 0 ? "nothing selected." : parked.join(" ")}</p>
      {warning && <p className="text-ink">{warning}</p>}
    </div>
  );
}
