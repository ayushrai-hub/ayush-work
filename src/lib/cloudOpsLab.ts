/**
 * Deterministic local simulations for the Cloud Operations Lab on /pow/cloud-engineer.
 *
 * Deployment, telemetry, cost, and scaling are pure functions of their inputs. They do not call a
 * cloud API, read credentials, or claim that a resource exists. A failed health or smoke stage
 * always returns `released: false`.
 *
 * Connects to:
 * - src/components/pow/cloud/CloudLab.tsx renders the results.
 * - src/content/cloudEngineerPow.ts names the same scenario ids in prose.
 * - src/__tests__/cloudOpsLab.test.ts.
 */

/** Conceptual deployment target. None of these is provisioned by the page. */
export type DeployTarget = "managed" | "container" | "kubernetes";

/** Named outcome of one simulated release. */
export type DeployScenario =
  | "success"
  | "build-failure"
  | "missing-env"
  | "bad-config"
  | "image-unavailable"
  | "health-check"
  | "database"
  | "smoke-test"
  | "timeout";

/** One stage in the simulated lifecycle. */
export interface DeployStageResult {
  id: string;
  label: string;
  status: "passed" | "failed" | "skipped" | "not-required";
  detail: string;
}

/** Result of `simulateDeployment`. `released` is true only for the success scenario. */
export interface DeploymentRun {
  target: DeployTarget;
  scenario: DeployScenario;
  released: boolean;
  summary: string;
  stages: DeployStageResult[];
}

/** Sample telemetry scenario. Values are synthetic. */
export type TelemetryScenario =
  | "baseline"
  | "surge"
  | "errors"
  | "slow-db"
  | "memory"
  | "workers"
  | "queue"
  | "failed-deploy"
  | "dependency";

/** One synthetic gauge. */
export interface TelemetryMetric {
  id: string;
  label: string;
  value: string;
  alert: boolean;
}

/** Synthetic snapshot plus the investigation notes for that scenario. */
export interface TelemetrySnapshot {
  scenario: TelemetryScenario;
  label: string;
  notice: string;
  metrics: TelemetryMetric[];
  alerts: string[];
  investigation: {
    symptom: string;
    service: string;
    change: string;
    correlation: string;
    likely: string;
    mitigate: string;
    verify: string;
    prevent: string;
  };
}

/** Workload preset for the sample cost model. */
export type WorkloadSize = "small" | "moderate" | "higher";

/** Visitor-controlled inputs. Every number is a hypothetical. */
export interface CostInput {
  workload: WorkloadSize;
  requestsPerMonth: number;
  storedGb: number;
  logGb: number;
  workers: number;
  idleInstances: number;
  cacheHitRatio: number;
}

/** One line of the sample bill. */
export interface CostLine {
  id: string;
  label: string;
  amount: number;
  note: string;
}

/** Sample estimate and the assumptions that produced it. */
export interface CostEstimate {
  lines: CostLine[];
  total: number;
  assumptions: readonly string[];
  caveat: string;
}

/** Where the simplified model says the limit is. */
export type ScaleBottleneck = "application" | "database" | "downstream";

/** How the model treats retries. */
export type RetryPolicy = "none" | "immediate" | "backoff";

/** Levers in the scaling simulator. */
export interface ScaleInput {
  instances: number;
  cache: boolean;
  queue: boolean;
  readReplica: boolean;
  pool: boolean;
  index: boolean;
  rateLimit: boolean;
  bottleneck: ScaleBottleneck;
  retries: RetryPolicy;
}

/** What the scaling model is willing to say. */
export interface ScaleReport {
  effects: string[];
  limitation: string;
}

/** Stage ids in lifecycle order. Rollback is last and is not a success signal. */
const STAGE_IDS = [
  "commit",
  "checks",
  "build",
  "dependencies",
  "artifact",
  "config",
  "deploy",
  "health",
  "smoke",
  "verify",
  "rollback",
] as const;

const STAGE_LABELS: Record<(typeof STAGE_IDS)[number], string> = {
  commit: "Source commit",
  checks: "Automated checks",
  build: "Build",
  dependencies: "Dependency installation",
  artifact: "Artifact or image",
  config: "Configuration validation",
  deploy: "Deployment",
  health: "Health checks",
  smoke: "Smoke tests",
  verify: "Release verification",
  rollback: "Rollback",
};

/** Scenario catalog. `failAt` is the first failing stage, or null when the release passes. */
export const deployScenarios: readonly {
  id: DeployScenario;
  label: string;
  failAt: (typeof STAGE_IDS)[number] | null;
}[] = [
  { id: "success", label: "Successful release", failAt: null },
  { id: "build-failure", label: "Build failure", failAt: "build" },
  { id: "missing-env", label: "Missing environment variable", failAt: "config" },
  { id: "bad-config", label: "Incorrect configuration", failAt: "config" },
  { id: "image-unavailable", label: "Artifact unavailable", failAt: "artifact" },
  { id: "health-check", label: "Health check failure", failAt: "health" },
  { id: "database", label: "Database connectivity failure", failAt: "health" },
  { id: "smoke-test", label: "Smoke-test failure", failAt: "smoke" },
  { id: "timeout", label: "Deployment timeout", failAt: "deploy" },
];

/** Comparison used by the workbench. These are judgments about the model, not measurements. */
export const deployTargetNotes: readonly {
  id: DeployTarget;
  label: string;
  complexity: string;
  control: string;
  portability: string;
  maintenance: string;
}[] = [
  {
    id: "managed",
    label: "Managed frontend and serverless hosting",
    complexity: "Lowest in this model",
    control: "The provider owns the runtime. You own the app, config, and data.",
    portability: "Tied to that host's build and routing model",
    maintenance: "Small, until you outgrow the platform limits",
  },
  {
    id: "container",
    label: "Container-based application hosting",
    complexity: "Middle",
    control: "You own the image. The host runs it and restarts it.",
    portability: "The image can move. The host's networking and secrets often cannot.",
    maintenance: "Image builds, health checks, and registry hygiene",
  },
  {
    id: "kubernetes",
    label: "Kubernetes-based deployment",
    complexity: "Highest in this model",
    control: "You specify replicas, probes, and rollouts. The cluster still has an operator.",
    portability: "Manifests travel better than a single host's settings.",
    maintenance: "Cluster upgrades, probes, and more failure modes",
  },
];

/**
 * Runs one simulated release.
 * Stages before the failure pass, the failing stage fails, later stages are skipped, and the
 * release is successful only when no stage fails. Rollback is required only after a deploy starts.
 */
export function simulateDeployment(target: DeployTarget, scenario: DeployScenario): DeploymentRun {
  const chosen = deployScenarios.find((item) => item.id === scenario) ?? deployScenarios[0];
  const failAt = chosen.failAt;
  const failIndex = failAt ? STAGE_IDS.indexOf(failAt) : -1;
  const deployIndex = STAGE_IDS.indexOf("deploy");
  const stages: DeployStageResult[] = STAGE_IDS.map((id, index) => {
    if (id === "rollback") {
      if (failIndex === -1) {
        return {
          id,
          label: STAGE_LABELS[id],
          status: "not-required",
          detail: "The new release passed verification. Rollback is not required in this run.",
        };
      }
      if (failIndex < deployIndex) {
        return {
          id,
          label: STAGE_LABELS[id],
          status: "not-required",
          detail: "The failure happened before deployment. No new version was released.",
        };
      }
      return {
        id,
        label: STAGE_LABELS[id],
        status: "passed",
        detail:
          "Keep the previous version serving. This run must not be shown as a successful release.",
      };
    }
    if (failIndex === -1 || index < failIndex) {
      return {
        id,
        label: STAGE_LABELS[id],
        status: "passed",
        detail: passedDetail(id, target),
      };
    }
    if (index === failIndex) {
      return {
        id,
        label: STAGE_LABELS[id],
        status: "failed",
        detail: failedDetail(scenario, target),
      };
    }
    return {
      id,
      label: STAGE_LABELS[id],
      status: "skipped",
      detail: "Skipped because an earlier stage failed.",
    };
  });
  const released = failIndex === -1;
  return {
    target,
    scenario,
    released,
    summary: released
      ? "Simulated release verified. This did not deploy anything to a cloud account."
      : "Simulated release blocked. A failed stage is not a successful deployment.",
    stages,
  };
}

/** Detail for a stage that passed in the local model. */
function passedDetail(id: (typeof STAGE_IDS)[number], target: DeployTarget): string {
  if (id === "artifact") {
    if (target === "managed") return "The build produced a host bundle. No container image is required for this target.";
    if (target === "container") return "The model tagged an image and assumed a registry push. No image was built here.";
    return "The model assumed a registry image and a Kubernetes rollout. Neither was created.";
  }
  if (id === "health") return "The health path returned the expected status in this simulation.";
  if (id === "smoke") return "The smoke checks passed in this simulation.";
  if (id === "deploy") return `The ${target} target accepted the artifact in this simulation.`;
  return "Completed in the local state machine.";
}

/** Actionable detail for the stage that failed. */
function failedDetail(scenario: DeployScenario, target: DeployTarget): string {
  switch (scenario) {
    case "build-failure":
      return "The build command exited non-zero. Read the compile or type error before retrying. Do not publish the previous artifact as if it were this commit.";
    case "missing-env":
      return "A required variable is absent. Add it in the host's secret store for this environment, then rerun configuration validation. Do not commit the value.";
    case "bad-config":
      return "A setting failed validation (wrong type, unknown key, or a URL the app cannot use). Fix the config file or host setting and validate again before deployment.";
    case "image-unavailable":
      return target === "managed"
        ? "This target does not use a container image. The simulated bundle is missing, so the artifact stage still fails."
        : "The runtime cannot pull the tag. Check the image name, the registry permission, and that the build actually pushed that tag.";
    case "health-check":
      return "The health path did not return success before the timeout. Inspect the process logs and the probe path. Leave the previous version in place.";
    case "database":
      return "The app process is up, but it cannot open a database connection. Check the host, port, credentials, and whether the network path is allowed. This is not a passing health check.";
    case "smoke-test":
      return "A smoke check failed after deploy. Treat the release as unverified and roll back or stop traffic to the new version.";
    case "timeout":
      return "The platform did not report a finished rollout in time. Check whether the new version is partially serving before you retry.";
    default:
      return "No failure in this scenario.";
  }
}

/** Sample prices. They are teaching numbers, not a provider's price list. */
export const costAssumptions = {
  label: "Example prices in USD per month. Not an invoice and not a measured project cost.",
  computeByWorkload: { small: 18, moderate: 70, higher: 240 } as Record<WorkloadSize, number>,
  databaseByWorkload: { small: 15, moderate: 55, higher: 160 } as Record<WorkloadSize, number>,
  transferPerMillionRequests: 2.4,
  storagePerGb: 0.03,
  logsPerGb: 0.6,
  workerEach: 12,
  idleInstanceEach: 18,
} as const;

/** Default hypothetical inputs for a workload size. */
export function costPreset(workload: WorkloadSize): CostInput {
  if (workload === "moderate") {
    return {
      workload,
      requestsPerMonth: 5_000_000,
      storedGb: 80,
      logGb: 25,
      workers: 1,
      idleInstances: 0,
      cacheHitRatio: 0.6,
    };
  }
  if (workload === "higher") {
    return {
      workload,
      requestsPerMonth: 40_000_000,
      storedGb: 400,
      logGb: 90,
      workers: 3,
      idleInstances: 1,
      cacheHitRatio: 0.75,
    };
  }
  return {
    workload: "small",
    requestsPerMonth: 200_000,
    storedGb: 8,
    logGb: 2,
    workers: 0,
    idleInstances: 0,
    cacheHitRatio: 0.4,
  };
}

/** Rounds to cents so the same inputs always show the same estimate. */
function cents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/** Clamps a ratio to the range the sample model understands. */
function ratio(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(0.95, Math.max(0, value));
}

/**
 * Estimates a hypothetical monthly cost from `costAssumptions` and `input`.
 * Cache hit ratio reduces the request-transfer line only. Fixed compute and database remain.
 */
export function estimateCost(input: CostInput): CostEstimate {
  const hit = ratio(input.cacheHitRatio);
  const requests = Math.max(0, input.requestsPerMonth);
  const transfer = cents((requests / 1_000_000) * (1 - hit) * costAssumptions.transferPerMillionRequests);
  const storage = cents(Math.max(0, input.storedGb) * costAssumptions.storagePerGb);
  const logs = cents(Math.max(0, input.logGb) * costAssumptions.logsPerGb);
  const workers = cents(Math.max(0, input.workers) * costAssumptions.workerEach);
  const idle = cents(Math.max(0, input.idleInstances) * costAssumptions.idleInstanceEach);
  const compute = costAssumptions.computeByWorkload[input.workload];
  const database = costAssumptions.databaseByWorkload[input.workload];
  const lines: CostLine[] = [
    { id: "compute", label: "Application compute", amount: compute, note: "Flat sample for the selected workload size." },
    { id: "database", label: "Database capacity", amount: database, note: "Flat sample. It does not scale with the request field." },
    {
      id: "transfer",
      label: "Data transfer",
      amount: transfer,
      note: `${requests.toLocaleString("en-US")} requests, cache hit ${Math.round(hit * 100)}%.`,
    },
    { id: "storage", label: "Object storage", amount: storage, note: "Stored gigabytes times the sample rate." },
    { id: "logs", label: "Logging and telemetry", amount: logs, note: "Log gigabytes retained this month." },
    { id: "workers", label: "Background processing", amount: workers, note: "Each worker is a flat sample price." },
    { id: "idle", label: "Idle resources", amount: idle, note: "Instances that are running and not serving this model." },
  ];
  const total = cents(lines.reduce((sum, line) => sum + line.amount, 0));
  return {
    lines,
    total,
    assumptions: [
      costAssumptions.label,
      `Compute sample: $${compute}. Database sample: $${database}.`,
      `Transfer: $${costAssumptions.transferPerMillionRequests} per million requests that miss cache.`,
      `Storage: $${costAssumptions.storagePerGb}/GB. Logs: $${costAssumptions.logsPerGb}/GB.`,
      `Worker: $${costAssumptions.workerEach}. Idle instance: $${costAssumptions.idleInstanceEach}.`,
      "Real prices depend on provider, region, commitment, and egress. This model ignores those.",
    ],
    caveat: "Example estimate from the assumptions above. Not a bill for any of my projects.",
  };
}

const TELEMETRY_COPY: Record<
  TelemetryScenario,
  { label: string; alerts: string[]; investigation: TelemetrySnapshot["investigation"] }
> = {
  baseline: {
    label: "Steady sample",
    alerts: [],
    investigation: {
      symptom: "No alert is firing in this sample.",
      service: "Fieldnote web and API are both marked serving.",
      change: "No simulated change.",
      correlation: "Error rate, latency, and queue depth are inside the sample bounds.",
      likely: "Nothing is failing in this snapshot.",
      mitigate: "No mitigation is required.",
      verify: "Keep the same gauges. Do not invent an incident.",
      prevent: "Keep the alert thresholds written down so a later change is visible.",
    },
  },
  surge: {
    label: "Traffic surge",
    alerts: ["Request rate above the sample threshold"],
    investigation: {
      symptom: "Request rate jumped. Error rate is still low.",
      service: "Fieldnote web.",
      change: "No failed deploy in this scenario. The input is extra traffic.",
      correlation: "CPU rose with requests. Database health is still true.",
      likely: "Demand, not a bad release.",
      mitigate: "Serve cached responses where the page allows it, and watch the database before adding app instances.",
      verify: "Latency returns toward the baseline after the surge or after cache absorbs it.",
      prevent: "A load test with a written limit, plus a rate limit for abusive clients.",
    },
  },
  errors: {
    label: "Elevated error rate",
    alerts: ["Error rate above 1%"],
    investigation: {
      symptom: "HTTP 5xx share is high while traffic is near the baseline.",
      service: "Fieldnote API.",
      change: "Compare the current artifact with the previous one.",
      correlation: "Errors and the latest deploy marker moved together in this sample.",
      likely: "A bad release or a bad config on the API.",
      mitigate: "Shift traffic back to the last verified version.",
      verify: "Error rate falls after the rollback. Do not call the failed version healthy.",
      prevent: "A smoke test that fails the pipeline before traffic shifts.",
    },
  },
  "slow-db": {
    label: "Slow database queries",
    alerts: ["p95 latency above 1s", "Database marked slow"],
    investigation: {
      symptom: "Pages load, then stall. Error rate is only slightly higher.",
      service: "Fieldnote database.",
      change: "No new app deploy in this scenario.",
      correlation: "Latency rose. CPU on the app did not. The database gauge says slow.",
      likely: "A query without a useful index, or a lock.",
      mitigate: "Identify the slow statement. Adding application instances will not make that statement faster.",
      verify: "p95 falls after the query or index change, with the same request rate.",
      prevent: "A query budget in review, and a latency alert on the database path.",
    },
  },
  memory: {
    label: "Memory pressure",
    alerts: ["Memory above 85%"],
    investigation: {
      symptom: "The process is close to its memory limit. Restarts may follow.",
      service: "Fieldnote API process.",
      change: "Look for a recent change in caching or a payload size.",
      correlation: "Memory is high. CPU and error rate may still look calm until the process dies.",
      likely: "The process is retaining too much, or the limit is smaller than the working set.",
      mitigate: "Restart only as a bridge. Cap the cache or raise the limit after you know which.",
      verify: "Memory stays under the line after the change, without a restart loop.",
      prevent: "A memory alert below the kill line, and a limit in the runtime config.",
    },
  },
  workers: {
    label: "Worker failures",
    alerts: ["Background job failures"],
    investigation: {
      symptom: "The site responds. Jobs are failing.",
      service: "Fieldnote worker.",
      change: "Check the worker release separately from the web release.",
      correlation: "Job failures rose. Request error rate did not.",
      likely: "The worker cannot finish its task, or the job payload is invalid.",
      mitigate: "Stop retrying blindly. Fix or quarantine the failing job.",
      verify: "New jobs complete and the failure counter stops climbing.",
      prevent: "A dead-letter path and an alert on job failures, not only on HTTP.",
    },
  },
  queue: {
    label: "Queue backlog",
    alerts: ["Queue depth growing"],
    investigation: {
      symptom: "Work is accepted and then waits.",
      service: "Fieldnote queue and workers.",
      change: "See whether workers are running and whether a dependency they call is slow.",
      correlation: "Queue depth is high. HTTP error rate may still be low.",
      likely: "Workers are slower than the arrival rate, or they are blocked.",
      mitigate: "Scale workers only if the downstream they call can take it. Otherwise you move the pile.",
      verify: "Depth falls and stays down at the same arrival rate.",
      prevent: "A depth alert and a limit on how fast producers enqueue.",
    },
  },
  "failed-deploy": {
    label: "Failed deployment",
    alerts: ["Deploy marker failed", "Error rate above 1%"],
    investigation: {
      symptom: "The new version is marked failed and errors are up.",
      service: "Fieldnote API.",
      change: "The simulated deploy did not pass health or smoke.",
      correlation: "The deploy status and the error rate changed together.",
      likely: "The new artifact is the cause.",
      mitigate: "Keep or restore the previous version. Do not mark this deploy successful.",
      verify: "The serving version is the previous one and the error rate drops.",
      prevent: "The pipeline gate in the deployment workbench: failed health blocks release.",
    },
  },
  dependency: {
    label: "External dependency outage",
    alerts: ["Dependency errors"],
    investigation: {
      symptom: "One outbound call fails. Other routes still work.",
      service: "A fictional upstream, not Fieldnote's database.",
      change: "No Fieldnote deploy in this scenario.",
      correlation: "Errors are concentrated on the route that calls the upstream.",
      likely: "The dependency is down or rejecting us.",
      mitigate: "Fail that feature visibly. Do not retry without a limit and a timeout.",
      verify: "The route recovers when the dependency does, or a fallback serves a reduced response.",
      prevent: "A timeout, a circuit breaker, and an alert on that dependency's error rate.",
    },
  },
};

/**
 * Builds one synthetic telemetry snapshot.
 * Numbers are fixed for the scenario so a refresh does not invent a new incident.
 */
export function sampleTelemetry(scenario: TelemetryScenario): TelemetrySnapshot {
  const copy = TELEMETRY_COPY[scenario];
  const table: Record<TelemetryScenario, Omit<TelemetryMetric, "label">[]> = {
    baseline: [
      { id: "rps", value: "40 req/min", alert: false },
      { id: "errors", value: "0.4%", alert: false },
      { id: "latency", value: "180 ms p95", alert: false },
      { id: "cpu", value: "32%", alert: false },
      { id: "memory", value: "48%", alert: false },
      { id: "db", value: "healthy", alert: false },
      { id: "jobs", value: "0 failures", alert: false },
      { id: "queue", value: "2 waiting", alert: false },
      { id: "deploy", value: "current version serving", alert: false },
      { id: "availability", value: "serving", alert: false },
    ],
    surge: [
      { id: "rps", value: "900 req/min", alert: true },
      { id: "errors", value: "0.6%", alert: false },
      { id: "latency", value: "420 ms p95", alert: false },
      { id: "cpu", value: "78%", alert: false },
      { id: "memory", value: "55%", alert: false },
      { id: "db", value: "healthy", alert: false },
      { id: "jobs", value: "0 failures", alert: false },
      { id: "queue", value: "6 waiting", alert: false },
      { id: "deploy", value: "unchanged", alert: false },
      { id: "availability", value: "serving", alert: false },
    ],
    errors: [
      { id: "rps", value: "42 req/min", alert: false },
      { id: "errors", value: "12%", alert: true },
      { id: "latency", value: "260 ms p95", alert: false },
      { id: "cpu", value: "36%", alert: false },
      { id: "memory", value: "49%", alert: false },
      { id: "db", value: "healthy", alert: false },
      { id: "jobs", value: "0 failures", alert: false },
      { id: "queue", value: "2 waiting", alert: false },
      { id: "deploy", value: "new version, errors up", alert: true },
      { id: "availability", value: "degraded", alert: true },
    ],
    "slow-db": [
      { id: "rps", value: "40 req/min", alert: false },
      { id: "errors", value: "1.2%", alert: false },
      { id: "latency", value: "2.4 s p95", alert: true },
      { id: "cpu", value: "30%", alert: false },
      { id: "memory", value: "50%", alert: false },
      { id: "db", value: "slow", alert: true },
      { id: "jobs", value: "1 failure", alert: false },
      { id: "queue", value: "14 waiting", alert: false },
      { id: "deploy", value: "unchanged", alert: false },
      { id: "availability", value: "slow", alert: true },
    ],
    memory: [
      { id: "rps", value: "38 req/min", alert: false },
      { id: "errors", value: "0.8%", alert: false },
      { id: "latency", value: "300 ms p95", alert: false },
      { id: "cpu", value: "40%", alert: false },
      { id: "memory", value: "93%", alert: true },
      { id: "db", value: "healthy", alert: false },
      { id: "jobs", value: "0 failures", alert: false },
      { id: "queue", value: "3 waiting", alert: false },
      { id: "deploy", value: "unchanged", alert: false },
      { id: "availability", value: "at risk", alert: true },
    ],
    workers: [
      { id: "rps", value: "40 req/min", alert: false },
      { id: "errors", value: "0.4%", alert: false },
      { id: "latency", value: "190 ms p95", alert: false },
      { id: "cpu", value: "34%", alert: false },
      { id: "memory", value: "52%", alert: false },
      { id: "db", value: "healthy", alert: false },
      { id: "jobs", value: "26 failures", alert: true },
      { id: "queue", value: "40 waiting", alert: false },
      { id: "deploy", value: "worker version differs", alert: true },
      { id: "availability", value: "web serving, jobs failing", alert: true },
    ],
    queue: [
      { id: "rps", value: "44 req/min", alert: false },
      { id: "errors", value: "0.5%", alert: false },
      { id: "latency", value: "200 ms p95", alert: false },
      { id: "cpu", value: "36%", alert: false },
      { id: "memory", value: "50%", alert: false },
      { id: "db", value: "healthy", alert: false },
      { id: "jobs", value: "2 failures", alert: false },
      { id: "queue", value: "1,200 waiting", alert: true },
      { id: "deploy", value: "unchanged", alert: false },
      { id: "availability", value: "web serving, work delayed", alert: true },
    ],
    "failed-deploy": [
      { id: "rps", value: "41 req/min", alert: false },
      { id: "errors", value: "18%", alert: true },
      { id: "latency", value: "700 ms p95", alert: false },
      { id: "cpu", value: "44%", alert: false },
      { id: "memory", value: "60%", alert: false },
      { id: "db", value: "healthy", alert: false },
      { id: "jobs", value: "0 failures", alert: false },
      { id: "queue", value: "2 waiting", alert: false },
      { id: "deploy", value: "failed — previous version should stay", alert: true },
      { id: "availability", value: "degraded if the failed version took traffic", alert: true },
    ],
    dependency: [
      { id: "rps", value: "40 req/min", alert: false },
      { id: "errors", value: "7% on one route", alert: true },
      { id: "latency", value: "1.1 s p95 on that route", alert: true },
      { id: "cpu", value: "33%", alert: false },
      { id: "memory", value: "48%", alert: false },
      { id: "db", value: "healthy", alert: false },
      { id: "jobs", value: "0 failures", alert: false },
      { id: "queue", value: "2 waiting", alert: false },
      { id: "deploy", value: "unchanged", alert: false },
      { id: "availability", value: "partial", alert: true },
    ],
  };
  const labels: Record<string, string> = {
    rps: "Request rate",
    errors: "Error rate",
    latency: "Response latency",
    cpu: "CPU utilization",
    memory: "Memory utilization",
    db: "Database connection health",
    jobs: "Background-job failures",
    queue: "Queue depth",
    deploy: "Deployment status",
    availability: "Service availability",
  };
  return {
    scenario,
    label: copy.label,
    notice: "Synthetic telemetry for the fictional Fieldnote app. Not measured on any of my sites.",
    metrics: table[scenario].map((metric) => ({ ...metric, label: labels[metric.id] ?? metric.id })),
    alerts: copy.alerts,
    investigation: copy.investigation,
  };
}

/**
 * Describes the effect of scaling levers under a named bottleneck.
 * The text refuses a linear-scaling claim and says when more instances miss the limit.
 */
export function scaleOutcome(input: ScaleInput): ScaleReport {
  const instances = Math.max(1, Math.floor(input.instances));
  const effects: string[] = [];
  const databaseBound = input.bottleneck === "database";
  if (instances === 1) {
    effects.push("One application instance is the whole app tier in this model.");
  } else if (databaseBound && !input.readReplica && !input.index) {
    effects.push(
      `${instances} application instances do not remove a database bottleneck. They can open more connections and make the database slower.`,
    );
  } else if (input.bottleneck === "downstream") {
    effects.push(
      `${instances} instances do not speed up a saturated downstream. They can send it more traffic.`,
    );
  } else {
    effects.push(
      `${instances} stateless instances can add application capacity in this model. That is not a promise of linear throughput.`,
    );
  }
  if (input.cache) {
    effects.push("Caching skips repeated reads when the response is allowed to be stale.");
  }
  if (input.queue) {
    effects.push("A queue lets the web tier accept work and lets workers drain it at their own rate.");
  }
  if (input.readReplica) {
    effects.push("A read replica helps read-heavy queries. Writes still go to the primary.");
  }
  if (input.pool) {
    effects.push("A connection pool caps how many database sessions the app opens.");
  }
  if (input.index) {
    effects.push("An index can make the slow query cheaper. It does not help a query that needs a different shape.");
  }
  if (input.rateLimit) {
    effects.push("A rate limit sheds excess calls so the rest keep a chance of succeeding.");
  }
  if (input.retries === "immediate" && input.bottleneck !== "application") {
    effects.push("Immediate retries during a database or downstream failure add load. They can deepen the outage.");
  } else if (input.retries === "backoff") {
    effects.push("Retries with a limit and backoff wait, then try again. They still need a timeout and an idempotent operation.");
  } else if (input.retries === "none") {
    effects.push("No retries. The caller sees the failure once.");
  }
  return {
    effects,
    limitation:
      "This is a teaching model with a single named bottleneck. It is not a benchmark, and it does not predict a real system's capacity.",
  };
}
