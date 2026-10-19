/**
 * EVALFORGE: the AI benchmark engineering proof-of-work page.
 *
 * The copy, synthetic tasks, stored responses, and preference cases for
 * /pow/benchmark-engineering. Rates in the Markdown twin come from
 * src/lib/benchmark/aggregate.ts, so the prose cannot drift from the rows.
 * No record here is a measured score from a named model. Contract evaluation
 * work stays on the experience page and is not given numbers.
 *
 * Connects to:
 * - src/pages/BenchmarkEngineeringPage.tsx and src/components/benchmark/*.
 * - src/lib/agent/markdown.ts (`renderBenchmarkBody`).
 * - src/content/searchIndex.ts and src/lib/publicRoutes.ts.
 * - src/__tests__/benchmark.test.ts and benchmarkPage.test.tsx.
 */
import { rateBy, scoreRun } from "../lib/benchmark/aggregate";
import type {
  DemoModel,
  DemonstrationOutput,
  EvaluationRun,
  PreferenceCase,
  RubricRow,
  StoredTest,
  TaskRecord,
} from "../lib/benchmark/types";

/** Route, title, and the sentences the hero is required to say. */
export const benchmarkPage = {
  path: "/pow/ai-benchmark",
  title: "AI benchmark engineering",
  description:
    "A personal demonstration of benchmark design, scoring, failure analysis, and statistical reading. EVALFORGE uses synthetic tasks and stored responses. It is not a published benchmark and it did not run models.",
  eyebrow: "AI evaluation engineering / proof of work",
  headline: "Don't just compare models. Understand why they fail.",
  support: "I build evaluation systems that turn model behavior into measurable, reproducible evidence.",
  projectName: "EVALFORGE",
  projectLine: "Reproducible LLM evaluation workbench",
  status: "Personal engineering demonstration. Not a published benchmark and not an evaluation platform.",
  disclaimer:
    "Synthetic demonstration results — not actual model benchmark scores. No model was called to produce this page.",
} as const;

/** Engineering principles, each with one example from this demonstration. */
export const benchmarkPrinciples: { title: string; explanation: string; example: string }[] = [
  {
    title: "A benchmark must measure a clearly defined capability.",
    explanation:
      "A score without a capability is a mixture. Mixing “writes code” and “follows a format” into one rank hides which one moved.",
    example:
      "Coding tasks ask whether stored unit tests pass. Reasoning tasks ask for an exact string or a rubric. The dashboard keeps those rates apart.",
  },
  {
    title: "Evaluation data must have documented provenance.",
    explanation:
      "A row needs a source label before it can be interpreted. Unlabeled rows cannot be separated from scraped or private benchmark material.",
    example:
      "Every task on this page is marked synthetic. Nothing is copied from HumanEval, MMLU, or a client task.",
  },
  {
    title: "Scoring rules must be explicit and testable.",
    explanation:
      "If two people cannot apply the rule and get the same flag, the rule is not finished. Deterministic checks come before a judge model.",
    example:
      "Exact match compares the trimmed response to one string. A unit-test case passes only when every stored test passed.",
  },
  {
    title: "Failed cases are often more informative than aggregate scores.",
    explanation:
      "A pass rate does not say whether the miss was a boundary, a format, or a missing requirement. The case does.",
    example:
      "Profile East’s fee answer contains the right number and still fails, because the task required the number alone.",
  },
  {
    title: "Results must be reproducible.",
    explanation:
      "Another person should be able to recompute the flag from the task, the response, and the rule, without a hidden prompt.",
    example:
      "The scorer is a pure function of the stored records. Refreshing the page does not call a model and does not change a result.",
  },
  {
    title: "Comparisons must account for uncertainty.",
    explanation:
      "Two different fractions on a handful of tasks can be noise. An interval says how wide the sample still is.",
    example:
      "Profile North and Profile East can share a pass count while failing different tasks. The paired view shows that.",
  },
  {
    title: "Model outputs should be inspected, not reduced blindly to a single score.",
    explanation:
      "An average across categories invites a winner. The categories may not agree, and a rubric point is not a test failure.",
    example:
      "This page has no overall leaderboard. Category rates and the case list are the result.",
  },
  {
    title: "Evaluation limitations must be documented.",
    explanation:
      "A dashboard does not make a sample scientific. The limits belong next to the number, not in a footnote nobody renders.",
    example:
      "Eight synthetic tasks, authored rubric points, no rater panel, and no training corpus. Those limits are part of the specification.",
  },
];

/** Lifecycle stages. The page simulates inspection of these stages. It does not run them. */
export const benchmarkStages: {
  id: string;
  title: string;
  inputs: string;
  processing: string;
  outputs: string;
  validation: string;
  failureModes: string;
  evidence: string;
}[] = [
  {
    id: "specify",
    title: "Task specification",
    inputs: "A capability, a user, and the decision the score is allowed to support.",
    processing: "Write the task family, the output contract, and what a pass means. Refuse a second capability hiding in the same item.",
    outputs: "A specification with categories, scoring methods, and known limits.",
    validation: "Someone else can apply the pass rule to a fresh response and agree.",
    failureModes: "The task measures format when the question was about reasoning, or the reverse.",
    evidence: "The specification text and one worked example per category.",
  },
  {
    id: "prepare",
    title: "Dataset preparation",
    inputs: "Original or licensed examples, or synthetic items written for the study.",
    processing: "Assign identifiers, versions, difficulty tags, and provenance. Do not import a benchmark whose license or terms forbid it.",
    outputs: "A versioned table of tasks.",
    validation: "Every row has the fields the scorer will read.",
    failureModes: "A copied item, a missing source, or a task that smuggles the answer into the prompt.",
    evidence: "The row, its provenance label, and its version.",
  },
  {
    id: "validate",
    title: "Dataset validation",
    inputs: "The task table and the schema.",
    processing: "Check required fields, duplicates, enums, label consistency, ambiguity, expected results, and scoring configuration.",
    outputs: "A finding list. Rejected rows stay visible with the reason.",
    validation: "Accepted rows produce no fail findings. A planted bad row does.",
    failureModes: "A check that always passes, or a rejection with no reason.",
    evidence: "The finding, the field that failed, and the rule that flagged it.",
  },
  {
    id: "configure",
    title: "Model configuration",
    inputs: "A named system, its settings, and the prompt wrapper.",
    processing: "Record the identifier, decoding settings, and whether tools are available. A missing setting is a different system.",
    outputs: "A configuration record attached to the run.",
    validation: "Two runs that claim the same system share the settings that change answers.",
    failureModes: "Comparing a tool-using run with a plain completion and calling them the same model.",
    evidence: "The configuration record. This demonstration has profiles, not model settings, because no model was called.",
  },
  {
    id: "execute",
    title: "Evaluation execution",
    inputs: "Accepted tasks, the configuration, and a runner that stores raw responses.",
    processing: "Generate or retrieve a response per task. Store the raw text before scoring.",
    outputs: "An immutable response log.",
    validation: "The log has one response per accepted task per system, or an explicit missing-response failure.",
    failureModes: "A retry that quietly replaces a bad sample, or a score stored without the response.",
    evidence: "The raw response and a run id. This page uses a stored fixture and labels execution as not run.",
  },
  {
    id: "score",
    title: "Scoring",
    inputs: "The response, the expected specification, and the method.",
    processing: "Apply exact match, stored unit-test outcomes, or the rubric. Keep pairwise judgments in their own table.",
    outputs: "A pass flag, a failure category, and the calculation.",
    validation: "Recomputing the rule from the stored fields reproduces the flag.",
    failureModes: "A judge model used where a deterministic check exists, or a rubric point with no criterion.",
    evidence: "The calculation line next to the case.",
  },
  {
    id: "analyze",
    title: "Statistical analysis",
    inputs: "The case table.",
    processing: "Compute counts, Wilson intervals, and a paired sign test on discordant tasks. Say how many comparisons were available.",
    outputs: "Rates with intervals, and a note on what the sample cannot support.",
    validation: "The numerator and denominator match the filtered rows.",
    failureModes: "A rank from eight items, or a p-value treated as a general result.",
    evidence: "The count, the interval, and the list of tasks inside it.",
  },
  {
    id: "failures",
    title: "Failure classification",
    inputs: "Cases the scorer did not pass.",
    processing: "Group by the scorer’s category, then read the response. Do not invent a category the rule did not emit.",
    outputs: "A tally and a set of cases worth changing the task or the system for.",
    validation: "Each tally count equals the number of matching rows.",
    failureModes: "Calling every miss a ‘hallucination’, or hiding format failures inside a generic incorrect bucket.",
    evidence: "The category, the calculation, and the response.",
  },
  {
    id: "report",
    title: "Reporting",
    inputs: "The specification, the dataset version, the run label, the rates, and the limits.",
    processing: "Publish the question, the rule, the sample, and what the sample is not. Link the aggregate to the rows.",
    outputs: "A report a reader can recompute.",
    validation: "A claim in the report is either tied to a row or marked as a limit.",
    failureModes: "A leaderboard with no tasks, or a demonstration labeled as a published benchmark.",
    evidence: "This page, its Markdown twin, and the fixture version on each task.",
  },
];

/** Benchmark specification shown in the interactive definition panel. */
export const benchmarkSpec = {
  name: "EVALFORGE demo-0.1",
  question:
    "When a coding task and a structured-reasoning task are scored with explicit rules, where do stored demonstration profiles disagree?",
  capability: "Functional correctness on small coding tasks, and conformance to a specified reasoning answer.",
  unit: "One task, one profile, one stored response.",
  outputFormat: "Coding tasks are treated as functions with named tests. Exact-match tasks require one string. Rubric tasks require a short explanation.",
  acceptance: "An accepted task has provenance, a version, a scoring method this page can recompute, and an expected specification.",
  limitations: [
    "Eight accepted tasks is a worked example, not a powered study.",
    "Unit-test outcomes are stored. The browser does not run candidate code.",
    "Rubric points are authored so the rule can be shown. They are not independent ratings.",
    "Exact match is the wrong rule for answers where wording is free.",
    "No contamination corpus is attached, so absence of contamination is not established.",
    "Demonstration profiles are not named models and were not sampled.",
    "A dashboard of these rows is not a scientific validation of the benchmark.",
  ],
  categories: {
    coding: {
      title: "Coding correctness",
      question: "Does the solution satisfy the functional requirements named in the tests?",
      rule: "Pass only if every named stored test passed. One failed test fails the task.",
      limitation: "Tests that miss a branch will pass a wrong function. The range task is the example: a happy-path test is not enough.",
    },
    reasoning: {
      title: "Structured reasoning",
      question: "Does the response satisfy a defined requirement or equal the specified result?",
      rule: "Exact match when the answer is a single defined string. A four-criterion rubric when the answer is an explanation.",
      limitation: "Exact match rejects a correct number wrapped in a sentence. The rubric is only as stable as the people applying it, and this page has no second rater.",
    },
  },
} as const;

/** Display order for the three stored profiles. */
export const benchmarkModels: DemoModel[] = [
  {
    id: "north",
    label: "Profile North",
    summary: "Stored demonstration profile. Not a model, and not sampled.",
  },
  {
    id: "east",
    label: "Profile East",
    summary: "Stored demonstration profile. Not a model, and not sampled.",
  },
  {
    id: "west",
    label: "Profile West",
    summary: "Stored demonstration profile. Not a model, and not sampled.",
  },
];

/** Builds stored test rows. A name in `failed` is a failure with that category. */
function storedTests(names: string[], failed: Record<string, string> = {}): StoredTest[] {
  return names.map((name) => ({
    name,
    passed: failed[name] === undefined,
    errorCategory: failed[name],
  }));
}

/** One authored rubric row. */
function rubric(criterion: string, score: number, note: string): RubricRow {
  return { criterion, score, max: 2, note };
}

/** Synthetic tasks written for this page, plus one row the inspector should reject. */
export const benchmarkTasks: TaskRecord[] = [
  {
    id: "code-sum-evens",
    category: "coding",
    declaredCapability: "coding",
    difficulty: "easy",
    prompt:
      "Write sum_evens(nums). Return the sum of even integers in the list. Skip values that are not integers. Return 0 for an empty list. Do not round, and do not include odd integers.",
    expectedSpec: "Tests: empty → 0; mixed integers; non-integers ignored.",
    provenance: "synthetic",
    validationStatus: "accepted",
    scoringMethod: "unit-test",
    version: "demo-0.1",
    testNames: ["empty", "mixed", "non-integers"],
  },
  {
    id: "code-slug",
    category: "coding",
    declaredCapability: "coding",
    difficulty: "easy",
    prompt:
      "Write slugify(text). Lowercase the string, remove punctuation, collapse any run of whitespace into one hyphen, and trim hyphens from both ends. An empty result is allowed when the input has no letters or digits.",
    expectedSpec: "Tests: spaces collapse; punctuation drops; surrounding hyphens trim.",
    provenance: "synthetic",
    validationStatus: "accepted",
    scoringMethod: "unit-test",
    version: "demo-0.1",
    testNames: ["spaces", "punctuation", "trim"],
  },
  {
    id: "code-range",
    category: "coding",
    declaredCapability: "coding",
    difficulty: "medium",
    prompt:
      "Write parse_span(text) for an inclusive integer span such as 2-5. Return the integers from the start through the end. Reject a reversed span and reject an empty string. Do not guess a missing bound.",
    expectedSpec: "Tests: 2-5 includes both ends; a reversed span is rejected; an empty string is rejected.",
    provenance: "synthetic",
    validationStatus: "accepted",
    scoringMethod: "unit-test",
    version: "demo-0.1",
    testNames: ["inclusive", "reversed", "empty"],
  },
  {
    id: "code-dedupe",
    category: "coding",
    declaredCapability: "coding",
    difficulty: "hard",
    prompt:
      "Write stable_unique(items). Keep the first occurrence of each value and preserve that order. Compare values with equality. An empty list returns an empty list. Do not sort the list.",
    expectedSpec: "Tests: first-seen order; later duplicates drop; empty input stays empty.",
    provenance: "synthetic",
    validationStatus: "accepted",
    scoringMethod: "unit-test",
    version: "demo-0.1",
    testNames: ["order", "dupes", "empty"],
  },
  {
    id: "reason-fee",
    category: "reasoning",
    declaredCapability: "reasoning",
    difficulty: "easy",
    prompt:
      "A processing fee is 2 percent of the amount, with a minimum of 5 and a maximum of 40. The amount is 1000. Reply with only the fee as a number. Do not include units or a sentence.",
    expectedSpec: "20",
    provenance: "synthetic",
    validationStatus: "accepted",
    scoringMethod: "exact-match",
    version: "demo-0.1",
    testNames: [],
  },
  {
    id: "reason-steps",
    category: "reasoning",
    declaredCapability: "reasoning",
    difficulty: "medium",
    prompt:
      "The rule: a result may be recorded only after validation has passed. Steps run in order. A validates the input. B transforms the validated input. C records the result from the original input and skips validation. D returns the record. Which single step breaks the rule? Reply with only the letter.",
    expectedSpec: "C",
    provenance: "synthetic",
    validationStatus: "accepted",
    scoringMethod: "exact-match",
    version: "demo-0.1",
    testNames: [],
  },
  {
    id: "reason-json",
    category: "reasoning",
    declaredCapability: "reasoning",
    difficulty: "easy",
    prompt:
      'Given the object {"id":"t-7","status":"held","amount":15}, report the value of status. Reply with only that value, with no quotes and no extra words.',
    expectedSpec: "held",
    provenance: "synthetic",
    validationStatus: "accepted",
    scoringMethod: "exact-match",
    version: "demo-0.1",
    testNames: [],
  },
  {
    id: "reason-rubric",
    category: "reasoning",
    declaredCapability: "reasoning",
    difficulty: "hard",
    prompt:
      "Explain why a test that only checks parse_span('2-5') is not enough to accept the function. Name at least two inputs the spec requires the function to reject, and do not treat a passing happy-path test as proof that invalid input is rejected.",
    expectedSpec:
      "Names a reversed span and an empty string, and does not treat the happy-path test as sufficient. Scored on Correctness, Completeness, Instruction adherence, and Evidence quality.",
    provenance: "synthetic",
    validationStatus: "accepted",
    scoringMethod: "rubric",
    version: "demo-0.1",
    testNames: [],
  },
  {
    id: "reject-ambiguous",
    category: "reasoning",
    declaredCapability: "preference",
    difficulty: "medium",
    prompt: "Which answer is better?",
    expectedSpec: "",
    provenance: "synthetic",
    validationStatus: "rejected",
    scoringMethod: "pairwise",
    version: "demo-0.1",
    testNames: [],
    rejectionReason:
      "The prompt does not say better at what, there is no expected specification, the category disagrees with the declared capability, and pairwise comparison is not an accuracy rule.",
  },
];

/** Stored responses. The pass flag is computed later by the scorer. */
export const benchmarkOutputs: DemonstrationOutput[] = [
  {
    taskId: "code-sum-evens",
    modelId: "north",
    response: "def sum_evens(nums): return sum(n for n in nums if isinstance(n, int) and n % 2 == 0)",
    tests: storedTests(["empty", "mixed", "non-integers"]),
    explanation: "Stored tests for the empty list, mixed integers, and non-integers all pass.",
  },
  {
    taskId: "code-slug",
    modelId: "north",
    response: "def slugify(text): collapse whitespace, drop punctuation, trim hyphens.",
    tests: storedTests(["spaces", "punctuation", "trim"]),
    explanation: "Stored tests for spaces, punctuation, and trimming all pass.",
  },
  {
    taskId: "code-range",
    modelId: "north",
    response: "def parse_span(text): split on '-' and fill the inclusive range, including when the start is greater.",
    tests: storedTests(["inclusive", "reversed", "empty"], { reversed: "boundary" }),
    explanation: "The reversed span is accepted. The specification says to reject it.",
  },
  {
    taskId: "code-dedupe",
    modelId: "north",
    response: "def stable_unique(items): return sorted(set(items))",
    tests: storedTests(["order", "dupes", "empty"], { order: "stability" }),
    explanation: "Sorting changes first-seen order. The order test fails.",
  },
  {
    taskId: "reason-fee",
    modelId: "north",
    response: "20",
    explanation: "Two percent of 1000 is 20, inside the minimum and the maximum. The response is only that number.",
  },
  {
    taskId: "reason-steps",
    modelId: "north",
    response: "C",
    explanation: "Step C records a result without validation. The response is the letter the task asked for.",
  },
  {
    taskId: "reason-json",
    modelId: "north",
    response: "held",
    explanation: "The status field is held, and the response is only that value.",
  },
  {
    taskId: "reason-rubric",
    modelId: "north",
    response:
      "parse_span('2-5') does not exercise a reversed span or an empty string. A passing happy-path test is not evidence that those inputs are rejected.",
    rubric: [
      rubric("Correctness", 2, "Names both rejected inputs and the limit of the happy path."),
      rubric("Completeness", 2, "Covers reversed and empty."),
      rubric("Instruction adherence", 2, "Does not claim the single test is enough."),
      rubric("Evidence quality", 1, "Cites the spec’s rejects, without quoting a test log."),
    ],
    explanation: "Authored rubric points clear the pass rule. They are not a second rater.",
  },
  {
    taskId: "code-sum-evens",
    modelId: "east",
    response: "def sum_evens(nums): return sum(n for n in nums if isinstance(n, int) and n % 2 == 0)",
    tests: storedTests(["empty", "mixed", "non-integers"]),
    explanation: "Stored tests pass.",
  },
  {
    taskId: "code-slug",
    modelId: "east",
    response: "def slugify(text): lowercase, strip punctuation, collapse whitespace, trim hyphens.",
    tests: storedTests(["spaces", "punctuation", "trim"]),
    explanation: "Stored tests pass.",
  },
  {
    taskId: "code-range",
    modelId: "east",
    response: "def parse_span(text): reject empty and reversed spans; otherwise return the inclusive integers.",
    tests: storedTests(["inclusive", "reversed", "empty"]),
    explanation: "Stored tests pass, including both rejects.",
  },
  {
    taskId: "code-dedupe",
    modelId: "east",
    response: "def stable_unique(items): keep the first time each value appears.",
    tests: storedTests(["order", "dupes", "empty"]),
    explanation: "Stored tests pass, including order.",
  },
  {
    taskId: "reason-fee",
    modelId: "east",
    response: "The fee is 20.",
    explanation: "The number is right and the form is wrong. Exact match does not award partial credit.",
  },
  {
    taskId: "reason-steps",
    modelId: "east",
    response: "C",
    explanation: "The letter matches the step that skips validation.",
  },
  {
    taskId: "reason-json",
    modelId: "east",
    response: "held",
    explanation: "The status value matches.",
  },
  {
    taskId: "reason-rubric",
    modelId: "east",
    response: "The happy path is the main case. Edge cases can be added later if users complain.",
    rubric: [
      rubric("Correctness", 1, "Allows that more cases might exist, without stating which input fails."),
      rubric("Completeness", 0, "Does not name a reversed span or an empty string."),
      rubric("Instruction adherence", 1, "Discusses the test, and still postpones the required rejects."),
      rubric("Evidence quality", 1, "Appeals to later user complaints rather than the spec."),
    ],
    explanation: "Correctness is non-zero, but the total stays under the pass ratio because the required rejects are missing.",
  },
  {
    taskId: "code-sum-evens",
    modelId: "west",
    response: "def sum_evens(nums): return sum(n for n in nums if n % 2 == 0)",
    tests: storedTests(["empty", "mixed", "non-integers"], { "non-integers": "wrong-result" }),
    explanation: "Non-integers are not skipped. That stored test fails.",
  },
  {
    taskId: "code-slug",
    modelId: "west",
    response: "def slugify(text): lowercase, strip punctuation, collapse whitespace, trim hyphens.",
    tests: storedTests(["spaces", "punctuation", "trim"]),
    explanation: "Stored tests pass.",
  },
  {
    taskId: "code-range",
    modelId: "west",
    response: "def parse_span(text): if text is empty, return [0]; otherwise fill the range.",
    tests: storedTests(["inclusive", "reversed", "empty"], { empty: "validation" }),
    explanation: "An empty string becomes a span instead of a rejection.",
  },
  {
    taskId: "code-dedupe",
    modelId: "west",
    response: "def stable_unique(items): keep the first time each value appears.",
    tests: storedTests(["order", "dupes", "empty"]),
    explanation: "Stored tests pass.",
  },
  {
    taskId: "reason-fee",
    modelId: "west",
    response: "20",
    explanation: "The response is the specified number.",
  },
  {
    taskId: "reason-steps",
    modelId: "west",
    response: "",
    explanation: "Nothing was returned. The task required a single letter.",
  },
  {
    taskId: "reason-json",
    modelId: "west",
    response: "hold",
    explanation: "hold is not the status value held. Near-miss spelling is still a wrong result.",
  },
  {
    taskId: "reason-rubric",
    modelId: "west",
    response: "The function is correct because parse_span('2-5') already passes, which proves invalid input is handled.",
    rubric: [
      rubric("Correctness", 0, "Claims the happy-path test proves invalid input is handled."),
      rubric("Completeness", 2, "Mentions the happy path, and still asserts a proof the spec does not allow."),
      rubric("Instruction adherence", 2, "Talks about the named test."),
      rubric("Evidence quality", 0, "The cited pass does not support the claim."),
    ],
    explanation: "Correctness and evidence are both zero: the response treats one passing test as proof.",
  },
];

/** Preference cases. They are judgments about a criterion, not accuracy rows. */
export const benchmarkPreferences: PreferenceCase[] = [
  {
    id: "pref-rejects",
    taskId: "reason-rubric",
    criterion:
      "Prefer the response that names a concrete input the spec rejects and does not treat the happy-path test as sufficient.",
    responseA:
      "A test of parse_span('2-5') misses a reversed span such as 5-2. Passing that one test does not show the reject path.",
    responseB: "Both answers look careful. I would ship the one with the cleaner wording.",
    winner: "A",
    rationale: "A names a reversed span and limits the happy-path test. B changes the criterion to wording.",
    adjudication: "single-rater",
    limitation: "One person’s preference is not ground truth. A second rater could weight wording more highly, and that disagreement would need its own review.",
  },
  {
    id: "pref-tie",
    taskId: "reason-rubric",
    criterion: "Prefer the response that names both a reversed span and an empty string.",
    responseA: "The happy-path test misses a reversed span. I would add that case.",
    responseB: "The happy-path test misses an empty string. I would add that case.",
    winner: "tie",
    rationale: "Each response names one required reject and omits the other. The criterion asked for both.",
    adjudication: "adjudicated-tie",
    limitation: "A tie is a result. Forcing a winner would invent a preference the criterion does not support.",
  },
];

/**
 * Rows added only when the inspector’s audit control is on.
 * One duplicates an accepted id. One breaks the schema on purpose.
 */
export function auditFixtureTasks(): TaskRecord[] {
  const source = benchmarkTasks[0];
  return [
    { ...source, testNames: [...source.testNames] },
    {
      id: "bad-schema",
      category: "both",
      declaredCapability: "both",
      difficulty: "impossible",
      prompt:
        "This row exists so the inspector can show a schema failure. It is not an accepted task, it is not scored, and it is a synthetic audit fixture.",
      expectedSpec: "n/a",
      provenance: "unknown",
      validationStatus: "maybe",
      scoringMethod: "llm-judge",
      version: "",
      testNames: [],
    },
  ];
}

/**
 * The run the page renders. `executed` stays false until a later phase
 * replaces this fixture with a response from an evaluation service.
 */
export function demonstrationRun(): EvaluationRun {
  return {
    id: "evalforge-demo-0.1",
    source: "demonstration-fixture",
    executed: false,
    disclaimer: benchmarkPage.disclaimer,
    models: benchmarkModels,
    tasks: benchmarkTasks,
    outputs: benchmarkOutputs,
    preferences: benchmarkPreferences,
  };
}

/** Work that can be pointed at, kept separate from the demonstration scores. */
export const benchmarkPriorWork: { title: string; href?: string; body: string }[] = [
  {
    title: "Contract evaluation, as published on this site",
    href: "/experience#focdot-sde-ai",
    body: "FoCDoT, April 2024–August 2025: review of model outputs against criteria, and analysis of coding and STEM tasks. Outlier, from August 2025: contract evaluation, dataset quality, and Python or JavaScript task prompting. This site does not publish agreement statistics, sample sizes, or benchmark tables from that work.",
  },
  {
    title: "OpenAI-RLHF repository",
    href: "https://github.com/ayushrai-hub/OpenAI-RLHF",
    body: "A public repository in my GitHub account. Its README describes an archive of coding-evaluation tasks and A/B completion pairs, and it says the repository does not contain an RLHF, PPO, or DPO training pipeline. I am not publishing a score from those tasks here.",
  },
  {
    title: "RLHF-tasks repository",
    href: "https://github.com/ayushrai-hub/RLHF-tasks",
    body: "A public repository whose README describes a task library with an instruction, an environment, a solution, and tests. This page does not republish those tasks or any model run from that repository.",
  },
  {
    title: "What I inspected and did not turn into a claim",
    body: "The public adaptive-rag repository is a retrieval chatbot, not an evaluation harness, and it is not listed as my work on this site. RevenueRoles, AGENYRA, and SpiderWeb are separate products. None of them supplies the numbers on this page.",
  },
];

/** Markdown twin. Counts are computed from the same scorer as the page. */
export function renderBenchmarkBody(): string {
  const run = demonstrationRun();
  const cases = scoreRun(
    run.tasks,
    run.outputs,
    run.models.map((model) => model.id),
  );
  const rates = rateBy(cases, "all");
  const lines = [
    benchmarkPage.status,
    "",
    benchmarkPage.support,
    "",
    benchmarkPage.disclaimer,
    "",
    `Project: ${benchmarkPage.projectName} — ${benchmarkPage.projectLine}.`,
    "",
    "## What this page is",
    "",
    "EVALFORGE is a personal demonstration of an evaluation workflow: specification, dataset checks, scoring, failure categories, and uncertainty. The tasks are synthetic. The responses are stored. The pass flags are recomputed from those records.",
    "",
    "## Demonstration pass counts",
    "",
    ...rates.map((rate) => {
      const model = run.models.find((item) => item.id === rate.modelId);
      return `- ${model?.label ?? rate.modelId}: ${rate.successes}/${rate.n}`;
    }),
    "",
    "These counts are not a leaderboard and not a measurement of a named model.",
    "",
    "## Prior work, kept separate",
    "",
    ...benchmarkPriorWork.map((item) => `- ${item.title}. ${item.body}`),
    "",
    "## Not in this phase",
    "",
    "No evaluation job runner, no model API, and no execution of submitted code. A later phase can replace the fixture with an EvaluationRun from a service without changing the page’s record shape.",
  ];
  return lines.join("\n");
}
