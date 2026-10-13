/**
 * In-memory rate limiting for the REST API and the MCP endpoint, with standard RateLimit headers.
 *
 * Fixed-window limit per client address, counted inside one function instance.
 * Header syntax follows draft-ietf-httpapi-ratelimit-headers-11 (Structured Fields).
 * Serverless hosts run several instances, so the real ceiling can be higher than the quota;
 * a client that stays under the advertised quota is never throttled.
 *
 * Connects to:
 * - `http.ts` `agentApiResponse` and `mcpHttp.ts` `handleMcpRequest` call `takeRateLimit` and
 *   `clientKeyFrom`; `vitePlugin.ts` uses `clientKeyFrom` as a fallback key.
 * - `openapi.ts` and the developer docs quote the quota and window constants.
 * - Tested in `src/__tests__/agentReadiness.test.ts`, which calls `resetRateLimits` between tests.
 */
export const RATE_LIMIT_POLICY = "default";
export const RATE_LIMIT_QUOTA = 60;
export const RATE_LIMIT_WINDOW_SECONDS = 60;
/** Value for `Access-Control-Expose-Headers` so browser clients can read the limit headers. */
export const RATE_LIMIT_EXPOSED_HEADERS = "RateLimit, RateLimit-Policy, Retry-After";

/** Map size that triggers pruning of expired windows. Not a hard cap: live windows are never evicted. */
const MAX_TRACKED_CLIENTS = 5000;

/** Start time (ms) and request count of one client's current window. */
interface Window {
  start: number;
  count: number;
}

/** Per-instance state, keyed by client address. Lost when the instance is recycled. */
const windows = new Map<string, Window>();

/** Whether to serve the request, and the RateLimit headers to send either way. */
export interface RateLimitDecision {
  allowed: boolean;
  headers: Record<string, string>;
}

/** Deletes every window that has already expired. */
function prune(now: number) {
  const windowMs = RATE_LIMIT_WINDOW_SECONDS * 1000;
  for (const [key, window] of windows) {
    if (now - window.start >= windowMs) windows.delete(key);
  }
}

/**
 * Counts one request for `clientKey` and decides whether it is allowed. A window starts at the
 * client's first request and lasts `RATE_LIMIT_WINDOW_SECONDS`. Rejected requests also count.
 * `Retry-After` is added only when the request is rejected. `now` is injectable for tests.
 */
export function takeRateLimit(clientKey: string, now = Date.now()): RateLimitDecision {
  const windowMs = RATE_LIMIT_WINDOW_SECONDS * 1000;
  let window = windows.get(clientKey);
  if (!window || now - window.start >= windowMs) {
    if (windows.size >= MAX_TRACKED_CLIENTS) prune(now);
    window = { start: now, count: 0 };
    windows.set(clientKey, window);
  }
  window.count += 1;

  const allowed = window.count <= RATE_LIMIT_QUOTA;
  const remaining = Math.max(0, RATE_LIMIT_QUOTA - window.count);
  const resetSeconds = Math.max(1, Math.ceil((window.start + windowMs - now) / 1000));
  const headers: Record<string, string> = {
    "RateLimit-Policy": `"${RATE_LIMIT_POLICY}";q=${RATE_LIMIT_QUOTA};w=${RATE_LIMIT_WINDOW_SECONDS}`,
    RateLimit: `"${RATE_LIMIT_POLICY}";r=${remaining};t=${resetSeconds}`,
  };
  if (!allowed) headers["Retry-After"] = String(resetSeconds);
  return { allowed, headers };
}

/** Request headers as a Web `Headers` object or a Node-style record. */
type HeaderSource =
  | Headers
  | Record<string, string | string[] | undefined>
  | undefined;

/** First value of a header from either header shape. */
function readHeader(headers: HeaderSource, name: string): string | undefined {
  if (!headers) return undefined;
  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name) ?? undefined;
  }
  const bag = headers as Record<string, string | string[] | undefined>;
  const value = bag[name] ?? bag[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Rate-limit key for a request: Netlify's `x-nf-client-connection-ip`, then `x-real-ip`, then the
 * first `x-forwarded-for` entry. Clients with none of these share the `anonymous` bucket.
 */
export function clientKeyFrom(headers: HeaderSource): string {
  const direct =
    readHeader(headers, "x-nf-client-connection-ip") ?? readHeader(headers, "x-real-ip");
  if (direct) return direct.trim();
  const forwarded = readHeader(headers, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "anonymous";
}

/** Clears all windows. Used by tests. */
export function resetRateLimits() {
  windows.clear();
}
