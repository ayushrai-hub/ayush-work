/**
 * NLWeb Schema Feeds (draft 0.1): a Schema Map at `/schemamap.xml` and one JSON Lines feed of
 * schema.org objects at `/feeds/portfolio.jsonl`.
 *
 * The feed holds the same nodes the pages publish as JSON-LD: the WebSite, the Person, every case
 * study, and every product. One object per line, each with `@context` and `@type`. `robots.txt`
 * advertises the map with a `schemamap:` directive.
 *
 * Connects to:
 * - `surfaces.ts` `agentFiles()` emits both files; `public/robots.txt` points at the map.
 * - Node builders in src/lib/structuredData.ts. Tested in `agentReadiness.test.ts`.
 */
import { pageUpdatedAt, person, products, work } from "../../content";
import { personNode, productNode, websiteNode, workNode } from "../structuredData";

export const SCHEMA_MAP_PATH = "/schemamap.xml";
export const SCHEMA_FEED_PATH = "/feeds/portfolio.jsonl";

/** Absolute origin without a trailing slash. */
function origin() {
  return person.siteUrl.replace(/\/$/, "");
}

/** JSON Lines body: one schema.org object per line, trailing newline. */
export function renderSchemaFeed(): string {
  const nodes = [websiteNode(), personNode(), ...work.map(workNode), ...products.map(productNode)];
  return `${nodes.map((node) => JSON.stringify({ "@context": "https://schema.org", ...node })).join("\n")}\n`;
}

/** Sitemap-shaped Schema Map listing the feed with its content type. */
export function renderSchemaMap(): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:sf="http://schema.org/schemas/schemafeed/0.1">',
    "  <url>",
    `    <loc>${origin()}${SCHEMA_FEED_PATH}</loc>`,
    `    <lastmod>${pageUpdatedAt("home")}</lastmod>`,
    "    <sf:contentType>structuredData/schema.org</sf:contentType>",
    "  </url>",
    "</urlset>",
    "",
  ].join("\n");
}
