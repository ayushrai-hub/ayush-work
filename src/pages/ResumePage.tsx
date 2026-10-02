import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import { education, experience, person } from "../content";

export default function ResumePage() {
  return (
    <>
      <PageSEO
        title="Resume"
        description="Brief summary of experience and education, plus resume download."
        path="/resume"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Resume"
          title="Summary export"
          dek="A short on-site digest. A refreshed PDF will be linked here once it is updated."
        />

        <Prose className="mb-10">
          <p>{person.positioning}</p>
        </Prose>

        <section className="mb-12">
          <h2 className="label mb-4">Experience</h2>
          <ul className="max-w-measure space-y-6">
            {experience.map((role) => (
              <li key={role.slug}>
                <h3 className="font-display text-lg text-ink">
                  {role.title} — {role.organization}
                </h3>
                <p className="meta-row mt-1">
                  <span>
                    {role.start} – {role.end}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{role.location}</span>
                </p>
                <ul className="mt-2 list-disc pl-5 text-sm text-ink-muted space-y-1">
                  {role.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="label mb-4">Education</h2>
          <ul className="max-w-measure space-y-4">
            {education.map((ed) => (
              <li key={ed.slug}>
                <h3 className="font-medium text-ink">{ed.degree}</h3>
                <p className="text-sm text-ink-muted">
                  {ed.institution}
                  {ed.start && ed.end ? ` · ${ed.start} – ${ed.end}` : ""}
                  {ed.grade ? ` · ${ed.grade}` : ""}
                </p>
                {ed.note && <p className="text-sm text-ink-muted">{ed.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
