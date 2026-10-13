/**
 * Canonical URL and JSON-LD `@id` builders for the site origin.
 *
 * Everything derives from `person.siteUrl` (https://www.ayushrai.site) with any trailing slash
 * removed, so pages, structured data, and tests agree on one URL form.
 *
 * Connects to:
 * - src/components/site/PageSEO.tsx and src/pages/DomainPage.tsx (canonical links and JSON-LD ids).
 * - src/__tests__/domainSurfaces.test.tsx.
 * - src/content/person.ts (siteUrl).
 */
import { person } from "../content/person";

/**
 * Absolute canonical URL. Non-root pages use a trailing slash, matching the prerendered
 * `<route>/index.html` files and the trailing-slash redirect in vercel.json.
 */
export function canonicalUrl(path: string): string {
  const origin = person.siteUrl.replace(/\/$/, "");
  if (!path || path === "/") return `${origin}/`;
  const clean = (path.startsWith("/") ? path : `/${path}`).replace(/\/+$/, "");
  return `${origin}${clean}/`;
}

/** JSON-LD `@id` for the Person node (`<origin>/#person`). */
export function personId(): string {
  return `${person.siteUrl.replace(/\/$/, "")}/#person`;
}

/** JSON-LD `@id` for the WebSite node (`<origin>/#website`). */
export function websiteId(): string {
  return `${person.siteUrl.replace(/\/$/, "")}/#website`;
}
