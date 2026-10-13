/**
 * `/products`: product catalog with flagship products first, then the rest grouped by category.
 *
 * Static render; no state. `featuredProducts()` returns products with `featured: true`
 * (currently three, which the dek text assumes); `otherProductsByCategory()` returns the
 * remaining products grouped by category, and that block is hidden when it is empty.
 *
 * Connects to:
 * - Routed in src/App.tsx as `products`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 *   Links to ProductDetailPage and ProductLogPage.
 * - Content from src/content (`featuredProducts`, `otherProductsByCategory`, `productStageLabels`,
 *   `productCategoryLabels`, `pageUpdatedAt("products")`, type `Product`); components PageSEO, PageHeader.
 * - Markdown twin `/products.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import {
  featuredProducts,
  otherProductsByCategory,
  pageUpdatedAt,
  productCategoryLabels,
  productStageLabels,
  type Product,
} from "../content";

/** One catalog row: title, stage and category, summary, stage explanation, and detail/live/source/log links. */
function ProductRow({ product }: { product: Product }) {
  return (
    <li className="border-b border-rule py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h3 className="font-display text-2xl text-ink">
          <Link
            to={`/products/${product.slug}`}
            className="hover:text-accent"
          >
            {product.title}
          </Link>
        </h3>
        <p className="meta-row">
          <span>{productStageLabels[product.stage]}</span>
          <span aria-hidden="true">·</span>
          <span>{productCategoryLabels[product.category]}</span>
        </p>
      </div>
      <p className="mt-2 max-w-measure text-ink-muted leading-relaxed">
        {product.summary}
      </p>
      {product.stageExplanation && (
        <p className="mt-2 max-w-measure text-sm text-ink-faint leading-relaxed">
          {product.stageExplanation}
        </p>
      )}
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link
          to={`/products/${product.slug}`}
          className="link-accent"
          aria-label={`${product.title} product detail`}
        >
          Product detail
        </Link>
        {product.demoUrl && (
          <a
            href={product.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-accent"
            aria-label={`${product.title} live site`}
          >
            Live site
          </a>
        )}
        {product.githubUrl && (
          <a
            href={product.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-accent"
            aria-label={`${product.title} source repository`}
          >
            Source repository
          </a>
        )}
        {product.log.length > 0 && (
          <Link
            to={`/products/${product.slug}/log`}
            className="link-accent"
            aria-label={`${product.title} build log`}
          >
            Build log
          </Link>
        )}
      </p>
    </li>
  );
}

/** Products index component. Lazy-loaded by the `products` route in src/App.tsx. */
export default function ProductsPage() {
  const featured = featuredProducts();
  const groups = otherProductsByCategory();

  return (
    <>
      <PageSEO
        title="Products"
        description="Flagship products in progress, plus earlier MVPs. Stages stay specific: building, experimental, and MVP are not the same claim."
        path="/products"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Products"
          title="Things I build"
          dek="Three flagship products first. Earlier work stays in the catalog. Stages describe what exists, not a percent complete."
          updated={pageUpdatedAt("products")}
        />

        <section aria-labelledby="featured-products">
          <h2 id="featured-products" className="label mb-4 border-b border-rule pb-2">
            Flagship
          </h2>
          <ul>
            {featured.map((product) => (
              <ProductRow key={product.slug} product={product} />
            ))}
          </ul>
        </section>

        {groups.length > 0 && (
          <div className="mt-12 space-y-12">
            <h2 className="label">Also in the catalog</h2>
            {groups.map((group) => (
              <section
                key={group.category}
                aria-labelledby={`product-cat-${group.category}`}
              >
                <h3
                  id={`product-cat-${group.category}`}
                  className="label mb-4 border-b border-rule pb-2"
                >
                  {group.label}
                </h3>
                <ul>
                  {group.items.map((product) => (
                    <ProductRow key={product.slug} product={product} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
