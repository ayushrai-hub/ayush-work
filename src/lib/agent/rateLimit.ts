/**
 * Fixed-window limit per client address, counted inside one function instance.
 * Header syntax follows draft-ietf-httpapi-ratelimit-headers-11 (Structured Fields).
 * Serverless hosts run several instances, so the real ceiling can be higher than the quota;
 * a client that stays under the advertised quota is never throttled.
 */
export const RATE_LIMIT_POLICY = "default";
export const RATE_LIMIT_QUOTA = 60;
export const RATE_LIMIT_WINDOW_SECONDS = 60;
export const RATE_LIMIT_EXPOSED_HEADERS = "RateLimit, RateLimit-Policy, Retry-After";

const MAX_TRACKED_CLIENTS = 5000;

interface Window {
  start: number;
  count: number;
}

const windows = new Map<string, Window>();

export interface RateLimitDecision {
  allowed: boolean;
  headers: Record<string, string>;
}

function prune(now: number) {
  const windowMs = RATE_LIMIT_WINDOW_SECONDS * 1000;
  for (const [key, window] of windows) {
    if (now - window.start >= windowMs) windows.delete(key);
  }
}

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

type HeaderSource =
  | Headers
  | Record<string, string | string[] | undefined>
  | undefined;

function readHeader(headers: HeaderSource, name: string): string | undefined {
  if (!headers) return undefined;
  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name) ?? undefined;
  }
  const bag = headers as Record<string, string | string[] | undefined>;
  const value = bag[name] ?? bag[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

export function clientKeyFrom(headers: HeaderSource): string {
  const direct =
    readHeader(headers, "x-nf-client-connection-ip") ?? readHeader(headers, "x-real-ip");
  if (direct) return direct.trim();
  const forwarded = readHeader(headers, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "anonymous";
}

export function resetRateLimits() {
  windows.clear();
}
