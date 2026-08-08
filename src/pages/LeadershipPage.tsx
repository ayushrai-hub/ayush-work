import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { leadership } from "../content";

export default function LeadershipPage() {
  return (
    <>
      <PageSEO
        title="Leadership"
        description="Grounded community and extracurricular roles — evidence over inflation."
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
            <li key={item.slug} className="border-t border-rule pt-6">
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
