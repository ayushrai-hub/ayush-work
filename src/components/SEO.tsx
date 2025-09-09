import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import {
  defaultSEO,
  structuredData,
  organizationStructuredData,
} from "../lib/seo";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

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
