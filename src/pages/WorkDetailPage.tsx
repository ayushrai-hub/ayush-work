/**
 * `/work/:slug`: case study with type, status, years, stack, links, the narrative sections
 * (context, problem, role, thinking, execution, outcome), lessons, and a confirmation list.
 *
 * Looks up the item with `getWorkBySlug`. An unknown slug renders MissingRecord ("Work not
 * found", noindex). Products whose `relatedWorkSlug` matches this item get a
 * "Product page" link, rendered inside the `item.links` block, so it only appears when the
 * work item has a `links` object. The per-item `needsConfirmation` caveats are shown here and in
 * the Markdown twin under "Needs confirmation".
 *
 * Connects to:
 * - Routed in src/App.tsx as `work/:slug`; every `work[].slug` is prerendered and in the sitemap
 *   via src/lib/publicRoutes.ts. WorkPage, HomePage (via WorkRow), ProductDetailPage, and
 *   TimelinePage link here.
 * - Content from src/content (`getWorkBySlug`, `products`); components PageSEO, PageHeader, Prose, MetaList.
 * - Markdown twin `/work/<slug>.md` built by `workPage()` in src/lib/agent/markdown.ts.
 */
import { Link, useParams } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import MissingRecord from "../components/site/MissingRecord";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import MetaList from "../components/editorial/MetaList";
import { getWorkBySlug, products } from "../content";
import { yearLabel } from "../lib/format";

/** Work case study component. Lazy-loaded by the `work/:slug` route in src/App.tsx. */
export default function WorkDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? getWorkBySlug(slug) : undefined;

  if (!item) {
    return (
      <MissingRecord
        title="Work not found"
        dek="That case study isn’t here."
        backTo="/work"
        backLabel="Back to work →"
      />
    );
  }

  const sections: Array<{ label: string; body: string }> = [
    { label: "Context", body: item.context },
    { label: "Problem", body: item.problem },
    { label: "Role", body: item.role },
    { label: "Thinking", body: item.thinking },
    { label: "Execution", body: item.execution },
    { label: "Outcome", body: item.outcome },
  ];

  return (
    <>
      <PageSEO
        title={item.title}
        description={item.summary}
        path={`/work/${item.slug}`}
      />
      <article className="site-shell page-section">
        <PageHeader label="Case study" title={item.title} dek={item.summary} />

        <MetaList
          items={[
            { label: "Type", value: item.type.replace("-", " ") },
            { label: "Status", value: item.status },
            {
              label: "Years",
              value: yearLabel(item.yearStart, item.yearEnd),
            },
            { label: "Stack", value: item.technologies.join(", ") },
          ]}
        />

        {item.links && (
          <p className="mb-8 flex flex-wrap gap-4 text-sm">
            {item.links.demo && (
              <a
                href={item.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
              >
                Live / demo
              </a>
            )}
            {item.links.github && (
              <a
                href={item.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
              >
                Source repository
              </a>
            )}
            {products
              .filter((product) => product.relatedWorkSlug === item.slug)
              .map((product) => (
                <Link
                  key={product.slug}
                  to={`/products/${product.slug}`}
                  className="link-accent"
                >
                  Product page
                </Link>
              ))}
          </p>
        )}

        {sections.map((s) => (
          <section key={s.label} className="mb-10">
            <h2 className="label mb-3">{s.label}</h2>
            <Prose>
              <p>{s.body}</p>
            </Prose>
          </section>
        ))}

        {item.lessons.length > 0 && (
          <section className="mb-10">
            <h2 className="label mb-3">Lessons</h2>
            <ul className="max-w-measure list-disc space-y-2 pl-5 text-ink-muted">
              {item.lessons.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          </section>
        )}

        {item.needsConfirmation && item.needsConfirmation.length > 0 && (
          <aside className="mt-12 max-w-measure rounded-sm border border-rule bg-paper-elevated px-4 py-3 text-sm text-ink-faint italic">
            <p className="not-italic font-mono text-xs uppercase tracking-label mb-2">
              Needs confirmation
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {item.needsConfirmation.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </aside>
        )}

        <p className="mt-12">
          <Link to="/work" className="link-accent">
            ← All work
          </Link>
        </p>
      </article>
    </>
  );
}
