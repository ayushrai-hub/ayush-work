import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { notes } from "../content";

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
          dek="Learning, observation, process, reflection — grounded in real work."
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
