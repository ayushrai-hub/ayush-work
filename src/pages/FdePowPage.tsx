/**
 * `/pow/fde`: forward deployed engineering proof of work.
 *
 * Composes the RELAY narrative from src/content/fde.ts: hero, principles, problem, interactive
 * workflow, simulated product preview, architecture, decisions, failure scenarios, deployment
 * sequence, roadmap, and related work resolved from products and projects. Emits WebPage JSON-LD.
 * The page is public and does not call a model or a backend.
 *
 * Connects to:
 * - Routed in src/App.tsx as `pow/fde`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 * - Components in src/components/fde/. Content from src/content/fde.ts and person.ts.
 * - Markdown twin `/pow/fde.md` from `renderFdeBody` in src/lib/agent/markdown.ts.
 */
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import ArchitectureMap from "../components/fde/ArchitectureMap";
import DecisionList from "../components/fde/DecisionList";
import FailureExplorer from "../components/fde/FailureExplorer";
import ProcessSteps from "../components/fde/ProcessSteps";
import ProductPreview from "../components/fde/ProductPreview";
import StageFlow from "../components/fde/StageFlow";
import {
  fdePhaseStatusLabels,
  fdePow,
  fdePrinciples,
  fdeProblemSteps,
  fdeRelatedWork,
  fdeRoadmap,
  fdeSections,
  pageUpdatedAt,
  person,
} from "../content";
import type { FdePhaseStatus } from "../content";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

/** External link that opens in a new tab. */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
      {children}
    </a>
  );
}

/** Numbered section with a stable heading id for the jump nav and the scroll manager. */
function Section({
  id,
  number,
  title,
  intro,
  children,
}: {
  id: string;
  number: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-20 scroll-mt-28" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="font-display text-2xl text-ink md:text-[1.75rem]">
        <span className="mr-3 font-mono text-sm text-ink-faint">{number}</span>
        {title}
      </h2>
      {intro && <p className="mt-4 max-w-measure text-ink-muted leading-relaxed">{intro}</p>}
      <div className={intro ? "mt-8" : "mt-6"}>{children}</div>
    </section>
  );
}

/** Forward deployed engineering proof-of-work page. Lazy-loaded by the `pow/fde` route. */
export default function FdePowPage() {
  const related = fdeRelatedWork();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl(fdePow.path)}#webpage`,
    url: canonicalUrl(fdePow.path),
    name: fdePow.title,
    description: fdePow.description,
    dateModified: pageUpdatedAt("pow"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO
        title={fdePow.title}
        description={fdePow.description}
        path={fdePow.path}
        jsonLd={jsonLd}
      />
      <article className="site-shell page-section">
        <header className="max-w-[46rem]">
          <p className="label">{fdePow.eyebrow}</p>
          <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
            {fdePow.headline}
          </h1>
          <p className="mt-5 max-w-measure text-lg leading-relaxed text-ink-muted">{fdePow.dek}</p>
          <p className="mt-6 max-w-measure border-l-2 border-accent pl-4 text-sm leading-relaxed text-ink">
            {fdePow.status}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="#problem" className="btn-primary">
              Explore the engineering
            </Link>
            <a
              href={person.primaryProfiles.github}
              className="btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View my GitHub
            </a>
          </div>
        </header>

        <nav className="mt-12 flex gap-2 overflow-x-auto border-y border-rule py-3" aria-label="On this page">
          {fdeSections.map((section) => (
            <Link
              key={section.id}
              to={`#${section.id}`}
              className="shrink-0 px-2 py-2 text-sm text-ink-muted hover:text-ink"
            >
              {section.label}
            </Link>
          ))}
        </nav>

        <Section
          id="thesis"
          number="01"
          title="Engineering starts with the problem, not the technology."
          intro="These are the constraints I use when a workflow is still unclear."
        >
          <ol className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
            {fdePrinciples.map((principle, index) => (
              <li key={principle.id} className="bg-paper p-5">
                <p className="font-mono text-xs text-ink-faint">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-lg text-ink">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{principle.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="problem"
          number="02"
          title={`${fdePow.relayName} — ${fdePow.relayLabel}`}
          intro="Personal proof-of-work project. The company in this section is a proposed demonstration, not a customer."
        >
          <p className="max-w-measure text-ink leading-relaxed">
            A B2B SaaS company has customer information distributed across its CRM, support system,
            product analytics, and internal communication tools. Its teams lack a unified way to
            identify deteriorating accounts, understand why they are at risk, and coordinate the next
            action. Manual investigation consumes time, signals are missed, and important decisions
            lack a consistent evidence trail.
          </p>
          <ol className="mt-8 grid gap-3 md:grid-cols-5">
            {fdeProblemSteps.map((step, index) => (
              <li key={step.id} className="border border-rule p-4">
                <p className="font-mono text-xs text-ink-faint">0{index + 1}</p>
                <h3 className="mt-2 font-display text-base leading-snug text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="solution"
          number="03"
          title="From fragmented signals to an actionable decision."
          intro="Deterministic stages apply rules. AI-assisted stages may draft text from retrieved evidence and must fail closed. The human gate is an approval."
        >
          <StageFlow />
        </Section>

        <Section
          id="preview"
          number="04"
          title="Product preview"
          intro="A simulated demonstration of the application I would build next. The accounts and recommendations are written into the page."
        >
          <ProductPreview />
        </Section>

        <Section
          id="architecture"
          number="05"
          title="Proposed system architecture"
          intro="A design for the boundaries between the UI, the API, domain logic, the database, the model provider, and the external systems. These layers are not running services."
        >
          <ArchitectureMap />
        </Section>

        <Section
          id="decisions"
          number="06"
          title="Why the system is designed this way."
          intro="Each choice is a trade-off I would defend in a design review. None of them cites a benchmark, because this phase has not measured one."
        >
          <DecisionList />
        </Section>

        <Section
          id="failures"
          number="07"
          title="Failure is part of the design."
          intro="How the proposed system should behave when an event, a model, or an integration does not cooperate. This is judgment about the design, not a list of mechanisms already built."
        >
          <div className="border border-rule bg-paper-elevated p-4 sm:p-6">
            <FailureExplorer />
          </div>
        </Section>

        <Section
          id="deployment"
          number="08"
          title="How I would take this from a customer problem to a working deployment."
          intro="The sequence I would use on a real engagement, and the artifacts I would leave behind. It is not a record of a completed engagement."
        >
          <ProcessSteps />
        </Section>

        <Section
          id="roadmap"
          number="09"
          title="Technical roadmap"
          intro="Phase 1 is this page. Later phases stay planned until the software exists."
        >
          <ul className="mb-6 flex flex-wrap gap-2" aria-label="Status scale">
            {(Object.keys(fdePhaseStatusLabels) as FdePhaseStatus[]).map((status) => (
              <li key={status} className="border border-rule px-2 py-1 font-mono text-xs text-ink-muted">
                {fdePhaseStatusLabels[status]}
              </li>
            ))}
          </ul>
          <ol className="divide-y divide-rule border-y border-rule">
            {fdeRoadmap.map((phase) => (
              <li key={phase.phase} className="grid gap-3 py-5 md:grid-cols-[8rem_minmax(0,1fr)]">
                <p className="font-mono text-xs text-ink">
                  Phase {phase.phase}
                  <span className="mt-1 block text-ink-faint">{fdePhaseStatusLabels[phase.status]}</span>
                </p>
                <div>
                  <h3 className="font-display text-lg text-ink">{phase.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{phase.summary}</p>
                  <p className="mt-2 text-sm text-ink">{phase.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="related"
          number="10"
          title="Related work"
          intro="Projects already recorded on this site that sit near the same kind of problem: fragmented systems, explicit limits, and a trail from input to result."
        >
          <ul className="divide-y divide-rule border-y border-rule">
            {related.map((item) => (
              <li key={item.slug} id={`related-${item.slug}`} className="scroll-mt-28 py-6">
                <h3 className="font-display text-xl text-ink">{item.title}</h3>
                <p className="mt-2 max-w-measure text-sm leading-relaxed text-ink">{item.problem}</p>
                <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">{item.demonstrates}</p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {item.links.map((link) => (
                    <li key={link.href}>
                      {link.href.startsWith("/") ? (
                        <Link to={link.href} className="link-underline text-sm">
                          {link.label}
                        </Link>
                      ) : (
                        <ExternalLink href={link.href}>{link.label}</ExternalLink>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Section>

        <section id="close" className="mt-20 scroll-mt-28 border-t border-rule pt-12">
          <h2 className="max-w-[40rem] font-display text-2xl leading-snug text-ink md:text-3xl">
            {fdePow.closing}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <ExternalLink href={person.primaryProfiles.github}>GitHub</ExternalLink>
            </li>
            <li>
              <ExternalLink href={person.primaryProfiles.linkedin}>LinkedIn</ExternalLink>
            </li>
            <li>
              <Link to="/" className="link-underline text-sm">
                Portfolio
              </Link>
            </li>
            <li>
              <Link to="/pow/product-management" className="link-underline text-sm">
                Product management proof of work
              </Link>
            </li>
            <li className="text-sm text-ink-muted">
              {fdePow.relayRepository ? (
                <ExternalLink href={fdePow.relayRepository}>RELAY repository</ExternalLink>
              ) : (
                "RELAY has no public repository yet."
              )}
            </li>
          </ul>
        </section>
      </article>
    </>
  );
}
