import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { principles } from "../content";

export default function PrinciplesPage() {
  return (
    <>
      <PageSEO
        title="Principles"
        description="Working principles for how Ayush builds and writes about work."
        path="/principles"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Principles"
          title="How I try to work"
          dek="Statements with practice notes — not posters."
        />
        <ol className="max-w-measure space-y-10">
          {principles.map((p, i) => (
            <li key={p.slug} className="border-t border-rule pt-8">
              <p className="font-mono text-xs text-ink-faint mb-2">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="font-display text-2xl text-ink">{p.title}</h2>
              <blockquote className="mt-3 text-lg text-ink leading-relaxed">
                “{p.statement}”
              </blockquote>
              <p className="mt-3 text-ink-muted leading-relaxed">
                <span className="label mr-2">In practice</span>
                {p.inPractice}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
