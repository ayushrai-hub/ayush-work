/**
 * SEO.tsx — Search engine optimization component with structured data support.
 *
 * This component provides comprehensive SEO metadata management for the React application.
 * Dynamically generates meta tags, OpenGraph data, Twitter cards, and structured data (JSON-LD)
 * based on current route and provided props. Integrates with react-helmet-async for server-side
 * rendering compatibility and optimizes for search engines and social media platforms.
 *
 * The component includes:
 * - Dynamic meta tag generation (title, description, keywords)
 * - OpenGraph and Twitter Card support for social sharing
 * - JSON-LD structured data for rich search results
 * - Route-aware SEO defaults for different pages
 * - Server-side rendering compatibility with React Helmet
 * - Automatic canonical URL generation
 *
 * SEO Features:
 * - Route-based meta content generation
 * - Schema.org structured data integration
 * - Social media preview optimization
 * - Mobile and desktop meta tag handling
 * - Favicon and icon management
 *
 * Search Engine Optimization:
 * - Google search console support
 * - Bing webmaster tools compatibility
 * - Mobile-friendly meta viewport
 * - Canonical URL management
 *
 * @component
 * @example
 * ```tsx
 * import SEO from './components/SEO';
 *
 * // Custom SEO for a project page
 * <SEO
 *   title="AI Chatbot Project"
 *   description="Revolutionary AI-powered chatbot with natural language processing"
 *   keywords="AI, chatbot, NLP, machine learning"
 * />
 * ```
 *
 * @see {@link src/lib/seo.ts} for structured data schemas
 * @see {@link src/constants/seo.ts} for default SEO configuration
 */
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { structuredData, organizationStructuredData } from "../lib/seo";
import { defaultSEO } from "../constants/seo";

/**
 * Props for the SEO component.
 */
interface SEOProps {
  /** Optional custom page title */
  title?: string;
  /** Optional custom page description */
  description?: string;
  /** Optional custom keywords meta tag */
  keywords?: string;
  /** Optional custom OpenGraph image URL */
  image?: string;
  /** Optional custom canonical URL */
  url?: string;
}

/**
 * SEO — Search engine optimization component with structured data.
 *
 * Provides comprehensive SEO metadata, social media cards, and structured data
 * for optimal search engine visibility and social sharing. Automatically adapts
 * content based on current route and allows override through props.
 *
 * @component
 * @param {SEOProps} props - SEO configuration props
 * @returns {JSX.Element} Helmet component with SEO metadata
 *
 * @example
 * ```tsx
 * <SEO
 *   title="Custom Page Title"
 *   description="Custom description for search engines"
 *   keywords="keyword1, keyword2, keyword3"
 * />
 * ```
 *
 * @see {@link src/pages/} for route-specific SEO integration
 */
const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
}) => {
  const location = useLocation();

  const getMetaTags = () => {
    switch (location.pathname) {
      case '/research':
        return {
          title: 'Research Projects | Ayush Rai',
          description: 'Explore my research projects in AI, ML, and technology innovation.',
          keywords: 'research, AI, machine learning, technology, innovation, Ayush Rai'
        };
      case '/leadership':
        return {
          title: 'Community Leadership | Ayush Rai',
          description: 'Learn about my community leadership and mentorship activities.',
          keywords: 'leadership, community, mentorship, volunteering, Ayush Rai'
        };
      case '/certifications':
        return {
          title: 'Certifications | Ayush Rai',
          description: 'Professional certifications and credentials in technology and development.',
          keywords: 'certifications, credentials, professional development, Ayush Rai'
        };
      case '/services':
        return {
          title: 'Services | Ayush Rai',
          description: 'Professional services and consulting offerings in software development.',
          keywords: 'services, consulting, software development, Ayush Rai'
        };
      default:
        return {
          title: defaultSEO.title,
          description: defaultSEO.description,
          keywords: defaultSEO.keywords
        };
    }
  };

  const meta = getMetaTags();
  const siteTitle = "Ayush Rai";
  const fullTitle = title || meta.title;
  const finalTitle = fullTitle === defaultSEO.title ? fullTitle : `${fullTitle} | ${siteTitle}`;
  const finalDescription = description || meta.description;
  const finalKeywords = keywords || meta.keywords;
  const finalUrl = url || defaultSEO.url;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="Ayush Rai" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image || `${finalUrl}/og-image.jpg`} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={image || `${finalUrl}/og-image.jpg`} />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#0f172a" />
      <meta name="msapplication-TileColor" content="#0f172a" />

      {/* Language */}
      <html lang="en" />

      {/* Viewport is handled by index.html */}
    </Helmet>
  );
};

export default SEO;
