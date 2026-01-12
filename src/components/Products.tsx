/**
 * Products.tsx — Products showcase component featuring DPI and commercial products.
 *
 * This component displays Ayush Rai's key products including Digital Public Infrastructure
 * (DPI) projects and commercial applications. Features detailed product descriptions,
 * technology stacks, key highlights, and impact. Includes responsive design with smooth
 * animations and product categorization.
 *
 * The component includes:
 * - Product cards with descriptions and links
 * - Technology stack visualization per product
 * - Key features and highlights
 * - Impact and outcomes
 * - Responsive grid layout
 *
 * Products showcased:
 * - The Open Framework (DPI for India's NGOs/CSOs)
 * - AyushMushrooms (Agrotech Brand Website MVP)
 *
 * @component
 * @example
 * ```tsx
 * import Products from './components/Products';
 *
 * function App() {
 *   return <Products />;
 * }
 * ```
 *
 * @see {@link src/components/Projects.tsx} for project implementations
 * @see {@link src/components/Services.tsx} for service offerings
 */
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ExternalLink,
  Globe,
  Code,
  CheckCircle2,
} from "lucide-react";

/**
 * Products — Products portfolio showcase component.
 *
 * Renders an interactive products portfolio with detailed product cards,
 * technology stacks, live demos, and impact metrics. Provides comprehensive
 * overview of products across DPI and commercial domains.
 *
 * @component
 * @returns {JSX.Element} The rendered Products section
 *
 * @example
 * ```tsx
 * <Products />
 * ```
 */
const Products: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const products = [
    {
      title: "The Open Framework",
      category: "Digital Public Infrastructure (DPI)",
      status: "In Progress",
      description:
        "A national-scale Digital Public Infrastructure (DPI) designed for India's NGOs/CSOs, donors, talent, and policy stakeholders. Built to address fragmentation, compliance challenges, and trust deficits in India's civil society ecosystem.",
      overview: [
        "Federated, consent-driven public utility for civil society",
        "Neutral digital layer connecting NGOs, donors, talent, and policymakers",
        "Long-lived institutional system, designed to survive audits, political shifts, and million-scale usage",
        "Comparable in seriousness (not function) to DigiLocker, GST Portal, and UPI",
      ],
      problem: [
        "NGOs operate in isolation",
        "Donors lack credible discovery and verification",
        "Talent struggles to enter the sector",
        "Government oversight remains indirect",
      ],
      solution: [
        "Enables coordination, consent-based visibility, compliance readiness, and trust",
        "Respects regulatory sensitivity, fear of audits, and low-digital maturity contexts",
        "Does not control civil society—enables it",
      ],
      techStack: {
        frontend: "Next.js, TypeScript (strict), Tailwind + design tokens, Radix UI",
        backend: "NestJS (Node.js) or Spring Boot (Java), REST + OpenAPI",
        auth: "OAuth 2.0, RBAC, progressive verification",
        data: "PostgreSQL, S3-compatible object storage, immutable audit logs",
        infra: "Docker, Kubernetes, cloud-agnostic (AWS/GCP/Azure + on-prem)",
        security: "OWASP Top-10, DPDP-aligned, consent-led analytics",
      },
      demo: "https://the-open-frameworks.vercel.app/",
      type: "DPI",
    },
    {
      title: "AyushMushrooms",
      category: "Agrotech Brand Website (MVP)",
      status: "In Progress",
      description:
        "A modern, multi-page agrotech website for an organic mushroom and spawn cultivation brand. Designed as a content-driven, SEO-first MVP to showcase products, services, expert profile, and training programs—while being future-ready for B2B commerce and e-commerce expansion.",
      overview: [
        "Multi-page responsive marketing site",
        "CMS-managed products, services, blogs & gallery",
        "Contact form → CMS lead + auto-generated PDF datasheet",
        "CRM integration via webhook",
        "Login-ready & shop-ready architecture",
      ],
      highlights: [
        "Fast, scalable brand platform",
        "Acts as both marketing site and lead-generation system",
        "Built to grow into full e-commerce and B2B workflows without architectural rewrites",
      ],
      techStack: {
        frontend: "Next.js (React) · SSR/SSG for performance & SEO",
        styling: "Tailwind CSS · clean, scalable UI",
        cms: "Headless CMS (Sanity / Strapi) · content & lead management",
        backend: "Serverless APIs · form handling, PDF generation, webhooks",
        hosting: "Vercel / Netlify · CDN hosting",
        analytics: "GA4 + SEO schema · analytics & discoverability",
      },
      outcome:
        "A fast, scalable brand platform that acts as both a marketing site and lead-generation system, built to grow into full e-commerce and B2B workflows without architectural rewrites.",
      demo: "https://ayush-mushroom.vercel.app/",
      type: "Commercial",
    },
  ];

  return (
    <section id="products" className="py-8 md:py-10 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            <span className="text-secondary dark:text-secondary-400">Products</span> & Platforms
          </h2>
          <div className="w-20 h-0.5 bg-secondary dark:bg-secondary-400 mx-auto rounded-full mb-4"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Building scalable solutions from DPI to commercial applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="card group hover:scale-[1.01] transition-transform duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                      {product.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold
                      ${
                        product.type === "DPI"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {product.type}
                    </span>
                    {product.status && (
                      <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs font-semibold">
                        {product.status}
                      </span>
                    )}
                  </div>
                  <p className="text-secondary dark:text-secondary-400 font-medium text-xs mb-2">
                    {product.category}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Overview / What It Is */}
              {product.overview && (
                <div className="mb-3">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 size={14} className="mr-1.5 text-accent" />
                    <span className="text-gray-800 dark:text-white font-semibold text-xs">
                      {product.type === "DPI" ? "Overview" : "Features"}
                    </span>
                  </div>
                  <ul className="space-y-1 ml-5">
                    {product.overview.slice(0, product.type === "DPI" ? 3 : 4).map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-gray-600 dark:text-gray-400 text-xs flex items-start"
                      >
                        <span className="text-accent mr-1.5 mt-0.5">•</span>
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Solution (for DPI) - consolidated */}
              {product.solution && (
                <div className="mb-3">
                  <div className="flex items-center mb-1.5">
                    <CheckCircle2 size={14} className="mr-1.5 text-blue-400" />
                    <span className="text-gray-800 dark:text-white font-semibold text-xs">
                      Approach
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs ml-5 leading-tight">
                    {product.solution[0]}
                  </p>
                </div>
              )}

              {/* Tech Stack */}
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <Code size={14} className="mr-1.5 text-secondary dark:text-secondary-400" />
                  <span className="text-gray-800 dark:text-white font-semibold text-xs">
                    Tech Stack
                  </span>
                </div>
                <div className="bg-gray-100 dark:bg-primary/50 rounded-md p-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(product.techStack).slice(0, product.type === "DPI" ? 4 : 4).map(([key, value], techIndex) => (
                      <div key={techIndex} className="text-xs">
                        <span className="text-gray-800 dark:text-white font-medium capitalize text-xs">
                          {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-xs">{value.split('·')[0].trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Demo Link */}
              {product.demo && (
                <a
                  href={product.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-secondary to-accent text-primary rounded-md font-medium hover:shadow-md transition-all text-xs group/link w-full mt-3"
                >
                  <Globe size={14} className="mr-1.5" />
                  View Live
                  <ExternalLink size={14} className="ml-1.5 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
