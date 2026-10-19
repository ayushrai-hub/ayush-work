/**
 * Short-lived idempotency store for write and batch requests that send `Idempotency-Key`.
 *
 * The same key and body replay the stored success. The same key with a different body is a
 * conflict. Failures are not stored, so a client can correct the request and reuse the key.
 * The map lives in one function instance, like the rate limiter, and entries expire after a day.
 *
 * Connects to:
 * - `batch.ts` (POST /api/v1/batch) and `src/lib/server/contactEmail.ts` (POST /api/send-email).
 * - Tests call `resetIdempotency`. Node `crypto` hashes the raw body.
 */
import { createHash } from "node:crypto";

/** How long a stored success can be replayed. */
const TTL_MS = 24 * 60 * 60 * 1000;
/** Cap so a burst of distinct keys cannot grow the map without bound. */
const MAX_ENTRIES = 200;

/** One stored success, keyed by scope plus the client key. */
type Entry = {
  fingerprint: string;
  status: number;
  body: unknown;
  extraHeaders?: Record<string, string>;
  expires: number;
};

const entries = new Map<string, Entry>();

/** SHA-256 of the exact body bytes the client sent, so replay matches that payload. */
export function fingerprintBody(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/**
 * Reads an optional Idempotency-Key. Empty is "no key". A key longer than 128 characters is an
 * error the caller should answer with 400.
 */
export function readIdempotencyKey(value: string | null | undefined): { key: string | null; error: string | null } {
  if (value == null || value.trim() === "") return { key: null, error: null };
  const key = value.trim();
  if (key.length > 128) return { key: null, error: "Idempotency-Key must be at most 128 characters." };
  return { key, error: null };
}

/** Replay of a stored success, a conflict with a different body, or a key this instance has not stored. */
export type IdempotencyLookup =
  | { kind: "new" }
  | { kind: "conflict" }
  | { kind: "replay"; status: number; body: unknown; extraHeaders?: Record<string, string> };

/** Looks up `scope:key`. Expired entries are dropped and treated as new. */
export function lookupIdempotent(scope: string, key: string, fingerprint: string): IdempotencyLookup {
  const id = `${scope}:${key}`;
  const found = entries.get(id);
  if (!found || found.expires < Date.now()) {
    if (found) entries.delete(id);
    return { kind: "new" };
  }
  if (found.fingerprint !== fingerprint) return { kind: "conflict" };
  return { kind: "replay", status: found.status, body: found.body, extraHeaders: found.extraHeaders };
}

/** Stores a success. Drops the oldest entry when the map is full. */
export function storeIdempotent(
  scope: string,
  key: string,
  fingerprint: string,
  status: number,
  body: unknown,
  extraHeaders?: Record<string, string>,
): void {
  if (entries.size >= MAX_ENTRIES) {
    const oldest = entries.keys().next().value;
    if (oldest) entries.delete(oldest);
  }
  entries.set(`${scope}:${key}`, {
    fingerprint,
    status,
    body,
    extraHeaders,
    expires: Date.now() + TTL_MS,
  });
}

/** Drops every stored key. Used by tests. */
export function resetIdempotency(): void {
  entries.clear();
}
