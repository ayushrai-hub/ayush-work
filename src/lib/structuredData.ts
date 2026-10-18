/**
 * schema.org node builders shared by page JSON-LD and the Schema Feed.
 *
 * Person and WebSite nodes carry stable `@id`s from `canonical.ts`; case studies and products are
 * CreativeWork nodes authored by the Person. Values come only from `src/content`, so the feed at
 * `/feeds/portfolio.jsonl` and the JSON-LD in page heads describe the same facts. Ratings, offers,
 * and reviews are never inferred.
 *
 * Connects to:
 * - src/components/site/PageSEO.tsx (home graph), src/pages/ProductDetailPage.tsx (product node).
 * - src/lib/agent/schemaFeed.ts (JSONL feed). Depends on src/content and src/lib/canonical.ts.
 */
import { person, selectedWork } from "../content";
import type { Product, WorkItem } from "../content";
import { canonicalUrl, personId, websiteId } from "./canonical";

/** Makes a site-relative path absolute against `person.siteUrl`; absolute URLs pass through. */
export function absoluteUrl(src?: string): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("http")) return src;
  return `${person.siteUrl}${src.startsWith("/") ? src : `/${src}`}`;
}

/** WebSite node for the canonical origin, published by the Person. */
export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": websiteId(),
    name: person.name,
    url: canonicalUrl("/"),
    description: person.tagline,
    publisher: { "@id": personId() },
  };
}

/** Person node with contact, role, grounded topics, and profile links. */
export function personNode() {
  return {
    "@type": "Person",
    "@id": personId(),
    name: person.name,
    url: canonicalUrl("/"),
    email: person.email,
    telephone: person.phone,
    jobTitle: person.roleTitle,
    description: person.tagline,
    image: absoluteUrl(person.portrait),
    // Topics grounded in published domain dossiers and experience — not aspirational skills.
    knowsAbout: [
      "LLM evaluation",
      "Preference feedback",
      "RLHF-oriented evaluation",
      "AI product development",
      "Software engineering",
    ],
    workLocation: {
      "@type": "Place",
      name: person.location,
    },
    sameAs: person.sameAs,
  };
}

/** CreativeWork node for a case study under /work/:slug. */
export function workNode(item: WorkItem) {
  const url = canonicalUrl(`/work/${item.slug}`);
  return {
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    name: item.title,
    description: item.summary,
    url,
    author: { "@id": personId() },
    ...(item.technologies.length > 0 ? { keywords: item.technologies.join(", ") } : {}),
  };
}

/** CreativeWork node for a product; `sameAs` lists the demo and GitHub URLs when present. */
export function productNode(product: Product) {
  const sameAs = [product.demoUrl, product.githubUrl].filter((url): url is string => Boolean(url));
  return {
    "@type": "CreativeWork",
    name: product.title,
    description: product.summary,
    url: canonicalUrl(`/products/${product.slug}`),
    author: { "@type": "Person", "@id": personId(), name: person.name, url: canonicalUrl("/") },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** ItemList of the homepage's selected case studies, in display order. */
export function selectedWorkListNode() {
  return {
    "@type": "ItemList",
    "@id": `${canonicalUrl("/")}#selected-work`,
    name: "Selected work",
    itemListElement: selectedWork.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: workNode(item),
    })),
  };
}
