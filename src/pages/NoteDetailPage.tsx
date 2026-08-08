import { Link, useParams } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import { notes } from "../content";

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
