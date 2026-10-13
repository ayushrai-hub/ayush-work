/**
 * `/ideas`: list of ideas with status, theme, summary, rationale, and optional next step.
 *
 * Static render of `ideas`; no state. Each item has an `id` anchor (`#<slug>`).
 *
 * Connects to:
 * - Routed in src/App.tsx as `ideas`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 *   HomePage's research section links its idea titles here (without an anchor).
 * - Content from src/content (`ideas`); components PageSEO, PageHeader.
 * - Markdown twin `/ideas.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { ideas } from "../content";

/** Ideas page component. Lazy-loaded by the `ideas` route in src/App.tsx. */
export default function IdeasPage() {
  return (
    <>
      <PageSEO
        title="Ideas"
        description="Ideas in progress, seeds, explorations, and builds tied to real themes."
        path="/ideas"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Ideas"
          title="In the hopper"
          dek="Derived from real work themes, not startup Mad Libs."
        />
        <ul className="border-b border-rule">
          {ideas.map((idea) => (
            <li id={idea.slug} key={idea.slug} className="scroll-mt-24 border-t border-rule py-6">
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
