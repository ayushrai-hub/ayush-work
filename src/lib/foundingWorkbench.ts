/**
 * Deterministic helpers for the founding-engineer workbench.
 *
 * Scope, checklist, and feedback helpers read the visitor's local selections and return
 * consequences. Weights and load labels are illustrative. Nothing here calls a network or
 * claims a measured estimate.
 *
 * Connects to:
 * - src/content/foundingEngineer.ts supplies the feature, task, checklist, and feedback records.
 * - src/components/pow/founding/BuildLog.tsx and the other founding inspectors call these helpers.
 * - src/__tests__/foundingWorkbench.test.ts.
 */
import type {
  ArchitectureOption,
  ChecklistItem,
  FeedbackNote,
  ScopeFeature,
  WorkbenchTask,
} from "../content/foundingEngineer";

/** Visitor classification for one backlog item. */
export type FeatureBand = "required" | "defer" | "cut";

/** Illustrative load of the selected required scope. Not a measured estimate. */
export type ScopeLoad = "narrow" | "workable" | "heavy";

/** Result of classifying the synthetic backlog. */
export interface ScopeAssessment {
  required: string[];
  deferred: string[];
  cut: string[];
  /** Sum of illustrative weights on required items. */
  weight: number;
  load: ScopeLoad;
  /** Required items whose dependencies are not also required. */
  blocked: { feature: string; missing: string }[];
  summary: string;
}

/** Checklist progress for the release panel. */
export interface ChecklistProgress {
  done: number;
  total: number;
  ready: boolean;
  openGroups: string[];
}

/** How a selected feedback set should be read. */
export interface FeedbackPlan {
  now: FeedbackNote[];
  parked: FeedbackNote[];
  warning: string | null;
}

/**
 * Classify each feature, flag dependency gaps, and describe the illustrative load.
 * Unknown ids in `bands` are ignored. A missing id uses the feature's default band.
 */
export function assessScope(
  features: readonly ScopeFeature[],
  bands: Readonly<Record<string, FeatureBand>>,
): ScopeAssessment {
  const bandOf = (feature: ScopeFeature): FeatureBand => bands[feature.id] ?? feature.defaultBand;
  const required = features.filter((feature) => bandOf(feature) === "required");
  const deferred = features.filter((feature) => bandOf(feature) === "defer");
  const cut = features.filter((feature) => bandOf(feature) === "cut");
  const requiredIds = new Set(required.map((feature) => feature.id));
  const nameById = new Map(features.map((feature) => [feature.id, feature.name]));
  const blocked = required.flatMap((feature) =>
    feature.dependsOn
      .filter((dependency) => !requiredIds.has(dependency))
      .map((dependency) => ({ feature: feature.name, missing: nameById.get(dependency) ?? dependency })),
  );
  const weight = required.reduce((sum, feature) => sum + feature.weight, 0);
  const load: ScopeLoad = weight <= 9 ? "narrow" : weight <= 16 ? "workable" : "heavy";
  const summary = scopeSummary(load, blocked.length, required.length);
  return {
    required: required.map((feature) => feature.name),
    deferred: deferred.map((feature) => feature.name),
    cut: cut.map((feature) => feature.name),
    weight,
    load,
    blocked,
    summary,
  };
}

/**
 * One sentence for the scope panel.
 * The wording stays qualitative because the weights are illustrative.
 */
function scopeSummary(load: ScopeLoad, blocked: number, requiredCount: number): string {
  if (requiredCount === 0) {
    return "Nothing is required, so this pass does not produce a useful version.";
  }
  const loadText =
    load === "narrow"
      ? "The required set is a narrow first version."
      : load === "workable"
        ? "The required set is still workable for one engineer, with less room for surprises."
        : "The required set is heavy for a first version. Something in it should move out.";
  if (blocked === 0) return `${loadText} Required items have their dependencies inside the required set.`;
  return `${loadText} ${blocked} required item${blocked === 1 ? "" : "s"} depend on work that is not required.`;
}

/**
 * Tasks whose feature dependencies sit in the required set.
 * Tasks with an empty `requires` list stay on the critical path.
 */
export function tasksForScope(
  tasks: readonly WorkbenchTask[],
  features: readonly ScopeFeature[],
  bands: Readonly<Record<string, FeatureBand>>,
): { critical: WorkbenchTask[]; optional: WorkbenchTask[] } {
  const assessment = assessScope(features, bands);
  const requiredNames = new Set(assessment.required);
  const nameById = new Map(features.map((feature) => [feature.id, feature.name]));
  const critical: WorkbenchTask[] = [];
  const optional: WorkbenchTask[] = [];
  for (const task of tasks) {
    const needed = task.requires.map((id) => nameById.get(id) ?? id);
    const onPath = needed.every((name) => requiredNames.has(name));
    if (task.requires.length === 0 || onPath) critical.push(task);
    else optional.push(task);
  }
  return { critical, optional };
}

/**
 * Count checked release items and list groups that still have an open item.
 * An id that is not in `items` does not change the total.
 */
export function checklistProgress(
  items: readonly ChecklistItem[],
  checked: Readonly<Record<string, boolean>>,
): ChecklistProgress {
  const done = items.filter((item) => checked[item.id]).length;
  const groups = [...new Set(items.map((item) => item.group))];
  const openGroups = groups.filter((group) =>
    items.some((item) => item.group === group && !checked[item.id]),
  );
  return { done, total: items.length, ready: done === items.length && items.length > 0, openGroups };
}

/**
 * Split selected feedback into act-now and parked notes.
 * Selecting a note whose suggested band is "ignore" adds a warning. Empty selection is valid.
 */
export function planFeedback(
  notes: readonly FeedbackNote[],
  selectedIds: readonly string[],
): FeedbackPlan {
  const selected = new Set(selectedIds);
  const chosen = notes.filter((note) => selected.has(note.id));
  const now = chosen.filter((note) => note.suggested === "now");
  const parked = chosen.filter((note) => note.suggested !== "now");
  const ignored = chosen.filter((note) => note.suggested === "ignore");
  const warning =
    ignored.length > 0
      ? "At least one selected note is labeled ignore. Shipping it spends the next cycle on a weak signal."
      : null;
  return { now, parked, warning };
}

/**
 * Find an architecture option by id.
 * An unknown id returns the first option so the panel always has a record to show.
 */
export function architectureById(
  options: readonly ArchitectureOption[],
  id: string,
): ArchitectureOption {
  return options.find((option) => option.id === id) ?? options[0];
}
