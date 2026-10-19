/**
 * Tests the Cloud Operations Lab simulations.
 *
 * Checks that a failed health or smoke stage never counts as a release, that sample telemetry
 * and cost stay deterministic, and that extra application instances do not clear a database bottleneck.
 *
 * Connects to:
 * - src/lib/cloudOpsLab.ts
 */
import { describe, expect, it } from "vitest";
import {
  costPreset,
  deployScenarios,
  estimateCost,
  sampleTelemetry,
  scaleOutcome,
  simulateDeployment,
} from "../lib/cloudOpsLab";
import type { DeployScenario, DeployTarget, TelemetryScenario } from "../lib/cloudOpsLab";

/** Deployment state machine. */
describe("simulateDeployment", () => {
  it("releases only the success scenario and blocks health, smoke, and database failures", () => {
    for (const target of ["managed", "container", "kubernetes"] as DeployTarget[]) {
      const success = simulateDeployment(target, "success");
      expect(success.released).toBe(true);
      expect(success.stages.every((stage) => stage.status === "passed" || stage.status === "not-required")).toBe(true);
      expect(success.summary).toMatch(/did not deploy/i);
    }
    for (const scenario of deployScenarios) {
      if (scenario.id === "success") continue;
      const run = simulateDeployment("container", scenario.id);
      expect(run.released).toBe(false);
      expect(run.stages.some((stage) => stage.status === "failed")).toBe(true);
      expect(run.summary).toMatch(/blocked/i);
    }
    const health = simulateDeployment("kubernetes", "health-check");
    expect(health.stages.find((stage) => stage.id === "health")?.status).toBe("failed");
    expect(health.stages.find((stage) => stage.id === "verify")?.status).toBe("skipped");
    expect(health.stages.find((stage) => stage.id === "rollback")?.detail).toMatch(/must not be shown as a successful/i);
    const early = simulateDeployment("managed", "build-failure");
    expect(early.stages.find((stage) => stage.id === "rollback")?.status).toBe("not-required");
    expect(simulateDeployment("managed", "image-unavailable").stages.find((stage) => stage.id === "artifact")?.detail).toMatch(/bundle/);
    expect(simulateDeployment("container", "missing-env").stages.find((stage) => stage.id === "config")?.detail).toMatch(/secret/);
    expect(simulateDeployment("container", "bad-config").stages.find((stage) => stage.id === "config")?.status).toBe("failed");
    expect(simulateDeployment("container", "database").stages.find((stage) => stage.id === "health")?.detail).toMatch(/database/i);
    expect(simulateDeployment("container", "smoke-test").stages.find((stage) => stage.id === "smoke")?.status).toBe("failed");
    expect(simulateDeployment("container", "timeout").stages.find((stage) => stage.id === "deploy")?.status).toBe("failed");
  });
});

/** Sample cost and telemetry. */
describe("estimateCost and telemetry", () => {
  it("derives the total from the stated assumptions and lowers transfer when cache hits rise", () => {
    const small = estimateCost(costPreset("small"));
    const moderate = estimateCost(costPreset("moderate"));
    const higher = estimateCost(costPreset("higher"));
    expect(moderate.total).toBeGreaterThan(small.total);
    expect(higher.total).toBeGreaterThan(moderate.total);
    const cold = estimateCost({ ...costPreset("small"), cacheHitRatio: 0 });
    const warm = estimateCost({ ...costPreset("small"), cacheHitRatio: 0.9 });
    const transfer = (ratio: number) =>
      estimateCost({ ...costPreset("small"), cacheHitRatio: ratio }).lines.find((line) => line.id === "transfer")?.amount;
    expect(transfer(0.9)).toBeLessThan(transfer(0) ?? 0);
    expect(warm.total).toBeLessThan(cold.total);
    expect(estimateCost({ ...costPreset("small"), cacheHitRatio: Number.NaN }).lines.find((line) => line.id === "transfer")?.note).toMatch(/0%/);
    expect(small.caveat).toMatch(/Not a bill/);
    expect(small.assumptions[0]).toMatch(/Not an invoice/);
  });

  it("changes alerts with the scenario and keeps the numbers fixed", () => {
    const scenarios: TelemetryScenario[] = [
      "baseline",
      "surge",
      "errors",
      "slow-db",
      "memory",
      "workers",
      "queue",
      "failed-deploy",
      "dependency",
    ];
    expect(sampleTelemetry("baseline").alerts).toEqual([]);
    for (const scenario of scenarios) {
      const first = sampleTelemetry(scenario);
      const second = sampleTelemetry(scenario);
      expect(second.metrics.map((metric) => metric.value)).toEqual(first.metrics.map((metric) => metric.value));
      expect(first.notice).toMatch(/Synthetic/);
    }
    expect(sampleTelemetry("failed-deploy").alerts.length).toBeGreaterThan(0);
    expect(sampleTelemetry("slow-db").investigation.mitigate).toMatch(/instances will not/i);
  });
});

/** Scaling model. */
describe("scaleOutcome", () => {
  it("says more instances do not fix a database bottleneck and that immediate retries add load", () => {
    const stuck = scaleOutcome({
      instances: 4,
      cache: false,
      queue: false,
      readReplica: false,
      pool: false,
      index: false,
      rateLimit: false,
      bottleneck: "database",
      retries: "immediate",
    });
    expect(stuck.effects.join(" ")).toMatch(/do not remove a database bottleneck/);
    expect(stuck.effects.join(" ")).toMatch(/Immediate retries/);
    expect(stuck.limitation).toMatch(/not a benchmark/);

    const helped = scaleOutcome({
      instances: 3,
      cache: true,
      queue: true,
      readReplica: true,
      pool: true,
      index: true,
      rateLimit: true,
      bottleneck: "application",
      retries: "backoff",
    });
    expect(helped.effects.join(" ")).toMatch(/not a promise of linear/);
    expect(helped.effects.join(" ")).toMatch(/Caching/);
    expect(helped.effects.join(" ")).toMatch(/backoff/);

    const downstream = scaleOutcome({
      instances: 2,
      cache: false,
      queue: false,
      readReplica: false,
      pool: false,
      index: false,
      rateLimit: false,
      bottleneck: "downstream",
      retries: "none",
    });
    expect(downstream.effects.join(" ")).toMatch(/downstream/);
    expect(downstream.effects.join(" ")).toMatch(/No retries/);

    const single = scaleOutcome({
      instances: 0,
      cache: false,
      queue: false,
      readReplica: false,
      pool: false,
      index: false,
      rateLimit: false,
      bottleneck: "application",
      retries: "none",
    });
    expect(single.effects[0]).toMatch(/One application instance/);
  });
});

/** Keeps the scenario union referenced so a new id has to be handled. */
describe("scenario ids", () => {
  it("includes the health-check failure", () => {
    const id: DeployScenario = "health-check";
    expect(deployScenarios.some((item) => item.id === id)).toBe(true);
  });
});
