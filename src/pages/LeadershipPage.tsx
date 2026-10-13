/**
 * `/leadership`: community and extracurricular roles with organization, period, category, and skills.
 *
 * Static render of `leadership`; no state. Each item has an `id` anchor (`#<slug>`). Claims
 * still awaiting confirmation live in `leadershipNeedsConfirmation` and are not rendered here.
 *
 * Connects to:
 * - Routed in src/App.tsx as `leadership` (legacy `/extracurriculars` redirects here); prerendered
 *   via STATIC_PAGES in src/lib/publicRoutes.ts. AboutPage and TimelinePage link here.
 * - Content from src/content (`leadership`); components PageSEO, PageHeader.
 * - Markdown twin `/leadership.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { leadership } from "../content";

/** Leadership page component. Lazy-loaded by the `leadership` route in src/App.tsx. */
export default function LeadershipPage() {
  return (
    <>
      <PageSEO
        title="Leadership"
        description="Grounded community and extracurricular roles, evidence over inflation."
        path="/leadership"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Leadership"
          title="Community & extracurriculars"
          dek="Grounded roles only. Inflated claims stay off this page."
        />
        <ul className="max-w-measure space-y-10">
          {leadership.map((item) => (
            <li id={item.slug} key={item.slug} className="scroll-mt-24 border-t border-rule pt-6">
              <h2 className="font-display text-xl text-ink">{item.title}</h2>
              <p className="meta-row mt-1">
                <span>{item.organization}</span>
                <span aria-hidden="true">·</span>
                <span>{item.period}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{item.category.replace("-", " ")}</span>
              </p>
              <p className="mt-3 text-ink-muted leading-relaxed">
                {item.narrative}
              </p>
              {item.skills && (
                <p className="mt-2 text-sm text-ink-faint">
                  {item.skills.join(" · ")}
                </p>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-accent text-sm mt-2 inline-block"
                >
                  Link
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
