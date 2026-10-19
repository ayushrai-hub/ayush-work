/**
 * Barrel for the machine-learning demonstration library.
 *
 * Re-exports the dataset, checks, features, metrics, simulations, and static catalogs used by
 * `/pow/ml-engineer`. Callers should import from this file.
 *
 * Connects to:
 * - src/components/pow/ml/Lab.tsx and src/content/mlEngineerPow.ts.
 */
export {
  ALLOWED_CATEGORIES,
  DEMO_DATASET_LABEL,
  DEMAND_ROWS,
  PRICE_MAX,
  UNITS_MAX,
  parseIsoDate,
} from "./dataset";
export type { DemandRow } from "./dataset";
export { percentOf, validateDataset, validateRow } from "./validate";
export type { IssueCode, RowIssue, RowValidation, ValidationReport } from "./validate";
export {
  SAFE_FEATURE_NAMES,
  buildSupervised,
  median,
  preprocessingLeakageExample,
  randomSplit,
  rollingLeakageExample,
  seededShuffle,
  splitBreaksTime,
  timeSplit,
} from "./features";
export type { SupervisedRow } from "./features";
export {
  baselinePrediction,
  blendPrediction,
  errorBuckets,
  formatMetric,
  meanAbsoluteError,
  rSquared,
  rootMeanSquaredError,
  scoreHoldout,
  worsePrediction,
} from "./metrics";
export type { CategorySlice, ErrorBucket, HoldoutScore, MetricTriple, ScoredRow } from "./metrics";
export {
  BASE_TELEMETRY,
  DEFAULT_TRAIN_CONFIG,
  MONITOR_SCENARIOS,
  REPRO_MANIFEST,
  SAMPLE_REQUEST,
  applyPromotion,
  defaultGateOptions,
  demonstrationExperiments,
  evaluateGates,
  initialArtifacts,
  responseIsValid,
  runInvariants,
  simulateInference,
  simulateRetrain,
  simulateTraining,
} from "./simulate";
export type {
  ExperimentRecord,
  GateCheck,
  GateOptions,
  InferResult,
  InferScenario,
  ModelArtifact,
  RetrainResult,
  RetrainTrigger,
  TrainConfig,
  TrainSimulation,
} from "./simulate";
export {
  ARCHITECTURE,
  FAILURE_CASES,
  PERF_OPTIONS,
  ROADMAP,
  TEST_MATRIX,
  TRADEOFFS,
  problemEffects,
} from "./catalog";
export type { ArchitectureNode, FailureCase, PerfOption, ProblemChoice, Tradeoff } from "./catalog";
