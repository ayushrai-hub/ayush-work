/**
 * Interactive sections for the machine-learning proof of work.
 *
 * Every count and metric is computed in `src/lib/mlEngineer`. Training, serving, monitoring, and
 * promotion are browser simulations. The components say so in the section copy.
 *
 * Connects to:
 * - src/pages/MlEngineerPowPage.tsx.
 * - src/components/pow/PmChrome.tsx (`NotebookSection`).
 * - src/lib/mlEngineer and src/content/mlEngineerPow.ts.
 */
import { useMemo, useState, type ReactNode } from "react";
import { NotebookSection, StatusMark } from "../PmChrome";
import { ML_CASE_STUDIES } from "../../../content/mlEngineerPow";
import {
  ARCHITECTURE,
  BASE_TELEMETRY,
  DEFAULT_TRAIN_CONFIG,
  DEMAND_ROWS,
  DEMO_DATASET_LABEL,
  FAILURE_CASES,
  MONITOR_SCENARIOS,
  PERF_OPTIONS,
  REPRO_MANIFEST,
  ROADMAP,
  SAFE_FEATURE_NAMES,
  SAMPLE_REQUEST,
  TEST_MATRIX,
  TRADEOFFS,
  applyPromotion,
  buildSupervised,
  defaultGateOptions,
  demonstrationExperiments,
  evaluateGates,
  formatMetric,
  initialArtifacts,
  percentOf,
  preprocessingLeakageExample,
  problemEffects,
  randomSplit,
  rollingLeakageExample,
  runInvariants,
  scoreHoldout,
  simulateInference,
  simulateRetrain,
  simulateTraining,
  validateDataset,
  type GateOptions,
  type InferScenario,
  type ModelArtifact,
  type ProblemChoice,
  type RetrainTrigger,
  type TrainConfig,
} from "../../../lib/mlEngineer";

/** Short label used wherever a figure is computed in the browser. */
function SimNote({ children }: { children: string }) {
  return <p className="mt-3 max-w-measure text-sm text-ink-muted">{children}</p>;
}

/** Labeled select. The label is wired with `htmlFor`. */
function SelectField({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className="block text-sm text-ink">
      <span className="mb-1 block font-mono text-xs uppercase tracking-label text-ink-faint">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-rule bg-paper-elevated px-2 py-2 text-sm text-ink"
      >
        {children}
      </select>
    </label>
  );
}

/** Horizontal bars whose widths are shares of the largest count. */
function Bars({ rows }: { rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return (
    <ul className="space-y-2" aria-label="Error buckets">
      {rows.map((row) => (
        <li key={row.label} className="grid grid-cols-[4rem_1fr_2rem] items-center gap-3 text-sm">
          <span className="font-mono text-ink-muted">{row.label}</span>
          <span className="block h-2 bg-accent-soft">
            <span className="block h-2 bg-accent" style={{ width: `${(row.count / max) * 100}%` }} />
          </span>
          <span className="font-mono text-ink">{row.count}</span>
        </li>
      ))}
    </ul>
  );
}

/** The workbench, from the problem statement through the proposed roadmap. */
export default function MlLab() {
  const report = useMemo(() => validateDataset(), []);
  const features = useMemo(() => buildSupervised(), []);
  const score = useMemo(() => scoreHoldout(features.supervised), [features.supervised]);
  const experiments = useMemo(() => demonstrationExperiments(score), [score]);
  const leak = useMemo(() => rollingLeakageExample(features.supervised), [features.supervised]);
  const prepLeak = useMemo(() => preprocessingLeakageExample(), []);
  const random = useMemo(() => randomSplit(features.supervised, 7), [features.supervised]);

  const [problem, setProblem] = useState<ProblemChoice>({
    horizonDays: 7,
    target: "units",
    metric: "mae",
  });
  const [rowId, setRowId] = useState(report.rows.find((row) => row.status === "fail")?.id ?? report.rows[0].id);
  const [featureId, setFeatureId] = useState(features.supervised[0]?.id ?? "");
  const [trainConfig, setTrainConfig] = useState<TrainConfig>(DEFAULT_TRAIN_CONFIG);
  const [trainResult, setTrainResult] = useState(() => simulateTraining(DEFAULT_TRAIN_CONFIG));
  const [gates, setGates] = useState<GateOptions>(defaultGateOptions);
  const [artifacts, setArtifacts] = useState<ModelArtifact[]>(() => initialArtifacts(score));
  const [scenario, setScenario] = useState<InferScenario>("ok");
  const [monitorId, setMonitorId] = useState(MONITOR_SCENARIOS[0].id);
  const [trigger, setTrigger] = useState<RetrainTrigger>("new_labels");
  const [archId, setArchId] = useState(ARCHITECTURE[0].id);
  const [failureId, setFailureId] = useState(FAILURE_CASES[0].id);
  const [perfId, setPerfId] = useState(PERF_OPTIONS[0].id);
  const [tradeId, setTradeId] = useState(TRADEOFFS[0].id);
  const [invariants, setInvariants] = useState(() => runInvariants());

  const effects = problemEffects(problem);
  const inspected = DEMAND_ROWS.find((row) => row.id === rowId) ?? DEMAND_ROWS[0];
  const inspectedReport = report.rows.find((row) => row.id === rowId);
  const featureRow = features.supervised.find((row) => row.id === featureId) ?? features.supervised[0];
  const gateReport = evaluateGates(gates, score);
  const inference = simulateInference(scenario);
  const monitor = MONITOR_SCENARIOS.find((item) => item.id === monitorId) ?? MONITOR_SCENARIOS[0];
  const telemetry = monitor.apply(BASE_TELEMETRY.map((point) => ({ ...point })));
  const retrain = simulateRetrain(trigger);
  const architecture = ARCHITECTURE.find((node) => node.id === archId) ?? ARCHITECTURE[0];
  const failure = FAILURE_CASES.find((item) => item.id === failureId) ?? FAILURE_CASES[0];
  const perf = PERF_OPTIONS.find((item) => item.id === perfId) ?? PERF_OPTIONS[0];
  const tradeoff = TRADEOFFS.find((item) => item.id === tradeId) ?? TRADEOFFS[0];
  const production = artifacts.find((item) => item.approval === "production");

  return (
    <div id="ml-systems-lab">
      <NotebookSection
        id="problem"
        number="01"
        title="Problem formulation"
        intro="The business ask is a weekly stocking decision. The model’s job is narrower: predict a number. Changing the target or the horizon changes the data, the features, the split, and the request the service must accept."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            id="horizon"
            label="Prediction horizon"
            value={String(problem.horizonDays)}
            onChange={(value) =>
              setProblem((current) => ({ ...current, horizonDays: Number(value) as 7 | 14 | 28 }))
            }
          >
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="28">28 days</option>
          </SelectField>
          <SelectField
            id="target"
            label="Prediction target"
            value={problem.target}
            onChange={(value) => setProblem((current) => ({ ...current, target: value as "units" | "revenue" }))}
          >
            <option value="units">Units sold</option>
            <option value="revenue">Revenue (units times price)</option>
          </SelectField>
          <SelectField
            id="primary-metric"
            label="Primary metric"
            value={problem.metric}
            onChange={(value) => setProblem((current) => ({ ...current, metric: value as "mae" | "rmse" }))}
          >
            <option value="mae">MAE</option>
            <option value="rmse">RMSE</option>
          </SelectField>
        </div>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <dt className="label">Business objective</dt>
            <dd className="mt-1 text-ink-muted">Decide how much of a product to have on hand for the next horizon. The model does not place the order.</dd>
          </div>
          <div>
            <dt className="label">Unit of prediction</dt>
            <dd className="mt-1 text-ink-muted">One product, one week, one number. Not a store total and not a price.</dd>
          </div>
          <div>
            <dt className="label">Known at inference</dt>
            <dd className="mt-1 text-ink-muted">Planned price, promotion, inventory, category, and sales from earlier weeks.</dd>
          </div>
          <div>
            <dt className="label">Not known at inference</dt>
            <dd className="mt-1 text-ink-muted">The week’s actual units. A column that copies them is leakage.</dd>
          </div>
          <div>
            <dt className="label">Training data</dt>
            <dd className="mt-1 text-ink-muted">Closed weeks that pass the contract, with enough history for a lag.</dd>
          </div>
          <div>
            <dt className="label">Error cost</dt>
            <dd className="mt-1 text-ink-muted">Predicting too few can stock out. Predicting too many can waste inventory. MAE does not know which cost is larger.</dd>
          </div>
        </dl>
        <ul className="mt-6 space-y-3">
          {effects.map((effect) => (
            <li key={effect.topic} className="border-t border-rule pt-3">
              <p className="font-mono text-xs uppercase tracking-label text-ink-faint">{effect.topic}</p>
              <p className="mt-1 text-ink-muted">{effect.effect}</p>
            </li>
          ))}
        </ul>
      </NotebookSection>

      <NotebookSection
        id="data"
        number="02"
        title="Data pipeline and validation"
        intro="Raw rows are checked, not dropped quietly. A failed row is quarantined or its feature is rejected, and the report keeps the reason. The clean set is what later sections are allowed to use."
      >
        <p className="text-sm text-ink-muted">{DEMO_DATASET_LABEL}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-sm md:grid-cols-4">
          <div className="border border-rule p-3">
            <dt className="text-ink-faint">Rows</dt>
            <dd className="text-ink">{report.total}</dd>
          </div>
          <div className="border border-rule p-3">
            <dt className="text-ink-faint">Passed</dt>
            <dd className="text-ink">
              {report.passed} ({percentOf(report.passed, report.total)}%)
            </dd>
          </div>
          <div className="border border-rule p-3">
            <dt className="text-ink-faint">Failed</dt>
            <dd className="text-ink">
              {report.failed} ({percentOf(report.failed, report.total)}%)
            </dd>
          </div>
          <div className="border border-rule p-3">
            <dt className="text-ink-faint">Clean for features</dt>
            <dd className="text-ink">{features.cleanCount}</dd>
          </div>
        </dl>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">Validation issue counts derived from the synthetic rows</caption>
            <thead>
              <tr className="border-b border-rule font-mono text-xs uppercase tracking-label text-ink-faint">
                <th scope="col" className="py-2 pr-4 font-normal">Check</th>
                <th scope="col" className="py-2 pr-4 font-normal">Issues</th>
                <th scope="col" className="py-2 font-normal">Result</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(report.byCode).map(([code, count]) => (
                <tr key={code} className="border-b border-rule">
                  <th scope="row" className="py-2 pr-4 font-normal text-ink">{code}</th>
                  <td className="py-2 pr-4 font-mono text-ink">{count}</td>
                  <td className="py-2 text-ink-muted">{count === 0 ? "No row failed this check." : "Failed rows are quarantined or the feature is rejected."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 max-w-sm">
          <SelectField id="inspect-row" label="Inspect row" value={rowId} onChange={setRowId}>
            {DEMAND_ROWS.map((row) => (
              <option key={row.id} value={row.id}>
                {row.id} · {row.sku} · {row.observedOn}
              </option>
            ))}
          </SelectField>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <pre className="overflow-x-auto border border-rule bg-paper-elevated p-3 font-mono text-xs text-ink">
            {JSON.stringify(inspected, null, 2)}
          </pre>
          <div>
            <p className="text-sm text-ink">
              Status: {inspectedReport?.status === "pass" ? "pass, eligible for the clean set" : "fail, not eligible until a person resolves it"}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              {inspectedReport?.issues.length ? (
                inspectedReport.issues.map((item) => (
                  <li key={`${item.code}-${item.field}`}>
                    <span className="font-mono text-ink">{item.code}</span> on {item.field}. Action: {item.action}. {item.message}
                  </li>
                ))
              ) : (
                <li>No issues. The row can enter feature construction.</li>
              )}
            </ul>
          </div>
        </div>
        <SimNote>
          A production load would write the same report, alert when a check count moves, and version the contract when a rename is approved. It would not delete the bad row and continue.
        </SimNote>
      </NotebookSection>

      <NotebookSection
        id="features"
        number="03"
        title="Feature engineering"
        intro="Features for a week use that week’s planned price, promotion, and inventory, plus earlier sales only. The first week of each product has no lag, so it is counted and left out of the supervised set."
      >
        <p className="text-sm text-ink-muted">
          Simulated feature pipeline. Clean rows: {features.cleanCount}. Dropped for missing history: {features.droppedForHistory}. Supervised rows: {features.supervised.length}.
        </p>
        <div className="mt-4 max-w-sm">
          <SelectField id="feature-row" label="Feature row" value={featureRow?.id ?? ""} onChange={setFeatureId}>
            {features.supervised.map((row) => (
              <option key={row.id} value={row.id}>
                {row.id} · {row.sku} · {row.observedOn}
              </option>
            ))}
          </SelectField>
        </div>
        {featureRow ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <caption className="sr-only">Feature values for the selected row</caption>
              <thead>
                <tr className="border-b border-rule font-mono text-xs uppercase tracking-label text-ink-faint">
                  <th scope="col" className="py-2 pr-4 font-normal">Feature</th>
                  <th scope="col" className="py-2 font-normal">Value</th>
                </tr>
              </thead>
              <tbody>
                {SAFE_FEATURE_NAMES.map((name) => (
                  <tr key={name} className="border-b border-rule">
                    <th scope="row" className="py-2 pr-4 font-mono font-normal text-ink">{name}</th>
                    <td className="py-2 font-mono text-ink-muted">{String(featureRow[name])}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="py-2 pr-4 font-mono font-normal text-ink">actual (target, not an input)</th>
                  <td className="py-2 font-mono text-ink-muted">{featureRow.actual}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="border border-rule p-4">
            <h3 className="text-base text-ink">Random split</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Seed 7 puts about 30 percent of supervised rows in test without reading the date.
              {random.violation
                ? ` Time order breaks: ${random.violation}`
                : " This seed happened to keep order. Another seed may not. The approved split is still the time-ordered one."}
            </p>
          </article>
          <article className="border border-rule p-4">
            <h3 className="text-base text-ink">Preprocessing before the split</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Grocery price median on every numeric price is {formatMetric(prepLeak.fullMedian)}. The median using only dates before {prepLeak.cutoff} is {formatMetric(prepLeak.pastMedian)}. Fitting the median on the full series lets later weeks shape a training feature.
            </p>
          </article>
          <article className="border border-rule p-4">
            <h3 className="text-base text-ink">Future in a rolling mean</h3>
            <p className="mt-2 text-sm text-ink-muted">
              {leak
                ? `At ${leak.observedOn} the causal rolling mean is ${formatMetric(leak.causal)}. A mean over the product’s later supervised weeks is ${formatMetric(leak.leaky)}. The second number is leakage.`
                : "No leakage example was available."}
            </p>
          </article>
        </div>
        <SimNote>
          Training-serving skew is the same definition computed differently in the two paths. Feature definitions belong in a versioned function, shared by the training job and the service. This page’s safe names are that contract for the simulation.
        </SimNote>
      </NotebookSection>

      <NotebookSection
        id="training"
        number="04"
        title="Model training pipeline"
        intro="Choosing a family does not train it. The baseline can finish because it is a fixed function. Linear models, forests, boosted trees, and neural nets stop at training with an explicit gap. Injected failures stop at the stage they name."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            id="family"
            label="Model family"
            value={trainConfig.family}
            onChange={(value) => setTrainConfig((current) => ({ ...current, family: value as TrainConfig["family"] }))}
          >
            <option value="baseline">Baseline predictor</option>
            <option value="linear">Linear regression</option>
            <option value="forest">Random forest</option>
            <option value="boosting">Gradient-boosted trees</option>
            <option value="neural">Neural network</option>
          </SelectField>
          <SelectField
            id="dataset-version"
            label="Dataset version"
            value={trainConfig.datasetVersion}
            onChange={(value) =>
              setTrainConfig((current) => ({ ...current, datasetVersion: value as TrainConfig["datasetVersion"] }))
            }
          >
            <option value="demo-v1">demo-v1</option>
            <option value="missing">missing</option>
            <option value="schema-mismatch">schema-mismatch</option>
          </SelectField>
          <SelectField
            id="feature-set"
            label="Feature set"
            value={trainConfig.featureSet}
            onChange={(value) =>
              setTrainConfig((current) => ({ ...current, featureSet: value as TrainConfig["featureSet"] }))
            }
          >
            <option value="safe-v1">safe-v1</option>
            <option value="leaky-v0">leaky-v0</option>
          </SelectField>
          <SelectField
            id="validation-strategy"
            label="Validation strategy"
            value={trainConfig.validation}
            onChange={(value) =>
              setTrainConfig((current) => ({ ...current, validation: value as TrainConfig["validation"] }))
            }
          >
            <option value="time">Time-ordered</option>
            <option value="random">Random</option>
          </SelectField>
          <SelectField
            id="train-metric"
            label="Recorded metric"
            value={trainConfig.metric}
            onChange={(value) => setTrainConfig((current) => ({ ...current, metric: value as TrainConfig["metric"] }))}
          >
            <option value="mae">MAE</option>
            <option value="rmse">RMSE</option>
          </SelectField>
          <SelectField
            id="injected-failure"
            label="Injected failure"
            value={trainConfig.injectedFailure}
            onChange={(value) =>
              setTrainConfig((current) => ({ ...current, injectedFailure: value as TrainConfig["injectedFailure"] }))
            }
          >
            <option value="none">None</option>
            <option value="resource">Resource limit</option>
            <option value="eval-gate">Evaluation gate</option>
            <option value="serialize">Artifact serialization</option>
          </SelectField>
          <label htmlFor="experiment-name" className="block text-sm text-ink">
            <span className="mb-1 block font-mono text-xs uppercase tracking-label text-ink-faint">Experiment name</span>
            <input
              id="experiment-name"
              value={trainConfig.experimentName}
              onChange={(event) => setTrainConfig((current) => ({ ...current, experimentName: event.target.value }))}
              className="w-full border border-rule bg-paper-elevated px-2 py-2 text-sm"
            />
          </label>
          <label htmlFor="learning-rate" className="block text-sm text-ink">
            <span className="mb-1 block font-mono text-xs uppercase tracking-label text-ink-faint">Learning rate</span>
            <input
              id="learning-rate"
              type="number"
              step="0.01"
              value={trainConfig.learningRate}
              onChange={(event) =>
                setTrainConfig((current) => ({ ...current, learningRate: Number(event.target.value) }))
              }
              className="w-full border border-rule bg-paper-elevated px-2 py-2 text-sm"
            />
          </label>
          <label htmlFor="seed" className="block text-sm text-ink">
            <span className="mb-1 block font-mono text-xs uppercase tracking-label text-ink-faint">Random seed</span>
            <input
              id="seed"
              type="number"
              value={trainConfig.seed}
              onChange={(event) => setTrainConfig((current) => ({ ...current, seed: Number(event.target.value) }))}
              className="w-full border border-rule bg-paper-elevated px-2 py-2 text-sm"
            />
          </label>
        </div>
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={() => setTrainResult(simulateTraining(trainConfig))}
        >
          Run simulated stages
        </button>
        <p className="mt-4 text-sm text-ink">
          Outcome: {trainResult.outcome}. Artifact id: {trainResult.artifactId ?? "none"}. {trainResult.metricsLabel}
          {trainResult.metrics ? ` MAE ${formatMetric(trainResult.metrics.mae)}, RMSE ${formatMetric(trainResult.metrics.rmse)}.` : ""}
        </p>
        <ol className="mt-4 space-y-2" aria-label="Simulated stages">
          {trainResult.stages.map((stage) => (
            <li key={stage.id} className="grid gap-1 border-t border-rule py-2 text-sm md:grid-cols-[10rem_6rem_1fr]">
              <span className="text-ink">{stage.label}</span>
              <span className="font-mono text-ink-muted">{stage.status}</span>
              <span className="text-ink-muted">{stage.note}</span>
            </li>
          ))}
        </ol>
        <SimNote>
          A real run would store the config, code revision, dataset version, dependency lock, metrics, and artifact together. This simulation stores none of that outside the page, and it does not print a GPU log.
        </SimNote>
      </NotebookSection>

      <NotebookSection
        id="experiments"
        number="05"
        title="Experiment tracking and reproducibility"
        intro="The first two rows are the same holdout scored with two disclosed functions. The forest row was not executed. Metrics from a different split are not filled in, because they would not be comparable."
      >
        <p className="text-sm text-ink-muted">Demonstration records. MLflow is not integrated.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">Demonstration experiments</caption>
            <thead>
              <tr className="border-b border-rule font-mono text-xs uppercase tracking-label text-ink-faint">
                {["Id", "Model", "Data", "Features", "Split", "MAE", "RMSE", "Status"].map((heading) => (
                  <th key={heading} scope="col" className="py-2 pr-3 font-normal">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {experiments.map((experiment) => (
                <tr key={experiment.id} className="border-b border-rule align-top">
                  <th scope="row" className="py-2 pr-3 font-mono font-normal text-ink">{experiment.id}</th>
                  <td className="py-2 pr-3 text-ink">{experiment.model}</td>
                  <td className="py-2 pr-3 text-ink-muted">{experiment.datasetVersion}</td>
                  <td className="py-2 pr-3 text-ink-muted">{experiment.featureVersion}</td>
                  <td className="py-2 pr-3 text-ink-muted">{experiment.validation}</td>
                  <td className="py-2 pr-3 font-mono text-ink">{formatMetric(experiment.mae)}</td>
                  <td className="py-2 pr-3 font-mono text-ink">{formatMetric(experiment.rmse)}</td>
                  <td className="py-2 text-ink-muted">{experiment.status}. {experiment.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="mt-6 text-base text-ink">Manifest</h3>
        <ul className="mt-2 space-y-2 text-sm text-ink-muted">
          {REPRO_MANIFEST.map((item) => (
            <li key={item.field}>
              <span className="text-ink">{item.field}. </span>
              {item.value}
            </li>
          ))}
        </ul>
      </NotebookSection>

      <NotebookSection
        id="evaluation"
        number="06"
        title="Evaluation and release gates"
        intro="The holdout is the last two supervised weeks of each product. Averages sit next to the category slices because a win on the average can still lose a category. R-squared on six points is easy to overread, and it is omitted from the gate."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <caption className="sr-only">Holdout metrics for the disclosed functions</caption>
            <thead>
              <tr className="border-b border-rule font-mono text-xs uppercase tracking-label text-ink-faint">
                <th scope="col" className="py-2 pr-3 font-normal">Function</th>
                <th scope="col" className="py-2 pr-3 font-normal">MAE</th>
                <th scope="col" className="py-2 pr-3 font-normal">RMSE</th>
                <th scope="col" className="py-2 font-normal">R-squared</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Baseline (lag)", score.baseline],
                  ["Fixed blend", score.blend],
                  ["Worse function", score.worse],
                ] as const
              ).map(([label, metrics]) => (
                <tr key={label} className="border-b border-rule">
                  <th scope="row" className="py-2 pr-3 font-normal text-ink">{label}</th>
                  <td className="py-2 pr-3 font-mono">{formatMetric(metrics.mae)}</td>
                  <td className="py-2 pr-3 font-mono">{formatMetric(metrics.rmse)}</td>
                  <td className="py-2 font-mono">{formatMetric(metrics.r2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-base text-ink">Absolute blend error</h3>
            <div className="mt-3">
              <Bars rows={score.blendErrors} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <h3 className="text-base text-ink">By category</h3>
            <table className="mt-3 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-rule font-mono text-xs uppercase tracking-label text-ink-faint">
                  <th scope="col" className="py-2 pr-3 font-normal">Category</th>
                  <th scope="col" className="py-2 pr-3 font-normal">Rows</th>
                  <th scope="col" className="py-2 pr-3 font-normal">Baseline MAE</th>
                  <th scope="col" className="py-2 font-normal">Blend MAE</th>
                </tr>
              </thead>
              <tbody>
                {score.slices.map((slice) => (
                  <tr key={slice.category} className="border-b border-rule">
                    <th scope="row" className="py-2 pr-3 font-normal">{slice.category}</th>
                    <td className="py-2 pr-3 font-mono">{slice.count}</td>
                    <td className="py-2 pr-3 font-mono">{formatMetric(slice.baselineMae)}</td>
                    <td className="py-2 font-mono">{formatMetric(slice.blendMae)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">Individual holdout errors</caption>
            <thead>
              <tr className="border-b border-rule font-mono text-xs uppercase tracking-label text-ink-faint">
                {["Week", "Product", "Actual", "Baseline", "Blend", "Baseline error", "Blend error"].map((heading) => (
                  <th key={heading} scope="col" className="py-2 pr-3 font-normal">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {score.test.map((row) => (
                <tr key={row.id} className="border-b border-rule">
                  <th scope="row" className="py-2 pr-3 font-normal">{row.observedOn}</th>
                  <td className="py-2 pr-3">{row.sku}</td>
                  <td className="py-2 pr-3 font-mono">{row.actual}</td>
                  <td className="py-2 pr-3 font-mono">{formatMetric(row.baseline)}</td>
                  <td className="py-2 pr-3 font-mono">{formatMetric(row.blend)}</td>
                  <td className="py-2 pr-3 font-mono">{formatMetric(Math.abs(row.actual - row.baseline))}</td>
                  <td className="py-2 font-mono">{formatMetric(Math.abs(row.actual - row.blend))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <SelectField
            id="candidate"
            label="Candidate function"
            value={gates.candidate}
            onChange={(value) => setGates((current) => ({ ...current, candidate: value as GateOptions["candidate"] }))}
          >
            <option value="blend">Fixed blend</option>
            <option value="worse">Worse function</option>
          </SelectField>
          <SelectField
            id="gate-split"
            label="Split used for the gate"
            value={gates.validation}
            onChange={(value) => setGates((current) => ({ ...current, validation: value as GateOptions["validation"] }))}
          >
            <option value="time">Time-ordered</option>
            <option value="random">Random</option>
          </SelectField>
          <label htmlFor="slice-threshold" className="block text-sm text-ink">
            <span className="mb-1 block font-mono text-xs uppercase tracking-label text-ink-faint">Max category MAE regression</span>
            <input
              id="slice-threshold"
              type="number"
              step="0.1"
              value={gates.maxSliceRegression}
              onChange={(event) =>
                setGates((current) => ({ ...current, maxSliceRegression: Number(event.target.value) }))
              }
              className="w-full border border-rule bg-paper-elevated px-2 py-2 text-sm"
            />
          </label>
          <label htmlFor="unresolved" className="block text-sm text-ink">
            <span className="mb-1 block font-mono text-xs uppercase tracking-label text-ink-faint">Unresolved critical failures</span>
            <input
              id="unresolved"
              type="number"
              min="0"
              value={gates.unresolvedCritical}
              onChange={(event) =>
                setGates((current) => ({ ...current, unresolvedCritical: Number(event.target.value) }))
              }
              className="w-full border border-rule bg-paper-elevated px-2 py-2 text-sm"
            />
          </label>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={gates.artifactPresent}
            onChange={(event) => setGates((current) => ({ ...current, artifactPresent: event.target.checked }))}
          />
          Candidate artifact id is present
        </label>
        <ul className="mt-4 space-y-3">
          {gateReport.checks.map((check) => (
            <li key={check.id} className="border-t border-rule pt-3 text-sm">
              <label className="flex items-start gap-2 text-ink">
                <input
                  type="checkbox"
                  checked={gates.enabled[check.id] ?? false}
                  onChange={(event) =>
                    setGates((current) => ({
                      ...current,
                      enabled: { ...current.enabled, [check.id]: event.target.checked },
                    }))
                  }
                />
                <span>
                  {check.label}{" "}
                  <span className="font-mono text-ink-muted">{check.passed ? "pass" : "fail"}</span>
                </span>
              </label>
              <p className="mt-1 pl-6 text-ink-muted">{check.detail}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-ink" role="status">
          Promotion decision: {gateReport.promoted ? "allowed" : "blocked"}. Train rows used only as history: {score.trainCount}. Holdout rows scored: {score.test.length}.
        </p>
      </NotebookSection>

      <NotebookSection
        id="registry"
        number="07"
        title="Model registry and artifacts"
        intro="Weights without the feature spec, the data version, and the evaluation are not a deployable package. This table is synthetic. Applying the decision updates page state only."
      >
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setArtifacts(applyPromotion(initialArtifacts(score), gateReport.promoted))}
        >
          Apply promotion decision
        </button>
        <p className="mt-3 text-sm text-ink-muted">
          Current production id: {production?.id ?? "none"}. A blocked decision rejects the blend and leaves the baseline in production.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">Synthetic artifacts</caption>
            <thead>
              <tr className="border-b border-rule font-mono text-xs uppercase tracking-label text-ink-faint">
                {["Id", "Family", "Data", "Features", "Evaluation", "Approval"].map((heading) => (
                  <th key={heading} scope="col" className="py-2 pr-3 font-normal">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {artifacts.map((artifact) => (
                <tr key={artifact.id} className="border-b border-rule">
                  <th scope="row" className="py-2 pr-3 font-mono font-normal">{artifact.id}</th>
                  <td className="py-2 pr-3">{artifact.family}</td>
                  <td className="py-2 pr-3">{artifact.datasetVersion}</td>
                  <td className="py-2 pr-3">{artifact.featureVersion}</td>
                  <td className="py-2 pr-3">{artifact.evaluationSummary}</td>
                  <td className="py-2">{artifact.approval} · synthetic</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SimNote>
          Path in a real registry: experiment, evaluated candidate, registered artifact, staging, approval, production. This page skips staging infrastructure. It does not claim a deployment.
        </SimNote>
      </NotebookSection>

      <NotebookSection
        id="inference"
        number="08"
        title="Inference and serving"
        intro="The path is request validation, feature preparation, a pinned predictor, response validation, then a log line. The predictor here is the fixed blend. A failed check returns an error and no invented number."
      >
        <SelectField id="infer-scenario" label="Inference scenario" value={scenario} onChange={(value) => setScenario(value as InferScenario)}>
          <option value="ok">Valid request</option>
          <option value="malformed">Malformed request</option>
          <option value="missing">Missing feature</option>
          <option value="unexpected_category">Unexpected category</option>
          <option value="unavailable">Artifact unavailable</option>
          <option value="timeout">Timeout</option>
          <option value="invalid_output">Invalid model output</option>
        </SelectField>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <pre className="overflow-x-auto border border-rule bg-paper-elevated p-3 font-mono text-xs text-ink">
            {JSON.stringify(scenario === "ok" ? SAMPLE_REQUEST : { scenario }, null, 2)}
          </pre>
          <pre className="overflow-x-auto border border-rule bg-paper-elevated p-3 font-mono text-xs text-ink" role="status">
            {JSON.stringify(inference, null, 2)}
          </pre>
        </div>
        <SimNote>
          Online serving answers one waiting caller and needs a timeout. Batch scoring writes a file and can spend more time per row. Latency, throughput, cost, and freshness move together: a fresher feature lookup can blow the timeout that a nightly batch would ignore. Retries belong on idempotent reads, not on a write that might double-count. This page does not run a service.
        </SimNote>
      </NotebookSection>

      <NotebookSection
        id="performance"
        number="09"
        title="Inference performance"
        intro="These are engineering choices, not measurements from this site. Nothing here was timed on a GPU, and quantization is not claimed to be faster end to end."
      >
        <SelectField id="perf-option" label="Optimization choice" value={perfId} onChange={setPerfId}>
          {PERF_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </SelectField>
        <dl className="mt-4 space-y-3 text-sm">
          {(
            [
              ["Expected benefit", perf.benefit],
              ["Quality trade-off", perf.quality],
              ["Operational complexity", perf.complexity],
              ["Hardware", perf.hardware],
              ["When it fits", perf.when],
              ["What to measure first", perf.measure],
            ] as const
          ).map(([label, body]) => (
            <div key={label} className="border-t border-rule pt-3">
              <dt className="font-mono text-xs uppercase tracking-label text-ink-faint">{label}</dt>
              <dd className="mt-1 text-ink-muted">{body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-ink-muted">
          Illustrative discussion only. I have not implemented CUDA kernels, TensorRT, or vLLM in the repositories inspected for this page.
        </p>
      </NotebookSection>

      <NotebookSection
        id="monitoring"
        number="10"
        title="Monitoring and drift"
        intro="The series below is invented. An input shift is data drift. A higher error after labels arrive is a quality signal. An unloadable artifact is a reliability failure. Drift detection does not prove the model became less accurate."
      >
        <div className="flex flex-wrap gap-2" role="group" aria-label="Monitoring scenarios">
          {MONITOR_SCENARIOS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === monitorId}
              onClick={() => setMonitorId(item.id)}
              className={`border px-3 py-2 text-left text-sm ${
                item.id === monitorId ? "border-ink bg-accent-soft/50 text-ink" : "border-rule text-ink-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink" role="status">
          <span className="font-mono uppercase">{monitor.kind}</span>. {monitor.alert}
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-muted">
          {monitor.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">Synthetic weekly telemetry</caption>
            <thead>
              <tr className="border-b border-rule font-mono text-xs uppercase tracking-label text-ink-faint">
                {["Week", "Requests", "Error rate", "Mean prediction", "Missing features", "Latency ms"].map((heading) => (
                  <th key={heading} scope="col" className="py-2 pr-3 font-normal">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {telemetry.map((point) => (
                <tr key={point.week} className="border-b border-rule">
                  <th scope="row" className="py-2 pr-3 font-normal">{point.week}</th>
                  <td className="py-2 pr-3 font-mono">{point.requests}</td>
                  <td className="py-2 pr-3 font-mono">{point.errorRate}</td>
                  <td className="py-2 pr-3 font-mono">{point.meanPrediction}</td>
                  <td className="py-2 pr-3 font-mono">{point.missingFeatureRate}</td>
                  <td className="py-2 font-mono">{point.latencyMs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SimNote>Model-version mix in this simulation is a single synthetic id. There is no production monitor behind these rows.</SimNote>
      </NotebookSection>

      <NotebookSection
        id="retraining"
        number="11"
        title="Retraining and lifecycle"
        intro="A trigger starts a review. It does not replace the approved model. Retraining can make the next candidate worse, which is why the worse function is rejected and why rollback has to remain possible."
      >
        <SelectField id="retrain-trigger" label="Retrain trigger" value={trigger} onChange={(value) => setTrigger(value as RetrainTrigger)}>
          <option value="new_labels">New labeled data</option>
          <option value="schedule">Scheduled window</option>
          <option value="performance">Performance threshold</option>
          <option value="distribution">Distribution change</option>
          <option value="spec_change">Feature specification change</option>
        </SelectField>
        <p className="mt-4 text-sm text-ink" role="status">
          Decision: {retrain.decision === "reject" ? "reject, production stays" : "recommend review, do not auto-promote"}. {retrain.reason}
        </p>
        <ol className="mt-3 space-y-2" aria-label="Retraining steps">
          {retrain.steps.map((step) => (
            <li key={step.name} className="border-t border-rule py-2 text-sm">
              <span className="text-ink">{step.name}</span>{" "}
              <span className="font-mono text-ink-muted">{step.status}</span>
              <span className="mt-1 block text-ink-muted">{step.note}</span>
            </li>
          ))}
        </ol>
      </NotebookSection>

      <NotebookSection
        id="architecture"
        number="12"
        title="System architecture"
        intro="A reference diagram for how data and artifacts would move. It is not a picture of deployed infrastructure."
      >
        <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <div className="flex flex-col gap-2" role="list" aria-label="Architecture components">
            {ARCHITECTURE.map((node, index) => (
              <div key={node.id}>
                <button
                  type="button"
                  aria-pressed={node.id === archId}
                  onClick={() => setArchId(node.id)}
                  className={`w-full border px-3 py-2 text-left text-sm ${
                    node.id === archId ? "border-ink text-ink" : "border-rule text-ink-muted"
                  }`}
                >
                  {index + 1}. {node.name}
                </button>
                {index < ARCHITECTURE.length - 1 ? (
                  <p aria-hidden="true" className="py-1 text-center font-mono text-xs text-ink-faint">↓</p>
                ) : null}
              </div>
            ))}
          </div>
          <dl className="space-y-3 text-sm">
            {(
              [
                ["Responsibility", architecture.responsibility],
                ["Inputs", architecture.inputs],
                ["Outputs", architecture.outputs],
                ["Dependencies", architecture.dependencies],
                ["Failure mode", architecture.failure],
                ["Observability", architecture.observability],
                ["Security", architecture.security],
                ["Scaling", architecture.scaling],
              ] as const
            ).map(([label, body]) => (
              <div key={label} className="border-t border-rule pt-3">
                <dt className="font-mono text-xs uppercase tracking-label text-ink-faint">{label}</dt>
                <dd className="mt-1 text-ink-muted">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </NotebookSection>

      <NotebookSection
        id="failures"
        number="13"
        title="Production failure lab"
        intro="Each case is a local simulation of the response. The evidence line points at a check this page actually runs."
      >
        <div className="flex flex-col gap-2" role="list" aria-label="Failure scenarios">
          {FAILURE_CASES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === failureId}
              onClick={() => setFailureId(item.id)}
              className={`border px-3 py-2 text-left text-sm ${
                item.id === failureId ? "border-ink text-ink" : "border-rule text-ink-muted"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
        <dl className="mt-4 space-y-3 text-sm">
          {(
            [
              ["Trigger", failure.trigger],
              ["Observable symptom", failure.symptom],
              ["Root-cause investigation", failure.investigation],
              ["Mitigation", failure.mitigation],
              ["Recovery", failure.recovery],
              ["Prevention", failure.prevention],
              ["Relevant check", failure.evidence],
            ] as const
          ).map(([label, body]) => (
            <div key={label} className="border-t border-rule pt-3">
              <dt className="font-mono text-xs uppercase tracking-label text-ink-faint">{label}</dt>
              <dd className="mt-1 text-ink-muted">{body}</dd>
            </div>
          ))}
        </dl>
      </NotebookSection>

      <NotebookSection
        id="testing"
        number="14"
        title="Testing and quality engineering"
        intro="A model score is not a substitute for a contract test. The matrix says what each kind of test is for. The button runs the checks this repository can execute for the demonstration."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">Testing matrix</caption>
            <thead>
              <tr className="border-b border-rule font-mono text-xs uppercase tracking-label text-ink-faint">
                <th scope="col" className="py-2 pr-3 font-normal">Test</th>
                <th scope="col" className="py-2 pr-3 font-normal">What it looks for</th>
                <th scope="col" className="py-2 font-normal">On this page</th>
              </tr>
            </thead>
            <tbody>
              {TEST_MATRIX.map((row) => (
                <tr key={row.name} className="border-b border-rule align-top">
                  <th scope="row" className="py-2 pr-3 font-normal text-ink">{row.name}</th>
                  <td className="py-2 pr-3 text-ink-muted">{row.looksFor}</td>
                  <td className="py-2 text-ink-muted">{row.executedHere ? "Executed for the demonstration" : "Not executed. No benchmark was run."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="btn-secondary mt-4" onClick={() => setInvariants(runInvariants())}>
          Run invariant checks
        </button>
        <ul className="mt-4 space-y-2" aria-label="Invariant results">
          {invariants.map((item) => (
            <li key={item.name} className="text-sm">
              <span className="font-mono text-ink">{item.passed ? "pass" : "fail"}</span>{" "}
              <span className="text-ink">{item.name}</span>
              <span className="mt-1 block text-ink-muted">{item.detail}</span>
            </li>
          ))}
        </ul>
      </NotebookSection>

      <NotebookSection
        id="case-studies"
        number="15"
        title="Project case studies"
        intro="Inspected from the public GitHub account and the repositories named below. A missing repository is stated as missing."
      >
        <div className="space-y-8">
          {ML_CASE_STUDIES.map((item) => (
            <article key={item.id} className="border-t border-rule pt-4">
              <h3 className="text-xl text-ink">
                {item.href ? (
                  <a href={item.href} className="link-underline" target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h3>
              <dl className="mt-3 space-y-2 text-sm text-ink-muted">
                <div><dt className="text-ink">Exists</dt><dd>{item.exists}</dd></div>
                <div><dt className="text-ink">Implemented</dt><dd>{item.implemented}</dd></div>
                <div><dt className="text-ink">Demonstrated</dt><dd>{item.demonstrated}</dd></div>
                <div><dt className="text-ink">Synthetic</dt><dd>{item.synthetic}</dd></div>
                <div><dt className="text-ink">Incomplete</dt><dd>{item.incomplete}</dd></div>
                <div><dt className="text-ink">Next</dt><dd>{item.next}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </NotebookSection>

      <NotebookSection
        id="tradeoffs"
        number="16"
        title="Engineering trade-offs"
        intro="Each pair is reasonable under different constraints. Workload, reliability, data volume, latency, budget, and team size decide which side wins. There is no default winner."
      >
        <SelectField id="tradeoff" label="Trade-off" value={tradeId} onChange={setTradeId}>
          {TRADEOFFS.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </SelectField>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="border border-rule p-4">
            <h3 className="text-base text-ink">{tradeoff.left}</h3>
            <p className="mt-2 text-sm text-ink-muted">{tradeoff.leftWhen}</p>
          </article>
          <article className="border border-rule p-4">
            <h3 className="text-base text-ink">{tradeoff.right}</h3>
            <p className="mt-2 text-sm text-ink-muted">{tradeoff.rightWhen}</p>
          </article>
        </div>
        <p className="mt-4 text-sm text-ink-muted">What changes the choice: {tradeoff.depends}</p>
      </NotebookSection>

      <NotebookSection
        id="roadmap"
        number="17"
        title="What I would build next"
        intro="A proposed sequence. The workbench above is the interactive sketch. These stages are not finished infrastructure."
      >
        <ol className="space-y-6">
          {ROADMAP.map((stage) => (
            <li key={stage.stage}>
              <h3 className="text-lg text-ink">
                <span className="mr-2 font-mono text-sm text-ink-faint">{stage.stage}</span>
                {stage.title}
              </h3>
              <p className="mt-1"><StatusMark kind="proposed" /></p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                {stage.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </NotebookSection>
    </div>
  );
}
