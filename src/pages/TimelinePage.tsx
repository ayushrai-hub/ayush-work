/**
 * `/timeline`: reverse-chronological list of education, roles, projects, products,
 * leadership, recognition, and life entries.
 *
 * Sorts a copy of `timeline` by `date` descending (string compare, so dates must be
 * ISO-formatted). Entry titles link to a related page via `relatedHref` when the entry has a
 * `relatedSlug` and its kind maps to a page.
 *
 * Connects to:
 * - Routed in src/App.tsx as `timeline`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 *   AboutPage and HomePage link here.
 * - Content from src/content (`timeline`, plus `work` and `research` slugs for links); components
 *   PageSEO, PageHeader.
 * - Markdown twin `/timeline.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { research, timeline, work } from "../content";

const WORK_SLUGS = new Set(work.map((item) => item.slug));
const RESEARCH_SLUGS = new Set(research.map((item) => item.slug));

/**
 * Page link for a timeline entry, or null when there is no slug or the kind has no page.
 * Project and product kinds use the slug: `/work/<slug>` for a work record, `/research/<slug>`
 * for a research record, otherwise no link. Other kinds link to their list page without an anchor.
 */
function relatedHref(kind: string, slug?: string) {
  if (!slug) return null;
  switch (kind) {
    case "education":
      return "/education";
    case "role":
      return "/about";
    case "project":
    case "product":
      if (WORK_SLUGS.has(slug)) return `/work/${slug}`;
      if (RESEARCH_SLUGS.has(slug)) return `/research/${slug}`;
      return null;
    case "leadership":
      return "/leadership";
    case "recognition":
      return "/recognition";
    default:
      return null;
  }
}

/** Timeline page component. Lazy-loaded by the `timeline` route in src/App.tsx. */
export default function TimelinePage() {
  const sorted = [...timeline].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageSEO
        title="Timeline"
        description="Chronological spine of education, roles, products, and life markers."
        path="/timeline"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Timeline"
          title="The long arc"
          dek="A chronological spine, cautious summaries, not a roadmap chrome."
        />
        <ol className="max-w-measure border-l border-rule pl-6 space-y-8">
          {sorted.map((entry) => {
            const href = relatedHref(entry.kind, entry.relatedSlug);
            return (
              <li key={entry.id} className="relative">
                <span
                  className="absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full bg-rule"
                  aria-hidden
                />
                <p className="meta-row">
                  <span>
                    {entry.date}
                    {entry.endDate ? ` – ${entry.endDate}` : ""}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{entry.kind}</span>
                </p>
                <h2 className="mt-1 font-display text-xl text-ink">
                  {href ? (
                    <Link to={href} className="hover:text-accent">
                      {entry.title}
                    </Link>
                  ) : (
                    entry.title
                  )}
                </h2>
                <p className="mt-1 text-ink-muted">{entry.summary}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
