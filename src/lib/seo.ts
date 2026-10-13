/**
 * Static schema.org JSON-LD objects (Person and WebSite) built from src/content at import time.
 *
 * Connects to:
 * - Legacy only (not routed): src/components/layout/SEO.tsx, which is excluded from tsconfig.app.json.
 *   The live site builds its JSON-LD in src/components/site/PageSEO.tsx with @ids from src/lib/canonical.ts.
 * - src/content (person).
 */
import { person } from "../content";

/** schema.org Person for Ayush Rai. `knowsAbout` is hard-coded here, not read from content. */
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.roleTitle,
  description: person.tagline,
  url: person.siteUrl,
  image: `${person.siteUrl}/IMG_0029.jpeg`,
  sameAs: person.sameAs,
  knowsAbout: [
    "Artificial Intelligence",
    "Generative AI",
    "RLHF",
    "Software Engineering",
    "Product Development",
    "TypeScript",
    "Python",
    "React",
  ],
  workLocation: {
    "@type": "Place",
    name: person.location,
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: person.email,
    contactType: "Professional",
  },
};

/** schema.org WebSite for the site, despite the "organization" name. */
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ayush Rai",
  url: person.siteUrl,
  description: person.tagline,
  author: {
    "@type": "Person",
    name: person.name,
  },
};
