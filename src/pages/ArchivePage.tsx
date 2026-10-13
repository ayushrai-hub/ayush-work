/**
 * `/archive`: list of earlier sites and superseded work, each with an optional external pointer.
 *
 * Static render of the `archive` records; no state. Items without `pointer` show no link.
 *
 * Connects to:
 * - Routed in src/App.tsx as `archive`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 * - Content from src/content (`archive`); components PageSEO, PageHeader.
 * - Markdown twin `/archive.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { archive } from "../content";

/** Archive page component. Lazy-loaded by the `archive` route in src/App.tsx. */
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
          dek="Not deleted, de-emphasized. Pointers to older homes and retired claims."
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
