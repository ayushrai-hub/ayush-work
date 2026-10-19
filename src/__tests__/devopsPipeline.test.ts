/**
 * Tests the deterministic delivery model behind /pow/devops-engineer.
 *
 * Covers wave order, blocking failures, the report-only security policy, smoke-test rollback,
 * cancellation, and release-gate promotion. No test starts a process or a network call.
 *
 * Connects to:
 * - src/lib/devopsPipeline.ts
 */
import { describe, expect, it } from "vitest";
import {
  advance,
  applyChange,
  cancelRun,
  createPipeline,
  defaultGates,
  dependenciesOf,
  evaluateRelease,
  executionWaves,
  isEnabled,
  releaseDecision,
  requestRollback,
  runToEnd,
  setSecurityPolicy,
  statusOf,
  toggleFailure,
  toggleStage,
} from "../lib/devopsPipeline";

/** Stage graph, failure policy, and release promotion. */
describe("devops pipeline simulation", () => {
  it("runs lint and unit tests in one wave and keeps the build behind them", () => {
    const config = createPipeline();
    const waves = executionWaves(config);
    const shared = waves.find((wave) => wave.stages.some((stage) => stage.id === "lint"));
    expect(shared?.parallel).toBe(true);
    expect(shared?.stages.map((stage) => stage.id)).toEqual(["lint", "unit", "security"]);
    expect(dependenciesOf("build", config)).toEqual(["lint", "unit", "integration"]);
    expect(dependenciesOf("deploy", config)).toContain("security");
  });

  it("omits optional parents when those stages are disabled", () => {
    let config = createPipeline();
    config = toggleStage(config, "integration");
    config = toggleStage(config, "security");
    expect(isEnabled("integration", config)).toBe(false);
    expect(dependenciesOf("build", config)).toEqual(["lint", "unit"]);
    expect(dependenciesOf("deploy", config)).not.toContain("security");
    expect(toggleStage(config, "lint")).toBe(config);
  });

  it("shows running, then blocks the release when lint fails", () => {
    const started = advance(applyChange(createPipeline(), { lint: true }));
    expect(statusOf("checkout", started)).toBe("running");
    const finished = runToEnd(started);
    expect(statusOf("lint", finished)).toBe("failed");
    expect(statusOf("build", finished)).toBe("blocked");
    expect(statusOf("artifact", finished)).toBe("blocked");
    expect(releaseDecision(finished).outcome).toBe("blocked");
  });

  it("refuses artifact promotion when unit tests fail", () => {
    const finished = runToEnd(applyChange(createPipeline(), { unit: true }));
    expect(statusOf("unit", finished)).toBe("failed");
    expect(statusOf("artifact", finished)).toBe("blocked");
    expect(releaseDecision(finished).outcome).not.toBe("released");
  });

  it("lets a report-only security failure through and blocks under the other policy", () => {
    const failing = applyChange(createPipeline(), { security: true });
    const blocked = runToEnd(failing);
    expect(releaseDecision(blocked).outcome).toBe("blocked");
    expect(statusOf("deploy", blocked)).toBe("blocked");

    const reported = runToEnd(setSecurityPolicy(failing, "report"));
    expect(statusOf("security", reported)).toBe("failed");
    expect(releaseDecision(reported).outcome).toBe("released");
  });

  it("stops deploy when configuration is missing", () => {
    const finished = runToEnd(applyChange(createPipeline(), { deploy: true }));
    expect(statusOf("deploy", finished)).toBe("failed");
    expect(statusOf("verify", finished)).toBe("blocked");
    expect(releaseDecision(finished).reason).toMatch(/Deployment failed/);
  });

  it("marks a smoke failure as rolled back and allows an explicit rollback after deploy", () => {
    const smoked = runToEnd(applyChange(createPipeline(), { smoke: true }));
    expect(statusOf("smoke", smoked)).toBe("failed");
    expect(statusOf("deploy", smoked)).toBe("rolled-back");
    expect(releaseDecision(smoked).outcome).toBe("rolled-back");

    const deployed = runToEnd(createPipeline({ enabled: { smoke: false } }));
    expect(requestRollback(createPipeline())).toEqual(createPipeline());
    const rolled = requestRollback(deployed);
    expect(statusOf("deploy", rolled)).toBe("rolled-back");
    expect(releaseDecision(rolled).outcome).toBe("rolled-back");
  });

  it("cancels work that has not settled and releases a clean run", () => {
    const cancelled = cancelRun(advance(createPipeline()));
    expect(statusOf("checkout", cancelled)).toBe("cancelled");
    expect(releaseDecision(cancelled).outcome).toBe("cancelled");
    const released = runToEnd(createPipeline());
    expect(releaseDecision(released).outcome).toBe("released");
    expect(runToEnd(released)).toBe(released);
  });

  it("replays from the start when a failure is toggled", () => {
    const ran = runToEnd(createPipeline());
    const failed = toggleFailure(ran, "lint");
    expect(failed.completedWaves).toBe(0);
    expect(failed.failing.lint).toBe(true);
  });

  it("blocks promotion on the first mandatory failing gate and returns to the approved version", () => {
    const open = evaluateRelease(defaultGates());
    expect(open.steps.every((step) => step.status === "promoted")).toBe(true);
    expect(open.activeVersion).toBe("1.5.0");
    expect(open.rollbackEligible).toBe(false);

    const gates = defaultGates().map((gate) =>
      gate.id === "smoke" ? { ...gate, passing: false } : gate,
    );
    const failed = evaluateRelease(gates);
    expect(failed.blockedBy).toBe("smoke");
    expect(failed.steps.find((step) => step.id === "approval")?.status).toBe("blocked");
    expect(failed.steps.find((step) => step.id === "production")?.status).toBe("blocked");
    expect(failed.steps.find((step) => step.id === "staging")?.status).toBe("promoted");
    expect(failed.activeVersion).toBe("1.4.2");
    expect(failed.rollbackEligible).toBe(true);

    const optional = gates.map((gate) => (gate.id === "smoke" ? { ...gate, mandatory: false } : gate));
    expect(evaluateRelease(optional).blockedBy).toBeNull();
  });
});
