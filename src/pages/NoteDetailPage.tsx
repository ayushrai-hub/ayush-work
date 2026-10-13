/**
 * `/notes/:slug`: a single short note with its kind, publish date, and body.
 *
 * Looks up the note by the `slug` route param. An unknown slug renders an inline "Note not
 * found" message with no PageSEO (so no `noIndex`). The meta description is the first 160
 * characters of the body.
 *
 * Connects to:
 * - Routed in src/App.tsx as `notes/:slug`; every `notes[].slug` is prerendered and in the
 *   sitemap via src/lib/publicRoutes.ts. NotesPage links here.
 * - Content from src/content (`notes`); components PageSEO, PageHeader, Prose.
 * - Markdown twin `/notes/<slug>.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link, useParams } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import { notes } from "../content";

/** Note detail component. Lazy-loaded by the `notes/:slug` route in src/App.tsx. */
export default function NoteDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const note = notes.find((n) => n.slug === slug);

  if (!note) {
    return (
      <div className="site-shell page-section">
        <PageHeader title="Note not found" />
        <Link to="/notes" className="link-accent">
          Back to notes →
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageSEO
        title={note.title}
        description={note.body.slice(0, 160)}
        path={`/notes/${note.slug}`}
      />
      <article className="site-shell page-section">
        <PageHeader
          label={`${note.kind} · ${note.publishedAt}`}
          title={note.title}
        />
        <Prose>
          <p>{note.body}</p>
        </Prose>
        <p className="mt-12">
          <Link to="/notes" className="link-accent">
            ← All notes
          </Link>
        </p>
      </article>
    </>
  );
}
