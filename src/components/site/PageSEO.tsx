import { Helmet } from "react-helmet-async";
import { person } from "../../content";
import { defaultSEO } from "../../constants/seo";

interface PageSEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  /** Emit Person JSON-LD (home only) */
  personSchema?: boolean;
}

export default function PageSEO({
  title,
  description = defaultSEO.description,
  path = "/",
  image = defaultSEO.image,
  noIndex = false,
  personSchema = false,
}: PageSEOProps) {
  const pageTitle = title ? `${title} · Ayush Rai` : "Ayush Rai";
  const canonical = `${person.siteUrl}${path === "/" ? "/" : path}`;
  const ogImage = image?.startsWith("http")
    ? image
    : `${person.siteUrl}${image?.startsWith("/") ? image : `/${image}`}`;

  const jsonLd = personSchema
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: person.name,
        url: person.siteUrl,
        email: person.email,
        jobTitle: "AI-focused software engineer",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bhopal",
          addressCountry: "IN",
        },
        sameAs: person.sameAs,
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
    </Helmet>
  );
}
