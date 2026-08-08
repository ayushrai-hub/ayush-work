import type { WorkItem } from "./types";

/**
 * Selected work case studies — rewrite of older generic portfolio copy.
 * Soften or omit unverified impact metrics.
 */
export const work: WorkItem[] = [
  {
    slug: "the-open-framework",
    title: "The Open Framework",
    type: "product",
    summary:
      "An early Digital Public Infrastructure concept for India's NGOs, donors, talent, and policy stakeholders — focused on coordination and trust, not control.",
    problem:
      "Civil society orgs often operate in silos. Donors struggle with credible discovery, talent has a hard time entering the sector, and compliance / verification remain fragmented.",
    context:
      "I started this as a long-horizon product: a federated, consent-driven public utility rather than a typical SaaS landing page. The live site is an MVP narrative and architecture sketch, not a national deployment.",
    role: "Founder / product lead — framing, architecture direction, and front-end MVP.",
    thinking:
      "Treat seriousness like DigiLocker or UPI as a bar for institutional design (longevity, audits, low digital maturity), without claiming functional equivalence. Prefer consent and progressive verification over growth hacks.",
    execution:
      "Shipped a Next.js / TypeScript site that explains the problem, approach, and stack direction (NestJS or Spring Boot, PostgreSQL, OAuth/RBAC, audit logs, cloud-agnostic infra). Kept the tone infrastructural, not startup-pitchy.",
    outcome:
      "Public concept site live; architecture and open questions documented. Adoption and policy outcomes are not claimed — this is still early.",
    lessons: [
      "DPI language invites skepticism; specificity about what is / isn't built matters.",
      "Trust and compliance constraints should shape the architecture from day one.",
    ],
    status: "in-progress",
    selected: true,
    yearStart: 2024,
    yearEnd: "present",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "OAuth 2.0",
      "Docker",
    ],
    links: {
      demo: "https://the-open-frameworks.vercel.app/",
    },
    relatedSlugs: ["the-open-framework"],
  },
  {
    slug: "ayushmushrooms",
    title: "AyushMushrooms",
    type: "product",
    summary:
      "A content-first agrotech brand site for organic mushroom and spawn cultivation — marketing, expert profile, and lead capture, with room to grow into B2B commerce.",
    problem:
      "Specialty agritech brands often need a credible web presence that can collect leads and educate buyers without jumping straight into a heavy e-commerce build.",
    context:
      "Built as an SEO-aware multi-page MVP: products, services, training, and contact flows. Designed so a CMS and shop can land later without a rewrite.",
    role: "Product engineer — structure, implementation, and lead/CRM-oriented architecture.",
    thinking:
      "Separate brand storytelling from commerce. Optimize for clarity and lead quality first; keep login and shop as staged readiness, not fake completeness.",
    execution:
      "Next.js site with Tailwind, headless CMS direction (Sanity/Strapi), serverless form handling, PDF datasheet generation path, and webhook hooks for CRM. Hosted on Vercel.",
    outcome:
      "MVP live as a marketing and lead-generation surface. Commerce and full CMS content ops are still evolving.",
    lessons: [
      "Agrotech buyers care about credibility and specifics more than flashy UI.",
      "Lead → datasheet → CRM is a useful vertical slice before full shop.",
    ],
    status: "in-progress",
    selected: true,
    yearStart: 2024,
    yearEnd: "present",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Serverless APIs",
      "Headless CMS",
    ],
    links: {
      demo: "https://ayush-mushroom.vercel.app/",
    },
  },
  {
    slug: "shiksha-mitra",
    title: "Shiksha-Mitra",
    type: "project",
    summary:
      "A collaborative learning platform where peers share resources, acknowledge progress, and support each other's career and education journeys.",
    problem:
      "Learning is social, but most tools optimize for courses or feeds — not for mutual recognition and resource exchange among peers.",
    context:
      "Built as a community education experiment: mentorship-friendly, progress acknowledgement, and resource sharing without pretending to be a full LMS.",
    role: "Builder — product framing and full-stack implementation.",
    thinking:
      "Start from culture (appreciation, peer support) then add features. Avoid vanity engagement metrics; design for useful exchanges.",
    execution:
      "Next.js / React / TypeScript with Tailwind; Firebase and MongoDB for backend pieces; deployed on Vercel.",
    outcome:
      "Public app live as an early platform. Scale and retention claims are not part of this write-up.",
    lessons: [
      "Community products fail quietly when acknowledgement loops are weak.",
      "Serverless + document stores are fine early; schema discipline still matters.",
    ],
    status: "in-progress",
    selected: true,
    yearStart: 2024,
    yearEnd: "present",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Firebase",
      "MongoDB",
      "Vercel",
    ],
    links: {
      demo: "https://shiksha-mitra.vercel.app/",
      github: "https://github.com/ayushrai-hub/Shiksha-Mitra",
    },
  },
  {
    slug: "expert-o",
    title: "Expert-O",
    type: "project",
    summary:
      "A collective / studio site for multi-disciplinary digital work in India — services, portfolio framing, and recruitment narrative with AI-assisted workflows in mind.",
    problem:
      "Small interdisciplinary teams need a clear public face without overselling speed or 'transformative' jargon.",
    context:
      "I treated Expert-O as a positioning and operating-system site for a polymath-style collective: mission, services, thought leadership, hiring.",
    role: "Designer-developer — narrative, UI, and deployment.",
    thinking:
      "Rewrite away from '5x faster' marketing. Show how AI is used as leverage in workflows, not as decoration. Keep recruitment and services honest about stage.",
    execution:
      "Next.js / React / TypeScript / Tailwind / Framer Motion site, with Three.js accents where they earned their place; hosted on Vercel.",
    outcome:
      "Live site at expert-o.vercel.app. Treat it as a studio presence, not proof of national-scale impact.",
    lessons: [
      "Collective brands collapse if the copy outruns the delivery capacity.",
      "Motion and 3D should support hierarchy, not substitute for clarity.",
    ],
    status: "shipped",
    selected: true,
    yearStart: 2024,
    yearEnd: "present",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Three.js",
      "Vercel",
    ],
    links: {
      demo: "https://expert-o.vercel.app/",
    },
    // Older portfolio copy claimed "5x faster" execution — omit as unverified
    needsConfirmation: [
      "Any quantitative speed or delivery multipliers previously used in marketing copy",
    ],
  },
  {
    slug: "overlay-text-box",
    title: "Overlay Text Box",
    type: "open-source",
    summary:
      "A Chrome extension that overlays a text box and types into page fields character-by-character — useful for testing, demos, and more comfortable input flows.",
    problem:
      "Some workflows need simulated typing into arbitrary fields with control over pace and start/stop — browser defaults don't cover that well.",
    context:
      "Manifest V3 extension with a resizable overlay, trigger near focused fields, and random delays for more human-like typing.",
    role: "Author — design and implementation.",
    thinking:
      "Keep the surface small: one job, clear controls, broad compatibility. Accessibility and testing use-cases beat novelty.",
    execution:
      "Vanilla JS + HTML + Chrome Extension APIs (Manifest V3). Start/stop, visual feedback, and temporary field disable during typing.",
    outcome:
      "Open-sourced on GitHub. Not claiming store download or accessibility certification metrics.",
    lessons: [
      "Small tools teach a lot about permission models and DOM edge cases.",
      "Random delays feel nicer for demos but must stay optional and controllable.",
    ],
    status: "active",
    selected: true,
    yearStart: 2024,
    yearEnd: "present",
    technologies: ["JavaScript", "HTML", "Chrome Extension API", "Manifest V3"],
    links: {
      github: "https://github.com/ayushrai-hub/overlay-text-box-extension",
      demo: "https://github.com/ayushrai-hub/overlay-text-box-extension",
    },
  },
  {
    slug: "iha-by-himani",
    title: "Iha by Himani",
    type: "client",
    summary:
      "A responsive marketing site for an art studio — gallery, services, and contact — built to make the studio easier to find and approach online.",
    problem:
      "The studio needed a modern web presence that showcased work and reduced friction for inquiries.",
    context:
      "Short engagement (Jan–Feb 2023): portfolio gallery, motion, contact form, SEO basics, mobile-first layout.",
    role: "Web developer for the client site.",
    thinking:
      "Art sites should get out of the way of the work. Prioritize images, load behavior, and a clear contact path.",
    execution:
      "React + TypeScript with CSS Modules and Framer Motion; email-integrated contact form.",
    outcome:
      "Site live at ihabyhimani.com. Older '300% inquiry' style metrics are not repeated here — I don't have a verified baseline for that claim.",
    lessons: [
      "Client trust comes from reliable delivery and editable structure, not from inflated ROI numbers.",
      "Motion helps if it respects performance on image-heavy pages.",
    ],
    status: "shipped",
    selected: true,
    yearStart: 2023,
    yearEnd: 2023,
    technologies: [
      "React",
      "TypeScript",
      "CSS Modules",
      "Framer Motion",
    ],
    links: {
      demo: "https://www.ihabyhimani.com/",
      github: "https://github.com/ayushrai-hub/IHA-art-studio",
    },
    needsConfirmation: [
      "Previously stated 'increased client inquiries by 300%' — needs baseline data before reuse",
    ],
  },
  {
    slug: "praful-h",
    title: "Praful H. Professional Site",
    type: "client",
    summary:
      "A professional portfolio for a UK-based technology leader — credibility-first layout for experience, leadership narrative, and contact.",
    problem:
      "Senior operators need a site that communicates depth without looking like a generic template or a startup splash page.",
    context:
      "2024 client engagement focused on performance, SEO, timeline of work, and a restrained visual system.",
    role: "Developer — implementation and structure for the client's narrative.",
    thinking:
      "Enterprise credibility is typography, hierarchy, and evidence — not tech-name soup. Keep stack claims aligned with what the site actually uses.",
    execution:
      "React / TypeScript / Next.js-oriented portfolio with strong content structure, contact flows, and deploy on Netlify.",
    outcome:
      "Live at praful-h.netlify.app. Client outcomes beyond launch are theirs to describe.",
    lessons: [
      "For leadership sites, restraint reads as confidence.",
      "Don't list infrastructure the marketing page doesn't actually run.",
    ],
    status: "shipped",
    selected: false,
    yearStart: 2024,
    yearEnd: 2024,
    technologies: ["React", "TypeScript", "Next.js", "Netlify"],
    links: {
      demo: "https://praful-h.netlify.app/",
      github: "https://github.com/ayushrai-hub/client-portfolio-praful",
    },
    // Older copy listed TensorFlow/K8s/OAuth heavily — verify before emphasizing
    needsConfirmation: [
      "Full production stack previously listed (TensorFlow, Kubernetes, PostgreSQL, OAuth) — confirm what shipped vs aspirational",
    ],
  },
];

export const selectedWork = work.filter((w) => w.selected);

export function getWorkBySlug(slug: string): WorkItem | undefined {
  return work.find((w) => w.slug === slug);
}
