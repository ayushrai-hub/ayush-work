/**
 * Single list of public HTML routes for the prerender step and the sitemap.
 *
 * Static pages are listed by hand; detail pages are generated from src/content (domains, work,
 * products and their logs, research, notes). Writing detail routes (`/writing/:slug`) are routed in
 * src/App.tsx but are not listed here, so they are neither prerendered nor in the sitemap.
 *
 * Connects to:
 * - src/entry-server.tsx (getRoutes, getSitemapRoutes), called by scripts/prerender.mjs.
 * - src/__tests__/domainSurfaces.test.tsx.
 * - src/content/{domains,notes,products,research,work}.ts.
 */
import { domains } from "../content/domains";
import { notes } from "../content/notes";
import { products } from "../content/products";
import { research } from "../content/research";
import { work } from "../content/work";

/** Hand-maintained indexable top-level pages routed in src/App.tsx (`/design-system` is added in prerenderRoutes). */
const STATIC_PAGES = [
  "/",
  "/about",
  "/work",
  "/products",
  "/projects",
  "/research",
  "/writing",
  "/notes",
  "/now",
  "/ideas",
  "/principles",
  "/timeline",
  "/education",
  "/leadership",
  "/recognition",
  "/elsewhere",
  "/contact",
  "/archive",
  "/uses",
  "/resume",
  "/developers",
  "/privacy",
] as const;

/** HTML routes that belong in the sitemap. Product logs are included only when they have entries. */
export function sitemapRoutes(): string[] {
  return [
    ...STATIC_PAGES,
    ...domains.map((page) => page.path),
    ...work.map((item) => `/work/${item.slug}`),
    ...products.map((item) => `/products/${item.slug}`),
    ...products
      .filter((item) => item.log.length > 0)
      .map((item) => `/products/${item.slug}/log`),
    ...research.map((item) => `/research/${item.slug}`),
    ...notes.map((item) => `/notes/${item.slug}`),
  ];
}

/**
 * Routes to prerender: the sitemap routes plus every product log (even empty ones) and the noindex
 * `/design-system` page, deduplicated. A route missing here has no HTML file and gets the host's 404.
 */
export function prerenderRoutes(): string[] {
  const logs = products.map((item) => `/products/${item.slug}/log`);
  return [...new Set([...sitemapRoutes(), ...logs, "/design-system"])];
}
