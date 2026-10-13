/**
 * `/writing/:slug`: detail page for one writing entry.
 *
 * Looks up the entry in `writing` by the `slug` route param. An unknown slug renders
 * MissingRecord ("Writing not found", noindex). Entries with `url` render a pointer to the
 * external original (plus EmptyNote when `todo` is set); entries without `url` render only the
 * summary and EmptyNote, since there is no on-site body field.
 *
 * Connects to:
 * - Routed in src/App.tsx as `writing/:slug`. Prerendered by `prerenderRoutes()` in
 *   src/lib/publicRoutes.ts but kept out of the sitemap. WritingPage and HomePage link here
 *   only for entries without `url`.
 * - Content from src/content (`writing`); components PageSEO, PageHeader, Prose, EmptyNote.
 * - Markdown twin `/writing/<slug>.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link, useParams } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import MissingRecord from "../components/site/MissingRecord";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import EmptyNote from "../components/editorial/EmptyNote";
import { writing } from "../content";

/** Writing detail component. Lazy-loaded by the `writing/:slug` route in src/App.tsx. */
export default function WritingDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = writing.find((w) => w.slug === slug);

  if (!item) {
    return <MissingRecord title="Writing not found" backTo="/writing" backLabel="Back to writing →" />;
  }

  if (item.url) {
    return (
      <>
        <PageSEO
          title={item.title}
          description={item.summary}
          path={`/writing/${item.slug}`}
        />
        <article className="site-shell page-section">
          <PageHeader title={item.title} dek={item.summary} />
          <Prose>
            <p>
              This piece lives externally.{" "}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
              >
                Open on the original site →
              </a>
            </p>
          </Prose>
          {item.todo && (
            <div className="mt-8">
              <EmptyNote />
            </div>
          )}
        </article>
      </>
    );
  }

  return (
    <>
      <PageSEO
        title={item.title}
        description={item.summary}
        path={`/writing/${item.slug}`}
      />
      <article className="site-shell page-section">
        <PageHeader title={item.title} dek={item.summary} />
        <EmptyNote />
        <p className="mt-8">
          <Link to="/writing" className="link-accent">
            ← Writing
          </Link>
        </p>
      </article>
    </>
  );
}
