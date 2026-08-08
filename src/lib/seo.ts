import { person } from "../content";

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: "AI-focused software engineer",
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
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bhopal",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: person.email,
    contactType: "Professional",
  },
};

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
