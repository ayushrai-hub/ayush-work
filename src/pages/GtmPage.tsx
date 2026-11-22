/**
 * `/gtm`: flagship GTM engineering & revenue systems showcase.
 *
 * Renders `gtmPortfolio` top to bottom: positioning, the skill stack, a concise GTM systems
 * index, agentic depth, vision for precision GTM and autonomous
 * revenue systems, structured capability and technical skills tables, a Loom/YouTube walkthrough
 * embed (VideoEmbed), the evidence key, seven real GTM and revenue systems resolved from
 * products.ts and projects.ts with problem/solution/architecture/verifiable metrics/visual
 * galleries and architecture diagrams, autonomous agent workflows, the GTM infrastructure layer
 * map, current study topics, engineering lessons learned, reading resources, next builds, and
 * ContactCta. Emits WebPage JSON-LD.
 *
 * Connects to:
 * - Routed in src/App.tsx as `gtm`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 * - Content from src/content (`gtmPortfolio`, `gtmProofs`, `gtmEvidenceLabels`,
 *   `gtmSkillLevelLabels`, `gtmReadingProgress`, `getRecordVisuals`, `formatUpdated`,
 *   `pageUpdatedAt("gtm")`, `person`) and src/lib/canonical.ts;
 *   components PageSEO, PageHeader, SectionHeading, MediaGallery, VideoEmbed, ContactCta.
 * - Markdown twin `/gtm.md` built from `renderGtmBody` in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import ContactCta from "../components/site/ContactCta";
import PageHeader from "../components/editorial/PageHeader";
import SectionHeading from "../components/editorial/SectionHeading";
import MediaGallery from "../components/editorial/MediaGallery";
import VideoEmbed from "../components/editorial/VideoEmbed";
import {
  formatUpdated,
  getRecordVisuals,
  gtmEvidenceLabels,
  gtmPortfolio,
  gtmProofs,
  gtmReadingProgress,
  gtmSkillLevelLabels,
  pageUpdatedAt,
  person,
} from "../content";
import type { GtmEvidence, GtmSkillLevel } from "../content";
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

/** Small bordered label for a toolkit or capability status level. */
function SkillLevelBadge({ level }: { level: GtmSkillLevel }) {
  return (
    <span className="inline-block border border-rule px-2 py-0.5 font-mono text-xs text-ink-faint">
      {gtmSkillLevelLabels[level]}
    </span>
  );
}

/** GTM portfolio page. Lazy-loaded by the `gtm` route in src/App.tsx. */
export default function GtmPage() {
  const {
    vision,
    skillStack,
    agentMotions,
    capabilityMatrix,
    agentWorkflows,
    walkthrough,
    layers,
    toolkit,
    studying,
    lessonsLearned,
    resources,
    nextBuilds,
  } = gtmPortfolio;
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
          label="AI Engineer × Revenue × GTM"
          title="GTM engineering"
          dek={gtmPortfolio.positioning}
          updated={pageUpdatedAt("gtm")}
        />

        <nav
          className="mt-8 flex flex-wrap gap-2 border-y border-rule py-3 text-sm"
          aria-label="GTM page sections"
        >
          <a href="#gtm-skill-stack" className="px-2 py-1 text-ink-muted hover:text-ink">
            Skill stack
          </a>
          <a href="#gtm-system-index" className="px-2 py-1 text-ink-muted hover:text-ink">
            GTM systems
          </a>
          <a href="#gtm-motions" className="px-2 py-1 text-ink-muted hover:text-ink">
            Agentic depth
          </a>
          <a href="#gtm-vision" className="px-2 py-1 text-ink-muted hover:text-ink">
            Vision
          </a>
          <a href="#gtm-capabilities" className="px-2 py-1 text-ink-muted hover:text-ink">
            Capabilities table
          </a>
          <a href="#gtm-systems" className="px-2 py-1 text-ink-muted hover:text-ink">
            7 GTM systems ({proofs.length})
          </a>
          <a href="#gtm-agents" className="px-2 py-1 text-ink-muted hover:text-ink">
            Autonomous agents
          </a>
          <a href="#gtm-layers" className="px-2 py-1 text-ink-muted hover:text-ink">
            Infrastructure layers
          </a>
          <a href="#gtm-toolkit" className="px-2 py-1 text-ink-muted hover:text-ink">
            Technical stack table
          </a>
          <a href="#gtm-lessons" className="px-2 py-1 text-ink-muted hover:text-ink">
            Lessons &amp; research
          </a>
        </nav>

        <section id="gtm-skill-stack" className="mt-14 scroll-mt-24">
          <SectionHeading number="01" title="Skill stack" />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            Eight domains. The systems table is the work you can open.
          </p>
          <div className="overflow-x-auto border border-rule">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper-elevated">
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Domain
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Scope
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Tools
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {skillStack.map((row) => (
                  <tr key={row.domain} className="align-top">
                    <th scope="row" className="px-4 py-3.5 font-medium text-ink">
                      {row.domain}
                    </th>
                    <td className="px-4 py-3.5 text-ink-muted">{row.scope}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-ink-muted">{row.tools}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="gtm-system-index" className="mt-16 scroll-mt-24">
          <SectionHeading number="02" title="GTM systems" />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            The GTM and revenue systems, one line each, with the place to open them.
          </p>
          <div className="overflow-x-auto border border-rule">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper-elevated">
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    System
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    What it does
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Stage
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Links
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {proofs.map((proof) => (
                  <tr key={proof.slug} className="align-top">
                    <th scope="row" className="px-4 py-3.5 font-medium text-ink">
                      <a href={`#gtm-${proof.slug}`} className="link-underline">
                        {proof.title}
                      </a>
                    </th>
                    <td className="px-4 py-3.5 text-ink-muted">{proof.blurb}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <EvidenceBadge evidence={proof.evidence} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex flex-wrap gap-x-3 gap-y-1">
                        <Link to={proof.href} className="link-underline">
                          On this site
                        </Link>
                        {proof.githubUrl && (
                          <ExternalLink href={proof.githubUrl}>GitHub</ExternalLink>
                        )}
                        {proof.demoUrl && <ExternalLink href={proof.demoUrl}>Live</ExternalLink>}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="gtm-motions" className="mt-16 scroll-mt-24">
          <SectionHeading number="03" title="Agentic depth" />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            What runs on its own, and the control that stays in code.
          </p>
          <div className="overflow-x-auto border border-rule">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper-elevated">
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Motion
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Autonomous step
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Control
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    System
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {agentMotions.map((row) => (
                  <tr key={row.motion} className="align-top">
                    <th scope="row" className="px-4 py-3.5 font-medium text-ink">
                      {row.motion}
                    </th>
                    <td className="px-4 py-3.5 text-ink-muted">{row.autonomous}</td>
                    <td className="px-4 py-3.5 text-ink-muted">{row.control}</td>
                    <td className="px-4 py-3.5">
                      {row.href.startsWith("http") ? (
                        <ExternalLink href={row.href}>{row.system}</ExternalLink>
                      ) : (
                        <Link to={row.href} className="link-underline">
                          {row.system}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="gtm-vision" className="mt-14 scroll-mt-24">
          <SectionHeading number="04" title={vision.headline} />
          <div className="max-w-measure space-y-4 text-ink-muted leading-relaxed">
            {vision.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {vision.pillars.map((pillar, idx) => (
              <div key={pillar.title} className="border border-rule bg-paper-elevated p-5">
                <p className="font-mono text-xs text-ink-faint">
                  0{idx + 1} · Architectural pillar
                </p>
                <h3 className="mt-2 font-display text-lg text-ink">{pillar.title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{pillar.statement}</p>
                <p className="mt-3 border-t border-rule pt-2.5 font-mono text-xs text-ink-faint">
                  {pillar.implementationDetail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="gtm-capabilities" className="mt-16 scroll-mt-24">
          <SectionHeading number="05" title="GTM engineering capabilities" />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            Structured view of my GTM engineering scope across discovery, entity resolution,
            field-level provenance, deterministic 100-point scoring, enrichment waterfalls, bounded
            agents, and CRM governance.
          </p>
          <div className="overflow-x-auto border border-rule">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper-elevated">
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Capability domain
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Engineering focus
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Tools &amp; stack
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Repository proof
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {capabilityMatrix.map((row) => (
                  <tr key={row.domain} className="align-top">
                    <th scope="row" className="px-4 py-3.5 font-medium text-ink">
                      {row.domain}
                    </th>
                    <td className="px-4 py-3.5 text-ink-muted">{row.engineeringFocus}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-ink-muted">
                      {row.toolsAndStack}
                    </td>
                    <td className="px-4 py-3.5 text-ink-muted">{row.proofInRepo}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <SkillLevelBadge level={row.evidenceStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="gtm-walkthrough">
          <h2 id="gtm-walkthrough" className="font-display text-2xl text-ink">
            Walkthrough video
          </h2>
          <VideoEmbed
            url={walkthrough.loomUrl}
            title="GTM engineering walkthrough on Loom"
            plannedTopics={walkthrough.plannedTopics}
            slot="gtm-engineering-walkthrough"
          />
        </section>

        <section className="mt-16">
          <SectionHeading number="06" title="How to read the evidence" />
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

        <section id="gtm-systems" className="mt-16 scroll-mt-24">
          <SectionHeading number="07" title="Product and projects" />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            Seven real GTM, revenue-data, and relationship-intelligence systems from public GitHub
            repositories, with their problem, solution, architecture, verifiable repository
            metrics, visual artifacts, and explicit limits.
          </p>
          <ol className="space-y-12">
            {proofs.map((proof, index) => {
              const visuals = getRecordVisuals(proof.slug);
              return (
                <li
                  key={proof.slug}
                  id={`gtm-${proof.slug}`}
                  className="scroll-mt-24 border-t border-rule pt-8"
                >
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-mono text-xs text-ink-faint">
                      0{index + 1}
                    </span>
                    <h3 className="font-display text-2xl text-ink">{proof.title}</h3>
                    <EvidenceBadge evidence={proof.evidence} />
                    <span className="label">
                      {proof.kind === "product" ? "Product I am building" : "Project"}
                    </span>
                  </div>
                  <p className="mt-3 max-w-measure text-ink-muted leading-relaxed">
                    {proof.summary}
                  </p>
                  <p className="mt-3 font-mono text-xs text-ink-faint">
                    {proof.stack.join(" · ")}
                  </p>

                  {(proof.problem || proof.solution || proof.architectureNote) && (
                    <div className="mt-6 grid gap-4 border border-rule bg-paper-elevated p-5 md:grid-cols-3">
                      {proof.problem && (
                        <div>
                          <h4 className="label mb-1.5">Problem</h4>
                          <p className="text-sm text-ink-muted leading-relaxed">{proof.problem}</p>
                        </div>
                      )}
                      {proof.solution && (
                        <div>
                          <h4 className="label mb-1.5">Solution</h4>
                          <p className="text-sm text-ink-muted leading-relaxed">{proof.solution}</p>
                        </div>
                      )}
                      {proof.architectureNote && (
                        <div>
                          <h4 className="label mb-1.5">Architecture</h4>
                          <p className="text-sm text-ink-muted leading-relaxed">
                            {proof.architectureNote}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {proof.verifiableMetrics && proof.verifiableMetrics.length > 0 && (
                    <div className="mt-5 max-w-measure">
                      <h4 className="label mb-2">Verifiable repository proof &amp; scale</h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
                        {proof.verifiableMetrics.map((metric) => (
                          <li key={metric}>{metric}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 grid max-w-4xl gap-6 sm:grid-cols-2">
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

                  {visuals && (visuals.diagram || visuals.gallery.length > 0) && (
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                      {visuals.gallery.length > 0 && (
                        <MediaGallery
                          items={visuals.gallery}
                          heading="Interface & workflow artifacts"
                          ariaLabel={`${proof.title} screens`}
                        />
                      )}
                      {visuals.diagram && (
                        <div>
                          <h4 className="label mb-3">Pipeline flow</h4>
                          <pre className="overflow-x-auto border border-rule bg-paper-elevated p-4 font-mono text-xs leading-relaxed text-ink">
                            {visuals.diagram}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  <nav
                    className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm"
                    aria-label={`${proof.title} links`}
                  >
                    {proof.demoUrl && <ExternalLink href={proof.demoUrl}>Live</ExternalLink>}
                    {proof.githubUrl && <ExternalLink href={proof.githubUrl}>GitHub</ExternalLink>}
                    <Link to={proof.href} className="link-underline">
                      {proof.kind === "product" ? "Product page" : "Case study"}
                    </Link>
                  </nav>
                </li>
              );
            })}
          </ol>
        </section>

        <section id="gtm-agents" className="mt-16 scroll-mt-24">
          <SectionHeading
            number="08"
            title="Autonomous agents and AI-driven revenue workflows"
            link={{ to: "/pow/agentic-ai", label: "Open ORBIT agent workbench" }}
          />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            How I structure AI agents for revenue work: every agent has a bounded model task, a
            deterministic code guardrail that validates schemas and scores, and a human approval
            gate before any external write.
          </p>
          <div className="overflow-x-auto border border-rule">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper-elevated">
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Agent / workflow
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Model role
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Deterministic guardrail
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Human approval gate
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Implementation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {agentWorkflows.map((wf) => (
                  <tr key={wf.name} className="align-top">
                    <th scope="row" className="px-4 py-3.5 font-medium text-ink">
                      {wf.name}
                    </th>
                    <td className="px-4 py-3.5 text-ink-muted">{wf.roleOfModel}</td>
                    <td className="px-4 py-3.5 text-ink-muted">{wf.deterministicGuardrail}</td>
                    <td className="px-4 py-3.5 text-ink-muted">{wf.humanGate}</td>
                    <td className="px-4 py-3.5">
                      {wf.href.startsWith("http") ? (
                        <ExternalLink href={wf.href}>{wf.implementedIn}</ExternalLink>
                      ) : (
                        <Link to={wf.href} className="link-underline">
                          {wf.implementedIn}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link to="/pow/revops-engineering" className="link-accent">
              REVFLOW revenue operations workbench →
            </Link>
            <Link to="/pow/fde" className="link-accent">
              RELAY forward-deployed account workflow →
            </Link>
            <Link to="/gtm-revops" className="link-accent">
              GTM &amp; RevOps dossier →
            </Link>
          </p>
        </section>

        <section id="gtm-layers" className="mt-16 scroll-mt-24">
          <SectionHeading number="09" title="GTM infrastructure layers: built and missing" />
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

        <section id="gtm-toolkit" className="mt-16 scroll-mt-24">
          <SectionHeading number="10" title="What I already know" />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            Levels: {Object.values(gtmSkillLevelLabels).join(" · ")}. A tool counts as in public
            code only when a linked repository uses it.
          </p>
          <div className="overflow-x-auto border border-rule">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper-elevated">
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Tool / practice
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Evidence level
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Where it runs &amp; verification notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {toolkit.flatMap((group) =>
                  group.items.map((item, idx) => (
                    <tr key={`${group.heading}-${item.name}`} className="align-top">
                      <td className="px-4 py-3 font-mono text-xs text-ink-faint">
                        {idx === 0 ? group.heading : ""}
                      </td>
                      <th scope="row" className="px-4 py-3 font-medium text-ink">
                        {item.name}
                      </th>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SkillLevelBadge level={item.level} />
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{item.note}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="gtm-lessons" className="mt-16 scroll-mt-24">
          <SectionHeading number="11" title="Experiments and lessons learned" />
          <div className="grid gap-6 md:grid-cols-2">
            {lessonsLearned.map((lesson) => (
              <div key={lesson.title} className="border border-rule p-5">
                <h3 className="font-display text-lg text-ink">{lesson.title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{lesson.detail}</p>
                <p className="mt-3">
                  <a href={`#gtm-${lesson.sourceSlug}`} className="font-mono text-xs link-accent">
                    Source: {lesson.sourceSlug} ↑
                  </a>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading number="12" title="What I am studying now" />
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

        <section className="mt-16">
          <SectionHeading number="13" title="Resources I am using" />
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
                        <span className="ml-2 inline-block whitespace-nowrap text-xs text-ink-faint">
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

        <section className="mt-16">
          <SectionHeading number="14" title="What I will build next" />
          <ol className="max-w-measure list-decimal space-y-2 pl-5 text-ink-muted">
            {nextBuilds.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <ContactCta
          prompt={`Hiring for GTM engineering, RevOps engineering, or AI revenue systems? Use contact, resume, or Calendly. Email ${person.email}.`}
        />
      </article>
    </>
  );
}
