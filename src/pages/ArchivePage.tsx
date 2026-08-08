import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { archive } from "../content";

export default function ArchivePage() {
  return (
    <>
      <PageSEO
        title="Archive"
        description="Pointers to earlier sites and superseded work."
        path="/archive"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Archive"
          title="Earlier selves"
          dek="Not deleted — de-emphasized. Pointers to older homes and retired claims."
        />
        <ul className="max-w-measure space-y-6 border-b border-rule">
          {archive.map((item) => (
            <li key={item.slug} className="border-t border-rule py-5">
              <h2 className="font-display text-lg text-ink">{item.title}</h2>
              <p className="meta-row mt-1">
                {item.year && <span>{item.year}</span>}
              </p>
              <p className="mt-2 text-ink-muted">{item.summary}</p>
              {item.pointer && (
                <a
                  href={item.pointer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-accent text-sm mt-2 inline-block"
                >
                  Open
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
