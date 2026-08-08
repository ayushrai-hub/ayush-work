import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { education } from "../content";

export default function EducationPage() {
  return (
    <>
      <PageSEO
        title="Education"
        description="Degrees and coursework — factual list."
        path="/education"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Education"
          title="Schooling"
          dek="Factual record — degrees, periods, grades when verified."
        />
        <ul className="max-w-measure space-y-10">
          {education.map((ed) => (
            <li key={ed.slug} className="border-t border-rule pt-6">
              <h2 className="font-display text-xl text-ink">{ed.degree}</h2>
              <p className="mt-1 text-ink-muted">
                {ed.institution}
                {ed.location ? ` · ${ed.location}` : ""}
              </p>
              <p className="meta-row mt-2">
                <span>
                  {ed.start} – {ed.end}
                </span>
                {ed.grade && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{ed.grade}</span>
                  </>
                )}
              </p>
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
