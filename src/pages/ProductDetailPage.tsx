import { Link, useParams } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import MetaList from "../components/editorial/MetaList";
import { getProductBySlug } from "../content";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <div className="site-shell page-section">
        <PageHeader title="Product not found" />
        <Link to="/products" className="link-accent">
          Back to products →
        </Link>
      </div>
    );
  }

  const archEntries = Object.entries(product.architecture).filter(
    ([, v]) => v && (Array.isArray(v) ? v.length : true)
  );

  return (
    <>
      <PageSEO
        title={product.title}
        description={product.summary}
        path={`/products/${product.slug}`}
      />
      <article className="site-shell page-section">
        <PageHeader
          label="Product"
          title={product.title}
          dek={product.summary}
        />

        <MetaList
          items={[
            { label: "Stage", value: product.stage },
            { label: "Audience", value: product.audience.join("; ") },
          ]}
        />

        <p className="mb-8 flex flex-wrap gap-4 text-sm">
          {product.demoUrl && (
            <a
              href={product.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
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
            >
              GitHub
            </a>
          )}
          <Link to={`/products/${product.slug}/log`} className="link-accent">
            Build log →
          </Link>
          {product.relatedWorkSlug && (
            <Link
              to={`/work/${product.relatedWorkSlug}`}
              className="link-accent"
            >
              Case study →
            </Link>
          )}
        </p>

        <section className="mb-10">
          <h2 className="label mb-3">Problem</h2>
          <Prose>
            <p>{product.problem}</p>
          </Prose>
        </section>

        <section className="mb-10">
          <h2 className="label mb-3">Approach</h2>
          <Prose>
            <p>{product.approach}</p>
          </Prose>
        </section>

        {archEntries.length > 0 && (
          <section className="mb-10">
            <h2 className="label mb-3">Architecture</h2>
            <dl className="max-w-measure space-y-3">
              {archEntries.map(([key, value]) => (
                <div key={key}>
                  <dt className="font-mono text-xs uppercase tracking-label text-ink-faint capitalize">
                    {key}
                  </dt>
                  <dd className="text-ink-muted">
                    {Array.isArray(value) ? value.join("; ") : value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {product.openQuestions.length > 0 && (
          <section className="mb-10">
            <h2 className="label mb-3">Open questions</h2>
            <ul className="max-w-measure list-disc space-y-2 pl-5 text-ink-muted">
              {product.openQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-12">
          <Link to="/products" className="link-accent">
            ← All products
          </Link>
        </p>
      </article>
    </>
  );
}
