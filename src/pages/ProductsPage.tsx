import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { products } from "../content";

export default function ProductsPage() {
  return (
    <>
      <PageSEO
        title="Products"
        description="Products and MVPs — architecture, open questions, and build logs."
        path="/products"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Products"
          title="Things I build"
          dek="Living products with stages, audiences, and unfinished edges kept visible."
        />
        <ul className="border-b border-rule">
          {products.map((p) => (
            <li key={p.slug} className="border-t border-rule py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Link
                  to={`/products/${p.slug}`}
                  className="font-display text-2xl text-ink hover:text-accent"
                >
                  {p.title}
                </Link>
                <span className="font-mono text-xs uppercase tracking-label text-ink-faint">
                  {p.stage}
                </span>
              </div>
              <p className="mt-2 max-w-measure text-ink-muted leading-relaxed">
                {p.summary}
              </p>
              <Link
                to={`/products/${p.slug}/log`}
                className="link-accent text-sm mt-3 inline-block"
              >
                Build log →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
