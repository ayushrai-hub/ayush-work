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
 * - Content from src/content (`timeline`, plus work, research, education, experience, leadership,
 *   and recognition slugs for links and anchors); components PageSEO, PageHeader.
 * - Markdown twin `/timeline.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import {
  archivedRecognition,
  education,
  experience,
  featuredRecognition,
  leadership,
  research,
  timeline,
  work,
} from "../content";

/** Slug sets of the records each page renders, used to decide whether an entry can link to it. */
const SLUGS = {
  work: new Set(work.map((item) => item.slug)),
  research: new Set(research.map((item) => item.slug)),
  education: new Set(education.map((item) => item.slug)),
  role: new Set(experience.map((item) => item.slug)),
  leadership: new Set(leadership.map((item) => item.slug)),
  recognition: new Set([...featuredRecognition, ...archivedRecognition].map((item) => item.slug)),
};

/** List page for each timeline kind whose records render with `id={slug}` anchors. */
const LIST_PAGES: Record<string, { path: string; slugs: Set<string> }> = {
  education: { path: "/education", slugs: SLUGS.education },
  role: { path: "/about", slugs: SLUGS.role },
  leadership: { path: "/leadership", slugs: SLUGS.leadership },
  recognition: { path: "/recognition", slugs: SLUGS.recognition },
};

/**
 * Page link for a timeline entry, or null when there is no slug or the kind has no page.
 * Project and product kinds link to `/work/<slug>` or `/research/<slug>`. Education, role,
 * leadership, and recognition link to their list page with a `#slug` anchor when that record is
 * rendered there, and to the list page alone otherwise.
 */
function relatedHref(kind: string, slug?: string) {
  if (!slug) return null;
  if (kind === "project" || kind === "product") {
    if (SLUGS.work.has(slug)) return `/work/${slug}`;
    if (SLUGS.research.has(slug)) return `/research/${slug}`;
    return null;
  }
  const list = LIST_PAGES[kind];
  if (!list) return null;
  return list.slugs.has(slug) ? `${list.path}#${slug}` : list.path;
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
