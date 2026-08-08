import { Link, useParams } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import MetaList from "../components/editorial/MetaList";
import { getWorkBySlug } from "../content";

function yearLabel(start: number, end?: number | "present") {
  if (!end || end === start) return String(start);
  return `${start}–${end === "present" ? "present" : end}`;
}

export default function WorkDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? getWorkBySlug(slug) : undefined;

  if (!item) {
    return (
      <div className="site-shell page-section">
        <PageHeader title="Work not found" dek="That case study isn’t here." />
        <Link to="/work" className="link-accent">
          Back to work →
        </Link>
      </div>
    );
  }

  const sections: Array<{ label: string; body: string }> = [
    { label: "Context", body: item.context },
    { label: "Problem", body: item.problem },
    { label: "Role", body: item.role },
    { label: "Thinking", body: item.thinking },
    { label: "Execution", body: item.execution },
    { label: "Outcome", body: item.outcome },
  ];

  return (
    <>
      <PageSEO
        title={item.title}
        description={item.summary}
        path={`/work/${item.slug}`}
      />
      <article className="site-shell page-section">
        <PageHeader label="Case study" title={item.title} dek={item.summary} />

        <MetaList
          items={[
            { label: "Type", value: item.type.replace("-", " ") },
            { label: "Status", value: item.status },
            {
              label: "Years",
              value: yearLabel(item.yearStart, item.yearEnd),
            },
            { label: "Stack", value: item.technologies.join(", ") },
          ]}
        />

        {item.links && (
          <p className="mb-8 flex flex-wrap gap-4 text-sm">
            {item.links.demo && (
              <a
                href={item.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
              >
                Live / demo
              </a>
            )}
            {item.links.github && (
              <a
                href={item.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
              >
                GitHub
              </a>
            )}
          </p>
        )}

        {sections.map((s) => (
          <section key={s.label} className="mb-10">
            <h2 className="label mb-3">{s.label}</h2>
            <Prose>
              <p>{s.body}</p>
            </Prose>
          </section>
        ))}

        {item.lessons.length > 0 && (
          <section className="mb-10">
            <h2 className="label mb-3">Lessons</h2>
            <ul className="max-w-measure list-disc space-y-2 pl-5 text-ink-muted">
              {item.lessons.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          </section>
        )}

        {item.needsConfirmation && item.needsConfirmation.length > 0 && (
          <aside className="mt-12 max-w-measure rounded-sm border border-rule bg-paper-elevated px-4 py-3 text-sm text-ink-faint italic">
            <p className="not-italic font-mono text-xs uppercase tracking-label mb-2">
              Needs confirmation
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {item.needsConfirmation.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </aside>
        )}

        <p className="mt-12">
          <Link to="/work" className="link-accent">
            ← All work
          </Link>
        </p>
      </article>
    </>
  );
}
