/**
 * `/education`: full education list with dates, grades, coursework, and notes.
 *
 * Static render of `education`; no state. The date/grade line is omitted when a record has none of them.
 *
 * Connects to:
 * - Routed in src/App.tsx as `education`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 *   AboutPage links here ("Full education list") and TimelinePage links education entries here.
 * - Content from src/content (`education`); components PageSEO, PageHeader.
 * - Markdown twin `/education.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { education } from "../content";

/** Education page component. Lazy-loaded by the `education` route in src/App.tsx. */
export default function EducationPage() {
  return (
    <>
      <PageSEO
        title="Education"
        description="Education and learning — factual list."
        path="/education"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Education"
          title="Schooling"
          dek="Formal education and selected learning, with dates and grades where applicable."
        />
        <ul className="max-w-measure space-y-10">
          {education.map((ed) => (
            <li key={ed.slug} className="border-t border-rule pt-6">
              <h2 className="font-display text-xl text-ink">{ed.degree}</h2>
              <p className="mt-1 text-ink-muted">
                {ed.institution}
                {ed.location ? ` · ${ed.location}` : ""}
              </p>
              {(ed.start || ed.end || ed.grade) && <p className="meta-row mt-2">
                {(ed.start || ed.end) && <span>{ed.start} – {ed.end}</span>}
                {ed.grade && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{ed.grade}</span>
                  </>
                )}
              </p>}
              {ed.coursework && ed.coursework.length > 0 && (
                <p className="mt-3 text-sm text-ink-faint">
                  {ed.coursework.join(" · ")}
                </p>
              )}
              {ed.note && (
                <p className="mt-2 text-sm italic text-ink-faint">{ed.note}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
