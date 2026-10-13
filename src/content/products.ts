/**
 * Products: longer-running things being built, each with a stage, architecture, maturity breakdown and build log.
 *
 * `products` is the catalog; helpers select featured products and group the
 * rest by category. Stage and category labels are defined here so every
 * surface uses the same wording, and each product's `stageExplanation` keeps
 * the stage label from overstating what exists.
 *
 * Connects to:
 * - Pages: ProductsPage (catalog), ProductDetailPage, ProductLogPage,
 *   HomePage (featured products), WorkDetailPage (related product), DomainPage.
 * - Markdown twins /products.md, /products/:slug.md and
 *   /products/:slug/log.md; llms.txt "Flagship products"; search items of type
 *   "product"; sitemap and prerender routes in src/lib/publicRoutes.ts.
 * - Not exposed by the REST API or MCP project tools, which serve `projects`.
 * - Uses `Product`, `ProductCategory` and `ProductStage` from types.ts.
 */
import type { Product, ProductCategory, ProductStage } from "./types";

/** Display label for each product category, on pages and in Markdown. */
export const productCategoryLabels: Record<ProductCategory, string> = {
  dpi: "Digital public infrastructure",
  agrotech: "Agrotech",
  platform: "Platform",
  enterprise: "Enterprise workflow",
  brand: "Brand & commerce",
};

/** Group order for `productsByCategory`. Not re-exported from index.ts. */
export const productCategoryOrder: ProductCategory[] = [
  "dpi",
  "platform",
  "enterprise",
  "agrotech",
  "brand",
];

/** Display label for each product stage, on pages, in Markdown and in the homepage list. */
export const productStageLabels: Record<ProductStage, string> = {
  concept: "Concept",
  building: "Building",
  experimental: "Experimental",
  mvp: "MVP",
  beta: "Beta",
  production: "Production",
  maintained: "Maintained",
};

/**
 * All products, in catalog order. The featured entries separate what exists
 * in the linked repository or site from design goals, which go under
 * `maturity.planned` or are labelled as such in `architecture.other`.
 */
export const products: Product[] = [
  {
    slug: "the-open-framework",
    title: "The Open Framework",
    summary:
      "An early digital public infrastructure concept for civil-society coordination, published as a front-end prototype rather than as live national infrastructure.",
    stage: "building",
    stageExplanation:
      "A public website explains the intended trust and discovery layer. The repository is a Vite and React prototype with mock sign-in. It does not run verification, consent, or a durable institutional backend.",
    featured: true,
    descriptors: ["Civil-society coordination", "Trust and consent"],
    category: "dpi",
    thesis:
      "NGOs, donors, talent, and oversight institutions need a shared way to find one another and to see which claims have been checked, without a vendor owning the sector.",
    why:
      "Discovery, verification, and compliance are fragmented. A coordination layer only helps if consent, governance, and auditability are product requirements, not a later policy memo.",
    audience: [
      "NGO and civil-society operators",
      "Donors looking for credible discovery",
      "People exploring civil-society work",
      "Policy and oversight institutions",
    ],
    workflow: [
      "An organization would submit identity and statutory records once.",
      "A trust layer would check what it can, keep documents consent-scoped, and leave a review trail.",
      "Donors and talent would discover organizations from those verified claims, not from an unscoped directory.",
    ],
    architecture: {
      frontend:
        "Implemented: Vite, React, TypeScript, Tailwind CSS, shadcn/ui, React Router, and TanStack Query.",
      auth:
        "Implemented as a demo: login writes a mock user to localStorage. There is no identity provider.",
      infra: "The public site is deployed on Vercel as a single-page app.",
      other: [
        "Design goals, not present as services in this repository: federated discovery, progressive verification, consent-scoped documents, immutable audit logs, and a cloud-agnostic institutional backend.",
      ],
    },
    maturity: {
      implemented: [
        "Public narrative, role entry points, and screens for NGOs, donors, talent, governance, and a registry search.",
        "Client-side routing and a mock authenticated session.",
      ],
      experimental: [
        "The live site still presents illustrative scale figures, partner names, and an operational-status badge. Those are prototype copy, not measured deployment.",
      ],
      planned: [
        "A real verification workflow, consent records, governance stewardship, and any backend that could support them.",
      ],
    },
    tradeoffs: [
      "A wide prototype makes the product idea visitable, and it also makes unfinished portals look more real than they are.",
      "Institutional backends (and the choice between them) stay out of the architecture claim until a service exists to compare.",
    ],
    openQuestions: [
      "What is the thinnest verification step an organization will actually complete?",
      "How federated can discovery be while remaining auditable?",
      "Who stewards a neutral layer if no single vendor should own it?",
    ],
    problem:
      "Civil-society organizations, donors, talent, and institutions lack a shared, consent-aware way to discover one another and to tell which organizational claims have been checked.",
    approach:
      "Treat verification, consent, governance, and auditability as the product. Publish the concept and a front-end prototype first, and keep backend technology in the design-goal column until it is built.",
    demoUrl: "https://the-open-frameworks.vercel.app/",
    githubUrl: "https://github.com/ayushrai-hub/the-open-framework",
    relatedWorkSlug: "the-open-framework",
    log: [
      {
        date: "2025-12-26",
        title: "Repository created",
        body: "GitHub created the-open-framework. The tree is a Vite and React front end, including dashboard and onboarding screens, with mock authentication.",
      },
      {
        date: "2026-01-10",
        title: "Branding removed, Vercel setup recorded",
        body: "Commits under ayushrai-hub remove Lovable branding and record the Vercel deployment setup. Most earlier commits in the repository are attributed to the Lovable bot.",
      },
    ],
  },
  {
    slug: "agenyra",
    title: "AGENYRA",
    summary:
      "A distribution layer for AI products, starting with structured representation and builder onboarding, with discovery and placement still at earlier stages.",
    stage: "building",
    stageExplanation:
      "The public site and waitlist are up. Inside the product model, the foundation is building, structured search is experimental, distribution is exploring, network capabilities are planned, and contextual intelligence is research. The product is not launched as intent-aware discovery.",
    featured: true,
    descriptors: ["Structured product data", "Discovery separate from distribution"],
    category: "platform",
    thesis:
      "AI products are multiplying faster than the ways people can tell what a product actually does, compare it, and meet it where the need shows up.",
    why:
      "Search, feeds, and lists still do most of the distribution. AGENYRA is an attempt to describe products as structured data first, then place them, rather than treating a directory page as the whole system.",
    audience: [
      "People trying to find an AI product for a task",
      "Builders who need their product represented once and distributed later",
    ],
    workflow: [
      "Discover a product worth representing. Today that means a builder submits it.",
      "Describe it as structured data: task, inputs, outputs, where it runs, cost, and whether each claim is self-reported or verified.",
      "Place it in a shared taxonomy so it can be compared.",
      "Search that structured data. Matching a described problem to products is still an experiment, not a public capability.",
      "Distribution, measurement, network access, and contextual intelligence stay in later stages.",
    ],
    architecture: {
      frontend:
        "Public site: Next.js 16 App Router, React 19, and Tailwind CSS v4.",
      data:
        "The public repository stores waitlist signups in Supabase, with row-level security and server-side access only. It does not contain the product graph.",
      infra: "The public site is deployed on Vercel.",
      other: [
        "Documented as a private build, not in this public repository: taxonomy, structured product profiles, builder onboarding, and search over structured listings.",
        "Discovery and distribution are separate layers. Search over structured fields is not the same thing as placing a product in other tools or agents.",
      ],
    },
    maturity: {
      implemented: [
        "Public marketing site, stage model, and waitlist. The site says nothing in the product graph is publicly available yet.",
        "Stage labels live in one module: building, experimental, exploring, planned, and research.",
      ],
      experimental: [
        "Structured search, including comparison on shared fields, is described as a working internal version. Intent matching is explicitly not built.",
      ],
      planned: [
        "Distribution surfaces beyond a single site, analytics of discovery versus use, personalization, APIs, integrations, and contextual intelligence.",
      ],
    },
    tradeoffs: [
      "Publishing the stage model early keeps the ambition visitable, and it requires every later sentence to say which layer is actually in progress.",
      "Keeping the product graph private means the public repository can prove the website and the waitlist, not the search implementation.",
    ],
    openQuestions: [
      "Can matching improve as more products and uses arrive without turning into a ranking you can buy?",
      "Which distribution surfaces matter before a public catalog exists?",
      "How should a claim be labeled when a builder reports it and nobody has checked it?",
    ],
    problem:
      "In a crowded AI ecosystem, people struggle to discover, understand, evaluate, and actually reach the product that fits a task. A list of websites does not answer that.",
    approach:
      "Separate representation, discovery, and distribution. Build a shared taxonomy and structured profiles first. Treat intent-aware placement as research until an implementation exists.",
    demoUrl: "https://agenyra.space/",
    githubUrl: "https://github.com/ayushrai-hub/AGENYRA_product",
    relatedWorkSlug: "agenyra",
    log: [
      {
        date: "2026-09-29",
        title: "Public site and waitlist",
        body: "The public repository records the Next.js site, the stage model, and the waitlist. Status copy that landed with it keeps foundation, search, distribution, network, and contextual intelligence on different stages.",
      },
    ],
  },
  {
    slug: "medvoice",
    title: "MedVoice",
    summary:
      "A voice-assisted order and billing workflow for pharmaceutical wholesalers, where speech proposes a line and deterministic rules decide identity, tax, and posting.",
    stage: "building",
    stageExplanation:
      "Phase 2 foundations are in the repository, including a mock path from speech to a confirmed draft invoice. Real catalog import, production speech, the Android field app, inventory hardening, and live ERP sync are not complete. There is no public demo URL.",
    featured: true,
    descriptors: ["Wholesale pharma billing", "Constrained matching"],
    category: "enterprise",
    thesis:
      "A warehouse worker should be able to speak an order line and still produce an auditable wholesale invoice, without letting a model guess the medicine, the price, or the tax.",
    why:
      "Today the worker picks, then tells an accountant, who types the bill. That serial handoff creates the wrong medicine, the wrong pack, and a bill that does not match the shelf.",
    audience: [
      "Floor workers at pharmaceutical wholesalers and stockists",
      "Owners, accountants, and managers who have to trust the invoice",
    ],
    workflow: [
      "A worker speaks an order line.",
      "Speech is normalized and matched only against that tenant's medicine catalog.",
      "Ambiguous or risky matches stay unconfirmed until a person accepts them.",
      "The system builds an auditable draft order.",
      "Tax is computed with deterministic GST logic, in integer money, not by a model.",
      "Invoice posting and ERP sync follow explicit confirmation and idempotent rules. An ERP failure is not reported as a successful sale.",
    ],
    architecture: {
      frontend:
        "Next.js admin for owners and accountants. Android worker app in Kotlin and Jetpack Compose, still a scaffold that needs a device toolchain.",
      backend:
        "NestJS modular monolith. Domain rules cover matching, order state, confirmation, and invoice idempotency.",
      data:
        "PostgreSQL is the intended source of truth, with Redis prepared beside it. The API still defaults to an in-memory demo catalog. Money is stored in paise.",
      other: [
        "Speech providers sit behind an adapter. Mock speech is the default. A Deepgram adapter exists and does not run without a key.",
        "ERP adapters implemented: mock and CSV. Marg, Busy, and Tally are specified, not live.",
        "Provisional stack (Set A) until the architecture choice is locked.",
      ],
    },
    maturity: {
      implemented: [
        "Medicine master model, alias-aware matching, and a voice path that creates unconfirmed draft lines.",
        "Order state machine, explicit confirm and reject, deterministic GST on the voice-to-invoice path, and in-memory idempotent invoicing.",
        "Admin shell for catalog search, orders, voice-session debug without raw audio, and audit events.",
        "Mock and CSV ERP adapters.",
      ],
      experimental: [
        "Streaming speech and the Android push-to-talk path. Both exist as code and still depend on credentials or hardware.",
        "Multi-tenant isolation and roles are started, not a finished authorization suite.",
        "Docker Compose prepares Postgres and Redis. Durable database wiring is partial.",
      ],
      planned: [
        "Real warehouse catalog import, stock reservation, invoice PDF, live ERP sync, dealer portal, and a production rollout.",
        "Manual prerequisites still open: a real catalog export, speech credentials, Android devices, a legal stance on audio retention, and an ERP sandbox.",
      ],
    },
    tradeoffs: [
      "Mock speech and a demo catalog make the founding loop runnable locally, and they say nothing about a noisy warehouse.",
      "Refusing silent matches slows the picker down on purpose. A wrong strength or pack is more expensive than an extra confirmation.",
      "Coexisting with Marg, Busy, or Tally is slower than pretending to replace them.",
    ],
    openQuestions: [
      "Which speech provider is accurate enough on a warehouse floor to leave the mock adapter?",
      "When does Postgres replace the in-memory catalog as the system of record?",
      "The stack choice is still provisional. What has to be reworked if it changes?",
    ],
    problem:
      "Pharmaceutical wholesalers bill through a handoff from the person picking stock to the person typing the invoice. Look-alike medicines, pack sizes, and tax make that handoff a high-consequence transaction.",
    approach:
      "Use speech as one input into a constrained workflow. The model must not decide medicine identity, price, quantity, or tax. Ambiguous matches require confirmation. Invoice posting is idempotent, and an ERP failure is not a success.",
    githubUrl: "https://github.com/ayushrai-hub/MedVoiceERP",
    relatedWorkSlug: "medvoice",
    log: [
      {
        date: "2026-08-03",
        title: "Repository created",
        body: "GitHub created MedVoiceERP. No public demo URL is recorded.",
      },
      {
        date: "2026-08-25",
        title: "Product overview dated",
        body: "docs/product/PRODUCT_OVERVIEW.md, last updated this day, describes a local mock path from speech to a confirmed invoice and says a real warehouse deployment is not ready.",
      },
    ],
  },
  {
    slug: "ayushmushrooms",
    title: "AyushMushrooms",
    summary:
      "Agrotech brand MVP for organic mushroom and spawn cultivation, content, services, training, and lead capture with shop readiness later.",
    stage: "mvp",
    stageExplanation:
      "A public marketing and lead-capture site is live. Commerce and full CMS operations are still ahead of what the site should claim.",
    featured: false,
    descriptors: ["Agrotech brand", "Lead capture"],
    category: "agrotech",
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

/** Look up a product by slug. Used by ProductDetailPage and ProductLogPage. */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/**
 * Products with `featured: true`, in catalog order. Shown first on the
 * homepage and the products catalog, and listed in llms.txt.
 */
export function featuredProducts(): Product[] {
  return products.filter((product) => product.featured);
}

/**
 * Products grouped by category in `productCategoryOrder`, skipping empty
 * groups. Only called by `otherProductsByCategory` today.
 */
export function productsByCategory(): Array<{
  category: ProductCategory;
  label: string;
  items: Product[];
}> {
  return productCategoryOrder
    .map((category) => ({
      category,
      label: productCategoryLabels[category],
      items: products.filter((p) => p.category === category),
    }))
    .filter((g) => g.items.length > 0);
}

/**
 * Category groups with featured products removed, so the catalog can lead
 * with them once. Used by ProductsPage.
 */
export function otherProductsByCategory(): Array<{
  category: ProductCategory;
  label: string;
  items: Product[];
}> {
  const featured = new Set(featuredProducts().map((product) => product.slug));
  return productsByCategory()
    .map((group) => ({
      ...group,
      items: group.items.filter((product) => !featured.has(product.slug)),
    }))
    .filter((group) => group.items.length > 0);
}
