/**
 * Tests the synthetic demand checks, metrics, simulations, and the /pow/ml-engineer page.
 *
 * Counts and metrics are asserted from the functions, not from copied percentages. The page test
 * walks the controls that change a simulated decision.
 *
 * Connects to:
 * - src/lib/mlEngineer and src/pages/MlEngineerPowPage.tsx.
 * - src/lib/publicRoutes.ts, src/content/searchIndex.ts, src/lib/agent/markdown.ts.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { searchIndex } from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import {
  DEMAND_ROWS,
  applyPromotion,
  buildSupervised,
  defaultGateOptions,
  evaluateGates,
  initialArtifacts,
  meanAbsoluteError,
  parseIsoDate,
  percentOf,
  problemEffects,
  rSquared,
  randomSplit,
  rollingLeakageExample,
  runInvariants,
  scoreHoldout,
  SAMPLE_REQUEST,
  simulateInference,
  simulateRetrain,
  simulateTraining,
  splitBreaksTime,
  timeSplit,
  validateDataset,
  DEFAULT_TRAIN_CONFIG,
  BASE_TELEMETRY,
  MONITOR_SCENARIOS,
} from "../lib/mlEngineer";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";

/** Renders the ML proof-of-work route and waits for the headline. */
async function renderPage() {
  await import("../pages/MlEngineerPowPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={["/pow/ml-engineer"]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole(
    "heading",
    { level: 1, name: "I build machine learning systems that work beyond the notebook." },
    { timeout: 15000 },
  );
}

/** Dataset checks, metrics, and simulated decisions. */
describe("ml engineer calculations", () => {
  it("derives validation counts from the rows and keeps every planted failure", () => {
    const report = validateDataset();
    expect(report.total).toBe(DEMAND_ROWS.length);
    expect(report.passed + report.failed).toBe(report.total);
    expect(report.failed).toBeGreaterThan(0);
    expect(percentOf(report.passed, report.total)).toBe(((report.passed / report.total) * 100).toFixed(1));
    expect(percentOf(1, 0)).toBe("0.0");
    for (const code of Object.keys(report.byCode)) {
      expect(report.byCode[code as keyof typeof report.byCode]).toBeGreaterThan(0);
    }
    const failedIds = new Set(report.rows.filter((row) => row.status === "fail").map((row) => row.id));
    expect(failedIds.has("d-schema")).toBe(true);
    expect(failedIds.has("d-skew")).toBe(true);
    expect(failedIds.has("d-leak")).toBe(true);
    expect(failedIds.has("m1")).toBe(true);
    expect(parseIsoDate("2024-02-31")).toBeNull();
    expect(parseIsoDate("2024-01-01")).not.toBeNull();
  });

  it("keeps future sales out of lags and scores the time-ordered holdout", () => {
    const { supervised, droppedForHistory } = buildSupervised();
    expect(droppedForHistory).toBeGreaterThan(0);
    expect(supervised.every((row) => row.observedOn > "2024-01-01")).toBe(true);
    const split = timeSplit(supervised);
    expect(splitBreaksTime(split.train, split.test)).toBeNull();
    expect(split.test.length).toBeGreaterThan(0);
    const leak = rollingLeakageExample(supervised);
    expect(leak).not.toBeNull();
    expect(leak?.causal).not.toBe(leak?.leaky);
    const random = randomSplit(supervised, 7);
    expect(random.train.length + random.test.length).toBe(supervised.length);
    const score = scoreHoldout(supervised);
    const actual = score.test.map((row) => row.actual);
    const baseline = score.test.map((row) => row.baseline);
    expect(score.baseline.mae).toBe(meanAbsoluteError(actual, baseline));
    expect(score.blend.mae).not.toBeNull();
    expect(score.worse.mae).not.toBeNull();
    expect((score.worse.mae ?? 0) > (score.baseline.mae ?? 0)).toBe(true);
    expect(rSquared([], [])).toBeNull();
    expect(rSquared([1, 1], [1, 1])).toBeNull();
    expect(score.blendErrors.reduce((sum, bucket) => sum + bucket.count, 0)).toBe(score.test.length);
  });

  it("stops simulated runs at the failing stage and blocks a worse promotion", () => {
    const completed = simulateTraining(DEFAULT_TRAIN_CONFIG);
    expect(completed.outcome).toBe("completed");
    expect(completed.artifactId).not.toBeNull();
    expect(simulateTraining({ ...DEFAULT_TRAIN_CONFIG, experimentName: "  " }).stages[0].status).toBe("failed");
    expect(simulateTraining({ ...DEFAULT_TRAIN_CONFIG, family: "neural", learningRate: 2 }).outcome).toBe("failed");
    expect(simulateTraining({ ...DEFAULT_TRAIN_CONFIG, datasetVersion: "missing" }).stages[1].status).toBe("failed");
    expect(simulateTraining({ ...DEFAULT_TRAIN_CONFIG, datasetVersion: "schema-mismatch" }).stages[1].status).toBe("failed");
    expect(simulateTraining({ ...DEFAULT_TRAIN_CONFIG, featureSet: "leaky-v0" }).stages[2].status).toBe("failed");
    expect(simulateTraining({ ...DEFAULT_TRAIN_CONFIG, injectedFailure: "resource" }).stages[3].status).toBe("failed");
    expect(simulateTraining({ ...DEFAULT_TRAIN_CONFIG, family: "forest" }).stages[3].status).toBe("failed");
    expect(simulateTraining({ ...DEFAULT_TRAIN_CONFIG, injectedFailure: "eval-gate" }).stages[4].status).toBe("failed");
    const serialized = simulateTraining({ ...DEFAULT_TRAIN_CONFIG, injectedFailure: "serialize" });
    expect(serialized.artifactId).toBeNull();
    expect(serialized.outcome).toBe("failed");

    const worse = evaluateGates({ ...defaultGateOptions(), candidate: "worse" });
    expect(worse.promoted).toBe(false);
    const blend = evaluateGates(defaultGateOptions());
    const next = applyPromotion(initialArtifacts(), blend.promoted);
    const production = next.find((item) => item.approval === "production");
    expect(production?.id).toBe(blend.promoted ? "sim-blend" : "sim-baseline");
    expect(applyPromotion(initialArtifacts(), false).find((item) => item.id === "sim-blend")?.approval).toBe("rejected");

    expect(simulateInference("ok").prediction).not.toBeNull();
    expect(simulateInference("ok", { ...SAMPLE_REQUEST, category: "nope" }).status).toBe(400);
    expect(simulateInference("malformed").status).toBe(400);
    expect(simulateInference("missing").prediction).toBeNull();
    expect(simulateInference("unavailable").status).toBe(503);
    expect(simulateInference("timeout").status).toBe(504);
    expect(simulateInference("invalid_output").prediction).toBeNull();
    expect(simulateRetrain("distribution").decision).toBe("reject");
    expect(simulateRetrain("performance").decision).toBe("reject");
    expect(simulateRetrain("spec_change").decision).toBe("reject");
    expect(simulateRetrain("new_labels").decision).toBe("recommend_review");
    expect(simulateRetrain("schedule").decision).toBe("recommend_review");
    for (const scenario of MONITOR_SCENARIOS) {
      const shifted = scenario.apply(BASE_TELEMETRY.map((point) => ({ ...point })));
      expect(shifted[shifted.length - 1]?.week).toBe("W6");
    }
    expect(runInvariants().every((item) => item.passed)).toBe(true);
    for (const horizon of [7, 14, 28] as const) {
      expect(problemEffects({ horizonDays: horizon, target: "units", metric: "mae" })[0].effect.length).toBeGreaterThan(10);
    }
    expect(problemEffects({ horizonDays: 7, target: "revenue", metric: "rmse" })[1].effect).toMatch(/revenue/i);
  });
});

/** The route, the twin, and the interactions that change simulated state. */
describe("ml engineer page", () => {
  it("renders the simulation, keeps sibling proof-of-work links, and reacts to controls", async () => {
    const user = userEvent.setup();
    expect(await renderPage()).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText(/Synthetic demonstration/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "FDE proof of work" })).toHaveAttribute("href", "/pow/fde");
    expect(screen.getAllByRole("link", { name: "Product management" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "ML engineering" }).some((link) => link.getAttribute("href") === "/pow/ml-engineer")).toBe(true);
    expect(screen.getAllByText("Retail price optimization").length).toBeGreaterThan(0);
    expect(screen.getByText(/did not find a repository/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Prediction horizon"), "28");
    expect(screen.getByText(/28-day horizon/)).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Prediction target"), "revenue");
    expect(screen.getByText(/Price errors become target errors/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Model family"), "forest");
    await user.click(screen.getByRole("button", { name: "Run simulated stages" }));
    expect(screen.getByText(/does not fit that family/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Candidate function"), "worse");
    expect(screen.getByText(/Promotion decision: blocked/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Apply promotion decision" }));
    expect(screen.getByText(/sim-blend/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Inference scenario"), "timeout");
    expect(screen.getByText(/504/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Artifact unavailable" }));
    expect(screen.getByText(/Reliability alert/)).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Retrain trigger"), "distribution");
    expect(screen.getByText(/reject, production stays/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Data schema changes" }));
    expect(screen.getByText(/renames price to unitPrice/)).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Trade-off"), "cpu-gpu");
    expect(screen.getByRole("heading", { name: "CPU" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Run invariant checks" }));
    expect(screen.getAllByText("pass").length).toBeGreaterThan(0);

    expect(prerenderRoutes()).toContain("/pow/ml-engineer");
    expect(sitemapRoutes()).toContain("/pow/ml-engineer");
    expect(searchIndex.some((item) => item.href === "/pow/ml-engineer")).toBe(true);
    const markdown = renderPageMarkdown("/pow/ml-engineer") ?? "";
    expect(markdown).toContain("frontend simulation");
    expect(markdown).toContain("OpenAI-RLHF");
    expect(markdown).not.toContain("needsConfirmation");
  }, 30000);
});
