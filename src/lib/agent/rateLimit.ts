/**
 * In-memory rate limiting for the REST API, the MCP endpoint, and the contact form, with standard
 * RateLimit headers.
 *
 * Fixed-window limit per client address, counted inside one function instance.
 * Header syntax follows draft-ietf-httpapi-ratelimit-headers-11 (Structured Fields).
 * Serverless hosts run several instances, so the real ceiling can be higher than the quota;
 * a client that stays under the advertised quota is never throttled. createRateLimiter builds an
 * independent limiter for another policy (the contact form uses a much smaller quota).
 *
 * Connects to:
 * - `http.ts` `agentApiResponse` and `mcpHttp.ts` `handleMcpRequest` call `takeRateLimit` and
 *   `clientKeyFrom`; `vitePlugin.ts` uses `clientKeyFrom` as a fallback key.
 * - `src/lib/server/contactEmail.ts` builds its own limiter with createRateLimiter.
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

/** Name, request quota, and window length of one rate-limit policy. */
export interface RateLimitPolicy {
  name: string;
  quota: number;
  windowSeconds: number;
}

/** Start time (ms) and request count of one client's current window. */
interface Window {
  start: number;
  count: number;
}

/** Whether to serve the request, and the RateLimit headers to send either way. */
export interface RateLimitDecision {
  allowed: boolean;
  headers: Record<string, string>;
}

/** A limiter with its own per-instance state. */
export interface RateLimiter {
  take(clientKey: string, now?: number): RateLimitDecision;
  reset(): void;
}

/**
 * Builds a fixed-window limiter for `policy`. A window starts at the client's first request and
 * lasts `windowSeconds`. Rejected requests also count. `Retry-After` is added only when the request
 * is rejected. State lives in this instance's memory and is lost when the instance is recycled.
 */
export function createRateLimiter(policy: RateLimitPolicy): RateLimiter {
  const windows = new Map<string, Window>();
  const windowMs = policy.windowSeconds * 1000;

  /** Deletes every window that has already expired. */
  function prune(now: number) {
    for (const [key, window] of windows) {
      if (now - window.start >= windowMs) windows.delete(key);
    }
  }

  return {
    take(clientKey, now = Date.now()) {
      let window = windows.get(clientKey);
      if (!window || now - window.start >= windowMs) {
        if (windows.size >= MAX_TRACKED_CLIENTS) prune(now);
        window = { start: now, count: 0 };
        windows.set(clientKey, window);
      }
      window.count += 1;

      const allowed = window.count <= policy.quota;
      const remaining = Math.max(0, policy.quota - window.count);
      const resetSeconds = Math.max(1, Math.ceil((window.start + windowMs - now) / 1000));
      const headers: Record<string, string> = {
        "RateLimit-Policy": `"${policy.name}";q=${policy.quota};w=${policy.windowSeconds}`,
        RateLimit: `"${policy.name}";r=${remaining};t=${resetSeconds}`,
      };
      if (!allowed) headers["Retry-After"] = String(resetSeconds);
      return { allowed, headers };
    },
    reset() {
      windows.clear();
    },
  };
}

/** The limiter shared by the REST API and MCP. */
const defaultLimiter = createRateLimiter({
  name: RATE_LIMIT_POLICY,
  quota: RATE_LIMIT_QUOTA,
  windowSeconds: RATE_LIMIT_WINDOW_SECONDS,
});

/** Counts one REST or MCP request for `clientKey` against the default policy. `now` is injectable for tests. */
export function takeRateLimit(clientKey: string, now = Date.now()): RateLimitDecision {
  return defaultLimiter.take(clientKey, now);
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

/** 32-bit FNV-1a hex digest. Used to key anonymous clients without keeping the raw header. */
function fnv1a(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

/**
 * Rate-limit key for a request: Netlify's `x-nf-client-connection-ip`, then `x-real-ip`, then the
 * first `x-forwarded-for` entry. Without an address, the key is `anonymous:` plus a hash of the
 * User-Agent, so unrelated anonymous clients do not share one bucket. A request with neither gets
 * plain `anonymous`. The User-Agent is trivially spoofable; this only spreads honest clients out.
 */
export function clientKeyFrom(headers: HeaderSource): string {
  const direct =
    readHeader(headers, "x-nf-client-connection-ip") ?? readHeader(headers, "x-real-ip");
  if (direct?.trim()) return direct.trim();
  const forwarded = readHeader(headers, "x-forwarded-for")?.split(",")[0].trim();
  if (forwarded) return forwarded;
  const userAgent = readHeader(headers, "user-agent")?.trim();
  return userAgent ? `anonymous:${fnv1a(userAgent)}` : "anonymous";
}

/** Clears the default limiter's windows. Used by tests. */
export function resetRateLimits() {
  defaultLimiter.reset();
}
