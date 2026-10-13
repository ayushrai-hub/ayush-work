/**
 * The browser origins that may make cross-origin requests to the site's own endpoints.
 *
 * Production origins plus the local dev and preview ports. Any other origin gets no
 * `Access-Control-Allow-Origin` header, so a browser page elsewhere cannot read the response or
 * pass a JSON preflight. Same-origin requests (the site calling its own API) never need a grant.
 *
 * Connects to:
 * - src/lib/agent/http.ts (`corsHeaders` for the REST API).
 * - api/send-email.ts (the contact form endpoint).
 * - Documented in docs/API_ENDPOINTS.md (CORS section).
 */
export const SITE_ORIGINS: ReadonlySet<string> = new Set([
  "https://www.ayushrai.site",
  "https://ayushrai.site",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
]);

/** True when `origin` is one of SITE_ORIGINS. */
export function isSiteOrigin(origin: string | null | undefined): origin is string {
  return typeof origin === "string" && SITE_ORIGINS.has(origin);
}
