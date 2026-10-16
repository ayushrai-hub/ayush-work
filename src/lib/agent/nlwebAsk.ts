/**
 * NLWeb-shaped `/ask` handler: natural-language query in, lexical portfolio hits out.
 *
 * Accepts GET (`?query=` / `?q=`) and POST JSON (`query` string or `{ text }`). Results come from
 * the same `searchPayload` function as `/api/v1/search`. Responses carry `_meta.response_type` and
 * `_meta.version` per NLWeb v0.55. This is not a generative model: unanswered or empty queries get
 * an honest `failure` or empty `answer`.
 *
 * Connects to:
 * - `api/ask.ts` and `vitePlugin.ts` (dev `/ask`). Rate-limited via `rateLimit.ts`.
 * - Tested in `agentReadiness.test.ts`. Depends on `search.ts` and `validate.ts`.
 */
import { person } from "../../content";
import { SEARCH_MAX_QUERY, searchPayload } from "./search";
import { validateQuery } from "./validate";

/** NLWeb protocol version this handler claims. */
export const NLWEB_VERSION = "0.55";

/** Absolute origin without a trailing slash. */
function origin() {
  return person.siteUrl.replace(/\/$/, "");
}

/** Pulls a query string from a loose POST body or GET params. */
export function extractAskQuery(input: {
  params?: URLSearchParams;
  body?: unknown;
}): { query: string; error?: string } {
  if (input.body && typeof input.body === "object") {
    const record = input.body as { query?: unknown; q?: unknown };
    if (typeof record.query === "string") return { query: record.query };
    if (record.query && typeof record.query === "object") {
      const text = (record.query as { text?: unknown }).text;
      if (typeof text === "string") return { query: text };
    }
    if (typeof record.q === "string") return { query: record.q };
  }
  const fromParams = input.params?.get("query") ?? input.params?.get("q") ?? "";
  if (fromParams) return { query: fromParams };
  return { query: "", error: "Provide query as a string, { text }, or ?query= / ?q=." };
}

/** One Schema.org-ish result row for conversational_search. */
function toResult(item: {
  title: string;
  summary: string;
  href: string;
  type: string;
  score?: number;
}) {
  const url = item.href.startsWith("http") ? item.href : `${origin()}${item.href}`;
  return {
    "@type": "Thing",
    name: item.title,
    description: item.summary,
    url,
    site: "www.ayushrai.site",
    score: item.score,
    schema_object: {
      "@context": "https://schema.org",
      "@type": item.type === "work" || item.type === "product" ? "CreativeWork" : "Thing",
      name: item.title,
      description: item.summary,
      url,
    },
  };
}

/**
 * Builds an NLWeb answer (or failure) from a raw query string. Does not invent facts beyond the
 * search index.
 */
export function buildAskResponse(rawQuery: string): { status: number; body: Record<string, unknown> } {
  const trimmed = rawQuery.trim();
  if (!trimmed) {
    return {
      status: 200,
      body: {
        _meta: {
          version: NLWEB_VERSION,
          response_type: "failure",
          response_format: "conversational_search",
        },
        error: { code: "invalid_query", message: "Query text is required." },
      },
    };
  }
  if (trimmed.length > SEARCH_MAX_QUERY) {
    return {
      status: 200,
      body: {
        _meta: {
          version: NLWEB_VERSION,
          response_type: "failure",
          response_format: "conversational_search",
        },
        error: {
          code: "invalid_query",
          message: `Query must be at most ${SEARCH_MAX_QUERY} characters.`,
        },
      },
    };
  }
  const invalid = validateQuery(trimmed);
  if (invalid) {
    return {
      status: 200,
      body: {
        _meta: {
          version: NLWEB_VERSION,
          response_type: "failure",
          response_format: "conversational_search",
        },
        error: { code: invalid.code, message: invalid.message },
      },
    };
  }

  const payload = searchPayload(trimmed, { limit: 8 });
  const results = payload.results.map((item) =>
    toResult({
      title: item.title,
      summary: item.summary,
      href: item.href,
      type: item.type,
    }),
  );

  return {
    status: 200,
    body: {
      query: trimmed,
      site: "www.ayushrai.site",
      mode: "list",
      total_results: results.length,
      results,
      _meta: {
        version: NLWEB_VERSION,
        response_type: "answer",
        response_format: "conversational_search",
        mode: "list",
        site: "www.ayushrai.site",
        note: "Lexical match over the public portfolio index. Not generative.",
      },
    },
  };
}
