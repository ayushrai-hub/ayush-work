/**
 * Short search jobs for `POST /api/v1/jobs`.
 *
 * The search itself is the same lexical index as `GET /api/v1/search`. The POST returns
 * 202 Accepted with a job id and a `Location` the caller can poll, so a client that retries
 * after a dropped response can follow the job instead of guessing. An optional
 * `Idempotency-Key` replays that 202. Jobs live in this process, like the idempotency map.
 *
 * Connects to:
 * - `http.ts` routes POST `/api/v1/jobs` and GET `/api/v1/jobs/{id}`.
 * - `openapi.ts` documents the 202 and the header. `api/jobs.ts` is the Vercel entry.
 */
import { randomBytes } from "node:crypto";
import { person } from "../../content";
import { apiErrorBody } from "./apiError";
import { fingerprintBody, lookupIdempotent, readIdempotencyKey, storeIdempotent } from "./idempotency";
import { searchPayload } from "./search";
import { validateQuery } from "./validate";

/** How long a finished job can be polled. */
const TTL_MS = 24 * 60 * 60 * 1000;

/** One finished search, kept so GET can return the same body the 202 pointed at. */
type StoredJob = {
  body: Record<string, unknown>;
  expires: number;
};

const jobs = new Map<string, StoredJob>();

/** Status, JSON body, and optional headers for one job call. */
export interface JobResult {
  status: number;
  body: unknown;
  headers?: Record<string, string>;
}

/** Drops stored jobs. Tests call this between cases. */
export function resetJobs(): void {
  jobs.clear();
}

/** Absolute poll URL for a job id. */
function statusUrl(id: string): string {
  return `${person.siteUrl.replace(/\/$/, "")}/api/v1/jobs/${id}`;
}

/**
 * Accepts `{ operation: "search", q }` and returns 202 with the finished search.
 * The work is the public lexical search. The 202 exists so the caller has a stable poll URL.
 */
export function createSearchJob(rawBody: string, idempotencyKey: string | null | undefined): JobResult {
  const key = readIdempotencyKey(idempotencyKey);
  if (key.error) {
    return { status: 400, body: apiErrorBody("invalid_query", key.error) };
  }
  const fingerprint = fingerprintBody(rawBody);
  if (key.key) {
    const prior = lookupIdempotent("jobs", key.key, fingerprint);
    if (prior.kind === "conflict") {
      return { status: 409, body: apiErrorBody("idempotency_conflict", "Idempotency-Key was already used with a different body.") };
    }
    if (prior.kind === "replay") {
      return { status: prior.status, body: prior.body, headers: prior.extraHeaders };
    }
  }

  let parsed: unknown;
  try {
    parsed = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    return { status: 400, body: apiErrorBody("invalid_query", "Job body must be JSON.") };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { status: 400, body: apiErrorBody("invalid_query", "Job body must be a JSON object.") };
  }
  const record = parsed as { operation?: unknown; q?: unknown };
  if (record.operation !== "search") {
    return { status: 400, body: apiErrorBody("invalid_query", 'operation must be "search".') };
  }
  const q = typeof record.q === "string" ? record.q : "";
  const queryError = validateQuery(q);
  if (queryError) return { status: 400, body: apiErrorBody(queryError.code, queryError.message) };

  const id = `job_${randomBytes(8).toString("hex")}`;
  const url = statusUrl(id);
  const body = {
    id,
    status: "succeeded",
    operation: "search",
    statusUrl: url,
    result: searchPayload(q),
  };
  jobs.set(id, { body, expires: Date.now() + TTL_MS });
  const headers = { Location: url, "Cache-Control": "no-store" };
  if (key.key) storeIdempotent("jobs", key.key, fingerprint, 202, body, headers);
  return { status: 202, body, headers };
}

/** Poll body for a job id, or 404 when the id was never issued here. */
export function readSearchJob(id: string): JobResult {
  const found = jobs.get(id);
  if (!found || found.expires < Date.now()) {
    if (found) jobs.delete(id);
    return { status: 404, body: apiErrorBody("not_found", `No job ${id}.`) };
  }
  return { status: 200, body: found.body, headers: { "Cache-Control": "no-store" } };
}
