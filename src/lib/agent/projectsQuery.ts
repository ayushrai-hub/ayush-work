/**
 * Public project records for the REST API and MCP tools: list, page, fetch, and compare.
 *
 * `toPublicProject` copies a stable subset of each `src/content` project and adds its on-site
 * paths and public URL. Archived projects are left out unless the caller asks for them.
 * Validation of raw input happens in `validate.ts`, not here.
 *
 * Connects to:
 * - `http.ts` (`/api/projects`, `/api/v1/projects`, `/api/v1/compare`) and `mcpServer.ts`
 *   (`list_projects`, `get_project`, `compare_projects`).
 * - Tested in `src/__tests__/agentSurfaces.test.ts`.
 * - Depends on `src/content` (`projects`, `getProjectBySlug`, `getWorkBySlug`, `person`) and `pagination.ts`.
 */
import { getProjectBySlug, getWorkBySlug, person, projects } from "../../content";
import type { Project } from "../../content";
import { paginate, type Page } from "./pagination";

/** API shape of a project. Matches the `PublicProject` schema in `openapi.ts`; v1 may add fields but not remove them. */
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

/** List filters. Values are expected to be validated already; unknown values just match nothing. */
export interface ProjectListFilters {
  category?: string;
  type?: string;
  limit?: number;
  includeArchive?: boolean;
}

/** Comparison outcome. Unknown slugs land in `missing`; only a bad slug list is a failure. */
export type CompareResult =
  | { ok: true; projects: PublicProject[]; missing: string[] }
  | { ok: false; code: "invalid_compare"; message: string };

const COMPARE_LIMIT = 4;
const PROJECT_DEFAULT_LIMIT = 50;

/**
 * Converts a content project to its public record. `htmlUrl` points at the case study when the
 * related work item exists, otherwise at the project's anchor on `/projects`.
 */
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

/** Public records in content order, after the archive, category, and type filters. */
function filterPublicProjects(filters: ProjectListFilters): PublicProject[] {
  let list = projects.map(toPublicProject);
  if (!filters.includeArchive) list = list.filter((item) => !item.archive);
  if (filters.category) list = list.filter((item) => item.category === filters.category);
  if (filters.type) list = list.filter((item) => item.type === filters.type);
  return list;
}

/** Page size: `limit` clamped to 1..50, defaulting to 50. The HTTP and MCP layers cap it at 20 first. */
function projectLimit(filters: ProjectListFilters): number {
  return Math.min(PROJECT_DEFAULT_LIMIT, Math.max(1, filters.limit ?? PROJECT_DEFAULT_LIMIT));
}

/** One page of filtered projects starting at `offset`, with a cursor for the next page. */
export function pagePublicProjects(
  filters: ProjectListFilters & { offset?: number } = {},
): Page<PublicProject> {
  return paginate(filterPublicProjects(filters), filters.offset ?? 0, projectLimit(filters));
}

/** One project by slug, or undefined when unknown or archived without `includeArchive`. */
export function getPublicProject(
  slug: string,
  options?: { includeArchive?: boolean },
): PublicProject | undefined {
  const project = getProjectBySlug(slug);
  if (!project) return undefined;
  if (project.archive && !options?.includeArchive) return undefined;
  return toPublicProject(project);
}

/**
 * Looks up two to four distinct slugs (trimmed; empty entries dropped). Too few, too many, or
 * duplicates fail with `invalid_compare`. Slugs are not format-checked here; a malformed slug
 * simply ends up in `missing`.
 */
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