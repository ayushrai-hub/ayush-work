/**
 * `/pow/devops-engineer`: DevOps proof of work.
 *
 * Renders the positioning, the control room, and the inspectors from src/components/devops.
 * Copy and repository findings live in src/content/devopsPow.ts. The page does not call a
 * CI system. Emits WebPage JSON-LD.
 *
 * Connects to:
 * - Routed in src/App.tsx as `pow/devops-engineer`. Prerendered in src/lib/publicRoutes.ts.
 * - Markdown twin via `renderDevopsBody` in src/lib/agent/markdown.ts.
 * - Sibling links from powPages, the header, the footer, and the product-management nav.
 */
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ArtifactExplorer from "../components/devops/ArtifactExplorer";
import ContainerLab from "../components/devops/ContainerLab";
import ControlRoom from "../components/devops/ControlRoom";
import PipelineBuilder from "../components/devops/PipelineBuilder";
import ReleaseGates from "../components/devops/ReleaseGates";
import StrategyCompare from "../components/devops/StrategyCompare";
import WorkflowExplorer from "../components/devops/WorkflowExplorer";
import { PowNav } from "../components/pow/PowNav";
import PageSEO from "../components/site/PageSEO";
import {
  deliveryFindings,
  devopsLimits,
  devopsPow,
  devopsPrinciples,
  devopsSections,
  pageUpdatedAt,
  person,
} from "../content";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

/** External profile link. */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className="link-underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/** Numbered section with a heading id for the jump nav. */
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
      {intro ? <p className="mt-4 max-w-measure text-ink-muted leading-relaxed">{intro}</p> : null}
      <div className={intro ? "mt-8" : "mt-6"}>{children}</div>
    </section>
  );
}

/** DevOps proof-of-work page. Lazy-loaded by the route in src/App.tsx. */
export default function DevopsPowPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl(devopsPow.path)}#webpage`,
    url: canonicalUrl(devopsPow.path),
    name: devopsPow.title,
    description: devopsPow.description,
    dateModified: pageUpdatedAt("devops"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO
        title="DevOps engineer"
        description={devopsPow.description}
        path={devopsPow.path}
        jsonLd={jsonLd}
      />
      <article className="site-shell page-section">
        <header className="max-w-measure">
          <p className="label">DevOps engineer · {devopsPow.name}</p>
          <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl md:text-[2.75rem]">
            {devopsPow.headline}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">{devopsPow.dek}</p>
          <p className="mt-6 border-l-2 border-accent pl-4 text-sm leading-relaxed text-ink">{devopsPow.status}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={devopsPow.primaryCta.href} className="btn-primary">
              {devopsPow.primaryCta.label}
            </Link>
            <Link to={devopsPow.secondaryCta.href} className="btn-secondary">
              {devopsPow.secondaryCta.label}
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li>
              <ExternalLink href={person.primaryProfiles.github}>GitHub</ExternalLink>
            </li>
            <li>
              <ExternalLink href={person.primaryProfiles.linkedin}>LinkedIn</ExternalLink>
            </li>
            <li>
              <ExternalLink href={person.siteUrl}>Personal website</ExternalLink>
            </li>
          </ul>
        </header>

        <nav className="mt-12 flex gap-2 overflow-x-auto border-y border-rule py-3" aria-label="On this page">
          {devopsSections.map((section) => (
            <Link
              key={section.id}
              to={`${devopsPow.path}#${section.id}`}
              className="shrink-0 px-2 py-2 text-sm text-ink-muted hover:text-ink"
            >
              {section.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4">
          <PowNav />
        </div>

        <Section id="principles" number="01" title="Working principles" intro="A stance for delivery work. Not a certification, and not a record of a production program.">
          <ol className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
            {devopsPrinciples.map((principle, index) => (
              <li key={principle.id} className="bg-paper p-5">
                <p className="font-mono text-xs text-ink-faint">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-lg text-ink">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{principle.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="control-room"
          number="02"
          title="DevOps Control Room"
          intro="A fictional application change moves from checkout to a release decision. Step it, or run it to the end. A failed mandatory check cannot become a successful release."
        >
          <ControlRoom />
        </Section>

        <Section
          id="pipeline"
          number="03"
          title="CI/CD pipeline"
          intro="Enable the optional stages, inject a failure, and read the dependency waves. The result is computed locally."
        >
          <PipelineBuilder />
        </Section>

        <Section
          id="actions"
          number="04"
          title="GitHub Actions"
          intro="Verified files are summarized from the public repositories. Where a repository has no workflow, the inspector says so. The YAML example is proposed."
        >
          <WorkflowExplorer />
        </Section>

        <Section
          id="artifacts"
          number="05"
          title="Build reproducibility"
          intro="A release should name its revision, its lockfile, and the artifact that was built. The manifest below is synthetic."
        >
          <ArtifactExplorer />
        </Section>

        <Section
          id="containers"
          number="06"
          title="Container delivery"
          intro="Dockerfiles that exist are described from the files I read. The failure buttons are hypothetical reactions, not runs."
        >
          <ContainerLab />
        </Section>

        <Section
          id="strategies"
          number="07"
          title="Deployment strategies"
          intro="Compare rolling, blue-green, canary, feature flags, and recreate on assumed tradeoffs. I am not claiming any of these as a production method I have operated."
        >
          <StrategyCompare />
        </Section>

        <Section
          id="gates"
          number="08"
          title="Release gates and rollback"
          intro="A mandatory failing gate blocks promotion. Rollback returns the sample to the last approved version. An application rollback does not undo a migration."
        >
          <ReleaseGates />
        </Section>

        <Section
          id="evidence"
          number="09"
          title="What the repositories contain"
          intro="Read from public source on 19 Oct 2026. Live URLs are the sites I was asked to look at. I did not treat a live page as proof of a workflow that the repository does not contain."
        >
          <ul className="divide-y divide-rule border-y border-rule">
            {deliveryFindings.map((finding) => (
              <li key={finding.id} className="py-6">
                <h3 className="font-display text-xl text-ink">{finding.name}</h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-label text-ink-faint">{finding.verdict}</p>
                <ul className="mt-3 max-w-measure list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink">
                  {finding.found.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <li>
                    <ExternalLink href={finding.href}>Repository</ExternalLink>
                  </li>
                  {finding.live ? (
                    <li>
                      <ExternalLink href={finding.live}>Live site</ExternalLink>
                    </li>
                  ) : null}
                </ul>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="limits" number="10" title="What this page does not claim">
          <ul className="max-w-measure list-disc space-y-3 pl-5 text-sm leading-relaxed text-ink-muted">
            {devopsLimits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </Section>
      </article>
    </>
  );
}
