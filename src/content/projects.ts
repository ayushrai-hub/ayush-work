import type { Project } from "./types";

/**
 * Smaller / bounded work. Case-study depth lives in work.ts for selected items.
 * Early experiments tagged archive.
 */
export const projects: Project[] = [
  {
    slug: "overlay-text-box",
    title: "Overlay Text Box Extension",
    summary:
      "Chrome extension for overlay typing into page fields — testing, demos, and controlled input.",
    type: "open-source",
    status: "active",
    yearStart: 2024,
    yearEnd: "present",
    technologies: ["JavaScript", "HTML", "Chrome Extension API", "Manifest V3"],
    links: {
      github: "https://github.com/ayushrai-hub/overlay-text-box-extension",
    },
    relatedWorkSlug: "overlay-text-box",
  },
  {
    slug: "personal-portfolio",
    title: "Personal portfolio (this site lineage)",
    summary:
      "Vite + React + TypeScript portfolio with Tailwind, Framer Motion, and serverless contact — evolving into a structured content layer.",
    type: "project",
    status: "active",
    yearStart: 2024,
    yearEnd: "present",
    technologies: [
      "Vite",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Netlify",
    ],
    links: {
      github: "https://github.com/ayushrai-hub/ayush-work",
      demo: "https://ayush-me.netlify.app",
    },
  },
  {
    slug: "expert-o",
    title: "Expert-O",
    summary:
      "Studio / collective site for interdisciplinary digital work — services and recruitment narrative.",
    type: "project",
    status: "shipped",
    yearStart: 2024,
    yearEnd: "present",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Vercel",
    ],
    links: {
      demo: "https://expert-o.vercel.app/",
    },
    relatedWorkSlug: "expert-o",
  },
  {
    slug: "shiksha-mitra",
    title: "Shiksha-Mitra",
    summary:
      "Peer learning and acknowledgement platform for career and education journeys.",
    type: "project",
    status: "in-progress",
    yearStart: 2024,
    yearEnd: "present",
    technologies: [
      "Next.js",
      "TypeScript",
      "Firebase",
      "MongoDB",
      "Vercel",
    ],
    links: {
      demo: "https://shiksha-mitra.vercel.app/",
      github: "https://github.com/ayushrai-hub/Shiksha-Mitra",
    },
    relatedWorkSlug: "shiksha-mitra",
  },
  {
    slug: "iha-by-himani",
    title: "Iha by Himani",
    summary: "Art studio marketing site — gallery, services, contact.",
    type: "client",
    status: "shipped",
    yearStart: 2023,
    yearEnd: 2023,
    technologies: ["React", "TypeScript", "CSS Modules", "Framer Motion"],
    links: {
      demo: "https://www.ihabyhimani.com/",
      github: "https://github.com/ayushrai-hub/IHA-art-studio",
    },
    relatedWorkSlug: "iha-by-himani",
  },
  {
    slug: "praful-h",
    title: "Praful H. Professional Site",
    summary: "Credibility-first professional portfolio for a UK-based technology leader.",
    type: "client",
    status: "shipped",
    yearStart: 2024,
    yearEnd: 2024,
    technologies: ["React", "TypeScript", "Next.js", "Netlify"],
    links: {
      demo: "https://praful-h.netlify.app/",
      github: "https://github.com/ayushrai-hub/client-portfolio-praful",
    },
    relatedWorkSlug: "praful-h",
  },
  {
    slug: "mylifeos",
    title: "MyLifeOS",
    summary:
      "Personal life/systems site experiment — separate from the main portfolio.",
    type: "experiment",
    status: "active",
    yearStart: 2025,
    yearEnd: "present",
    technologies: ["Web"],
    links: {
      demo: "https://thelifeofayush.vercel.app/sites/www/",
    },
  },
  {
    slug: "super-site-archive",
    title: "Super.site personal page",
    summary: "Earlier personal site / link home — kept as an archive pointer.",
    type: "experiment",
    status: "archived",
    yearStart: 2022,
    yearEnd: 2023,
    technologies: ["No-code"],
    links: {
      demo: "https://ayush-rai.super.site/",
    },
    archive: true,
  },
  {
    slug: "notion-portfolio-archive",
    title: "Notion portfolio",
    summary: "Earlier Notion-based portfolio — useful as a historical content dump.",
    type: "experiment",
    status: "archived",
    yearStart: 2022,
    yearEnd: 2024,
    technologies: ["Notion"],
    links: {
      demo: "https://www.notion.so/Ayush-s-Portfolio-5d069b2fa8b64d7e8b939a0c9b946e7b",
    },
    archive: true,
  },
];

export const activeProjects = projects.filter((p) => !p.archive);
export const archivedProjects = projects.filter((p) => p.archive);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
