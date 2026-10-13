/**
 * `/products/:slug/log`: dated build log for one product, newest entry first.
 *
 * Looks up the product with `getProductBySlug`. An unknown slug renders an inline "Log not
 * found" message with no PageSEO. Entries are copied and sorted by `date` descending (string
 * compare, so dates must be ISO-formatted). An empty log shows a note explaining that entries
 * need a dated record; the page is still indexable in that case.
 *
 * Connects to:
 * - Routed in src/App.tsx as `products/:slug/log`. src/lib/publicRoutes.ts prerenders the log
 *   for every product but lists only non-empty logs in the sitemap. ProductDetailPage and
 *   ProductsPage link here.
 * - Content from src/content (`getProductBySlug`); components PageSEO, PageHeader, Prose.
 * - Markdown twin `/products/<slug>/log.md` built by `productLogPage()` in src/lib/agent/markdown.ts
 *   (generated for every product, including empty logs).
 */
import { Link, useParams } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import { getProductBySlug } from "../content";

/** Product build log component. Lazy-loaded by the `products/:slug/log` route in src/App.tsx. */
export default function ProductLogPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <div className="site-shell page-section">
        <PageHeader title="Log not found" />
        <Link to="/products" className="link-accent">
          Back to products →
        </Link>
      </div>
    );
  }

  const entries = [...product.log].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <>
      <PageSEO
        title={`${product.title} log`}
        description={`Build log for ${product.title}.`}
        path={`/products/${product.slug}/log`}
      />
      <article className="site-shell page-section">
        <PageHeader
          label="Build log"
          title={product.title}
          dek="Dated notes, what changed and why, not a changelog dump."
        />

        {entries.length === 0 ? (
          <p className="max-w-measure text-ink-muted leading-relaxed">
            No verified build-log entries yet. A date is added only when a
            repository commit, a dated document, or another record supports it.
          </p>
        ) : (
        <ol className="max-w-measure space-y-8 border-l border-rule pl-6">
          {entries.map((entry) => (
            <li key={`${entry.date}-${entry.title}`} className="relative">
              <span
                className="absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent"
                aria-hidden
              />
              <p className="font-mono text-xs text-ink-faint">
                <time dateTime={entry.date}>{entry.date}</time>
              </p>
              <h2 className="mt-1 font-display text-xl text-ink">
                {entry.title}
              </h2>
              <Prose className="mt-2">
                <p>{entry.body}</p>
              </Prose>
            </li>
          ))}
        </ol>
        )}

        <p className="mt-12 flex flex-wrap gap-4">
          <Link to={`/products/${product.slug}`} className="link-accent">
            ← Product overview
          </Link>
          <Link to="/products" className="link-accent">
            All products
          </Link>
        </p>
      </article>
    </>
  );
}
