/**
 * Synthetic prospects for the REVFLOW workbench.
 *
 * Companies and people are fictional. Domains use the reserved `.example` suffix.
 * The rows disagree on field names, duplicates, and completeness so the simulation
 * has something to normalize, match, and reject. No row is a real person.
 *
 * Connects to:
 * - src/lib/revops/types.ts.
 * - src/lib/revops/engine.ts reads `RAW_RECORDS`, `ENRICHMENT_FIXTURES`, `REPS`, and `CRM_SEED`.
 */

import type { CrmAccount, RawRecord, SalesRep, SourceId } from "./types";

/** Fixed clock for freshness so a reload does not change the demo. */
export const AS_OF = "2026-10-19";

/** Builds one inbound row. Called while this module loads. */
function row(
  id: string,
  source: SourceId,
  receivedAt: string,
  idempotencyKey: string,
  fields: Record<string, string>,
): RawRecord {
  return { id, source, receivedAt, idempotencyKey, fields };
}

/**
 * Inbound queue. Two Mira rows share an idempotency key so a second delivery can be rejected.
 * The queue still shows both until the visitor commits it.
 */
export const RAW_RECORDS: RawRecord[] = [
  row("web-mira", "website_demo", "2026-10-12", "demo:mira:2026-10-12", {
    company: "  Northwind   Ledger ",
    website: "https://www.Northwind-Ledger.example/pricing",
    name: "Mira Chen",
    email_address: "Mira.Chen@Northwind-Ledger.example",
    job_role: "VP Revenue Operations",
    department: "Revenue",
    seniority: "VP",
    employees: "51-200",
    industry: "SaaS",
    country: "USA",
    intent: "high",
    stage: "mql",
    last_activity: "2026-10-12",
    internal_notes: "asked for a workflow diagram",
  }),
  row("web-mira-dup", "website_demo", "2026-10-12", "demo:mira:2026-10-12", {
    company: "Northwind Ledger",
    website: "northwind-ledger.example",
    name: "Mira Chen",
    email: "mira.chen@northwind-ledger.example",
    title: "Vice President, Revenue Operations",
    seniority: "Vice President",
    employees: "51-200",
    industry: "B2B software",
    country: "United States",
    intent: "high",
    stage: "inquiry",
    last_activity: "2026-10-12",
  }),
  row("csv-mira", "csv_import", "2026-09-02", "csv:mira:2026-09-02", {
    organization_name: "Northwind Ledger Inc",
    domain: "northwind-ledger.example",
    full_name: "Mira Chen",
    work_email: "mira.chen@northwind-ledger.example",
    title: "Director of Revenue Operations",
    department: "Operations",
    seniority: "Director",
    employees: "51-200",
    industry: "B2B software",
    country: "United States",
    intent: "medium",
    stage: "lead",
    last_activity: "2026-09-01",
  }),
  row("event-jordan", "event", "2026-10-08", "event:jordan:2026-10-08", {
    company: "Northwind Ledger",
    domain: "northwind-ledger.example",
    name: "Jordan Hale",
    email: "jordan.hale@northwind-ledger.example",
    title: "Account Executive",
    department: "Sales",
    seniority: "Account Executive",
    employees: "51-200",
    industry: "B2B software",
    country: "United States",
    intent: "low",
    stage: "lead",
    last_activity: "2026-10-08",
  }),
  row("csv-north-wind", "csv_import", "2026-10-03", "csv:north-wind:2026-10-03", {
    organization_name: "North Wind Ledger",
    domain: "northwindledger.example",
    full_name: "Mira Chen",
    work_email: "mira.chen@northwindledger.example",
    title: "VP Revenue Operations",
    seniority: "VP",
    employees: "11-50",
    industry: "SaaS",
    country: "USA",
    intent: "medium",
    stage: "inquiry",
    last_activity: "2026-10-03",
  }),
  row("signup-hello", "product_signup", "2026-10-11", "signup:hello:2026-10-11", {
    company: "Bramble Ops",
    domain: "brambleops.example",
    email: "hello@brambleops.example",
    industry: "B2B software",
    country: "United States",
    stage: "inquiry",
  }),
  row("event-imani", "event", "2026-10-09", "event:imani:2026-10-09", {
    company: "Bramble Ops",
    domain: "brambleops.example",
    name: "Imani Brooks",
    email: "imani.brooks@brambleops.example",
    title: "Head of Sales",
    department: "Sales",
    seniority: "Director",
    employees: "11-50",
    industry: "B2B software",
    country: "United States",
    intent: "medium",
    stage: "mql",
    last_activity: "2026-10-09",
  }),
  row("referral-harbor", "referral", "2026-10-04", "referral:harbor:2026-10-04", {
    company: "Harbor Grid",
    website: "harborgrid.example",
    title: "Founder",
    country: "India",
    stage: "inquiry",
  }),
  row("web-priya", "website_demo", "2026-10-15", "demo:priya:2026-10-15", {
    company: "Oakline Analytics",
    website: "oakline.example",
    name: "Priya Nair",
    email: "priya.nair@oakline.example",
    title: "VP Analytics",
    department: "Analytics",
    seniority: "VP",
    employees: "201-1000",
    industry: "Analytics",
    country: "India",
    intent: "high",
    stage: "sql",
    last_activity: "2026-10-15",
  }),
  row("event-oak-line", "event", "2026-10-06", "event:oak-line:2026-10-06", {
    company: "Oak Line Analytics",
    domain: "oak-line.example",
    name: "Priya Nair",
    email: "priya@oak-line.example",
    title: "Analyst",
    seniority: "Individual Contributor",
    employees: "11-50",
    industry: "Data analytics",
    country: "India",
    intent: "low",
    stage: "inquiry",
    last_activity: "2026-10-06",
  }),
  row("signup-chris", "product_signup", "2026-10-10", "signup:chris:2026-10-10", {
    company: "Sable Route",
    domain: "sableroute.example",
    name: "Chris Adeyemi",
    email: "chris.adeyemi@sableroute.example",
    title: "Manager, Partnerships",
    seniority: "Manager",
    employees: "1000+",
    industry: "Logistics",
    country: "Nigeria",
    intent: "low",
    owner: "noor",
    stage: "lead",
    last_activity: "2026-10-10",
  }),
  row("csv-elena", "csv_import", "2026-05-02", "csv:elena:2026-05-02", {
    organization_name: "Kite Quill",
    domain: "kitequill.example",
    full_name: "Elena Voss",
    work_email: "elena.voss@kitequill.example",
    title: "CTO",
    country: "Germany",
    stage: "inquiry",
    last_activity: "2026-05-01",
  }),
  row("referral-theo", "referral", "2026-10-16", "referral:theo:2026-10-16", {
    company: "Lantern Metrics",
    domain: "lanternmetrics.example",
    name: "Theo Park",
    email: "theo.park@lanternmetrics.example",
    title: "Director of Marketing",
    department: "Marketing",
    seniority: "Director",
    employees: "51-200",
    industry: "B2B software",
    country: "United States",
    intent: "high",
    stage: "opportunity",
    last_activity: "2026-10-16",
  }),
  row("web-noah", "website_demo", "2026-10-14", "demo:noah:2026-10-14", {
    company: "Fieldnote Systems",
    website: "fieldnote.example",
    name: "Noah Ibarra",
    email: "noah.ibarra@fieldnote.example",
    title: "VP Operations",
    seniority: "VP",
    employees: "51-200",
    industry: "B2B software",
    country: "United States",
    intent: "medium",
    stage: "lead",
    last_activity: "2026-10-14",
  }),
  row("enrich-oakline", "enrichment_file", "2024-06-01", "enrich:oakline:2024-06-01", {
    organization_name: "Oakline Analytics",
    domain: "oakline.example",
    full_name: "Priya Nair",
    work_email: "priya.nair@oakline.example",
    title: "VP Analytics",
    employees: "11-50",
    industry: "Analytics",
    country: "India",
    stage: "lead",
    last_activity: "2024-06-01",
  }),
  row("csv-pebble", "csv_import", "2026-10-07", "csv:pebble:2026-10-07", {
    organization_name: "Pebble Index",
    domain: "pebbleindex.example",
    full_name: "Rowan Ellis",
    work_email: "ops-team",
    title: "Intern",
    seniority: "Intern",
    employees: "about 12",
    industry: "Widgets",
    country: "Mars",
    intent: "hot",
    stage: "inquiry",
    last_activity: "2026-10-07",
  }),
];

/** Local enrichment answers. These are not live provider responses. */
export const ENRICHMENT_FIXTURES: Record<
  string,
  {
    status: "ok" | "failed" | "rate_limited" | "unavailable";
    observedAt: string;
    note: string;
    fields: Partial<Record<"industry" | "employeeRange" | "country" | "department" | "seniority", string>>;
  }
> = {
  "northwind-ledger.example": {
    status: "ok",
    observedAt: "2026-10-10",
    note: "Synthetic fixture filled a blank department and confirmed the industry.",
    fields: { industry: "B2B software", department: "Revenue", employeeRange: "51-200" },
  },
  "brambleops.example": {
    status: "ok",
    observedAt: "2026-10-09",
    note: "Synthetic fixture can fill employee range when the inbound row left it blank.",
    fields: { employeeRange: "11-50", industry: "B2B software" },
  },
  "oakline.example": {
    status: "ok",
    observedAt: "2024-06-01",
    note: "The fixture employee range is older than the inbound value.",
    fields: { employeeRange: "11-50", industry: "Analytics" },
  },
  "harborgrid.example": {
    status: "rate_limited",
    observedAt: "2026-10-04",
    note: "The simulated provider returned a rate limit. No fields were filled.",
    fields: {},
  },
  "sableroute.example": {
    status: "unavailable",
    observedAt: "2026-10-10",
    note: "The simulated provider was unavailable.",
    fields: {},
  },
  "kitequill.example": {
    status: "ok",
    observedAt: "2026-10-01",
    note: "The fixture industry disagrees with a blank inbound industry, so it is a fill, not a conflict, until a value exists.",
    fields: { industry: "Media", employeeRange: "51-200" },
  },
  "lanternmetrics.example": {
    status: "ok",
    observedAt: "2026-10-16",
    note: "Synthetic fixture agrees with the inbound industry.",
    fields: { industry: "B2B software", department: "Marketing" },
  },
  "fieldnote.example": {
    status: "failed",
    observedAt: "2026-10-14",
    note: "The simulated enrichment call failed. The inbound values stay as they are.",
    fields: {},
  },
};

/** Fictional sellers. Availability is part of the routing fixture. */
export const REPS: SalesRep[] = [
  { id: "anika", name: "Anika Shah", available: true, workload: 3, territory: "India", specialty: "Territory" },
  { id: "leo", name: "Leo Martins", available: true, workload: 4, territory: "United States", specialty: "Territory" },
  { id: "noor", name: "Noor El-Sayed", available: false, workload: 6, territory: "Enterprise", specialty: "Enterprise" },
  { id: "sam", name: "Sam Okonkwo", available: true, workload: 2, territory: "Analytics", specialty: "Analytics" },
];

/** One account already in the simulated CRM, so Northwind is an update. */
export const CRM_SEED: CrmAccount[] = [
  {
    id: "crm-northwind",
    domain: "northwind-ledger.example",
    email: "mira.chen@northwind-ledger.example",
    accountName: "Northwind Ledger",
    lifecycle: "lead",
    owner: "",
    industry: "B2B software",
    jobTitle: "VP Revenue Operations",
    updatedAt: "2026-10-01",
  },
];

/** Human labels for source ids. */
export const SOURCE_LABELS: Record<SourceId, string> = {
  website_demo: "Website demo request",
  csv_import: "CSV import",
  event: "Event registration",
  product_signup: "Product signup",
  referral: "Referral",
  enrichment_file: "Simulated enrichment file",
};
