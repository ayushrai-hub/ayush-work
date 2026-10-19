/**
 * Deterministic delivery simulation for the DevOps proof-of-work page.
 *
 * The model is a small state machine: optional stages can be omitted, a wave can be marked
 * running and then settled, and a failed dependency blocks every later stage. Nothing here
 * shells out, reads credentials, or talks to a CI host. Timestamps are not produced; callers
 * label any clock they draw as illustrative.
 *
 * Connects to:
 * - src/components/devops/ControlRoom.tsx and PipelineBuilder.tsx.
 * - src/content/devopsPow.ts (the change presets and the copy around each stage).
 * - src/__tests__/devopsPipeline.test.ts.
 */

/** Statuses the workbench is allowed to show. Disabled stages are omitted rather than given one of these. */
export const STAGE_STATUSES = [
  "queued",
  "running",
  "passed",
  "failed",
  "blocked",
  "cancelled",
  "rolled-back",
] as const;

/** One of `STAGE_STATUSES`. */
export type StageStatus = (typeof STAGE_STATUSES)[number];

/** How a failed security check affects promotion. `report` records the failure and does not stop deploy. */
export type SecurityPolicy = "block" | "report";

/** One pipeline stage and the stages it always waits for. Extra waits are added in `dependenciesOf`. */
export interface StageDef {
  id: string;
  name: string;
  purpose: string;
  optional: boolean;
  /** Stages that must already have passed. Parallel stages share a wave and list the same parents. */
  dependsOn: readonly string[];
  /** Execution bucket. Equal waves may run together once every dependency has passed. */
  wave: number;
}

/**
 * Sample pipeline. Waves 2's lint, unit, and security checks share a wave on purpose.
 * Integration tests sit later because they need the unit suite. The build waits for lint and unit tests.
 */
export const PIPELINE_STAGES: readonly StageDef[] = [
  {
    id: "checkout",
    name: "Checkout",
    purpose: "Fetch the revision the pipeline will build. Later stages should not invent a different commit.",
    optional: false,
    dependsOn: [],
    wave: 0,
  },
  {
    id: "install",
    name: "Dependency installation",
    purpose: "Install from the lockfile so the build uses the pinned set, not a floating resolve.",
    optional: false,
    dependsOn: ["checkout"],
    wave: 1,
  },
  {
    id: "lint",
    name: "Linting",
    purpose: "Static checks. A failure here is a reason to stop before spending a build.",
    optional: false,
    dependsOn: ["install"],
    wave: 2,
  },
  {
    id: "unit",
    name: "Unit tests",
    purpose: "Fast automated tests. A failure blocks artifact promotion.",
    optional: false,
    dependsOn: ["install"],
    wave: 2,
  },
  {
    id: "security",
    name: "Security and dependency checks",
    purpose: "Policy check for known advisories and secret patterns. Blocking is a policy choice.",
    optional: true,
    dependsOn: ["install"],
    wave: 2,
  },
  {
    id: "integration",
    name: "Integration tests",
    purpose: "Tests that need more than one component. They wait for the unit suite.",
    optional: true,
    dependsOn: ["unit"],
    wave: 3,
  },
  {
    id: "build",
    name: "Application build",
    purpose: "Produce the build from the revision that passed the required checks.",
    optional: false,
    dependsOn: ["lint", "unit"],
    wave: 4,
  },
  {
    id: "artifact",
    name: "Artifact creation",
    purpose: "Package one immutable artifact. Promotion should move this object, not rebuild it.",
    optional: false,
    dependsOn: ["build"],
    wave: 5,
  },
  {
    id: "validate",
    name: "Artifact validation",
    purpose: "Check the artifact identity and that the expected files are inside it.",
    optional: true,
    dependsOn: ["artifact"],
    wave: 6,
  },
  {
    id: "deploy",
    name: "Deployment",
    purpose: "Place the candidate artifact where health checks can reach it. Missing configuration stops this step.",
    optional: false,
    dependsOn: ["artifact"],
    wave: 7,
  },
  {
    id: "smoke",
    name: "Smoke tests",
    purpose: "A short path through the deployed candidate. Failure rejects the release and marks it rolled back.",
    optional: true,
    dependsOn: ["deploy"],
    wave: 8,
  },
  {
    id: "verify",
    name: "Release verification",
    purpose: "Decide whether the candidate stays. It cannot pass when a required earlier stage failed.",
    optional: false,
    dependsOn: ["deploy"],
    wave: 9,
  },
];

/** Mutable simulation settings. Progress fields are replaced wholesale by the step functions. */
export interface PipelineConfig {
  enabled: Record<string, boolean>;
  failing: Record<string, boolean>;
  securityPolicy: SecurityPolicy;
  /** Waves with an index below this have settled. */
  completedWaves: number;
  mode: "idle" | "running";
  runningWave: number | null;
  cancelled: boolean;
  /** Visitor asked to return to the last approved artifact after a deploy had succeeded. */
  manualRollback: boolean;
}

/** A settled or in-progress log line. The stamp is an index, not a measured duration. */
export interface IllustrativeLog {
  id: string;
  stage: string;
  status: StageStatus;
  /** Synthetic label such as `wave 2`. Not an elapsed time from a real runner. */
  stamp: string;
  message: string;
}

/** Release outcome derived from stage statuses. */
export interface ReleaseDecision {
  outcome: "not-started" | "in-progress" | "released" | "blocked" | "rolled-back" | "cancelled";
  reason: string;
}

/** One gate the release simulator can require. */
export interface ReleaseGate {
  id: string;
  label: string;
  detail: string;
}

/** Visitor-controlled gate. `mandatory` false means a failing gate is recorded and does not stop promotion. */
export interface GateSetting {
  id: string;
  passing: boolean;
  mandatory: boolean;
}

/** One environment hop in the release simulator. */
export interface ReleaseStep {
  id: string;
  label: string;
  /** Gate ids that this hop consults. */
  needs: readonly string[];
}

/** Result of walking the release steps against the current gates. */
export interface ReleaseProgress {
  steps: { id: string; label: string; status: "promoted" | "blocked" }[];
  blockedBy: string | null;
  activeVersion: string;
  candidateVersion: string;
  lastApprovedVersion: string;
  rollbackEligible: boolean;
  failureReason: string | null;
}

/** Synthetic version names. They are not releases of any repository. */
export const SYNTHETIC_VERSIONS = {
  current: "1.4.2",
  candidate: "1.5.0",
  lastApproved: "1.4.2",
} as const;

/** Gates a visitor can fail. Copy stays with the content module's labels via these ids. */
export const RELEASE_GATES: readonly ReleaseGate[] = [
  {
    id: "tests",
    label: "All mandatory tests pass",
    detail: "Unit tests, and integration tests when that stage is part of the pipeline.",
  },
  {
    id: "security",
    label: "Security checks meet the configured policy",
    detail: "A blocking policy stops promotion. A report-only policy records the finding.",
  },
  {
    id: "config",
    label: "Required configuration exists",
    detail: "The deploy step has the variables it needs. Values are not shown here.",
  },
  {
    id: "health",
    label: "Health checks succeed",
    detail: "The candidate answers its liveness check before traffic is widened.",
  },
  {
    id: "smoke",
    label: "Smoke tests pass",
    detail: "A short user path against the candidate.",
  },
  {
    id: "errors",
    label: "Error rate stays within the sample threshold",
    detail: "The threshold in this simulator is a fixed sample rule, not a measured SLO.",
  },
  {
    id: "dependencies",
    label: "Critical dependencies are available",
    detail: "The sample treats the database and the application process as required.",
  },
];

/** Promotion order. Later hops include the earlier gates so a failed gate cannot be skipped. */
export const RELEASE_STEPS: readonly ReleaseStep[] = [
  { id: "development", label: "Development", needs: [] },
  { id: "ci", label: "CI validation", needs: ["tests", "security"] },
  { id: "staging", label: "Staging", needs: ["tests", "security", "config", "health"] },
  { id: "approval", label: "Approval", needs: ["tests", "security", "config", "health", "smoke"] },
  {
    id: "production",
    label: "Production",
    needs: ["tests", "security", "config", "health", "smoke", "dependencies"],
  },
  {
    id: "verification",
    label: "Post-release verification",
    needs: ["tests", "security", "config", "health", "smoke", "dependencies", "errors"],
  },
];

/** Looks up a stage by id. Throws because a typo should fail the page, not render a blank row. */
export function stageById(id: string): StageDef {
  const stage = PIPELINE_STAGES.find((item) => item.id === id);
  if (!stage) throw new Error(`devopsPipeline: unknown stage ${id}`);
  return stage;
}

/** Fresh idle pipeline. Required stages start enabled. Optional stages start enabled unless overridden. */
export function createPipeline(
  partial?: Partial<Pick<PipelineConfig, "enabled" | "failing" | "securityPolicy">>,
): PipelineConfig {
  const enabled: Record<string, boolean> = {};
  const failing: Record<string, boolean> = {};
  for (const stage of PIPELINE_STAGES) {
    enabled[stage.id] = stage.optional ? partial?.enabled?.[stage.id] !== false : true;
    failing[stage.id] = partial?.failing?.[stage.id] === true;
  }
  return {
    enabled,
    failing,
    securityPolicy: partial?.securityPolicy ?? "block",
    completedWaves: 0,
    mode: "idle",
    runningWave: null,
    cancelled: false,
    manualRollback: false,
  };
}

/** Whether this run includes the stage. Required stages stay on. */
export function isEnabled(id: string, config: PipelineConfig): boolean {
  const stage = stageById(id);
  return stage.optional ? config.enabled[id] !== false : true;
}

/**
 * Parents the stage waits for in this configuration.
 * Optional parents are included only when they are enabled. Security blocks deploy only under the block policy.
 */
export function dependenciesOf(id: string, config: PipelineConfig): string[] {
  const extra: string[] = [];
  if (id === "build" && isEnabled("integration", config)) extra.push("integration");
  if (id === "deploy" && isEnabled("security", config) && config.securityPolicy === "block") {
    extra.push("security");
  }
  if (id === "deploy" && isEnabled("validate", config)) extra.push("validate");
  if (id === "verify" && isEnabled("smoke", config)) extra.push("smoke");
  return [...stageById(id).dependsOn, ...extra].filter((dep) => isEnabled(dep, config));
}

/** True once the stage's wave has been settled. */
function executed(id: string, config: PipelineConfig): boolean {
  return stageById(id).wave < config.completedWaves;
}

/**
 * True when the deploy should be treated as returned to the previous artifact.
 * Derived from smoke failure or an explicit rollback, so clearing the failure clears the flag.
 */
export function isRolledBack(config: PipelineConfig): boolean {
  const smokeFailed =
    isEnabled("smoke", config) && config.failing.smoke === true && executed("smoke", config);
  const deployExecuted = executed("deploy", config) && config.failing.deploy !== true;
  return deployExecuted && (smokeFailed || config.manualRollback);
}

/** Sorted wave numbers that still contain at least one enabled stage. */
export function enabledWaves(config: PipelineConfig): number[] {
  const waves = new Set<number>();
  for (const stage of PIPELINE_STAGES) {
    if (isEnabled(stage.id, config)) waves.add(stage.wave);
  }
  return [...waves].sort((a, b) => a - b);
}

/**
 * Waves in run order. `parallel` is true when the wave holds more than one enabled stage.
 * That is the graph the page shows for why lint and tests can share a wave while the build cannot.
 */
export function executionWaves(config: PipelineConfig): { wave: number; parallel: boolean; stages: StageDef[] }[] {
  return enabledWaves(config).map((wave) => {
    const stages = PIPELINE_STAGES.filter((stage) => stage.wave === wave && isEnabled(stage.id, config));
    return { wave, parallel: stages.length > 1, stages };
  });
}

/** Status of one enabled stage. */
export function statusOf(id: string, config: PipelineConfig): StageStatus {
  const stage = stageById(id);
  const deps = dependenciesOf(id, config);
  const depStatuses = deps.map((dep) => statusOf(dep, config));
  const blockedByDep = depStatuses.some((status) => status === "failed" || status === "blocked" || status === "cancelled");
  const depsSettled = depStatuses.every((status) => status !== "queued" && status !== "running");

  if (config.cancelled && stage.wave >= config.completedWaves) {
    return blockedByDep && depsSettled ? "blocked" : "cancelled";
  }
  if (blockedByDep && depsSettled) return "blocked";
  if (config.mode === "running" && config.runningWave === stage.wave) return "running";
  if (!executed(id, config)) return "queued";
  if (config.failing[id]) return "failed";
  if (id === "deploy" && isRolledBack(config)) return "rolled-back";
  return "passed";
}

/** Short illustrative line for a settled or running stage. */
function logMessage(id: string, status: StageStatus, config: PipelineConfig): string {
  if (status === "running") return "Illustrative runner marked the stage running. This is not a live job.";
  if (status === "blocked") return "Blocked because an earlier required stage did not pass.";
  if (status === "cancelled") return "Cancelled before this stage settled.";
  if (status === "rolled-back") return "Illustrative rollback returned traffic to the last approved artifact.";
  if (status === "failed" && id === "lint") return "Lint failed. The build does not start.";
  if (status === "failed" && id === "unit") return "Unit tests failed. The artifact is not promoted.";
  if (status === "failed" && id === "integration") return "Integration tests failed. The build waits on them in this run.";
  if (status === "failed" && id === "security") {
    return config.securityPolicy === "block"
      ? "Security policy is set to block. The deploy does not start."
      : "Security policy is set to report. The finding is recorded and does not, by itself, stop deploy.";
  }
  if (status === "failed" && id === "deploy") return "Required configuration is missing. Deploy does not proceed.";
  if (status === "failed" && id === "smoke") return "Smoke tests failed. The candidate is rejected and the deploy is marked rolled back.";
  if (status === "failed") return "The stage failed. Later stages that depend on it stay blocked.";
  return "Illustrative pass. This row is not a log line from a CI provider.";
}

/** Log rows for stages that have left the queue, in pipeline order. */
export function illustrativeLogs(config: PipelineConfig): IllustrativeLog[] {
  const lines: IllustrativeLog[] = [];
  for (const stage of PIPELINE_STAGES) {
    if (!isEnabled(stage.id, config)) continue;
    const status = statusOf(stage.id, config);
    if (status === "queued") continue;
    lines.push({
      id: stage.id,
      stage: stage.name,
      status,
      stamp: `wave ${stage.wave}`,
      message: logMessage(stage.id, status, config),
    });
  }
  return lines;
}

/** Turns an optional stage on or off and drops any in-flight wave so the graph stays consistent. */
export function toggleStage(config: PipelineConfig, id: string): PipelineConfig {
  const stage = stageById(id);
  if (!stage.optional) return config;
  return {
    ...config,
    enabled: { ...config.enabled, [id]: !isEnabled(id, config) },
    mode: "idle",
    runningWave: null,
    completedWaves: 0,
    cancelled: false,
    manualRollback: false,
  };
}

/** Marks a stage as failing or not, and replays from the start so earlier passes cannot linger. */
export function toggleFailure(config: PipelineConfig, id: string): PipelineConfig {
  return {
    ...createPipeline({
      enabled: config.enabled,
      failing: { ...config.failing, [id]: !config.failing[id] },
      securityPolicy: config.securityPolicy,
    }),
  };
}

/** Replaces the failure map from a named change. Enabled stages and the security policy are kept. */
export function applyChange(config: PipelineConfig, failing: Record<string, boolean>): PipelineConfig {
  return createPipeline({
    enabled: config.enabled,
    failing,
    securityPolicy: config.securityPolicy,
  });
}

/** Sets whether a security failure blocks deploy, and replays the run. */
export function setSecurityPolicy(config: PipelineConfig, securityPolicy: SecurityPolicy): PipelineConfig {
  return createPipeline({
    enabled: config.enabled,
    failing: config.failing,
    securityPolicy,
  });
}

/** Next wave index that has not settled, or null when the run is finished. */
function nextWave(config: PipelineConfig): number | null {
  return enabledWaves(config).find((wave) => wave >= config.completedWaves) ?? null;
}

/**
 * One visitor step. From idle, the next wave becomes running. From running, that wave settles.
 * A wave whose stages are already blocked settles immediately so the visitor is not asked to "run" a blocked build.
 */
export function advance(config: PipelineConfig): PipelineConfig {
  if (config.cancelled) return config;
  if (config.mode === "running" && config.runningWave !== null) {
    return {
      ...config,
      mode: "idle",
      runningWave: null,
      completedWaves: config.runningWave + 1,
    };
  }
  const wave = nextWave(config);
  if (wave === null) return config;
  const probing: PipelineConfig = { ...config, mode: "running", runningWave: wave };
  const runnable = PIPELINE_STAGES.filter(
    (stage) => stage.wave === wave && isEnabled(stage.id, config) && statusOf(stage.id, probing) === "running",
  );
  if (runnable.length === 0) {
    return { ...config, mode: "idle", runningWave: null, completedWaves: wave + 1 };
  }
  return probing;
}

/** Settles every remaining wave. The intermediate running state is not returned. */
export function runToEnd(config: PipelineConfig): PipelineConfig {
  let current = config;
  for (let guard = 0; guard < 40; guard += 1) {
    const next = advance(current);
    if (next === current || (next.mode === current.mode && next.completedWaves === current.completedWaves && next.runningWave === current.runningWave)) {
      return current.mode === "running" ? advance(current) : current;
    }
    current = next.mode === "running" ? advance(next) : next;
    if (nextWave(current) === null && current.mode === "idle") return current;
  }
  return current;
}

/** Marks stages that have not settled as cancelled. */
export function cancelRun(config: PipelineConfig): PipelineConfig {
  return { ...config, cancelled: true, mode: "idle", runningWave: null };
}

/** Asks for a rollback after the deploy wave has passed. No-op before that. */
export function requestRollback(config: PipelineConfig): PipelineConfig {
  if (!executed("deploy", config) || config.failing.deploy) return config;
  return { ...config, manualRollback: true };
}

/** Restarts progress and keeps the visitor's stage and failure choices. */
export function resetProgress(config: PipelineConfig): PipelineConfig {
  return createPipeline({
    enabled: config.enabled,
    failing: config.failing,
    securityPolicy: config.securityPolicy,
  });
}

/** Whether the simulated release may be called successful. */
export function releaseDecision(config: PipelineConfig): ReleaseDecision {
  if (config.completedWaves === 0 && config.mode === "idle" && !config.cancelled) {
    return { outcome: "not-started", reason: "The pipeline has not been started." };
  }
  const enabled = PIPELINE_STAGES.filter((stage) => isEnabled(stage.id, config));
  const statuses = enabled.map((stage) => statusOf(stage.id, config));
  if (statuses.some((status) => status === "running" || status === "queued")) {
    if (config.cancelled) {
      return { outcome: "cancelled", reason: "The run was cancelled before every stage settled." };
    }
    return { outcome: "in-progress", reason: "Some stages are still queued or running." };
  }
  if (config.cancelled) {
    return { outcome: "cancelled", reason: "The run was cancelled before every stage settled." };
  }
  if (isRolledBack(config)) {
    return {
      outcome: "rolled-back",
      reason: "The candidate left the deploy step and was returned to the last approved artifact.",
    };
  }
  const blocking = enabled.filter((stage) => {
    const status = statusOf(stage.id, config);
    if (stage.id === "security" && config.securityPolicy === "report" && status === "failed") return false;
    return status === "failed" || status === "blocked" || status === "cancelled";
  });
  if (blocking.length > 0) {
    const failed = blocking.find((stage) => statusOf(stage.id, config) === "failed");
    return {
      outcome: "blocked",
      reason: failed
        ? `${failed.name} failed, so the release does not proceed.`
        : "A required stage is blocked or cancelled, so the release does not proceed.",
    };
  }
  if (isEnabled("security", config) && config.failing.security && config.securityPolicy === "report") {
    return {
      outcome: "released",
      reason: "Required stages passed. The security finding was reported under a non-blocking policy.",
    };
  }
  return { outcome: "released", reason: "Every enabled stage passed. This is a simulated release, not a deployment." };
}

/** Default gates, all passing and mandatory, for the release panel's first paint. */
export function defaultGates(): GateSetting[] {
  return RELEASE_GATES.map((gate) => ({ id: gate.id, passing: true, mandatory: true }));
}

/**
 * Walks development through post-release verification.
 * The first mandatory failing gate blocks that hop and every hop after it.
 */
export function evaluateRelease(gates: readonly GateSetting[]): ReleaseProgress {
  const byId = new Map(gates.map((gate) => [gate.id, gate]));
  let blockedBy: string | null = null;
  const steps = RELEASE_STEPS.map((step) => {
    if (blockedBy) return { id: step.id, label: step.label, status: "blocked" as const };
    for (const need of step.needs) {
      const gate = byId.get(need);
      if (gate && gate.mandatory && !gate.passing) {
        blockedBy = gate.id;
        return { id: step.id, label: step.label, status: "blocked" as const };
      }
    }
    return { id: step.id, label: step.label, status: "promoted" as const };
  });
  const rolled = blockedBy !== null;
  return {
    steps,
    blockedBy,
    activeVersion: rolled ? SYNTHETIC_VERSIONS.lastApproved : SYNTHETIC_VERSIONS.candidate,
    candidateVersion: SYNTHETIC_VERSIONS.candidate,
    lastApprovedVersion: SYNTHETIC_VERSIONS.lastApproved,
    rollbackEligible: rolled,
    failureReason: blockedBy
      ? `${RELEASE_GATES.find((gate) => gate.id === blockedBy)?.label ?? blockedBy} is mandatory and failing.`
      : null,
  };
}
