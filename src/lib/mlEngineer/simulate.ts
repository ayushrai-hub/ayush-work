/**
 * Browser-only simulations for training, release gates, inference, monitoring, and retraining.
 *
 * None of these functions fit a model, call a network, or write an artifact. A completed baseline
 * run attaches the metrics from `scoreHoldout`. Other model families stop with an explicit gap.
 *
 * Connects to:
 * - src/lib/mlEngineer/metrics.ts and features.ts.
 * - src/components/pow/ml/Lab.tsx.
 */
import { splitBreaksTime, timeSplit, buildSupervised } from "./features";
import {
  blendPrediction,
  formatMetric,
  scoreHoldout,
  type HoldoutScore,
  type MetricTriple,
} from "./metrics";

/** Model families the configuration panel can name. Only `baseline` has a predictor here. */
export type ModelFamily = "baseline" | "linear" | "forest" | "boosting" | "neural";

/** Failures a visitor can inject. `none` still fails when the config itself is invalid. */
export type InjectedFailure = "none" | "resource" | "eval-gate" | "serialize";

/** One training form. Changing it does not start a job until `simulateTraining` runs. */
export interface TrainConfig {
  family: ModelFamily;
  learningRate: number;
  datasetVersion: "demo-v1" | "missing" | "schema-mismatch";
  featureSet: "safe-v1" | "leaky-v0";
  validation: "time" | "random";
  metric: "mae" | "rmse";
  seed: number;
  experimentName: string;
  artifactDestination: string;
  injectedFailure: InjectedFailure;
}

/** Status of one simulated stage. */
export type StageStatus = "passed" | "failed" | "skipped";

/** One stage in a simulated run. `note` is an explanation, not a captured training log. */
export interface StageResult {
  id: string;
  label: string;
  status: StageStatus;
  note: string;
}

/** Result of one simulated run. `artifactId` is null unless every stage passed. */
export interface TrainSimulation {
  stages: StageResult[];
  outcome: "completed" | "failed";
  artifactId: string | null;
  metrics: MetricTriple | null;
  metricsLabel: string;
}

const STAGE_DEFS = [
  ["queued", "Queued"],
  ["data_validation", "Data validation"],
  ["feature_preparation", "Feature preparation"],
  ["training", "Training"],
  ["evaluation", "Evaluation"],
  ["artifact_creation", "Artifact creation"],
] as const;

/**
 * Fills the stage list, failing at `failAt` and skipping everything after it.
 * `notes` overrides the default sentence for a stage id.
 */
function stages(failAt: string | null, notes: Record<string, string> = {}): StageResult[] {
  let failed = false;
  return STAGE_DEFS.map(([id, label]) => {
    if (failed) {
      return { id, label, status: "skipped" as const, note: "Not started, because an earlier stage failed." };
    }
    if (failAt === id) {
      failed = true;
      return { id, label, status: "failed" as const, note: notes[id] ?? "Failed." };
    }
    return { id, label, status: "passed" as const, note: notes[id] ?? "Checked in the browser. Nothing was executed remotely." };
  });
}

/**
 * Walks the simulated lifecycle for `config`.
 * The baseline family can complete. Every other family stops because this page has no trainer for it.
 */
export function simulateTraining(config: TrainConfig): TrainSimulation {
  const name = config.experimentName.trim();
  const seedInvalid = !Number.isInteger(config.seed) || config.seed < 0;
  const rateMatters = config.family === "linear" || config.family === "neural";
  const rateInvalid = rateMatters && (config.learningRate <= 0 || config.learningRate > 1);
  if (!name || seedInvalid || rateInvalid || !config.artifactDestination.trim()) {
    return {
      stages: stages("queued", {
        queued: "Invalid configuration. The run needs a name, a non-negative integer seed, a destination, and a learning rate in (0, 1] for the linear and neural families.",
      }),
      outcome: "failed",
      artifactId: null,
      metrics: null,
      metricsLabel: "No metrics. The run did not start.",
    };
  }
  if (config.datasetVersion === "missing") {
    return {
      stages: stages("data_validation", {
        queued: "Configuration accepted.",
        data_validation: "Dataset version “missing” has no rows. Training is refused.",
      }),
      outcome: "failed",
      artifactId: null,
      metrics: null,
      metricsLabel: "No metrics.",
    };
  }
  if (config.datasetVersion === "schema-mismatch") {
    return {
      stages: stages("data_validation", {
        queued: "Configuration accepted.",
        data_validation: "The dataset version does not match the feature contract. Training is refused.",
      }),
      outcome: "failed",
      artifactId: null,
      metrics: null,
      metricsLabel: "No metrics.",
    };
  }
  if (config.featureSet === "leaky-v0") {
    return {
      stages: stages("feature_preparation", {
        queued: "Configuration accepted.",
        data_validation: "Clean rows from the demonstration table would be used.",
        feature_preparation: "Feature set leaky-v0 includes the target. Preparation stops.",
      }),
      outcome: "failed",
      artifactId: null,
      metrics: null,
      metricsLabel: "No metrics.",
    };
  }
  if (config.injectedFailure === "resource") {
    return {
      stages: stages("training", {
        queued: "Configuration accepted.",
        data_validation: "Clean rows available.",
        feature_preparation: "Safe feature set selected.",
        training: "Injected failure: the simulated resource limit was exceeded. No GPU log exists.",
      }),
      outcome: "failed",
      artifactId: null,
      metrics: null,
      metricsLabel: "No metrics.",
    };
  }
  if (config.family !== "baseline") {
    return {
      stages: stages("training", {
        queued: "Configuration accepted.",
        data_validation: "Clean rows available.",
        feature_preparation: "Safe feature set selected.",
        training: `${config.family} is a configuration choice only. This page does not fit that family.`,
      }),
      outcome: "failed",
      artifactId: null,
      metrics: null,
      metricsLabel: "No metrics, because no trainer ran.",
    };
  }
  if (config.injectedFailure === "eval-gate") {
    return {
      stages: stages("evaluation", {
        queued: "Configuration accepted.",
        data_validation: "Clean rows available.",
        feature_preparation: "Safe feature set selected.",
        training: "Baseline predictor selected. No coefficients were fit.",
        evaluation: "Injected failure: the evaluation gate rejected the run.",
      }),
      outcome: "failed",
      artifactId: null,
      metrics: null,
      metricsLabel: "Metrics withheld because the gate failed.",
    };
  }
  const score = scoreHoldout();
  const metrics = config.metric === "rmse" ? { ...score.baseline, mae: score.baseline.mae } : score.baseline;
  if (config.injectedFailure === "serialize") {
    return {
      stages: stages("artifact_creation", {
        queued: "Configuration accepted.",
        data_validation: "Clean rows available.",
        feature_preparation: "Safe feature set selected.",
        training: "Baseline predictor selected. No coefficients were fit.",
        evaluation: "Prepared holdout metrics are available. They are not a training log.",
        artifact_creation: "Injected failure: serialization failed. The approved artifact is left in place.",
      }),
      outcome: "failed",
      artifactId: null,
      metrics,
      metricsLabel: "Prepared baseline metrics from the time-ordered holdout. Not a training log.",
    };
  }
  const splitNote =
    config.validation === "random"
      ? "The form selected a random split. The attached numbers are still the time-ordered holdout, because this page does not resimulate a random fit."
      : "Evaluation uses the time-ordered holdout.";
  return {
    stages: stages(null, {
      queued: "Configuration accepted.",
      data_validation: "Clean demonstration rows would pass. Quarantined rows stay out.",
      feature_preparation: "Safe feature set. Target is not an input.",
      training: "Baseline is last week’s sales. Nothing was optimized.",
      evaluation: splitNote,
      artifact_creation: "A synthetic artifact id was minted in the page. No file was written.",
    }),
    outcome: "completed",
    artifactId: `sim-baseline-${config.datasetVersion}-seed${config.seed}`,
    metrics,
    metricsLabel: "Prepared baseline metrics from the time-ordered holdout. Not a training log.",
  };
}

/** The default form. It can complete as a baseline simulation. */
export const DEFAULT_TRAIN_CONFIG: TrainConfig = {
  family: "baseline",
  learningRate: 0.1,
  datasetVersion: "demo-v1",
  featureSet: "safe-v1",
  validation: "time",
  metric: "mae",
  seed: 7,
  experimentName: "demo-baseline",
  artifactDestination: "local-simulation",
  injectedFailure: "none",
};

/** One comparison row. Null metrics mean the run was not executed. */
export interface ExperimentRecord {
  id: string;
  model: string;
  datasetVersion: string;
  featureVersion: string;
  validation: string;
  status: string;
  mae: number | null;
  rmse: number | null;
  codeRevision: string;
  artifactVersion: string;
  comparable: boolean;
  note: string;
}

/**
 * Three demonstration experiments.
 * The first two use the holdout functions. The forest row has no metrics because it was not run.
 */
export function demonstrationExperiments(score: HoldoutScore = scoreHoldout()): ExperimentRecord[] {
  return [
    {
      id: "exp-baseline",
      model: "Baseline (lag)",
      datasetVersion: "demo-v1",
      featureVersion: "safe-v1",
      validation: "time-ordered holdout",
      status: "demonstration complete",
      mae: score.baseline.mae,
      rmse: score.baseline.rmse,
      codeRevision: "page-snapshot",
      artifactVersion: "sim-baseline",
      comparable: true,
      note: "Same rows and the same split as the fixed blend.",
    },
    {
      id: "exp-blend",
      model: "Fixed blend (not fitted)",
      datasetVersion: "demo-v1",
      featureVersion: "safe-v1",
      validation: "time-ordered holdout",
      status: "demonstration complete",
      mae: score.blend.mae,
      rmse: score.blend.rmse,
      codeRevision: "page-snapshot",
      artifactVersion: "sim-blend",
      comparable: true,
      note: "Coefficients are written in the page. They were not learned.",
    },
    {
      id: "exp-forest",
      model: "Random forest",
      datasetVersion: "demo-v1",
      featureVersion: "safe-v1",
      validation: "random split (proposed)",
      status: "not executed",
      mae: null,
      rmse: null,
      codeRevision: "not recorded",
      artifactVersion: "none",
      comparable: false,
      note: "No forest was trained. A random split would also make the number incomparable.",
    },
  ];
}

/** Fields a manifest would need. Values that this page does not have say so. */
export const REPRO_MANIFEST: { field: string; value: string }[] = [
  { field: "Dataset", value: "Synthetic DEMAND_ROWS in this repository. Not a registered dataset version." },
  { field: "Feature code", value: "src/lib/mlEngineer/features.ts, safe-v1." },
  { field: "Split", value: "Last two supervised weeks of each product." },
  { field: "Predictors", value: "baselinePrediction and blendPrediction in metrics.ts." },
  { field: "Dependencies", value: "The site’s package.json. No ML library is imported." },
  { field: "Code revision", value: "Whatever commit contains this page. The simulation does not read git." },
  { field: "Tracker", value: "MLflow is not integrated." },
];

/** One release check. */
export interface GateCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

/** Inputs the visitor can change. Disabled checks do not block promotion. */
export interface GateOptions {
  candidate: "blend" | "worse";
  validation: "time" | "random";
  artifactPresent: boolean;
  unresolvedCritical: number;
  maxSliceRegression: number;
  enabled: Record<string, boolean>;
}

/**
 * Compares a candidate function with the baseline on the real holdout.
 * Promotion requires every enabled check to pass.
 */
export function evaluateGates(options: GateOptions, score: HoldoutScore = scoreHoldout()): {
  checks: GateCheck[];
  promoted: boolean;
} {
  const candidateMae = options.candidate === "blend" ? score.blend.mae : score.worse.mae;
  const baselineMae = score.baseline.mae;
  const beats =
    candidateMae !== null && baselineMae !== null && candidateMae < baselineMae;
  const sliceFailures = score.slices.filter((slice) => {
    const candidate = options.candidate === "blend" ? slice.blendMae : slice.worseMae;
    if (candidate === null || slice.baselineMae === null) return true;
    return candidate - slice.baselineMae > options.maxSliceRegression;
  });
  const checks: GateCheck[] = [
    {
      id: "baseline",
      label: "Candidate MAE is lower than the baseline on the time-ordered holdout.",
      passed: beats,
      detail: `Baseline MAE ${formatMetric(baselineMae)}, candidate MAE ${formatMetric(candidateMae)}.`,
    },
    {
      id: "validation",
      label: "No unresolved critical validation failures in the rows used for scoring.",
      passed: options.unresolvedCritical === 0,
      detail:
        options.unresolvedCritical === 0
          ? "The holdout is built from rows that already passed validation."
          : `${options.unresolvedCritical} unresolved failure${options.unresolvedCritical === 1 ? "" : "s"} block promotion.`,
    },
    {
      id: "artifact",
      label: "The candidate artifact id is present.",
      passed: options.artifactPresent,
      detail: options.artifactPresent ? "A synthetic id is present." : "No artifact id. Promotion stops.",
    },
    {
      id: "split",
      label: "Evaluation uses the approved time-ordered split.",
      passed: options.validation === "time",
      detail:
        options.validation === "time"
          ? "Time-ordered holdout."
          : "A random split is selected. It is not the approved protocol.",
    },
    {
      id: "slices",
      label: "No category MAE regresses by more than the allowed amount.",
      passed: sliceFailures.length === 0,
      detail:
        sliceFailures.length === 0
          ? "Every scored category stays inside the threshold."
          : `Regressed: ${sliceFailures.map((slice) => slice.category).join(", ")}.`,
    },
  ];
  const promoted = checks.every((check) => !options.enabled[check.id] || check.passed);
  return { checks, promoted };
}

/** Default gate form. The fixed blend is the candidate and every check is enabled. */
export function defaultGateOptions(): GateOptions {
  return {
    candidate: "blend",
    validation: "time",
    artifactPresent: true,
    unresolvedCritical: 0,
    maxSliceRegression: 2,
    enabled: { baseline: true, validation: true, artifact: true, split: true, slices: true },
  };
}

/** Synthetic artifact. `synthetic` is always true. */
export interface ModelArtifact {
  id: string;
  version: string;
  family: string;
  datasetVersion: string;
  featureVersion: string;
  evaluationSummary: string;
  codeRevision: string;
  approval: "production" | "candidate" | "rejected";
  synthetic: true;
}

/**
 * Starting registry.
 * The lag baseline is the approved version. The blend is only a candidate until gates pass.
 */
export function initialArtifacts(score: HoldoutScore = scoreHoldout()): ModelArtifact[] {
  return [
    {
      id: "sim-baseline",
      version: "0.1.0",
      family: "Baseline (lag)",
      datasetVersion: "demo-v1",
      featureVersion: "safe-v1",
      evaluationSummary: `Holdout MAE ${formatMetric(score.baseline.mae)}`,
      codeRevision: "page-snapshot",
      approval: "production",
      synthetic: true,
    },
    {
      id: "sim-blend",
      version: "0.1.0",
      family: "Fixed blend",
      datasetVersion: "demo-v1",
      featureVersion: "safe-v1",
      evaluationSummary: `Holdout MAE ${formatMetric(score.blend.mae)}`,
      codeRevision: "page-snapshot",
      approval: "candidate",
      synthetic: true,
    },
  ];
}

/**
 * Applies a promotion decision without touching a rejected candidate’s absence.
 * A failed decision leaves the current production artifact as production.
 */
export function applyPromotion(
  artifacts: readonly ModelArtifact[],
  promoted: boolean,
): ModelArtifact[] {
  return artifacts.map((artifact) => {
    if (artifact.id !== "sim-blend") {
      if (artifact.id === "sim-baseline" && promoted) {
        return { ...artifact, approval: "candidate" as const };
      }
      return artifact;
    }
    return { ...artifact, approval: promoted ? "production" : "rejected" };
  });
}

/** A serving request. Extra keys are ignored by the predictor and reported by validation. */
export interface PredictInput {
  sku: string;
  category: string;
  lag1: number;
  rolling3: number;
  price: number;
  promo: boolean;
  inventory: number;
}

/** Named request failures the inference panel can select. */
export type InferScenario =
  | "ok"
  | "malformed"
  | "missing"
  | "unexpected_category"
  | "unavailable"
  | "timeout"
  | "invalid_output";

/** One simulated HTTP-shaped result. `prediction` is omitted when the call fails. */
export interface InferResult {
  status: number;
  error: string | null;
  prediction: number | null;
  modelVersion: string | null;
  simulated: true;
  unit: "units_next_week";
}

/** The sample body used by the successful path. */
export const SAMPLE_REQUEST: PredictInput = {
  sku: "MILK",
  category: "grocery",
  lag1: 21,
  rolling3: 21,
  price: 4,
  promo: false,
  inventory: 28,
};

/**
 * Validates a successful response object.
 * A non-finite prediction fails closed.
 */
export function responseIsValid(body: InferResult): boolean {
  return (
    body.simulated === true &&
    body.unit === "units_next_week" &&
    body.error === null &&
    typeof body.modelVersion === "string" &&
    typeof body.prediction === "number" &&
    Number.isFinite(body.prediction)
  );
}

/**
 * Runs one inference scenario with the fixed blend.
 * The result is labeled simulated. It is not the output of a loaded model file.
 */
export function simulateInference(scenario: InferScenario, input: PredictInput = SAMPLE_REQUEST): InferResult {
  const base = {
    simulated: true as const,
    unit: "units_next_week" as const,
    modelVersion: "sim-baseline",
    prediction: null,
    error: null,
    status: 200,
  };
  if (scenario === "malformed") {
    return { ...base, status: 400, modelVersion: null, error: "Request JSON does not match the input schema. sku must be a string." };
  }
  if (scenario === "missing") {
    return { ...base, status: 400, modelVersion: null, error: "Missing feature lag1. The model is not called." };
  }
  if (scenario === "unexpected_category" || !["grocery", "beverage", "household"].includes(input.category)) {
    return { ...base, status: 400, modelVersion: null, error: "Category is outside the feature vocabulary. The model is not called." };
  }
  if (scenario === "unavailable") {
    return { ...base, status: 503, modelVersion: null, error: "Model artifact is unavailable. No prediction was invented." };
  }
  if (scenario === "timeout") {
    return { ...base, status: 504, modelVersion: null, error: "The time budget elapsed. The client receives an error, not a guess." };
  }
  const prediction = blendPrediction({
    id: "request",
    sku: input.sku,
    category: input.category,
    observedOn: "2024-02-12",
    actual: 0,
    lag1: input.lag1,
    rolling3: input.rolling3,
    promo: input.promo ? 1 : 0,
    price: input.price,
    priceRelativeToPriorCategoryMedian: null,
    dayOfWeek: 1,
    categoryGrocery: input.category === "grocery" ? 1 : 0,
    categoryBeverage: input.category === "beverage" ? 1 : 0,
    categoryHousehold: input.category === "household" ? 1 : 0,
    inventory: input.inventory,
  });
  if (scenario === "invalid_output" || !Number.isFinite(prediction)) {
    return { ...base, status: 500, prediction: null, error: "The predictor returned a non-finite value. The response was rejected." };
  }
  return { ...base, prediction, error: null, status: 200 };
}

/** One week of invented telemetry. */
export interface TelemetryPoint {
  week: string;
  requests: number;
  errorRate: number;
  meanPrediction: number;
  missingFeatureRate: number;
  latencyMs: number;
}

/** Base series. Every value is invented for the scenario buttons. */
export const BASE_TELEMETRY: readonly TelemetryPoint[] = [
  { week: "W1", requests: 120, errorRate: 0.01, meanPrediction: 14.2, missingFeatureRate: 0.01, latencyMs: 18 },
  { week: "W2", requests: 128, errorRate: 0.01, meanPrediction: 14.4, missingFeatureRate: 0.01, latencyMs: 19 },
  { week: "W3", requests: 131, errorRate: 0.012, meanPrediction: 14.1, missingFeatureRate: 0.011, latencyMs: 20 },
  { week: "W4", requests: 126, errorRate: 0.011, meanPrediction: 14.5, missingFeatureRate: 0.01, latencyMs: 18 },
  { week: "W5", requests: 140, errorRate: 0.01, meanPrediction: 14.6, missingFeatureRate: 0.012, latencyMs: 21 },
  { week: "W6", requests: 138, errorRate: 0.011, meanPrediction: 14.3, missingFeatureRate: 0.01, latencyMs: 19 },
];

/** A monitoring button and the alert it must raise. */
export interface MonitorScenario {
  id: string;
  label: string;
  kind: "data_drift" | "prediction_drift" | "quality" | "reliability";
  alert: string;
  steps: string[];
  apply: (points: TelemetryPoint[]) => TelemetryPoint[];
}

/** Copies the base series and replaces the last week. */
function withLast(patch: Partial<TelemetryPoint>): TelemetryPoint[] {
  const points = BASE_TELEMETRY.map((point) => ({ ...point }));
  points[points.length - 1] = { ...points[points.length - 1], ...patch };
  return points;
}

/** Monitoring scenarios. Drift does not, by itself, prove that accuracy fell. */
export const MONITOR_SCENARIOS: readonly MonitorScenario[] = [
  {
    id: "missing",
    label: "Missing features increase",
    kind: "data_drift",
    alert: "Input-quality alert: missing feature rate jumped. This is a data problem, not yet a proof of accuracy loss.",
    steps: [
      "Compare the failing field with the training contract.",
      "Quarantine incomplete requests instead of imputing them silently.",
      "Wait for ground truth before calling this concept drift.",
    ],
    apply: () => withLast({ missingFeatureRate: 0.18, errorRate: 0.07 }),
  },
  {
    id: "category",
    label: "A category becomes more frequent",
    kind: "data_drift",
    alert: "Data-drift alert: an unseen share of requests is a new category mix. Accuracy is not known until labels arrive.",
    steps: [
      "Measure the new category share against the training vocabulary.",
      "Check whether the category is unexpected or only more common.",
      "Do not retrain on the frequency change alone.",
    ],
    apply: () => withLast({ requests: 210, meanPrediction: 11.2 }),
  },
  {
    id: "distribution",
    label: "Input distributions change",
    kind: "data_drift",
    alert: "Data-drift alert: price and lag inputs moved. Investigate the source before retraining.",
    steps: [
      "Plot the new input range against the training range.",
      "Look for a schema or unit change first.",
      "Hold the current model until a scored comparison exists.",
    ],
    apply: () => withLast({ meanPrediction: 22.4, missingFeatureRate: 0.02 }),
  },
  {
    id: "errors",
    label: "Errors rise after ground truth",
    kind: "quality",
    alert: "Quality alert: delayed labels show a higher absolute error. This is evidence about accuracy, unlike input drift alone.",
    steps: [
      "Confirm the labels joined on the same grain as training.",
      "Slice the error by category and week.",
      "Compare a candidate with the current model before promoting it.",
    ],
    apply: () => withLast({ errorRate: 0.04, meanPrediction: 14.3 }),
  },
  {
    id: "artifact",
    label: "Artifact unavailable",
    kind: "reliability",
    alert: "Reliability alert: the model artifact failed to load. Requests should fail, not fall back to a made-up number.",
    steps: [
      "Check the artifact id and the registry read.",
      "Keep serving the last approved version if it is still loadable.",
      "If nothing loads, return an error.",
    ],
    apply: () => withLast({ errorRate: 1, requests: 40, latencyMs: 5 }),
  },
  {
    id: "dependency",
    label: "Serving dependency fails",
    kind: "reliability",
    alert: "Reliability alert: a feature lookup failed. This is not prediction drift.",
    steps: [
      "Separate dependency errors from model errors in the logs.",
      "Time out and retry only when the dependency is safe to retry.",
      "Do not retrain to fix an outage.",
    ],
    apply: () => withLast({ errorRate: 0.46, latencyMs: 250, missingFeatureRate: 0.4 }),
  },
];

/** Retraining triggers. */
export type RetrainTrigger = "new_labels" | "schedule" | "performance" | "distribution" | "spec_change";

/** One simulated retraining decision. Approval still requires a person. */
export interface RetrainResult {
  trigger: RetrainTrigger;
  steps: { name: string; status: "passed" | "failed" | "skipped"; note: string }[];
  decision: "recommend_review" | "reject";
  reason: string;
}

/**
 * Simulates a retraining decision.
 * A recommendation does not change the production artifact. A rejection keeps it.
 */
export function simulateRetrain(trigger: RetrainTrigger): RetrainResult {
  if (trigger === "distribution") {
    return {
      trigger,
      decision: "reject",
      reason: "The new extract failed validation. No candidate was trained, and the approved model stays.",
      steps: [
        { name: "Trigger", status: "passed", note: "A distribution change was reported." },
        { name: "Validate new data", status: "failed", note: "Schema and range checks failed." },
        { name: "Train candidate", status: "skipped", note: "Not started." },
        { name: "Evaluate and gate", status: "skipped", note: "Not started." },
      ],
    };
  }
  if (trigger === "performance" || trigger === "spec_change") {
    return {
      trigger,
      decision: "reject",
      reason:
        trigger === "performance"
          ? "The candidate function is the worse predictor. It loses to the baseline, so it is not promoted."
          : "The feature specification changed and the candidate was not rebuilt against it. The approved model stays.",
      steps: [
        { name: "Trigger", status: "passed", note: "Trigger recorded." },
        { name: "Validate new data", status: "passed", note: "Demonstration rows still pass." },
        { name: "Train candidate", status: "passed", note: "Browser simulation only. No job was launched." },
        {
          name: "Evaluate and gate",
          status: "failed",
          note: trigger === "performance" ? "Candidate MAE is worse." : "Feature version does not match the approved spec.",
        },
      ],
    };
  }
  return {
    trigger,
    decision: "recommend_review",
    reason: "The fixed blend beats the baseline on this holdout. A person still has to approve it. The page does not auto-promote.",
    steps: [
      { name: "Trigger", status: "passed", note: trigger === "schedule" ? "Scheduled window." : "New labels are available in the demonstration table." },
      { name: "Validate new data", status: "passed", note: "Clean rows only." },
      { name: "Train candidate", status: "passed", note: "The candidate is the fixed blend, not a new fit." },
      { name: "Evaluate and gate", status: "passed", note: "Gates can pass. Promotion remains a separate action." },
    ],
  };
}

/** One invariant the testing panel can execute. */
export interface InvariantResult {
  name: string;
  passed: boolean;
  detail: string;
}

/**
 * Runs the checks this page can actually execute.
 * These are not a claim that a separate ML test suite already existed.
 */
export function runInvariants(): InvariantResult[] {
  const bad = simulateInference("unexpected_category");
  const supervised = buildSupervised().supervised;
  const split = timeSplit(supervised);
  const orderOk = splitBreaksTime(split.train, split.test) === null;
  const gates = evaluateGates({ ...defaultGateOptions(), candidate: "worse" });
  const ok = simulateInference("ok");
  const broken = simulateInference("invalid_output");
  const failedRun = simulateTraining({ ...DEFAULT_TRAIN_CONFIG, injectedFailure: "serialize" });
  const first = blendPrediction(supervised[0]);
  const second = blendPrediction(supervised[0]);
  return [
    {
      name: "Invalid input does not reach a prediction.",
      passed: bad.prediction === null && bad.status === 400,
      detail: bad.error ?? "No error text.",
    },
    {
      name: "The evaluation split keeps time order.",
      passed: orderOk && split.test.length > 0,
      detail: orderOk ? `${split.test.length} holdout rows, all after their product’s training weeks.` : "Order broke.",
    },
    {
      name: "A worse candidate is not promoted.",
      passed: gates.promoted === false,
      detail: "The worse function fails the baseline gate.",
    },
    {
      name: "Responses must match the schema.",
      passed: responseIsValid(ok) && !responseIsValid(broken),
      detail: "A finite simulated prediction passes. A rejected output does not.",
    },
    {
      name: "A failed run does not mint an artifact id.",
      passed: failedRun.artifactId === null && failedRun.outcome === "failed",
      detail: "Serialization failure leaves artifactId null, so it cannot replace production.",
    },
    {
      name: "The same inputs produce the same blend output.",
      passed: first === second,
      detail: `Both calls returned ${first}.`,
    },
  ];
}
