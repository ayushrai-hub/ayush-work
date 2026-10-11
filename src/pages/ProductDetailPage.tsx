import { Link, useParams } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import MetaList from "../components/editorial/MetaList";
import {
  getProductBySlug,
  person,
  productCategoryLabels,
  productStageLabels,
  type Product,
} from "../content";

function productJsonLd(product: Product) {
  const sameAs = [product.demoUrl, product.githubUrl].filter(
    (url): url is string => Boolean(url),
  );
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: product.title,
    description: product.summary,
    url: `${person.siteUrl}/products/${product.slug}`,
    author: {
      "@type": "Person",
      name: person.name,
      url: person.siteUrl,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="max-w-measure list-disc space-y-2 pl-5 text-ink-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <div className="site-shell page-section">
        <PageHeader title="Product not found" />
        <Link to="/products" className="link-accent">
          Back to products
        </Link>
      </div>
    );
  }

  const archEntries = Object.entries(product.architecture).filter(
    ([, value]) => value && (Array.isArray(value) ? value.length : true),
  );
  const stageLabel = productStageLabels[product.stage];

  return (
    <>
      <PageSEO
        title={product.title}
        description={product.summary}
        path={`/products/${product.slug}`}
        jsonLd={productJsonLd(product)}
      />
      <article className="site-shell page-section">
        <PageHeader
          label={`${stageLabel} · ${productCategoryLabels[product.category]}`}
          title={product.title}
          dek={product.summary}
        />

        <MetaList
          items={[
            { label: "Stage", value: stageLabel },
            {
              label: "Audience",
              value: product.audience.join("; "),
            },
          ]}
        />
        <Prose className="mb-8">
          <p>{product.stageExplanation}</p>
        </Prose>

        <p className="mb-10 flex flex-wrap gap-x-4 gap-y-2 text-sm">
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
              Source repository
            </a>
          )}
          {product.relatedWorkSlug && (
            <Link
              to={`/work/${product.relatedWorkSlug}`}
              className="link-accent"
            >
              Case study
            </Link>
          )}
          {product.log.length > 0 && (
            <Link to={`/products/${product.slug}/log`} className="link-accent">
              Build log
            </Link>
          )}
        </p>

        {product.thesis && (
          <section className="mb-10">
            <h2 className="label mb-3">Thesis</h2>
            <Prose>
              <p>{product.thesis}</p>
            </Prose>
          </section>
        )}

        <section className="mb-10">
          <h2 className="label mb-3">Problem</h2>
          <Prose>
            <p>{product.problem}</p>
          </Prose>
        </section>

        <section className="mb-10">
          <h2 className="label mb-3">Intended users</h2>
          <BulletList items={product.audience} />
        </section>

        <section className="mb-10">
          <h2 className="label mb-3">Approach</h2>
          <Prose>
            <p>{product.approach}</p>
            {product.why && <p>{product.why}</p>}
          </Prose>
          {product.workflow && product.workflow.length > 0 && (
            <ol className="mt-4 max-w-measure list-decimal space-y-2 pl-5 text-ink-muted">
              {product.workflow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
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

        {product.maturity && (
          <section className="mb-10">
            <h2 className="label mb-3">What exists</h2>
            <div className="max-w-measure space-y-6">
              <div>
                <h3 className="font-display text-lg text-ink">Implemented</h3>
                <BulletList items={product.maturity.implemented} />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink">Experimental</h3>
                <BulletList items={product.maturity.experimental} />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink">Planned</h3>
                <BulletList items={product.maturity.planned} />
              </div>
            </div>
          </section>
        )}

        {(product.tradeoffs?.length || product.openQuestions.length > 0) && (
          <section className="mb-10">
            <h2 className="label mb-3">Trade-offs and open questions</h2>
            {product.tradeoffs && product.tradeoffs.length > 0 && (
              <BulletList items={product.tradeoffs} />
            )}
            {product.openQuestions.length > 0 && (
              <ul className="mt-4 max-w-measure list-disc space-y-2 pl-5 text-ink-muted">
                {product.openQuestions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        {product.log.length === 0 && (
          <section className="mb-10">
            <h2 className="label mb-3">Build log</h2>
            <Prose>
              <p>
                No verified build-log entries yet.{" "}
                <Link to={`/products/${product.slug}/log`} className="link-accent">
                  The log page
                </Link>{" "}
                stays empty until a date is backed by a repository record or a
                dated document.
              </p>
            </Prose>
          </section>
        )}

        <p className="mt-12">
          <Link to="/products" className="link-accent">
            All products
          </Link>
        </p>
      </article>
    </>
  );
}
