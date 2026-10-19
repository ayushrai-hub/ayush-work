/**
 * POST /api/v1/batch: several public read calls in one request.
 *
 * Each operation is a GET path the read API already serves (search, projects, one project, or
 * compare) plus a string query. The batch does not call itself, the sandbox alias, or any write.
 * An optional Idempotency-Key replays the same body and rejects a different body with 409.
 *
 * Connects to:
 * - `http.ts` `dispatchAgentApi` for POST /api/v1/batch, and `api/batch.ts` on the hosts.
 * - `idempotency.ts` for the key. OpenAPI documents the path and the Idempotency-Key header.
 */
import { apiErrorBody, type ApiErrorCode } from "./apiError";
import { fingerprintBody, lookupIdempotent, readIdempotencyKey, storeIdempotent } from "./idempotency";

/** One batch response. `headers` is set when a stored success is replayed. */
export interface BatchResult {
  status: number;
  body: unknown;
  headers?: Record<string, string>;
}

/** Upper bound so one request cannot fan out without limit. */
export const BATCH_MAX_OPERATIONS = 8;

/** Status and JSON body, matching the REST helper in http.ts without importing it (that file calls this one). */
function fail(status: number, code: ApiErrorCode, message: string): BatchResult {
  return { status, body: apiErrorBody(code, message) };
}

/** True for a read path `dispatchAgentApi` already serves. Batch and sandbox paths are excluded. */
function isBatchablePath(path: string): boolean {
  if (path === "/api/search" || path === "/api/v1/search") return true;
  if (path === "/api/projects" || path === "/api/v1/projects" || path === "/api/v1/compare") return true;
  return /^\/api\/v1\/projects\/[^/]+$/.test(path);
}

/** Copies string query values. Non-strings become an error so the inner call sees a real query string. */
function queryFrom(value: unknown): URLSearchParams | { error: string } {
  const params = new URLSearchParams();
  if (value == null) return params;
  if (typeof value !== "object" || Array.isArray(value)) return { error: "query must be an object of strings." };
  for (const [key, item] of Object.entries(value)) {
    if (typeof item !== "string") return { error: `query.${key} must be a string.` };
    params.set(key, item);
  }
  return params;
}

/**
 * Runs one batch. `raw` is the parsed JSON body or the original JSON string (invalid JSON is 400).
 * `dispatch` is injected so this file does not import `http.ts`, which imports this file.
 */
export function runReadBatch(
  raw: unknown,
  idempotencyKey: string | null | undefined,
  dispatch: (pathname: string, params: URLSearchParams) => { status: number; body: unknown },
): BatchResult {
  const key = readIdempotencyKey(idempotencyKey);
  if (key.error) return fail(400, "invalid_query", key.error);

  const rawText = typeof raw === "string" ? raw : JSON.stringify(raw ?? null);
  let parsed: unknown = raw;
  if (typeof raw === "string") {
    if (raw.trim() === "") return fail(400, "invalid_query", "POST body must be a JSON object with operations.");
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      return fail(400, "invalid_query", "POST body must be JSON.");
    }
  }

  const fingerprint = fingerprintBody(rawText);
  if (key.key) {
    const prior = lookupIdempotent("batch", key.key, fingerprint);
    if (prior.kind === "conflict") {
      return fail(409, "idempotency_conflict", "Idempotency-Key was already used with a different body.");
    }
    if (prior.kind === "replay") {
      return {
        status: prior.status,
        body: prior.body,
        headers: { "Idempotent-Replayed": "true" },
      };
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return fail(400, "invalid_query", "POST body must be a JSON object with operations.");
  }
  const operations = (parsed as { operations?: unknown }).operations;
  if (!Array.isArray(operations) || operations.length < 1 || operations.length > BATCH_MAX_OPERATIONS) {
    return fail(400, "invalid_query", `operations must be an array of 1 to ${BATCH_MAX_OPERATIONS} read calls.`);
  }

  const results = operations.map((operation) => {
    if (!operation || typeof operation !== "object" || Array.isArray(operation)) {
      return fail(400, "invalid_query", "Each operation must be an object with path and query.");
    }
    const record = operation as { method?: unknown; path?: unknown; query?: unknown };
    const method = typeof record.method === "string" ? record.method.toUpperCase() : "GET";
    if (method !== "GET") {
      return fail(405, "method_not_allowed", "Batch operations are GET reads.");
    }
    if (typeof record.path !== "string" || !isBatchablePath(record.path)) {
      return fail(400, "invalid_query", "path must be a public read route such as /api/v1/search or /api/v1/projects/{slug}.");
    }
    const params = queryFrom(record.query);
    if ("error" in params) return fail(400, "invalid_query", params.error);
    const inner = dispatch(record.path, params);
    return { status: inner.status, body: inner.body };
  });

  const result: BatchResult = { status: 200, body: { results } };
  if (key.key) storeIdempotent("batch", key.key, fingerprint, result.status, result.body);
  return result;
}
