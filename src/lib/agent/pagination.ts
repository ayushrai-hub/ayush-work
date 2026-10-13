/**
 * Offset pagination behind opaque cursors, shared by search, the projects API, and MCP `list_projects`.
 *
 * A cursor is base64url of `o:<offset>`. Clients are told to treat it as opaque, so the encoding
 * can change without a new API version. Decoding rejects anything that is not this module's
 * format, and offsets longer than six digits.
 *
 * Connects to:
 * - `search.ts` and `projectsQuery.ts` call `paginate`; `http.ts` and `mcpServer.ts` call
 *   `decodeCursor` on the incoming `cursor`.
 * - Depends on the `FieldError` type from `validate.ts`, and on global `btoa`/`atob`.
 */
import type { FieldError } from "./validate";

/** One page of results plus the cursor for the next one. */
export interface Page<T> {
  items: T[];
  /** Opaque. Pass back as `cursor` for the next page; null on the last page. */
  nextCursor: string | null;
}

/** Marks a decoded cursor as an offset cursor from this module. */
const PREFIX = "o:";

/** base64url without padding. Input must be Latin-1, which cursor text always is. */
function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Inverse of `toBase64Url`; restores padding. `atob` throws on invalid input. */
function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
}

/** Opaque cursor for the page that starts at `offset`. */
export function encodeCursor(offset: number): string {
  return toBase64Url(`${PREFIX}${offset}`);
}

/**
 * Offset encoded in `value`. A missing or empty cursor means offset 0. Anything unreadable
 * returns offset 0 with an `invalid_cursor` error, which callers turn into a 400 or tool error.
 */
export function decodeCursor(value: string | null | undefined): {
  offset: number;
  error?: FieldError;
} {
  if (!value) return { offset: 0 };
  const invalid = {
    offset: 0,
    error: {
      code: "invalid_cursor" as const,
      message: "cursor must be a nextCursor value from a previous response.",
    },
  };
  let decoded: string;
  try {
    decoded = fromBase64Url(value);
  } catch {
    return invalid;
  }
  if (!decoded.startsWith(PREFIX)) return invalid;
  const digits = decoded.slice(PREFIX.length);
  if (!/^\d{1,6}$/.test(digits)) return invalid;
  return { offset: Number(digits) };
}

/**
 * Slice `items` from `offset` for `limit` entries. `nextCursor` is null when nothing follows.
 * An offset past the end gives an empty page, not an error.
 */
export function paginate<T>(items: T[], offset: number, limit: number): Page<T> {
  const end = offset + limit;
  return {
    items: items.slice(offset, end),
    nextCursor: end < items.length ? encodeCursor(end) : null,
  };
}
