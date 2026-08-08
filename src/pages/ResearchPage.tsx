import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { research } from "../content";

export default function ResearchPage() {
  return (
    <>
      <PageSEO
        title="Research"
        description="Notes, investigations, and experiments — not peer-reviewed publications."
        path="/research"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Research"
          title="Investigations"
          dek="Status is Note, Investigation, or Experiment. Treat claims cautiously."
        />
        <ul className="border-b border-rule">
          {research.map((r) => (
            <li key={r.slug} className="border-t border-rule py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Link
                  to={`/research/${r.slug}`}
                  className="font-display text-xl text-ink hover:text-accent"
                >
                  {r.title}
                </Link>
                <span className="font-mono text-xs uppercase tracking-label text-ink-faint">
                  {r.status}
                </span>
              </div>
              <p className="mt-2 max-w-measure text-ink-muted">{r.summary}</p>
              <p className="meta-row mt-2">
                <span>{r.period}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
