/**
 * `/pow/cloud-engineer`: cloud engineering proof of work.
 *
 * Composes the Cloud Operations Lab from src/content/cloudEngineerPow.ts and the local simulations
 * in src/lib/cloudOpsLab.ts. Verified repository notes stay in the case studies. The lab does not
 * provision infrastructure. Emits WebPage JSON-LD.
 *
 * Connects to:
 * - Routed in src/App.tsx as `pow/cloud-engineer`. Prerendered in src/lib/publicRoutes.ts.
 * - src/components/pow/cloud/CloudLab.tsx and src/components/pow/PowNav.tsx.
 * - Markdown twin from `renderCloudEngineerBody` in src/lib/agent/markdown.ts.
 */
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArchitectureExplorer,
  ContainerExplorer,
  CostExplorer,
  DecisionExplorer,
  DeploymentWorkbench,
  IacExplorer,
  NetworkExplorer,
  ObservabilityDashboard,
  PipelineExplorer,
  ScalingSimulator,
  SecurityExplorer,
  TroubleshootingLab,
} from "../components/pow/cloud/CloudLab";
import { PowNav } from "../components/pow/PowNav";
import PageSEO from "../components/site/PageSEO";
import {
  CLOUD_ENGINEER_PATH,
  cloudCaseStudies,
  cloudEngineerDescription,
  cloudPrinciples,
  cloudRoadmap,
  cloudSections,
  pageUpdatedAt,
  person,
} from "../content";
import type { CloudEvidence } from "../content";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

const EVIDENCE_LABEL: Record<CloudEvidence, string> = {
  verified: "Verified in the repository",
  observed: "Observed",
  proposed: "Proposed",
};

/** External link that opens in a new tab. */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
      {children}
    </a>
  );
}

/** Numbered section with a scroll margin under the sticky header. */
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
    <section id={id} className="mt-16 scroll-mt-28 border-t border-rule pt-10" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="font-display text-2xl text-ink md:text-[1.75rem]">
        <span className="mr-3 font-mono text-sm font-normal text-ink-faint">{number}</span>
        {title}
      </h2>
      {intro ? <p className="mt-3 max-w-measure leading-relaxed text-ink-muted">{intro}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Cloud engineering proof-of-work page. */
export default function CloudEngineerPowPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl(CLOUD_ENGINEER_PATH)}#webpage`,
    url: canonicalUrl(CLOUD_ENGINEER_PATH),
    name: "Cloud engineering proof of work",
    description: cloudEngineerDescription,
    dateModified: pageUpdatedAt("cloud-engineer"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO
        title="Cloud engineering"
        description={cloudEngineerDescription}
        path={CLOUD_ENGINEER_PATH}
        jsonLd={jsonLd}
      />
      <article className="site-shell page-section">
        <PowNav />
        <header className="mt-8 max-w-[46rem]">
          <p className="label">Ayush Rai · Cloud engineering</p>
          <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
            I build, deploy, and operate the infrastructure behind software.
          </h1>
          <p className="mt-5 max-w-measure text-lg leading-relaxed text-ink-muted">
            I approach cloud engineering as a systems problem: deployment, networking, security,
            reliability, observability, and cost must work together to make applications dependable.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {cloudPrinciples.map((principle) => (
              <li key={principle} className="border border-rule px-3 py-2 text-sm text-ink">
                {principle}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-measure text-sm leading-relaxed text-ink-muted">
            The lab below is a local model of a fictional app, Fieldnote. It is not a claim that I
            have operated every service it shows, and it does not create cloud resources.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="#cloud-operations-lab" className="btn-primary">
              Explore the Infrastructure Lab
            </Link>
            <Link to="#case-studies" className="btn-secondary">
              Inspect My Deployments
            </Link>
          </div>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <ExternalLink href={person.primaryProfiles.github}>GitHub</ExternalLink>
            <ExternalLink href={person.primaryProfiles.linkedin}>LinkedIn</ExternalLink>
            <ExternalLink href={person.siteUrl}>ayushrai.site</ExternalLink>
          </p>
        </header>

        <nav className="mt-12 flex gap-2 overflow-x-auto border-y border-rule py-3" aria-label="On this page">
          {cloudSections.map((section) => (
            <Link key={section.id} to={`#${section.id}`} className="shrink-0 px-2 py-2 text-sm text-ink-muted hover:text-ink">
              {section.label}
            </Link>
          ))}
        </nav>

        <Section
          id="cloud-operations-lab"
          number="01"
          title="Cloud Operations Lab"
          intro="Fieldnote is a fictional web app: client, DNS, edge, application, API, database, background work, and telemetry. Use it to inspect choices. Nothing here is provisioned."
        >
          <h3 id="architecture" className="font-display text-xl text-ink">
            Architecture explorer
          </h3>
          <div className="mt-4">
            <ArchitectureExplorer />
          </div>
        </Section>

        <Section
          id="deployments"
          number="02"
          title="Deployment workbench"
          intro="Eleven stages, three conceptual targets, and failures that stay failures. A failed health check does not become a release."
        >
          <DeploymentWorkbench />
        </Section>

        <Section
          id="infrastructure-as-code"
          number="03"
          title="Infrastructure as code"
          intro="Declarative files, review, and state. The example is not applied. RevenueRoles reserves a Terraform directory and declares no resources."
        >
          <IacExplorer />
        </Section>

        <Section
          id="containers"
          number="04"
          title="Containers and runtime"
          intro="An image is not a running system. SpiderWeb's API Dockerfile is a real multi-stage build with no production host claimed here. The annotated file below is a reference, not that image."
        >
          <ContainerExplorer />
        </Section>

        <Section
          id="networking"
          number="05"
          title="Networking and request flow"
          intro="Follow a request, then a failure. No real client addresses or private endpoints are shown."
        >
          <NetworkExplorer />
        </Section>

        <Section
          id="cicd"
          number="06"
          title="CI/CD and release engineering"
          intro="Checks exist to stop an untested change. The gate is the same rule as the workbench: failed health or smoke means the release is blocked."
        >
          <PipelineExplorer />
        </Section>

        <Section
          id="observability"
          number="07"
          title="Observability and incident response"
          intro="Synthetic gauges for Fieldnote. Logs, metrics, traces, and alerts answer different questions. The SLO language is illustrative."
        >
          <ObservabilityDashboard />
        </Section>

        <Section
          id="security"
          number="08"
          title="Cloud security"
          intro="These are controls to implement and verify. Checking a box on this page does not secure a system."
        >
          <SecurityExplorer />
        </Section>

        <Section
          id="cost"
          number="09"
          title="Cloud cost"
          intro="Move the inputs. The total is the sample formula, not an invoice and not a saving."
        >
          <CostExplorer />
        </Section>

        <Section
          id="scaling"
          number="10"
          title="Scaling and reliability"
          intro="More application instances do not repair a database-shaped limit. Immediate retries can make an outage worse."
        >
          <ScalingSimulator />
        </Section>

        <Section
          id="case-studies"
          number="11"
          title="What the repositories actually contain"
          intro="Verified means I read it in the repository. Observed means a check on 19 Oct 2026. Proposed is not done. Using a host does not mean I configured every part of it."
        >
          <div className="space-y-8">
            {cloudCaseStudies.map((study) => (
              <article key={study.id} className="border-t border-rule pt-6" aria-labelledby={`${study.id}-title`}>
                <h3 id={`${study.id}-title`} className="font-display text-xl text-ink">
                  {study.title}
                </h3>
                <p className="mt-2 flex flex-wrap gap-x-4 text-sm">
                  {study.href ? <ExternalLink href={study.href}>Site</ExternalLink> : null}
                  {study.repo ? <ExternalLink href={study.repo}>Repository</ExternalLink> : null}
                </p>
                <ul className="mt-4 space-y-3">
                  {study.lines.map((line) => (
                    <li key={line.text} className="text-sm leading-relaxed text-ink-muted">
                      <span className="mr-2 inline-block border border-rule px-2 py-0.5 font-mono text-[11px] uppercase tracking-label text-ink">
                        {EVIDENCE_LABEL[line.kind]}
                      </span>
                      {line.text}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="decisions"
          number="12"
          title="Architecture decisions"
          intro="Reference decisions. The simplest architecture is the right one until a constraint says otherwise."
        >
          <DecisionExplorer />
        </Section>

        <Section
          id="troubleshooting"
          number="13"
          title="Troubleshooting lab"
          intro="A sequence for a junior engineer: symptom, hypothesis, check, evidence, cause, mitigation, verification, prevention."
        >
          <TroubleshootingLab />
        </Section>

        <Section
          id="roadmap"
          number="14"
          title="How I would strengthen a small production app"
          intro="Planned work. None of these stages is marked complete."
        >
          <ol className="space-y-6">
            {cloudRoadmap.map((phase) => (
              <li key={phase.stage}>
                <h3 className="text-ink">
                  <span className="mr-2 font-mono text-sm text-ink-faint">{phase.stage}</span>
                  {phase.title}
                  <span className="ml-2 font-mono text-xs uppercase tracking-label text-ink-faint">{phase.status}</span>
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Section>
      </article>
    </>
  );
}
