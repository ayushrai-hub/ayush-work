import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { activeProjects, archivedProjects } from "../content";

export default function ProjectsPage() {
  return (
    <>
      <PageSEO
        title="Projects"
        description="Bounded projects and experiments — active and archived."
        path="/projects"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Projects"
          title="Bounded work"
          dek="Smaller builds and experiments. Deeper case studies live under Work."
        />

        <ul className="border-b border-rule">
          {activeProjects.map((p) => (
            <li key={p.slug} className="border-t border-rule py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl text-ink">{p.title}</h2>
                <p className="meta-row">
                  <span className="capitalize">{p.status}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {p.yearStart}
                    {p.yearEnd ? `–${p.yearEnd}` : ""}
                  </span>
                </p>
              </div>
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

        {archivedProjects.length > 0 && (
          <details className="mt-12">
            <summary className="cursor-pointer label text-ink-muted">
              Archived ({archivedProjects.length})
            </summary>
            <ul className="mt-4 space-y-4">
              {archivedProjects.map((p) => (
                <li key={p.slug}>
                  <h3 className="font-medium text-ink">{p.title}</h3>
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
