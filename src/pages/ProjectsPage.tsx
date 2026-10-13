/**
 * `/projects`: bounded projects and experiments, grouped by category, with domain and kind filters.
 *
 * Keeps two filter states (`domain` = project category, `kind` = work type) in component state;
 * they are not reflected in the URL. Non-archived projects (`activeProjects`) are filtered, then
 * grouped with `projectsByCategory`. Archived projects are listed in a collapsed `<details>`
 * block regardless of filters. Each project has an `id` anchor (`#<slug>`), which the
 * Markdown twin links to for projects without a case study.
 *
 * Connects to:
 * - Routed in src/App.tsx as `projects`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 * - Content from src/content (`activeProjects`, `archivedProjects`, `projectsByCategory`,
 *   `projectCategoryLabels`, `projectTypeLabels`, types `ProjectCategory` and `WorkType`);
 *   components PageSEO, PageHeader.
 * - Markdown twin `/projects.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { useMemo, useState } from "react";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import {
  activeProjects,
  archivedProjects,
  projectCategoryLabels,
  projectTypeLabels,
  projectsByCategory,
  type ProjectCategory,
  type WorkType,
} from "../content";

/** Selected project category, or "all". */
type DomainFilter = ProjectCategory | "all";
/** Selected work type, or "all". */
type KindFilter = WorkType | "all";

/** Category filter buttons. Values must match `ProjectCategory`; this list is maintained by hand. */
const DOMAIN_FILTERS: Array<{ label: string; value: DomainFilter }> = [
  { label: "All domains", value: "all" },
  { label: "Tooling", value: "tooling" },
  { label: "Education", value: "education" },
  { label: "Studio", value: "studio" },
  { label: "Client", value: "client" },
  { label: "Web", value: "web" },
  { label: "Personal", value: "personal" },
];

/** Work-type filter buttons. Omits "product", so product-type projects only appear under "All kinds". */
const KIND_FILTERS: Array<{ label: string; value: KindFilter }> = [
  { label: "All kinds", value: "all" },
  { label: "Open source", value: "open-source" },
  { label: "Project", value: "project" },
  { label: "Client", value: "client" },
  { label: "Experiment", value: "experiment" },
];

/** Projects index component. Lazy-loaded by the `projects` route in src/App.tsx. */
export default function ProjectsPage() {
  const [domain, setDomain] = useState<DomainFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");

  const filtered = useMemo(() => {
    return activeProjects.filter((p) => {
      const domainOk = domain === "all" || p.category === domain;
      const kindOk = kind === "all" || p.type === kind;
      return domainOk && kindOk;
    });
  }, [domain, kind]);

  const groups = useMemo(() => projectsByCategory(filtered), [filtered]);

  return (
    <>
      <PageSEO
        title="Projects"
        description="Bounded projects and experiments, categorized by domain and kind."
        path="/projects"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Projects"
          title="Bounded work"
          dek="Grouped by domain. Filter by kind when you want a narrower cut. Deeper case studies live under Work."
        />

        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by domain">
          {DOMAIN_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setDomain(f.value)}
              aria-pressed={domain === f.value}
              className={`rounded-sm px-3 py-1.5 text-sm border transition-colors ${
                domain === f.value
                  ? "border-ink bg-ink text-paper-elevated"
                  : "border-rule text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter by kind">
          {KIND_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setKind(f.value)}
              aria-pressed={kind === f.value}
              className={`rounded-sm px-3 py-1.5 text-sm border transition-colors ${
                kind === f.value
                  ? "border-ink bg-ink text-paper-elevated"
                  : "border-rule text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.category} aria-labelledby={`project-cat-${group.category}`}>
              <h2
                id={`project-cat-${group.category}`}
                className="label mb-3 border-b border-rule pb-2"
              >
                {group.label}
              </h2>
              <ul>
                {group.items.map((p) => (
                  <li id={p.slug} key={p.slug} className="scroll-mt-24 border-b border-rule py-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl text-ink">{p.title}</h3>
                      <p className="meta-row">
                        <span>{projectTypeLabels[p.type] ?? p.type}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{p.status}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {p.yearStart}
                          {p.yearEnd ? `–${p.yearEnd}` : ""}
                        </span>
                      </p>
                    </div>
                    <p className="mt-1 font-mono text-xs text-ink-faint">
                      {projectCategoryLabels[p.category]}
                    </p>
                    <p className="mt-2 max-w-measure text-ink-muted">{p.summary}</p>
                    {p.links && (
                      <p className="mt-2 flex flex-wrap gap-3 text-sm">
                        {p.links.demo && (
                          <a
                            href={p.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-accent"
                          >
                            Demo
                          </a>
                        )}
                        {p.links.github && (
                          <a
                            href={p.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-accent"
                          >
                            GitHub
                          </a>
                        )}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-8 text-ink-faint">No projects in this filter.</p>
        )}

        {archivedProjects.length > 0 && (
          <details className="mt-12">
            <summary className="cursor-pointer label text-ink-muted">
              Archived ({archivedProjects.length})
            </summary>
            <ul className="mt-4 space-y-4">
              {archivedProjects.map((p) => (
                <li id={p.slug} key={p.slug} className="scroll-mt-24">
                  <h3 className="font-medium text-ink">{p.title}</h3>
                  <p className="meta-row mt-0.5">
                    <span>{projectCategoryLabels[p.category]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{projectTypeLabels[p.type] ?? p.type}</span>
                  </p>
                  <p className="text-sm text-ink-muted">{p.summary}</p>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </>
  );
}
