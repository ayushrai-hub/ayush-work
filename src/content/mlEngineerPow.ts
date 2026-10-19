/**
 * Copy and the Markdown twin for the machine-learning engineering proof of work.
 *
 * Case studies say only what a repository inspection supported. The interactive lab is a browser
 * simulation over synthetic rows. Numbers in the twin come from the same functions as the page.
 *
 * Connects to:
 * - src/pages/MlEngineerPowPage.tsx and src/components/pow/ml/Lab.tsx.
 * - src/lib/mlEngineer for the dataset, the holdout, and the roadmap.
 * - src/lib/agent/markdown.ts (`renderMlEngineerBody`), searchIndex.ts, and publicRoutes.ts.
 */
import {
  DEMO_DATASET_LABEL,
  ROADMAP,
  formatMetric,
  scoreHoldout,
  validateDataset,
} from "../lib/mlEngineer";

/** Route for this page. */
export const ML_ENGINEER_PATH = "/pow/ml-engineer";

/** Description shared by the page head, search, and the Markdown twin. */
export const mlEngineerDescription =
  "Ayush Rai on machine learning engineering: a browser workbench for a synthetic retail-demand lifecycle, plus what the public repositories actually contain. No model is trained on this page.";

/** Hero headline. */
export const ML_HEADLINE = "I build machine learning systems that work beyond the notebook.";

/** Sentence under the headline. */
export const ML_SUPPORT =
  "I work across data pipelines, model training, evaluation, inference, and system reliability to turn machine learning experiments into dependable software.";

/** Principles shown under the hero. They are a stance, not a list of production deployments. */
export const ML_PRINCIPLES = [
  "Reproducible experiments.",
  "Reliable data pipelines.",
  "Meaningful evaluation.",
  "Efficient inference.",
  "Versioned artifacts.",
  "Observable systems.",
  "Explicit failure handling.",
  "Practical engineering trade-offs.",
] as const;

/** One inspected project. `status` tells the reader what was and was not found. */
export interface MlCaseStudy {
  id: string;
  title: string;
  href: string | null;
  exists: string;
  implemented: string;
  demonstrated: string;
  synthetic: string;
  incomplete: string;
  next: string;
}

/**
 * Projects inspected for this page in October 2026.
 * Retail price optimization and stock-price LSTM/GRU models were not found in the public GitHub account.
 */
export const ML_CASE_STUDIES: readonly MlCaseStudy[] = [
  {
    id: "retail-price",
    title: "Retail price optimization",
    href: null,
    exists:
      "A search of the public GitHub account ayushrai-hub for notebooks, scikit-learn, and price-optimization code did not find a repository that implements this project.",
    implemented: "Nothing I can point to in a public repository.",
    demonstrated: "Not demonstrated here.",
    synthetic: "The demand table on this page is a separate, labeled demonstration. It is not that project.",
    incomplete: "There is no public training, evaluation, or serving code to review.",
    next: "Publish the data contract, the split, the baseline, and the evaluation before describing a result.",
  },
  {
    id: "stock",
    title: "Stock price analysis",
    href: null,
    exists:
      "The same public-code search found no LSTM, GRU, Keras, or TensorFlow training implementation, and no notebooks.",
    implemented: "No model architecture, feature pipeline, temporal split, or metric is available to describe.",
    demonstrated: "Not demonstrated. I do not claim that a recurrent model beat a baseline.",
    synthetic: "None attached to this title.",
    incomplete: "The whole project, as far as the public account shows.",
    next: "If the work exists elsewhere, add the source, the split, and the measured comparison.",
  },
  {
    id: "adaptive-rag",
    title: "Adaptive RAG",
    href: "https://github.com/ayushrai-hub/adaptive-rag",
    exists:
      "The repository exists. GitHub lists dhruvsinghal09 as the author of 12 commits and ayushrai-hub as the author of one commit on 1 April 2026 (3bcbf10).",
    implemented:
      "That commit adds Docker files, documentation, and a multi-provider LLM factory for OpenAI and NVIDIA, with small edits to the graph and the ReAct agent. The README describes a LangGraph application: classify, retrieve, grade, rewrite, generate, and web search, behind FastAPI and Streamlit.",
    demonstrated:
      "Application orchestration around hosted models. A tree listing did not show a test or evaluation suite. This is not a training platform.",
    synthetic: "I am not labeling the repository’s documents as synthetic. I also have no retrieval-quality numbers to publish.",
    incomplete:
      "No measured retrieval or answer quality, no production deployment claim, and no statement that I designed the original system. The GTM page leaves this repository out because the design is Dhruv Singhal’s.",
    next: "An evaluation set with expected documents, and a test that the router’s three paths fail closed.",
  },
  {
    id: "openai-rlhf",
    title: "OpenAI-RLHF",
    href: "https://github.com/ayushrai-hub/OpenAI-RLHF",
    exists:
      "The repository exists. Its README says it is an archive of coding evaluation tasks and A/B completion artifacts, and that it does not contain an RLHF, PPO, or DPO trainer.",
    implemented:
      "A Months track of ideal_completion.py plus tests.py, a Colosseum track of Completion A/B pairs, and scripts that list tasks, run tests, validate the tree, and export preferences. I did not run that suite while writing this page.",
    demonstrated:
      "Evaluation and preference-pair layout. The experience page is where the FoCDoT and Outlier review work is described. This repository is not foundation-model training.",
    synthetic: "The README does not call the tasks synthetic. I am not republishing a task count as a personal score.",
    incomplete: "No reward model, no policy update, and no claim that the archived tests were executed in CI for this site.",
    next: "Run the documented test script on a pinned subset and publish the pass count only after that run.",
  },
  {
    id: "revenue-engine",
    title: "Revenue Intelligence Engine",
    href: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE",
    exists:
      "The repository and the project record exist. The record’s demo field is https://cashmaker-two.vercel.app. A console at https://revopy.vercel.app/ is cited on the product-management page as a console that was opened, and it is a different URL from that demo field.",
    implemented:
      "A deterministic 100-point rubric over a bundled set of 42 fictional companies, with normalize, dedupe, mock enrichment, optional LLM research that falls back to a template, and a human approval gate before export. The score is not produced by a trained model.",
    demonstrated: "An inspectable data-to-decision path and a stop rule. Useful as pipeline and release-gate thinking, not as model training.",
    synthetic: "The repository says the companies, contacts, signals, and research outputs are synthetic.",
    incomplete: "No learned model, no live CRM write, and no production monitoring of a predictor.",
    next: "Keep the rubric. If a model is added later, it should lose to this rubric until a gated comparison says otherwise.",
  },
  {
    id: "agenyra",
    title: "AGENYRA",
    href: "https://github.com/ayushrai-hub/AGENYRA",
    exists: "The public site is https://agenyra.space/ and the repository README describes a pre-release marketplace.",
    implemented:
      "Next.js, Drizzle, and Postgres full text. Money is integer minor units. Trust claims carry a provenance label. No training loop or model server is described in that README.",
    demonstrated: "Product data and explicit provenance. Not a machine-learning lifecycle.",
    synthetic: "The README’s seed command loads demo catalog rows.",
    incomplete: "Discovery over those fields, and anything that would be a model, are outside this inspection.",
    next: "Leave it out of model-training claims. The product page already separates what is built.",
  },
  {
    id: "revenueroles",
    title: "RevenueRoles",
    href: "https://github.com/ayushrai-hub/RevenueRoles",
    exists: "The live site is https://revenueroles.in/ and the product record describes job discovery.",
    implemented:
      "A job product. A code search for a classifier, an embedding model, scikit-learn, or an OpenAI call in that repository returned no files. I am not describing a trained ranking model.",
    demonstrated: "Product and data-platform work, documented on the product and GTM pages. Not a model lifecycle.",
    synthetic: "No model metrics.",
    incomplete: "Any learned classifier, if one was intended, is not in the search result I checked.",
    next: "If classification is rules, say so next to the rule. If it becomes a model, add a baseline and a gate.",
  },
  {
    id: "spiderweb",
    title: "SpiderWeb",
    href: "https://github.com/ayushrai-hub/SpiderWeb",
    exists: "The repository README describes a local app that reads a LinkedIn data export.",
    implemented:
      "Import, normalization, deduplication, and counts of rows read, imported, updated, and rejected. The README says the numbers are counts over the export and that there is no production deployment.",
    demonstrated: "A data-ingestion path that records rejected rows. That is the part that overlaps this page. There is no trained model in that description.",
    synthetic: "The user’s own export is not synthetic. This page does not display anyone’s export.",
    incomplete: "No feature store, no model, no hosted service.",
    next: "Keep the reject counts. Do not add an inferred score without labeling the rule.",
  },
];

/**
 * Markdown body for `/pow/ml-engineer.md`.
 * Holdout figures are computed so the twin cannot drift from the page.
 */
export function renderMlEngineerBody(): string {
  const report = validateDataset();
  const score = scoreHoldout();
  const cases = ML_CASE_STUDIES.map(
    (item) =>
      `### ${item.title}\n\n${item.href ? `Source: ${item.href}\n\n` : ""}Exists: ${item.exists}\n\nImplemented: ${item.implemented}\n\nDemonstrated: ${item.demonstrated}\n\nSynthetic: ${item.synthetic}\n\nIncomplete: ${item.incomplete}\n\nNext: ${item.next}`,
  ).join("\n\n");
  const roadmap = ROADMAP.map(
    (stage) => `### Stage ${stage.stage} — ${stage.title}\n\n${stage.items.map((item) => `- ${item}`).join("\n")}`,
  ).join("\n\n");
  return [
    ML_SUPPORT,
    "",
    "This page is a frontend simulation. It does not train a model, call a model API, or record production traffic.",
    "",
    DEMO_DATASET_LABEL,
    "",
    `The synthetic table has ${report.total} rows. Validation marks ${report.passed} as passed and ${report.failed} as failed. Failed rows are reported and kept out of the clean set.`,
    "",
    `On the time-ordered holdout, the lag baseline MAE is ${formatMetric(score.baseline.mae)} and the fixed blend MAE is ${formatMetric(score.blend.mae)}. The blend uses coefficients written in the page. They were not fit. R-squared is reported with the caveat that a small holdout can make it look more decisive than it is.`,
    "",
    "## Case studies",
    "",
    cases,
    "",
    "## Proposed next build",
    "",
    "The roadmap below is proposed. It is not a list of finished infrastructure.",
    "",
    roadmap,
  ].join("\n");
}
