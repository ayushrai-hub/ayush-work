import type { Product } from "./types";

export const products: Product[] = [
  {
    slug: "the-open-framework",
    title: "The Open Framework",
    summary:
      "Early DPI-oriented public utility concept for India's civil society — NGOs/CSOs, donors, talent, and policy stakeholders.",
    stage: "mvp",
    audience: [
      "NGO / CSO operators",
      "Donors seeking credible discovery",
      "Talent exploring civil society careers",
      "Policy and oversight stakeholders",
    ],
    architecture: {
      frontend: "Next.js, TypeScript (strict), Tailwind + design tokens, Radix UI",
      backend: "NestJS (Node.js) or Spring Boot (Java); REST + OpenAPI",
      auth: "OAuth 2.0, RBAC, progressive verification",
      data: "PostgreSQL, S3-compatible object storage, immutable audit logs",
      infra: "Docker, Kubernetes, cloud-agnostic (AWS/GCP/Azure + on-prem path)",
      other: ["OWASP Top-10 awareness", "DPDP-aligned consent-led analytics (design goal)"],
    },
    openQuestions: [
      "What is the thinnest useful verification layer that orgs will actually adopt?",
      "How federated can discovery be while remaining auditable?",
      "Which compliance workflows belong in-product vs. partnered tooling?",
      "Governance: who stewards the neutral layer long-term?",
    ],
    problem:
      "Fragmentation, weak discovery/verification for donors, and low-trust digital maturity across parts of the sector.",
    approach:
      "A consent-driven coordination layer that enables visibility and compliance readiness without owning civil society. Built for audits and longevity, not growth theater.",
    demoUrl: "https://the-open-frameworks.vercel.app/",
    relatedWorkSlug: "the-open-framework",
    log: [
      {
        date: "2024-06-01",
        title: "Problem framing",
        body: "Documented siloed NGO operations, donor discovery gaps, and talent entry friction. Chose 'public utility' framing over SaaS pitch.",
      },
      {
        date: "2024-09-01",
        title: "Architecture sketch",
        body: "Outlined federated identity, RBAC, audit logs, and cloud-agnostic deployment options. Compared NestJS vs Spring Boot for institutional backends.",
      },
      {
        date: "2025-01-15",
        title: "Public MVP site",
        body: "Shipped narrative + architecture site on Vercel. Explicitly positioned as early concept, not a national rollout.",
      },
      {
        date: "2026-08-08",
        title: "Content layer sync",
        body: "Moved product truth into structured content modules; open questions kept visible rather than buried in marketing copy.",
      },
    ],
  },
  {
    slug: "ayushmushrooms",
    title: "AyushMushrooms",
    summary:
      "Agrotech brand MVP for organic mushroom and spawn cultivation — content, services, training, and lead capture with shop readiness later.",
    stage: "mvp",
    audience: [
      "Growers and buyers of spawn / mushrooms",
      "Training program participants",
      "B2B partners (future)",
    ],
    architecture: {
      frontend: "Next.js (React) with SSR/SSG for performance and SEO",
      backend: "Serverless APIs for forms, PDF datasheets, webhooks",
      data: "Headless CMS (Sanity / Strapi) for products, services, blogs, gallery",
      infra: "Vercel / Netlify CDN hosting",
      other: ["GA4 + SEO schema (planned / partial)", "CRM webhook integration"],
    },
    openQuestions: [
      "When does a full shop pay for itself vs. quote-based B2B?",
      "Which content should be CMS-owned on day one vs. hardcoded?",
      "How much expert-profile content is needed for trust in agritech?",
    ],
    problem:
      "Specialty cultivation brands need a credible, findable web presence that turns interest into structured leads without a premature commerce stack.",
    approach:
      "Ship a multi-page marketing + lead system first. Keep architecture login-ready and shop-ready so commerce can land without a rewrite.",
    demoUrl: "https://ayush-mushroom.vercel.app/",
    relatedWorkSlug: "ayushmushrooms",
    log: [
      {
        date: "2024-08-01",
        title: "MVP scope lock",
        body: "Defined pages for brand, products, services, training, and contact. Deferred cart/checkout.",
      },
      {
        date: "2024-11-01",
        title: "Lead path",
        body: "Designed contact → CMS lead + PDF datasheet + CRM webhook as the primary conversion loop.",
      },
      {
        date: "2025-03-01",
        title: "Public MVP",
        body: "Live marketing site on Vercel. Continuing content and CMS wiring.",
      },
      {
        date: "2026-08-08",
        title: "Honest stage label",
        body: "Documented stage as MVP with explicit open questions; no vanity conversion claims.",
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
