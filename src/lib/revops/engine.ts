/**
 * Deterministic revenue-operations simulation for the REVFLOW workbench.
 *
 * Normalization, matching, enrichment, scoring, routing, CRM writes, workflows,
 * failure traces, and metrics are pure functions over the local fixture. Match
 * scores are rule totals. Email checks are syntactic. CRM writes stay in memory.
 *
 * Connects to:
 * - src/lib/revops/fixtures.ts and types.ts.
 * - src/lib/revops/checks.ts and src/components/pow/revops/RevopsWorkbench.tsx.
 */

import { AS_OF, CRM_SEED, ENRICHMENT_FIXTURES, RAW_RECORDS, REPS } from "./fixtures";
import type {
  CanonicalField,
  CanonicalRecord,
  CrmAccount,
  CrmEvent,
  DuplicatePair,
  EnrichmentProposal,
  FailureTrace,
  FieldDecision,
  FieldProvenance,
  FollowUpTask,
  MatchReason,
  MetricView,
  RawRecord,
  RecordView,
  ResolutionAction,
  RoutingDecision,
  RuleEvaluation,
  ScoreBreakdown,
  ScoreContribution,
  ScoreWeights,
  SourceId,
  ValidationIssue,
  WorkbenchAction,
  WorkbenchState,
  WorkflowRun,
  WorkflowStep,
} from "./types";

/** Aliases that map inbound keys onto the canonical prospect. */
const FIELD_ALIASES: Record<string, CanonicalField> = {
  company: "accountName",
  organization_name: "accountName",
  account: "accountName",
  website: "domain",
  domain: "domain",
  company_domain: "domain",
  name: "contactName",
  full_name: "contactName",
  contact: "contactName",
  email: "email",
  email_address: "email",
  work_email: "email",
  title: "jobTitle",
  job_role: "jobTitle",
  job_title: "jobTitle",
  department: "department",
  seniority: "seniority",
  employees: "employeeRange",
  employee_range: "employeeRange",
  industry: "industry",
  country: "country",
  intent: "intent",
  buying_intent: "intent",
  owner: "ownerHint",
  stage: "lifecycle",
  lifecycle: "lifecycle",
  last_activity: "lastActivity",
};

const INDUSTRIES: Record<string, string> = {
  saas: "B2B software",
  "b2b software": "B2B software",
  "b2b saas": "B2B software",
  software: "B2B software",
  analytics: "Analytics",
  "data analytics": "Analytics",
  logistics: "Logistics",
  media: "Media",
};

const COUNTRIES: Record<string, string> = {
  us: "United States",
  usa: "United States",
  "united states": "United States",
  in: "India",
  india: "India",
  de: "Germany",
  germany: "Germany",
  ng: "Nigeria",
  nigeria: "Nigeria",
};

const SENIORITY: Record<string, string> = {
  vp: "vp",
  "vice president": "vp",
  director: "director",
  head: "director",
  "head of sales": "director",
  manager: "manager",
  founder: "executive",
  cto: "executive",
  "account executive": "individual",
  "individual contributor": "individual",
  ic: "individual",
};

const INTENTS: Record<string, string> = {
  high: "high",
  medium: "medium",
  low: "low",
  none: "none",
};

const RANGES = new Set(["1-10", "11-50", "51-200", "201-1000", "1000+"]);

const LIFECYCLE: Record<string, string> = {
  inquiry: "inquiry",
  lead: "lead",
  mql: "mql",
  sql: "sql",
  opportunity: "opportunity",
  closed_won: "closed_won",
  closed_lost: "closed_lost",
};

const LIFECYCLE_ORDER = ["inquiry", "lead", "mql", "sql", "opportunity", "closed_won", "closed_lost"];

const REQUIRED: CanonicalField[] = ["accountName", "domain", "contactName", "email", "jobTitle"];

const CONFIDENCE_FIELDS: CanonicalField[] = [
  ...REQUIRED,
  "industry",
  "employeeRange",
  "country",
  "intent",
  "lastActivity",
  "seniority",
];

const GENERIC_LOCAL = new Set(["info", "hello", "team", "contact", "support", "sales", "inbox"]);

/** Collapses whitespace and trims. */
export function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** Lowercases a domain and removes a scheme, a leading www, and a path. */
export function normalizeDomain(value: string): string {
  let domain = cleanText(value).toLowerCase();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/^www\./, "");
  domain = domain.split("/")[0] ?? "";
  domain = domain.split("?")[0] ?? "";
  return domain;
}

/** True when the address has one @ and a dotted domain. This does not check the mailbox. */
export function isSyntacticallyValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** True for shared local parts such as hello@ or info@. */
export function isGenericInbox(email: string): boolean {
  const local = email.split("@")[0] ?? "";
  return GENERIC_LOCAL.has(local);
}

/** Company key used only to notice similar names. */
export function companyKey(name: string): string {
  return cleanText(name)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(inc|llc|ltd|corp|company|co)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when two company names match after suffix and spacing cleanup. */
export function similarCompany(left: string, right: string): boolean {
  const a = companyKey(left);
  const b = companyKey(right);
  if (!a || !b) return false;
  return a === b || a.replace(/\s/g, "") === b.replace(/\s/g, "");
}

/** Whole days from an ISO date to `AS_OF`, or null when the date is not ISO. */
export function daysBeforeAsOf(isoDate: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const then = Date.parse(`${isoDate}T00:00:00Z`);
  const now = Date.parse(`${AS_OF}T00:00:00Z`);
  if (Number.isNaN(then) || Number.isNaN(now)) return null;
  return Math.round((now - then) / 86400000);
}

/** Maps one inbound row onto the canonical prospect and records every problem. */
export function normalizeRecord(raw: RawRecord): CanonicalRecord {
  const buckets = new Map<CanonicalField, { key: string; value: string }[]>();
  const unmapped: { key: string; value: string }[] = [];
  for (const [key, rawValue] of Object.entries(raw.fields)) {
    const field = FIELD_ALIASES[key];
    if (!field) {
      unmapped.push({ key, value: rawValue });
      continue;
    }
    const list = buckets.get(field) ?? [];
    list.push({ key, value: rawValue });
    buckets.set(field, list);
  }

  const provenance: FieldProvenance[] = [];
  const issues: ValidationIssue[] = [];
  const taken: Partial<Record<CanonicalField, string>> = {};
  const canonicalFields = new Set(Object.values(FIELD_ALIASES));
  for (const field of canonicalFields) {
    const choices = buckets.get(field) ?? [];
    const usable = choices.find((choice) => cleanText(choice.value) !== "");
    if (!usable) continue;
    const rawValue = usable.value;
    let value = cleanText(rawValue);
    if (field === "email") value = value.toLowerCase();
    if (field === "domain") value = normalizeDomain(value);
    if (field === "industry") value = mapEnum(value, INDUSTRIES, field, issues);
    if (field === "country") value = mapEnum(value, COUNTRIES, field, issues);
    if (field === "seniority") value = mapSeniority(value, issues);
    if (field === "intent") value = mapEnum(value, INTENTS, field, issues);
    if (field === "employeeRange") value = mapRange(value, issues);
    if (field === "lifecycle") value = mapEnum(value, LIFECYCLE, field, issues);
    if (field === "ownerHint") value = value.toLowerCase();
    taken[field] = value;
    provenance.push({
      field,
      value,
      source: raw.source,
      recordedAt: raw.receivedAt,
      rawKey: usable.key,
      rawValue,
    });
  }

  const record: CanonicalRecord = {
    id: raw.id,
    source: raw.source,
    receivedAt: raw.receivedAt,
    idempotencyKey: raw.idempotencyKey,
    accountName: taken.accountName ?? "",
    domain: taken.domain ?? "",
    contactName: taken.contactName ?? "",
    email: taken.email ?? "",
    jobTitle: taken.jobTitle ?? "",
    department: taken.department ?? "",
    seniority: taken.seniority ?? "",
    employeeRange: taken.employeeRange ?? "",
    industry: taken.industry ?? "",
    country: taken.country ?? "",
    intent: taken.intent ?? "",
    ownerHint: taken.ownerHint ?? "",
    lifecycle: taken.lifecycle ?? "",
    lastActivity: taken.lastActivity ?? "",
    provenance,
    unmapped,
    issues,
  };

  for (const field of REQUIRED) {
    if (!record[field]) {
      issues.push({
        field,
        code: "missing",
        message: `${field} is required and was empty after mapping. The row was kept.`,
      });
    }
  }
  if (record.email && !isSyntacticallyValidEmail(record.email)) {
    issues.push({
      field: "email",
      code: "invalid_syntax",
      message: "The email failed a syntactic check. This does not verify that the mailbox exists.",
    });
  }
  if (record.email && isSyntacticallyValidEmail(record.email) && isGenericInbox(record.email)) {
    issues.push({
      field: "email",
      code: "generic_inbox",
      message: "This looks like a shared inbox. It is not treated as a unique person.",
    });
  }
  return record;
}

/** Maps a known enum or keeps the original and records an invalid_enum issue. */
function mapEnum(
  value: string,
  table: Record<string, string>,
  field: string,
  issues: ValidationIssue[],
): string {
  const mapped = table[value.toLowerCase()];
  if (mapped) return mapped;
  issues.push({
    field,
    code: "invalid_enum",
    message: `${field} "${value}" is not in the configured list. The original text was kept.`,
  });
  return value;
}

/** Maps seniority, including a leading "VP" or "Vice President". */
function mapSeniority(value: string, issues: ValidationIssue[]): string {
  const lower = value.toLowerCase();
  if (SENIORITY[lower]) return SENIORITY[lower];
  if (lower.startsWith("vp") || lower.startsWith("vice president")) return "vp";
  return mapEnum(value, SENIORITY, "seniority", issues);
}

/** Keeps a known employee band and flags anything else. */
function mapRange(value: string, issues: ValidationIssue[]): string {
  if (RANGES.has(value)) return value;
  issues.push({
    field: "employeeRange",
    code: "invalid_enum",
    message: `Employee range "${value}" is not one of the configured bands. The original text was kept.`,
  });
  return value;
}

/** Normalizes every inbound row. Rows are not dropped. */
export function normalizeAll(raws: RawRecord[]): CanonicalRecord[] {
  return raws.map(normalizeRecord);
}

/** Keeps the first row for each idempotency key and reports the rest. */
export function commitQueue(raws: RawRecord[]): { kept: RawRecord[]; rejected: RawRecord[] } {
  const seen = new Set<string>();
  const kept: RawRecord[] = [];
  const rejected: RawRecord[] = [];
  for (const raw of raws) {
    if (seen.has(raw.idempotencyKey)) rejected.push(raw);
    else {
      seen.add(raw.idempotencyKey);
      kept.push(raw);
    }
  }
  return { kept, rejected };
}

/** Stable id for a pair, independent of argument order. */
export function pairId(leftId: string, rightId: string): string {
  return [leftId, rightId].sort().join("|");
}

/** Compares two prospects with explicit rules. Domain equality alone cannot authorize a merge. */
export function compareRecords(left: CanonicalRecord, right: CanonicalRecord): DuplicatePair | null {
  if (left.id === right.id) return null;
  const reasons: MatchReason[] = [];
  let contact = 0;
  let account = 0;
  const emailsEqual = Boolean(left.email) && left.email === right.email;
  const generic = emailsEqual && isGenericInbox(left.email);
  const sameDomain = Boolean(left.domain) && left.domain === right.domain;
  const samePerson =
    Boolean(left.contactName) &&
    left.contactName.toLowerCase() === right.contactName.toLowerCase();
  const similar = similarCompany(left.accountName, right.accountName);

  if (emailsEqual && !generic) {
    reasons.push({
      rule: "exact_email",
      points: 70,
      detail: "The normalized work emails match. This is a syntactic match, not proof the mailbox is theirs.",
    });
    contact += 70;
  }
  if (generic) {
    reasons.push({
      rule: "generic_inbox",
      points: 10,
      detail: "Both rows use the same shared inbox. That is not enough to merge two people.",
    });
    contact += 10;
  }
  if (sameDomain && samePerson) {
    reasons.push({
      rule: "same_domain_and_name",
      points: 20,
      detail: "The same domain and the same contact name appeared on both rows.",
    });
    contact += 20;
  }
  if (sameDomain && !samePerson) {
    reasons.push({
      rule: "same_domain_different_people",
      points: 0,
      detail: "The domain matches and the people do not. This is an account link. The contacts stay separate.",
    });
    account += 40;
  }
  if (!sameDomain && similar) {
    reasons.push({
      rule: "similar_company_different_domain",
      points: 25,
      detail: "The company names look alike and the domains differ. That is a review case, not a merge.",
    });
    account += 25;
  }
  if (samePerson && similar && !emailsEqual) {
    reasons.push({
      rule: "name_and_company_email_differs",
      points: 15,
      detail: "The person and company names are close, but the emails differ.",
    });
    contact += 15;
  }
  if (
    left.jobTitle &&
    right.jobTitle &&
    left.jobTitle !== right.jobTitle &&
    (emailsEqual || samePerson)
  ) {
    reasons.push({
      rule: "conflicting_job_title",
      points: 0,
      detail: `Job titles differ ("${left.jobTitle}" and "${right.jobTitle}"). The score does not go up.`,
    });
  }
  if (reasons.length === 0) return null;

  const accountOnly = sameDomain && !samePerson && contact < 70;
  const autoMergeAllowed = contact >= 70 && !generic && !accountOnly;
  let kind: DuplicatePair["kind"] = "review";
  if (accountOnly) kind = "account";
  else if (autoMergeAllowed) kind = "contact";
  return {
    id: pairId(left.id, right.id),
    leftId: left.id,
    rightId: right.id,
    kind,
    heuristicScore: accountOnly ? account : Math.min(100, contact),
    autoMergeAllowed,
    reasons,
    explanation: accountOnly
      ? "Same company domain, different people. Merging the contacts is refused."
      : autoMergeAllowed
        ? "Exact email match. A merge is available, and it still requires a click."
        : "The heuristic is below the merge bar or the domains disagree. Review it or keep the rows apart.",
  };
}

/** All unordered pairs that share a rule. */
export function findDuplicatePairs(records: CanonicalRecord[]): DuplicatePair[] {
  const pairs: DuplicatePair[] = [];
  for (let i = 0; i < records.length; i += 1) {
    for (let j = i + 1; j < records.length; j += 1) {
      const pair = compareRecords(records[i], records[j]);
      if (pair) pairs.push(pair);
    }
  }
  return pairs;
}

/** Picks the row with the later activity, then the later receipt. */
function pickSurvivor(group: CanonicalRecord[]): CanonicalRecord {
  return [...group].sort((a, b) => {
    const activity = (b.lastActivity || "").localeCompare(a.lastActivity || "");
    if (activity !== 0) return activity;
    const received = b.receivedAt.localeCompare(a.receivedAt);
    if (received !== 0) return received;
    return a.id.localeCompare(b.id);
  })[0];
}

/** Copies blank survivor fields from the other rows and records conflicts. */
function mergeGroup(survivor: CanonicalRecord, others: CanonicalRecord[]): {
  record: CanonicalRecord;
  decisions: FieldDecision[];
} {
  const fields: CanonicalField[] = [
    "accountName",
    "domain",
    "contactName",
    "email",
    "jobTitle",
    "department",
    "seniority",
    "employeeRange",
    "industry",
    "country",
    "intent",
    "ownerHint",
    "lifecycle",
    "lastActivity",
  ];
  const next: CanonicalRecord = {
    ...survivor,
    provenance: [...survivor.provenance],
    issues: [...survivor.issues],
    unmapped: [...survivor.unmapped],
  };
  const decisions: FieldDecision[] = [];
  for (const other of others) {
    for (const field of fields) {
      const kept = next[field];
      const incoming = other[field];
      if (!incoming || incoming === kept) continue;
      if (!kept) {
        next[field] = incoming;
        decisions.push({
          field,
          kept: incoming,
          dropped: "",
          reason: `Filled a blank ${field} from ${other.id}.`,
        });
      } else {
        decisions.push({
          field,
          kept,
          dropped: incoming,
          reason: `Kept ${field} from ${survivor.id}, the row with the later activity or receipt.`,
        });
      }
    }
    next.provenance = [...next.provenance, ...other.provenance];
    next.unmapped = [...next.unmapped, ...other.unmapped];
  }
  return { record: next, decisions };
}

/** Applies merge clicks. Account-only pairs never merge, even if a click asks them to. */
export function applyResolutions(
  records: CanonicalRecord[],
  pairs: DuplicatePair[],
  resolutions: Record<string, ResolutionAction>,
): { views: RecordView[]; refused: string[] } {
  const parent = new Map<string, string>();
  const find = (id: string): string => {
    const current = parent.get(id) ?? id;
    if (current === id) return id;
    const root = find(current);
    parent.set(id, root);
    return root;
  };
  const refused: string[] = [];
  for (const pair of pairs) {
    if (resolutions[pair.id] !== "merge") continue;
    if (!pair.autoMergeAllowed) {
      refused.push(pair.id);
      continue;
    }
    const left = find(pair.leftId);
    const right = find(pair.rightId);
    if (left !== right) parent.set(right, left);
  }
  const groups = new Map<string, CanonicalRecord[]>();
  for (const record of records) {
    const root = find(record.id);
    const list = groups.get(root) ?? [];
    list.push(record);
    groups.set(root, list);
  }
  const views: RecordView[] = [];
  for (const record of records) {
    const group = groups.get(find(record.id)) ?? [record];
    if (group.length === 1) {
      views.push({ ...record, mergedFrom: [], decisions: [] });
      continue;
    }
    const survivor = pickSurvivor(group);
    if (record.id !== survivor.id) continue;
    const merged = mergeGroup(survivor, group.filter((item) => item.id !== survivor.id));
    views.push({
      ...merged.record,
      mergedFrom: group.filter((item) => item.id !== survivor.id).map((item) => item.id),
      decisions: merged.decisions,
    });
  }
  return { views, refused };
}

/** Proposals for one domain. Failed providers return a single review row and no invented values. */
export function proposeEnrichment(record: CanonicalRecord): EnrichmentProposal[] {
  const fixture = ENRICHMENT_FIXTURES[record.domain];
  if (!fixture) {
    return [
      {
        field: "provider",
        current: "",
        proposed: "",
        source: "synthetic-enrichment-fixture",
        observedAt: "",
        reliability: "unavailable",
        freshness: "unknown",
        conflict: false,
        needsReview: true,
        recommendation: "review",
        note: "No local fixture exists for this domain. Nothing was invented.",
      },
    ];
  }
  if (fixture.status !== "ok") {
    const reliability = fixture.status === "failed" ? "failed" : fixture.status;
    return [
      {
        field: "provider",
        current: "",
        proposed: "",
        source: "synthetic-enrichment-fixture",
        observedAt: fixture.observedAt,
        reliability,
        freshness: "unavailable",
        conflict: false,
        needsReview: true,
        recommendation: "review",
        note: fixture.note,
      },
    ];
  }
  const age = daysBeforeAsOf(fixture.observedAt);
  const stale = age !== null && age > 180;
  return (Object.entries(fixture.fields) as [keyof typeof fixture.fields, string][]).map(
    ([field, proposed]) => {
      const current = String(record[field] ?? "");
      const conflict = Boolean(current) && current !== proposed;
      let recommendation: EnrichmentProposal["recommendation"] = "review";
      if (!proposed) recommendation = "review";
      else if (stale && conflict) recommendation = "keep";
      else if (conflict) recommendation = "review";
      else if (!current) recommendation = "accept";
      else recommendation = "accept";
      return {
        field,
        current,
        proposed,
        source: "synthetic-enrichment-fixture",
        observedAt: fixture.observedAt,
        reliability: stale ? "stale_fixture" : "fixture",
        freshness: stale ? "stale" : "current",
        conflict,
        needsReview: recommendation !== "accept",
        recommendation,
        note: fixture.note,
      };
    },
  );
}

/** Applies explicit accept choices. Keep and review leave the current value. */
export function applyEnrichmentChoices(
  record: RecordView,
  choices: Record<string, "accept" | "keep">,
): RecordView {
  const next: RecordView = { ...record, provenance: [...record.provenance] };
  for (const proposal of proposeEnrichment(record)) {
    const choice = choices[`${record.id}:${proposal.field}`];
    if (choice !== "accept" || !proposal.proposed) continue;
    const field = proposal.field as CanonicalField;
    if (!(field in next)) continue;
    next[field] = proposal.proposed as never;
    next.provenance.push({
      field,
      value: proposal.proposed,
      source: "synthetic-enrichment-fixture",
      recordedAt: proposal.observedAt,
      rawKey: "accepted_fixture",
      rawValue: proposal.proposed,
    });
  }
  return next;
}

/** Clamps the two sliders and gives the remainder to seniority, then renormalizes. */
export function normalizeScoreWeights(industry: number, size: number): ScoreWeights {
  const industryWeight = clamp(Number.isFinite(industry) ? industry : 0.5, 0.2, 0.7);
  const sizeWeight = clamp(Number.isFinite(size) ? size : 0.3, 0.1, 0.5);
  const raw = [industryWeight, sizeWeight, Math.max(0.1, 1 - industryWeight - sizeWeight)];
  const sum = raw[0] + raw[1] + raw[2];
  return { industry: raw[0] / sum, size: raw[1] / sum, seniority: raw[2] / sum };
}

/** Clamps a finite number into a range. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Explains fit, intent, engagement, and confidence separately. */
export function scoreRecord(record: CanonicalRecord, weights: ScoreWeights): ScoreBreakdown {
  const industryPoints = !record.industry ? 0 : record.industry === "B2B software" || record.industry === "Analytics" ? 100 : 40;
  const sizePoints = !record.employeeRange
    ? 0
    : record.employeeRange === "11-50" || record.employeeRange === "51-200" || record.employeeRange === "201-1000"
      ? 100
      : record.employeeRange === "1000+"
        ? 60
        : 30;
  const seniorityPoints =
    record.seniority === "vp" || record.seniority === "executive"
      ? 100
      : record.seniority === "director"
        ? 70
        : record.seniority === "manager"
          ? 40
          : record.seniority === "individual"
            ? 20
            : 0;
  const fit = Math.round(
    industryPoints * weights.industry + sizePoints * weights.size + seniorityPoints * weights.seniority,
  );
  const intent =
    record.intent === "high" ? 100 : record.intent === "medium" ? 60 : record.intent === "low" ? 25 : 0;
  const age = daysBeforeAsOf(record.lastActivity);
  const engagement = age === null ? 0 : age <= 14 ? 100 : age <= 45 ? 60 : 20;
  const populated = CONFIDENCE_FIELDS.filter((field) => Boolean(record[field])).length;
  const confidence = Math.round((populated / CONFIDENCE_FIELDS.length) * 100);
  const band =
    confidence < 60
      ? "Low confidence"
      : (fit + intent + engagement) / 3 >= 75
        ? "Prioritize for review"
        : (fit + intent + engagement) / 3 >= 45
          ? "Nurture"
          : "Deprioritize";
  const contributions: ScoreContribution[] = [
    {
      dimension: "fit",
      label: "ICP fit",
      points: fit,
      note: `Industry ${industryPoints}, size ${sizePoints}, seniority ${seniorityPoints}, with weights ${weights.industry.toFixed(2)} / ${weights.size.toFixed(2)} / ${weights.seniority.toFixed(2)}.`,
    },
    {
      dimension: "intent",
      label: "Buying-intent signal",
      points: intent,
      note: record.intent ? `Intent is "${record.intent}".` : "Intent is missing, so this dimension is 0.",
    },
    {
      dimension: "engagement",
      label: "Activity recency",
      points: engagement,
      note: age === null ? "No activity date." : `Last activity is ${age} days before ${AS_OF}.`,
    },
    {
      dimension: "confidence",
      label: "Data confidence",
      points: confidence,
      note: `${populated} of ${CONFIDENCE_FIELDS.length} confidence fields are populated. Missing fields lower confidence. They do not get a guessed value.`,
    },
  ];
  return {
    fit,
    intent,
    engagement,
    confidence,
    band,
    contributions,
    formula:
      "Fit, intent, and engagement stay separate. The band is an illustrative reading of those three, and it becomes Low confidence when confidence is under 60. It is not a probability that the prospect will buy.",
  };
}

/** True when the row is missing a required field or the email is not syntactic. */
export function automationBlocked(record: CanonicalRecord): boolean {
  return record.issues.some(
    (issue) =>
      (issue.code === "missing" && REQUIRED.includes(issue.field as CanonicalField)) ||
      issue.code === "invalid_syntax",
  );
}

/** Evaluates every routing rule, then applies the first one that can assign an available owner. */
export function routeRecord(
  record: CanonicalRecord,
  score: ScoreBreakdown,
  reps: typeof REPS = REPS,
): RoutingDecision {
  if (automationBlocked(record)) {
    return {
      outcome: "blocked",
      finalOwner: null,
      suggestedOwner: null,
      needsReview: true,
      rules: [
        {
          id: "validation",
          label: "Required fields",
          priority: 0,
          matched: true,
          applied: true,
          owner: null,
          detail: "Validation failed. The row is not routed to a person.",
        },
      ],
      explanation: "Routing stopped because required data is missing or the email is not syntactically valid.",
    };
  }

  const rep = (id: string) => reps.find((item) => item.id === id) ?? null;
  const hinted = record.ownerHint ? rep(record.ownerHint) : null;
  const specialist = record.industry === "Analytics" ? rep("sam") : null;
  const enterprise = record.employeeRange === "1000+" || record.employeeRange === "201-1000";
  const noor = rep("noor");
  const territory =
    record.country === "India" ? rep("anika") : record.country === "United States" ? rep("leo") : null;
  const rules: RuleEvaluation[] = [
    {
      id: "existing_owner",
      label: "Existing owner",
      priority: 1,
      matched: Boolean(hinted),
      applied: false,
      owner: hinted?.id ?? null,
      detail: !hinted
        ? "No existing owner was on the row."
        : hinted.available
          ? `${hinted.name} is the existing owner and is available.`
          : `${hinted.name} is the existing owner and is unavailable. The row goes to review instead of a silent reassignment.`,
    },
    {
      id: "industry",
      label: "Industry specialization",
      priority: 2,
      matched: Boolean(specialist),
      applied: false,
      owner: specialist?.id ?? null,
      detail: specialist
        ? "Analytics rows match Sam Okonkwo before territory."
        : "No industry specialist is configured for this industry.",
    },
    {
      id: "segment",
      label: "Company size",
      priority: 3,
      matched: enterprise,
      applied: false,
      owner: enterprise ? "noor" : null,
      detail: !enterprise
        ? "The employee band is not the enterprise band in this demo."
        : noor?.available
          ? "Enterprise band matches Noor El-Sayed."
          : "Enterprise band matches Noor El-Sayed, who is unavailable. The rule does not assign a substitute.",
    },
    {
      id: "territory",
      label: "Territory",
      priority: 4,
      matched: Boolean(territory),
      applied: false,
      owner: territory?.id ?? null,
      detail: territory
        ? `${record.country} matches ${territory.name}.`
        : record.country
          ? `${record.country} has no territory owner in this demo.`
          : "Country is missing, so territory cannot match.",
    },
    {
      id: "confidence",
      label: "Qualification confidence",
      priority: 5,
      matched: score.confidence < 60,
      applied: false,
      owner: null,
      detail:
        score.confidence < 60
          ? "Confidence is under 60, so a suggested owner still needs review."
          : "Confidence is at least 60. This rule does not change the owner.",
    },
  ];

  const mark = (id: string) => rules.map((rule) => ({ ...rule, applied: rule.id === id }));

  if (hinted && !hinted.available) {
    return {
      outcome: "review",
      finalOwner: null,
      suggestedOwner: hinted.id,
      needsReview: true,
      rules,
      explanation: "The existing owner is unavailable, so the row needs a person to choose the next owner.",
    };
  }
  if (hinted?.available) {
    if (score.confidence < 60) {
      return {
        outcome: "review",
        finalOwner: null,
        suggestedOwner: hinted.id,
        needsReview: true,
        rules,
        explanation: "The existing owner is available, and low confidence keeps the assignment in review.",
      };
    }
    return {
      outcome: "assigned",
      finalOwner: hinted.id,
      suggestedOwner: hinted.id,
      needsReview: false,
      rules: mark("existing_owner"),
      explanation: `${hinted.name} stays the owner because existing ownership is the first rule.`,
    };
  }
  if (specialist && !specialist.available) {
    return {
      outcome: "review",
      finalOwner: null,
      suggestedOwner: specialist.id,
      needsReview: true,
      rules,
      explanation: "The industry specialist is unavailable, so the row needs a person to choose the next owner.",
    };
  }
  if (specialist?.available) {
    if (score.confidence < 60) {
      return {
        outcome: "review",
        finalOwner: null,
        suggestedOwner: specialist.id,
        needsReview: true,
        rules,
        explanation: "Industry specialization matched, and low confidence keeps it in review.",
      };
    }
    return {
      outcome: "assigned",
      finalOwner: specialist.id,
      suggestedOwner: specialist.id,
      needsReview: false,
      rules: mark("industry"),
      explanation: `${specialist.name} is the owner because industry specialization is the first matching available rule.`,
    };
  }
  if (enterprise && noor?.available) {
    if (score.confidence < 60) {
      return {
        outcome: "review",
        finalOwner: null,
        suggestedOwner: noor.id,
        needsReview: true,
        rules,
        explanation: "The size rule matched an available owner, and low confidence keeps it in review.",
      };
    }
    return {
      outcome: "assigned",
      finalOwner: noor.id,
      suggestedOwner: noor.id,
      needsReview: false,
      rules: mark("segment"),
      explanation: `${noor.name} is the owner because the enterprise band is the first matching available rule.`,
    };
  }
  if (enterprise && noor && !noor.available) {
    return {
      outcome: "review",
      finalOwner: null,
      suggestedOwner: "noor",
      needsReview: true,
      rules,
      explanation: "The size rule matched an unavailable owner. No default owner was substituted.",
    };
  }
  if (!territory) {
    return {
      outcome: "unassigned",
      finalOwner: null,
      suggestedOwner: null,
      needsReview: true,
      rules,
      explanation: "No routing rule matched. The row stays unassigned instead of falling through to a default owner.",
    };
  }
  if (score.confidence < 60) {
    return {
      outcome: "review",
      finalOwner: null,
      suggestedOwner: territory.id,
      needsReview: true,
      rules,
      explanation: `${territory.name} matches the territory, and confidence is under 60, so the suggestion is not applied.`,
    };
  }
  return {
    outcome: "assigned",
    finalOwner: territory.id,
    suggestedOwner: territory.id,
    needsReview: false,
    rules: mark("territory"),
    explanation: `${territory.name} is the owner because territory was the first matching available rule.`,
  };
}

/** Display name for a rep id. */
export function repName(id: string | null): string {
  if (!id) return "Unassigned";
  return REPS.find((rep) => rep.id === id)?.name ?? id;
}

/** Finds a CRM row by domain and email. */
export function findCrmAccount(store: CrmAccount[], record: CanonicalRecord): CrmAccount | undefined {
  return store.find((account) => account.domain === record.domain && account.email === record.email);
}

/** Idempotency key for one prospect. A later create-or-update of the same domain and email reuses it. */
export function crmKey(record: CanonicalRecord): string {
  return `${record.domain}:${record.email}`;
}

/** Which failure the domain's adapter simulates. Fieldnote is partial. Bramble is rate limited. */
export function simulationFor(record: CanonicalRecord): "none" | "rate_limit" | "partial" {
  if (record.domain === "brambleops.example") return "rate_limit";
  if (record.domain === "fieldnote.example") return "partial";
  return "none";
}

/** True when the new lifecycle would move backward or leave a terminal stage. */
export function isLifecycleDowngrade(current: string, next: string): boolean {
  if (!current || !next || current === next) return false;
  if (current === "closed_won" || current === "closed_lost") return true;
  const from = LIFECYCLE_ORDER.indexOf(current);
  const to = LIFECYCLE_ORDER.indexOf(next);
  if (from < 0 || to < 0) return false;
  return to < from;
}

/** Applies one confirmed, simulated CRM write. An unconfirmed call does not change the store. */
export function applyCrmWrite(
  store: CrmAccount[],
  events: CrmEvent[],
  record: CanonicalRecord,
  owner: string | null,
  confirmed: boolean,
  simulate: "none" | "rate_limit" | "partial" | "conflict" = simulationFor(record),
): { store: CrmAccount[]; events: CrmEvent[]; event: CrmEvent } {
  const existing = findCrmAccount(store, record);
  const operation = existing ? "update" : "create";
  const key = crmKey(record);
  const prior = events.filter((event) => event.key === key);
  const base = {
    id: `evt-${events.length + 1}`,
    key,
    recordId: record.id,
    operation,
  } as const;

  const blocked = (message: string, status: CrmEvent["status"] = "blocked"): {
    store: CrmAccount[];
    events: CrmEvent[];
    event: CrmEvent;
  } => {
    const event: CrmEvent = {
      ...base,
      status,
      attempts: prior.length + 1,
      fieldsWritten: [],
      fieldsFailed: [],
      message,
    };
    return { store, events: [...events, event], event };
  };

  if (!confirmed) return blocked("Confirmation is required before the simulated write.");
  if (automationBlocked(record)) return blocked("The row failed validation, so the adapter did not write.");
  if (!owner) return blocked("There is no assigned owner. The adapter does not invent one.");
  if (prior.some((event) => event.status === "applied" || event.status === "partial")) {
    return blocked(
      "This idempotency key already has a write. Reconcile that write instead of creating another.",
      "duplicate_prevented",
    );
  }
  if (simulate === "conflict" || (existing && isLifecycleDowngrade(existing.lifecycle, record.lifecycle))) {
    return blocked(
      "The CRM lifecycle is newer or further along than the inbound value. The write was not applied.",
      "conflict",
    );
  }
  if (simulate === "rate_limit") {
    const attempts = prior.filter((event) => event.status === "deferred" || event.status === "failed").length + 1;
    if (attempts <= 2) {
      return blocked(
        `Simulated rate limit. Deferred retry ${attempts} of 2. No field was written.`,
        "deferred",
      );
    }
    return blocked("Simulated rate limit. The bounded retry stopped. No field was written.", "failed");
  }

  const nextAccount: CrmAccount = {
    id: existing?.id ?? `crm-${record.domain}`,
    domain: record.domain,
    email: record.email,
    accountName: record.accountName,
    lifecycle: record.lifecycle || existing?.lifecycle || "lead",
    owner,
    industry: simulate === "partial" ? existing?.industry ?? "" : record.industry,
    jobTitle: record.jobTitle,
    updatedAt: AS_OF,
  };
  const event: CrmEvent = {
    ...base,
    status: simulate === "partial" ? "partial" : "applied",
    attempts: 1,
    fieldsWritten: simulate === "partial" ? ["accountName", "lifecycle", "owner", "jobTitle"] : ["accountName", "lifecycle", "owner", "jobTitle", "industry"],
    fieldsFailed: simulate === "partial" ? ["industry"] : [],
    message:
      simulate === "partial"
        ? "Partial write: industry failed and the other fields were stored. Do not treat the transaction as complete."
        : existing
          ? "Simulated update stored in the local adapter."
          : "Simulated create stored in the local adapter.",
  };
  const nextStore = existing
    ? store.map((account) => (account.id === existing.id ? nextAccount : account))
    : [...store, nextAccount];
  return { store: nextStore, events: [...events, event], event };
}

/** Creates a follow-up once per record. A second call is a prevented duplicate. */
export function createFollowUp(
  tasks: FollowUpTask[],
  recordId: string,
  owner: string,
): { tasks: FollowUpTask[]; status: "created" | "duplicate_prevented" } {
  const key = `follow-up:${recordId}`;
  if (tasks.some((task) => task.key === key)) return { tasks, status: "duplicate_prevented" };
  return {
    tasks: [...tasks, { key, recordId, owner, title: "Review the new prospect" }],
    status: "created",
  };
}

/** Runs the local workflow until it completes, fails, or waits for approval. */
export function runWorkflow(
  record: RecordView,
  score: ScoreBreakdown,
  routing: RoutingDecision,
  confirmed: boolean,
  store: CrmAccount[],
  events: CrmEvent[],
  tasks: FollowUpTask[],
  runCount: number,
): { run: WorkflowRun; store: CrmAccount[]; events: CrmEvent[]; tasks: FollowUpTask[] } {
  const steps: WorkflowStep[] = [];
  const skipRest = (from: string, reason: string) => {
    for (const label of ["Normalize", "Resolve duplicates", "Qualify", "Assign owner", "Preview CRM", "Apply CRM", "Create task", "Record activity", "Verify"]) {
      if (steps.some((step) => step.label === label)) continue;
      if (label === from) continue;
      steps.push({ id: label.toLowerCase().replace(/\s/g, "-"), label, status: "skipped", detail: reason });
    }
  };

  if (automationBlocked(record)) {
    steps.push({
      id: "validate",
      label: "Validate",
      status: "failed",
      detail: "Required fields are missing or the email is not syntactic. Later steps were skipped.",
    });
    skipRest("Validate", "Skipped because validation failed.");
    return {
      run: { id: `run-${runCount + 1}`, recordId: record.id, status: "failed", steps },
      store,
      events,
      tasks,
    };
  }
  steps.push({ id: "validate", label: "Validate", status: "completed", detail: "Required fields are present and the email is syntactic." });
  steps.push({ id: "normalize", label: "Normalize", status: "completed", detail: "The row is already in the canonical shape." });
  if (record.mergedFrom.length === 0 && record.issues.some((issue) => issue.code === "generic_inbox")) {
    steps.push({
      id: "resolve",
      label: "Resolve duplicates",
      status: "waiting_for_approval",
      detail: "A shared inbox needs a person to decide whether it belongs to one account.",
    });
  } else {
    steps.push({
      id: "resolve",
      label: "Resolve duplicates",
      status: "completed",
      detail: record.mergedFrom.length
        ? `Merged from ${record.mergedFrom.join(", ")}.`
        : "No unresolved contact merge is blocking this row.",
    });
  }
  steps.push({
    id: "qualify",
    label: "Qualify",
    status: score.confidence < 60 ? "waiting_for_approval" : "completed",
    detail: `Fit ${score.fit}, intent ${score.intent}, engagement ${score.engagement}, confidence ${score.confidence}. Band: ${score.band}.`,
  });
  if (routing.outcome !== "assigned") {
    steps.push({
      id: "assign",
      label: "Assign owner",
      status: "waiting_for_approval",
      detail: routing.explanation,
    });
    steps.push({ id: "preview", label: "Preview CRM", status: "skipped", detail: "No owner is assigned, so there is nothing to preview." });
    steps.push({ id: "apply", label: "Apply CRM", status: "skipped", detail: "Skipped until an owner is assigned." });
    steps.push({ id: "task", label: "Create task", status: "skipped", detail: "Skipped until the CRM write succeeds." });
    steps.push({ id: "activity", label: "Record activity", status: "skipped", detail: "Skipped with the task." });
    steps.push({ id: "verify", label: "Verify", status: "skipped", detail: "There is no write to verify." });
    return {
      run: { id: `run-${runCount + 1}`, recordId: record.id, status: "waiting_for_approval", steps },
      store,
      events,
      tasks,
    };
  }
  steps.push({ id: "assign", label: "Assign owner", status: "completed", detail: routing.explanation });
  const preview = findCrmAccount(store, record) ? "update" : "create";
  steps.push({
    id: "preview",
    label: "Preview CRM",
    status: "completed",
    detail: `The adapter would ${preview} ${record.domain} for ${repName(routing.finalOwner)}.`,
  });
  if (!confirmed) {
    steps.push({
      id: "apply",
      label: "Apply CRM",
      status: "waiting_for_approval",
      detail: "The simulated write is waiting for confirmation.",
    });
    steps.push({ id: "task", label: "Create task", status: "skipped", detail: "Skipped until the write is confirmed." });
    steps.push({ id: "activity", label: "Record activity", status: "skipped", detail: "Skipped with the task." });
    steps.push({ id: "verify", label: "Verify", status: "skipped", detail: "Skipped until the write exists." });
    return {
      run: { id: `run-${runCount + 1}`, recordId: record.id, status: "waiting_for_approval", steps },
      store,
      events,
      tasks,
    };
  }
  const written = applyCrmWrite(store, events, record, routing.finalOwner, true);
  const alreadyApplied = events.some((event) => event.key === written.event.key && event.status === "applied");
  const writeOk = written.event.status === "applied" || (written.event.status === "duplicate_prevented" && alreadyApplied);
  steps.push({
    id: "apply",
    label: "Apply CRM",
    status: writeOk ? "completed" : "failed",
    detail: written.event.message,
  });
  if (!writeOk) {
    steps.push({
      id: "task",
      label: "Create task",
      status: "skipped",
      detail: "No follow-up was created because the CRM write did not fully succeed.",
    });
    steps.push({ id: "activity", label: "Record activity", status: "skipped", detail: "No activity was recorded." });
    steps.push({
      id: "verify",
      label: "Verify",
      status: "failed",
      detail: "Verification compared the intended write with the adapter result and did not find a complete success.",
    });
    return {
      run: { id: `run-${runCount + 1}`, recordId: record.id, status: "failed", steps },
      store: written.store,
      events: written.events,
      tasks,
    };
  }
  const task = createFollowUp(tasks, record.id, routing.finalOwner ?? "");
  steps.push({
    id: "task",
    label: "Create task",
    status: "completed",
    detail: task.status === "created" ? "One follow-up task was created." : "A follow-up already exists for this record. A second task was not created.",
  });
  steps.push({
    id: "activity",
    label: "Record activity",
    status: "completed",
    detail: "Recorded a local activity: workflow completed for this prospect.",
  });
  steps.push({
    id: "verify",
    label: "Verify",
    status: "completed",
    detail: "The stored CRM row matches the owner and lifecycle from the confirmed preview.",
  });
  return {
    run: { id: `run-${runCount + 1}`, recordId: record.id, status: "completed", steps },
    store: written.store,
    events: written.events,
    tasks: task.tasks,
  };
}

/** Contact-duplicate rate uses records in contact pairs divided by records evaluated. */
export function buildMetrics(
  records: RecordView[],
  pairs: DuplicatePair[],
  runs: WorkflowRun[],
  events: CrmEvent[],
): MetricView[] {
  const evaluated = records.length;
  const contactIds = new Set<string>();
  for (const pair of pairs) {
    if (pair.kind !== "contact") continue;
    contactIds.add(pair.leftId);
    contactIds.add(pair.rightId);
  }
  const reviewIds = records.filter((record) => record.issues.length > 0).map((record) => record.id);
  const opportunities = evaluated * REQUIRED.length;
  const populated = records.reduce(
    (sum, record) => sum + REQUIRED.filter((field) => Boolean(record[field])).length,
    0,
  );
  const staleIds = records
    .filter((record) => {
      const age = daysBeforeAsOf(record.lastActivity);
      return age === null || age > 90;
    })
    .map((record) => record.id);
  const failedIds = events
    .filter((event) => event.status === "failed" || event.status === "partial" || event.status === "deferred")
    .map((event) => event.recordId);
  const completed = runs.filter((run) => run.status === "completed").length;
  const waiting = runs.filter((run) => run.status === "waiting_for_approval").length;
  const failedRuns = runs.filter((run) => run.status === "failed").length;
  const rate = (num: number, den: number) => (den === 0 ? "n/a" : `${num}/${den} (${Math.round((num / den) * 100)}%)`);
  return [
    {
      id: "duplicates",
      label: "Contact duplicate rate",
      value: rate(contactIds.size, evaluated),
      definition: "Records that appear in a contact-level heuristic pair, divided by records evaluated. Account-only domain matches are not in the numerator.",
      recordIds: [...contactIds],
    },
    {
      id: "review",
      label: "Records requiring review",
      value: rate(reviewIds.length, evaluated),
      definition: "Records with at least one validation issue, divided by records evaluated.",
      recordIds: reviewIds,
    },
    {
      id: "completeness",
      label: "Data completeness",
      value: rate(populated, opportunities),
      definition: "Populated required fields (account, domain, contact, email, job title) divided by required-field opportunities. Invalid text still counts as populated; validity is a separate issue.",
      recordIds: records.filter((record) => REQUIRED.some((field) => !record[field])).map((record) => record.id),
    },
    {
      id: "workflow",
      label: "Workflow completion",
      value: runs.length === 0 ? "n/a" : `${completed} completed, ${waiting} waiting, ${failedRuns} failed, of ${runs.length} started`,
      definition: "Completed workflows divided by workflows started. Waiting and failed runs stay in the denominator and are listed beside the completed count. Cancelled runs are not used in this demo.",
      recordIds: runs.map((run) => run.recordId),
    },
    {
      id: "failed",
      label: "Failed or partial operations",
      value: String(failedIds.length),
      definition: "CRM events whose status is failed, partial, or deferred. A partial event is not counted as a success.",
      recordIds: failedIds,
    },
    {
      id: "freshness",
      label: "Stale activity",
      value: rate(staleIds.length, evaluated),
      definition: `Records whose last activity is missing or more than 90 days before ${AS_OF}, divided by records evaluated.`,
      recordIds: staleIds,
    },
  ];
}

/** Counts records by a field so the funnel and source charts use the same rows. */
export function countBy(records: RecordView[], field: "source" | "lifecycle" | "industry"): { key: string; count: number; recordIds: string[] }[] {
  const groups = new Map<string, string[]>();
  for (const record of records) {
    const key = record[field] || "(missing)";
    const list = groups.get(key) ?? [];
    list.push(record.id);
    groups.set(key, list);
  }
  return [...groups.entries()].map(([key, recordIds]) => ({ key, count: recordIds.length, recordIds }));
}

/** Compares a claimed aggregate with a recount. Used by the discrepancy scenario. */
export function reconcileAggregate(claimed: number, actual: number, label: string): { matches: boolean; detail: string } {
  if (claimed === actual) return { matches: true, detail: `${label} matches the recount (${actual}).` };
  return {
    matches: false,
    detail: `${label} claims ${claimed}, and the recount is ${actual}. The difference is ${claimed - actual}. The dashboard should show the recount, not the claim.`,
  };
}

/** The eight failure scenarios. Each one calls the same functions as the workbench. */
export function runFailure(id: string): FailureTrace {
  const records = normalizeAll(RAW_RECORDS);
  if (id === "duplicate-event") {
    const first = commitQueue([RAW_RECORDS[0]]);
    const second = commitQueue([...first.kept, RAW_RECORDS[1]]);
    return {
      id,
      title: "Duplicate event",
      steps: [
        { label: "First delivery", status: "accepted", detail: `Kept ${first.kept.length} row.` },
        { label: "Second delivery", status: second.rejected.length ? "rejected" : "accepted", detail: `Rejected ${second.rejected.map((row) => row.id).join(", ") || "none"} because the idempotency key was already stored.` },
      ],
      outcome: "The second submission does not create a second prospect.",
    };
  }
  if (id === "rate-limit") {
    const record = records.find((item) => item.id === "event-imani");
    if (!record) return missing(id);
    let store = CRM_SEED;
    let events: CrmEvent[] = [];
    const notes: FailureTrace["steps"] = [];
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const result = applyCrmWrite(store, events, record, "leo", true, "rate_limit");
      store = result.store;
      events = result.events;
      notes.push({ label: `Attempt ${attempt}`, status: result.event.status, detail: result.event.message });
    }
    return { id, title: "CRM rate limit", steps: notes, outcome: "Retries stop after two deferrals. The store is unchanged." };
  }
  if (id === "ownership") {
    const record = records.find((item) => item.id === "web-priya");
    if (!record) return missing(id);
    const decision = routeRecord(record, scoreRecord(record, normalizeScoreWeights(0.5, 0.3)));
    return {
      id,
      title: "Conflicting ownership",
      steps: decision.rules.map((rule) => ({
        label: rule.label,
        status: rule.matched ? (rule.applied ? "applied" : "matched, not applied") : "not matched",
        detail: rule.detail,
      })),
      outcome: decision.explanation,
    };
  }
  if (id === "incomplete") {
    const record = records.find((item) => item.id === "referral-harbor");
    if (!record) return missing(id);
    return {
      id,
      title: "Incomplete prospect",
      steps: record.issues.map((issue) => ({ label: issue.field, status: issue.code, detail: issue.message })),
      outcome: "The row stays in the queue and is not routed.",
    };
  }
  if (id === "stale") {
    const record = records.find((item) => item.id === "web-priya");
    if (!record) return missing(id);
    const proposal = proposeEnrichment(record).find((item) => item.field === "employeeRange");
    return {
      id,
      title: "Stale enrichment",
      steps: [
        {
          label: "Compare values",
          status: proposal?.recommendation ?? "missing",
          detail: proposal
            ? `Current "${proposal.current}" from the inbound row. Fixture "${proposal.proposed}" observed ${proposal.observedAt}. Recommendation: ${proposal.recommendation}.`
            : "No proposal.",
        },
      ],
      outcome: "The newer inbound employee range is kept unless a person accepts the older fixture.",
    };
  }
  if (id === "partial") {
    const record = records.find((item) => item.id === "web-noah");
    if (!record) return missing(id);
    const result = applyCrmWrite(CRM_SEED, [], record, "leo", true, "partial");
    return {
      id,
      title: "Partial CRM update",
      steps: [
        { label: "Written", status: "stored", detail: result.event.fieldsWritten.join(", ") || "none" },
        { label: "Failed", status: "failed", detail: result.event.fieldsFailed.join(", ") || "none" },
      ],
      outcome: result.event.message,
    };
  }
  if (id === "duplicate-task") {
    const first = createFollowUp([], "referral-theo", "leo");
    const second = createFollowUp(first.tasks, "referral-theo", "leo");
    return {
      id,
      title: "Duplicate follow-up task",
      steps: [
        { label: "First run", status: first.status, detail: `Tasks stored: ${first.tasks.length}.` },
        { label: "Retry after timeout", status: second.status, detail: `Tasks stored: ${second.tasks.length}.` },
      ],
      outcome: "The retry finds the existing task key and does not create another task.",
    };
  }
  if (id === "discrepancy") {
    const contactIds = new Set<string>();
    const pairs = findDuplicatePairs(records);
    for (const pair of pairs) {
      if (pair.kind === "contact") {
        contactIds.add(pair.leftId);
        contactIds.add(pair.rightId);
      }
    }
    const claimed = contactIds.size + 3;
    const check = reconcileAggregate(claimed, contactIds.size, "Contact duplicates");
    return {
      id,
      title: "Analytics discrepancy",
      steps: [
        { label: "Claimed dashboard", status: "claimed", detail: `A stale aggregate says ${claimed}.` },
        { label: "Recount", status: "recounted", detail: `The current contact-duplicate set has ${contactIds.size} records.` },
      ],
      outcome: check.detail,
    };
  }
  return missing(id);
}

/** Trace used when a scenario id is unknown. */
function missing(id: string): FailureTrace {
  return { id, title: "Unknown scenario", steps: [], outcome: "No scenario is registered under that id." };
}

/** Failure scenario ids in display order. */
export const FAILURE_IDS = [
  "duplicate-event",
  "rate-limit",
  "ownership",
  "incomplete",
  "stale",
  "partial",
  "duplicate-task",
  "discrepancy",
] as const;

/** Reads a control's dataset into a workbench action. Unknown acts are no-ops. */
export function actionFromControl(
  dataset: { act?: string; pair?: string; id?: string; field?: string; choice?: string; which?: string },
  value: string,
  checked: boolean,
): WorkbenchAction {
  switch (dataset.act) {
    case "select":
      return { type: "select", id: dataset.id ?? "" };
    case "source":
      return { type: "source", source: (value || "all") as SourceId | "all" };
    case "query":
      return { type: "query", query: value };
    case "resolve":
      return {
        type: "resolve",
        pairId: dataset.pair ?? "",
        action: (dataset.choice ?? "review") as ResolutionAction,
      };
    case "weights":
      return { type: "weights", which: dataset.which === "size" ? "size" : "industry", value: Number(value) };
    case "confirm":
      return { type: "confirm", value: checked };
    case "enrich":
      return {
        type: "enrich",
        recordId: dataset.id ?? "",
        field: dataset.field ?? "",
        choice: dataset.choice === "keep" ? "keep" : "accept",
      };
    case "apply-crm":
    case "run-workflow":
    case "commit-queue":
    case "run-failure":
    case "clear-metric":
    case "reset":
      return { type: dataset.act };
    case "failure":
      return { type: "failure", id: value };
    case "metric":
      return { type: "metric", id: dataset.id ?? "" };
    case "architecture":
      return { type: "architecture", id: dataset.id ?? "" };
    default:
      return { type: "noop" };
  }
}

/** Starting state: the full queue, the seeded CRM row, and no merges yet. */
export function initialWorkbench(): WorkbenchState {
  return {
    raw: RAW_RECORDS,
    rejectedIds: [],
    selectedId: "web-mira",
    source: "all",
    query: "",
    resolutions: {},
    enrichmentChoices: {},
    industryWeight: 0.5,
    sizeWeight: 0.3,
    confirmed: false,
    crm: CRM_SEED,
    events: [],
    tasks: [],
    runs: [],
    notice: "",
    metricId: "",
    failureId: "duplicate-event",
    failureTrace: null,
    architectureId: "ingestion",
  };
}

/** Derived rows after normalization, merges, and accepted enrichment. */
export function presentRecords(state: WorkbenchState): {
  baseline: CanonicalRecord[];
  pairs: DuplicatePair[];
  views: RecordView[];
} {
  const baseline = normalizeAll(state.raw);
  const pairs = findDuplicatePairs(baseline);
  const resolved = applyResolutions(baseline, pairs, state.resolutions);
  const views = resolved.views.map((view) => applyEnrichmentChoices(view, state.enrichmentChoices));
  return { baseline, pairs, views };
}

/** The selected row, or the first remaining row. */
export function selectedRecord(state: WorkbenchState, views: RecordView[]): RecordView {
  return views.find((view) => view.id === state.selectedId) ?? views[0];
}

/** Search and source filter. */
export function filterRecords(records: RecordView[], source: WorkbenchState["source"], query: string): RecordView[] {
  const needle = query.trim().toLowerCase();
  return records.filter((record) => {
    if (source !== "all" && record.source !== source) return false;
    if (!needle) return true;
    return [record.accountName, record.contactName, record.email, record.domain].some((value) =>
      value.toLowerCase().includes(needle),
    );
  });
}

/** Reducer for the workbench. Unknown selections leave the state alone. */
export function workbenchReducer(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
  if (action.type === "noop") return state;
  if (action.type === "reset") return initialWorkbench();
  if (action.type === "select") {
    return state.raw.some((row) => row.id === action.id) || presentRecords(state).views.some((view) => view.id === action.id)
      ? { ...state, selectedId: action.id }
      : state;
  }
  if (action.type === "source") return { ...state, source: action.source };
  if (action.type === "query") return { ...state, query: action.query };
  if (action.type === "weights") {
    return action.which === "size"
      ? { ...state, sizeWeight: action.value }
      : { ...state, industryWeight: action.value };
  }
  if (action.type === "confirm") return { ...state, confirmed: action.value };
  if (action.type === "failure") return { ...state, failureId: action.id };
  if (action.type === "metric") return { ...state, metricId: action.id };
  if (action.type === "clear-metric") return { ...state, metricId: "" };
  if (action.type === "architecture") return { ...state, architectureId: action.id };
  if (action.type === "resolve") {
    const { pairs } = presentRecords(state);
    const pair = pairs.find((item) => item.id === action.pairId);
    if (!pair) return state;
    if (action.action === "merge" && !pair.autoMergeAllowed) {
      return { ...state, notice: "That pair was not merged. A shared domain is not a contact merge." };
    }
    return {
      ...state,
      resolutions: { ...state.resolutions, [action.pairId]: action.action },
      notice: `Recorded ${action.action} for ${action.pairId}.`,
    };
  }
  if (action.type === "enrich") {
    return {
      ...state,
      enrichmentChoices: {
        ...state.enrichmentChoices,
        [`${action.recordId}:${action.field}`]: action.choice,
      },
      notice: action.choice === "accept" ? "Accepted the fixture value for this field." : "Kept the current value.",
    };
  }
  if (action.type === "commit-queue") {
    const committed = commitQueue(state.raw);
    return {
      ...state,
      raw: committed.kept,
      rejectedIds: committed.rejected.map((row) => row.id),
      selectedId: committed.kept.some((row) => row.id === state.selectedId) ? state.selectedId : committed.kept[0]?.id ?? state.selectedId,
      notice: committed.rejected.length
        ? `Rejected ${committed.rejected.map((row) => row.id).join(", ")} as duplicate deliveries.`
        : "No duplicate idempotency keys were in the queue.",
    };
  }
  if (action.type === "run-failure") {
    return { ...state, failureTrace: runFailure(state.failureId) };
  }
  const presented = presentRecords(state);
  const record = selectedRecord(state, presented.views);
  const weights = normalizeScoreWeights(state.industryWeight, state.sizeWeight);
  const score = scoreRecord(record, weights);
  const routing = routeRecord(record, score);
  if (action.type === "apply-crm") {
    const written = applyCrmWrite(state.crm, state.events, record, routing.finalOwner, state.confirmed);
    return {
      ...state,
      crm: written.store,
      events: written.events,
      notice: written.event.message,
    };
  }
  const result = runWorkflow(record, score, routing, state.confirmed, state.crm, state.events, state.tasks, state.runs.length);
  return {
    ...state,
    crm: result.store,
    events: result.events,
    tasks: result.tasks,
    runs: [...state.runs, result.run],
    notice: `Workflow ${result.run.id} is ${result.run.status.replace(/_/g, " ")}.`,
  };
}
