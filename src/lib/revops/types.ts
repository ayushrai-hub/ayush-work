/**
 * Types for the REVFLOW revenue-operations demonstration.
 *
 * REVFLOW is a name for this portfolio page, not a shipped product. The types describe
 * synthetic prospects, heuristic matches, simulated enrichment, routing, and CRM writes.
 * Nothing here talks to a CRM, an enrichment vendor, or a mailbox.
 *
 * Connects to:
 * - src/lib/revops/fixtures.ts, engine.ts, and checks.ts.
 * - src/components/pow/revops/RevopsWorkbench.tsx.
 */

/** Where a synthetic prospect arrived from. */
export type SourceId =
  | "website_demo"
  | "csv_import"
  | "event"
  | "product_signup"
  | "referral"
  | "enrichment_file";

/** A field on the canonical prospect after mapping. */
export type CanonicalField =
  | "accountName"
  | "domain"
  | "contactName"
  | "email"
  | "jobTitle"
  | "department"
  | "seniority"
  | "employeeRange"
  | "industry"
  | "country"
  | "intent"
  | "ownerHint"
  | "lifecycle"
  | "lastActivity";

/** One inbound row before mapping. Field names differ by source on purpose. */
export interface RawRecord {
  id: string;
  source: SourceId;
  receivedAt: string;
  idempotencyKey: string;
  fields: Record<string, string>;
}

/** Where a canonical value came from. */
export interface FieldProvenance {
  field: string;
  value: string;
  source: string;
  recordedAt: string;
  rawKey: string;
  rawValue: string;
}

/** A validation problem that stays on the record instead of dropping it. */
export interface ValidationIssue {
  field: string;
  code: "missing" | "invalid_syntax" | "invalid_enum" | "generic_inbox";
  message: string;
}

/** A prospect in the canonical shape. */
export interface CanonicalRecord {
  id: string;
  source: SourceId;
  receivedAt: string;
  idempotencyKey: string;
  accountName: string;
  domain: string;
  contactName: string;
  email: string;
  jobTitle: string;
  department: string;
  seniority: string;
  employeeRange: string;
  industry: string;
  country: string;
  intent: string;
  ownerHint: string;
  lifecycle: string;
  lastActivity: string;
  provenance: FieldProvenance[];
  unmapped: { key: string; value: string }[];
  issues: ValidationIssue[];
}

/** Why two records were compared, and the points that rule added. */
export interface MatchReason {
  rule: string;
  points: number;
  detail: string;
}

/** A heuristic pair. The score is a rule total, not a calibrated probability. */
export interface DuplicatePair {
  id: string;
  leftId: string;
  rightId: string;
  kind: "contact" | "account" | "review";
  heuristicScore: number;
  autoMergeAllowed: boolean;
  reasons: MatchReason[];
  explanation: string;
}

/** What a visitor decided to do with a pair. */
export type ResolutionAction = "merge" | "separate" | "review";

/** How a surviving field was chosen during a merge. */
export interface FieldDecision {
  field: string;
  kept: string;
  dropped: string;
  reason: string;
}

/** Canonical record plus the merge audit. */
export interface RecordView extends CanonicalRecord {
  mergedFrom: string[];
  decisions: FieldDecision[];
}

/** One proposed enrichment value from the local fixture. */
export interface EnrichmentProposal {
  field: string;
  current: string;
  proposed: string;
  source: string;
  observedAt: string;
  reliability: "fixture" | "stale_fixture" | "failed" | "rate_limited" | "unavailable";
  freshness: "current" | "stale" | "unknown" | "unavailable";
  conflict: boolean;
  needsReview: boolean;
  recommendation: "accept" | "keep" | "review";
  note: string;
}

/** Fit weights. They sum to 1. */
export interface ScoreWeights {
  industry: number;
  size: number;
  seniority: number;
}

/** One line in a score explanation. */
export interface ScoreContribution {
  dimension: "fit" | "intent" | "engagement" | "confidence";
  label: string;
  points: number;
  note: string;
}

/** Four separate readings. The band is an illustration, not a purchase probability. */
export interface ScoreBreakdown {
  fit: number;
  intent: number;
  engagement: number;
  confidence: number;
  band: string;
  contributions: ScoreContribution[];
  formula: string;
}

/** A fictional seller used by the routing rules. */
export interface SalesRep {
  id: string;
  name: string;
  available: boolean;
  workload: number;
  territory: string;
  specialty: string;
}

/** How one routing rule evaluated for one prospect. */
export interface RuleEvaluation {
  id: string;
  label: string;
  priority: number;
  matched: boolean;
  applied: boolean;
  owner: string | null;
  detail: string;
}

/** The routing result. Unassigned and review stay explicit. */
export interface RoutingDecision {
  outcome: "assigned" | "review" | "unassigned" | "blocked";
  finalOwner: string | null;
  suggestedOwner: string | null;
  needsReview: boolean;
  rules: RuleEvaluation[];
  explanation: string;
}

/** A row in the simulated CRM. */
export interface CrmAccount {
  id: string;
  domain: string;
  email: string;
  accountName: string;
  lifecycle: string;
  owner: string;
  industry: string;
  jobTitle: string;
  updatedAt: string;
}

/** Result of one simulated CRM write. */
export interface CrmEvent {
  id: string;
  key: string;
  recordId: string;
  operation: "create" | "update";
  status:
    | "applied"
    | "duplicate_prevented"
    | "deferred"
    | "failed"
    | "partial"
    | "blocked"
    | "conflict";
  attempts: number;
  fieldsWritten: string[];
  fieldsFailed: string[];
  message: string;
}

/** A follow-up task. The key stops a retry from creating a second task. */
export interface FollowUpTask {
  key: string;
  recordId: string;
  owner: string;
  title: string;
}

/** One step in a workflow run. */
export interface WorkflowStep {
  id: string;
  label: string;
  status: "completed" | "failed" | "skipped" | "waiting_for_approval";
  detail: string;
}

/** A finished or paused workflow. */
export interface WorkflowRun {
  id: string;
  recordId: string;
  status: "completed" | "waiting_for_approval" | "failed";
  steps: WorkflowStep[];
}

/** A metric computed from the current simulation, with the rows behind it. */
export interface MetricView {
  id: string;
  label: string;
  value: string;
  definition: string;
  recordIds: string[];
}

/** One inspectable failure scenario. */
export interface FailureTrace {
  id: string;
  title: string;
  steps: { label: string; status: string; detail: string }[];
  outcome: string;
}

/** Actions the workbench can dispatch. */
export type WorkbenchAction =
  | { type: "noop" }
  | { type: "select"; id: string }
  | { type: "source"; source: SourceId | "all" }
  | { type: "query"; query: string }
  | { type: "resolve"; pairId: string; action: ResolutionAction }
  | { type: "weights"; which: "industry" | "size"; value: number }
  | { type: "confirm"; value: boolean }
  | { type: "enrich"; recordId: string; field: string; choice: "accept" | "keep" }
  | { type: "apply-crm" }
  | { type: "run-workflow" }
  | { type: "commit-queue" }
  | { type: "failure"; id: string }
  | { type: "run-failure" }
  | { type: "metric"; id: string }
  | { type: "clear-metric" }
  | { type: "architecture"; id: string }
  | { type: "reset" };

/** Local workbench state. Derived views are computed, not stored. */
export interface WorkbenchState {
  raw: RawRecord[];
  rejectedIds: string[];
  selectedId: string;
  source: SourceId | "all";
  query: string;
  resolutions: Record<string, ResolutionAction>;
  enrichmentChoices: Record<string, "accept" | "keep">;
  industryWeight: number;
  sizeWeight: number;
  confirmed: boolean;
  crm: CrmAccount[];
  events: CrmEvent[];
  tasks: FollowUpTask[];
  runs: WorkflowRun[];
  notice: string;
  metricId: string;
  failureId: string;
  failureTrace: FailureTrace | null;
  architectureId: string;
}
