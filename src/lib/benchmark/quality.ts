/**
 * Dataset checks for the EVALFORGE inspector.
 *
 * The checks look for missing fields, duplicates, broken enums, inconsistent
 * labels, ambiguous prompts, missing expected results, and scoring rules that
 * cannot be applied. The contamination note is informational: this page has
 * no training corpus to compare against, so the check cannot show that a task
 * is absent from any model’s training data.
 *
 * Connects to:
 * - src/lib/benchmark/types.ts.
 * - src/components/benchmark/DatasetInspector.tsx.
 * - src/__tests__/benchmark.test.ts.
 */
import type { TaskRecord } from "./types";

/** One inspector finding. `info` is not a reason to reject a task by itself. */
export interface QualityFinding {
  check: string;
  severity: "fail" | "info";
  taskId?: string;
  message: string;
}

const CATEGORIES = new Set(["coding", "reasoning"]);
const DIFFICULTIES = new Set(["easy", "medium", "hard"]);
const STATUSES = new Set(["accepted", "rejected"]);
const METHODS = new Set(["exact-match", "unit-test", "rubric", "pairwise"]);
const PROVENANCE = new Set(["synthetic", "original-demonstration"]);

/** Required strings. `expectedSpec` may be empty; a separate check reports that. */
const REQUIRED: (keyof TaskRecord)[] = [
  "id",
  "category",
  "declaredCapability",
  "difficulty",
  "prompt",
  "provenance",
  "validationStatus",
  "scoringMethod",
  "version",
];

/** True when the prompt is too short to specify a task, or asks for a preference with no criterion. */
export function promptIsAmbiguous(task: TaskRecord): boolean {
  const prompt = task.prompt.trim();
  if (prompt.length < 80) return true;
  return /which answer is better/i.test(prompt);
}

/**
 * Runs every dataset check. Accepted and rejected rows are both inspected.
 * A rejected row is still listed so the page can show why it was rejected.
 * Findings are ordered by check name, then task id.
 */
export function inspectDataset(tasks: TaskRecord[]): QualityFinding[] {
  const findings: QualityFinding[] = [];
  const seen = new Map<string, number>();

  for (const task of tasks) {
    const id = task.id || "(missing id)";
    seen.set(task.id, (seen.get(task.id) ?? 0) + 1);

    for (const field of REQUIRED) {
      const value = task[field];
      if (typeof value !== "string" || value.trim() === "") {
        findings.push({
          check: "missing-field",
          severity: "fail",
          taskId: id,
          message: `${id} is missing ${field}.`,
        });
      }
    }

    if (!CATEGORIES.has(task.category) || !DIFFICULTIES.has(task.difficulty) || !STATUSES.has(task.validationStatus) || !METHODS.has(task.scoringMethod) || !PROVENANCE.has(task.provenance)) {
      findings.push({
        check: "invalid-schema",
        severity: "fail",
        taskId: id,
        message: `${id} has a category, difficulty, status, scoring method, or provenance outside the demonstration schema.`,
      });
    }

    if (task.declaredCapability.trim() !== "" && task.declaredCapability !== task.category) {
      findings.push({
        check: "inconsistent-label",
        severity: "fail",
        taskId: id,
        message: `${id} declares “${task.declaredCapability}” but its category is “${task.category}”.`,
      });
    }

    if (promptIsAmbiguous(task)) {
      findings.push({
        check: "ambiguous-instruction",
        severity: "fail",
        taskId: id,
        message: `${id} is too short to grade, or asks which answer is better without a criterion.`,
      });
    }

    if (task.expectedSpec.trim() === "") {
      findings.push({
        check: "missing-expected",
        severity: "fail",
        taskId: id,
        message: `${id} has no expected output or evaluation specification.`,
      });
    }

    const codingMismatch = task.category === "coding" && task.scoringMethod !== "unit-test";
    const reasoningMismatch =
      task.category === "reasoning" &&
      task.scoringMethod !== "exact-match" &&
      task.scoringMethod !== "rubric";
    const thinTests = task.scoringMethod === "unit-test" && task.testNames.length < 2;
    if (codingMismatch || reasoningMismatch || thinTests || task.scoringMethod === "pairwise") {
      findings.push({
        check: "scoring-config",
        severity: "fail",
        taskId: id,
        message: `${id} uses “${task.scoringMethod}”, which this benchmark cannot apply as an accuracy rule for that category.`,
      });
    }
  }

  for (const [id, count] of seen) {
    if (id && count > 1) {
      findings.push({
        check: "duplicate-task",
        severity: "fail",
        taskId: id,
        message: `${id} appears ${count} times. A duplicate would be counted twice in a pass rate.`,
      });
    }
  }

  findings.push({
    check: "contamination-risk",
    severity: "info",
    message:
      "No training corpus is attached. This check cannot show that a task is absent from a model’s training data. Contamination checks depend on the reference data and the method, and a clean result would still not prove the dataset is uncontaminated.",
  });

  return findings.sort((a, b) => a.check.localeCompare(b.check) || (a.taskId ?? "").localeCompare(b.taskId ?? ""));
}

/** Fail findings only. The contamination note is excluded. */
export function failingFindings(findings: QualityFinding[]): QualityFinding[] {
  return findings.filter((finding) => finding.severity === "fail");
}
