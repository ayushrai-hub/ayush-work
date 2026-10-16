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
  title: "Ayush Rai · AI Engineer & AI Product Builder",
  description:
    "Ayush Rai (ayushrai.site): remote AI engineer and AI product builder. LLM evaluation, preference feedback, and shipped software products with limits written down.",
  keywords:
    "Ayush Rai, AI engineer, LLM evaluation, RLHF, preference feedback, AI product builder, remote, Open Framework, MedVoice, AGENYRA",
  image: "/IMG_0029.jpeg",
  url: "https://www.ayushrai.site",
};
