/**
 * Tests the founding-engineer workbench helpers.
 *
 * Covers empty scope, dependency gaps, checklist completion, ignored feedback, and an unknown
 * architecture id. Weights stay illustrative.
 *
 * Connects to:
 * - src/lib/foundingWorkbench.ts
 * - src/content/foundingEngineer.ts
 */
import { describe, expect, it } from "vitest";
import {
  architectureOptions,
  feedbackNotes,
  releaseChecklist,
  scopeFeatures,
  workbenchTasks,
} from "../content/foundingEngineer";
import {
  architectureById,
  assessScope,
  checklistProgress,
  planFeedback,
  tasksForScope,
  type FeatureBand,
} from "../lib/foundingWorkbench";

/** Scope, tasks, release marks, and feedback selection. */
describe("founding workbench", () => {
  it("starts from the default bands as a narrow scope with dependencies inside the required set", () => {
    const scope = assessScope(scopeFeatures, {});
    expect(scope.load).toBe("narrow");
    expect(scope.blocked).toEqual([]);
    expect(scope.required).toContain("CSV account import");
    expect(scope.summary).toMatch(/narrow first version/);
    expect(assessScope(scopeFeatures, { auth: "required" }).load).toBe("workable");
    expect(assessScope(scopeFeatures, { auth: "required" }).summary).toMatch(/still workable/);
  });

  it("flags a required feature whose dependency was cut, and a scope with nothing required", () => {
    const blocked = assessScope(scopeFeatures, { "csv-import": "cut", icp: "required" });
    expect(blocked.blocked).toEqual([
      { feature: "ICP fields the operator can edit", missing: "CSV account import" },
    ]);
    expect(blocked.summary).toMatch(/depend on work/);

    const cutAll: Record<string, FeatureBand> = {};
    for (const feature of scopeFeatures) cutAll[feature.id] = "cut";
    const empty = assessScope(scopeFeatures, cutAll);
    expect(empty.required).toEqual([]);
    expect(empty.summary).toMatch(/does not produce a useful version/);
  });

  it("calls a large required set heavy and moves dependent tasks off the critical path", () => {
    const allRequired: Record<string, FeatureBand> = {};
    for (const feature of scopeFeatures) allRequired[feature.id] = "required";
    expect(assessScope(scopeFeatures, allRequired).load).toBe("heavy");

    const tasks = tasksForScope(workbenchTasks, scopeFeatures, { auth: "required", crm: "cut" });
    expect(tasks.critical.some((task) => task.id === "auth-task")).toBe(true);
    expect(tasks.optional.some((task) => task.id === "crm-task")).toBe(true);
  });

  it("tracks checklist groups and warns when an ignore-note is selected", () => {
    expect(checklistProgress(releaseChecklist, {}).ready).toBe(false);
    const all = Object.fromEntries(releaseChecklist.map((item) => [item.id, true]));
    const done = checklistProgress(releaseChecklist, all);
    expect(done.ready).toBe(true);
    expect(done.openGroups).toEqual([]);

    const plan = planFeedback(feedbackNotes, ["columns", "theme"]);
    expect(plan.now.map((note) => note.id)).toEqual(["columns"]);
    expect(plan.warning).toMatch(/ignore/);
    expect(planFeedback(feedbackNotes, []).warning).toBeNull();
  });

  it("falls back to the first architecture when the id is unknown", () => {
    expect(architectureById(architectureOptions, "missing").id).toBe(architectureOptions[0].id);
    expect(architectureById(architectureOptions, "microservices").name).toMatch(/services/i);
  });
});
