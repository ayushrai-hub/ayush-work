/**
 * Public identity of Ayush Rai: name, contact email, role lines, canonical URL, resume links and profile URLs.
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
 * Phone numbers must never appear on public pages or in machine-readable
 * output: `phone` and `phoneDisplay` stay empty, and
 * src/__tests__/agentSurfaces.test.ts fails if they are filled.
 */
export const person: Person = {
  name: "Ayush Rai",
  shortName: "Ayush",
  location: "Remote",
  email: "ayushrai0211@gmail.com",
  phone: "",
  phoneDisplay: "",
  responseTime: "<24 hrs",
  roleTitle: "AI Engineer & AI Product Builder",
  tagline:
    "AI engineer and AI product builder. I work on LLM evaluation, preference feedback, and software products that have to survive a real workflow.",
  positioning:
    "I'm an AI engineer and AI product builder working remotely. My paid work includes contract evaluation for frontier-lab programs. Alongside that I build AI products and client software, from an early civil-society coordination prototype to education and agrotech MVPs. I would rather describe what shipped, and what did not, than sound futuristic.",
  siteUrl: "https://www.ayushrai.site",
  resumeUrl:
    "https://drive.google.com/file/d/1JdAckW6i057eYNpdRVLYDMFp2Xo5vyJs/view?usp=sharing",
  resumeDownloadUrl:
    "https://drive.google.com/uc?export=download&id=1JdAckW6i057eYNpdRVLYDMFp2Xo5vyJs",
  portrait: "/IMG_0029.jpeg",
  deepDive: {
    label: "MyLifeOS",
    url: "https://thelifeofayush.vercel.app/sites/www/",
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
