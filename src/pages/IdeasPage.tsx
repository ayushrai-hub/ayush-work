import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { ideas } from "../content";

export default function IdeasPage() {
  return (
    <>
      <PageSEO
        title="Ideas"
        description="Ideas in progress — seeds, explorations, and builds tied to real themes."
        path="/ideas"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Ideas"
          title="In the hopper"
          dek="Derived from real work themes — not startup Mad Libs."
        />
        <ul className="border-b border-rule">
          {ideas.map((idea) => (
            <li key={idea.slug} className="border-t border-rule py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl text-ink">{idea.title}</h2>
                <span className="font-mono text-xs uppercase tracking-label text-ink-faint">
                  {idea.status}
                </span>
              </div>
              <p className="meta-row mt-1">
                <span>{idea.theme}</span>
              </p>
              <p className="mt-2 max-w-measure text-ink-muted">{idea.summary}</p>
              <p className="mt-2 max-w-measure text-sm text-ink-faint">
                Why: {idea.why}
              </p>
              {idea.nextStep && (
                <p className="mt-1 max-w-measure text-sm text-ink-muted">
                  Next: {idea.nextStep}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
