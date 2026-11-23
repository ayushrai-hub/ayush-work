/**
 * Zero-dependency JavaScript SDK client for Ayush Rai's public portfolio API (`https://www.ayushrai.site`).
 *
 * Wraps `GET /api/v1/search`, `GET /api/v1/projects`, `GET /api/v1/projects/{slug}`,
 * `GET /api/v1/compare`, `POST /api/v1/batch`, `POST /api/v1/jobs`, `GET /api/v1/jobs/{id}`,
 * and `POST /ask` using standard `fetch`. Supports `sandbox: true` to route read calls
 * through `/api/sandbox/v1/*`.
 *
 * Connects to:
 * - Public REST API endpoints defined in `src/lib/agent/http.ts` and `src/lib/agent/openapi.ts`.
 * - Type declarations in `packages/sdk/index.d.ts`.
 */

const DEFAULT_BASE_URL = "https://www.ayushrai.site";

/** Normalizes a base origin by stripping trailing slashes. */
function trimBase(url) {
  return (url || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

/**
 * Creates a client for Ayush Rai's public read-only API.
 * Pass `sandbox: true` to target `/api/sandbox/v1/*` and `fetch` to supply a custom fetch implementation.
 */
export function createAyushClient(options = {}) {
  const baseUrl = trimBase(options.baseUrl);
  const fetchImpl = options.fetch || globalThis.fetch;
  const apiPrefix = options.sandbox ? "/api/sandbox/v1" : "/api/v1";

  /** Performs a JSON request against the configured origin and throws on non-2xx statuses. */
  async function request(path, init = {}) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(init.headers || {}),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || `HTTP ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.code = data?.error?.code;
      error.body = data;
      throw error;
    }
    return data;
  }

  return {
    /** Lexical search over published work, products, projects, research, and notes. */
    search(params = {}) {
      const query = new URLSearchParams();
      if (params.q != null) query.set("q", String(params.q));
      if (params.type) query.set("type", String(params.type));
      if (params.limit != null) query.set("limit", String(params.limit));
      if (params.cursor) query.set("cursor", String(params.cursor));
      const qs = query.toString();
      return request(`${apiPrefix}/search${qs ? `?${qs}` : ""}`);
    },

    /** Lists public projects with optional category, type, archive, limit, and cursor filters. */
    listProjects(params = {}) {
      const query = new URLSearchParams();
      if (params.category) query.set("category", String(params.category));
      if (params.type) query.set("type", String(params.type));
      if (params.limit != null) query.set("limit", String(params.limit));
      if (params.cursor) query.set("cursor", String(params.cursor));
      if (params.archive) query.set("archive", "1");
      const qs = query.toString();
      return request(`${apiPrefix}/projects${qs ? `?${qs}` : ""}`);
    },

    /** Fetches a single project by slug. */
    getProject(slug, options = {}) {
      const query = options.archive ? "?archive=1" : "";
      return request(`${apiPrefix}/projects/${encodeURIComponent(slug)}${query}`);
    },

    /** Compares two to four distinct projects by slug. */
    compareProjects(slugs, options = {}) {
      const query = new URLSearchParams({ slugs: slugs.join(",") });
      if (options.archive) query.set("archive", "1");
      return request(`${apiPrefix}/compare?${query.toString()}`);
    },

    /** Runs up to 8 read operations in one request, with an optional Idempotency-Key. */
    batch(operations, idempotencyKey) {
      return request("/api/v1/batch", {
        method: "POST",
        headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
        body: JSON.stringify({ operations }),
      });
    },

    /** Creates a pollable lexical search job (`202 Accepted`) with an optional Idempotency-Key. */
    createSearchJob(q, idempotencyKey) {
      return request("/api/v1/jobs", {
        method: "POST",
        headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
        body: JSON.stringify({ operation: "search", q }),
      });
    },

    /** Polls a search job created by `createSearchJob`. */
    getSearchJob(id) {
      return request(`/api/v1/jobs/${encodeURIComponent(id)}`);
    },
  };
}
