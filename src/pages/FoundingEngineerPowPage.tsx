/**
 * `/pow/founding-engineer`: founding-engineer proof of work.
 *
 * The page is a field notebook: positioning, the BUILDLOG workbench, case studies from the
 * product records, and local inspectors for decisions, timeline, constraints, tests, and a
 * system map. Interactive state lives in the child components. No new backend.
 *
 * Connects to:
 * - Routed in src/App.tsx. Prerendered from src/lib/publicRoutes.ts.
 * - Content from src/content/foundingEngineer.ts and person from src/content.
 * - Markdown twin via renderFoundingEngineerBody in src/lib/agent/markdown.ts.
 * - PowNav, BuildLog, and the inspectors under src/components/pow/.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { PowNav } from "../components/pow/PowNav";
import BuildLog from "../components/pow/founding/BuildLog";
import {
  ConstraintSimulator,
  DecisionLog,
  EngineeringTimeline,
  IncidentWalkthrough,
  StackMap,
  TestingPanel,
} from "../components/pow/founding/FoundingInspectors";
import {
  aiEngineering,
  feedbackLoop,
  foundingArtifacts,
  foundingCases,
  foundingDuties,
  foundingEngineer,
  foundingPrinciples,
  nextBuildSteps,
} from "../content/foundingEngineer";
import { pageUpdatedAt, person } from "../content";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

/** External profile or artifact link. */
function Outbound({ href, children }: { href: string; children: string }) {
  const external = href.startsWith("http");
  if (!external) {
    return (
      <Link to={href} className="link-underline">
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
      {children}
    </a>
  );
}

/** Founding-engineer proof-of-work page. */
export default function FoundingEngineerPowPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl("/pow/founding-engineer")}#webpage`,
    url: canonicalUrl("/pow/founding-engineer"),
    name: "Founding engineer proof of work",
    description: foundingEngineer.description,
    dateModified: pageUpdatedAt("founding-engineer"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO
        title="Founding engineer"
        description={foundingEngineer.description}
        path="/pow/founding-engineer"
        jsonLd={jsonLd}
      />
      <article className="site-shell page-section">
        <p className="label mb-4">Founding engineer / proof of work</p>
        <PowNav />
        <div className="mt-8">
          <PageHeader
            title={foundingEngineer.headline}
            dek={foundingEngineer.heroDek}
            updated={pageUpdatedAt("founding-engineer")}
          />
        </div>
        <p className="max-w-measure text-lg leading-relaxed text-ink">{foundingEngineer.positioning}</p>
        <p className="mt-3 max-w-measure leading-relaxed text-ink-muted">{foundingEngineer.support}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#buildlog" className="btn-primary">
            Explore the engineering workbench
          </a>
          <a href="#case-studies" className="btn-secondary">
            Inspect my shipped projects
          </a>
        </div>
        <p className="meta-row mt-4">
          <Outbound href={person.primaryProfiles.github}>GitHub</Outbound>
          <Outbound href={person.primaryProfiles.linkedin}>LinkedIn</Outbound>
          <Outbound href={person.siteUrl}>ayushrai.site</Outbound>
          <Outbound href={person.deepDive?.url ?? "https://life.ayushrai.site/"}>Life notes</Outbound>
        </p>

        <section className="mt-16" aria-labelledby="founding-means">
          <h2 id="founding-means" className="font-display text-2xl text-ink">
            What founding engineering means here
          </h2>
          <p className="mt-3 max-w-measure leading-relaxed text-ink-muted">
            The job is the shortest reliable path from a real problem to a useful product. Writing
            code quickly is one part of that path. The rest is scope, contracts, deployment, and the
            honesty to leave a piece unfinished in public.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {foundingDuties.map((duty) => (
              <li key={duty.title} className="border-t border-rule pt-3">
                <h3 className="font-display text-lg text-ink">{duty.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{duty.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" id="buildlog" aria-labelledby="buildlog-heading">
          <h2 id="buildlog-heading" className="font-display text-2xl text-ink">
            {foundingEngineer.workbenchName} — From problem to product
          </h2>
          <p className="mt-3 max-w-measure leading-relaxed text-ink-muted">{foundingEngineer.workbenchNote}</p>
          <div className="mt-6">
            <BuildLog />
          </div>
        </section>

        <section className="mt-16" id="case-studies" aria-labelledby="cases-heading">
          <h2 id="cases-heading" className="font-display text-2xl text-ink">
            Project evidence
          </h2>
          <p className="mt-3 max-w-measure leading-relaxed text-ink-muted">
            These notes follow the repositories and the product records already on this site. A live
            URL means the host answered. It does not mean every screen behind it is finished.
          </p>
          <div className="mt-6 space-y-4">
            {foundingCases.map((item) => (
              <details key={item.id} id={`case-${item.id}`} className="border border-rule p-4">
                <summary className="cursor-pointer font-display text-xl text-ink">
                  {item.title}
                  <span className="ml-3 font-mono text-xs uppercase tracking-label text-ink-faint">
                    {item.evidenceLabel}
                  </span>
                </summary>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {item.links.map((link) => (
                    <Outbound key={link.href} href={link.href}>
                      {link.label}
                    </Outbound>
                  ))}
                </p>
                <div className="mt-4 space-y-4">
                  {item.sections.map((section) => (
                    <div key={section.heading}>
                      <h3 className="font-display text-lg text-ink">{section.heading}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{section.body}</p>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="decisions-heading">
          <h2 id="decisions-heading" className="font-display text-2xl text-ink">
            Architecture decision log
          </h2>
          <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">
            Records marked “from the code” use the repositories above. Records marked “illustrative”
            are the same kind of choice, with the project only as context.
          </p>
          <div className="mt-6">
            <DecisionLog />
          </div>
        </section>

        <section className="mt-16" aria-labelledby="timeline-heading">
          <h2 id="timeline-heading" className="font-display text-2xl text-ink">
            Reference engineering timeline
          </h2>
          <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">
            A workflow I use as a checklist. It is not a claim that any project followed these dates.
          </p>
          <div className="mt-6">
            <EngineeringTimeline />
          </div>
        </section>

        <section className="mt-16" aria-labelledby="production-heading">
          <h2 id="production-heading" className="font-display text-2xl text-ink">
            After deployment
          </h2>
          <div className="mt-3 max-w-measure space-y-3 text-sm leading-relaxed text-ink-muted">
            <p>
              A successful build means the project compiled. A successful deployment means the new
              artifact is the one serving traffic. A healthy application means the critical read and
              write still succeed, migrations match the code, and failures show up somewhere other
              than a user&apos;s message.
            </p>
            <p>
              Ownership after that point is environment configuration, failed builds, failed
              releases, API errors, migrations, authentication, background jobs, logs, error
              reports, slow paths, rollback, and dependency upgrades. I do not have a public
              incident log with timings or uptime, so the walkthrough below is fictional.
            </p>
            <p>
              Real anchors, without invented outages: SpiderWeb&apos;s API refuses to start when the
              schema is behind. AGENYRA&apos;s waitlist says it is temporarily unavailable when
              Supabase is not configured. RevenueRoles has recorded production deploys of discovery
              and the jobs API, and several signed-in screens are still not verified in production.
            </p>
          </div>
          <div className="mt-6">
            <IncidentWalkthrough />
          </div>
        </section>

        <section className="mt-16" aria-labelledby="constraints-heading">
          <h2 id="constraints-heading" className="font-display text-2xl text-ink">
            Engineering under constraints
          </h2>
          <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">
            A fictional early product, one engineer, limited budget and on-call time. Neither option
            is universally right. The useful part is the condition that would make you switch.
          </p>
          <div className="mt-6">
            <ConstraintSimulator />
          </div>
        </section>

        <section className="mt-16" aria-labelledby="testing-heading">
          <h2 id="testing-heading" className="font-display text-2xl text-ink">
            Quality and testing
          </h2>
          <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">
            Choose tests from the failure that would hurt. This site&apos;s own checks are Vitest,
            Testing Library, and Playwright. Those runs are not reprinted here as a badge.
          </p>
          <div className="mt-6">
            <TestingPanel />
          </div>
        </section>

        <section className="mt-16" aria-labelledby="ai-heading">
          <h2 id="ai-heading" className="font-display text-2xl text-ink">
            Where AI belongs in the product
          </h2>
          <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">{aiEngineering.body}</p>
          <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">{aiEngineering.limits}</p>
          <ul className="mt-4 max-w-measure list-disc pl-5 text-sm leading-relaxed text-ink-muted">
            {aiEngineering.duties.map((duty) => (
              <li key={duty}>{duty}</li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="stack-heading">
          <h2 id="stack-heading" className="font-display text-2xl text-ink">
            Full-stack map
          </h2>
          <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">
            Each map is a shape I can point at, except the BUILDLOG sketch, which is labeled
            synthetic. A box on the sketch is not a claim that I deployed it.
          </p>
          <div className="mt-6">
            <StackMap />
          </div>
        </section>

        <section className="mt-16" aria-labelledby="loop-heading">
          <h2 id="loop-heading" className="font-display text-2xl text-ink">
            Product decisions and engineering decisions
          </h2>
          <ol className="mt-4 flex flex-wrap gap-2 text-sm">
            {feedbackLoop.steps.map((step, index) => (
              <li key={step} className="border border-rule px-2 py-1 text-ink">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 max-w-measure text-sm leading-relaxed text-ink-muted">{feedbackLoop.body}</p>
        </section>

        <section className="mt-16" aria-labelledby="principles-heading">
          <h2 id="principles-heading" className="font-display text-2xl text-ink">
            Working principles
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {foundingPrinciples.map((item) => (
              <li key={item.title} className="border-t border-rule pt-3">
                <h3 className="font-display text-lg text-ink">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="next-heading">
          <h2 id="next-heading" className="font-display text-2xl text-ink">
            The next build
          </h2>
          <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">
            A sequence for the next milestone on a product. Not a personal career plan.
          </p>
          <ol className="mt-4 max-w-measure list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            {nextBuildSteps.map((item) => (
              <li key={item.step}>
                <span className="text-ink">{item.step}.</span> {item.detail}
              </li>
            ))}
          </ol>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {foundingArtifacts.map((item) => (
              <li key={item.href}>
                <Outbound href={item.href}>{item.label}</Outbound>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  );
}
