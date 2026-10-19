/**
 * AI research engineering proof of work: the prepared Harbor Meter experiment.
 *
 * The records are fictional. Scores on the page are computed by src/lib/aiResearchEval.ts from
 * these rows. Nothing here is a model run, a publication, or a claim that retrieval helps in general.
 *
 * Connects to:
 * - src/pages/AiResearchEngineeringPowPage.tsx and src/components/pow/ResearchNotebook.tsx.
 * - src/lib/agent/markdown.ts (`renderAiResearchBody` for /pow/ai-research-engineering.md).
 * - src/content/searchIndex.ts, src/lib/publicRoutes.ts, and src/content/powPages.ts.
 */
import type {
  DataIssue,
  DemoConfig,
  DesignVariable,
  EvidenceLabel,
  FailureCategory,
  ResearchExample,
} from "../lib/aiResearchEval";
import { summarizeExperiment } from "../lib/aiResearchEval";

/** Canonical route. `/pow/ai-research` redirects here. */
export const AI_RESEARCH_PATH = "/pow/ai-research-engineering";

/** Search and Markdown description. States the demonstration limit in the first screenful. */
export const aiResearchDescription =
  "A personal research-engineering notebook. The Harbor Meter retrieval comparison uses prepared fictional rows and deterministic checks. It is not a model run and not a published result.";

/** Page title used by the h1's document title, not the headline sentence. */
export const aiResearchTitle = "AI research engineering";

/** Hero sentences the page is required to show. */
export const aiResearchHero = {
  eyebrow: "AI research engineering / proof of work",
  headline: "Build the experiment. Test the hypothesis. Follow the evidence.",
  support:
    "I engineer reproducible AI experiments that connect research questions, implementations, evaluation, and real-world system behavior.",
  positioning:
    "I turn AI research questions into reproducible experiments and working systems.",
  supporting:
    "I work at the intersection of AI research, model evaluation, and engineering—translating hypotheses into experiments, implementing methods, and investigating what the evidence actually supports.",
} as const;

/** Why the working name LABNOTE is not used. Labnote is an existing product at labnote.co. */
export const workbenchName = {
  title: "Experiment notebook",
  note: "The working name LABNOTE was not used. Labnote (labnote.co) is an existing research-data product.",
} as const;

/** Dataset identity. The version is a label for these rows, not a registry entry. */
export const DATASET_VERSION = "harbor-meter-demo-0.1";

/** Evaluation protocol label for the manifest. */
export const PROTOCOL_VERSION = "exact-match-v1 + prepared-evidence-labels-v1";

/** Experiment id for the illustrative manifest. */
export const EXPERIMENT_ID = "demo-retrieval-coverage-v1";

/** One passage, shared by the duplicate row and the calibration row. */
const CALIBRATION_LOG = {
  id: "log-hm4",
  text: "Lab log, row HM-4: last calibration 12 March 2024 by N. Iyer.",
  relevant: true,
} as const;

/**
 * Prepared Harbor Meter rows.
 * Harbor Meter Co. is fictional. Retrieval does not win every row.
 */
export const researchExamples: readonly ResearchExample[] = [
  {
    id: "HM-01",
    question: "When was the HM-4 caliper last calibrated, according to the lab log?",
    referenceAnswer: "12 March 2024",
    evidence: [CALIBRATION_LOG],
    baselineOutput: "The HM-4 was calibrated in January 2023.",
    retrievalOutput: "12 March 2024.",
    baselineStructured: null,
    retrievalStructured: null,
    requiredFields: [],
    relevantDocIds: ["log-hm4"],
    retrievedDocIds: ["log-hm4"],
    baselineEvidence: "unsupported",
    retrievalEvidence: "supported",
    issues: [],
    failures: [
      {
        category: "unsupported_claim",
        condition: "baseline",
        observed: "The baseline names January 2023. That date is not in the lab log.",
        diagnosis:
          "A fluent prepared answer can still be unsupported. This page does not identify a cause beyond the two strings.",
        followUp:
          "Score the same item with the log hidden and with the log shown, under the same reference. That run is not stored here.",
      },
    ],
  },
  {
    id: "HM-02",
    question: "A tray holds 8 sensors and all 8 are removed. How many sensors remain?",
    referenceAnswer: "0",
    evidence: [{ id: "ship-note", text: "Shipping note: crates left the dock on Tuesday.", relevant: false }],
    baselineOutput: "0",
    retrievalOutput: "0",
    baselineStructured: null,
    retrievalStructured: null,
    requiredFields: [],
    relevantDocIds: [],
    retrievedDocIds: ["ship-note"],
    baselineEvidence: "unscored",
    retrievalEvidence: "unscored",
    issues: ["irrelevant_passage"],
    failures: [
      {
        category: "irrelevant_retrieval",
        condition: "retrieval",
        observed: "The retrieved passage does not mention sensors. Both outputs say 0.",
        diagnosis:
          "The passage is irrelevant to the arithmetic. Whether either answer used the question alone is not established; both strings were prepared.",
        followUp: "Drop the passage and compare the stored outputs. That comparison is not a separate measured run.",
      },
    ],
  },
  {
    id: "HM-03",
    question: "What is the maximum operating temperature of the HM-4, in the product sheet?",
    referenceAnswer: "40 °C",
    evidence: [
      { id: "sheet-hm4", text: "Product sheet, HM-4: maximum operating temperature 40 °C.", relevant: true },
      { id: "sheet-hm9", text: "Product sheet, HM-9: maximum operating temperature 70 °C.", relevant: false },
    ],
    baselineOutput: "40 °C",
    retrievalOutput: "70 °C",
    baselineStructured: null,
    retrievalStructured: null,
    requiredFields: [],
    relevantDocIds: ["sheet-hm4"],
    retrievedDocIds: ["sheet-hm9"],
    baselineEvidence: "unscored",
    retrievalEvidence: "unsupported",
    issues: ["irrelevant_passage"],
    failures: [
      {
        category: "irrelevant_retrieval",
        condition: "retrieval",
        observed: "The retrieval output matches the HM-9 sheet. That sheet is the only one marked retrieved.",
        diagnosis:
          "A plausible cause is that the retrieved passage describes a different model. The page illustrates that pattern with prepared text. It does not prove a retriever failed.",
        followUp: "Hold the HM-9 sheet out and force the HM-4 sheet into the context, then rescore.",
      },
    ],
  },
  {
    id: "HM-04",
    question: "Who approved the HM-4 batch release?",
    referenceAnswer: "P. Shah",
    evidence: null,
    baselineOutput: "P. Shah",
    retrievalOutput: "I cannot answer because no evidence was supplied.",
    baselineStructured: null,
    retrievalStructured: null,
    requiredFields: [],
    relevantDocIds: [],
    retrievedDocIds: [],
    baselineEvidence: "unsupported",
    retrievalEvidence: "unscored",
    issues: ["missing_evidence"],
    failures: [
      {
        category: "missing_evidence",
        condition: "baseline",
        observed: "The evidence field is null. The baseline still matches the reference string.",
        diagnosis:
          "Exact match cannot see a missing evidence field. Calling the baseline correct would reward an unsupported string.",
        followUp: "Exclude null evidence fields from any coverage score and report them as missing data.",
      },
    ],
  },
  {
    id: "HM-05",
    question: "When was the HM-4 caliper last calibrated, according to the lab log?",
    referenceAnswer: "12 March 2024",
    evidence: [CALIBRATION_LOG],
    baselineOutput: "The HM-4 was calibrated in January 2023.",
    retrievalOutput: "12 March 2024.",
    baselineStructured: null,
    retrievalStructured: null,
    requiredFields: [],
    relevantDocIds: ["log-hm4"],
    retrievedDocIds: ["log-hm4"],
    baselineEvidence: "unsupported",
    retrievalEvidence: "supported",
    issues: ["duplicate"],
    failures: [
      {
        category: "evaluation_ambiguity",
        condition: "baseline",
        observed: "The question text repeats HM-01. Counting both rows would weight that item twice.",
        diagnosis: "The row is a duplicate of HM-01. That is a property of the table, not a model behavior.",
        followUp: "Keep one copy and record the dropped id before aggregating.",
      },
    ],
  },
  {
    id: "HM-06",
    question: "Is the HM-4 better than the HM-9?",
    referenceAnswer: null,
    evidence: [
      { id: "sheet-hm4-again", text: "Product sheet, HM-4: maximum operating temperature 40 °C.", relevant: false },
    ],
    baselineOutput: "Yes, the HM-4 is better.",
    retrievalOutput: "The notes do not define better.",
    baselineStructured: null,
    retrievalStructured: null,
    requiredFields: [],
    relevantDocIds: [],
    retrievedDocIds: ["sheet-hm4-again"],
    baselineEvidence: "unscored",
    retrievalEvidence: "unscored",
    issues: ["missing_reference"],
    failures: [
      {
        category: "ambiguous_question",
        condition: "baseline",
        observed: "There is no reference answer, so neither output can be marked correct.",
        diagnosis: "The question asks for a preference the notes do not define.",
        followUp: "Replace it with one measurable property, or drop the item from the score.",
      },
    ],
  },
  {
    id: "HM-07",
    question: "What color is the HM-4 housing?",
    referenceAnswer: "grey or gray",
    evidence: [{ id: "color-note", text: "Inspection note: housing color recorded as grey.", relevant: true }],
    baselineOutput: "gray",
    retrievalOutput: "The housing is slate.",
    baselineStructured: null,
    retrievalStructured: null,
    requiredFields: [],
    relevantDocIds: ["color-note"],
    retrievedDocIds: ["color-note"],
    baselineEvidence: "partial",
    retrievalEvidence: "unsupported",
    issues: ["ambiguous_reference"],
    failures: [
      {
        category: "evaluation_ambiguity",
        condition: "baseline",
        observed: "The reference lists two spellings. Exact match against the whole string fails for both outputs.",
        diagnosis:
          "The reference is not one canonical string. A full-string scorer will reject a spelling the reference itself allows.",
        followUp: "Store a set of acceptable answers and compare membership with exact match.",
      },
      {
        category: "ambiguous_question",
        condition: "retrieval",
        observed: "The retrieval output says slate. The inspection note says grey.",
        diagnosis: "Slate is not the word in the note. Whether a reader would accept it is not measured here.",
        followUp: "Decide an acceptable-answer set before the next comparison.",
      },
    ],
  },
  {
    id: "HM-08",
    question: "How many HM-4 units shipped in Q1?",
    referenceAnswer: "120",
    evidence: [
      { id: "ship-log", text: "Shipping log: 120 HM-4 units left the warehouse in Q1.", relevant: true },
      { id: "finance-note", text: "Finance note: 118 HM-4 units after two returns.", relevant: true },
    ],
    baselineOutput: "120",
    retrievalOutput: "118",
    baselineStructured: null,
    retrievalStructured: null,
    requiredFields: [],
    relevantDocIds: ["ship-log", "finance-note"],
    retrievedDocIds: ["ship-log", "finance-note"],
    baselineEvidence: "supported",
    retrievalEvidence: "supported",
    issues: ["contradictory_evidence"],
    failures: [
      {
        category: "contradictory_evidence",
        condition: "retrieval",
        observed: "The passages disagree. The reference follows the shipping log. The retrieval output follows the finance note.",
        diagnosis:
          "Both passages are marked relevant. Which source should win is not settled. The disagreement is in the data, not a computed significance test.",
        followUp: "Write a source-priority rule, keep both passages, and rescore.",
      },
    ],
  },
  {
    id: "HM-09",
    question: "Which two HM-4 safety checks does the checklist name?",
    referenceAnswer: "insulation test and torque check",
    evidence: [{ id: "checks", text: "Checklist: insulation test and torque check.", relevant: true }],
    baselineOutput: "insulation test and torque check",
    retrievalOutput: "insulation test",
    baselineStructured: null,
    retrievalStructured: null,
    requiredFields: [],
    relevantDocIds: ["checks"],
    retrievedDocIds: ["checks"],
    baselineEvidence: "supported",
    retrievalEvidence: "partial",
    issues: [],
    failures: [
      {
        category: "incomplete_answer",
        condition: "retrieval",
        observed: "The retrieval output names one of the two checks written in the checklist.",
        diagnosis: "The string is missing a part the evidence contains. Why it stopped is not known; the string was prepared.",
        followUp: "Score each required part separately so a partial answer is not only a failed exact match.",
      },
    ],
  },
  {
    id: "HM-10",
    question: "What is the HM-4 serial prefix?",
    referenceAnswer: "HM4",
    evidence: [{ id: "serial", text: "Serial numbers begin with HM4.", relevant: true }],
    baselineOutput: "HM4",
    retrievalOutput: "The evidence is insufficient to answer.",
    baselineStructured: null,
    retrievalStructured: null,
    requiredFields: [],
    relevantDocIds: ["serial"],
    retrievedDocIds: ["serial"],
    baselineEvidence: "supported",
    retrievalEvidence: "unscored",
    issues: [],
    failures: [
      {
        category: "overly_cautious",
        condition: "retrieval",
        observed: "The passage states the prefix. The retrieval output refuses.",
        diagnosis:
          "A possible cause is a refusal rule stricter than the evidence. This page did not run that rule.",
        followUp: "Ask for the prefix with the same passage and a rubric that allows a short quote.",
      },
    ],
  },
  {
    id: "HM-11",
    question: "Report the HM-4 calibration as the date and the technician.",
    referenceAnswer: "12 March 2024, N. Iyer",
    evidence: [CALIBRATION_LOG],
    baselineOutput: "12 March 2024",
    retrievalOutput: "12 March 2024, N. Iyer",
    baselineStructured: { date: "12 March 2024" },
    retrievalStructured: { date: "12 March 2024", technician: "N. Iyer" },
    requiredFields: ["date", "technician"],
    relevantDocIds: ["log-hm4"],
    retrievedDocIds: ["log-hm4"],
    baselineEvidence: "partial",
    retrievalEvidence: "supported",
    issues: [],
    failures: [
      {
        category: "formatting_failure",
        condition: "baseline",
        observed: "The baseline record has no technician field. The retrieval record has both required fields.",
        diagnosis:
          "The baseline string omits the technician, so the schema check fails. That does not show that a parser was executed.",
        followUp: "Require the schema for both conditions and reject free text that cannot fill it.",
      },
    ],
  },
  {
    id: "HM-12",
    question: "What is the HM-4 warranty?",
    referenceAnswer: "24 months",
    evidence: [{ id: "warranty", text: "HM-4 warranty is 24 months.", relevant: true }],
    baselineOutput: "12 months",
    retrievalOutput: "24 months, and it includes on-site repair.",
    baselineStructured: null,
    retrievalStructured: null,
    requiredFields: [],
    relevantDocIds: ["warranty"],
    retrievedDocIds: ["warranty"],
    baselineEvidence: "unsupported",
    retrievalEvidence: "partial",
    issues: [],
    failures: [
      {
        category: "unsupported_claim",
        condition: "retrieval",
        observed: "The retrieval output adds on-site repair. The passage does not say that.",
        diagnosis:
          "Extra text can make a partly supported answer fail a strict exact match. The repair clause has no source in the passage.",
        followUp: "Split the output into claims and score each claim against the passage.",
      },
      {
        category: "unsupported_claim",
        condition: "baseline",
        observed: "The baseline says 12 months. The passage says 24 months.",
        diagnosis: "The baseline string contradicts the only passage. No further cause is established.",
        followUp: "Keep this item as a regression case if a later system is scored on the same rows.",
      },
      {
        category: "evaluation_ambiguity",
        condition: "retrieval",
        observed: "Exact match fails the retrieval output even though it includes the reference span.",
        diagnosis: "Strict equality treats a supported span plus an extra clause as wholly wrong.",
        followUp: "Report exact match and claim-level coverage side by side before choosing a release gate.",
      },
    ],
  },
];

/** Issues that take a row out of the exact-match denominator. */
export const exclusionIssues: readonly DataIssue[] = [
  "duplicate",
  "missing_reference",
  "ambiguous_reference",
];

/** Human labels for data-quality flags. */
export const issueLabels: Record<DataIssue, string> = {
  duplicate: "Duplicate question",
  missing_reference: "No reference answer",
  ambiguous_reference: "Ambiguous reference",
  missing_evidence: "Missing evidence field",
  irrelevant_passage: "Passage does not support the answer",
  contradictory_evidence: "Contradictory evidence",
};

/** Human labels for failure categories, in filter order. */
export const failureCategoryLabels: Record<FailureCategory, string> = {
  missing_evidence: "Missing evidence",
  irrelevant_retrieval: "Irrelevant retrieval",
  contradictory_evidence: "Contradictory evidence",
  unsupported_claim: "Unsupported claim",
  incorrect_reference: "Incorrect reference answer",
  ambiguous_question: "Ambiguous question",
  incomplete_answer: "Incomplete answer",
  overly_cautious: "Overly cautious answer",
  formatting_failure: "Formatting failure",
  evaluation_ambiguity: "Evaluation ambiguity",
};

/** Research question, hypothesis, and the variables the design inspector lists. */
export const experimentSpec = {
  question:
    "Does adding a fixed bundle of retrieved evidence change exact-match accuracy and prepared evidence labels on this question set?",
  hypothesis:
    "Under a fixed evaluation set and comparable generation settings, adding relevant retrieved evidence may improve evidence-supported answer accuracy.",
  nullHypothesis:
    "On this set, the retrieval condition does not increase the exact-match rate relative to the baseline.",
  status:
    "The hypothesis is not assumed true. The prepared rows are a methodology demonstration. They are not a test of the hypothesis on real model outputs.",
  baseline:
    "Baseline outputs are prepared strings stored on each row. No passage is treated as an input to a generator, because no generator ran.",
  retrievalCondition:
    "The retrieval condition is a second prepared string, written as if the row's evidence field had been supplied. The passages are local data, not the output of a live retriever.",
  stopping:
    "The demonstration stops when every stored row has been scored by the local functions. There is no training loop and no early-stopping rule.",
} as const;

/** Variables a visitor can mark as changed. */
export const designVariables: readonly DesignVariable[] = [
  {
    id: "retrieval",
    name: "Retrieved evidence",
    role: "independent",
    detail: "The intended contrast: passages absent in the baseline field, present as stored text in the retrieval field.",
    ifChanged: "This is the contrast the question names. It still does not identify a cause, because the outputs were prepared.",
  },
  {
    id: "questions",
    name: "Evaluation questions",
    role: "controlled",
    detail: "The same twelve questions are scored for both conditions.",
    ifChanged: "Changing the questions between conditions mixes a dataset effect with a retrieval effect.",
  },
  {
    id: "references",
    name: "Reference answers",
    role: "controlled",
    detail: "Each row has one reference, including the rows whose reference is missing or ambiguous.",
    ifChanged: "A new reference changes what exact match can call correct.",
  },
  {
    id: "protocol",
    name: "Scoring definitions",
    role: "controlled",
    detail: "Exact match, schema validity, retrieval recall, and the prepared evidence labels use the procedures in the metric inspector.",
    ifChanged: "A different scorer can reverse the ranking without any change in the outputs.",
  },
  {
    id: "model",
    name: "Model version",
    role: "controlled",
    detail: "No model identifier applies. Both columns are prepared text.",
    ifChanged: "Introducing a model on only one side makes the contrast about the model as well as retrieval.",
  },
  {
    id: "prompt",
    name: "Prompt and generation settings",
    role: "controlled",
    detail: "No prompt version and no sampling settings were used.",
    ifChanged: "A prompt change is a second treatment. It should be its own factor, not folded into retrieval.",
  },
  {
    id: "corpus",
    name: "Retrieval corpus",
    role: "controlled",
    detail: "The only corpus is the evidence field on each row.",
    ifChanged: "A different corpus can change recall and the answers for reasons other than the decision to retrieve.",
  },
  {
    id: "source-priority",
    name: "Source priority under contradiction",
    role: "confounder",
    detail: "HM-08 has two relevant passages that disagree. The reference follows one of them.",
    ifChanged: "If the preferred source changes, the reference changes, and the exact-match result moves with it.",
  },
  {
    id: "label-protocol",
    name: "Evidence-label protocol",
    role: "confounder",
    detail: "Supported, partial, unsupported, and unscored are prepared labels, not a judge model.",
    ifChanged: "A different annotator, or a different written rule, can relabel the same strings.",
  },
];

/** Shared metadata for the two conditions that have outputs. */
function implementedFields(retrieval: string): DemoConfig["fields"] {
  return [
    { id: "dataset", label: "Dataset", value: DATASET_VERSION },
    { id: "retrieval", label: "Retrieval", value: retrieval },
    { id: "evaluationProtocol", label: "Evaluation protocol", value: PROTOCOL_VERSION },
    { id: "model", label: "Model", value: "No model identifier. Outputs are prepared text." },
    { id: "prompt", label: "Prompt", value: "No prompt version. Outputs are prepared text." },
  ];
}

/** Configurations the comparison control can select. The third has no measured outputs. */
export const demoConfigs: readonly DemoConfig[] = [
  {
    id: "baseline",
    label: "Baseline, no retrieval",
    implemented: true,
    fields: implementedFields("No passages attached to the prepared baseline strings."),
  },
  {
    id: "retrieval",
    label: "Fixed evidence bundle",
    implemented: true,
    fields: implementedFields("Each retrieval string is paired with that row's evidence field. No reranker."),
  },
  {
    id: "rerank",
    label: "Retrieval with reranking",
    implemented: false,
    fields: [
      { id: "dataset", label: "Dataset", value: DATASET_VERSION },
      {
        id: "retrieval",
        label: "Retrieval",
        value: "Proposed: retrieve, then rerank. No passages or outputs are stored for this condition.",
      },
      { id: "evaluationProtocol", label: "Evaluation protocol", value: PROTOCOL_VERSION },
      { id: "model", label: "Model", value: "Not run." },
      { id: "prompt", label: "Prompt", value: "No prompt version. This condition was not run." },
    ],
  },
];

/** Proposed ablations that this page does not score. */
export const proposedAblations: readonly { title: string; note: string }[] = [
  {
    title: "Retrieval without reranking versus retrieval with reranking",
    note: "Only the fixed evidence bundle has prepared outputs. A reranked condition is not measured.",
  },
  {
    title: "Different retrieval depths",
    note: "The rows do not store top-k lists at more than one depth.",
  },
  {
    title: "Different evidence-selection policies",
    note: "There is one stored retrieved-id list per row. A second policy would need its own list and its own outputs.",
  },
];

/** Metric prose. Live metrics are the ones aiResearchEval.ts computes. */
export const metricGuides: readonly {
  id: string;
  name: string;
  live: boolean;
  definition: string;
  procedure: string;
  inputs: string;
  interpretation: string;
  failureModes: string;
}[] = [
  {
    id: "exact",
    name: "Exact match",
    live: true,
    definition: "The normalized output equals the normalized reference.",
    procedure:
      "Trim, lowercase, collapse whitespace, and drop trailing periods. Compare the strings. Rows with a duplicate, a missing reference, or an ambiguous reference are excluded from the rate.",
    inputs: "Output string and a single reference string.",
    interpretation: "Useful when one canonical string is the right answer. A match is not evidence that a passage supports the string.",
    failureModes: "Extra true words fail the match. A wrong string that copies the reference still passes. Spelling variants fail.",
  },
  {
    id: "schema",
    name: "Structured-output accuracy",
    live: true,
    definition: "Every required field is present and non-empty.",
    procedure: "If the row lists required fields, check the stored object. Rows with an empty field list are not in the denominator.",
    inputs: "A string map and the required field names.",
    interpretation: "Checks shape, not truth. A filled field can still be the wrong value.",
    failureModes: "Only HM-11 declares a schema, so the rate is one row. A free-text answer that contains the facts still fails if the object is missing a key.",
  },
  {
    id: "evidence",
    name: "Evidence coverage",
    live: true,
    definition: "A prepared label says whether the output's claims are supported by the row's passages.",
    procedure:
      "Count the stored labels supported, partial, unsupported, and unscored on the exact-match denominator. The labels were written with the rows. No judge model assigns them.",
    inputs: "The output, the passages, and the annotation protocol version on the manifest.",
    interpretation: "A supported label means the demonstration marked the claim as grounded. It is not an inter-annotator study.",
    failureModes: "One annotator's label is not agreement. Unscored is not a failure. Partial is not half a point in the exact-match rate.",
  },
  {
    id: "recall",
    name: "Retrieval recall",
    live: true,
    definition: "The share of relevant document ids that appear in the retrieved id list.",
    procedure:
      "On non-duplicate rows with a non-empty relevance set, add the size of the intersection to the numerator and the size of the relevance set to the denominator.",
    inputs: "A defined relevance set and the retrieved ids.",
    interpretation: "High recall does not mean the answer is right. HM-03 can miss the relevant sheet and still be a recall of zero while other rows are perfect.",
    failureModes: "An empty relevance set is excluded, not scored as zero. A wrong relevance label makes the recall look strong or weak for the wrong reason.",
  },
  {
    id: "task",
    name: "Task-specific correctness",
    live: true,
    definition: "Exact match, overridden when the prepared evidence label is partial or unsupported.",
    procedure:
      "If the row is outside the exact-match denominator, the task label is unscored. Partial evidence stays partial. An exact match marked unsupported becomes incorrect.",
    inputs: "The exact-match boolean and the prepared evidence label.",
    interpretation: "This is one written rule for this notebook. Another task would need another rule.",
    failureModes: "The rule can disagree with exact match on purpose, as on HM-04, where the string matches and the evidence label does not.",
  },
  {
    id: "preference",
    name: "Human preference",
    live: false,
    definition: "A person compares two outputs under a named rubric and records which one satisfies it.",
    procedure:
      "The preference panel stores the visitor's choice in component state. It does not train a reward model and it does not update the retrieval scores.",
    inputs: "Two candidates, a rubric version, and one decision.",
    interpretation: "A single local choice is an illustration of the record shape, not a preference dataset.",
    failureModes: "People disagree. A rubric that rewards fluency will collect fluency. Pairwise preference is a weak substitute for a failing test when a test exists.",
  },
];

/** Distinctions the philosophy section walks through. */
export const philosophyPairs: readonly { left: string; right: string; note: string }[] = [
  {
    left: "Hypothesis",
    right: "Conclusion",
    note: "A hypothesis names what would count against it. A conclusion is what the scored evidence supports after the protocol is applied. This page states a hypothesis and does not treat the prepared rows as a conclusion about retrieval.",
  },
  {
    left: "Experiment",
    right: "Demonstration",
    note: "An experiment runs the method under the written controls. This page is a demonstration: the outputs were written in advance and then scored locally.",
  },
  {
    left: "Benchmark score",
    right: "Reliable measurement",
    note: "A score is the output of a procedure. It becomes a measurement when the dataset, the scorer, and the uncertainty are fit for the decision. Twelve fictional rows are not that measurement.",
  },
  {
    left: "Correlation",
    right: "Causation",
    note: "Two columns can differ because retrieval changed, or because the strings were authored to differ. A causal reading needs the other factors held fixed and the outputs actually generated.",
  },
  {
    left: "Baseline",
    right: "Meaningful comparison",
    note: "A baseline that is easy to beat inflates the method. The baseline here is the no-evidence prepared string, not a weak straw system and not a production model.",
  },
  {
    left: "Reproducible result",
    right: "Anecdote",
    note: "A reproducible result names the data version, the protocol, and the code that recomputes it. One striking example, including a row where retrieval looks clever, is an anecdote.",
  },
  {
    left: "Research prototype",
    right: "Production system",
    note: "A prototype can answer a question on a fixed set. A production system has to survive new inputs, cost, failure, and monitoring. This notebook is the first of those, and only as a front-end simulation.",
  },
];

/** Practices the philosophy section says matter, with the limit on statistical testing. */
export const practiceNotes: readonly { title: string; note: string }[] = [
  { title: "Explicit hypotheses", note: "Write the claim so a result can fail it." },
  { title: "Appropriate baselines", note: "The comparison should be the real alternative, not an easy one." },
  { title: "Controlled variables", note: "Name what stays fixed so a difference has somewhere to belong." },
  { title: "Dataset quality", note: "Duplicates, missing fields, and bad references move the score before the method does." },
  { title: "Repeated measurements", note: "Use them when the procedure is noisy. A deterministic string compare does not need a resample to be stable." },
  { title: "Statistical uncertainty", note: "Report it when a sampling model fits the design. This page does not invent a p-value for twelve prepared rows." },
  { title: "Failure analysis", note: "Keep the cases the aggregate hides, including the ones where the method gets worse." },
  { title: "Reproducible configurations", note: "Version the set, the protocol, and the code. A screenshot of a chart is not a configuration." },
  { title: "Clear limitations", note: "Say what the design cannot establish, in the same place as the numbers." },
];

/** Illustrative manifest. It records a demonstration, not an execution log. */
export const experimentManifest: readonly { label: string; value: string }[] = [
  { label: "Experiment id", value: EXPERIMENT_ID },
  { label: "Research question", value: experimentSpec.question },
  { label: "Hypothesis", value: experimentSpec.hypothesis },
  { label: "Dataset version", value: DATASET_VERSION },
  { label: "Evaluation protocol", value: PROTOCOL_VERSION },
  { label: "Code revision", value: "Not pinned. This page is not an executed experiment run." },
  { label: "Model identifier", value: "None. Prepared outputs." },
  { label: "Prompt version", value: "None." },
  { label: "Retrieval configuration", value: "Fixed passages stored on each row. No live index." },
  { label: "Random seed", value: "Not applicable. No sampling." },
  { label: "Dependency versions", value: "Not an experiment lockfile. The site build is separate from a training environment." },
  { label: "Status", value: "Illustrative manifest. The model experiment has not been run." },
  { label: "Result artifacts", value: "The rows in src/content/aiResearchPow.ts and the functions in src/lib/aiResearchEval.ts." },
  { label: "Known limitations", value: "Fictional data, prepared text, one schema row, no uncertainty estimate, no reproduction of a published system." },
];

/**
 * Lewis et al., NeurIPS 2020. Titles, authors, and URLs were checked against arXiv abs/2005.11401
 * and the NeurIPS abstract page on 19 Oct 2026. Findings below are the paper's, not mine.
 */
export const ragPaper = {
  title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
  authors:
    "Patrick Lewis, Ethan Perez, Aleksandra Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, Douwe Kiela",
  venue: "NeurIPS 2020",
  published: "arXiv 22 May 2020; NeurIPS 2020 proceedings",
  arxiv: "https://arxiv.org/abs/2005.11401",
  proceedings:
    "https://proceedings.neurips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html",
  question: "How can a generator use a retrieved corpus as non-parametric memory on knowledge-intensive tasks?",
  contribution:
    "The abstract describes RAG models that combine a pretrained seq2seq parametric memory with a dense Wikipedia index read by a pretrained neural retriever.",
  method:
    "The abstract distinguishes two formulations: one that conditions on the same retrieved passages for the whole sequence, and one that can use different passages per token.",
  baselines: "The abstract says the models outperform parametric seq2seq models and task-specific extractive architectures.",
  dataset: "The abstract says the models are fine-tuned and evaluated on a range of knowledge-intensive NLP tasks, with a Wikipedia index as the non-parametric memory.",
  metrics: "The abstract reports results on knowledge-intensive NLP tasks, including a claim of state of the art on three open-domain QA tasks. This page does not restate table numbers I have not re-read from the paper.",
  findings:
    "Paper's report, from the abstract: retrieval-augmented generation improved over parametric seq2seq and extractive baselines on the tasks they evaluated, including three open-domain QA tasks. That is their finding, under their training and data. It is not a finding of this notebook.",
  limitations:
    "My note, not the paper's limitation section: I have not reproduced the index, the retriever, or the fine-tunes. The abstract's Wikipedia setting is not the Harbor Meter rows.",
  reproducibility:
    "I have not run their code. A reproduction would need their checkpoints or a reimplementation, the Wikipedia index they used, and the same task splits. None of that is in this repository.",
  implementationPlan:
    "The only related code on this page is retrieval recall over a hand-labeled id set. That is a scoring function, not their retriever.",
  openQuestions:
    "Whether a private corpus with contradictory notes behaves like their Wikipedia index is unanswered here. HM-08 is a sketch of that problem, not evidence about their method.",
} as const;

/** InstructGPT citation for the preference section. Checked against arXiv abs/2203.02155 on 19 Oct 2026. */
export const instructGpt = {
  title: "Training language models to follow instructions with human feedback",
  authors:
    "Long Ouyang, Jeff Wu, Xu Jiang, Diogo Almeida, Carroll L. Wainwright, Pamela Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, John Schulman, Jacob Hilton, Fraser Kelton, Luke Miller, Maddie Simens, Amanda Askell, Peter Welinder, Paul Christiano, Jan Leike, Ryan Lowe",
  published: "arXiv 4 March 2022",
  href: "https://arxiv.org/abs/2203.02155",
  note: "Background for what a full preference-training pipeline involves. This page does not reproduce the paper, and I do not claim the InstructGPT results.",
} as const;

/** Local preference task. The choice stays in component state. */
export const preferenceTask = {
  id: "pref-hm-warranty",
  rubricVersion: "pref-demo-0.1",
  rubric:
    "Prefer the answer that matches the evidence, states the warranty, and does not add a claim the passage does not make. Fluency does not outweigh an extra claim.",
  evidence: "HM-4 warranty is 24 months.",
  a: "The HM-4 warranty is 24 months.",
  b: "The HM-4 warranty is 24 months and includes lifetime on-site repair worldwide.",
  preparedNote:
    "Under this rubric, A adds no claim beyond the passage. B adds a repair clause the passage does not state. That note is part of the demonstration. It does not grade the visitor, and it is not a reward-model target.",
} as const;

/** Lifecycle from a question to a monitored component. The demo implements the first steps as a page. */
export const researchLifecycle: readonly { step: string; here: string }[] = [
  { step: "Research question", here: "Written in the specification." },
  { step: "Experimental specification", here: "Hypothesis, null, factors, and stopping rule are on the page." },
  { step: "Baseline", here: "Prepared no-evidence strings." },
  { step: "Prototype", here: "The notebook UI over local rows." },
  { step: "Evaluation", here: "Deterministic functions in aiResearchEval.ts." },
  { step: "Error analysis", here: "Filterable failure notes, labeled as observations plus hypotheses." },
  { step: "Reproducibility", here: "An illustrative manifest, not an execution record." },
  { step: "Engineering hardening", here: "Not implemented. No service boundary, lockfile, or load test." },
  { step: "Integration", here: "Not implemented. No product calls this scorer." },
  { step: "Monitoring", here: "Not implemented. No live traffic and no drift check." },
];

/** Production controls named as concerns, not as features of this demo. */
export const hardeningTopics: readonly { title: string; note: string }[] = [
  { title: "Research code and production code", note: "A notebook function that scores a fixture is not the service that scores traffic." },
  { title: "Configuration", note: "The manifest lists versions because a silent default change is a new experiment." },
  { title: "Dataset versioning", note: "harbor-meter-demo-0.1 is a label. A real set needs immutable storage and a hash." },
  { title: "Deterministic tests", note: "Exact match and schema checks can be unit tests. Model outputs cannot, unless they are pinned." },
  { title: "Dependencies", note: "A training environment and this website's package lock answer different questions." },
  { title: "Runtime and memory", note: "Not measured. A page that maps twelve rows says nothing about an index." },
  { title: "Model and inference cost", note: "There is no call, so there is no cost to report." },
  { title: "Regression tests", note: "The unit tests lock today's counts. They do not gate a model release." },
  { title: "Evaluation gates", note: "A gate needs a decision threshold and an owner. This page defines neither for a product." },
  { title: "Distribution shift", note: "The fictional rows cannot warn a production system that the questions changed." },
];

/** Architecture blocks. `state` says whether this website implements them. */
export const architectureParts: readonly {
  id: string;
  name: string;
  state: "simulation" | "proposal";
  responsibility: string;
  inputs: string;
  outputs: string;
  dependencies: string;
  failureModes: string;
  tests: string;
}[] = [
  {
    id: "spec",
    name: "Research specification",
    state: "simulation",
    responsibility: "Hold the question, hypothesis, null, and factor list.",
    inputs: "A written protocol.",
    outputs: "The specification section.",
    dependencies: "None beyond the content module.",
    failureModes: "A vague hypothesis that no result can fail.",
    tests: "The page renders the question and the null hypothesis.",
  },
  {
    id: "registry",
    name: "Dataset registry",
    state: "proposal",
    responsibility: "Store immutable dataset versions and their hashes.",
    inputs: "A dataset build.",
    outputs: "A version id a run can cite.",
    dependencies: "Object storage and a schema. Not built.",
    failureModes: "A mutable file that changes under an old version id.",
    tests: "Would need a round-trip that rejects a changed byte under the same id.",
  },
  {
    id: "config",
    name: "Experiment configuration",
    state: "simulation",
    responsibility: "Describe dataset, retrieval, protocol, model, and prompt for each condition.",
    inputs: "The three DemoConfig records.",
    outputs: "A field-level diff.",
    dependencies: "aiResearchEval.configDifferences.",
    failureModes: "Two conditions that differ in an unlisted field.",
    tests: "Unit test on the baseline versus retrieval diff, and versus the unrun rerank condition.",
  },
  {
    id: "runner",
    name: "Execution runner",
    state: "proposal",
    responsibility: "Run a pinned configuration and write outputs.",
    inputs: "A config id and a dataset version.",
    outputs: "An output artifact.",
    dependencies: "A runtime. Not built. The page reads stored strings instead.",
    failureModes: "A run that does not record the code revision it used.",
    tests: "Would need a dry run that fails closed when the model id is missing.",
  },
  {
    id: "adapter",
    name: "Model or method adapter",
    state: "proposal",
    responsibility: "Call one model or method behind a single interface.",
    inputs: "A prompt and a model id.",
    outputs: "A completion.",
    dependencies: "A provider or a local model. Not called from this page.",
    failureModes: "A silent fallback to a different model.",
    tests: "Would record the response id and reject an empty body.",
  },
  {
    id: "retrieval",
    name: "Retrieval component",
    state: "simulation",
    responsibility: "Supply the passages a condition may use.",
    inputs: "The evidence field.",
    outputs: "Passage ids and text.",
    dependencies: "Local rows. There is no index.",
    failureModes: "A retrieved id that is not in the evidence list.",
    tests: "Recall math, and the row audit that lines up relevant flags with relevant ids.",
  },
  {
    id: "evaluation",
    name: "Evaluation engine",
    state: "simulation",
    responsibility: "Compute exact match, schema validity, recall, and the task label.",
    inputs: "Rows and the protocol.",
    outputs: "ExampleScore and ExperimentSummary.",
    dependencies: "aiResearchEval.ts.",
    failureModes: "A scorer that treats missing data as zero.",
    tests: "aiResearchEval.test.ts locks the Harbor Meter counts.",
  },
  {
    id: "store",
    name: "Result store",
    state: "proposal",
    responsibility: "Keep outputs and scores addressable by experiment id.",
    inputs: "A finished run.",
    outputs: "An artifact pointer.",
    dependencies: "Storage. The current store is the source file itself.",
    failureModes: "Results overwritten without a new id.",
    tests: "Would read back the artifact id after a write.",
  },
  {
    id: "errors",
    name: "Error-analysis layer",
    state: "simulation",
    responsibility: "Show observed failures and keep diagnoses marked as hypotheses.",
    inputs: "Failure notes on each row.",
    outputs: "A filtered list.",
    dependencies: "The notes in the content module.",
    failureModes: "A diagnosis presented as a measured cause.",
    tests: "The page labels each diagnosis as a hypothesis.",
  },
  {
    id: "compare",
    name: "Experiment comparison",
    state: "simulation",
    responsibility: "Show which configuration fields changed.",
    inputs: "Two DemoConfig records.",
    outputs: "Differences and causal blockers.",
    dependencies: "configDifferences and causalBlockers.",
    failureModes: "Comparing an unrun condition as if it had a score.",
    tests: "The rerank condition is flagged unimplemented.",
  },
  {
    id: "manifest",
    name: "Reproducibility manifest",
    state: "simulation",
    responsibility: "List the versions a reader would need. Mark missing ones as missing.",
    inputs: "The illustrative field list.",
    outputs: "The manifest panel.",
    dependencies: "None. It does not read git.",
    failureModes: "Inventing a commit hash or a seed.",
    tests: "The manifest says the model experiment has not been run.",
  },
  {
    id: "report",
    name: "Reporting interface",
    state: "simulation",
    responsibility: "Show counts beside the rows that produce them.",
    inputs: "ExperimentSummary.",
    outputs: "This page.",
    dependencies: "The React notebook.",
    failureModes: "An aggregate with no path back to the rows.",
    tests: "Choosing a result slice lists the underlying ids.",
  },
];

/** Research-design decisions. None names a universal winner. */
export const researchDecisions: readonly {
  id: string;
  title: string;
  problem: string;
  alternatives: string;
  tradeoffs: string;
  change: string;
}[] = [
  {
    id: "benchmark-world",
    title: "Benchmark versus real-world evaluation",
    problem: "A fixed set is comparable. The deployment distribution may not look like the set.",
    alternatives: "Score a public or internal benchmark, score production traces, or do both.",
    tradeoffs: "Benchmarks travel badly when the task mix differs. Production traces are messy, private, and often unlabeled.",
    change: "If the decision is a research comparison, keep the fixed set. If the decision is a launch, sample the traffic the feature will see.",
  },
  {
    id: "auto-human",
    title: "Automated evaluation versus human evaluation",
    problem: "Some checks are mechanical. Some judgments are not.",
    alternatives: "Exact or schema checks, a judge model, or people under a rubric.",
    tradeoffs: "Automation scales and stays still. People catch cases the rule misses, and they disagree. Judge models add another model to validate.",
    change: "Use automation when the criterion is a test or a schema. Use people when the rubric is about usefulness and the guideline is written down.",
  },
  {
    id: "broad-diagnostic",
    title: "One large dataset versus targeted diagnostic sets",
    problem: "A large set estimates an average. A diagnostic set finds a specific failure.",
    alternatives: "One broad test, a suite of small slices, or a broad test plus slices.",
    tradeoffs: "The average hides HM-03-style regressions. A tiny slice, including this one, is not a workload.",
    change: "Keep the broad set for the headline rate and a diagnostic slice when a failure category matters to the decision.",
  },
  {
    id: "stat-practical",
    title: "Statistical significance versus practical significance",
    problem: "A detectable difference can be too small to matter, and a meaningful difference can be uncertain.",
    alternatives: "A significance test, an effect size with an interval, or a decision threshold set by the product.",
    tradeoffs: "Significance depends on the sampling model and the size of the set. Practical significance depends on cost and harm. This page has neither a sampling model nor a product threshold.",
    change: "If the procedure is stochastic and the decision needs a rate, compute the interval from the actual trials. If the gap is smaller than the cost of being wrong, do not ship on the test alone.",
  },
  {
    id: "retrieve-context",
    title: "Retrieval versus a larger context",
    problem: "The model can be given retrieved passages or a longer unfiltered context.",
    alternatives: "No extra context, a retrieved subset, or a larger stuffed context.",
    tradeoffs: "Retrieval can drop the relevant passage, as the HM-03 row illustrates with prepared text. A larger context costs latency and can bury the useful span.",
    change: "Prefer retrieval when the corpus does not fit and relevance can be checked. Prefer a longer context when the corpus is small and the risk is missing a passage.",
  },
  {
    id: "tune-prompt",
    title: "Fine-tuning versus prompting or retrieval",
    problem: "The behavior can be changed in the weights, the prompt, or the evidence.",
    alternatives: "Fine-tune, change the prompt, add retrieval, or combine them after a baseline.",
    tradeoffs: "Fine-tuning needs data, evaluation, and a way to notice regressions. Prompting is cheaper and brittle. Retrieval helps only when the evidence exists and is selected.",
    change: "Start with the baseline and the cheapest change the error analysis points at. Fine-tune when prompting and retrieval still fail a written criterion and the data is available.",
  },
  {
    id: "reproduce-extend",
    title: "Reproduction versus extension",
    problem: "A new method is hard to trust if the baseline was never rebuilt.",
    alternatives: "Reproduce a published baseline, or propose an extension immediately.",
    tradeoffs: "Reproduction is slower and often more informative. An extension without a matched baseline can look strong because the comparison is weak.",
    change: "Reproduce when the claim depends on a prior number. Extend when the baseline is in hand and the new factor is isolated.",
  },
];

/** Roadmap. Only the work in this repository is marked implemented or partial. */
export const researchRoadmap: readonly { phase: string; title: string; status: string; evidence: string }[] = [
  {
    phase: "1",
    title: "Interactive notebook on prepared local data",
    status: "Implemented",
    evidence: "This page renders the Harbor Meter rows. The outputs are labeled as prepared.",
  },
  {
    phase: "2",
    title: "Reusable experiment schemas and deterministic evaluation",
    status: "Partial",
    evidence:
      "exactMatch, schemaValid, retrievalRecall, taskLabel, and summarizeExperiment exist for this dataset. There is no general schema registry.",
  },
  {
    phase: "3",
    title: "Dataset and artifact versioning",
    status: "Not started",
    evidence: "The dataset version is a string in source control, not a content-addressed artifact.",
  },
  {
    phase: "4",
    title: "A reproducible local experiment runner",
    status: "Not started",
    evidence: "preparedOutput reads a field. It does not execute a configuration.",
  },
  {
    phase: "5",
    title: "Model-provider or local-model integration",
    status: "Not started",
    evidence: "No model API is called.",
  },
  {
    phase: "6",
    title: "Expanded evaluation and statistical analysis",
    status: "Not started",
    evidence: "No interval or hypothesis test is computed. The page explains why.",
  },
  {
    phase: "7",
    title: "Automated regression evaluation",
    status: "Not started",
    evidence: "Unit tests lock this fixture. They do not score a new model on a schedule.",
  },
  {
    phase: "8",
    title: "Reproducible reports and artifact publication",
    status: "Not started",
    evidence: "The Markdown twin describes the demonstration. It is not a research artifact release.",
  },
  {
    phase: "9",
    title: "Production-oriented experiment orchestration",
    status: "Not started",
    evidence: "No queue, no runner service, and no deployment of this notebook as a system.",
  },
];

/** Projects inspected for this page. Descriptions stay inside what the repos and this site already say. */
export const inspectedProjects: readonly {
  name: string;
  href: string;
  also?: readonly { label: string; href: string }[];
  problem: string;
  implements: string;
  evaluation: string;
  reproducible: string;
  limits: string;
  relation: string;
}[] = [
  {
    name: "OpenAI-RLHF",
    href: "https://github.com/ayushrai-hub/OpenAI-RLHF",
    problem: "Store coding tasks that can be checked, and store side-by-side completions a person can compare.",
    implements:
      "The repository README and docs/01-executive-summary.md describe an archive: Months tasks pair ideal_completion.py with tests.py, and Colosseum stores TurnN CompletionA and CompletionB files. Scripts generate a manifest and can run unittest files. The same documents say the tree has no PPO, DPO, reward model, or policy optimizer.",
    evaluation: "Months uses unittest assertions. Colosseum has no in-repo preference scorer. The verdict there is a human label that is not recorded as a training run.",
    reproducible: "A single Months task can be run with its tests.py when its dependencies are installed. I did not re-run the corpus for this page.",
    limits: "The name says RLHF. The repository says it is not an RLHF trainer. Three commits and an empty triton directory are part of that limit.",
    relation: "It is preference-artifact and unit-test evaluation work. It is not a reward-model experiment.",
  },
  {
    name: "RLHF-tasks",
    href: "https://github.com/ayushrai-hub/RLHF-tasks",
    problem: "Keep a library of containerized coding-agent tasks and the local job logs around them.",
    implements:
      "The README describes a Project Terminus Edition 2 task library: instruction, task.toml, environment, solution, and tests, plus a scripts/terminus CLI for validate, audit, and review. It names Harbor job logs under jobs/.",
    evaluation: "The README points at Harbor oracle and agent runs. I did not re-run them, so I do not repeat the README's run count as a result I measured.",
    reproducible: "The README documents the CLI and the external Harbor install. Reproducing a job needs those tools and credentials this page does not use.",
    limits: "This is task-authoring and review tooling for someone else's benchmark program. It is not a paper and not a reward model.",
    relation: "Related to evaluation engineering. The benchmark proof-of-work page is the closer home for task design. It is listed here because the repository is part of the RLHF-named work I was asked to inspect.",
  },
  {
    name: "Adaptive RAG",
    href: "https://github.com/ayushrai-hub/adaptive-rag",
    problem: "Route a question to indexed documents, a general model answer, or web search.",
    implements:
      "src/rag/graph_builder.py builds a LangGraph with a query classifier, a general LLM node, and a retriever node, and it imports Qdrant retrieval plus Tavily search. The README describes FastAPI and Streamlit around that graph. Commit history attributes the system to Dhruv Singhal across 2025 and 2026. The ayushrai-hub account has one commit, on 1 Apr 2026, whose message says Docker, documentation, multi-provider support, and configuration.",
    evaluation: "I did not find an experiment table in the files I inspected, and I did not run the service.",
    reproducible: "The README and docker-compose.yml describe how to start it. Running it needs API credentials and a vector store. That was not done for this page.",
    limits: "I do not claim the adaptive router as my research result. The GTM notes on this site already treat the design as Dhruv Singhal's.",
    relation: "It is a retrieval system I can read. It is not the Harbor Meter experiment, and it is not a result I am reporting.",
  },
  {
    name: "Revenue Intelligence Engine",
    href: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE",
    also: [
      { label: "revopy.vercel.app", href: "https://revopy.vercel.app/" },
      { label: "cashmaker-two.vercel.app", href: "https://cashmaker-two.vercel.app/" },
    ],
    problem: "Rank fictional accounts against an ICP and hold export behind a person.",
    implements:
      "The README describes a Python pipeline over data/synthetic/companies.json: normalize, dedupe, a mock enrichment provider, a deterministic 100-point score, optional research with a deterministic fallback, and an approval queue. Both demo URLs returned a page titled Revenue Intelligence Engine when I requested them on 19 Oct 2026. The repository homepage is the cashmaker host.",
    evaluation: "The score is a written rubric over synthetic rows. It is not a model benchmark.",
    reproducible: "The README gives the default path: 42 companies, duplicates dropped, top accounts researched. I did not re-run it for this page.",
    limits: "All bundled companies are synthetic. The README says it does not send mail or write to a live CRM.",
    relation: "Useful as an example of a deterministic score and a run id. It is a systems demo, not a scientific result about models.",
  },
  {
    name: "AGENYRA",
    href: "https://github.com/ayushrai-hub/AGENYRA_product",
    also: [
      { label: "agenyra.space", href: "https://agenyra.space/" },
      { label: "Earlier marketplace repo", href: "https://github.com/ayushrai-hub/AGENYRA" },
    ],
    problem: "Represent AI products as structured data before distributing them.",
    implements:
      "The public product repository is the Next.js site and waitlist. This site's product record says the product graph is not in that public repository. The earlier AGENYRA repository README describes a pre-release marketplace with Postgres full-text search and a provenance label on trust claims. I read that README and did not run the app.",
    evaluation: "No model evaluation is in the public site repository.",
    reproducible: "The waitlist site can be installed from its README. That reproduces a website, not an experiment.",
    limits: "Discovery and distribution stages are not a research finding. I am not claiming a published study.",
    relation: "Related as structured representation and claim labels. It is not an AI research experiment.",
  },
  {
    name: "SpiderWeb",
    href: "https://github.com/ayushrai-hub/SpiderWeb",
    problem: "Turn a personal LinkedIn export into a local, searchable network map.",
    implements:
      "The README describes a TypeScript web app and API that import an export into people, companies, roles, and conversations, with dedupe and a graph. It says counts are counts of imported rows, and relationship signals are labeled rules.",
    evaluation: "I did not find a model evaluation. The product is explicit that it does not infer beyond those rules.",
    reproducible: "The README's local path uses pnpm, Postgres, and Redis. I did not load a personal export for this page.",
    limits: "There is no production deployment in the README. A network graph of one export is not a research dataset.",
    relation: "Included because I was asked to inspect it. It is a data product. It is not an AI research study, and I do not describe it as one.",
  },
];

/** Inspected and not used as evidence, so the absence is explicit. */
export const unusedInspection =
  "RLHF-tas (https://github.com/ayushrai-hub/RLHF-tas) has no README. The tree looks like exported task bundles. I do not describe it as a system.";

/** What the demonstration can and cannot establish. */
export const demonstrationLimits: readonly string[] = [
  "It can show a written question, a hypothesis, a baseline, and a second condition.",
  "It can recompute exact match, schema validity, retrieval recall, and the task label from the stored rows.",
  "It can show rows where the retrieval string is better, the same, or worse.",
  "It cannot show that retrieval improves factual accuracy for any real model.",
  "It cannot support a confidence interval, a p-value, or a claim of significance.",
  "It cannot show that I have published a paper, reproduced Lewis et al., or trained a reward model.",
  "Twelve fictional rows are not a stand-in for a production workload.",
];

/** Preference workflow the section explains. The page only does the local comparison step. */
export const preferenceWorkflow: readonly string[] = [
  "Define the comparison task and the rubric version.",
  "Collect the candidate outputs and the evidence they were allowed to use.",
  "Apply the same rubric to every pair.",
  "Record which output the annotator prefers, including tie and neither.",
  "Keep the annotator id, the time, and the rubric version with the decision.",
  "Look at agreement when more than one person labels the same pair.",
  "Inspect the pairs people split on instead of averaging them away.",
  "Check that the same rubric on a repeated pair stays stable.",
  "Write down what the labels cannot support, including any training step that was not run.",
];

/** Counts the Markdown twin quotes, so the prose cannot drift from the rows. */
const summary = summarizeExperiment(researchExamples);

/**
 * Markdown body for `/pow/ai-research-engineering.md`.
 * Uses the same rows and the same summary function as the page.
 */
export function renderAiResearchBody(): string {
  const lines = [
    aiResearchHero.positioning,
    "",
    aiResearchHero.supporting,
    "",
    "This is a prepared demonstration. No model was called. Harbor Meter Co. is fictional.",
    "",
    "## Question",
    "",
    experimentSpec.question,
    "",
    `Hypothesis: ${experimentSpec.hypothesis}`,
    "",
    `Null hypothesis: ${experimentSpec.nullHypothesis}`,
    "",
    experimentSpec.status,
    "",
    "## Prepared results",
    "",
    `Rows: ${summary.rows}. Exact-match denominator: ${summary.scorable}. Excluded: ${summary.excluded}.`,
    "",
    `Baseline exact match: ${summary.baselineExactCorrect} of ${summary.scorable}.`,
    "",
    `Retrieval exact match: ${summary.retrievalExactCorrect} of ${summary.scorable}.`,
    "",
    `Retrieval helps on ${summary.helps} scorable rows, hurts on ${summary.hurts}, and ties on ${summary.noEffect}.`,
    "",
    `Retrieval recall, micro-average over non-duplicate rows with a relevance set: ${summary.recallHits} of ${summary.recallRelevant} relevant ids.`,
    "",
    "These counts are descriptive. They are not a significance test and not a claim that retrieval works.",
    "",
    "## Inspected work",
    "",
    ...inspectedProjects.map(
      (project) => `- [${project.name}](${project.href}): ${project.relation}`,
    ),
    "",
    unusedInspection,
    "",
    `Paper used as a reading example, not as my result: [${ragPaper.title}](${ragPaper.arxiv}), ${ragPaper.authors}, ${ragPaper.venue}.`,
    "",
    "I have not published this experiment. The ORCID link on the site is an identity record, not a publication list.",
  ];
  return lines.join("\n");
}

/** Evidence-label order for the results table. */
export const evidenceLabelOrder: readonly EvidenceLabel[] = [
  "supported",
  "partial",
  "unsupported",
  "unscored",
];
