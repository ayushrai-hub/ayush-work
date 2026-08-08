import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { timeline } from "../content";

function relatedHref(kind: string, slug?: string) {
  if (!slug) return null;
  switch (kind) {
    case "education":
      return "/education";
    case "role":
      return "/about";
    case "project":
    case "product":
      return `/work/${slug}`;
    case "leadership":
      return "/leadership";
    case "recognition":
      return "/recognition";
    default:
      return null;
  }
}

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
          dek="A chronological spine — cautious summaries, not a roadmap chrome."
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
