import { domains } from "../content/domains";
import { notes } from "../content/notes";
import { products } from "../content/products";
import { research } from "../content/research";
import { work } from "../content/work";

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

/** HTML routes that belong in the sitemap. */
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

/** Files to prerender. Includes noindex utilities and empty logs so they do not fall through to the homepage. */
export function prerenderRoutes(): string[] {
  const logs = products.map((item) => `/products/${item.slug}/log`);
  return [...new Set([...sitemapRoutes(), ...logs, "/design-system"])];
}
