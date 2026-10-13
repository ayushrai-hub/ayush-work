/**
 * Routes that exist in src/App.tsx. Search and Markdown twins must stay inside this set.
 * Hash targets are anchors on those pages, not extra routers.
 */
import { prerenderRoutes } from "../publicRoutes";

const STATIC_PATHS = new Set(prerenderRoutes());

const DYNAMIC_PATTERNS = [
  /^\/work\/[^/]+$/,
  /^\/products\/[^/]+$/,
  /^\/products\/[^/]+\/log$/,
  /^\/research\/[^/]+$/,
  /^\/writing\/[^/]+$/,
  /^\/notes\/[^/]+$/,
];

export function pathnameOf(href: string): string {
  const withoutHash = href.split("#")[0] ?? "";
  const path = withoutHash.split("?")[0] ?? "";
  if (path === "") return "/";
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** True when the path is a route the React app actually registers. */
export function isKnownRoute(pathname: string): boolean {
  if (STATIC_PATHS.has(pathname)) return true;
  return DYNAMIC_PATTERNS.some((pattern) => pattern.test(pathname));
}
