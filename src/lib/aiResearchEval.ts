/**
 * Deterministic scoring for the AI research proof-of-work demonstration.
 *
 * The functions compare prepared strings, schemas, and document ids. They do not call a model,
 * sample a distribution, or estimate a confidence interval. A null result means the metric does
 * not apply to that row, not that the row scored zero.
 *
 * Connects to:
 * - src/content/aiResearchPow.ts (the prepared Harbor Meter rows and metric prose).
 * - src/components/pow/ResearchNotebook.tsx (the inspectors that render these counts).
 * - src/__tests__/aiResearchEval.test.ts.
 */

/** Prepared evidence-coverage label. `unscored` means the protocol does not apply a label. */
export type EvidenceLabel = "supported" | "partial" | "unsupported" | "unscored";

/** Task label derived from exact match and the prepared evidence label. */
export type TaskLabel = "correct" | "incorrect" | "partial" | "unscored";

/** How retrieval changes exact-match correctness relative to the baseline. */
export type ExactOutcome = "helps" | "hurts" | "no_effect" | "not_comparable";

/** Data-quality flags stored on a demonstration row. */
export type DataIssue =
  | "duplicate"
  | "missing_reference"
  | "ambiguous_reference"
  | "missing_evidence"
  | "irrelevant_passage"
  | "contradictory_evidence";

/** Failure categories a visitor can filter. These are analyst labels, not a classifier output. */
export type FailureCategory =
  | "missing_evidence"
  | "irrelevant_retrieval"
  | "contradictory_evidence"
  | "unsupported_claim"
  | "incorrect_reference"
  | "ambiguous_question"
  | "incomplete_answer"
  | "overly_cautious"
  | "formatting_failure"
  | "evaluation_ambiguity";

/** One observed failure, kept separate from the hypothesized cause. */
export interface FailureNote {
  category: FailureCategory;
  condition: "baseline" | "retrieval";
  observed: string;
  diagnosis: string;
  followUp: string;
}

/** A passage bundled with a row. `relevant` is the demonstration's relevance label. */
export interface EvidencePassage {
  id: string;
  text: string;
  relevant: boolean;
}

/** One prepared question, with both conditions stored beside it. */
export interface ResearchExample {
  id: string;
  question: string;
  referenceAnswer: string | null;
  evidence: readonly EvidencePassage[] | null;
  baselineOutput: string;
  retrievalOutput: string;
  baselineStructured: Readonly<Record<string, string>> | null;
  retrievalStructured: Readonly<Record<string, string>> | null;
  requiredFields: readonly string[];
  relevantDocIds: readonly string[];
  retrievedDocIds: readonly string[];
  baselineEvidence: EvidenceLabel;
  retrievalEvidence: EvidenceLabel;
  issues: readonly DataIssue[];
  failures: readonly FailureNote[];
}

/** Which prepared condition a control is inspecting. */
export type ConditionId = "baseline" | "retrieval";

/** Issues that remove a row from the exact-match denominator. */
const EXACT_EXCLUSIONS: readonly DataIssue[] = [
  "duplicate",
  "missing_reference",
  "ambiguous_reference",
];

/**
 * Lowercases, trims, collapses whitespace, and drops trailing periods.
 * Used only for exact match, so punctuation still matters in the middle of a string.
 */
export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/\.+$/g, "");
}

/**
 * True when the normalized output equals the normalized reference.
 * Returns null when the reference is missing, because there is nothing to match.
 */
export function exactMatch(output: string, reference: string | null): boolean | null {
  if (reference === null || reference.trim() === "") return null;
  return normalizeAnswer(output) === normalizeAnswer(reference);
}

/**
 * True when every required field is a non-empty string.
 * Returns null when the protocol requires no fields.
 */
export function schemaValid(
  value: Readonly<Record<string, string>> | null,
  requiredFields: readonly string[],
): boolean | null {
  if (requiredFields.length === 0) return null;
  if (!value) return false;
  return requiredFields.every((field) => {
    const item = value[field];
    return typeof item === "string" && item.trim().length > 0;
  });
}

/**
 * Recall of the relevant id set inside the retrieved id set.
 * Returns null when no relevant ids were defined, so an empty relevance set is not scored as zero.
 */
export function retrievalRecall(
  relevant: readonly string[],
  retrieved: readonly string[],
): number | null {
  if (relevant.length === 0) return null;
  const got = new Set(retrieved);
  const hits = relevant.filter((id) => got.has(id)).length;
  return hits / relevant.length;
}

/**
 * The stored string for one condition.
 * This is the demonstration's stand-in for generation: it reads a field and does not infer text.
 */
export function preparedOutput(example: ResearchExample, condition: ConditionId): string {
  return condition === "baseline" ? example.baselineOutput : example.retrievalOutput;
}

/** True when the row has a reference and is not flagged as a duplicate, missing, or ambiguous key. */
export function countsInExactMatch(example: ResearchExample): boolean {
  if (example.referenceAnswer === null || example.referenceAnswer.trim() === "") return false;
  return !example.issues.some((issue) => EXACT_EXCLUSIONS.includes(issue));
}

/**
 * Retrieval's effect on exact match.
 * `not_comparable` means the row is outside the exact-match denominator.
 */
export function exactOutcome(example: ResearchExample): ExactOutcome {
  if (!countsInExactMatch(example)) return "not_comparable";
  const baseline = exactMatch(example.baselineOutput, example.referenceAnswer);
  const retrieval = exactMatch(example.retrievalOutput, example.referenceAnswer);
  if (baseline === null || retrieval === null) return "not_comparable";
  if (retrieval && !baseline) return "helps";
  if (!retrieval && baseline) return "hurts";
  return "no_effect";
}

/**
 * Combines exact match with the prepared evidence label.
 * An exact string that the evidence label calls unsupported is task-incorrect.
 * A partial evidence label stays partial even when the string matches.
 */
export function taskLabel(exact: boolean | null, evidence: EvidenceLabel): TaskLabel {
  if (exact === null) return "unscored";
  if (evidence === "partial") return "partial";
  if (exact && (evidence === "supported" || evidence === "unscored")) return "correct";
  return "incorrect";
}

/** Per-row scores derived from the stored fields. */
export interface ExampleScore {
  id: string;
  scorable: boolean;
  baselineExact: boolean | null;
  retrievalExact: boolean | null;
  baselineSchema: boolean | null;
  retrievalSchema: boolean | null;
  baselineTask: TaskLabel;
  retrievalTask: TaskLabel;
  recall: number | null;
  outcome: ExactOutcome;
}

/** Scores one row with the exact-match, schema, task, and recall procedures. */
export function scoreExample(example: ResearchExample): ExampleScore {
  const baselineExact = exactMatch(example.baselineOutput, example.referenceAnswer);
  const retrievalExact = exactMatch(example.retrievalOutput, example.referenceAnswer);
  const scorable = countsInExactMatch(example);
  return {
    id: example.id,
    scorable,
    baselineExact: scorable ? baselineExact : null,
    retrievalExact: scorable ? retrievalExact : null,
    baselineSchema: schemaValid(example.baselineStructured, example.requiredFields),
    retrievalSchema: schemaValid(example.retrievalStructured, example.requiredFields),
    baselineTask: taskLabel(scorable ? baselineExact : null, example.baselineEvidence),
    retrievalTask: taskLabel(scorable ? retrievalExact : null, example.retrievalEvidence),
    recall: example.issues.includes("duplicate")
      ? null
      : retrievalRecall(example.relevantDocIds, example.retrievedDocIds),
    outcome: exactOutcome(example),
  };
}

/** Counts of a four-way label. */
export interface LabelCounts {
  supported: number;
  partial: number;
  unsupported: number;
  unscored: number;
}

/** Counts of the derived task label. */
export interface TaskCounts {
  correct: number;
  incorrect: number;
  partial: number;
  unscored: number;
}

/** Aggregate counts for the prepared dataset. Ratios are left to the caller. */
export interface ExperimentSummary {
  rows: number;
  scorable: number;
  excluded: number;
  baselineExactCorrect: number;
  retrievalExactCorrect: number;
  helps: number;
  hurts: number;
  noEffect: number;
  notComparable: number;
  schemaApplicable: number;
  baselineSchemaValid: number;
  retrievalSchemaValid: number;
  emptyOutputs: { baseline: number; retrieval: number };
  evidence: { baseline: LabelCounts; retrieval: LabelCounts };
  task: { baseline: TaskCounts; retrieval: TaskCounts };
  recallHits: number;
  recallRelevant: number;
}

/** An empty label tally. */
function emptyLabels(): LabelCounts {
  return { supported: 0, partial: 0, unsupported: 0, unscored: 0 };
}

/** An empty task tally. */
function emptyTasks(): TaskCounts {
  return { correct: 0, incorrect: 0, partial: 0, unscored: 0 };
}

/** Adds one prepared evidence label to a tally. */
function addLabel(counts: LabelCounts, label: EvidenceLabel): void {
  counts[label] += 1;
}

/** Adds one derived task label to a tally. */
function addTask(counts: TaskCounts, label: TaskLabel): void {
  counts[label] += 1;
}

/**
 * Summarizes every row.
 * Exact-match and evidence tallies use the scorable subset. Recall is a micro-average over
 * non-duplicate rows that define a relevance set: hits divided by relevant ids, not a mean of ratios.
 */
export function summarizeExperiment(examples: readonly ResearchExample[]): ExperimentSummary {
  const summary: ExperimentSummary = {
    rows: examples.length,
    scorable: 0,
    excluded: 0,
    baselineExactCorrect: 0,
    retrievalExactCorrect: 0,
    helps: 0,
    hurts: 0,
    noEffect: 0,
    notComparable: 0,
    schemaApplicable: 0,
    baselineSchemaValid: 0,
    retrievalSchemaValid: 0,
    emptyOutputs: { baseline: 0, retrieval: 0 },
    evidence: { baseline: emptyLabels(), retrieval: emptyLabels() },
    task: { baseline: emptyTasks(), retrieval: emptyTasks() },
    recallHits: 0,
    recallRelevant: 0,
  };

  for (const example of examples) {
    const score = scoreExample(example);
    if (example.baselineOutput.trim() === "") summary.emptyOutputs.baseline += 1;
    if (example.retrievalOutput.trim() === "") summary.emptyOutputs.retrieval += 1;
    if (score.baselineSchema !== null) {
      summary.schemaApplicable += 1;
      if (score.baselineSchema) summary.baselineSchemaValid += 1;
      if (score.retrievalSchema) summary.retrievalSchemaValid += 1;
    }
    if (!example.issues.includes("duplicate") && example.relevantDocIds.length > 0) {
      const got = new Set(example.retrievedDocIds);
      summary.recallRelevant += example.relevantDocIds.length;
      summary.recallHits += example.relevantDocIds.filter((id) => got.has(id)).length;
    }
    if (!score.scorable) {
      summary.excluded += 1;
      summary.notComparable += 1;
      continue;
    }
    summary.scorable += 1;
    if (score.baselineExact) summary.baselineExactCorrect += 1;
    if (score.retrievalExact) summary.retrievalExactCorrect += 1;
    if (score.outcome === "helps") summary.helps += 1;
    else if (score.outcome === "hurts") summary.hurts += 1;
    else summary.noEffect += 1;
    addLabel(summary.evidence.baseline, example.baselineEvidence);
    addLabel(summary.evidence.retrieval, example.retrievalEvidence);
    addTask(summary.task.baseline, score.baselineTask);
    addTask(summary.task.retrieval, score.retrievalTask);
  }

  return summary;
}

/** Which aggregate a results control opens. */
export type ResultSlice =
  | "scorable"
  | "helps"
  | "hurts"
  | "no_effect"
  | "not_comparable"
  | "baseline_exact"
  | "retrieval_exact"
  | "schema_gap";

/** Rows behind one aggregate. Schema gap is the applicable rows whose baseline schema fails. */
export function examplesInSlice(
  examples: readonly ResearchExample[],
  slice: ResultSlice,
): ResearchExample[] {
  return examples.filter((example) => {
    const score = scoreExample(example);
    if (slice === "scorable") return score.scorable;
    if (slice === "helps") return score.outcome === "helps";
    if (slice === "hurts") return score.outcome === "hurts";
    if (slice === "no_effect") return score.outcome === "no_effect";
    if (slice === "not_comparable") return score.outcome === "not_comparable";
    if (slice === "baseline_exact") return score.baselineExact === true;
    if (slice === "retrieval_exact") return score.retrievalExact === true;
    return score.baselineSchema === false;
  });
}

/**
 * Ids whose normalized question repeats an earlier row.
 * The first copy is not listed. This is the check behind the duplicate flag.
 */
export function duplicateIds(examples: readonly ResearchExample[]): string[] {
  const seen = new Map<string, string>();
  const duplicates: string[] = [];
  for (const example of examples) {
    const key = normalizeAnswer(example.question);
    if (seen.has(key)) duplicates.push(example.id);
    else seen.set(key, example.id);
  }
  return duplicates;
}

/** A metadata field that can differ between two demonstration configurations. */
export interface ConfigField {
  id: "dataset" | "retrieval" | "evaluationProtocol" | "model" | "prompt";
  label: string;
  value: string;
}

/** One demonstration configuration. `implemented` is false when no outputs exist for it. */
export interface DemoConfig {
  id: string;
  label: string;
  implemented: boolean;
  fields: readonly ConfigField[];
}

/** One field whose values differ. */
export interface ConfigDifference {
  id: ConfigField["id"];
  label: string;
  left: string;
  right: string;
}

/**
 * Fields whose values are not identical.
 * Comparison is exact string equality of the stored metadata, not a semantic diff.
 */
export function configDifferences(left: DemoConfig, right: DemoConfig): ConfigDifference[] {
  return left.fields.flatMap((field) => {
    const other = right.fields.find((item) => item.id === field.id);
    const rightValue = other?.value ?? "";
    if (field.value === rightValue) return [];
    return [{ id: field.id, label: field.label, left: field.value, right: rightValue }];
  });
}

/**
 * Metadata differences that block reading the contrast as "only retrieval changed."
 * A retrieval-field difference is the intended contrast. Any other difference is a blocker.
 * An unimplemented side blocks the reading even when the metadata matches.
 */
export function causalBlockers(
  differences: readonly ConfigDifference[],
  leftImplemented: boolean,
  rightImplemented: boolean,
): string[] {
  const blockers = differences
    .filter((difference) => difference.id !== "retrieval")
    .map((difference) => difference.label);
  if (!leftImplemented || !rightImplemented) {
    blockers.push("One configuration has no prepared outputs");
  }
  return blockers;
}

/** A variable in the experiment-design inspector. */
export interface DesignVariable {
  id: string;
  name: string;
  role: "independent" | "dependent" | "controlled" | "confounder";
  detail: string;
  ifChanged: string;
}

/**
 * Warnings for variables the visitor marks as changed.
 * An empty selection means the written protocol still holds, including its prepared-data limit.
 */
export function changeWarnings(
  selectedIds: readonly string[],
  variables: readonly DesignVariable[],
): string[] {
  return variables.filter((variable) => selectedIds.includes(variable.id)).map((variable) => variable.ifChanged);
}
