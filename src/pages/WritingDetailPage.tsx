import { Link, useParams } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import EmptyNote from "../components/editorial/EmptyNote";
import { writing } from "../content";

export default function WritingDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = writing.find((w) => w.slug === slug);

  if (!item) {
    return (
      <div className="site-shell page-section">
        <PageHeader title="Writing not found" />
        <Link to="/writing" className="link-accent">
          Back to writing →
        </Link>
      </div>
    );
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
