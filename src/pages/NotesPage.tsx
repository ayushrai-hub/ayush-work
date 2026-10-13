/**
 * `/notes`: index of short notes, each linking to its detail page with kind and publish date.
 *
 * Static render of `notes` in content order; no state.
 *
 * Connects to:
 * - Routed in src/App.tsx as `notes`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 *   Links to NoteDetailPage at `/notes/:slug`.
 * - Content from src/content (`notes`); components PageSEO, PageHeader.
 * - Markdown twin `/notes.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { notes } from "../content";

/** Notes index component. Lazy-loaded by the `notes` route in src/App.tsx. */
export default function NotesPage() {
  return (
    <>
      <PageSEO
        title="Notes"
        description="Short notes from product and AI work."
        path="/notes"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Notes"
          title="Short form"
          dek="Learning, observation, process, reflection, grounded in real work."
        />
        <ul className="border-b border-rule">
          {notes.map((n) => (
            <li key={n.slug} className="border-t border-rule py-5">
              <Link
                to={`/notes/${n.slug}`}
                className="font-display text-xl text-ink hover:text-accent"
              >
                {n.title}
              </Link>
              <p className="meta-row mt-1">
                <span className="capitalize">{n.kind}</span>
                <span aria-hidden="true">·</span>
                <span>{n.publishedAt}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
