import type { FieldError } from "./validate";

export interface Page<T> {
  items: T[];
  /** Opaque. Pass back as `cursor` for the next page; null on the last page. */
  nextCursor: string | null;
}

const PREFIX = "o:";

function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
}

export function encodeCursor(offset: number): string {
  return toBase64Url(`${PREFIX}${offset}`);
}

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

export function paginate<T>(items: T[], offset: number, limit: number): Page<T> {
  const end = offset + limit;
  return {
    items: items.slice(offset, end),
    nextCursor: end < items.length ? encodeCursor(end) : null,
  };
}
