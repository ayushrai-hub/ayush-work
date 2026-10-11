import { getProjectBySlug, getWorkBySlug, person, projects } from "../../content";
import type { Project } from "../../content";

export interface PublicProject {
  slug: string;
  title: string;
  summary: string;
  type: string;
  category: string;
  status: string;
  yearStart: number;
  yearEnd?: number | "present";
  technologies: string[];
  links?: { demo?: string; github?: string };
  archive: boolean;
  /** On-site case study, when one exists. */
  workPath?: string;
  /** On-site project list anchor. */
  pagePath: string;
  /** Preferred public URL for this record. */
  htmlUrl: string;
}

export interface ProjectListFilters {
  category?: string;
  type?: string;
  limit?: number;
  includeArchive?: boolean;
}

export type CompareResult =
  | { ok: true; projects: PublicProject[]; missing: string[] }
  | { ok: false; code: "invalid_compare"; message: string };

const COMPARE_LIMIT = 4;

export function toPublicProject(project: Project): PublicProject {
  const work =
    project.relatedWorkSlug && getWorkBySlug(project.relatedWorkSlug)
      ? `/work/${project.relatedWorkSlug}`
      : undefined;
  const pagePath = `/projects#${project.slug}`;
  const origin = person.siteUrl.replace(/\/$/, "");
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    type: project.type,
    category: project.category,
    status: project.status,
    yearStart: project.yearStart,
    yearEnd: project.yearEnd,
    technologies: project.technologies,
    links: project.links,
    archive: Boolean(project.archive),
    workPath: work,
    pagePath,
    htmlUrl: `${origin}${work ?? pagePath}`,
  };
}

export function listPublicProjects(filters: ProjectListFilters = {}): PublicProject[] {
  let list = projects.map(toPublicProject);
  if (!filters.includeArchive) list = list.filter((item) => !item.archive);
  if (filters.category) list = list.filter((item) => item.category === filters.category);
  if (filters.type) list = list.filter((item) => item.type === filters.type);
  const limit = filters.limit ?? 50;
  return list.slice(0, Math.min(50, Math.max(1, limit)));
}

export function getPublicProject(
  slug: string,
  options?: { includeArchive?: boolean },
): PublicProject | undefined {
  const project = getProjectBySlug(slug);
  if (!project) return undefined;
  if (project.archive && !options?.includeArchive) return undefined;
  return toPublicProject(project);
}

export function comparePublicProjects(
  slugs: string[],
  options?: { includeArchive?: boolean },
): CompareResult {
  const trimmed = slugs.map((slug) => slug.trim()).filter(Boolean);
  if (trimmed.length < 2) {
    return {
      ok: false,
      code: "invalid_compare",
      message: "Provide at least two project slugs.",
    };
  }
  if (trimmed.length > COMPARE_LIMIT) {
    return {
      ok: false,
      code: "invalid_compare",
      message: `Compare at most ${COMPARE_LIMIT} projects.`,
    };
  }
  if (new Set(trimmed).size !== trimmed.length) {
    return {
      ok: false,
      code: "invalid_compare",
      message: "Duplicate slugs are rejected.",
    };
  }
  const found: PublicProject[] = [];
  const missing: string[] = [];
  for (const slug of trimmed) {
    const project = getPublicProject(slug, options);
    if (project) found.push(project);
    else missing.push(slug);
  }
  return { ok: true, projects: found, missing };
}

export function projectHref(project: Project): string {
  if (project.relatedWorkSlug && getWorkBySlug(project.relatedWorkSlug)) {
    return `/work/${project.relatedWorkSlug}`;
  }
  return `/projects#${project.slug}`;
}
