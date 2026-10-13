/**
 * Projects: smaller, bounded pieces of work and experiments, including early work flagged as archive.
 *
 * `projects` is the list behind /projects and the public project API. Projects
 * that have a case study point at it with `relatedWorkSlug`; deeper narrative
 * lives in work.ts. Category and type labels defined here double as the
 * allowed values for API filters.
 *
 * Connects to:
 * - ProjectsPage (`activeProjects`, `archivedProjects`, `projectsByCategory`,
 *   labels) and DomainPage (`projects`).
 * - REST API /api/v1/projects, /api/v1/projects/{slug}, /api/v1/compare and
 *   the MCP tools `list_projects`, `get_project`, `compare_projects`, via
 *   src/lib/agent/projectsQuery.ts; filter validation in validate.ts and enum
 *   values in openapi.ts come from the label maps.
 * - Markdown twin /projects.md; search items of type "project".
 * - Uses `Project`, `ProjectCategory` and `WorkType` from types.ts.
 */
import type { Project, ProjectCategory, WorkType } from "./types";

/**
 * Display label for each project category. Its keys are also the accepted
 * `category` filter values for the REST API and MCP, and the OpenAPI enum.
 */
export const projectCategoryLabels: Record<ProjectCategory, string> = {
  tooling: "Tooling",
  education: "Education",
  client: "Client work",
  studio: "Studio / collective",
  web: "Web & portfolio",
  personal: "Personal systems",
};

/** Group order for `projectsByCategory`. Not re-exported from index.ts. */
export const projectCategoryOrder: ProjectCategory[] = [
  "tooling",
  "education",
  "studio",
  "client",
  "web",
  "personal",
];

/**
 * Display label for each `WorkType`. Its keys are also the accepted `type`
 * filter values for the REST API and MCP, and the OpenAPI enum.
 */
export const projectTypeLabels: Record<string, string> = {
  product: "Product",
  project: "Project",
  client: "Client",
  experiment: "Experiment",
  "open-source": "Open source",
};

/**
 * Smaller / bounded work. Case-study depth lives in work.ts, linked through
 * `relatedWorkSlug`. Early experiments are flagged `archive: true`, which hides
 * them from API and MCP results unless the caller requests archived records.
 * Slugs are public API identifiers; renaming one breaks /api/v1/projects/{slug}.
 */
export const projects: Project[] = [
  {
    slug: "overlay-text-box",
    title: "Overlay Text Box Extension",
    summary:
      "Chrome extension for overlay typing into page fields, testing, demos, and controlled input.",
    type: "open-source",
    category: "tooling",
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
      "Vite + React + TypeScript portfolio with Tailwind, Framer Motion, and serverless contact, evolving into a structured content layer.",
    type: "project",
    category: "web",
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
      demo: "https://www.ayushrai.site",
    },
  },
  {
    slug: "expert-o",
    title: "Expert-O",
    summary:
      "Studio / collective site for interdisciplinary digital work, services and recruitment narrative.",
    type: "project",
    category: "studio",
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
    category: "education",
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
    summary: "Art studio marketing site, gallery, services, contact.",
    type: "client",
    category: "client",
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
    category: "client",
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
      "Personal life/systems site experiment, separate from the main portfolio.",
    type: "experiment",
    category: "personal",
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
    summary: "Earlier personal site / link home, kept as an archive pointer.",
    type: "experiment",
    category: "personal",
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
    summary: "Earlier Notion-based portfolio, useful as a historical content dump.",
    type: "experiment",
    category: "web",
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

/** Projects not flagged archive. Main list on ProjectsPage. */
export const activeProjects = projects.filter((p) => !p.archive);
/** Projects flagged archive. Archive section on ProjectsPage. */
export const archivedProjects = projects.filter((p) => p.archive);

/**
 * Look up a project by slug, including archived ones. projectsQuery.ts applies
 * the archive filter for API and MCP callers.
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * Group projects (default: `activeProjects`) by category in
 * `projectCategoryOrder`, skipping empty groups. Used by ProjectsPage.
 */
export function projectsByCategory(
  list: Project[] = activeProjects,
): Array<{ category: ProjectCategory; label: string; items: Project[] }> {
  return projectCategoryOrder
    .map((category) => ({
      category,
      label: projectCategoryLabels[category],
      items: list.filter((p) => p.category === category),
    }))
    .filter((g) => g.items.length > 0);
}

/**
 * Group projects (default: `activeProjects`) by `WorkType` in a fixed order,
 * skipping empty groups. Exported but not called anywhere today.
 */
export function projectsByType(
  list: Project[] = activeProjects,
): Array<{ type: WorkType; label: string; items: Project[] }> {
  const order: WorkType[] = [
    "open-source",
    "project",
    "client",
    "experiment",
    "product",
  ];
  return order
    .map((type) => ({
      type,
      label: projectTypeLabels[type] ?? type,
      items: list.filter((p) => p.type === type),
    }))
    .filter((g) => g.items.length > 0);
}
