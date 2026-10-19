/**
 * Static copy for the ML proof-of-work explorers: problem effects, architecture, failures, and trade-offs.
 *
 * The strings describe a reference design and this page’s simulation. They do not describe a deployed
 * platform. Interactive results that depend on the synthetic table live in the other mlEngineer modules.
 *
 * Connects to:
 * - src/components/pow/ml/Lab.tsx.
 * - src/content/mlEngineerPow.ts for the case studies and the Markdown twin.
 */

/** Knobs on the problem-formulation panel. */
export interface ProblemChoice {
  horizonDays: 7 | 14 | 28;
  target: "units" | "revenue";
  metric: "mae" | "rmse";
}

/** One consequence of the current problem definition. */
export interface ProblemEffect {
  topic: string;
  effect: string;
}

/**
 * Explains how the selected target, horizon, and metric change the pipeline.
 * The text is specific to those three choices. It does not invent a business result.
 */
export function problemEffects(choice: ProblemChoice): ProblemEffect[] {
  const horizon =
    choice.horizonDays === 7
      ? "A 7-day horizon can be served from the latest closed week. The feature job must finish before the order deadline."
      : choice.horizonDays === 14
        ? "A 14-day horizon needs two future weeks of planned price and promotion, and labels arrive later, so the monitoring lag grows."
        : "A 28-day horizon forces a longer label delay and makes a weekly retrain look at a stale target. The serving contract has to accept a month-ahead plan.";
  const target =
    choice.target === "units"
      ? "The target is units. Price stays a feature. A revenue decision is a separate step after the prediction."
      : "The target is revenue (units times price). Price errors become target errors, and a promotion that cuts price can look like falling demand even when units rise.";
  const metric =
    choice.metric === "mae"
      ? "MAE treats each unit of error equally. It will not, by itself, protect a small category."
      : "RMSE punishes large misses more. A model can win RMSE and still be worse on a category you stock every week.";
  return [
    { topic: "Data architecture", effect: horizon },
    { topic: "Target", effect: target },
    { topic: "Metric", effect: metric },
    {
      topic: "Decision",
      effect:
        "The prediction is not the order. An order quantity also depends on stock, lead time, and the cost of being short versus long. A more accurate model can still feed a bad decision.",
    },
  ];
}

/** One box in the reference diagram. */
export interface ArchitectureNode {
  id: string;
  name: string;
  responsibility: string;
  inputs: string;
  outputs: string;
  dependencies: string;
  failure: string;
  observability: string;
  security: string;
  scaling: string;
}

/** Reference components, in data-flow order. This is not a map of deployed infrastructure. */
export const ARCHITECTURE: readonly ArchitectureNode[] = [
  {
    id: "sources",
    name: "Data sources",
    responsibility: "Hold raw sales, price, promotion, and inventory facts.",
    inputs: "Upstream systems of record.",
    outputs: "Immutable extracts with a timestamp.",
    dependencies: "Source owners and their schemas.",
    failure: "A silent column rename or a late file.",
    observability: "Extract arrival time and row counts.",
    security: "Least privilege on the extract. No credentials in the notebook.",
    scaling: "Partition by day. Do not reread history for a one-day load.",
  },
  {
    id: "ingestion",
    name: "Ingestion",
    responsibility: "Land the extract without changing its meaning.",
    inputs: "Raw files or table snapshots.",
    outputs: "A landed batch with a dataset version.",
    dependencies: "Object storage or the warehouse landing zone.",
    failure: "Partial upload treated as complete.",
    observability: "Bytes, row count, and checksum against the source.",
    security: "Separate landing credentials from training credentials.",
    scaling: "Parallel files only when order does not matter.",
  },
  {
    id: "validation",
    name: "Data validation",
    responsibility: "Accept, quarantine, or reject rows against a versioned contract.",
    inputs: "Landed rows and the contract.",
    outputs: "A clean set, a quarantine set, and a report.",
    dependencies: "The contract owned with the feature code.",
    failure: "Dropping bad rows without a count.",
    observability: "Failure counts by check, not a single pass rate.",
    security: "Quarantine may contain customer fields. Restrict who can read it.",
    scaling: "Checks should be per row or per batch, and cheap enough to run on every load.",
  },
  {
    id: "features",
    name: "Feature transformations",
    responsibility: "Build model inputs from information available at prediction time.",
    inputs: "Clean history and the feature specification version.",
    outputs: "A feature row keyed by product and date.",
    dependencies: "The same code path for training and serving.",
    failure: "Training-serving skew, or a feature that sees the target.",
    observability: "Null rates and ranges per feature.",
    security: "Do not put a raw identifier into the model if a category encoding is enough.",
    scaling: "Compute lags in time order. A full shuffle is the wrong shortcut.",
  },
  {
    id: "datasets",
    name: "Dataset versioning",
    responsibility: "Name the exact rows a run used.",
    inputs: "Clean rows plus the split rule.",
    outputs: "A dataset version id.",
    dependencies: "Storage that can reproduce that id.",
    failure: "A moving “latest” pointer with no snapshot.",
    observability: "Row counts per split and the contract version.",
    security: "Versions inherit the source’s access policy.",
    scaling: "Store the snapshot, or store an immutable query plus the source snapshot.",
  },
  {
    id: "training",
    name: "Training orchestration",
    responsibility: "Run a configured job and refuse to continue when a stage fails.",
    inputs: "Dataset version, feature version, code revision, and parameters.",
    outputs: "Metrics and a candidate artifact, or a failed run record.",
    dependencies: "Compute, the dataset, and the feature code.",
    failure: "A failed job overwriting the approved artifact.",
    observability: "Stage status. Not a fake loss curve.",
    security: "Jobs should not hold production serving credentials.",
    scaling: "Match the trainer to the data size. A small tabular problem does not need a GPU story.",
  },
  {
    id: "tracking",
    name: "Experiment tracking",
    responsibility: "Record what would be required to repeat a run.",
    inputs: "Config, code revision, data version, metrics.",
    outputs: "An experiment id.",
    dependencies: "A tracker such as MLflow, if one is actually installed.",
    failure: "Comparing numbers from different splits as if they were one leaderboard.",
    observability: "The manifest itself is the record.",
    security: "Metrics can leak target distributions. Treat the tracker as sensitive.",
    scaling: "The record is small. The artifact is the heavy part.",
  },
  {
    id: "storage",
    name: "Artifact storage",
    responsibility: "Store the model package and the feature spec together.",
    inputs: "Serialized model, spec, and evaluation summary.",
    outputs: "An immutable artifact id.",
    dependencies: "The registry’s storage.",
    failure: "Weights without the feature code that produced the inputs.",
    observability: "Checksum and size.",
    security: "Signed writes, read-only production role.",
    scaling: "Artifacts are versioned objects, not a mutable file on one machine.",
  },
  {
    id: "evaluation",
    name: "Model evaluation",
    responsibility: "Score a candidate on the approved split and on the slices that matter.",
    inputs: "Predictions, labels, and the baseline.",
    outputs: "A gate report.",
    dependencies: "Labels that match the training grain.",
    failure: "A single average hiding a bad category.",
    observability: "The gate inputs, not only the pass bit.",
    security: "Holdout labels are as sensitive as the training target.",
    scaling: "Scoring is usually cheaper than training. Keep it deterministic.",
  },
  {
    id: "registry",
    name: "Model registry",
    responsibility: "Move an artifact from candidate to approved only when the gates pass.",
    inputs: "Artifact id and the gate report.",
    outputs: "An approval state.",
    dependencies: "Artifact storage and the evaluation report.",
    failure: "Promotion by whoever uploaded the file.",
    observability: "Who approved what, and which version is production.",
    security: "Separate the role that trains from the role that approves.",
    scaling: "The registry is a small record. Do not confuse it with the inference fleet.",
  },
  {
    id: "inference",
    name: "Inference service",
    responsibility: "Validate a request, build features, predict, and validate the response.",
    inputs: "A request and a pinned model version.",
    outputs: "A prediction or a structured error.",
    dependencies: "The artifact, the feature code, and any online lookups.",
    failure: "Returning a number when the artifact did not load.",
    observability: "Status codes, model version, and latency. The body may be sensitive.",
    security: "Authenticate callers. Do not log full payloads if they are private.",
    scaling: "Batch when the deadline is a file. Online when a caller is waiting.",
  },
  {
    id: "monitoring",
    name: "Monitoring",
    responsibility: "Watch inputs, errors, latency, and delayed accuracy separately.",
    inputs: "Request logs and late labels.",
    outputs: "Alerts with a kind: data, quality, or reliability.",
    dependencies: "Logs and a label join.",
    failure: "Treating an outage as proof the model got worse.",
    observability: "The alert names the kind.",
    security: "Dashboards that show raw requests need the same access control as the data.",
    scaling: "Aggregate first. Keep raw logs only as long as the policy allows.",
  },
  {
    id: "retraining",
    name: "Retraining workflow",
    responsibility: "Decide whether a new candidate may replace the approved model.",
    inputs: "A trigger, new labels, and the current production version.",
    outputs: "Approve, reject, or ask for review. Rollback stays possible.",
    dependencies: "Validation, training, evaluation, and the registry.",
    failure: "Automatic promotion of every successful job.",
    observability: "The decision and the version that stayed in production.",
    security: "The workflow should not be able to delete the last good artifact.",
    scaling: "Most retrains of a small tabular model are a schedule, not a stream.",
  },
];

/** One production-failure story. The page simulates the response locally. */
export interface FailureCase {
  id: string;
  title: string;
  trigger: string;
  symptom: string;
  investigation: string;
  mitigation: string;
  recovery: string;
  prevention: string;
  evidence: string;
}

/** Failure-lab cases. `evidence` points at a check this page actually runs where one exists. */
export const FAILURE_CASES: readonly FailureCase[] = [
  {
    id: "schema",
    title: "Data schema changes",
    trigger: "The producer renames price to unitPrice and bumps the schema version.",
    symptom: "Validation reports schema_change. The row is quarantined.",
    investigation: "Compare the landed fields with the contract. Do not guess the mapping in the trainer.",
    mitigation: "Stop the training run that depends on the old field name.",
    recovery: "Ship an approved mapping, then rebuild the dataset version.",
    prevention: "Contract tests on the extract, and a quarantine count on every load.",
    evidence: "Row d-schema in the demonstration table fails schema_change.",
  },
  {
    id: "skew",
    title: "Training-serving skew",
    trigger: "Serving sends Grocery while training only accepted grocery.",
    symptom: "The request fails the category check, or a silent lowercase would have changed the feature.",
    investigation: "Diff the feature function used in training with the one in the service.",
    mitigation: "Reject the request. Do not lowercase it in only one path.",
    recovery: "Publish one feature specification and use it in both places.",
    prevention: "A shared feature test, plus the training_serving_skew check.",
    evidence: "Row d-skew fails training_serving_skew. Unexpected categories never reach the predictor.",
  },
  {
    id: "gate",
    title: "Failed evaluation gate",
    trigger: "The candidate’s holdout MAE is worse than the lag baseline.",
    symptom: "The baseline gate fails and promotion is false.",
    investigation: "Read the slice table before blaming the metric.",
    mitigation: "Do not promote. Keep the approved version.",
    recovery: "Fix the candidate or the data, then score it again.",
    prevention: "Make the gate a function of the predictions, not a checkbox after the fact.",
    evidence: "The worse predictor fails evaluateGates on this table.",
  },
  {
    id: "timeout",
    title: "Inference timeout",
    trigger: "The prediction does not finish inside the time budget.",
    symptom: "The caller receives status 504 and no number.",
    investigation: "Separate queue time, feature time, and model time.",
    mitigation: "Fail the request. Retry only if the work is idempotent and the deadline still matters.",
    recovery: "Shed load or fall back to a pinned smaller model only when that fallback is an approved artifact.",
    prevention: "A latency budget in the contract, tested with a representative batch.",
    evidence: "The timeout scenario returns an error and a null prediction.",
  },
  {
    id: "missing-artifact",
    title: "Model artifact unavailable",
    trigger: "The pinned version cannot be loaded.",
    symptom: "Status 503. The body does not contain a filled-in prediction.",
    investigation: "Check the id, the checksum, and the registry read.",
    mitigation: "Fail closed.",
    recovery: "Reload the last approved version if it is healthy. Otherwise keep failing.",
    prevention: "A startup check that the production id loads, and an alert on load errors.",
    evidence: "The unavailable scenario returns 503 and a null prediction.",
  },
  {
    id: "drift",
    title: "Data drift",
    trigger: "Input ranges or category mix move.",
    symptom: "A data-drift alert. Accuracy is still unknown.",
    investigation: "Check for a unit change or a new category before assuming the world changed.",
    mitigation: "Investigate. Do not retrain as the first action.",
    recovery: "If delayed labels confirm a worse error, score a new candidate against the current model.",
    prevention: "Input monitors that are separate from accuracy monitors.",
    evidence: "The monitoring scenarios name data drift and refuse to call it accuracy loss.",
  },
  {
    id: "retrain-fail",
    title: "Failed retraining run",
    trigger: "New data fails validation, or the candidate loses the gate.",
    symptom: "The decision is reject. Production approval does not move.",
    investigation: "Read which step failed. A failed fit and a failed gate are different.",
    mitigation: "Keep the last approved artifact. Record the failed run.",
    recovery: "Fix the cause and run again. Roll back only if a bad version was already promoted.",
    prevention: "Promotion is a separate step from training.",
    evidence: "Distribution and performance triggers return reject.",
  },
];

/** One serving-efficiency choice. Measurements on this page are illustrative. */
export interface PerfOption {
  id: string;
  name: string;
  benefit: string;
  quality: string;
  complexity: string;
  hardware: string;
  when: string;
  measure: string;
}

/** Inference choices. None of these were benchmarked on a GPU for this page. */
export const PERF_OPTIONS: readonly PerfOption[] = [
  {
    id: "batch-online",
    name: "Batch versus online",
    benefit: "Batch uses a full file and a loose deadline. Online answers one waiting caller.",
    quality: "Same model can serve both. The feature timestamp is what changes the answer.",
    complexity: "Online needs a timeout and a schema. Batch needs a backfill story.",
    hardware: "Either can be CPU for a small tabular model.",
    when: "Use online when a person or service is blocked. Use batch when the result is a nightly order file.",
    measure: "Deadline miss rate, not a single latency number from an empty machine.",
  },
  {
    id: "loading",
    name: "Eager versus lazy loading",
    benefit: "Eager loading fails at startup. Lazy loading starts faster and fails on the first real request.",
    quality: "No direct quality change.",
    complexity: "Eager is easier to alert on. Lazy hides a broken artifact until traffic arrives.",
    hardware: "Eager holds the model in memory the whole time.",
    when: "Eager when the process serves steady traffic. Lazy for a rare administrative tool.",
    measure: "Startup success and time-to-ready, plus the first-request error rate.",
  },
  {
    id: "cpu-gpu",
    name: "CPU versus GPU",
    benefit: "A GPU helps large numeric kernels. A small tree or a lag baseline often does not use it.",
    quality: "Moving hardware does not change the math unless the implementation does.",
    complexity: "GPUs add drivers, quotas, and a colder failure mode.",
    hardware: "Start on CPU unless a profile shows the model is the bottleneck.",
    when: "After a profile, not before.",
    measure: "Utilization, queue time, and end-to-end latency on a representative batch.",
  },
  {
    id: "batching",
    name: "Dynamic batching",
    benefit: "Groups waiting requests so a heavy model does more work per load.",
    quality: "Can add delay to the fastest request.",
    complexity: "Needs a queue and a max-wait setting.",
    hardware: "Matters more when one prediction is much cheaper in a group.",
    when: "Throughput is short of the target and latency still has room.",
    measure: "Latency percentiles with the batcher on and off. An average will hide the wait.",
  },
  {
    id: "quant",
    name: "Quantization",
    benefit: "Smaller weights can be faster and cheaper.",
    quality: "Can change predictions. The change has to be scored, not assumed harmless.",
    complexity: "A second artifact and a second gate.",
    hardware: "Depends on kernels that actually use the smaller type.",
    when: "The profile says memory or bandwidth is the limit, and the quality gate still passes.",
    measure: "Holdout and slice metrics against the unquantized artifact, plus latency.",
  },
  {
    id: "distill",
    name: "Distillation",
    benefit: "A smaller student model can be cheaper to serve.",
    quality: "The student is a different model. It needs its own evaluation.",
    complexity: "A training pipeline for the student, which this page does not contain.",
    hardware: "The point is usually to leave the larger hardware behind.",
    when: "The teacher is already approved and the student clears the same gates.",
    measure: "Quality gap versus the teacher, and cost per thousand requests.",
  },
  {
    id: "cache",
    name: "Caching",
    benefit: "Repeated keys skip the model.",
    quality: "A stale cache serves yesterday’s answer. That may be wrong after a price change.",
    complexity: "Invalidation has to follow the feature timestamp.",
    hardware: "Cache memory, not model hardware.",
    when: "The same key is requested often and the features are stable inside the cache window.",
    measure: "Hit rate and the age of a hit. A high hit rate with stale features is a bug.",
  },
  {
    id: "size",
    name: "Smaller versus larger models",
    benefit: "A larger model can fit more structure. A smaller one is easier to run and to explain.",
    quality: "Size is not accuracy. The baseline can win.",
    complexity: "The larger model adds monitoring, rollout, and a harder failure.",
    hardware: "Pay for the larger one only when the gate says it is worth it.",
    when: "The simpler model misses a slice you care about, and the complex one fixes it without new failures.",
    measure: "Slice metrics, latency, and the on-call cost. Not parameter count.",
  },
];

/** One engineering choice with two defensible options. */
export interface Tradeoff {
  id: string;
  name: string;
  left: string;
  right: string;
  leftWhen: string;
  rightWhen: string;
  depends: string;
}

/** Trade-offs. Neither column is the universal answer. */
export const TRADEOFFS: readonly Tradeoff[] = [
  {
    id: "batch-online",
    name: "Batch and online inference",
    left: "Batch",
    right: "Online",
    leftWhen: "The consumer is a nightly file and a missed minute does not matter.",
    rightWhen: "A caller is waiting, and a late answer is a failed answer.",
    depends: "Deadline, request volume, and how fresh the features must be.",
  },
  {
    id: "baseline-complex",
    name: "Simple baselines and complex models",
    left: "Baseline",
    right: "A larger model",
    leftWhen: "The baseline already meets the decision’s error tolerance.",
    rightWhen: "The baseline fails a slice that has a real cost, and the larger model fixes that slice.",
    depends: "Error tolerance, slice importance, and how much operational load the team can carry.",
  },
  {
    id: "cpu-gpu",
    name: "CPU and GPU serving",
    left: "CPU",
    right: "GPU",
    leftWhen: "The profile says the model is not the bottleneck.",
    rightWhen: "A measured kernel is compute-bound and the utilization justifies the machine.",
    depends: "Model type, batch shape, and budget. A GPU is not an automatic speedup.",
  },
  {
    id: "schedule-event",
    name: "Scheduled and event-driven retraining",
    left: "Scheduled",
    right: "Event-driven",
    leftWhen: "Labels arrive on a cadence and the data contract is stable.",
    rightWhen: "A validated break in the data should stop the current model from being the only story, without auto-promoting.",
    depends: "Label delay, how often the data actually changes, and who approves.",
  },
  {
    id: "managed-self",
    name: "Managed and self-hosted infrastructure",
    left: "Managed",
    right: "Self-hosted",
    leftWhen: "The team is small and the managed limits fit the workload.",
    rightWhen: "The constraint is data residency, cost at a known volume, or a missing managed feature.",
    depends: "Team capacity, budget, and where the data is allowed to sit.",
  },
  {
    id: "sync-async",
    name: "Synchronous and asynchronous processing",
    left: "Synchronous",
    right: "Asynchronous",
    leftWhen: "The caller needs the prediction in the same request.",
    rightWhen: "The work can finish later and the caller can poll or receive an event.",
    depends: "Latency target and whether a retry is safe.",
  },
  {
    id: "feature-place",
    name: "Centralized and distributed feature computation",
    left: "One feature job",
    right: "Features computed in each service",
    leftWhen: "Training and serving must match, and one library can do both.",
    rightWhen: "A single job cannot see the online context. Then the online path still has to be tested against the offline path.",
    depends: "Skew risk and where the freshest input lives.",
  },
  {
    id: "complexity-reliability",
    name: "Model complexity and operational reliability",
    left: "Fewer moving parts",
    right: "A richer model",
    leftWhen: "The on-call load of the rich model is higher than the value of its error reduction.",
    rightWhen: "The error reduction is large on a slice that matters, and the rollout has a rollback.",
    depends: "Team size and how bad a wrong promotion is.",
  },
  {
    id: "fresh-cost",
    name: "Freshness and computational cost",
    left: "Fresher features",
    right: "Cheaper features",
    leftWhen: "The decision changes inside the fresher window, such as a promotion that starts today.",
    rightWhen: "Yesterday’s aggregate is good enough and recomputing it every minute only spends money.",
    depends: "How fast the inputs move, and what a stale prediction costs.",
  },
  {
    id: "accuracy-latency",
    name: "Accuracy and inference latency",
    left: "Lower error",
    right: "Lower latency",
    leftWhen: "The extra error of the fast model changes the order you would place.",
    rightWhen: "Both models lead to the same decision, and the fast one meets the timeout.",
    depends: "The decision threshold, not the leaderboard.",
  },
];

/** Testing rows. `executedHere` is true only for checks this page runs. */
export interface TestRow {
  name: string;
  looksFor: string;
  executedHere: boolean;
}

/** The matrix. Most rows are the practice. Only the invariant runner is executed on this page. */
export const TEST_MATRIX: readonly TestRow[] = [
  { name: "Unit tests", looksFor: "Pure functions: metrics, splits, gates, request validation.", executedHere: true },
  { name: "Data validation tests", looksFor: "Each planted failure produces the matching issue code.", executedHere: true },
  { name: "Feature transformation tests", looksFor: "Lags ignore the future. The leaky rolling mean does not.", executedHere: true },
  { name: "Training pipeline tests", looksFor: "Invalid config and injected failures stop at the right stage.", executedHere: true },
  { name: "Model evaluation tests", looksFor: "MAE, RMSE, and R-squared match a hand-checked fixture.", executedHere: true },
  { name: "API contract tests", looksFor: "A good response validates. A non-finite prediction does not.", executedHere: true },
  { name: "Integration tests", looksFor: "The full page renders the lifecycle and the gates change promotion.", executedHere: true },
  { name: "Regression tests", looksFor: "A known worse candidate keeps failing the baseline gate.", executedHere: true },
  { name: "Reproducibility checks", looksFor: "The blend is deterministic. A real tracker is not wired.", executedHere: true },
  { name: "Performance tests", looksFor: "Latency, cost, and quality on a representative workload.", executedHere: false },
  { name: "Monitoring and alert tests", looksFor: "Each scenario id maps to the alert kind documented beside it.", executedHere: true },
];

/** Proposed roadmap stages. None of these stages is claimed as finished infrastructure. */
export const ROADMAP: { stage: string; title: string; items: string[] }[] = [
  {
    stage: "1",
    title: "Reproducible baseline",
    items: [
      "Write the prediction task the way the problem panel does.",
      "Validate a real extract with the same style of checks.",
      "Keep a baseline in the comparison.",
      "Freeze the split.",
      "Record the code revision and the data snapshot.",
    ],
  },
  {
    stage: "2",
    title: "Automated pipeline",
    items: [
      "Split data preparation into a library the service can import.",
      "Version datasets and feature specs.",
      "Track experiments in a real tracker. MLflow is a candidate, not an integration.",
      "Persist artifacts outside the browser.",
      "Fail the job when a gate fails.",
    ],
  },
  {
    stage: "3",
    title: "Serving",
    items: [
      "Publish the request and response schema.",
      "Package the model with the feature code.",
      "Reject invalid requests before prediction.",
      "Test the contract.",
      "Benchmark a representative workload before choosing hardware.",
    ],
  },
  {
    stage: "4",
    title: "Reliability",
    items: [
      "Structured logs with a model version and a status.",
      "Health checks that fail when the artifact does not load.",
      "Input checks separate from accuracy checks.",
      "A join for delayed ground truth.",
      "A rollback to the last approved version.",
    ],
  },
  {
    stage: "5",
    title: "Optimization",
    items: [
      "Profile the actual bottleneck.",
      "Measure batching and caching against quality.",
      "Try quantization only with a second evaluation.",
      "Compare quality, latency, and cost together.",
    ],
  },
];
