/**
 * Validators for query parameters and tool arguments shared by the REST API and MCP.
 *
 * Each validator returns null when the value is acceptable, or a `FieldError` whose `code` maps
 * to an `ApiErrorCode`. Missing optional values are accepted. Allowed categories and types come
 * from the label maps in `src/content`, so new content values are accepted automatically.
 *
 * Connects to:
 * - `http.ts` (REST), `mcpServer.ts` (project tools), and `searchTool.ts` (search tools).
 *   `pagination.ts` reuses the `FieldError` type.
 * - Depends on `src/content` (`projectCategoryLabels`, `projectTypeLabels`) and the limits in `search.ts`.
 */
import { projectCategoryLabels, projectTypeLabels } from "../../content";
import { SEARCH_MAX_QUERY, SEARCH_TYPES } from "./search";

/** Lowercase letters and digits in hyphen-separated groups; same pattern as the OpenAPI slug parameter. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** A rejected input: a 400-class error code and a message naming the problem. */
export interface FieldError {
  code: "invalid_query" | "invalid_slug" | "invalid_filter" | "invalid_compare" | "invalid_cursor";
  message: string;
}

/** Search text of at most `SEARCH_MAX_QUERY` characters. Null and empty are valid. */
export function validateQuery(value: string | null): FieldError | null {
  const query = value ?? "";
  if (query.length > SEARCH_MAX_QUERY) {
    return {
      code: "invalid_query",
      message: `Query must be at most ${SEARCH_MAX_QUERY} characters.`,
    };
  }
  return null;
}

/** Slug format only; it does not check that the project exists. */
export function validateSlug(value: string): FieldError | null {
  if (!SLUG.test(value)) {
    return {
      code: "invalid_slug",
      message: "Slug must be lowercase letters, numbers, and single hyphens.",
    };
  }
  return null;
}

/** Optional search `type`; must be one of `SEARCH_TYPES`, case-sensitive. */
export function validateSearchType(value: string | null): FieldError | null {
  if (!value) return null;
  if (!(SEARCH_TYPES as readonly string[]).includes(value)) {
    return {
      code: "invalid_filter",
      message: `Unknown type "${value}".`,
    };
  }
  return null;
}

/** Optional project `category`; must be a key of `projectCategoryLabels`. */
export function validateProjectCategory(value: string | null): FieldError | null {
  if (!value) return null;
  if (!(value in projectCategoryLabels)) {
    return { code: "invalid_filter", message: `Unknown category "${value}".` };
  }
  return null;
}

/** Optional project `type`; must be a key of `projectTypeLabels`. */
export function validateProjectType(value: string | null): FieldError | null {
  if (!value) return null;
  if (!(value in projectTypeLabels)) {
    return { code: "invalid_filter", message: `Unknown project type "${value}".` };
  }
  return null;
}

/**
 * Parses the `limit` query string. Missing or empty gives `{}` so callers use their default;
 * anything other than an integer from 1 to 20 gives an `invalid_filter` error.
 */
export function parseLimit(value: string | null): { limit?: number; error?: FieldError } {
  if (value === null || value === "") return {};
  if (!/^\d+$/.test(value)) {
    return { error: { code: "invalid_filter", message: "limit must be a positive integer." } };
  }
  const limit = Number(value);
  if (limit < 1 || limit > 20) {
    return { error: { code: "invalid_filter", message: "limit must be between 1 and 20." } };
  }
  return { limit };
}
