/**
 * Product-management proof of work: the RevenueRoles case study and the notebook around it.
 *
 * The record separates what the live homepage and this site's product record support from
 * hypotheses, proposed work, and synthetic demonstration numbers. Scoring inputs are starting
 * estimates for the on-page explorer. They are not user research.
 *
 * Connects to:
 * - src/pages/ProductManagementPowPage.tsx and src/components/pow/*.
 * - src/lib/productManagementScore.ts (the formula the explorer runs).
 * - src/lib/agent/markdown.ts (`renderProductManagementBody`), searchIndex.ts, publicRoutes.ts.
 * - Product and project URLs come from products.ts and projects.ts. The revopy console URL is
 *   recorded here because it is not the demo field on the project record.
 */
import { getProductBySlug } from "./products";
import { getProjectBySlug } from "./projects";
import type { ScoreInput } from "../lib/productManagementScore";
import { explainScore, DEFAULT_WEIGHTS } from "../lib/productManagementScore";

/** Route for this page. The FDE proof of work is a sibling route and is not defined here. */
export const PRODUCT_MANAGEMENT_PATH = "/pow/product-management";

/** Document description shared by the page head, search, and the Markdown twin. */
export const productManagementDescription =
  "Ayush Rai on product management: a RevenueRoles case study that separates the live job product from hypotheses, proposed requirements, and unmeasured outcomes.";

/** Looks up a product record or throws, so a renamed slug fails at module load rather than rendering a blank link. */
function requireProduct(slug: string) {
  const product = getProductBySlug(slug);
  if (!product) throw new Error(`productManagementPow: missing product ${slug}`);
  return product;
}

/** Looks up a project record or throws, for the same reason as `requireProduct`. */
function requireProject(slug: string) {
  const project = getProjectBySlug(slug);
  if (!project) throw new Error(`productManagementPow: missing project ${slug}`);
  return project;
}

const revenueRoles = requireProduct("revenueroles");
const agenyra = requireProduct("agenyra");
const openFramework = requireProduct("the-open-framework");
const engine = requireProject("revenue-intelligence-engine");
const spiderweb = requireProject("spiderweb");

/** One stage of the product-development framework. */
export interface PmFrameworkStage {
  id: string;
  name: string;
  question: string;
  decisions: string[];
  artifacts: string[];
  evidence: string;
  failure: string;
}

/** One part of the RevenueRoles case narrative. */
export interface PmCasePart {
  id: string;
  title: string;
  status: "fact" | "hypothesis" | "proposed" | "open" | "unmeasured";
  paragraphs: string[];
}

/** A row in the discovery workspace. */
export interface PmDiscoveryRow {
  label: string;
  body: string;
  status: "fact" | "hypothesis" | "proposed" | "open" | "unmeasured";
}

/** One step in the candidate decision journey. */
export interface PmJourneyStep {
  id: string;
  title: string;
  objective: string;
  friction: string;
  intervention: string;
  data: string;
  failure: string;
  measurement: string;
}

/** A proposed initiative and the notebook's starting 1–5 estimates. */
export interface PmInitiative {
  id: string;
  title: string;
  summary: string;
  state: string;
  estimate: ScoreInput;
}

/** One section of the example PRD. */
export interface PmPrdSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  items?: string[];
}

/** A metric definition with no baseline. */
export interface PmMetric {
  id: string;
  name: string;
  group: "North-star candidate" | "Input" | "Guardrail";
  definition: string;
  numerator: string;
  denominator: string;
  window: string;
  source: string;
  segmentation: string;
  limitation: string;
  why: string;
}

/** One block of the proposed experiment. */
export interface PmExperimentBlock {
  id: string;
  title: string;
  body: string[];
}

/** A step in the synthetic funnel. Counts live in `syntheticFunnel`. */
export interface PmFunnelStep {
  id: string;
  name: string;
  event: string;
  instrumentation: string;
}

/** A link in the engineering chain. */
export interface PmEngineeringStep {
  id: string;
  title: string;
  state: "fact" | "hypothesis" | "proposed";
  body: string;
}

/** One outcome-themed roadmap item. */
export interface PmRoadmapItem {
  id: string;
  title: string;
  problem: string;
  benefit: string;
  dependencies: string;
  confidence: string;
  effort: string;
  risk: string;
  measure: string;
}

/** Another project, with the product point it demonstrates. */
export interface PmOtherWork {
  title: string;
  demonstrates: string;
  links: { href: string; label: string; external?: boolean }[];
}

/** Homepage inventory read on 19 Oct 2026. The page itself dates the inventory 23 Sep 2026. */
export const revenueRolesCheck = {
  readOn: "2026-10-19",
  inventoryDated: "2026-09-23",
  verifiedRoles: 71,
  compensationFields: 41,
  compensationCoverage: "58%",
  salaryCategoriesWithFiveSamples: 0,
} as const;

/** Facts supported by the live homepage or by the product record already published on this site. */
export const verifiedFacts: string[] = [
  "On 19 October 2026 the homepage at revenueroles.in titled itself “The job board that knows GTM Engineer isn't Sales Ops.” It says RevenueRoles discovers roles from supported ATS and career sources, extracts complete descriptions, verifies publishing eligibility, and classifies them into a Revenue-Technical taxonomy.",
  "That same homepage reported 71 verified roles currently published, updated 23 September 2026, 10:29. It also reported 41 jobs with compensation fields, 58% compensation coverage, and 0 categories with at least 5 salary samples. It says tiny samples are not shown as averages. These are the site's inventory counts, not user or revenue numbers.",
  "The homepage names the pipeline as discover, extract, verify, classify, publish. Verify is described as checking source availability, application status, freshness, and publishing eligibility. Publish is described as showing verified, searchable roles with complete descriptions and direct application paths.",
  "Public browse, as the homepage states it, shows only active, verified, canonical jobs. Application destinations are resolved and closed roles disable Apply. Search tips on the page include terms such as GTM Engineer, Salesforce, Remote, or Bengaluru, and say a salary phrase such as $150k is parsed into a minimum compensation filter when possible.",
  "The homepage lists taxonomy families with live counts, including Forward Deployed Engineer (35), AI Sales Engineer (17), and Revenue Architect (7). Conversational AI Engineer and Demand Gen Engineer showed no live examples. It names candidates exploring specialized revenue-technical work, and recruiters who need accurate classification. It explicitly does not claim 45,000 live ATS endpoints, H-1B cross-referencing, or talent alerts.",
  "This site's product record, written from the repository, names the stack as Next.js, a Python FastAPI classification worker, Supabase Postgres with pgvector, Inngest, and Vercel, and names Greenhouse, Lever, Ashby, and RemoteOK as source connectors. The homepage itself says “supported ATS and career sources” and does not list those four names. I did not re-read the repository source while writing this page.",
  "The same product record says the homepage and the jobs API had production deploys recorded in July 2026. Sign-in, profiles, resume parsing, and admin screens are implemented but not all verified in production. Saved jobs, applications, and notifications are not built. There are no user or revenue numbers.",
];

/** Plausible problems that this page does not treat as confirmed user research. */
export const hypotheses: string[] = [
  "Relevant revenue-technical openings are scattered across employer boards, so a title search misses roles whose titles do not match the work.",
  "The same opening can appear more than once, and a person cannot tell which copy is the one to trust.",
  "A description and a taxonomy label may still leave the apply-or-skip decision under-specified.",
  "Listings go stale, and a date on a card is not enough unless the reader knows what the date means.",
  "Evaluating and tracking opportunities is fragmented once the person leaves the listing.",
  "The useful outcome is a better decision about where to spend application time, not a larger pile of titles.",
];

/** Questions the public pages do not answer. */
export const openQuestions: string[] = [
  "What does the date on a listing card refer to: the employer posting date, the last verification, or the ingest time?",
  "Which fields the duplicate rule compares, and how often two sources disagree.",
  "Whether a candidate uses the taxonomy to reject a poor match, or only to browse.",
  "Whether recruiters are a real second user, or a sentence on the homepage.",
  "How often a published listing is closed, relocated, or rewritten at the source after it is shown.",
  "Whether anyone returns to a listing. Saved jobs are not built, and no return visit is measured.",
];

/** Research actions that could resolve uncertainty. None of them have been run for this page. */
export const proposedExperimentsPlan: string[] = [
  "Interviews with people currently searching for revenue-technical roles, about the last role they rejected and why.",
  "Observation of how those people search today, including boards other than RevenueRoles.",
  "Analysis of search and listing-open behavior if that event data is ever collected. It is not available now.",
  "A hand-labeled review of duplicate and stale listings against the documented matching rule.",
  "A comparison of the current taxonomy browse with one alternative discovery workflow, written down before looking at results.",
];

/** Six-stage framework. The failure modes are the point of the interaction, not decoration. */
export const frameworkStages: PmFrameworkStage[] = [
  {
    id: "discover",
    name: "Discover",
    question: "What problem is the user actually trying to solve?",
    decisions: [
      "Who the user is for this decision, and who is explicitly out of scope.",
      "Which part of the current workflow is observed, and which part is still a guess.",
      "What would count as evidence before a feature is specified.",
    ],
    artifacts: [
      "Problem statement.",
      "User segments.",
      "Current workflow.",
      "Existing alternatives.",
      "Evidence gaps.",
    ],
    evidence: "A written split between what a source shows and what is still assumed.",
    failure: "Building a feature before understanding the underlying problem.",
  },
  {
    id: "define",
    name: "Define",
    question: "What outcome would count as the problem getting smaller?",
    decisions: [
      "The decision the user is trying to make.",
      "The smallest change that would improve that decision.",
      "The outcomes that are attractive and out of scope.",
    ],
    artifacts: ["Problem statement.", "Target user.", "Desired outcome.", "Non-goals."],
    evidence: "The outcome can be observed without inventing a business result.",
    failure: "Defining success as activity on the page, with no user decision attached.",
  },
  {
    id: "prioritize",
    name: "Prioritize",
    question: "Which opportunity is worth the next unit of engineering time?",
    decisions: [
      "User value, strategic alignment, confidence, effort, and risk.",
      "What will not be built until a stated uncertainty is smaller.",
      "Whether a low score means “not valuable” or “not yet evidenced”.",
    ],
    artifacts: ["Ranked list.", "The formula.", "The assumption behind each score."],
    evidence: "Each score can be pointed at a fact, a hypothesis, or an admission of low confidence.",
    failure: "Choosing the most impressive feature, then filling in the scores to match.",
  },
  {
    id: "design",
    name: "Design",
    question: "What is the smallest interface that changes the decision?",
    decisions: [
      "What the person sees when a fact is known, old, or missing.",
      "Which existing screen changes, and which new screen is refused.",
      "How a duplicate stays traceable back to its apply link.",
    ],
    artifacts: ["Journey.", "State rules.", "Copy for uncertainty."],
    evidence: "A person can tell a missing fact from a bad fact without a legend that contradicts the label.",
    failure: "Designing a complete application suite before the decision moment is clear.",
  },
  {
    id: "deliver",
    name: "Deliver",
    question: "What has to be true in the system for the requirement to be real?",
    decisions: [
      "Where the timestamp comes from, and what null means.",
      "Which identifier survives a re-ingest.",
      "What the interface does when the check fails.",
    ],
    artifacts: ["Requirements.", "Acceptance tests.", "Engineering notes.", "Rollout limits."],
    evidence: "An engineer can test the requirement without asking what “fresh” means.",
    failure: "A requirement that cannot be tested, or a shortcut that hides missing data.",
  },
  {
    id: "measure",
    name: "Measure",
    question: "What would change your mind?",
    decisions: [
      "The metric definition, including what it cannot prove.",
      "The guardrail that would cancel a cheerful movement in a proxy.",
      "Whether the experiment has actually been run.",
    ],
    artifacts: ["Metric spec.", "Experiment design.", "Instrumentation notes."],
    evidence: "A baseline, or an explicit “not yet measured”.",
    failure: "Treating a proxy moving as proof that someone got a better job.",
  },
];

/** Case-study narrative. Status marks what kind of claim the part is making. */
export const caseParts: PmCasePart[] = [
  {
    id: "problem",
    title: "Problem framing",
    status: "hypothesis",
    paragraphs: [
      "RevenueRoles already collects and classifies revenue-technical roles. The product question for this case study is narrower than “build a job board”: how might we help someone identify relevant opportunities and decide which ones deserve their time?",
      "That question is a framing I am using here. It is not a finding from interviews. The homepage supports the first half, discovery and classification. The second half, the decision, is the gap this notebook is about.",
    ],
  },
  {
    id: "users",
    title: "Target users",
    status: "fact",
    paragraphs: [
      "The homepage names two audiences: candidates exploring specialized revenue-technical work, and recruiters who need accurate classification instead of a generic sales-operations bucket.",
      "This case study follows the candidate, because the decision to apply is the moment the current public product leaves unfinished. Recruiter workflows are named by the product and are not designed on this page. I have no evidence that either audience has been interviewed.",
    ],
  },
  {
    id: "workflow",
    title: "Existing workflow",
    status: "fact",
    paragraphs: [
      "The workflow the homepage describes is operational: discover from supported sources, extract the description, company, location, compensation, and application destination, verify eligibility, classify into the taxonomy, and publish a canonical listing with a direct application path.",
      "What a person does outside the product — several boards, a spreadsheet, a lost tab — is a hypothesis in the discovery section. I am not describing it as observed behavior.",
    ],
  },
  {
    id: "friction",
    title: "Key friction",
    status: "open",
    paragraphs: [
      "The friction I would investigate is the gap between “a role is listed” and “I know whether to apply.” Duplicate copies, an unexplained date, and a taxonomy label without a reason are the concrete forms of that gap.",
      "One product limit is not a guess: the product record says saved jobs, applications, and notifications are not built, and the homepage says the product does not claim talent alerts. Tracking after the listing is unfinished, not merely hypothesized.",
    ],
  },
  {
    id: "hypothesis",
    title: "Product hypothesis",
    status: "hypothesis",
    paragraphs: [
      "If a person can see which family a role was placed in, and can see whether the listing was checked and when, they can discard a poor or stale match with less reading. Comparison and tracking help only after that listing is trustworthy.",
      "The taxonomy is implemented. Legible freshness and a visible duplicate rule are not established by the public page. No outcome of this hypothesis has been measured.",
    ],
  },
  {
    id: "solution",
    title: "Proposed solution",
    status: "proposed",
    paragraphs: [
      "Keep the current pipeline. The next slice I would specify is not an applicant-tracking system. It is a truthful freshness label and a duplicate rule that cannot drop a working apply link.",
      "Saved search, comparison, alerts, and application tracking stay later. Each of them assumes the listing being saved is the right listing. That assumption is still open.",
    ],
  },
  {
    id: "prioritization",
    title: "Prioritization",
    status: "proposed",
    paragraphs: [
      "The explorer below ranks proposed initiatives with an explicit formula. Starting estimates put transparent classification and freshness ahead of application tracking, because tracking a stale or merged-wrong listing does not improve the decision.",
      "Those numbers are notebook estimates. Confidence is low where I have no user evidence. Changing a slider changes the ranking in the notebook. It does not change the product.",
    ],
  },
  {
    id: "experience",
    title: "User experience",
    status: "fact",
    paragraphs: [
      "What a visitor can do today, from the homepage, is search, browse a taxonomy family, open a verified listing, read the description, and follow the application path. Some cards show a Verified mark and a date. I am not claiming the date is a verification timestamp.",
      "The journey further down separates that existing path from the proposed steps: an explicit relevance judgment, a comparison, a recorded decision, and tracking. The later steps are not shipped.",
    ],
  },
  {
    id: "measurement",
    title: "Measurement",
    status: "unmeasured",
    paragraphs: [
      "A candidate north-star is the number of meaningful opportunity evaluations completed per active user in a defined period. “Meaningful” would have to be defined before anyone counts it. For example: the person opened a listing and recorded a pursue-or-skip judgment.",
      "No baseline exists. Inventory counts on the homepage are not a substitute. A rise in listing opens would not, by itself, show that anyone made a better career decision.",
    ],
  },
  {
    id: "next",
    title: "Next iteration",
    status: "proposed",
    paragraphs: [
      "The next useful work is definitional: write down what the card date means, sample duplicate groups against a written rule, and only then design a label. If the date is already a verification time, the interface work shrinks to making that meaning visible, including the unknown state.",
      "If a few conversations show that people decide from the taxonomy alone, freshness drops in the ranking. The roadmap section says what else would change the order.",
    ],
  },
];

/** What the product does now, versus what this notebook proposes. */
export const caseBoundary = {
  now: [
    "Scheduled discovery from supported ATS and career sources, extraction, eligibility verification, taxonomy classification, and publication of canonical listings.",
    "Search, including a salary phrase parsed into a minimum filter when the page can parse it.",
    "A public inventory with compensation coverage disclosed, and small salary samples withheld from averages.",
    "Closed roles disable Apply, according to the homepage.",
  ],
  proposed: [
    "A freshness label that distinguishes a known verification time, an old time, and an unknown time.",
    "Duplicate rules a reader can inspect, without losing a working apply link.",
    "An explanation of why a role sits in a taxonomy family, beyond the family name.",
    "Saved search, comparison, alerts, and application tracking. The product record says the last of these is not built, and the homepage does not claim alerts.",
  ],
};

/** Discovery workspace, grouped so facts cannot be skimmed as findings. */
export const discoveryGroups: { id: string; title: string; rows: PmDiscoveryRow[] }[] = [
  {
    id: "facts",
    title: "Verified facts",
    rows: verifiedFacts.map((body, index) => ({
      label: `Fact ${index + 1}`,
      body,
      status: "fact" as const,
    })),
  },
  {
    id: "hypotheses",
    title: "Hypotheses",
    rows: hypotheses.map((body, index) => ({
      label: `Hypothesis ${index + 1}`,
      body,
      status: "hypothesis" as const,
    })),
  },
  {
    id: "questions",
    title: "Open questions",
    rows: openQuestions.map((body, index) => ({
      label: `Question ${index + 1}`,
      body,
      status: "open" as const,
    })),
  },
  {
    id: "plan",
    title: "Proposed experiments",
    rows: proposedExperimentsPlan.map((body, index) => ({
      label: `Method ${index + 1}`,
      body,
      status: "proposed" as const,
    })),
  },
];

/** Assumptions and the evidence that would be required. None of this evidence has been collected here. */
export const assumptions: PmDiscoveryRow[] = [
  {
    label: "Primary segment",
    body: "For this case study, a candidate comparing revenue-technical roles. The homepage also names recruiters. I am not treating the recruiter as the user of the decision journey.",
    status: "hypothesis",
  },
  {
    label: "Intended outcome",
    body: "Spend application time on a small set of roles whose work matches, and skip the rest without losing the original posting.",
    status: "hypothesis",
  },
  {
    label: "Current product workflow",
    body: "Discover, extract, verify, classify, publish. That sequence is what the homepage says the system does.",
    status: "fact",
  },
  {
    label: "Constraint",
    body: "Deduplication must not drop a working apply link. That constraint is already in the product record. A freshness label must not invent a timestamp.",
    status: "fact",
  },
  {
    label: "Assumption to test",
    body: "People hesitate because the listing does not support the decision, not because they cannot find any listing at all.",
    status: "hypothesis",
  },
  {
    label: "Evidence required",
    body: "A handful of observed searches, plus a labeled sample of dates and duplicate groups. Interviews are a proposed method, not a completed study.",
    status: "unmeasured",
  },
];

/** Candidate journey from discovery to a tracked decision. Later steps are proposed. */
export const journeySteps: PmJourneyStep[] = [
  {
    id: "discover",
    title: "Discover an opportunity",
    objective: "Find revenue-technical roles without reading every unrelated title.",
    friction:
      "Hypothesis: the relevant roles are scattered, and titles disagree with the work. Fact: the product already aggregates supported sources into one taxonomy.",
    intervention:
      "Implemented: search and taxonomy browse on the live site. Proposed: saved searches. Alerts are not claimed by the homepage.",
    data: "The homepage publishes inventory counts by family. It does not publish search logs.",
    failure: "A role is classified into the wrong family, or a salary phrase is parsed into the wrong minimum.",
    measurement: "Search-to-detail rate. Baseline not yet measured. A wrong parse would show up as a guardrail, not as success.",
  },
  {
    id: "inspect",
    title: "Inspect the role",
    objective: "Read enough of the role to decide whether it is worth a closer look.",
    friction:
      "The description may be long, and the date beside the location is unexplained on the public card. Some cards show a Verified mark. I do not know the rule that earns it.",
    intervention:
      "Implemented: full description and a direct application path. Proposed: a labeled verification time, and an explicit unknown state when no time exists.",
    data: "Listing fields the homepage says are extracted: description, company, location, compensation, application destination.",
    failure: "The reader treats an ingest date as proof the employer checked the role yesterday.",
    measurement: "Share of opened listings that have a known verification time. Baseline not yet measured.",
  },
  {
    id: "evaluate",
    title: "Evaluate relevance",
    objective: "Decide whether the work, not the title, is a fit.",
    friction:
      "Hypothesis: a family label is not a reason. The homepage does describe each family with a sentence and a stack. A per-listing explanation was not visible in the sample I read.",
    intervention:
      "Implemented: taxonomy family on the listing. Proposed: a short reason tied to the text that caused the classification, with the title shown separately so a mismatch is visible.",
    data: "Family, title, and the description. No evaluation of classification accuracy is published here.",
    failure: "The reason cites a keyword and misses the actual responsibilities, and the interface presents it as certainty.",
    measurement: "In a hand-reviewed sample, the share of family labels a second reader would overturn. Not yet measured.",
  },
  {
    id: "compare",
    title: "Compare alternatives",
    objective: "Hold two or three roles next to each other and see the differences that matter.",
    friction:
      "Hypothesis: comparison happens in tabs and notes. I have not watched anyone do it. The product does not show a comparison view on the homepage.",
    intervention:
      "Proposed: a comparison of family, location, compensation disclosure, verification state, and apply link. Not built.",
    data: "Only fields the listing already has. Missing compensation stays missing. It is not estimated.",
    failure: "Comparison implies a ranking of employers. The product has no basis for that ranking.",
    measurement: "Whether people who compare record a decision more often. Not instrumented.",
  },
  {
    id: "decide",
    title: "Decide whether to apply",
    objective: "Leave with a pursue or skip decision, and a path to the original posting if the decision is pursue.",
    friction:
      "The apply path exists for an open listing. The product does not record the decision. Skipping leaves no trace, which may be fine.",
    intervention:
      "Implemented: Apply when the role is open, disabled when it is closed. Proposed: an optional pursue-or-skip note stored for the reader. Not built.",
    data: "Application URL and closed state, as the homepage describes them. No count of apply clicks is published.",
    failure: "A pursue mark is treated as an application. It is not an application.",
    measurement: "Meaningful evaluations per active user. Proposed north-star candidate. Baseline not yet measured.",
  },
  {
    id: "track",
    title: "Track the decision",
    objective: "Return to the roles that were worth pursuing, and drop the ones that went stale.",
    friction:
      "Saved jobs, applications, and notifications are not built. Tracking is a hypothesis about need, and an absence in the product.",
    intervention:
      "Proposed, and deliberately later: a saved list that shows the verification state again on return. No alerts until freshness is legible.",
    data: "There is no return-visit series. The synthetic funnel later on this page invents one so the shape can be discussed.",
    failure: "A tracker full of stale roles feels like progress and hides the fact that the underlying listing was never re-checked.",
    measurement: "Saved opportunities revisited, and stale exposure among saved roles. Both unmeasured, and the save event does not exist yet.",
  },
];

/** Starting estimates for the explorer. Confidence is low where no user evidence exists. */
export const initiatives: PmInitiative[] = [
  {
    id: "duplicates",
    title: "Better duplicate detection",
    summary: "Tighten the rule that decides two postings are the same role, and show the sources that were merged.",
    state: "Partial. The homepage says listings are canonical. The product record says deduplication is conservative so the apply link survives. The matching rule was not re-read in source for this page.",
    estimate: { userValue: 4, alignment: 5, confidence: 3, effort: 4, risk: 4 },
  },
  {
    id: "freshness",
    title: "Improved freshness indicators",
    summary: "Label the verification time, and show an unknown state when the time is missing.",
    state: "Partial. The homepage says verification checks freshness, and cards show a date. What the date means is an open question. The indicator specified in the PRD is proposed.",
    estimate: { userValue: 5, alignment: 5, confidence: 3, effort: 3, risk: 2 },
  },
  {
    id: "matching",
    title: "More transparent role matching",
    summary: "Show why a posting sits in a taxonomy family, using the description rather than the title alone.",
    state: "Partial. Family classification is live. A per-listing reason is proposed. I did not see one in the homepage sample.",
    estimate: { userValue: 4, alignment: 5, confidence: 4, effort: 3, risk: 2 },
  },
  {
    id: "alerts",
    title: "Saved searches and alerts",
    summary: "Let a person keep a search and hear about new matches.",
    state: "Not built. The homepage says the product does not claim talent alerts. This initiative stays a proposal.",
    estimate: { userValue: 4, alignment: 3, confidence: 2, effort: 4, risk: 3 },
  },
  {
    id: "compare",
    title: "Opportunity comparison",
    summary: "Place a few listings side by side on fields that are actually known.",
    state: "Proposed. I did not find a comparison view in the public homepage.",
    estimate: { userValue: 4, alignment: 4, confidence: 2, effort: 3, risk: 2 },
  },
  {
    id: "tracking",
    title: "Application tracking",
    summary: "Record which roles the person decided to pursue.",
    state: "Not built. The product record lists applications under planned work.",
    estimate: { userValue: 3, alignment: 2, confidence: 1, effort: 5, risk: 3 },
  },
  {
    id: "search",
    title: "Search-quality improvements",
    summary: "Reduce irrelevant matches and make a failed or parsed-salary search understandable.",
    state: "Partial. Search and salary parsing are described on the homepage. Further quality work is proposed. No relevance sample has been scored.",
    estimate: { userValue: 4, alignment: 4, confidence: 2, effort: 3, risk: 2 },
  },
  {
    id: "explain",
    title: "Clearer relevance explanations",
    summary: "Say, on the listing, which parts of the description drove the family label.",
    state: "Proposed. Related to transparent matching, and specified separately because the explanation can ship without changing the classifier.",
    estimate: { userValue: 5, alignment: 5, confidence: 3, effort: 3, risk: 2 },
  },
];

/** Limits of the notebook score, shown next to the formula. */
export const scoreLimitations: string[] = [
  "The 1–5 inputs are ordinal judgments, not interval measurements. A five is not “five times” a one.",
  "Confidence is my uncertainty about the evidence. It is not a statistical confidence interval.",
  "Dividing by effort punishes large work even when that work is the right work. The rank is a prompt for a conversation, not a decision by itself.",
  "The risk penalty is mild and linear. A single unacceptable risk, such as dropping apply links, should veto a design even if the score is high.",
  "None of the scores come from user research, a revenue model, or measured adoption.",
];

/** Example PRD for freshness and duplicate handling. Requirements, not a claim about current behavior. */
export const prdSections: PmPrdSection[] = [
  {
    id: "problem",
    heading: "Problem statement",
    paragraphs: [
      "A person looking at a RevenueRoles listing can see a date and, on some cards, a Verified mark. From the public homepage it is not clear whether that date is when the employer posted the role, when RevenueRoles last checked it, or when the listing was ingested. A missing check can look the same as a recent check.",
      "The homepage also says published jobs are canonical. The product record says duplicate merges must not drop the working apply link. The matching rule is not restated on the listing.",
    ],
  },
  {
    id: "context",
    heading: "Context",
    paragraphs: [
      "This is an example specification for a proposed initiative. It is not a document that engineering has accepted, and it is not a description of behavior I re-verified in source code.",
      `The homepage read on 19 October 2026 still dated its inventory 23 September 2026 and showed ${revenueRolesCheck.verifiedRoles} verified roles. That gap is a reason to care about freshness. It is not a measured rate of stale listings.`,
    ],
  },
  {
    id: "user",
    heading: "Target user and need",
    paragraphs: [
      "Target user: a candidate comparing revenue-technical roles. Recruiters are out of scope for this specification.",
      "User need: tell whether a listing was checked, and tell when that fact is absent, before spending time on an application.",
      "Desired outcome: the reader can distinguish a known verification time, an old verification time, and an unknown time, and can still reach every working apply link that was merged into the canonical listing.",
    ],
  },
  {
    id: "scope",
    heading: "Scope",
    items: [
      "A public label for verification time on a listing that already has one.",
      "An explicit unknown state when the timestamp is null.",
      "A written duplicate rule, and retention of each source apply link that entered a merged group.",
      "Copy and acceptance tests that an engineer can implement without inventing a definition of “fresh”.",
    ],
  },
  {
    id: "nongoals",
    heading: "Non-goals",
    items: [
      "Inventing a timestamp for listings that do not have one.",
      "Talent alerts, saved search, or application tracking.",
      "Estimating salary when the source did not disclose it.",
      "Claiming a lower duplicate rate before a labeled sample exists.",
      "A recruiter product.",
    ],
  },
  {
    id: "stories",
    heading: "User stories",
    items: [
      "As a job seeker, I want to see when a listing was last verified so that I can decide whether to pursue it.",
      "As a job seeker, I want a missing verification time to look missing, so that I do not mistake silence for a recent check.",
      "As a job seeker, I want each source apply link kept when two postings are merged, so that a merge cannot send me to a dead page.",
    ],
  },
  {
    id: "functional",
    heading: "Functional requirements",
    items: [
      "If a listing has a verification timestamp, the listing shows that timestamp with the words “Last verified”. The unlabeled date currently on the card is not reused unless its meaning is confirmed.",
      "If the verification timestamp is null, the listing shows “Verification time unknown”. It does not show “fresh”, “recently verified”, or a relative time.",
      "An old timestamp is shown as a date. Age alone does not mark the job closed. Closed remains a separate state. The homepage already says closed roles disable Apply.",
      "Duplicate detection follows a written rule: the fields that must match, the fields that may differ, and which source wins a conflict. Until that rule is written down in the repository, this requirement is not implementable.",
      "A merged listing keeps every working apply URL that entered the group. The canonical card links to them.",
      "Two listings that fail the rule remain two listings.",
    ],
  },
  {
    id: "nonfunctional",
    heading: "Non-functional requirements",
    items: [
      "Unknown and known-old are distinguishable by text, not by color alone.",
      "The timestamp is shown with its timezone, or labeled UTC.",
      "A null timestamp does not block the listing from rendering.",
      "The label does not add a request that fails the page when the field is absent.",
    ],
  },
  {
    id: "acceptance",
    heading: "Acceptance criteria",
    items: [
      "A listing with a known verification timestamp displays that timestamp and the label “Last verified”.",
      "A listing with a null timestamp shows “Verification time unknown” and does not receive a fabricated freshness label.",
      "A listing whose timestamp is older than the display threshold still shows the timestamp. It is not relabeled as closed.",
      "Duplicate detection follows the documented matching rule. Listings outside the rule are not merged.",
      "After a merge, each source apply URL that entered the group is still reachable from the canonical listing.",
      "The interface distinguishes a missing timestamp from an old timestamp without relying on color alone.",
    ],
  },
  {
    id: "dependencies",
    heading: "Dependencies",
    paragraphs: [
      "Confirm whether a verification timestamp already exists in the data model, and whether the date on the public card is that field. I have not confirmed the column in this pass. If the field does not exist, the first implementation task is to store null, not to backfill a guess.",
      "The duplicate rule has to be written where the pipeline can be tested. The product record describes the intent. It does not quote the predicate.",
    ],
  },
  {
    id: "risks",
    heading: "Risks",
    items: [
      "Labeling an ingest time as a verification time would make the product look more certain than it is.",
      "A loose duplicate rule can merge two different jobs that share a title.",
      "A strict rule can leave obvious duplicates side by side. That is preferable to a wrong merge, and it should be an explicit choice.",
      "Hiding one of the apply links is the failure the product record already refuses.",
    ],
  },
  {
    id: "rollout",
    heading: "Rollout strategy",
    paragraphs: [
      "Proposed, not scheduled. Ship the label as read-only copy on public listings. Do not backfill timestamps. Listings without a value stay unknown.",
      "Do not run an experiment until the label is truthful. A test of a misleading label would measure the wrong thing.",
    ],
  },
  {
    id: "measurement",
    heading: "Measurement plan",
    paragraphs: [
      "After the label exists: the share of listings with an unknown verification time, the share whose known time is older than a pre-declared threshold, and the incorrect-merge rate on a hand-labeled sample.",
      "Baseline not yet measured. Apply clicks are not a substitute. A change in those clicks would not show that someone made a better decision about a job.",
    ],
  },
];

/** Metric specs. Every baseline is unmeasured. The north star is a candidate, not an adopted metric. */
export const metrics: PmMetric[] = [
  {
    id: "north-star",
    name: "Meaningful evaluations per active user",
    group: "North-star candidate",
    definition:
      "The number of listing-level pursue-or-skip judgments recorded by active users, divided by active users, over the window. “Meaningful” means a recorded judgment, not a page view.",
    numerator: "Recorded pursue-or-skip judgments.",
    denominator: "Users with at least one listing view in the window.",
    window: "Not chosen. A 28-day window is a reasonable proposal, not a standard the product uses.",
    source: "Does not exist. Application tracking and the judgment event are not built.",
    segmentation: "Proposed: taxonomy family, and whether compensation was disclosed. Not available.",
    limitation:
      "Even a well-counted judgment does not prove a better job outcome. The metric stops at the decision.",
    why: "It ties the product to the decision the case study is about, instead of to raw traffic.",
  },
  {
    id: "discovered",
    name: "Relevant listings discovered",
    group: "Input",
    definition: "Listings shown in search or browse that a labeled sample judges relevant to the query or family.",
    numerator: "Relevant listings in the sample.",
    denominator: "Listings in the sample.",
    window: "The sample’s collection window. Not set.",
    source: "Would require a labeled sample. The homepage inventory is a count of published listings, not a relevance rate.",
    segmentation: "Query class, including salary-parsed queries versus plain text.",
    limitation: "“Relevant” has to be defined before the sample is drawn, or the label will follow the result.",
    why: "Discovery quality is the input to every later decision. A larger inventory is not the same thing.",
  },
  {
    id: "search-detail",
    name: "Search-to-detail rate",
    group: "Input",
    definition: "Searches that are followed by a listing open, divided by searches.",
    numerator: "Searches with at least one subsequent listing open in the session.",
    denominator: "Searches.",
    window: "Session, proposed.",
    source: "Not instrumented in any published dataset.",
    segmentation: "Family and whether the query contained a salary phrase.",
    limitation: "A high rate can mean the results were relevant, or that the titles were too vague to judge without opening.",
    why: "It is the first sign that a result was worth inspecting. It is only a sign.",
  },
  {
    id: "detail-save",
    name: "Detail-to-save rate",
    group: "Input",
    definition: "Listing opens that are followed by a save, divided by listing opens.",
    numerator: "Saves.",
    denominator: "Listing opens.",
    window: "Session, proposed.",
    source: "Saved jobs are not built, so the numerator cannot be collected.",
    segmentation: "Family.",
    limitation: "Saving is not a decision to apply. People may save because they are unsure.",
    why: "It would describe whether the listing gave someone a reason to keep it. It cannot be measured yet.",
  },
  {
    id: "revisits",
    name: "Saved opportunities revisited",
    group: "Input",
    definition: "Saved listings opened again on a later day, divided by saves.",
    numerator: "Saves with a later open.",
    denominator: "Saves.",
    window: "28 days after the save, proposed.",
    source: "Not instrumented. The save does not exist.",
    segmentation: "Verification state at the time of the return visit.",
    limitation: "A revisit can mean continued interest or forgotten clutter.",
    why: "Tracking only helps if people come back. That has to be checked, not assumed.",
  },
  {
    id: "time-to-relevant",
    name: "Time to a relevant opportunity",
    group: "Input",
    definition: "Time from the start of a session to the first listing the person saves or marks pursue.",
    numerator: "Not a count. A median duration.",
    denominator: "Sessions that reach a save or a pursue mark.",
    window: "Session.",
    source: "Not instrumented.",
    segmentation: "New versus returning, if accounts are in production. Signed-in features are not all verified in production.",
    limitation: "Faster is not better if the person is skipping the description.",
    why: "The job-to-be-done is a decision in a reasonable amount of time, not an endless board.",
  },
  {
    id: "duplicate-rate",
    name: "Duplicate listing rate",
    group: "Input",
    definition: "In a hand-labeled sample, the share of published listings that still have a separate duplicate.",
    numerator: "Listings with a missed duplicate.",
    denominator: "Listings in the sample.",
    window: "The day the sample is drawn.",
    source: "Not measured. Canonical publication is a product claim, not a published error rate.",
    segmentation: "Source pair, such as two ATS copies of one role.",
    limitation: "The rate depends on the rule used by the labeler. The rule has to be frozen first.",
    why: "It tells us whether “canonical” is holding, without treating a merge as automatically correct.",
  },
  {
    id: "freshness-rate",
    name: "Listing freshness rate",
    group: "Input",
    definition: "The share of published listings whose verification time is within a pre-declared age.",
    numerator: "Listings with a known verification time inside the threshold.",
    denominator: "Published listings. Unknown times stay in the denominator and fail this rate.",
    window: "A daily snapshot, proposed.",
    source: "Not measured. The homepage “updated” date is not this rate.",
    segmentation: "Source, and taxonomy family.",
    limitation: "A fresh check of a closed role is not a fresh opportunity. Closed state has to be separate.",
    why: "The 23 September inventory date, still showing on 19 October, is a reason to define this before adding alerts.",
  },
  {
    id: "unknown-status",
    name: "Unverifiable status",
    group: "Guardrail",
    definition: "The share of published listings with no verification timestamp.",
    numerator: "Listings with a null verification time.",
    denominator: "Published listings.",
    window: "Daily snapshot, proposed.",
    source: "Not measured.",
    segmentation: "Source.",
    limitation: "A high rate may be honest rather than bad. The failure is hiding it.",
    why: "It stops the interface from looking certain when the pipeline did not check.",
  },
  {
    id: "bad-merge",
    name: "Incorrect duplicate-merging rate",
    group: "Guardrail",
    definition: "In a hand-labeled sample of merged groups, the share that combined two different jobs or dropped an apply link.",
    numerator: "Incorrect groups.",
    denominator: "Merged groups in the sample.",
    window: "The sample.",
    source: "Not measured.",
    segmentation: "Source pair.",
    limitation: "A small sample can miss a rare bad merge. A single bad merge that drops an apply link is still a release blocker.",
    why: "The product record already treats a lost apply link as unacceptable. The rate makes that testable.",
  },
  {
    id: "irrelevant",
    name: "Irrelevant results in a sample",
    group: "Guardrail",
    definition: "The share of results a frozen rubric marks irrelevant.",
    numerator: "Irrelevant results.",
    denominator: "Results in the evaluated sample.",
    window: "The sample.",
    source: "Not measured.",
    segmentation: "Query type.",
    limitation: "One reviewer’s rubric is not a user. The rubric still has to be written before the sample.",
    why: "Search-quality work needs a ceiling on harm, not only a story about better matching.",
  },
  {
    id: "stale-exposure",
    name: "Stale listing exposure",
    group: "Guardrail",
    definition: "Opens of listings whose verification time is missing or older than the threshold, divided by listing opens.",
    numerator: "Opens of stale or unknown listings.",
    denominator: "Listing opens.",
    window: "28 days, proposed.",
    source: "Not instrumented.",
    segmentation: "Family.",
    limitation: "Exposure is not harm. Some older roles are still open. The closed flag has to be read beside the age.",
    why: "It asks whether people are spending attention on listings the pipeline has not re-checked.",
  },
  {
    id: "search-failures",
    name: "Search failures",
    group: "Guardrail",
    definition: "Searches that error, time out, or return no results because the query could not be parsed, divided by searches.",
    numerator: "Failed searches.",
    denominator: "Searches.",
    window: "Daily, proposed.",
    source: "Not published.",
    segmentation: "Salary-parsed queries versus other queries.",
    limitation: "A zero-result search can be a true empty inventory. It should be labeled differently from a parser failure.",
    why: "A relevance improvement that breaks salary parsing would be a regression.",
  },
];

/** Proposed experiment. The copy must keep saying that it has not been run. */
export const experimentBlocks: PmExperimentBlock[] = [
  {
    id: "hypothesis",
    title: "Hypothesis",
    body: [
      "Showing a clearer freshness label will help users make better-informed decisions about whether to pursue a job opportunity.",
      "“Better-informed” means the person can tell a known time from an unknown time, and is less likely to treat a missing time as a recent check. It does not mean they receive more interviews.",
    ],
  },
  {
    id: "users",
    title: "Target users",
    body: [
      "Candidates using public search or taxonomy browse. Signed-in users are not the population, because those features are not all verified in production.",
      "Recruiters are excluded. The homepage names them, and this experiment does not study them.",
    ],
  },
  {
    id: "intervention",
    title: "Proposed intervention",
    body: [
      "On the listing, show “Last verified” with a timestamp when one exists, and “Verification time unknown” when it does not. Show the date even when it is old. Do not add a badge that says fresh.",
      "This is a proposed change. It is not the current card, and it has not been shipped for a test.",
    ],
  },
  {
    id: "comparison",
    title: "Comparison",
    body: [
      "The comparison is the current card: a date whose meaning is unlabeled, plus a Verified mark on some listings.",
      "A fair test requires the underlying timestamp to mean the same thing in both groups. If the current date is not a verification time, the comparison is not ready.",
    ],
  },
  {
    id: "primary",
    title: "Primary metric",
    body: [
      "Among people who open a listing, the share who can correctly state whether the verification time is known, in a short follow-up question.",
      "A secondary product metric is the pursue-or-skip judgment rate. That event is not built, so it cannot be primary until it exists.",
    ],
  },
  {
    id: "guardrails",
    title: "Guardrails",
    body: [
      "The share of listings labeled with a time that is not a verification time. The acceptable rate is zero.",
      "Apply-link errors, search failures, and time-to-render of the listing.",
      "The incorrect-merge rate does not belong in this test unless the duplicate rule ships in the same change. Mixing them confounds the result.",
    ],
  },
  {
    id: "sample",
    title: "Sample and data",
    body: [
      "No sample size is calculated here, because there is no baseline rate and no published traffic. Inventing a power calculation would pretend both exist.",
      "The minimum before a readout would be: a known meaning for the timestamp, event logging that distinguishes unknown from known, and enough opens that a pre-written decision rule can be applied. Those conditions are unmet.",
    ],
  },
  {
    id: "confounders",
    title: "Confounding factors",
    body: [
      "A family with more inventory, such as forward-deployed roles in the 23 September snapshot, will dominate a site-wide rate.",
      "The inventory’s age. A test run on a corpus last updated weeks earlier measures that corpus, not the label in general.",
      "People who already know the employer will not use the label the same way as people who do not.",
    ],
  },
  {
    id: "decision",
    title: "Decision criteria",
    body: [
      "Proceed to keep the label only if comprehension of known versus unknown improves and the mislabel guardrail stays at zero.",
      "Do not ship on the strength of more listing opens. Opens are not the hypothesis.",
      "If comprehension does not change, remove the extra words rather than adding a stronger badge.",
    ],
  },
  {
    id: "followup",
    title: "Follow-up",
    body: [
      "If the label is understood, the next question is whether people change pursue-or-skip judgments. That requires the judgment to be recorded.",
      "A positive result on a proxy does not prove improved job outcomes. This experiment cannot see offers, interviews, or fit after hiring.",
    ],
  },
];

/** Funnel steps. Later steps are proposed events. The counts are synthetic and live beside these ids. */
export const funnelSteps: PmFunnelStep[] = [
  {
    id: "discovered",
    name: "Opportunity discovered",
    event: "opportunity_discovered",
    instrumentation:
      "A listing entered a result set the person actually saw. A listing that exists in the database and was not shown does not count.",
  },
  {
    id: "viewed",
    name: "Opportunity detail viewed",
    event: "opportunity_detail_viewed",
    instrumentation: "The person opened the listing. A scroll impression on a card is not a detail view.",
  },
  {
    id: "saved",
    name: "Opportunity saved",
    event: "opportunity_saved",
    instrumentation:
      "Proposed event. Saved jobs are not built, so this event is not collected. The synthetic count is not a backlog of real saves.",
  },
  {
    id: "revisited",
    name: "Opportunity revisited",
    event: "opportunity_revisited",
    instrumentation: "Proposed event. A detail view on a later calendar day than the save. Same-day reopens do not count.",
  },
  {
    id: "intent",
    name: "Application intent recorded",
    event: "application_intent_recorded",
    instrumentation:
      "Proposed event. A pursue mark. It is not an application, and it is not an apply click. Applications are not built.",
  },
];

/** Synthetic counts keyed by `${segment}:${window}`. They are demonstration data, not analytics. */
export const syntheticFunnel: Record<string, number[]> = {
  "all:28d": [240, 96, 28, 11, 4],
  "all:7d": [60, 22, 6, 2, 1],
  "fde:28d": [140, 70, 18, 9, 3],
  "fde:7d": [36, 15, 4, 1, 0],
  "gtm:28d": [22, 8, 1, 0, 0],
  "gtm:7d": [5, 2, 0, 0, 0],
};

/** Filter options for the synthetic funnel. */
export const syntheticSegments = [
  { id: "all", label: "All families" },
  { id: "fde", label: "Forward deployed" },
  { id: "gtm", label: "GTM engineer" },
] as const;

/** Window options for the synthetic funnel. The 7-day series is not a slice of the 28-day series. */
export const syntheticWindows = [
  { id: "28d", label: "28-day sample" },
  { id: "7d", label: "7-day sample" },
] as const;

/**
 * Ratio of one synthetic step to the previous step, as a whole-number percent.
 * Returns null when the previous step is 0, so the interface can show an em dash instead of a fake rate.
 */
export function syntheticStepRatio(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round((current / previous) * 100);
}

/** What the synthetic funnel can and cannot support. */
export const analyticsLimits: string[] = [
  "Every count on the chart is invented for this page. It is not RevenueRoles traffic, and it is not a forecast.",
  "The 7-day series is a separate illustration. It is not computed from the 28-day series.",
  "Steps from “saved” onward describe events that are not implemented. A zero means the illustration has a zero, not that the product measured zero.",
  "The chart cannot say whether the taxonomy is accurate, whether listings are fresh, or whether anyone got a job.",
  "A real funnel would need event definitions, a privacy review, and a baseline. None of those exist here.",
];

/** Engineering chain for the proposed freshness and duplicate work. */
export const engineeringSteps: PmEngineeringStep[] = [
  {
    id: "problem",
    title: "User problem",
    state: "hypothesis",
    body: "A candidate cannot tell whether a listing was checked, or whether two similar cards are one role. The need is a hypothesis. The missing save and application features are a product-record fact.",
  },
  {
    id: "requirement",
    title: "Product requirement",
    state: "proposed",
    body: "Show a verification timestamp when it exists, show unknown when it does not, and keep every apply link that entered a duplicate group. The acceptance criteria are in the PRD. They are examples, not shipped tests.",
  },
  {
    id: "design",
    title: "Technical design",
    state: "proposed",
    body: "Store verification time separately from first-seen and from any employer posting date. Use a stable listing id that survives a re-ingest. Attach source records, each with its own apply URL, to a canonical id. Null is a value the API returns, not a field the client invents. This design is proposed. I have not confirmed the current schema in this pass.",
  },
  {
    id: "task",
    title: "Implementation task",
    state: "proposed",
    body: "Not scheduled. The work would be a migration that adds a nullable verification timestamp, a contract test for the duplicate predicate, and a UI state for known, old, and unknown. No backfill.",
  },
  {
    id: "test",
    title: "Acceptance test",
    state: "proposed",
    body: "A fixture with a timestamp renders “Last verified” and the time. A fixture with null renders “Verification time unknown”. A fixture pair inside the rule merges and keeps both URLs. A pair outside the rule does not merge. A closed listing still disables Apply.",
  },
  {
    id: "release",
    title: "Release",
    state: "proposed",
    body: "Read-only label first. No alert, no experiment, and no rewrite of historical rows. Backward compatible: clients that ignore the new field keep their current behavior. Failure to load the field degrades to the unknown state rather than hiding the listing.",
  },
  {
    id: "outcome",
    title: "Outcome measurement",
    state: "proposed",
    body: "Unknown-status share, freshness rate, and incorrect-merge rate on a labeled sample. Baseline not yet measured. Listing opens are not the outcome.",
  },
];

/** Technical considerations listed beside the chain so the product decision has an engineering cost. */
export const engineeringConcerns: { title: string; body: string }[] = [
  {
    title: "Data provenance",
    body: "Each displayed fact needs a source: employer page, ingest, or verification check. A field with no source stays empty.",
  },
  {
    title: "Stable listing identifiers",
    body: "Re-discovery has to update a listing rather than mint a new public URL. The product record already cares about canonical listings. The id strategy is not restated here as source I have re-read.",
  },
  {
    title: "Duplicate detection",
    body: "The predicate has to be testable with fixtures. A model score without a threshold and a counterexample is not a rule.",
  },
  {
    title: "Timestamp normalization",
    body: "Source times arrive in different zones. Store UTC, display the zone, and do not coerce a date-only value into a false-precision timestamp.",
  },
  {
    title: "Unknown freshness",
    body: "Null is different from old. The API and the interface both have to represent it. A default of “now” is a defect.",
  },
  {
    title: "Search performance",
    body: "A freshness filter cannot turn the listing query into a scan that times out. If the filter is too expensive, it waits. The label can ship before the filter.",
  },
  {
    title: "Failure states",
    body: "If the verification lookup fails, the listing still renders and the label says unknown. The page does not invent a successful check.",
  },
  {
    title: "Backward compatibility",
    body: "Existing listing payloads gain a nullable field. They do not change the meaning of the current date until that meaning is confirmed.",
  },
  {
    title: "Observability",
    body: "Count null timestamps, merge decisions, and merge conflicts. Do not alert a human on a vanity dashboard that has no baseline.",
  },
];

/** Outcome roadmap. Every item is proposed unless the text says the underlying capability is already live. */
export const roadmap: PmRoadmapItem[] = [
  {
    id: "quality",
    title: "Improve opportunity data quality",
    problem: "Canonical and verified are product claims. The date’s meaning, duplicate errors, and stale rows are not published as rates.",
    benefit: "A person can trust that a listing is one role, and can see when it was checked.",
    dependencies: "A written duplicate predicate and a nullable verification timestamp.",
    confidence: "Low. The pipeline exists. The error rates do not.",
    effort: "Medium for the label. Higher if the timestamp is not stored.",
    risk: "A bad merge drops an apply link, or a label overclaims a check.",
    measure: "Unknown-status share and incorrect-merge rate. Baseline not yet measured.",
  },
  {
    id: "discovery",
    title: "Improve discovery and relevance",
    problem: "Search and taxonomy browse exist. Relevance has not been sampled, and salary parsing can fail quietly.",
    benefit: "Fewer openings that do not match the work the person asked for.",
    dependencies: "A frozen relevance rubric and a sample. Not a new model by default.",
    confidence: "Low. No labeled sample.",
    effort: "Medium.",
    risk: "Optimizing a proxy such as opens, and making salary queries worse.",
    measure: "Irrelevant share in a pre-registered sample, and search-failure rate.",
  },
  {
    id: "evaluate",
    title: "Help users evaluate opportunities",
    problem: "Family labels are live. A reason for the label, and a comparison that refuses to invent missing fields, are not.",
    benefit: "The skip decision takes less rereading, and missing pay stays missing.",
    dependencies: "Classification already returns a family. An explanation needs the features that produced it, which I have not confirmed are stored.",
    confidence: "Medium that the family is useful. Low that an explanation is necessary. That split is why confidence is an input in the explorer.",
    effort: "Medium.",
    risk: "An explanation that sounds certain and cites the wrong sentence.",
    measure: "Overturn rate in a second-reader sample. Not yet measured.",
  },
  {
    id: "tracking",
    title: "Support ongoing opportunity tracking",
    problem: "Saved jobs, applications, and notifications are not built. The homepage does not claim alerts.",
    benefit: "A person can return to a role they already judged worth pursuing.",
    dependencies: "A trustworthy listing. Tracking a stale or wrongly merged role makes the earlier problem worse.",
    confidence: "Low. No evidence yet that people want this inside the product.",
    effort: "High relative to a label, and it touches accounts that are not all verified in production.",
    risk: "Building a tracker before the decision problem is understood.",
    measure: "Revisit rate among saves. The event does not exist.",
  },
  {
    id: "value",
    title: "Measure whether the experience creates user value",
    problem: "Inventory counts are the only public numbers, and they are not user outcomes.",
    benefit: "The next product decision can be changed by evidence.",
    dependencies: "Event definitions, a privacy review, and a decision about what “meaningful evaluation” means.",
    confidence: "High that measurement is missing. Low about which metric will survive contact with data.",
    effort: "Small to define. Larger to instrument.",
    risk: "Instrumenting everything and then narrating a proxy as success.",
    measure: "A published baseline for one input metric and one guardrail. Not yet measured.",
  },
];

/** Features that are easy to want and should wait. */
export const nonGoals: string[] = [
  "A general job board for every profession. The taxonomy is the product’s constraint, and widening it is a different product.",
  "Talent alerts before listing quality is understood. The homepage already says they are not claimed.",
  "H-1B cross-referencing, or a claim of tens of thousands of ATS endpoints. The homepage disclaims both.",
  "Application tracking before a person can trust the listing they would be tracking.",
  "A recruiter CRM, outbound tooling, or a revenue number. None of those exist for this product.",
  "Estimated compensation where the source disclosed none. The homepage already refuses tiny-sample averages.",
];

/** What would move the roadmap. These are conditions, not predictions. */
export const roadmapTriggers: string[] = [
  "If the card date is already a verification time, the freshness project shrinks to labeling it and representing null.",
  "If a labeled sample shows few missed duplicates and no lost apply links, duplicate work drops below search quality.",
  "If conversations show people decide from the family label alone, explanation work drops.",
  "If people do not want to decide inside the product, tracking stays unbuilt.",
  "If a source’s terms or reliability change, discovery scope changes before any new feature does.",
];

/** Candid close of the case. Each item is tagged in the sentence so it cannot be read as a result. */
export const learnings: { title: string; body: string; status: PmDiscoveryRow["status"] }[] = [
  {
    title: "What the product already supports",
    body: "A live path from supported sources to a classified, canonical listing with an apply link, a public inventory, disclosed compensation limits, and an explicit refusal of a few inflated claims.",
    status: "fact",
  },
  {
    title: "What is incomplete",
    body: "The decision after discovery. Saved jobs, applications, and notifications are not built. Signed-in features are implemented and not all verified in production. The meaning of the card date is unresolved.",
    status: "fact",
  },
  {
    title: "Assumptions that need validation",
    body: "That people are blocked by the decision, not by discovery. That a family label is not enough. That anyone wants tracking inside this product. None of these have been tested with users.",
    status: "hypothesis",
  },
  {
    title: "What to measure next",
    body: "Define the card date. Label a sample of duplicate groups. Only then instrument listing opens. A baseline for any rate on this page is not yet measured.",
    status: "unmeasured",
  },
  {
    title: "Which improvement matters first",
    body: "Make freshness and duplicate state legible. Tracking and alerts are easier to demo and worse to build first, because they multiply whatever is wrong with the listing.",
    status: "proposed",
  },
  {
    title: "Risks that remain",
    body: "A merge that drops an apply link. A freshness label that invents certainty. A roadmap that grows saved-search features because they are recognizable, while the open questions are still open.",
    status: "open",
  },
];

/** Other work, with URLs taken from the product and project records except the revopy console. */
export const otherWork: PmOtherWork[] = [
  {
    title: revenueRoles.title,
    demonstrates:
      "A pipeline with a named sequence and a public constraint: classify by the work, keep a canonical listing, and do not pretend alerts or user counts exist. This case study is about the decision that pipeline does not yet support.",
    links: [
      { href: revenueRoles.demoUrl ?? "https://revenueroles.in", label: "Live site", external: true },
      { href: revenueRoles.githubUrl ?? "https://github.com/ayushrai-hub/RevenueRoles", label: "Repository", external: true },
      { href: "/products/revenueroles", label: "Product record" },
    ],
  },
  {
    title: engine.title,
    demonstrates:
      "A staged decision system on fictional data: an ICP, deterministic scoring, research text kept separate from the score, and a human approval gate before export. It shows how to specify a workflow and a stop rule. It shows no real pipeline results. The console I opened at revopy.vercel.app presents eight stages from ICP to output. The project record’s demo field is a different URL.",
    links: [
      { href: "https://revopy.vercel.app/", label: "Console", external: true },
      ...(engine.links?.demo ? [{ href: engine.links.demo, label: "Recorded demo", external: true }] : []),
      ...(engine.links?.github ? [{ href: engine.links.github, label: "Repository", external: true }] : []),
      { href: "/projects#revenue-intelligence-engine", label: "Project record" },
    ],
  },
  {
    title: agenyra.title,
    demonstrates:
      "Publishing the stage of a product so a waitlist cannot be described as launched discovery. The public site and waitlist are up. The product graph is not in the public repository. The product point is the boundary, not a growth story.",
    links: [
      { href: agenyra.demoUrl ?? "https://agenyra.space/", label: "Live site", external: true },
      { href: agenyra.githubUrl ?? "https://github.com/ayushrai-hub/AGENYRA_product", label: "Repository", external: true },
      { href: "/products/agenyra", label: "Product record" },
    ],
  },
  {
    title: spiderweb.title,
    demonstrates:
      "Choosing one user and one dataset: a person’s own LinkedIn export, resolved locally, with duplicates counted and no production deployment. The product decision is the narrow scope.",
    links: [
      ...(spiderweb.links?.github
        ? [{ href: spiderweb.links.github, label: "Repository", external: true }]
        : []),
      { href: "/projects#spiderweb", label: "Project record" },
    ],
  },
  {
    title: openFramework.title,
    demonstrates:
      "Making an institutional coordination problem visitable without pretending the verification backend exists. The public site is a front-end prototype with mock sign-in. That limit is the product decision worth keeping visible.",
    links: [
      { href: openFramework.demoUrl ?? "https://the-open-frameworks.vercel.app/", label: "Live site", external: true },
      { href: openFramework.githubUrl ?? "https://github.com/ayushrai-hub/the-open-framework", label: "Repository", external: true },
      { href: "/products/the-open-framework", label: "Product record" },
    ],
  },
];

/** On-page navigation. Order matches the sections. */
export const productManagementToc = [
  { id: "framework", label: "Framework" },
  { id: "case-study", label: "Case study" },
  { id: "discovery", label: "Discovery" },
  { id: "journey", label: "Journey" },
  { id: "prioritize", label: "Prioritize" },
  { id: "prd", label: "Requirements" },
  { id: "metrics", label: "Metrics" },
  { id: "experiment", label: "Experiment" },
  { id: "analytics", label: "Analytics" },
  { id: "engineering", label: "Engineering" },
  { id: "roadmap", label: "Roadmap" },
  { id: "learnings", label: "Learnings" },
  { id: "other-work", label: "Other work" },
] as const;

/**
 * Markdown body for `/pow/product-management.md`.
 * It carries the same distinctions as the page: facts, hypotheses, a proposed experiment, and synthetic analytics.
 */
export function renderProductManagementBody(): string {
  const sections = [
    "I turn ambiguous problems into products people can use.",
    "",
    "I work across problem discovery, product strategy, prioritization, engineering, and measurement to build products that solve practical problems.",
    "",
    "Start with the problem. Make the trade-offs explicit. Ship the smallest useful solution. Measure what happens. Improve from evidence.",
    "",
    "This page is a notebook about RevenueRoles. It is not a claim of product-management leadership, and it reports no user or revenue outcomes.",
    "",
    "## Verified facts",
    "",
    ...verifiedFacts.map((fact) => `- ${fact}`),
    "",
    "## Hypotheses",
    "",
    ...hypotheses.map((item) => `- ${item}`),
    "",
    "## Open questions",
    "",
    ...openQuestions.map((item) => `- ${item}`),
    "",
    "## Scoring formula",
    "",
    explainScore(DEFAULT_WEIGHTS),
    "",
    ...scoreLimitations.map((item) => `- ${item}`),
    "",
    "## Experiment",
    "",
    "The freshness-label experiment is proposed. It has not been run. No statistical significance is claimed.",
    "",
    "## Analytics",
    "",
    "The funnel counts on the HTML page are synthetic demonstration data. They are not RevenueRoles performance. Baseline not yet measured.",
    "",
    `Live product: ${revenueRoles.demoUrl}`,
    `Repository: ${revenueRoles.githubUrl}`,
  ];
  return sections.join("\n");
}
