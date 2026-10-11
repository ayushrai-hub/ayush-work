import { projectCategoryLabels, projectTypeLabels } from "../../content";
import { SEARCH_MAX_QUERY, SEARCH_TYPES } from "./search";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface FieldError {
  code: "invalid_query" | "invalid_slug" | "invalid_filter" | "invalid_compare";
  message: string;
}

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

export function validateSlug(value: string): FieldError | null {
  if (!SLUG.test(value)) {
    return {
      code: "invalid_slug",
      message: "Slug must be lowercase letters, numbers, and single hyphens.",
    };
  }
  return null;
}

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

export function validateProjectCategory(value: string | null): FieldError | null {
  if (!value) return null;
  if (!(value in projectCategoryLabels)) {
    return { code: "invalid_filter", message: `Unknown category "${value}".` };
  }
  return null;
}

export function validateProjectType(value: string | null): FieldError | null {
  if (!value) return null;
  if (!(value in projectTypeLabels)) {
    return { code: "invalid_filter", message: `Unknown project type "${value}".` };
  }
  return null;
}

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
