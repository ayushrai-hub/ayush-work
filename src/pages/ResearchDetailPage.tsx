import { Link, useParams } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import MetaList from "../components/editorial/MetaList";
import { getResearchBySlug } from "../content";

export default function ResearchDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? getResearchBySlug(slug) : undefined;

  if (!item) {
    return (
      <div className="site-shell page-section">
        <PageHeader title="Research not found" />
        <Link to="/research" className="link-accent">
          Back to research →
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageSEO
        title={item.title}
        description={item.summary}
        path={`/research/${item.slug}`}
      />
      <article className="site-shell page-section">
        <PageHeader
          label={item.status}
          title={item.title}
          dek={item.summary}
        />

        <MetaList
          items={[
            { label: "Period", value: item.period },
            { label: "Status", value: item.status },
            { label: "Technologies", value: item.technologies.join(", ") },
          ]}
        />

        <aside className="mb-8 max-w-measure border border-rule px-4 py-3 text-sm text-ink-muted italic">
          {item.disclaimer}
        </aside>

        {item.context && (
          <section className="mb-8">
            <h2 className="label mb-3">Context</h2>
            <Prose>
              <p>{item.context}</p>
            </Prose>
          </section>
        )}

        {item.methods && item.methods.length > 0 && (
          <section className="mb-8">
            <h2 className="label mb-3">Methods</h2>
            <ul className="max-w-measure list-disc pl-5 space-y-1 text-ink-muted">
              {item.methods.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
        )}

        {item.findings && (
          <section className="mb-8">
            <h2 className="label mb-3">Findings</h2>
            <Prose>
              <p>{item.findings}</p>
            </Prose>
          </section>
        )}

        {item.fundingNote && (
          <p className="text-sm text-ink-faint max-w-measure">{item.fundingNote}</p>
        )}

        {item.needsConfirmation && item.needsConfirmation.length > 0 && (
          <aside className="mt-10 max-w-measure text-sm text-ink-faint italic">
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
          <Link to="/research" className="link-accent">
            ← All research
          </Link>
        </p>
      </article>
    </>
  );
}
