/**
 * Interactive Harbor Meter notebook for the AI research proof-of-work page.
 *
 * The counts come from `summarizeExperiment` over `researchExamples`. Prepared strings are never
 * described as model output. Preference choices stay in component state.
 *
 * Connects to:
 * - src/pages/AiResearchEngineeringPowPage.tsx.
 * - src/content/aiResearchPow.ts and src/lib/aiResearchEval.ts.
 * - src/components/pow/PmChrome.tsx for the shared section and status marks.
 */
import { useId, useState } from "react";
import { NotebookSection, StatusMark } from "./PmChrome";
import {
  DATASET_VERSION,
  demoConfigs,
  demonstrationLimits,
  designVariables,
  evidenceLabelOrder,
  exclusionIssues,
  experimentManifest,
  experimentSpec,
  failureCategoryLabels,
  hardeningTopics,
  inspectedProjects,
  instructGpt,
  issueLabels,
  metricGuides,
  preferenceTask,
  preferenceWorkflow,
  proposedAblations,
  ragPaper,
  researchDecisions,
  researchExamples,
  researchLifecycle,
  researchRoadmap,
  architectureParts,
  unusedInspection,
  workbenchName,
} from "../../content/aiResearchPow";
import {
  causalBlockers,
  changeWarnings,
  configDifferences,
  examplesInSlice,
  preparedOutput,
  scoreExample,
  summarizeExperiment,
  type DataIssue,
  type FailureCategory,
  type ResultSlice,
} from "../../lib/aiResearchEval";

const summary = summarizeExperiment(researchExamples);

/** Jump targets inside the notebook. */
const JUMPS = [
  ["specification", "Specification"],
  ["dataset", "Dataset"],
  ["method", "Design"],
  ["evaluation", "Metrics"],
  ["results", "Results"],
  ["failures", "Failures"],
  ["preference", "Preference"],
  ["reproducibility", "Reproducibility"],
  ["literature", "Literature"],
  ["engineering", "To engineering"],
  ["architecture", "Architecture"],
  ["decisions", "Decisions"],
  ["roadmap", "Roadmap"],
  ["projects", "Projects"],
] as const;

/**
 * A labeled bar whose width is the count over the denominator.
 * The text carries the numbers; the bar is decorative.
 */
function CountBar({
  label,
  value,
  total,
  onSelect,
  pressed,
}: {
  label: string;
  value: number;
  total: number;
  onSelect: () => void;
  pressed: boolean;
}) {
  const width = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={pressed}
      className={`block w-full border px-3 py-3 text-left ${
        pressed ? "border-ink bg-accent-soft/40" : "border-rule"
      }`}
    >
      <span className="flex items-baseline justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="font-mono text-ink-muted">
          {value}/{total}
        </span>
      </span>
      <span className="mt-2 block h-2 bg-rule" aria-hidden="true">
        <span className="block h-2 bg-accent" style={{ width: `${width}%` }} />
      </span>
    </button>
  );
}

/** External link that opens in a new tab. */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
      {children}
    </a>
  );
}

/** The notebook under the hero. */
export default function ResearchNotebook() {
  const [issueFilter, setIssueFilter] = useState<"all" | DataIssue>("all");
  const [openId, setOpenId] = useState<string | null>("HM-01");
  const [metricId, setMetricId] = useState(metricGuides[0].id);
  const [slice, setSlice] = useState<ResultSlice>("scorable");
  const [failureFilter, setFailureFilter] = useState<"all" | FailureCategory>("all");
  const [preference, setPreference] = useState<"A" | "B" | "tie" | "neither" | null>(null);
  const [leftId, setLeftId] = useState(demoConfigs[0].id);
  const [rightId, setRightId] = useState(demoConfigs[1].id);
  const [changed, setChanged] = useState<string[]>([]);
  const [partId, setPartId] = useState(architectureParts[0].id);
  const [decisionId, setDecisionId] = useState(researchDecisions[0].id);
  const metricHeading = useId();
  const partHeading = useId();
  const decisionHeading = useId();

  const visibleRows = researchExamples.filter(
    (row) => issueFilter === "all" || row.issues.includes(issueFilter),
  );
  const sliceRows = examplesInSlice(researchExamples, slice);
  const failureRows = researchExamples.filter((row) =>
    failureFilter === "all" ? row.failures.length > 0 : row.failures.some((note) => note.category === failureFilter),
  );
  const metric = metricGuides.find((item) => item.id === metricId) ?? metricGuides[0];
  const left = demoConfigs.find((item) => item.id === leftId) ?? demoConfigs[0];
  const right = demoConfigs.find((item) => item.id === rightId) ?? demoConfigs[1];
  const differences = configDifferences(left, right);
  const blockers = causalBlockers(differences, left.implemented, right.implemented);
  const warnings = changeWarnings(changed, designVariables);
  const part = architectureParts.find((item) => item.id === partId) ?? architectureParts[0];
  const decision = researchDecisions.find((item) => item.id === decisionId) ?? researchDecisions[0];

  /** Toggles a design variable in the "what if this changed" list. */
  const toggleVariable = (id: string) => {
    setChanged((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <div>
      <nav aria-label="Notebook sections" className="border border-rule p-4">
        <p className="label">Experiment notebook</p>
        <p className="mt-2 max-w-measure text-sm text-ink-muted">{workbenchName.note}</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {JUMPS.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="link-underline">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <NotebookSection
        id="specification"
        number="01"
        title="Experiment specification"
        intro="The question is fixed before the counts. The prepared rows do not decide it."
      >
        <dl className="grid gap-4 md:grid-cols-2">
          {[
            ["Research question", experimentSpec.question],
            ["Hypothesis", experimentSpec.hypothesis],
            ["Null hypothesis", experimentSpec.nullHypothesis],
            ["Baseline", experimentSpec.baseline],
            ["Retrieval condition", experimentSpec.retrievalCondition],
            ["Stopping", experimentSpec.stopping],
          ].map(([term, detail]) => (
            <div key={term} className="border border-rule p-4">
              <dt className="label">{term}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{detail}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 max-w-measure text-sm text-ink-muted">
          <StatusMark kind="synthetic" /> <span className="ml-2">{experimentSpec.status}</span>
        </p>
        <h3 className="mt-8 font-display text-lg">What stays fixed, and what changes</h3>
        <p className="mt-2 max-w-measure text-sm text-ink-muted">
          The independent variable is the stored evidence bundle. Questions, references, scoring rules,
          and the absence of a model stay in the protocol. A weak baseline would be a condition written
          to lose. This baseline is the no-evidence string, including rows where that string is already right.
        </p>
      </NotebookSection>

      <NotebookSection
        id="dataset"
        number="02"
        title="Dataset inspector"
        intro={`${DATASET_VERSION} has ${summary.rows} fictional rows. Dataset construction can dominate an evaluation. This set is not a sample of real AI workloads.`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="text-sm text-ink" htmlFor="issue-filter">
            Data-quality filter
            <select
              id="issue-filter"
              value={issueFilter}
              onChange={(event) => setIssueFilter(event.target.value as "all" | DataIssue)}
              className="mt-1 block w-full border border-rule bg-paper px-3 py-2 text-ink sm:w-80"
            >
              <option value="all">All rows</option>
              {Object.entries(issueLabels).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <p className="font-mono text-xs text-ink-faint">
            Showing {visibleRows.length} of {researchExamples.length}
          </p>
        </div>
        <p className="mt-3 max-w-measure text-sm text-ink-muted">
          Exact match excludes rows flagged {exclusionIssues.map((issue) => issueLabels[issue]).join(", ")}.
          Other flags stay in the denominator and stay visible, because hiding them would hide the threat.
        </p>
        {visibleRows.length === 0 ? (
          <p className="mt-4 border border-dashed border-rule p-4 text-sm text-ink-muted" role="status">
            No row carries this flag.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {visibleRows.map((row) => {
              const score = scoreExample(row);
              const open = openId === row.id;
              const panelId = `${row.id}-panel`;
              return (
                <li key={row.id} className="border border-rule">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : row.id)}
                  >
                    <span>
                      <span className="font-mono text-xs text-ink-faint">{row.id}</span>
                      <span className="mt-1 block text-sm text-ink">{row.question}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs text-ink-muted">{score.outcome}</span>
                  </button>
                  {open ? (
                    <div id={panelId} className="border-t border-rule px-4 py-4 text-sm">
                      <dl className="grid gap-3 md:grid-cols-2">
                        <div>
                          <dt className="label">Reference</dt>
                          <dd className="mt-1 text-ink-muted">{row.referenceAnswer ?? "No reference stored."}</dd>
                        </div>
                        <div>
                          <dt className="label">Flags</dt>
                          <dd className="mt-1 text-ink-muted">
                            {row.issues.length === 0
                              ? "None"
                              : row.issues.map((issue) => issueLabels[issue]).join(", ")}
                          </dd>
                        </div>
                        <div>
                          <dt className="label">Baseline output</dt>
                          <dd className="mt-1 font-mono text-xs text-ink">{preparedOutput(row, "baseline")}</dd>
                        </div>
                        <div>
                          <dt className="label">Retrieval output</dt>
                          <dd className="mt-1 font-mono text-xs text-ink">{preparedOutput(row, "retrieval")}</dd>
                        </div>
                      </dl>
                      <h4 className="mt-4 label">Evidence</h4>
                      {row.evidence === null ? (
                        <p className="mt-2 text-ink-muted">The evidence field is missing.</p>
                      ) : (
                        <ul className="mt-2 space-y-2">
                          {row.evidence.map((passage) => (
                            <li key={passage.id} className="border border-rule p-3">
                              <span className="font-mono text-xs text-ink-faint">
                                {passage.id} · {passage.relevant ? "marked relevant" : "marked irrelevant"}
                              </span>
                              <p className="mt-1 text-ink-muted">{passage.text}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="mt-3 font-mono text-xs text-ink-faint">
                        Exact match {score.baselineExact === null ? "not scored" : score.baselineExact ? "match" : "miss"}{" "}
                        / {score.retrievalExact === null ? "not scored" : score.retrievalExact ? "match" : "miss"} ·
                        schema {score.baselineSchema === null ? "n/a" : score.baselineSchema ? "valid" : "invalid"} /{" "}
                        {score.retrievalSchema === null ? "n/a" : score.retrievalSchema ? "valid" : "invalid"} · recall{" "}
                        {score.recall === null ? "not applicable" : score.recall.toFixed(2)} · evidence{" "}
                        {row.baselineEvidence} / {row.retrievalEvidence}
                      </p>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </NotebookSection>

      <NotebookSection
        id="method"
        number="03"
        title="Variables and confounders"
        intro="Mark a variable as changed to see how that would affect a causal reading. Nothing is re-scored."
      >
        <ul className="space-y-3">
          {designVariables.map((variable) => (
            <li key={variable.id} className="border border-rule p-4">
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={changed.includes(variable.id)}
                  onChange={() => toggleVariable(variable.id)}
                />
                <span>
                  <span className="font-mono text-xs uppercase tracking-label text-ink-faint">{variable.role}</span>
                  <span className="mt-1 block text-ink">{variable.name}</span>
                  <span className="mt-1 block text-ink-muted">{variable.detail}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        <div className="mt-4 border border-rule p-4" role="status">
          <p className="label">If those variables changed</p>
          {warnings.length === 0 ? (
            <p className="mt-2 text-sm text-ink-muted">
              No variable is marked changed. The written contrast is still only the prepared evidence bundle, and the outputs are still prepared text.
            </p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm text-ink-muted">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          )}
        </div>
      </NotebookSection>

      <NotebookSection
        id="evaluation"
        number="04"
        title="Evaluation metrics"
        intro="No single metric covers every question. The live ones are computed from the rows. Preference is described and not applied to this table."
      >
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap" role="list">
          {metricGuides.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === metric.id}
              onClick={() => setMetricId(item.id)}
              className={`border px-3 py-2 text-left text-sm ${
                item.id === metric.id ? "border-ink bg-accent-soft/40" : "border-rule text-ink-muted"
              }`}
            >
              {item.name}
              <span className="ml-2 font-mono text-xs">{item.live ? "computed" : "not computed"}</span>
            </button>
          ))}
        </div>
        <article className="mt-4 border border-rule p-4" aria-labelledby={metricHeading}>
          <h3 id={metricHeading} className="font-display text-lg">
            {metric.name}
          </h3>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="label">Definition</dt>
              <dd className="mt-1 text-ink-muted">{metric.definition}</dd>
            </div>
            <div>
              <dt className="label">Procedure</dt>
              <dd className="mt-1 text-ink-muted">{metric.procedure}</dd>
            </div>
            <div>
              <dt className="label">Inputs</dt>
              <dd className="mt-1 text-ink-muted">{metric.inputs}</dd>
            </div>
            <div>
              <dt className="label">Interpretation</dt>
              <dd className="mt-1 text-ink-muted">{metric.interpretation}</dd>
            </div>
            <div>
              <dt className="label">Failure modes</dt>
              <dd className="mt-1 text-ink-muted">{metric.failureModes}</dd>
            </div>
          </dl>
        </article>
      </NotebookSection>

      <NotebookSection
        id="results"
        number="05"
        title="Results"
        intro="Descriptive counts on a small prepared set. No confidence interval and no p-value. Select a bar to list the rows."
      >
        <p className="font-mono text-xs text-ink-faint">
          <StatusMark kind="synthetic" /> Prepared demonstration outputs. Not a model run.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <CountBar
            label="Baseline exact match"
            value={summary.baselineExactCorrect}
            total={summary.scorable}
            pressed={slice === "baseline_exact"}
            onSelect={() => setSlice("baseline_exact")}
          />
          <CountBar
            label="Retrieval exact match"
            value={summary.retrievalExactCorrect}
            total={summary.scorable}
            pressed={slice === "retrieval_exact"}
            onSelect={() => setSlice("retrieval_exact")}
          />
          <CountBar
            label="Retrieval helps"
            value={summary.helps}
            total={summary.scorable}
            pressed={slice === "helps"}
            onSelect={() => setSlice("helps")}
          />
          <CountBar
            label="Retrieval hurts"
            value={summary.hurts}
            total={summary.scorable}
            pressed={slice === "hurts"}
            onSelect={() => setSlice("hurts")}
          />
          <CountBar
            label="No exact-match change"
            value={summary.noEffect}
            total={summary.scorable}
            pressed={slice === "no_effect"}
            onSelect={() => setSlice("no_effect")}
          />
          <CountBar
            label="Not in the exact-match set"
            value={summary.notComparable}
            total={summary.rows}
            pressed={slice === "not_comparable"}
            onSelect={() => setSlice("not_comparable")}
          />
        </div>
        <p className="mt-4 max-w-measure text-sm text-ink-muted">
          Empty outputs: baseline {summary.emptyOutputs.baseline}, retrieval {summary.emptyOutputs.retrieval}.
          Schema validity applies to {summary.schemaApplicable} row: baseline {summary.baselineSchemaValid} valid,
          retrieval {summary.retrievalSchemaValid} valid. Retrieval recall is {summary.recallHits} of{" "}
          {summary.recallRelevant} relevant ids, a micro-average, not a mean of per-row ratios.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption className="mb-2 text-left text-ink-muted">
              Prepared evidence labels on the {summary.scorable} exact-match rows.
            </caption>
            <thead>
              <tr className="border-b border-rule">
                <th scope="col" className="py-2 pr-3 font-normal text-ink-faint">
                  Label
                </th>
                <th scope="col" className="py-2 pr-3 font-normal text-ink-faint">
                  Baseline
                </th>
                <th scope="col" className="py-2 font-normal text-ink-faint">
                  Retrieval
                </th>
              </tr>
            </thead>
            <tbody>
              {evidenceLabelOrder.map((label) => (
                <tr key={label} className="border-b border-rule">
                  <th scope="row" className="py-2 pr-3 font-normal">
                    {label}
                  </th>
                  <td className="py-2 pr-3 font-mono">{summary.evidence.baseline[label]}</td>
                  <td className="py-2 font-mono">{summary.evidence.retrieval[label]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="mt-6 font-display text-lg">Rows in this slice</h3>
        {sliceRows.length === 0 ? (
          <p className="mt-2 text-sm text-ink-muted" role="status">
            No row is in this slice.
          </p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {sliceRows.map((row) => (
              <li key={row.id}>
                <button type="button" className="link-underline text-left" onClick={() => setOpenId(row.id)}>
                  {row.id}
                </button>
                <span className="text-ink-muted"> — {row.question}</span>
              </li>
            ))}
          </ul>
        )}
        <h3 className="mt-8 font-display text-lg">What this can establish</h3>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          {demonstrationLimits.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </NotebookSection>

      <NotebookSection
        id="failures"
        number="06"
        title="Failure analysis"
        intro="The observed text is separate from the diagnosis. A diagnosis is a hypothesis for a follow-up, not a finding."
      >
        <label className="text-sm text-ink" htmlFor="failure-filter">
          Failure category
          <select
            id="failure-filter"
            value={failureFilter}
            onChange={(event) => setFailureFilter(event.target.value as "all" | FailureCategory)}
            className="mt-1 block w-full border border-rule bg-paper px-3 py-2 sm:w-80"
          >
            <option value="all">All labeled failures</option>
            {Object.entries(failureCategoryLabels).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {failureRows.length === 0 ? (
          <p className="mt-4 border border-dashed border-rule p-4 text-sm text-ink-muted" role="status">
            No prepared row is labeled with this category. Incorrect reference answers are in the list so the gap is visible: this set does not contain one.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {failureRows.map((row) => (
              <li key={row.id} className="border border-rule p-4">
                <h3 className="font-mono text-sm">{row.id}</h3>
                <p className="mt-1 text-sm text-ink">{row.question}</p>
                <p className="mt-2 text-sm text-ink-muted">Reference: {row.referenceAnswer ?? "none"}</p>
                <p className="mt-1 text-sm text-ink-muted">Baseline: {row.baselineOutput}</p>
                <p className="mt-1 text-sm text-ink-muted">Retrieval: {row.retrievalOutput}</p>
                <ul className="mt-3 space-y-3">
                  {row.failures
                    .filter((note) => failureFilter === "all" || note.category === failureFilter)
                    .map((note) => (
                      <li key={`${note.category}-${note.condition}`} className="border-t border-rule pt-3 text-sm">
                        <p className="font-mono text-xs text-ink-faint">
                          {failureCategoryLabels[note.category]} · {note.condition}
                        </p>
                        <p className="mt-1">
                          <StatusMark kind="fact" /> <span className="ml-2 text-ink-muted">Observed: {note.observed}</span>
                        </p>
                        <p className="mt-2">
                          <StatusMark kind="hypothesis" />{" "}
                          <span className="ml-2 text-ink-muted">Diagnosis: {note.diagnosis}</span>
                        </p>
                        <p className="mt-2">
                          <StatusMark kind="proposed" />{" "}
                          <span className="ml-2 text-ink-muted">Follow-up: {note.followUp}</span>
                        </p>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
        <h3 className="mt-8 font-display text-lg">Ablations</h3>
        <p className="mt-2 max-w-measure text-sm text-ink-muted">
          The measured comparison is baseline versus the fixed evidence bundle. The rows below are proposed.
          They have no outputs, so they have no scores.
        </p>
        <ul className="mt-3 space-y-3">
          {proposedAblations.map((item) => (
            <li key={item.title} className="border border-dashed border-rule p-4 text-sm">
              <StatusMark kind="proposed" />
              <p className="mt-2 text-ink">{item.title}</p>
              <p className="mt-1 text-ink-muted">{item.note}</p>
            </li>
          ))}
        </ul>
      </NotebookSection>

      <NotebookSection
        id="preference"
        number="07"
        title="Preference comparison"
        intro="A local choice under a written rubric. It is not RLHF training and it does not change the table above."
      >
        <ol className="list-decimal space-y-1 pl-5 text-sm text-ink-muted">
          {preferenceWorkflow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-4 max-w-measure text-sm text-ink-muted">
          <ExternalLink href={instructGpt.href}>{instructGpt.title}</ExternalLink> ({instructGpt.published};{" "}
          {instructGpt.authors}). {instructGpt.note}
        </p>
        <div className="mt-4 border border-rule p-4">
          <p className="label">Rubric {preferenceTask.rubricVersion}</p>
          <p className="mt-2 text-sm text-ink-muted">{preferenceTask.rubric}</p>
          <p className="mt-3 text-sm">
            Evidence: <span className="text-ink-muted">{preferenceTask.evidence}</span>
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <p className="border border-rule p-3 text-sm">
              <span className="label">Candidate A</span>
              <span className="mt-2 block">{preferenceTask.a}</span>
            </p>
            <p className="border border-rule p-3 text-sm">
              <span className="label">Candidate B</span>
              <span className="mt-2 block">{preferenceTask.b}</span>
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Preference decision">
            {(
              [
                ["A", "A satisfies the rubric"],
                ["B", "B satisfies the rubric"],
                ["tie", "Tie"],
                ["neither", "Neither"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={preference === id}
                onClick={() => setPreference(id)}
                className={`border px-3 py-2 text-sm ${
                  preference === id ? "border-ink bg-accent-soft/40" : "border-rule"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm" aria-live="polite">
            {preference === null ? (
              <p className="text-ink-muted">No decision yet. Nothing is stored outside this tab.</p>
            ) : (
              <dl className="grid gap-2 border border-rule p-3">
                <div>
                  <dt className="label">Local record</dt>
                  <dd className="text-ink-muted">
                    Task {preferenceTask.id}, rubric {preferenceTask.rubricVersion}, choice {preference}. This
                    stays in component state. It is not an annotation database.
                  </dd>
                </div>
                <div>
                  <dt className="label">Demonstration note</dt>
                  <dd className="text-ink-muted">{preferenceTask.preparedNote}</dd>
                </div>
              </dl>
            )}
          </div>
        </div>
      </NotebookSection>

      <NotebookSection
        id="reproducibility"
        number="08"
        title="Reproducibility"
        intro="Rerunning this page recomputes the fixture. Reproducing a model experiment would require the model, the prompts, and the outputs this manifest says are absent."
      >
        <dl className="space-y-3">
          {experimentManifest.map((field) => (
            <div key={field.label} className="border-b border-rule pb-3">
              <dt className="label">{field.label}</dt>
              <dd className="mt-1 text-sm text-ink-muted">{field.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm">
          <StatusMark kind="unmeasured" />{" "}
          <span className="ml-2 text-ink-muted">Illustrative manifest. Not an execution log.</span>
        </p>
        <h3 className="mt-8 font-display text-lg">Compare configurations</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm" htmlFor="config-left">
            Left
            <select
              id="config-left"
              value={leftId}
              onChange={(event) => setLeftId(event.target.value)}
              className="mt-1 block w-full border border-rule bg-paper px-3 py-2"
            >
              {demoConfigs.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm" htmlFor="config-right">
            Right
            <select
              id="config-right"
              value={rightId}
              onChange={(event) => setRightId(event.target.value)}
              className="mt-1 block w-full border border-rule bg-paper px-3 py-2"
            >
              {demoConfigs.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {differences.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted" role="status">
            The stored metadata matches. Matching metadata is not a second run.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <caption className="mb-2 text-left text-ink-muted">Fields that differ.</caption>
              <thead>
                <tr className="border-b border-rule">
                  <th scope="col" className="py-2 pr-3 font-normal">
                    Field
                  </th>
                  <th scope="col" className="py-2 pr-3 font-normal">
                    Left
                  </th>
                  <th scope="col" className="py-2 font-normal">
                    Right
                  </th>
                </tr>
              </thead>
              <tbody>
                {differences.map((difference) => (
                  <tr key={difference.id} className="border-b border-rule align-top">
                    <th scope="row" className="py-2 pr-3 font-normal">
                      {difference.label}
                    </th>
                    <td className="py-2 pr-3 text-ink-muted">{difference.left}</td>
                    <td className="py-2 text-ink-muted">{difference.right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 border border-rule p-4 text-sm" role="status">
          <p className="label">Causal reading</p>
          {blockers.length === 0 ? (
            <p className="mt-2 text-ink-muted">
              Only retrieval metadata differs, and both sides have prepared outputs. That is the intended contrast.
              It is still not a causal estimate, because the strings were written rather than generated.
            </p>
          ) : (
            <ul className="mt-2 space-y-1 text-ink-muted">
              {blockers.map((blocker) => (
                <li key={blocker}>{blocker} makes a retrieval-only reading hard to defend.</li>
              ))}
            </ul>
          )}
        </div>
      </NotebookSection>

      <NotebookSection
        id="literature"
        number="09"
        title="Literature"
        intro="Read the method, the data, and the baselines before copying a result into code. The notes below are from the abstract and the proceedings page. They are not a reproduction."
      >
        <ol className="list-decimal space-y-1 pl-5 text-sm text-ink-muted">
          <li>Define the research question.</li>
          <li>Find the primary paper.</li>
          <li>Read the methodology.</li>
          <li>Inspect the datasets and baselines.</li>
          <li>Identify the assumptions.</li>
          <li>Reproduce a small component before extending it.</li>
          <li>Compare the implementation with the paper.</li>
          <li>Record discrepancies.</li>
          <li>Design the follow-up only after that.</li>
        </ol>
        <article className="mt-6 border border-rule p-4">
          <p className="label">Paper, not my result</p>
          <h3 className="mt-2 font-display text-xl">{ragPaper.title}</h3>
          <p className="mt-2 text-sm text-ink-muted">{ragPaper.authors}</p>
          <p className="mt-1 text-sm text-ink-muted">
            {ragPaper.venue}. {ragPaper.published}.
          </p>
          <p className="mt-2 text-sm">
            <ExternalLink href={ragPaper.arxiv}>arXiv</ExternalLink>
            {" · "}
            <ExternalLink href={ragPaper.proceedings}>NeurIPS abstract</ExternalLink>
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            {(
              [
                ["Research question", ragPaper.question],
                ["Main contribution", ragPaper.contribution],
                ["Method", ragPaper.method],
                ["Baselines", ragPaper.baselines],
                ["Dataset", ragPaper.dataset],
                ["Evaluation metrics", ragPaper.metrics],
                ["Key findings, as reported", ragPaper.findings],
                ["Limitation of my reading", ragPaper.limitations],
                ["Reproducibility", ragPaper.reproducibility],
                ["Implementation on this page", ragPaper.implementationPlan],
                ["Open question", ragPaper.openQuestions],
              ] as const
            ).map(([term, detail]) => (
              <div key={term}>
                <dt className="label">{term}</dt>
                <dd className="mt-1 text-ink-muted">{detail}</dd>
              </div>
            ))}
          </dl>
        </article>
      </NotebookSection>

      <NotebookSection
        id="engineering"
        number="10"
        title="From a result to a component"
        intro="An offline win, including a real one, does not ship itself. This demo stops before hardening."
      >
        <ol className="space-y-2 text-sm">
          {researchLifecycle.map((item) => (
            <li key={item.step} className="border-b border-rule pb-2">
              <span className="text-ink">{item.step}</span>
              <span className="mt-1 block text-ink-muted">{item.here}</span>
            </li>
          ))}
        </ol>
        <ul className="mt-6 space-y-3">
          {hardeningTopics.map((topic) => (
            <li key={topic.title} className="text-sm">
              <span className="text-ink">{topic.title}. </span>
              <span className="text-ink-muted">{topic.note}</span>
            </li>
          ))}
        </ul>
      </NotebookSection>

      <NotebookSection
        id="architecture"
        number="11"
        title="Architecture"
        intro="Select a block. Simulation means this page does it with local data. Proposal means a later backend would have to build it."
      >
        <div className="flex flex-col gap-4 lg:flex-row">
          <ul className="flex flex-col gap-2 lg:w-72" aria-label="Architecture components">
            {architectureParts.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={item.id === part.id}
                  onClick={() => setPartId(item.id)}
                  className={`w-full border px-3 py-2 text-left text-sm ${
                    item.id === part.id ? "border-ink bg-accent-soft/40" : "border-rule"
                  }`}
                >
                  {item.name}
                  <span className="mt-1 block font-mono text-xs text-ink-faint">{item.state}</span>
                </button>
              </li>
            ))}
          </ul>
          <article className="flex-1 border border-rule p-4" aria-labelledby={partHeading}>
            <h3 id={partHeading} className="font-display text-lg">
              {part.name}
            </h3>
            <p className="mt-1 font-mono text-xs text-ink-faint">{part.state}</p>
            <dl className="mt-3 space-y-3 text-sm">
              {(
                [
                  ["Responsibility", part.responsibility],
                  ["Inputs", part.inputs],
                  ["Outputs", part.outputs],
                  ["Dependencies", part.dependencies],
                  ["Failure modes", part.failureModes],
                  ["Testing", part.tests],
                ] as const
              ).map(([term, detail]) => (
                <div key={term}>
                  <dt className="label">{term}</dt>
                  <dd className="mt-1 text-ink-muted">{detail}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </NotebookSection>

      <NotebookSection
        id="decisions"
        number="12"
        title="Research decisions"
        intro="Each choice depends on the question, the data, and the cost of being wrong. None of these is a universal method."
      >
        <div className="flex flex-col gap-2">
          {researchDecisions.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === decision.id}
              onClick={() => setDecisionId(item.id)}
              className={`border px-3 py-2 text-left text-sm ${
                item.id === decision.id ? "border-ink bg-accent-soft/40" : "border-rule"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
        <article className="mt-4 border border-rule p-4" aria-labelledby={decisionHeading}>
          <h3 id={decisionHeading} className="font-display text-lg">
            {decision.title}
          </h3>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="label">Problem</dt>
              <dd className="mt-1 text-ink-muted">{decision.problem}</dd>
            </div>
            <div>
              <dt className="label">Alternatives</dt>
              <dd className="mt-1 text-ink-muted">{decision.alternatives}</dd>
            </div>
            <div>
              <dt className="label">Trade-offs</dt>
              <dd className="mt-1 text-ink-muted">{decision.tradeoffs}</dd>
            </div>
            <div>
              <dt className="label">What would change the choice</dt>
              <dd className="mt-1 text-ink-muted">{decision.change}</dd>
            </div>
          </dl>
        </article>
      </NotebookSection>

      <NotebookSection
        id="roadmap"
        number="13"
        title="Roadmap"
        intro="A phase is implemented only when the repository contains it and a check can see it."
      >
        <ol className="space-y-3">
          {researchRoadmap.map((phase) => (
            <li key={phase.phase} className="border border-rule p-4 text-sm">
              <p className="font-mono text-xs text-ink-faint">Phase {phase.phase}</p>
              <p className="mt-1 text-ink">{phase.title}</p>
              <p className="mt-2">
                <span className="font-mono text-xs uppercase tracking-label text-ink-faint">{phase.status}</span>
              </p>
              <p className="mt-1 text-ink-muted">{phase.evidence}</p>
            </li>
          ))}
        </ol>
      </NotebookSection>

      <NotebookSection
        id="projects"
        number="14"
        title="Inspected projects"
        intro="I read the public repositories before writing these notes. Where I did not run the code, the note says so."
      >
        <ul className="space-y-4">
          {inspectedProjects.map((project) => (
            <li key={project.name} className="border border-rule p-4 text-sm">
              <h3 className="font-display text-lg">
                <ExternalLink href={project.href}>{project.name}</ExternalLink>
              </h3>
              {project.also ? (
                <p className="mt-2 text-ink-muted">
                  {project.also.map((link, index) => (
                    <span key={link.href}>
                      {index > 0 ? " · " : null}
                      <ExternalLink href={link.href}>{link.label}</ExternalLink>
                    </span>
                  ))}
                </p>
              ) : null}
              <dl className="mt-3 space-y-2">
                {(
                  [
                    ["Problem", project.problem],
                    ["What the code is", project.implements],
                    ["Evaluation", project.evaluation],
                    ["What can be rerun", project.reproducible],
                    ["Limits", project.limits],
                    ["Relation to this page", project.relation],
                  ] as const
                ).map(([term, detail]) => (
                  <div key={term}>
                    <dt className="label">{term}</dt>
                    <dd className="mt-1 text-ink-muted">{detail}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-ink-muted">{unusedInspection}</p>
      </NotebookSection>
    </div>
  );
}
