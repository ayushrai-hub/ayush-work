/**
 * Per-page head tags: title, description, canonical, robots, Open Graph, Twitter card, and JSON-LD.
 *
 * Title is `<title> · Ayush Rai`, or `Ayush Rai · <person.roleTitle>` when no title is passed
 * (the homepage). Description and image fall back to `defaultSEO`; relative images are made
 * absolute against `person.siteUrl`. The Person node's image is `person.portrait` and its telephone is `person.phone`. The canonical comes from `canonicalUrl(path)`, which adds a
 * trailing slash to non-root paths. With `personSchema`, emits one `@graph` holding WebSite,
 * Person, and ProfilePage nodes linked by `@id`; `jsonLd` adds a second, page-specific script.
 * Tags are written through react-helmet-async, so the prerender (entry-server) captures them too.
 *
 * Connects to:
 * - Rendered at the top of every page component in src/pages (HomePage passes `personSchema`;
 *   NotFoundPage and DesignSystemPage pass `noIndex`; HomePage sets `noIndex` when `?audience=` is present)
 * - content: person, pageUpdatedAt; constants/seo: defaultSEO; lib/canonical: canonicalUrl, personId, websiteId
 * - Does not use src/lib/seo.ts
 */
import { Helmet } from "react-helmet-async";
import { pageUpdatedAt, person } from "../../content";
import { defaultSEO } from "../../constants/seo";
import { canonicalUrl, personId, websiteId } from "../../lib/canonical";

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

/** Makes a site-relative path absolute against `person.siteUrl`; absolute URLs pass through, and no path gives undefined. */
function absoluteUrl(src?: string): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("http")) return src;
  return `${person.siteUrl}${src.startsWith("/") ? src : `/${src}`}`;
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

  const jsonLd = personSchema
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": websiteId(),
            name: person.name,
            url: canonicalUrl("/"),
            description: person.tagline,
            publisher: { "@id": personId() },
          },
          {
            "@type": "Person",
            "@id": personId(),
            name: person.name,
            url: canonicalUrl("/"),
            email: person.email,
            telephone: person.phone,
            jobTitle: person.roleTitle,
            description: person.tagline,
            image: absoluteUrl(person.portrait),
            workLocation: {
              "@type": "Place",
              name: person.location,
            },
            sameAs: person.sameAs,
          },
          {
            "@type": "ProfilePage",
            "@id": `${canonicalUrl("/")}#profile`,
            url: canonicalUrl("/"),
            name: person.name,
            dateModified: pageUpdatedAt("home"),
            mainEntity: { "@id": personId() },
            isPartOf: { "@id": websiteId() },
          },
        ],
      }
    : null;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
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
