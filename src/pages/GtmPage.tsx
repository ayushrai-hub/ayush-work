/**
 * `/gtm`: GTM engineering page for revenue, RevOps, and GTM engineering roles.
 *
 * Renders `gtmPortfolio` top to bottom: positioning, a Loom walkthrough slot (an embed once
 * `walkthrough.loomUrl` is set, otherwise the planned topics), the evidence key, the product and
 * projects resolved from products.ts and projects.ts by `gtmProofs`, the layer map, the toolkit
 * with levels, current study topics, resources, next builds, and ContactCta. Emits WebPage JSON-LD.
 *
 * Connects to:
 * - Routed in src/App.tsx as `gtm`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 * - Content from src/content (`gtmPortfolio`, `gtmProofs`, `gtmEvidenceLabels`,
 *   `gtmSkillLevelLabels`, `gtmReadingProgress`, `loomEmbedUrl`, `formatUpdated`,
 *   `pageUpdatedAt("gtm")`, `person`) and src/lib/canonical.ts;
 *   components PageSEO, PageHeader, SectionHeading, ContactCta.
 * - Markdown twin `/gtm.md` built from `renderGtmBody` in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import ContactCta from "../components/site/ContactCta";
import PageHeader from "../components/editorial/PageHeader";
import SectionHeading from "../components/editorial/SectionHeading";
import {
  formatUpdated,
  gtmEvidenceLabels,
  gtmPortfolio,
  gtmProofs,
  gtmReadingProgress,
  gtmSkillLevelLabels,
  loomEmbedUrl,
  pageUpdatedAt,
  person,
} from "../content";
import type { GtmEvidence } from "../content";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

/** External link that opens in a new tab. */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
      {children}
    </a>
  );
}

/** Small bordered label for an evidence level. */
function EvidenceBadge({ evidence }: { evidence: GtmEvidence }) {
  return (
    <span className="inline-block border border-rule px-2 py-0.5 font-mono text-xs text-ink-muted">
      {gtmEvidenceLabels[evidence].label}
    </span>
  );
}

/** GTM portfolio page. Lazy-loaded by the `gtm` route in src/App.tsx. */
export default function GtmPage() {
  const { walkthrough, layers, toolkit, studying, resources, nextBuilds } = gtmPortfolio;
  const proofs = gtmProofs();
  const reading = gtmReadingProgress();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl("/gtm")}#webpage`,
    url: canonicalUrl("/gtm"),
    name: gtmPortfolio.title,
    description: gtmPortfolio.description,
    dateModified: pageUpdatedAt("gtm"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO
        title="GTM engineering"
        description={gtmPortfolio.description}
        path="/gtm"
        jsonLd={jsonLd}
      />
      <article className="site-shell page-section">
        <PageHeader
          label="GTM engineering"
          title="GTM engineering"
          dek={gtmPortfolio.positioning}
          updated={pageUpdatedAt("gtm")}
        />
        <p className="max-w-measure text-ink-muted leading-relaxed">
          {gtmPortfolio.background}{" "}
          <Link to="/experience" className="link-underline">
            Experience
          </Link>
          .
        </p>

        <section className="mt-14" aria-labelledby="gtm-walkthrough">
          <h2 id="gtm-walkthrough" className="font-display text-2xl text-ink">
            Walkthrough video
          </h2>
          {walkthrough.loomUrl ? (
            <div className="mt-4 aspect-video max-w-3xl border border-rule">
              <iframe
                src={loomEmbedUrl(walkthrough.loomUrl)}
                title="GTM engineering walkthrough on Loom"
                className="h-full w-full"
                allow="fullscreen"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="mt-4 max-w-measure border border-dashed border-rule p-5">
              <p className="text-ink">Loom walkthrough coming soon. It will cover:</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                {walkthrough.plannedTopics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="mt-14">
          <SectionHeading title="How to read the evidence" />
          <dl className="max-w-measure space-y-3">
            {(Object.keys(gtmEvidenceLabels) as GtmEvidence[]).map((key) => (
              <div key={key} className="flex flex-wrap items-baseline gap-3">
                <dt>
                  <EvidenceBadge evidence={key} />
                </dt>
                <dd className="text-sm text-ink-muted">{gtmEvidenceLabels[key].meaning}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14">
          <SectionHeading title="Product and projects" />
          <ol className="max-w-measure">
            {proofs.map((proof) => (
              <li key={proof.slug} id={`gtm-${proof.slug}`} className="scroll-mt-24 border-t border-rule py-8">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="font-display text-xl text-ink">{proof.title}</h3>
                  <EvidenceBadge evidence={proof.evidence} />
                  <span className="label">{proof.kind === "product" ? "Product I am building" : "Project"}</span>
                </div>
                <p className="mt-3 text-ink-muted leading-relaxed">{proof.summary}</p>
                <p className="mt-3 font-mono text-xs text-ink-faint">{proof.stack.join(" · ")}</p>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="label mb-2">What it shows</h4>
                    <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-muted">
                      {proof.shows.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="label mb-2">Limits</h4>
                    <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-muted">
                      {proof.limits.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <nav
                  className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm"
                  aria-label={`${proof.title} links`}
                >
                  {proof.demoUrl && <ExternalLink href={proof.demoUrl}>Live</ExternalLink>}
                  {proof.githubUrl && <ExternalLink href={proof.githubUrl}>GitHub</ExternalLink>}
                  <Link to={proof.href} className="link-underline">
                    {proof.kind === "product" ? "Product page" : "Projects list"}
                  </Link>
                </nav>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <SectionHeading title="GTM infrastructure layers: built and missing" />
          <div className="max-w-measure divide-y divide-rule border-y border-rule">
            {layers.map((layer) => (
              <div key={layer.name} className="py-6">
                <h3 className="font-display text-lg text-ink">{layer.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{layer.description}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink">
                  {layer.built.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-ink-muted">
                  <span className="label mr-2">Gap</span>
                  {layer.gap}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <SectionHeading title="What I already know" />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            Levels:{" "}
            {Object.values(gtmSkillLevelLabels).join(" · ")}. A tool counts as in public code only when a
            linked repository uses it.
          </p>
          <div className="grid max-w-4xl gap-x-10 gap-y-8 md:grid-cols-2">
            {toolkit.map((group) => (
              <div key={group.heading}>
                <h3 className="label mb-3">{group.heading}</h3>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <p className="flex flex-wrap items-baseline gap-2">
                        <span className="font-medium text-ink">{item.name}</span>
                        <span className="font-mono text-xs text-ink-faint">
                          {gtmSkillLevelLabels[item.level]}
                        </span>
                      </p>
                      <p className="text-sm text-ink-muted">{item.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <SectionHeading title="What I am studying now" />
          <p className="max-w-measure text-ink-muted leading-relaxed">{studying.intro}</p>
          <div className="mt-6 grid max-w-4xl gap-x-10 gap-y-6 md:grid-cols-2">
            {studying.topics.map((topic) => (
              <div key={topic.topic}>
                <h3 className="font-medium text-ink">{topic.topic}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                  {topic.questions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <SectionHeading title="Resources I am using" />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            {reading.read} of {reading.total} read. {resources.note}
          </p>
          <div className="grid max-w-4xl gap-x-10 gap-y-6 md:grid-cols-2">
            {resources.groups.map((group) => (
              <div key={group.heading}>
                <h3 className="label mb-3">{group.heading}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <ExternalLink href={item.href}>{item.label}</ExternalLink>
                      {item.completedOn && (
                        <span className="ml-2 inline-block whitespace-nowrap font-mono text-xs text-ink-faint">
                          Read <time dateTime={item.completedOn}>{formatUpdated(item.completedOn)}</time>
                        </span>
                      )}
                      {item.note && <p className="text-sm text-ink-muted">{item.note}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <SectionHeading title="What I will build next" />
          <ol className="max-w-measure list-decimal space-y-2 pl-5 text-ink-muted">
            {nextBuilds.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <ContactCta
          prompt={`Hiring for GTM engineering, RevOps engineering, or revenue data work? Use contact, resume, or Calendly. Email ${person.email}.`}
        />
      </article>
    </>
  );
}
