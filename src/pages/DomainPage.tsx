/**
 * Domain dossier pages: `/ai-engineering` and its children `/ai-engineering/{llm-evaluation,
 * rlhf,llm-systems,agents,rag}`, `/software-engineering`, `/gtm-revops`, `/software-services`,
 * `/experience`, and `/open-source`.
 *
 * Renders each `DomainRecord` in full engineering depth:
 * - Breadcrumbs, PageHeader, and evidence level badge
 * - Sticky jump navigation across the domain sections
 * - "Numbers in the game" verifiable repository/test stat grid
 * - Concise 3-stage journey card ("How we started", "The grind", "What we achieved")
 * - Primary visual gallery artifact (`MediaGallery`)
 * - Structured table of skills (`skillsTable`: skill, category, tools, repository proof, trade-off, status)
 * - In-depth core domain benchmarks & harnesses table (`coreBenchmarks`: link, what it does, domain, category, metrics, trade-offs)
 * - 2–3 scalable proof-of-work solutions (`solutions`: What, How, Why, Where, For Whom, Impact, Trade-off, visuals, and architecture flow)
 * - Loom / YouTube walkthrough embed (`VideoEmbed`)
 * - Human & Agent Discovery card (`.md` twin, `/api/v1/search`, MCP tool call, POW workbenches, keywords)
 * - Child sub-domains ("In this section"), concise prose sections, experience/repo lists, evidence, related links, reading, and named gaps.
 *
 * Connects to:
 * - Routed in src/App.tsx as `ai-engineering`, `ai-engineering/*`, `software-engineering`,
 *   `gtm-revops`, `software-services`, `experience`, and `open-source`. Every `domains[].path` is prerendered
 *   and listed in the sitemap via src/lib/publicRoutes.ts.
 * - Content from src/content (`getDomainByPath`, `childDomains`, `evidenceLevelLabels`,
 *   `domainSkillStatusLabels` from domains.ts; `experience`, `products`, `projects`, `person`,
 *   `pageUpdatedAt("domains")`) and src/lib/canonical.ts.
 * - Markdown twins `<path>.md` built from `renderDomainBody` in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link, useLocation } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import ContactCta from "../components/site/ContactCta";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import SectionHeading from "../components/editorial/SectionHeading";
import MediaGallery from "../components/editorial/MediaGallery";
import VideoEmbed from "../components/editorial/VideoEmbed";
import NotFoundPage from "./NotFoundPage";
import {
  childDomains,
  domainSkillStatusLabels,
  evidenceLevelLabels,
  experience,
  getDomainByPath,
  getRecordVisuals,
  pageUpdatedAt,
  person,
  products,
  projects,
} from "../content";
import type { DomainSkillRow } from "../content";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";
import { softwareServicesFaqNode, softwareServicesNode } from "../lib/structuredData";

/** Maps a domain dossier path to a primary visual record slug in `src/content/visuals.ts`. */
const DOMAIN_VISUAL_SLUG: Record<string, string> = {
  "/gtm-revops": "revenueroles",
  "/ai-engineering": "revenue-intelligence-engine",
  "/ai-engineering/llm-evaluation": "gtm-strato",
  "/ai-engineering/rlhf": "aiworks-leads",
  "/ai-engineering/llm-systems": "medvoice",
  "/ai-engineering/agents": "relationship-intelligence-engine",
  "/ai-engineering/rag": "mailu",
  "/software-engineering": "revenueroles",
  "/software-services": "praful-h",
  "/experience": "revenueroles",
  "/open-source": "gtm-strato",
};

/**
 * Link for evidence, related, benchmark, solution, and further-reading entries.
 * Absolute `http` URLs open in a new tab; site paths use a router `Link`.
 */
function CrumbLink({ href, children }: { href: string; children: string }) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className="link-underline">
      {children}
    </Link>
  );
}

/** Small bordered status badge for a row in the domain skills table. */
function SkillStatusBadge({ status }: { status: DomainSkillRow["status"] }) {
  return (
    <span className="inline-block border border-rule px-2 py-0.5 font-mono text-xs text-ink-faint">
      {domainSkillStatusLabels[status]}
    </span>
  );
}

/** Domain dossier component, selected by pathname. Lazy-loaded by the domain routes in src/App.tsx. */
export default function DomainPage() {
  const { pathname } = useLocation();
  const page = getDomainByPath(pathname);
  if (!page) return <NotFoundPage />;

  const crumbs = [{ name: "Home", path: "/" }];
  const parts = page.path.split("/").filter(Boolean);
  let acc = "";
  for (const part of parts) {
    acc += `/${part}`;
    const match = getDomainByPath(acc);
    crumbs.push({ name: match?.title ?? part, path: acc });
  }

  const children = childDomains(page.path);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl(page.path)}#webpage`,
        url: canonicalUrl(page.path),
        name: page.h1,
        description: page.description,
        dateModified: pageUpdatedAt("domains"),
        isPartOf: { "@id": websiteId() },
        about: { "@id": personId() },
      },
      ...(page.path === "/software-services"
        ? [softwareServicesNode(), softwareServicesFaqNode()]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: canonicalUrl(crumb.path),
        })),
      },
    ],
  };

  const repos = page.path === "/open-source" ? uniqueRepos() : [];

  return (
    <>
      <PageSEO
        title={page.title}
        description={page.description}
        path={page.path}
        jsonLd={jsonLd}
      />
      <article className="site-shell page-section">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-ink-muted">
            {crumbs.map((crumb, index) => (
              <li key={crumb.path} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true">/</span>}
                {index === crumbs.length - 1 ? (
                  <span className="text-ink">{crumb.name}</span>
                ) : (
                  <Link to={crumb.path} className="link-underline">
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <PageHeader
          label={page.label}
          title={page.h1}
          dek={page.dek}
          updated={pageUpdatedAt("domains")}
        />
        <p className="label -mt-6 mb-8">{evidenceLevelLabels[page.evidenceLevel]}</p>

        <nav
          className="mb-10 flex flex-wrap gap-2 border-y border-rule py-3 text-sm"
          aria-label="Domain sections"
        >
          <a href="#domain-journey" className="px-2 py-1 text-ink-muted hover:text-ink">
            Journey &amp; numbers
          </a>
          <a href="#domain-skills" className="px-2 py-1 text-ink-muted hover:text-ink">
            Skills table ({page.skillsTable.length})
          </a>
          <a href="#domain-benchmarks" className="px-2 py-1 text-ink-muted hover:text-ink">
            Core benchmarks ({page.coreBenchmarks.length})
          </a>
          <a href="#domain-solutions" className="px-2 py-1 text-ink-muted hover:text-ink">
            Scalable POW solutions ({page.solutions.length})
          </a>
          <a href="#domain-walkthrough" className="px-2 py-1 text-ink-muted hover:text-ink">
            Video walkthrough
          </a>
          <a href="#domain-agent-access" className="px-2 py-1 text-ink-muted hover:text-ink">
            Agent &amp; human search
          </a>
          <a href="#domain-evidence" className="px-2 py-1 text-ink-muted hover:text-ink">
            Evidence &amp; gaps
          </a>
        </nav>

        {page.stats.length > 0 && (
          <section className="mb-12" aria-label="Numbers in the game">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {page.stats.map((stat) => (
                <div key={stat.label} className="border border-rule bg-paper-elevated p-4">
                  <p className="font-display text-2xl text-ink">{stat.value}</p>
                  <p className="mt-1 font-mono text-xs font-medium text-ink">{stat.label}</p>
                  <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">{stat.context}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="domain-journey" className="mb-14 scroll-mt-24">
          <SectionHeading number="01" title="The journey: how we started, the grind, what we achieved" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-rule bg-paper-elevated p-5">
              <p className="font-mono text-xs text-ink-faint">01 · How we started</p>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">{page.journey.started}</p>
            </div>
            <div className="border border-rule bg-paper-elevated p-5">
              <p className="font-mono text-xs text-ink-faint">02 · The grind</p>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">{page.journey.grind}</p>
            </div>
            <div className="border border-rule bg-paper-elevated p-5">
              <p className="font-mono text-xs text-ink-faint">03 · What we achieved</p>
              <p className="mt-2 text-sm text-ink leading-relaxed">{page.journey.achieved}</p>
            </div>
          </div>
        </section>

        {(() => {
          const visualSlug = DOMAIN_VISUAL_SLUG[page.path];
          const visuals = visualSlug ? getRecordVisuals(visualSlug) : undefined;
          if (!visuals || visuals.gallery.length === 0) return null;
          return (
            <section className="mb-14 max-w-3xl" aria-label={`${page.title} visual evidence`}>
              <MediaGallery
                items={visuals.gallery}
                heading="Primary system artifact"
                ariaLabel={`${page.title} primary system artifact`}
              />
            </section>
          );
        })()}

        {children.length > 0 && (
          <section className="mb-14">
            <SectionHeading title="In this section" />
            <ul className="max-w-measure divide-y divide-rule border-y border-rule">
              {children.map((child) => (
                <li key={child.path}>
                  <Link
                    to={child.path}
                    className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="font-display text-lg text-ink group-hover:text-accent">
                      {child.title}
                    </span>
                    <span className="text-sm text-ink-muted sm:max-w-xs sm:text-right">
                      {child.dek}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {page.skillsTable.length > 0 && (
          <section id="domain-skills" className="mt-14 scroll-mt-24">
            <SectionHeading number="02" title="Table of skills & engineering depth" />
            <p className="mb-5 max-w-measure text-sm text-ink-muted">
              Every skill listed below names the category, tools, repository or role proof, and the
              engineering trade-off accepted in code.
            </p>
            <div className="overflow-x-auto border border-rule">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-rule bg-paper-elevated">
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                      Skill / capability
                    </th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                      Tools &amp; stack
                    </th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                      Depth &amp; repository proof
                    </th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                      Engineering trade-off
                    </th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {page.skillsTable.map((row) => (
                    <tr key={row.skill} className="align-top">
                      <th scope="row" className="px-4 py-3.5 font-medium text-ink">
                        {row.skill}
                      </th>
                      <td className="px-4 py-3.5 font-mono text-xs text-ink-faint">
                        {row.category}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-ink-muted">{row.tools}</td>
                      <td className="px-4 py-3.5 text-ink-muted">{row.depthAndProof}</td>
                      <td className="px-4 py-3.5 text-ink-muted">{row.tradeoff}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <SkillStatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page.coreBenchmarks.length > 0 && (
          <section id="domain-benchmarks" className="mt-16 scroll-mt-24">
            <SectionHeading number="03" title="Core domain benchmarks, harnesses & specs" />
            <p className="mb-5 max-w-measure text-sm text-ink-muted">
              Direct links to the evaluation benchmarks, scoring engines, or verification harnesses
              for this domain: what each does, its category, verifiable metrics, and trade-offs.
            </p>
            <div className="overflow-x-auto border border-rule">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-rule bg-paper-elevated">
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                      Benchmark / harness
                    </th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                      What it does
                    </th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                      Domain &amp; category
                    </th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                      Numbers &amp; metrics
                    </th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-medium text-ink">
                      Trade-off
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {page.coreBenchmarks.map((b) => (
                    <tr key={b.name} className="align-top">
                      <th scope="row" className="px-4 py-3.5 font-medium text-ink">
                        <CrumbLink href={b.href}>{b.name}</CrumbLink>
                      </th>
                      <td className="px-4 py-3.5 text-ink-muted">{b.whatItDoes}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-ink-muted">
                        <span className="block text-ink">{b.domain}</span>
                        <span className="text-ink-faint">{b.category}</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-ink">{b.metrics}</td>
                      <td className="px-4 py-3.5 text-ink-muted">{b.tradeoff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page.solutions.length > 0 && (
          <section id="domain-solutions" className="mt-16 scroll-mt-24">
            <SectionHeading number="04" title="Scalable solutions & live proof of work" />
            <p className="mb-6 max-w-measure text-sm text-ink-muted">
              In plain terms: what we built, how it works under the hood, why we built it, where it
              runs, who uses it, the verified impact, and the trade-offs we accepted.
            </p>
            <ol className="space-y-12">
              {page.solutions.map((sol, idx) => {
                const visuals = sol.visualSlug ? getRecordVisuals(sol.visualSlug) : undefined;
                return (
                  <li
                    key={sol.slug}
                    id={`solution-${sol.slug}`}
                    className="scroll-mt-24 border-t border-rule pt-8"
                  >
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="font-mono text-xs text-ink-faint">0{idx + 1}</span>
                      <h3 className="font-display text-2xl text-ink">{sol.title}</h3>
                      <span className="inline-block border border-rule px-2 py-0.5 font-mono text-xs text-ink-muted">
                        {sol.badge}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 border border-rule bg-paper-elevated p-5 md:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <h4 className="label mb-1">What we did</h4>
                        <p className="text-sm text-ink-muted leading-relaxed">{sol.what}</p>
                      </div>
                      <div>
                        <h4 className="label mb-1">How we built it</h4>
                        <p className="text-sm text-ink-muted leading-relaxed">{sol.how}</p>
                      </div>
                      <div>
                        <h4 className="label mb-1">Why it matters</h4>
                        <p className="text-sm text-ink-muted leading-relaxed">{sol.why}</p>
                      </div>
                      <div>
                        <h4 className="label mb-1">Where it lives</h4>
                        <p className="text-sm text-ink-muted leading-relaxed">{sol.where}</p>
                      </div>
                      <div>
                        <h4 className="label mb-1">For whom</h4>
                        <p className="text-sm text-ink-muted leading-relaxed">{sol.forWhom}</p>
                      </div>
                      <div>
                        <h4 className="label mb-1">Impact &amp; verified numbers</h4>
                        <p className="text-sm text-ink leading-relaxed">{sol.impact}</p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-ink-muted">
                      <span className="label mr-2">Trade-off</span>
                      {sol.tradeoff}
                    </p>

                    {visuals && (visuals.gallery.length > 0 || visuals.diagram) && (
                      <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        {visuals.gallery.length > 0 && (
                          <MediaGallery
                            items={visuals.gallery}
                            heading="System screens & artifacts"
                            ariaLabel={`${sol.title} visual artifacts`}
                          />
                        )}
                        {visuals.diagram && (
                          <div>
                            <h4 className="label mb-3">Architecture &amp; data flow</h4>
                            <pre className="overflow-x-auto border border-rule bg-paper-elevated p-4 font-mono text-xs leading-relaxed text-ink">
                              {visuals.diagram}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {sol.links.length > 0 && (
                      <nav
                        className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm"
                        aria-label={`${sol.title} links`}
                      >
                        {sol.links.map((link) => (
                          <CrumbLink key={`${link.href}-${link.label}`} href={link.href}>
                            {link.label}
                          </CrumbLink>
                        ))}
                      </nav>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        <section
          id="domain-walkthrough"
          className="mt-16 scroll-mt-24"
          aria-labelledby="domain-video-heading"
        >
          <SectionHeading number="05" title="Video walkthrough (Loom / YouTube)" />
          <p id="domain-video-heading" className="sr-only">
            {page.walkthrough.title}
          </p>
          <VideoEmbed
            url={page.walkthrough.url}
            title={page.walkthrough.title}
            plannedTopics={page.walkthrough.plannedTopics}
            slot={page.walkthrough.slot}
          />
        </section>

        <section id="domain-agent-access" className="mt-16 scroll-mt-24">
          <SectionHeading number="06" title="How humans & AI agents find, search, and verify this domain" />
          <div className="border border-rule bg-paper-elevated p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="label mb-1">Markdown twin (.md)</p>
                <a
                  href={page.agentAccess.markdownPath}
                  className="font-mono text-xs link-accent break-all"
                >
                  {page.agentAccess.markdownPath}
                </a>
                <p className="mt-1 text-xs text-ink-muted">
                  Or send <code>Accept: text/markdown</code> to <code>{page.path}</code>.
                </p>
              </div>
              <div>
                <p className="label mb-1">Lexical search API</p>
                <a
                  href={page.agentAccess.searchQuery}
                  className="font-mono text-xs link-accent break-all"
                >
                  GET {page.agentAccess.searchQuery}
                </a>
                <p className="mt-1 text-xs text-ink-muted">
                  Free, unauthenticated JSON API (60 req/60s draft-11 RateLimit).
                </p>
              </div>
              <div>
                <p className="label mb-1">Streamable HTTP MCP call</p>
                <code className="block font-mono text-xs text-ink break-all">
                  {page.agentAccess.mcpTool}
                </code>
                <p className="mt-1 text-xs text-ink-muted">
                  POST <code>/api/mcp</code> or <code>/api/mcp/docs</code> ·{" "}
                  <Link to="/developers" className="link-underline">
                    Developer docs
                  </Link>
                </p>
              </div>
            </div>

            {page.agentAccess.powRoutes.length > 0 && (
              <div className="mt-4 border-t border-rule pt-4">
                <p className="label mb-2">Interactive proof-of-work workbenches</p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {page.agentAccess.powRoutes.map((route) => (
                    <li key={route.href}>
                      <CrumbLink href={route.href}>{route.label}</CrumbLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {page.agentAccess.keywords.length > 0 && (
              <div className="mt-4 border-t border-rule pt-4">
                <p className="label mb-2">Domain keywords &amp; search tokens</p>
                <div className="flex flex-wrap gap-1.5">
                  {page.agentAccess.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="border border-rule bg-paper px-2 py-0.5 font-mono text-xs text-ink-muted"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {page.sections.map((section) => (
          <section key={section.heading} className="mt-12 max-w-measure">
            <h2 className="font-display text-2xl text-ink">{section.heading}</h2>
            <Prose className="mt-4">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 first:mt-0">
                  {paragraph}
                </p>
              ))}
            </Prose>
            {section.diagram && (
              <pre className="mt-4 overflow-x-auto border border-rule bg-paper-elevated p-4 font-mono text-xs leading-relaxed text-ink">
                {section.diagram}
              </pre>
            )}
            {section.bullets && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {page.path === "/experience" && (
          <section className="mt-14">
            <SectionHeading title="Roles" />
            <ul className="max-w-measure">
              {experience.map((role) => (
                <li id={role.slug} key={role.slug} className="scroll-mt-24 border-t border-rule py-6">
                  <h3 className="font-display text-xl text-ink">{role.title}</h3>
                  <p className="meta-row mt-1">
                    <span>{role.organization}</span>
                    <span aria-hidden="true">·</span>
                    <span>{role.location}</span>
                  </p>
                  <p className="mt-3 text-ink-muted leading-relaxed">{role.narrative}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {page.path === "/open-source" && (
          <section className="mt-14">
            <SectionHeading title="Repositories already linked from this site" />
            <ul className="max-w-measure divide-y divide-rule border-y border-rule">
              {repos.map((repo) => (
                <li key={repo.href} className="py-4">
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline font-medium"
                  >
                    {repo.label}
                  </a>
                  <p className="mt-1 text-sm text-ink-muted">{repo.note}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="domain-evidence" className="mt-14 scroll-mt-24">
          <SectionHeading number="07" title="Evidence" />
          <ul className="max-w-measure divide-y divide-rule border-y border-rule">
            {page.evidence.map((item) => (
              <li key={`${item.href}-${item.label}`} className="py-4">
                <CrumbLink href={item.href}>{item.label}</CrumbLink>
                {item.note && <p className="mt-1 text-sm text-ink-muted">{item.note}</p>}
              </li>
            ))}
          </ul>
        </section>

        {page.related.length > 0 && (
          <section className="mt-14">
            <SectionHeading title="Related" />
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {page.related.map((item) => (
                <li key={item.href}>
                  <CrumbLink href={item.href}>{item.label}</CrumbLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        {page.reading.length > 0 && (
          <section className="mt-14">
            <SectionHeading title="Further reading" />
            <ul className="max-w-measure space-y-3">
              {page.reading.map((item) => (
                <li key={item.href}>
                  <CrumbLink href={item.href}>{item.label}</CrumbLink>
                  {item.note && <p className="mt-1 text-sm text-ink-muted">{item.note}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {page.gaps.length > 0 && (
          <section className="mt-14">
            <SectionHeading title="Gaps" />
            <ul className="max-w-measure list-disc space-y-2 pl-5 text-ink-muted">
              {page.gaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          </section>
        )}

        <ContactCta
          prompt={`For collaboration on ${inSentence(page.title)}, use contact, resume, or Calendly. Email ${person.email}.`}
        />
      </article>
    </>
  );
}

/**
 * A title as it reads mid-sentence: only a leading capital followed by a lowercase letter is
 * lowered, so acronyms such as "AI", "LLM", and "GTM" keep their case.
 */
function inSentence(title: string): string {
  return /^[A-Z][a-z]/.test(title) ? title[0].toLowerCase() + title.slice(1) : title;
}

/** Repository links for `/open-source`: product GitHub URLs, then project GitHub links, then the profile, first occurrence wins. */
function uniqueRepos(): { href: string; label: string; note: string }[] {
  const rows: { href: string; label: string; note: string }[] = [];
  const seen = new Set<string>();
  const add = (href: string | undefined, label: string, note: string) => {
    if (!href || seen.has(href)) return;
    seen.add(href);
    rows.push({ href, label, note });
  };
  for (const product of products) {
    add(product.githubUrl, product.title, product.summary);
  }
  for (const project of projects) {
    add(project.links?.github, project.title, project.summary);
  }
  add(person.primaryProfiles.github, "GitHub profile", "ayushrai-hub");
  return rows;
}
