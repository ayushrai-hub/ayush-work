/**
 * Copy and verified project notes for /pow/ai-data-scientist.
 *
 * The interactive numbers live in src/lib/dataScience. This module holds the
 * positioning, the case studies, and the Markdown twin. Case-study status is
 * explicit: a repository I inspected, a note already published on this site,
 * or a project I could not find.
 *
 * Connects to:
 * - src/pages/AiDataScientistPowPage.tsx.
 * - src/lib/agent/markdown.ts (`renderAiDataScientistBody`).
 * - src/lib/dataScience/analysis.ts for the twin's calculated summary.
 * - src/content/person.ts for the public profile links.
 */
import { analyzeRetail } from "../lib/dataScience/analysis";
import { DEFAULT_CLEANING } from "../lib/dataScience/quality";
import { person } from "./person";

/** Route path. Prerendered and indexed. */
export const AI_DATA_SCIENTIST_PATH = "/pow/ai-data-scientist";

/** Search and Markdown description. */
export const aiDataScientistDescription =
  "A synthetic data-science workbench and a checked account of the analytical repositories. Insight Lab is not a retailer's data and not a trained production model.";

/** How a case study should be read. */
export type CaseStatus = "inspected-repository" | "published-on-this-site" | "not-found" | "limited-claim";

/** One project note. `body` is the claim I am willing to publish. */
export interface DataCase {
  id: string;
  title: string;
  status: CaseStatus;
  href?: string;
  body: string;
}

/** Profile links requested on the hero. */
export const aiDataScientistProfiles = [
  { href: person.primaryProfiles.github, label: "GitHub" },
  { href: person.primaryProfiles.linkedin, label: "LinkedIn" },
  { href: person.siteUrl, label: "ayushrai.site" },
] as const;

/**
 * Projects inspected for this page on 19 Oct 2026.
 * Performance figures from a notebook or README are attributed to that file.
 * They were not re-run while building the page.
 */
export const aiDataScientistCases: readonly DataCase[] = [
  {
    id: "retail-price",
    title: "Retail price optimization",
    status: "not-found",
    body: "I looked through the public ayushrai-hub repositories for a retail price-optimization project and did not find one. Insight Lab is a new synthetic demonstration. It is not a port of that project, and it does not report a retail result.",
  },
  {
    id: "stock",
    title: "Stock price analysis",
    status: "inspected-repository",
    href: "https://github.com/ayushrai-hub/stock-price-analysis",
    body: "The repository was uploaded on 18 Feb 2024. It contains Stock_market.ipynb and four CSV files whose names cover Amazon, Google, IBM, and Microsoft from 2006-01-01 to 2018-01-01. The notebook defines a PyTorch nn.GRU (hidden size 32, two layers, Adam at learning rate 0.01, 105 epochs, MSE) and a chronological 80/20 split after windows of 20 closes. I did not find an nn.LSTM class. MinMaxScaler is fit on the full Close series before the split, so the scaler sees the test period. Saved cell outputs print GRU RMSE of 7.31/29.14 (Amazon), 6.42/28.55 (Google), 2.06/1.96 (IBM), and 0.56/3.75 (Microsoft), train then test. I did not re-run them, and the notebook does not place a naive forecast beside those scores. The README links a Medium article and a LinkedIn post by Soham Nandi, so I am not treating the notebook as an independent study or as evidence of a profitable strategy.",
  },
  {
    id: "rlhf",
    title: "OpenAI-RLHF",
    status: "inspected-repository",
    href: "https://github.com/ayushrai-hub/OpenAI-RLHF",
    body: "The README states that this repository does not contain an RLHF, PPO, or DPO trainer. Months holds coding tasks with a reference completion and tests. Colosseum holds multi-turn A/B completion pairs for preference labeling. The README describes about 1,450 Python files. That is an evaluation archive, not a trained reward model and not a benchmark score.",
  },
  {
    id: "amex",
    title: "Amex campus challenge profitability",
    status: "inspected-repository",
    href: "https://github.com/ayushrai-hub/amex",
    body: "The repository is a deterministic revenue-minus-cost score for the American Express Campus Challenge 2026 Round 1, not a supervised model trained on a proxy target. Coefficients live in config.py. The pipeline loads a scoring file, runs EDA, imputation, winsorization, and validation, and writes a submission. The README says the scoring file has 500,000 rows and reports a run's mean, range, top-20% cutoff, bootstrap Jaccard, and overlap with a draft file. I did not re-run that pipeline for this page, so those figures stay in the README rather than being repeated here as my own measurement.",
  },
  {
    id: "revenue-intelligence",
    title: "Revenue Intelligence Engine",
    status: "published-on-this-site",
    href: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE",
    body: "This site's project record describes a synthetic-data pipeline that scores 42 fictional companies with a deterministic 100-point rubric. There are no real leads or CRM writes in that description. On 19 Oct 2026 both https://revopy.vercel.app/ and https://cashmaker-two.vercel.app/ returned a page titled Revenue Intelligence Engine. The project record links the second URL. I did not re-audit the rubric code while building this page.",
  },
  {
    id: "adaptive-rag",
    title: "Adaptive RAG",
    status: "limited-claim",
    href: "https://github.com/ayushrai-hub/adaptive-rag",
    body: "The earliest commits are by Dhruv Singhal. A later commit adds Docker, documentation, and multi-provider configuration. This site's GTM note already excludes the project as Dhruv Singhal's design. It is a retrieval workflow with a relevance grade, not a statistical result I am claiming here.",
  },
  {
    id: "revenueroles",
    title: "RevenueRoles",
    status: "published-on-this-site",
    href: "/products/revenueroles",
    body: "RevenueRoles classifies and publishes job postings. That is a product pipeline, documented on its product page. It is not a demand model and it is not an experiment with a published treatment effect.",
  },
  {
    id: "agenyra",
    title: "AGENYRA",
    status: "published-on-this-site",
    href: "https://agenyra.space/",
    body: "The public repository is the waitlist site. It does not contain a dataset, a fitted model, or an evaluation table I can cite as data-science evidence.",
  },
];

/** Markdown body for /pow/ai-data-scientist.md. Calculated lines come from the same function as the page. */
export function renderAiDataScientistBody(): string {
  const snapshot = analyzeRetail(DEFAULT_CLEANING, "ols");
  const ols = snapshot.models.find((model) => model.id === "ols");
  const meanModel = snapshot.models.find((model) => model.id === "mean");
  const leak = snapshot.models.find((model) => model.id === "leaky-revenue");
  return [
    "Ayush Rai. Synthetic demonstration plus inspected repositories. Insight Lab is not a retailer dataset and not a production model.",
    "",
    "## Question",
    "",
    "How should a pricing review separate description, prediction, and a decision when the sample is synthetic and the promotion rule is confounded with season?",
    "",
    "## Calculated summary",
    "",
    `Raw rows examined: ${snapshot.examined}. Findings: ${snapshot.findings.length}. Rows kept under the default cleaning decisions: ${snapshot.cleaning.kept.length}.`,
    `Cleaned mean units: ${snapshot.unitsSummary.mean?.toFixed(2) ?? "unavailable"}.`,
    `Promotional minus non-promotional mean units: ${snapshot.promotion.differenceOfMeans?.toFixed(2) ?? "unavailable"}. Permutation method: ${snapshot.promotion.pMethod}.`,
    `Training-mean test MAE: ${meanModel?.metrics?.mae?.toFixed(2) ?? "unavailable"}. OLS test MAE: ${ols?.metrics?.mae?.toFixed(2) ?? "unavailable"}. Leaked-copy test R²: ${leak?.metrics?.rSquared?.toFixed(3) ?? "unavailable"}.`,
    "The holdout is every day after day 12. Default cleaning drops the planted defects, including units of 900, and strips next-day units.",
    "",
    "## What this does not show",
    "",
    "No causal price effect. No claim that a grid maximum will maximize profit. No LSTM or GRU trained in the browser. Classification metrics are not computed, because the retail target is a count.",
    "",
    "## Repositories",
    "",
    ...aiDataScientistCases.map((item) => `- ${item.title} (${item.status}). ${item.body}${item.href ? ` ${item.href}` : ""}`),
  ].join("\n");
}
