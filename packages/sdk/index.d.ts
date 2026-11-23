/**
 * TypeScript declarations for `packages/sdk/index.mjs` (`ayushrai-sdk`).
 *
 * Describes `createAyushClient` and the request/response shapes for search, projects,
 * comparison, batch reads, and pollable search jobs.
 *
 * Connects to:
 * - `packages/sdk/index.mjs` and `packages/sdk/package.json`.
 */

export interface AyushClientOptions {
  baseUrl?: string;
  sandbox?: boolean;
  fetch?: typeof fetch;
}

export interface SearchOptions {
  q?: string;
  type?: string;
  limit?: number;
  cursor?: string;
}

export interface ListProjectsOptions {
  category?: string;
  type?: string;
  limit?: number;
  cursor?: string;
  archive?: boolean;
}

export interface BatchOperation {
  method?: "GET";
  path: string;
  query?: Record<string, string>;
}

export interface AyushClient {
  /** Lexical search over published records. */
  search(params?: SearchOptions): Promise<Record<string, unknown>>;
  /** Lists public projects with optional filters and pagination. */
  listProjects(params?: ListProjectsOptions): Promise<Record<string, unknown>>;
  /** Fetches a single project by slug. */
  getProject(slug: string, options?: { archive?: boolean }): Promise<Record<string, unknown>>;
  /** Compares two to four distinct projects by slug. */
  compareProjects(slugs: string[], options?: { archive?: boolean }): Promise<Record<string, unknown>>;
  /** Runs up to 8 read operations in one request. */
  batch(operations: BatchOperation[], idempotencyKey?: string): Promise<Record<string, unknown>>;
  /** Creates a pollable lexical search job (`202 Accepted`). */
  createSearchJob(q: string, idempotencyKey?: string): Promise<Record<string, unknown>>;
  /** Polls a search job by ID. */
  getSearchJob(id: string): Promise<Record<string, unknown>>;
}

/** Creates an API client for Ayush Rai's public portfolio API. */
export declare function createAyushClient(options?: AyushClientOptions): AyushClient;
