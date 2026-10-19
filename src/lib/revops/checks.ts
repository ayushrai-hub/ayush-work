/**
 * Checks the REVFLOW simulation by running it.
 *
 * `runRevopsChecks` returns one result per assertion. The page prints those results.
 * A passing row is produced only when the assertion holds. The list is not a hardcoded report.
 *
 * Connects to:
 * - src/lib/revops/engine.ts and fixtures.ts.
 * - src/pages/RevopsPowPage.tsx and src/__tests__/revops.test.ts.
 */

import { RAW_RECORDS, REPS } from "./fixtures";
import {
  applyCrmWrite,
  automationBlocked,
  commitQueue,
  createFollowUp,
  findDuplicatePairs,
  isSyntacticallyValidEmail,
  normalizeAll,
  proposeEnrichment,
  reconcileAggregate,
  routeRecord,
  runFailure,
  scoreRecord,
  normalizeScoreWeights,
} from "./engine";
import type { CanonicalRecord } from "./types";

/** One check the page can show. */
export interface RevopsCheck {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

/** True only when every flag is true. */
export function allTrue(flags: boolean[]): boolean {
  for (const flag of flags) {
    if (!flag) return false;
  }
  return true;
}

/** Runs the simulation checks and returns what each one observed. */
export function runRevopsChecks(): RevopsCheck[] {
  const checks: RevopsCheck[] = [];
  const add = (id: string, name: string, passed: boolean, detail: string) => {
    checks.push({ id, name, passed, detail });
  };
  const records = normalizeAll(RAW_RECORDS);
  const byId = (id: string) => records.find((record) => record.id === id) as CanonicalRecord;

  add(
    "keep-rows",
    "Normalization keeps every inbound row",
    records.length === RAW_RECORDS.length,
    `${records.length} canonical rows from ${RAW_RECORDS.length} inbound rows.`,
  );

  const mira = byId("web-mira");
  add(
    "domain-email",
    "Domain and email are normalized",
    allTrue([mira.domain === "northwind-ledger.example", mira.email === "mira.chen@northwind-ledger.example"]),
    `Domain "${mira.domain}", email "${mira.email}".`,
  );
  add(
    "unmapped",
    "Unmapped fields stay visible",
    mira.unmapped.some((field) => field.key === "internal_notes"),
    "internal_notes was not copied into the canonical prospect and was not deleted.",
  );

  const harbor = byId("referral-harbor");
  const pebble = byId("csv-pebble");
  add(
    "validation",
    "Invalid rows are kept and flagged",
    allTrue([harbor.issues.some((issue) => issue.code === "missing"), isSyntacticallyValidEmail(pebble.email) === false]),
    "Harbor is missing required fields. Pebble's email fails a syntactic check and is not a deliverability check.",
  );

  const pairs = findDuplicatePairs(records);
  const emailPair = pairs.find((pair) => pair.autoMergeAllowed) as (typeof pairs)[number];
  const accountPairs = pairs.filter((pair) => pair.kind === "account");
  const accountMergeable = accountPairs.filter((pair) => pair.autoMergeAllowed);
  add(
    "dedupe",
    "Email matches can merge; domain matches cannot",
    allTrue([
      emailPair.autoMergeAllowed,
      accountPairs.length > 0,
      accountMergeable.length === 0,
      emailPair.kind === "contact",
    ]),
    `Contact pair auto-merge ${String(emailPair.autoMergeAllowed)}. Account pairs stay closed to merge.`,
  );

  const priya = byId("web-priya");
  const stale = proposeEnrichment(priya).find((item) => item.field === "employeeRange") as ReturnType<typeof proposeEnrichment>[number];
  add(
    "stale",
    "Stale enrichment recommends keeping the newer value",
    allTrue([stale.recommendation === "keep", stale.conflict, stale.freshness === "stale"]),
    `Current "${stale.current}", fixture "${stale.proposed}", recommendation ${stale.recommendation}.`,
  );

  const weights = normalizeScoreWeights(0.5, 0.3);
  const priyaScore = scoreRecord(priya, weights);
  add(
    "score-split",
    "Score dimensions stay separate",
    allTrue([
      priyaScore.contributions.length === 4,
      priyaScore.confidence >= 60,
      priyaScore.formula.includes("stay separate"),
    ]),
    `Fit ${priyaScore.fit}, intent ${priyaScore.intent}, engagement ${priyaScore.engagement}, confidence ${priyaScore.confidence}.`,
  );

  const priyaRoute = routeRecord(priya, priyaScore);
  const industry = priyaRoute.rules.find((rule) => rule.id === "industry") as (typeof priyaRoute.rules)[number];
  const territory = priyaRoute.rules.find((rule) => rule.id === "territory") as (typeof priyaRoute.rules)[number];
  add(
    "routing",
    "Industry specialization wins over territory",
    allTrue([priyaRoute.finalOwner === "sam", industry.applied, territory.matched, territory.applied === false]),
    priyaRoute.explanation,
  );

  const elena = byId("csv-elena");
  const elenaRoute = routeRecord(elena, scoreRecord(elena, weights));
  add(
    "unassigned",
    "A row with no matching rule stays unassigned",
    allTrue([elenaRoute.outcome === "unassigned", elenaRoute.finalOwner === null]),
    elenaRoute.explanation,
  );

  add(
    "blocked",
    "Incomplete rows are not routed",
    allTrue([
      automationBlocked(harbor),
      routeRecord(harbor, scoreRecord(harbor, weights)).outcome === "blocked",
    ]),
    "Harbor Grid stops at validation.",
  );

  const theo = byId("referral-theo");
  const preview = applyCrmWrite([], [], theo, null, true);
  const confirmed = applyCrmWrite([], [], theo, "leo", false);
  const created = applyCrmWrite([], [], theo, "leo", true);
  const again = applyCrmWrite(created.store, created.events, theo, "leo", true);
  add(
    "crm-gate",
    "CRM writes require an owner and confirmation, then stay idempotent",
    allTrue([
      preview.event.status === "blocked",
      confirmed.event.status === "blocked",
      created.event.status === "applied",
      again.event.status === "duplicate_prevented",
    ]),
    `Unowned ${preview.event.status}, unconfirmed ${confirmed.event.status}, first ${created.event.status}, second ${again.event.status}.`,
  );

  const tasks = createFollowUp(createFollowUp([], "referral-theo", "leo").tasks, "referral-theo", "leo");
  add(
    "tasks",
    "A workflow retry does not create a second task",
    allTrue([tasks.status === "duplicate_prevented", tasks.tasks.length === 1]),
    `Stored tasks: ${tasks.tasks.length}.`,
  );

  const committed = commitQueue(RAW_RECORDS);
  add(
    "idempotency",
    "The duplicate Mira delivery is rejected on commit",
    allTrue([
      committed.rejected.some((row) => row.id === "web-mira-dup"),
      committed.kept.length === RAW_RECORDS.length - 1,
    ]),
    `Rejected ${committed.rejected.map((row) => row.id).join(", ")}.`,
  );

  const discrepancy = reconcileAggregate(9, 4, "Example");
  add(
    "reconcile",
    "A claimed aggregate that disagrees with the recount is visible",
    allTrue([discrepancy.matches === false, discrepancy.detail.includes("9"), discrepancy.detail.includes("4")]),
    discrepancy.detail,
  );

  const failure = runFailure("partial");
  add(
    "partial",
    "A partial CRM write names the failed field",
    failure.outcome.includes("industry"),
    failure.outcome,
  );

  add(
    "reps",
    "The demo uses fictional representatives",
    REPS.every((rep) => ["Anika Shah", "Leo Martins", "Noor El-Sayed", "Sam Okonkwo"].includes(rep.name)),
    REPS.map((rep) => rep.name).join(", "),
  );

  return checks;
}
