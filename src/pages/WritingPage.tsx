import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import EmptyNote from "../components/editorial/EmptyNote";
import { onSiteWriting, person, writing } from "../content";

export default function WritingPage() {
  const hasOnSite = onSiteWriting.length > 0;

  return (
    <>
      <PageSEO
        title="Writing"
        description="Essays and notes. On-site writing is still thin — Medium remains the hub for now."
        path="/writing"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Writing"
          title="Essays & notes"
          dek="Prefer careful sentences over volume. On-site pieces will grow here."
        />

        {!hasOnSite && (
          <div className="mb-10 max-w-measure">
            <EmptyNote />
            <p className="mt-4 text-ink-muted">
              Until then, writing lives mainly on{" "}
              <a
                href={person.primaryProfiles.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
              >
                Medium
              </a>
              .
            </p>
          </div>
        )}

        <ul className="border-b border-rule">
          {(hasOnSite ? onSiteWriting : writing).map((w) => (
            <li key={w.slug} className="border-t border-rule py-5">
              {w.url ? (
                <a
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-xl text-ink hover:text-accent"
                >
                  {w.title}
                </a>
              ) : (
                <Link
                  to={`/writing/${w.slug}`}
                  className="font-display text-xl text-ink hover:text-accent"
                >
                  {w.title}
                </Link>
              )}
              <p className="meta-row mt-1">
                <span className="capitalize">{w.kind}</span>
                {w.publishedAt && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{w.publishedAt}</span>
                  </>
                )}
              </p>
              <p className="mt-2 max-w-measure text-ink-muted">{w.summary}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
