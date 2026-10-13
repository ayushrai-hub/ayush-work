/**
 * Checks whether an internal link points at a page the React app renders.
 *
 * The known set is every prerendered path from `src/lib/publicRoutes.ts`, plus the slug patterns
 * that `src/App.tsx` registers for detail pages. Search hits, Markdown twins, and domain evidence
 * links must stay inside this set. Hash targets are anchors on those pages, not extra routes.
 *
 * Connects to:
 * - Only tests import it: `agentSurfaces.test.ts`, `domainSurfaces.test.tsx`, and
 *   `flagshipProducts.test.tsx` in `src/__tests__/`.
 * - Depends on `prerenderRoutes()` in `src/lib/publicRoutes.ts`.
 */
import { prerenderRoutes } from "../publicRoutes";

const STATIC_PATHS = new Set(prerenderRoutes());

/**
 * Detail routes from `src/App.tsx`. These match any slug, including ones with no content record
 * and therefore no prerendered page.
 */
const DYNAMIC_PATTERNS = [
  /^\/work\/[^/]+$/,
  /^\/products\/[^/]+$/,
  /^\/products\/[^/]+\/log$/,
  /^\/research\/[^/]+$/,
  /^\/writing\/[^/]+$/,
  /^\/notes\/[^/]+$/,
];

/** Path part of an href without hash, query, or trailing slash; empty becomes `/`. */
export function pathnameOf(href: string): string {
  const withoutHash = href.split("#")[0] ?? "";
  const path = withoutHash.split("?")[0] ?? "";
  if (path === "") return "/";
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

/** True for absolute `http:` or `https:` URLs. */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** True when the path is a route the React app actually registers. Pass a normalized path from `pathnameOf`. */
export function isKnownRoute(pathname: string): boolean {
  if (STATIC_PATHS.has(pathname)) return true;
  return DYNAMIC_PATTERNS.some((pattern) => pattern.test(pathname));
}
