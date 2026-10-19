/**
 * `/pow/revops-engineering`: revenue operations engineering proof of work.
 *
 * The page states the operating problem, then hands the visitor the REVFLOW
 * workbench. REVFLOW is a local simulation. The Revenue Intelligence Engine
 * section only repeats what its repository and live shell show.
 *
 * Connects to:
 * - Routed in src/App.tsx as `pow/revops-engineering`.
 * - src/components/pow/revops/RevopsWorkbench.tsx and src/components/pow/PowNav.tsx.
 * - Content in src/content/revopsPow.ts. Markdown twin via `renderRevopsBody`.
 */
import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import { PowNav } from "../components/pow/PowNav";
import RevopsWorkbench from "../components/pow/revops/RevopsWorkbench";
import {
  REVOPS_DESCRIPTION,
  REVOPS_PATH,
  REVOPS_TITLE,
  revopsBreaks,
  revopsCaseStudy,
  revopsContracts,
  revopsDecisions,
  revopsHero,
  revopsNodes,
  revopsNode,
  revopsRoadmap,
} from "../content/revopsPow";
import { getProductBySlug, getProjectBySlug, pageUpdatedAt, person } from "../content";
import { runRevopsChecks } from "../lib/revops/checks";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

/** External link that opens in a new tab. */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
      {children}
    </a>
  );
}

/** Numbered section used by the narrative half of the page. */
function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-16 scroll-mt-28 border-t border-rule pt-10">
      <h2 id={`${id}-title`} className="font-display text-2xl text-ink md:text-[1.75rem]">
        <span className="mr-3 font-mono text-sm font-normal text-ink-faint">{number}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Passed or failed label for one simulation check. */
export function CheckMark({ passed }: { passed: boolean }) {
  return <span className="font-mono text-xs text-ink-faint">{passed ? "Passed" : "Failed"}</span>;
}
export default function RevopsPowPage() {
  const [nodeId, setNodeId] = useState(revopsNodes[0].id);
  const node = revopsNode(nodeId);
  const checks = runRevopsChecks();
  const revenueRoles = getProductBySlug("revenueroles");
  const engine = getProjectBySlug("revenue-intelligence-engine");
  const spider = getProjectBySlug("spiderweb");
  const agenyra = getProductBySlug("agenyra");
  const engineGithub = engine?.links?.github;
  const spiderGithub = spider?.links?.github;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl(REVOPS_PATH)}#webpage`,
    url: canonicalUrl(REVOPS_PATH),
    name: REVOPS_TITLE,
    description: REVOPS_DESCRIPTION,
    dateModified: pageUpdatedAt("pow"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO title={REVOPS_TITLE} description={REVOPS_DESCRIPTION} path={REVOPS_PATH} jsonLd={jsonLd} />
      <article className="site-shell page-section">
        <p className="label">{revopsHero.eyebrow}</p>
        <h1 className="mt-3 max-w-measure font-display text-3xl text-ink sm:text-4xl md:text-[2.75rem]">
          {revopsHero.headline}
        </h1>
        <p className="mt-4 max-w-measure text-lg text-ink-muted">{revopsHero.support}</p>
        <p className="mt-4 max-w-measure text-ink">{revopsHero.positioning}</p>
        <p className="mt-3 max-w-measure text-ink-muted">{revopsHero.supporting}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#workbench" className="btn-primary">
            Explore the revenue workbench
          </a>
          <a href="#architecture" className="btn-secondary">
            Inspect the system architecture
          </a>
        </div>
        <p className="mt-6 text-sm text-ink-muted">
          <ExternalLink href={person.primaryProfiles.github}>GitHub</ExternalLink>
          {" · "}
          <ExternalLink href={person.primaryProfiles.linkedin}>LinkedIn</ExternalLink>
          {" · "}
          <Link to="/" className="link-underline">
            Personal site
          </Link>
          {" · "}
          <ExternalLink href="https://revenueroles.in">RevenueRoles</ExternalLink>
          {" · "}
          <ExternalLink href={revopsCaseStudy.demo}>Revenue Intelligence Engine</ExternalLink>
        </p>
        <div className="mt-8">
          <PowNav />
        </div>

        <Section id="thesis" number="B" title="Revenue operations is a systems problem.">
          <p className="max-w-measure text-ink-muted">
            A revenue workflow fails in the handoff between records, not only in the conversation. The job of this engineering is to make that handoff observable, consistent, and recoverable. A new tool does not, by itself, produce revenue.
          </p>
          <ul className="mt-4 max-w-measure space-y-2 text-ink-muted">
            {revopsBreaks.map((line) => (
              <li key={line} className="-indent-4 pl-4">
                <span aria-hidden="true">– </span>
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-measure text-ink-muted">
            Data quality changes what a workflow is allowed to do. Workflow reliability changes whether the activity exists once. Revenue visibility is the recount of those rows, not a second set of numbers.
          </p>
        </Section>

        <Section id="workbench" number="C" title={`${revopsHero.projectName} — ${revopsHero.projectLine}`}>
          <p className="max-w-measure text-ink-muted">{revopsHero.nameNote}</p>
          <p className="mt-3 max-w-measure text-sm text-ink-faint">
            Synthetic data. Simulated enrichment and CRM. Proposed production controls are labeled below and are not running.
          </p>
          <div className="mt-8">
            <RevopsWorkbench />
          </div>
        </Section>

        <Section id="ingestion" number="D" title="Data ingestion and normalization">
          <p className="max-w-measure text-ink-muted">
            The fixture mixes website demo requests, CSV imports, event registrations, product signups, referrals, and a stale enrichment file. Each row keeps its source and its raw field names. <span className="font-mono text-xs">company</span> and <span className="font-mono text-xs">organization_name</span> become account name. <span className="font-mono text-xs">email_address</span> and <span className="font-mono text-xs">work_email</span> become email. <span className="font-mono text-xs">job_role</span> and <span className="font-mono text-xs">title</span> become job title. Whitespace and domains are normalized. An email is checked for shape only. That is not a deliverability check, and a failed row stays in the table with its issues.
          </p>
        </Section>

        <Section id="dedupe" number="E" title="Deduplication and entity resolution">
          <p className="max-w-measure text-ink-muted">
            Contact deduplication and account resolution are different decisions. An exact email can be merged after a click. The same domain with two people is an account match and the merge control stays disabled. Similar company names on different domains stay apart. Shared inboxes are flagged. The match number is a heuristic total of those rules, not a probability. A merge records which field was kept, which was dropped, and which source it came from.
          </p>
        </Section>

        <Section id="enrichment" number="F" title="Enrichment and data freshness">
          <p className="max-w-measure text-ink-muted">
            Enrichment on this page reads a local fixture. Each proposal shows the current value, the fixture value, the source, the timestamp, a reliability label, freshness, and whether the two values conflict. A stale fixture does not overwrite a newer inbound value unless you accept it. Failed, rate-limited, and missing providers return a review row and no invented company facts. A production adapter would also need a contract, permission, a cache, a cost limit, and provenance. None of those calls run here.
          </p>
        </Section>

        <Section id="scoring" number="G" title="Lead qualification and scoring">
          <p className="max-w-measure text-ink-muted">
            Fit, intent, engagement, and data confidence are four numbers. Missing fields lower confidence. They are not filled in. The band is an illustrative reading of the first three, and it is labeled low confidence when confidence is under 60. Changing the industry or size weight changes fit immediately. The score is a way to order review. It is not evidence that a prospect will buy.
          </p>
        </Section>

        <Section id="routing" number="H" title="Routing engine">
          <p className="max-w-measure text-ink-muted">
            Rules run in order: validation, existing owner, industry specialization, company size, territory, then confidence. Every rule is listed as matched or not, and only one is applied. An unavailable owner becomes a review, with no substitute. A country outside the demo territories stays unassigned. The representatives are fictional.
          </p>
        </Section>

        <Section id="crm" number="I" title="CRM synchronization">
          <p className="max-w-measure text-ink-muted">
            The adapter is an interface in the browser. It maps the canonical row onto a local account, chooses create or update from the domain and email, and writes only after the confirmation checkbox. A second write of the same prospect is rejected by the idempotency key. A lifecycle that would move backward is a conflict. A partial write names the field that failed. Rate limits defer twice and then stop. Nothing is sent to a CRM vendor.
          </p>
        </Section>

        <Section id="workflow" number="J" title="Workflow automation">
          <p className="max-w-measure text-ink-muted">
            Run workflow walks one selected row: validate, normalize, resolve, qualify, assign, preview, apply, create one follow-up, record the activity, and verify the stored row. Missing required fields fail the run. A shared inbox, low confidence, or an unassigned owner waits. An unconfirmed write waits. A failed or partial write skips the task. A second run does not create a second task. The step list is the result of that function, not a drawing.
          </p>
        </Section>

        <Section id="failures" number="K" title="Workflow reliability and failure lab">
          <p className="max-w-measure text-ink-muted">
            The eight scenarios are deterministic: a duplicate delivery, a CRM rate limit, two routing rules that disagree, a row with required fields missing, a stale enrichment value, a partial CRM update, a retried follow-up task, and a dashboard total that does not match the recount. Each one prints the steps it actually ran.
          </p>
        </Section>

        <Section id="analytics" number="L" title="Revenue analytics">
          <p className="max-w-measure text-ink-muted">
            Every figure in the workbench is counted from the current synthetic rows, the merges, the workflow runs, and the simulated writes. The definition sits under the number. Selecting a metric filters the table to the rows in that denominator. There is no customer revenue, no conversion lift, and no sales performance in these counts.
          </p>
        </Section>

        <Section id="funnel" number="M" title="Funnel and attribution">
          <p className="max-w-measure text-ink-muted">
            Lifecycle names are configured for this demo: inquiry, lead, marketing-qualified, sales-qualified, opportunity, closed won, and closed lost. Another company would configure different names. The source table is first-touch association because each fixture row has one source. Last-touch, multi-touch, campaign credit, pipeline source, and revenue influence are different questions, and none of them is a cause. Rows with no source would be counted as unresolved rather than assigned to a channel. There is no acquisition cost and no return on ad spend.
          </p>
        </Section>

        <Section id="architecture" number="N" title="GTM system architecture">
          <p className="max-w-measure text-ink-muted">
            Ingestion and enrichment can be asynchronous. Validation, identity, qualification, and routing should finish before a write is offered. The CRM is a system of record for the fields it owns, not for every upstream fact. Provenance stays with the source that produced the value.
          </p>
          <div className="mt-4 flex flex-wrap gap-2" role="list">
            {revopsNodes.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === node.id}
                onClick={() => setNodeId(item.id)}
                className={item.id === node.id ? "btn-primary" : "btn-secondary"}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="mt-4 border border-rule p-4 text-sm">
            <p className="text-ink">{node.name}</p>
            <p className="mt-2 text-ink-muted">{node.timing}. {node.responsibility}</p>
            <p className="mt-2 text-ink-muted">Inputs: {node.inputs}</p>
            <p className="mt-2 text-ink-muted">Outputs: {node.outputs}</p>
            <p className="mt-2 text-ink-muted">Failure mode: {node.failure}</p>
          </div>
          <p className="mt-4 max-w-measure text-sm text-ink-muted">
            An event-driven design helps when a form or a webhook should start work immediately, and only if each event has an idempotency key. A nightly file drop can use the same canonical model on a schedule.
          </p>
        </Section>

        <Section id="contracts" number="O" title="Data model and system contracts">
          <p className="max-w-measure text-ink-muted">
            These are illustrative contracts for the frontend phase. A stable id, an external id, field provenance, timestamps, a schema version, and an idempotency key are the parts a later service would have to keep. This page does not claim that service exists.
          </p>
          <div className="mt-4 space-y-4">
            {revopsContracts.map((contract) => (
              <figure key={contract.name}>
                <figcaption className="label">{contract.name}</figcaption>
                <pre className="mt-2 overflow-x-auto border border-rule p-4 font-mono text-xs text-ink">{contract.body}</pre>
              </figure>
            ))}
          </div>
        </Section>

        <Section id="decisions" number="P" title="Engineering decisions">
          <div className="space-y-3">
            {revopsDecisions.map((decision) => (
              <details key={decision.id} className="border border-rule p-4">
                <summary className="cursor-pointer text-ink">{decision.title}</summary>
                <p className="mt-3 text-sm text-ink-muted">{decision.problem}</p>
                <p className="mt-2 text-sm text-ink-muted">Alternatives: {decision.alternatives}</p>
                <p className="mt-2 text-sm text-ink-muted">Demo: {decision.demo}</p>
                <p className="mt-2 text-sm text-ink-muted">Trade-off: {decision.tradeoff}</p>
                <p className="mt-2 text-sm text-ink-muted">What would change it: {decision.change}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section id="testing" number="Q" title="Testing and observability">
          <p className="max-w-measure text-ink-muted">
            The list below is the result of running the simulation checks in this page load. A production system would also watch stale rows, a jump in the duplicate rate, routing exceptions, and a metric that no longer matches its recount.
          </p>
          <ul className="mt-4 space-y-2">
            {checks.map((check) => (
              <li key={check.id} className="border border-rule px-3 py-2 text-sm">
                <CheckMark passed={check.passed} />
                <span className="mt-1 block text-ink">{check.name}</span>
                <span className="mt-1 block text-ink-muted">{check.detail}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="governance" number="R" title="Security, privacy, and governance">
          <p className="max-w-measure text-ink-muted">
            A production version would need least-privilege CRM access, separate credentials, an audit trail, a retention limit, a tenant boundary, provider terms, and a record of consent before any message. High-impact writes would wait for approval. This page does none of that: it is a frontend simulation, it stores nothing on a server, and it sends no email.
          </p>
        </Section>

        <Section id="case-study" number="S" title="Primary case study: Revenue Intelligence Engine">
          <p className="max-w-measure text-ink-muted">{revopsCaseStudy.problem}</p>
          <p className="mt-3 max-w-measure text-ink-muted">{revopsCaseStudy.flow}</p>
          <p className="mt-3 max-w-measure text-ink-muted">{revopsCaseStudy.architecture}</p>
          <p className="mt-3 max-w-measure text-ink-muted">{revopsCaseStudy.presentation}</p>
          <p className="mt-3 max-w-measure text-ink-muted">{revopsCaseStudy.synthetic}</p>
          <p className="mt-3 max-w-measure text-ink-muted">{revopsCaseStudy.complete}</p>
          <p className="mt-3 max-w-measure text-ink-muted">{revopsCaseStudy.missing}</p>
          <p className="mt-3 max-w-measure text-ink-muted">{revopsCaseStudy.next}</p>
          <p className="mt-3 max-w-measure text-ink-muted">{revopsCaseStudy.checked}</p>
          <p className="mt-4 text-sm">
            <ExternalLink href={revopsCaseStudy.demo}>Open revopy.vercel.app</ExternalLink>
            {" · "}
            <ExternalLink href={revopsCaseStudy.recordedDemo}>Demo URL on the project record</ExternalLink>
            {engineGithub ? (
              <>
                {" · "}
                <ExternalLink href={engineGithub}>Repository</ExternalLink>
              </>
            ) : null}
          </p>
        </Section>

        <Section id="related" number="T" title="Related projects">
          <ul className="max-w-measure space-y-4 text-ink-muted">
            <li>
              <Link to="/products/revenueroles" className="link-underline text-ink">RevenueRoles</Link>
              {" "}
              {revenueRoles!.summary} It is relevant here as ingestion, normalization, and conservative deduplication of job postings. It is not a CRM.
            </li>
            <li>
              <Link to="/projects" className="link-underline text-ink">Revenue Intelligence Engine</Link>
              {" "}
              {engine!.summary}
            </li>
            <li>
              <Link to="/products/agenyra" className="link-underline text-ink">AGENYRA</Link>
              {" "}
              {agenyra!.summary} It is not a revenue-operations platform. The public site is a waitlist and an explanation.
            </li>
            <li>
              {spiderGithub ? (
                <ExternalLink href={spiderGithub}>SpiderWeb</ExternalLink>
              ) : (
                <span className="text-ink">SpiderWeb</span>
              )}
              {" "}
              {spider!.summary} The relevant piece is local entity resolution, not a pipeline CRM.
            </li>
          </ul>
        </Section>

        <Section id="roadmap" number="U" title="Roadmap">
          <ol className="space-y-2 text-sm">
            {revopsRoadmap.map((phase) => (
              <li key={phase.phase} className="border-t border-rule py-2">
                <span className="text-ink">{phase.phase}. {phase.title}</span>
                <span className="mt-1 block font-mono text-xs text-ink-faint">{phase.status}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="close" number="V" title="Closing">
          <p className="max-w-measure text-ink">
            I build the infrastructure that helps revenue teams turn fragmented signals into reliable operational decisions.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><ExternalLink href={person.primaryProfiles.github}>GitHub</ExternalLink></li>
            <li><ExternalLink href={person.primaryProfiles.linkedin}>LinkedIn</ExternalLink></li>
            <li><Link to="/" className="link-underline">Personal website</Link></li>
            <li><ExternalLink href="https://revenueroles.in">RevenueRoles</ExternalLink></li>
            <li><ExternalLink href={revopsCaseStudy.demo}>Revenue Intelligence Engine</ExternalLink></li>
            <li><Link to="/pow/fde" className="link-underline">Forward deployed engineering</Link></li>
            <li><Link to="/pow/product-management" className="link-underline">Product management</Link></li>
            <li><Link to="/pow/ai-benchmark" className="link-underline">Benchmark engineering</Link></li>
            <li><Link to="/pow/agentic-ai" className="link-underline">Agentic AI engineering</Link></li>
          </ul>
        </Section>
      </article>
    </>
  );
}
