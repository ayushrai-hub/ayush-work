import { Helmet } from "react-helmet-async";
import { pageUpdatedAt, person } from "../../content";
import { defaultSEO } from "../../constants/seo";
import { canonicalUrl, personId, websiteId } from "../../lib/canonical";

interface PageSEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  /** Emit Person JSON-LD (home only) */
  personSchema?: boolean;
  /** Extra JSON-LD object for this page. Ratings and offers are not inferred. */
  jsonLd?: Record<string, unknown>;
}

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
  const ogImage = image?.startsWith("http")
    ? image
    : `${person.siteUrl}${image?.startsWith("/") ? image : `/${image}`}`;

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
            jobTitle: person.roleTitle,
            description: person.tagline,
            image: `${person.siteUrl}/IMG_0029.jpeg`,
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
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
      {extraJsonLd && (
        <script type="application/ld+json">{JSON.stringify(extraJsonLd)}</script>
      )}
    </Helmet>
  );
}
