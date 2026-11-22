/**
 * Site-wide default title, description, keywords, share image, and URL for page head tags.
 *
 * Connects to:
 * - Live site: src/components/site/PageSEO.tsx uses `description` and `image` as prop defaults.
 * - Legacy only (not routed): src/components/layout/SEO.tsx.
 */

/** Shape of the defaults; `image` is a site-relative path. */
interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url?: string;
}

/** Default SEO values. The image is public/IMG_0029.jpeg, served from the site root. */
export const defaultSEO: SEOMetadata = {
  title: "Ayush Rai · AI Engineer × Revenue × GTM",
  description:
    "Ayush Rai (ayushrai.site): AI Engineer specializing in revenue systems, GTM engineering, data enrichment and qualification pipelines, LLM evaluation, and human-gated autonomous agents.",
  keywords:
    "Ayush Rai, AI engineer, GTM engineer, revenue systems, RevOps engineering, autonomous agents, LLM evaluation, RLHF, RevenueRoles, GTM-Strato, MedVoice, AGENYRA",
  image: "/IMG_0029.jpeg",
  url: "https://www.ayushrai.site",
};
