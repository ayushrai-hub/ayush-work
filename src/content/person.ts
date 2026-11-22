/**
 * Public identity of Ayush Rai: name, contact email and phone, role lines, canonical URL, resume links and profile URLs.
 *
 * A single `person` object. Other content modules interpolate it (for example
 * policies.ts uses the email and reply time), and `siteUrl` is the canonical
 * origin used to build absolute URLs.
 *
 * Connects to:
 * - Pages: HomePage, AboutPage, ContactPage, ResumePage, WritingPage,
 *   ProductDetailPage, DomainPage; components SiteFooter and PageSEO;
 *   src/lib/seo.ts and src/lib/canonical.ts (JSON-LD, canonical URLs).
 * - Agent surfaces: Markdown twins and llms.txt (src/lib/agent/markdown.ts),
 *   API records' `htmlUrl` (projectsQuery.ts), OpenAPI document, MCP server
 *   card, API catalog, API error bodies and developer docs.
 * - Uses `Person` from types.ts.
 */
import type { Person } from "./types";

/**
 * The site owner's public identity record.
 *
 * `phone`, `phoneDisplay`, and `whatsappUrl` are published on purpose. They are the only
 * phone number allowed in public output; src/__tests__/publicOutput.test.ts fails on any other.
 */
export const person: Person = {
  name: "Ayush Rai",
  shortName: "Ayush",
  location: "Remote",
  email: "ayushrai0211@gmail.com",
  phone: "+917440567944",
  phoneDisplay: "+91 7440567944",
  whatsappUrl: "https://wa.me/917440567944",
  responseTime: "<24 hrs",
  roleTitle: "AI Engineer × Revenue × GTM",
  tagline:
    "AI engineer building revenue systems, GTM data pipelines, deterministic qualification workflows, and bounded autonomous agents — with LLM evaluation discipline and every system's limits written down.",
  positioning:
    "I'm Ayush Rai, an AI engineer working remotely (www.ayushrai.site) at the intersection of AI engineering, technical GTM, revenue operations, and autonomous agents. From April 2024 to August 2025 I worked as an SDE — AI Engineer at FoCDoT Technologies on model evaluation and coding/STEM analysis, and since August 2025 I have done contract LLM evaluation for frontier-lab programs through Outlier. Alongside that evaluation work, I build revenue-data pipelines, explainable ICP and lead-scoring engines, human-gated agent workflows, and product systems (RevenueRoles, GTM-Strato, Revenue Intelligence Engine, Relationship Intelligence Engine, AIworks lead pipeline, MedVoice, AGENYRA, and The Open Framework). I state what is live, what runs locally, and what is synthetic rather than inventing traction.",
  footerLine:
    "AI Engineer × Revenue × GTM — building revenue data systems, deterministic qualification pipelines, and human-gated autonomous agents remotely.",
  siteUrl: "https://www.ayushrai.site",
  resumeUrl:
    "https://drive.google.com/file/d/1JdAckW6i057eYNpdRVLYDMFp2Xo5vyJs/view?usp=sharing",
  resumeDownloadUrl:
    "https://drive.google.com/uc?export=download&id=1JdAckW6i057eYNpdRVLYDMFp2Xo5vyJs",
  portrait: "/IMG_0029.jpeg",
  deepDive: {
    label: "MyLifeOS",
    url: "https://life.ayushrai.site/",
    description:
      "A longer personal archive with more of the life, work, and context behind this site.",
  },
  primaryProfiles: {
    github: "https://github.com/ayushrai-hub",
    linkedin: "https://www.linkedin.com/in/ayushrai02/",
    orcid: "https://orcid.org/0009-0005-7341-7856",
    huggingface: "https://huggingface.co/ayushrai02",
    medium: "https://medium.com/@ayushrai0211",
    cal: "https://calendly.com/ayushrai0211",
  },
  // Authoritative / identity URLs only, not every social profile
  sameAs: [
    "https://github.com/ayushrai-hub",
    "https://www.linkedin.com/in/ayushrai02/",
    "https://orcid.org/0009-0005-7341-7856",
    "https://huggingface.co/ayushrai02",
    "https://medium.com/@ayushrai0211",
    "https://x.com/AyushRai0211",
  ],
};
