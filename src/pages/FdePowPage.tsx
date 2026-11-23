/**
 * `/pow/fde`: Forward Deployed Engineering portfolio page (GTM-style layout).
 *
 * Designed for quick evaluation by hiring managers and engineering teams: who I am,
 * technical skill stack table, FDE & soft skills table, scannable systems/projects table
 * with direct GitHub/Live/detail links, concise project breakdowns with explicit limits,
 * experience and education from src/content/, and a clear entry point to the separate
 * RELAY proof-of-work deep dive at `/pow/fde/relay`. Emits WebPage JSON-LD.
 *
 * Connects to:
 * - Routed in src/App.tsx as `pow/fde` (with `/fde` redirecting here); prerendered via STATIC_PAGES.
 * - Content from src/content (`fdePortfolio`, `fdeProofs`, `fdeEvidenceLabels`, `fdePow`,
 *   `FDE_RELAY_PATH`, `experience`, `education`, `pageUpdatedAt`, `person`).
 * - Markdown twin `/pow/fde.md` from `renderFdeBody` in src/lib/agent/markdown.ts.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import ContactCta from "../components/site/ContactCta";
import PageHeader from "../components/editorial/PageHeader";
import SectionHeading from "../components/editorial/SectionHeading";
import PowNav from "../components/pow/PowNav";
import {
  FDE_RELAY_PATH,
  education,
  experience,
  fdeEvidenceLabels,
  fdePortfolio,
  fdePow,
  fdeProofs,
  pageUpdatedAt,
  person,
} from "../content";
import type { FdeProofEvidence, FdeProofLink } from "../content";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

/** External link that opens in a new tab. */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
      {children}
    </a>
  );
}

/** Comma-separated proof links inside a table cell (external GitHub links or internal routes). */
function ProofLinks({ items }: { items: FdeProofLink[] }) {
  return (
    <>
      {items.map((item, idx) => (
        <span key={`${item.label}-${idx}`}>
          {idx > 0 && ", "}
          {item.href ? (
            item.href.startsWith("http") ? (
              <ExternalLink href={item.href}>{item.label}</ExternalLink>
            ) : (
              <Link to={item.href} className="link-underline">
                {item.label}
              </Link>
            )
          ) : (
            item.label
          )}
        </span>
      ))}
    </>
  );
}

/** Small bordered label for a project's evidence status. */
function EvidenceBadge({ evidence }: { evidence: FdeProofEvidence }) {
  return (
    <span className="inline-block border border-rule px-2 py-0.5 font-mono text-xs text-ink-muted">
      {fdeEvidenceLabels[evidence].label}
    </span>
  );
}

/** Forward deployed engineering portfolio page. Lazy-loaded by the `pow/fde` route. */
export default function FdePowPage() {
  const proofs = fdeProofs();
  const primaryDegree = education.filter((ed) => ed.slug === "lncts-btech-cse");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl(fdePortfolio.path)}#webpage`,
    url: canonicalUrl(fdePortfolio.path),
    name: fdePortfolio.title,
    description: fdePortfolio.description,
    dateModified: pageUpdatedAt("pow"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO
        title={fdePortfolio.title}
        description={fdePortfolio.description}
        path={fdePortfolio.path}
        jsonLd={jsonLd}
      />
      <article className="site-shell page-section">
        <PageHeader
          label={fdePortfolio.eyebrow}
          title={fdePortfolio.title}
          dek={fdePortfolio.positioning}
          updated={pageUpdatedAt("pow")}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={person.primaryProfiles.github}
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <Link to={FDE_RELAY_PATH} className="btn-secondary">
            Open RELAY proof of work
          </Link>
          <a
            href={person.primaryProfiles.linkedin}
            className="btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <Link to="/resume" className="btn-secondary">
            Resume
          </Link>
          <a href={`mailto:${person.email}`} className="btn-secondary">
            Email
          </a>
        </div>

        <nav
          className="mt-10 flex flex-wrap gap-2 border-y border-rule py-3 text-sm"
          aria-label="FDE page sections"
        >
          <a href="#fde-tech-skills" className="px-2 py-1 text-ink-muted hover:text-ink">
            Technical skills
          </a>
          <a href="#fde-soft-skills" className="px-2 py-1 text-ink-muted hover:text-ink">
            FDE &amp; soft skills
          </a>
          <a href="#fde-projects-table" className="px-2 py-1 text-ink-muted hover:text-ink">
            Projects ({proofs.length + 1})
          </a>
          <a href="#fde-project-details" className="px-2 py-1 text-ink-muted hover:text-ink">
            Project breakdown
          </a>
          <a href="#fde-experience" className="px-2 py-1 text-ink-muted hover:text-ink">
            Experience
          </a>
          <a href="#fde-relay" className="px-2 py-1 text-ink-muted hover:text-ink">
            RELAY deep dive
          </a>
        </nav>

        <section id="fde-tech-skills" className="mt-14 scroll-mt-24">
          <SectionHeading number="01" title="Technical skill stack" />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            Core engineering stack across AI applications, backend APIs, data stores, and verification.
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
                    Tools &amp; stack
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Proof
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {fdePortfolio.techSkills.map((row) => (
                  <tr key={row.domain} className="align-top">
                    <th scope="row" className="px-4 py-3.5 font-medium text-ink">
                      {row.domain}
                    </th>
                    <td className="px-4 py-3.5 text-ink-muted">{row.scope}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-ink-muted">{row.tools}</td>
                    <td className="px-4 py-3.5 text-ink-muted">
                      <ProofLinks items={row.proof} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="fde-soft-skills" className="mt-16 scroll-mt-24">
          <SectionHeading number="02" title="Forward deployed & soft skills" />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            How I work with ambiguous problems, operators, and imperfect customer systems.
          </p>
          <div className="overflow-x-auto border border-rule">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper-elevated">
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Capability
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    How I work in practice
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Where it shows up
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {fdePortfolio.softSkills.map((row) => (
                  <tr key={row.capability} className="align-top">
                    <th scope="row" className="px-4 py-3.5 font-medium text-ink">
                      {row.capability}
                    </th>
                    <td className="px-4 py-3.5 text-ink-muted">{row.practice}</td>
                    <td className="px-4 py-3.5 text-ink-muted">
                      <ProofLinks items={row.evidence} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="fde-projects-table" className="mt-16 scroll-mt-24">
          <SectionHeading number="03" title="Selected systems & projects" />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            One line per system with stack, honest status, and direct links to inspect the code or live build.
          </p>
          <div className="overflow-x-auto border border-rule">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper-elevated">
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    System
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    What it solves
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    Stack
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
                      <a href={`#fde-${proof.slug}`} className="link-underline">
                        {proof.title}
                      </a>
                    </th>
                    <td className="px-4 py-3.5 text-ink-muted">{proof.blurb}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-ink-muted">
                      {proof.stack.join(", ")}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <EvidenceBadge evidence={proof.evidence} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex flex-wrap gap-x-3 gap-y-1">
                        <Link to={proof.href} className="link-underline">
                          Details
                        </Link>
                        {proof.githubUrl && (
                          <ExternalLink href={proof.githubUrl}>GitHub</ExternalLink>
                        )}
                        {proof.demoUrl && <ExternalLink href={proof.demoUrl}>Live</ExternalLink>}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="align-top bg-paper-elevated/40">
                  <th scope="row" className="px-4 py-3.5 font-medium text-ink">
                    <Link to={FDE_RELAY_PATH} className="link-underline">
                      {fdePow.relayName}
                    </Link>
                  </th>
                  <td className="px-4 py-3.5 text-ink-muted">
                    Customer-operations intelligence blueprint: 10-stage workflow, simulated account
                    investigation, architecture boundaries, 8 trade-offs, 9 failure modes, and an
                    8-step deployment playbook.
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-ink-muted">
                    Architecture · Interactive preview
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <EvidenceBadge evidence="blueprint" />
                  </td>
                  <td className="px-4 py-3.5">
                    <Link to={FDE_RELAY_PATH} className="link-underline">
                      Open project
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(fdeEvidenceLabels) as FdeProofEvidence[]).map((key) => (
              <div key={key} className="border border-rule p-3">
                <dt>
                  <EvidenceBadge evidence={key} />
                </dt>
                <dd className="mt-2 text-xs leading-relaxed text-ink-muted">
                  {fdeEvidenceLabels[key].meaning}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="fde-project-details" className="mt-16 scroll-mt-24">
          <SectionHeading number="04" title="Project breakdown" />
          <p className="mb-6 max-w-measure text-sm text-ink-muted">
            What each system demonstrates for forward deployed work, alongside its explicit limits.
          </p>
          <ol className="divide-y divide-rule border-y border-rule">
            {proofs.map((proof, index) => (
              <li
                key={proof.slug}
                id={`fde-${proof.slug}`}
                className="scroll-mt-24 py-6"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-mono text-xs text-ink-faint">
                    0{index + 1}
                  </span>
                  <h3 className="font-display text-xl text-ink">{proof.title}</h3>
                  <EvidenceBadge evidence={proof.evidence} />
                </div>
                <p className="mt-2 max-w-measure text-sm leading-relaxed text-ink">
                  {proof.blurb}
                </p>
                <p className="mt-2 font-mono text-xs text-ink-faint">
                  {proof.stack.join(" · ")}
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="border border-rule bg-paper-elevated p-4">
                    <p className="font-mono text-xs text-ink-faint">FDE engineering proof</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                      {proof.demonstrates}
                    </p>
                  </div>
                  <div className="border border-rule p-4">
                    <p className="font-mono text-xs text-ink-faint">Explicit limits</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                      {proof.limit}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <Link to={proof.href} className="link-underline">
                    Read on this site
                  </Link>
                  {proof.githubUrl && (
                    <ExternalLink href={proof.githubUrl}>GitHub</ExternalLink>
                  )}
                  {proof.demoUrl && <ExternalLink href={proof.demoUrl}>Live</ExternalLink>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="fde-experience" className="mt-16 scroll-mt-24">
          <SectionHeading number="05" title="Experience & education" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <ul className="divide-y divide-rule border-y border-rule">
              {experience.map((role) => (
                <li key={role.slug} className="py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg text-ink">
                      {role.title} · {role.organization}
                    </h3>
                    <span className="font-mono text-xs text-ink-faint">
                      {role.start} – {role.end} · {role.location}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{role.narrative}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                    {role.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <aside className="border border-rule bg-paper-elevated p-5 self-start">
              <p className="label">Education</p>
              {primaryDegree.map((ed) => (
                <div key={ed.slug} className="mt-3">
                  <h3 className="font-display text-lg text-ink">{ed.degree}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{ed.institution}</p>
                  <p className="mt-1 font-mono text-xs text-ink-faint">
                    {ed.start} – {ed.end}
                    {ed.grade ? ` · ${ed.grade}` : ""}
                  </p>
                </div>
              ))}
              <p className="mt-5 border-t border-rule pt-4 text-xs text-ink-muted">
                Full timeline and credentials live on{" "}
                <Link to="/about" className="link-underline">
                  /about
                </Link>{" "}
                and{" "}
                <Link to="/resume" className="link-underline">
                  /resume
                </Link>
                .
              </p>
            </aside>
          </div>
        </section>

        <section id="fde-relay" className="mt-16 scroll-mt-24">
          <div className="border border-rule bg-paper-elevated p-6 sm:p-8">
            <p className="label">{fdePortfolio.relayCallout.eyebrow}</p>
            <h2 className="mt-2 font-display text-2xl text-ink">
              {fdePortfolio.relayCallout.title}
            </h2>
            <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">
              {fdePortfolio.relayCallout.summary}
            </p>
            <p className="mt-3 max-w-measure border-l-2 border-accent pl-3 text-xs leading-relaxed text-ink">
              {fdePortfolio.relayCallout.note}
            </p>
            <div className="mt-6">
              <Link to={fdePortfolio.relayCallout.href} className="btn-primary">
                {fdePortfolio.relayCallout.cta}
              </Link>
            </div>
          </div>
        </section>

        <ContactCta
          title="Hiring for a Forward Deployed Engineer?"
          prompt="Send the problem statement or role details — happy to walk through any repository live."
        />

        <div className="mt-12 border-t border-rule pt-8">
          <PowNav />
        </div>
      </article>
    </>
  );
}
