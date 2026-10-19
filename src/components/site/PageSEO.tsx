/**
 * Per-page head tags: title, description, canonical, robots, Open Graph, Twitter card, and JSON-LD.
 *
 * Title is `<title> · Ayush Rai`, or `Ayush Rai · <person.roleTitle>` when no title is passed
 * (the homepage). Description and image fall back to `defaultSEO`; relative images are made
 * absolute against `person.siteUrl`. The canonical comes from `canonicalUrl(path)`, which adds a
 * trailing slash to non-root paths. Indexable pages advertise a Markdown alternate
 * (`rel="alternate" type="text/markdown"`). With `personSchema`, emits one `@graph` holding
 * WebSite, Person, ProfilePage, the selected-work ItemList, and the published software-services
 * Service and FAQPage nodes, linked by `@id`; `jsonLd` adds a second script.
 * Tags are written through react-helmet-async, so the prerender (entry-server) captures them too.
 *
 * Connects to:
 * - Rendered at the top of every page component in src/pages (HomePage passes `personSchema`;
 *   NotFoundPage and DesignSystemPage pass `noIndex`; HomePage sets `noIndex` when `?audience=` is present)
 * - content: person, pageUpdatedAt; constants/seo: defaultSEO; lib/canonical: canonicalUrl, personId, websiteId
 * - lib/structuredData: the Person, WebSite, and selected-work nodes (shared with the Schema Feed)
 */
import { Helmet } from "react-helmet-async";
import { pageUpdatedAt, person } from "../../content";
import { defaultSEO } from "../../constants/seo";
import { canonicalUrl, personId, websiteId } from "../../lib/canonical";
import {
  absoluteUrl,
  personNode,
  selectedWorkListNode,
  softwareServicesFaqNode,
  softwareServicesNode,
  websiteNode,
} from "../../lib/structuredData";

/** Props for PageSEO. `path` is the route path (e.g. `/work`), not an absolute URL. */
interface PageSEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  /** Emit the WebSite, Person, and ProfilePage JSON-LD graph (home only). */
  personSchema?: boolean;
  /** Extra JSON-LD object for this page (ProductDetailPage, DomainPage). Ratings and offers are not inferred. */
  jsonLd?: Record<string, unknown>;
}

/** Writes the head tags for one page; renders nothing in the body. */
export default function PageSEO({
  title,
  description = defaultSEO.description,
  path = "/",
  image = defaultSEO.image,
  noIndex = false,
  personSchema = false,
  jsonLd: extraJsonLd,
}: PageSEOProps) {
  const pageTitle = title
    ? `${title} · ${person.name}`
    : `${person.name} · ${person.roleTitle}`;
  const canonical = canonicalUrl(path);
  const ogImage = absoluteUrl(image);
  /** Twin URL: `/` → `/index.md`, otherwise `<path>.md` (no trailing slash on the twin). */
  const markdownHref =
    path === "/" || path === ""
      ? `${person.siteUrl.replace(/\/$/, "")}/index.md`
      : `${person.siteUrl.replace(/\/$/, "")}${path.endsWith("/") ? path.slice(0, -1) : path}.md`;

  const jsonLd = personSchema
    ? {
        "@context": "https://schema.org",
        "@graph": [
          websiteNode(),
          personNode(),
          {
            "@type": "ProfilePage",
            "@id": `${canonicalUrl("/")}#profile`,
            url: canonicalUrl("/"),
            name: person.name,
            dateModified: pageUpdatedAt("home"),
            mainEntity: { "@id": personId() },
            isPartOf: { "@id": websiteId() },
            hasPart: { "@id": `${canonicalUrl("/")}#selected-work` },
          },
          selectedWorkListNode(),
          softwareServicesNode(),
          softwareServicesFaqNode(),
        ],
      }
    : null;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {!noIndex && (
        <link rel="alternate" type="text/markdown" href={markdownHref} title="Markdown" />
      )}
      {noIndex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
      {extraJsonLd && (
        <script type="application/ld+json">{JSON.stringify(extraJsonLd)}</script>
      )}
    </Helmet>
  );
}
