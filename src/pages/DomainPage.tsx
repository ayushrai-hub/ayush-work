/**
 * Domain dossier pages: `/ai-engineering` and its children `/ai-engineering/{llm-evaluation,
 * rlhf,llm-systems,agents,rag}`, `/software-engineering`, `/software-services`,
 * `/experience`, and `/open-source`. Each shows evidence-backed prose, evidence links, and named gaps.
 *
 * One component serves every domain: it looks up the record for the current pathname with
 * `getDomainByPath` and falls back to NotFoundPage when no record matches (so unknown
 * `/ai-engineering/*` paths render the 404 page). Breadcrumbs are built from each path prefix,
 * using the matching domain title or the raw segment. Emits WebPage + BreadcrumbList JSON-LD.
 * `/experience` additionally lists `experience` roles; `/open-source` lists deduplicated
 * repository links from products, projects, and the GitHub profile.
 *
 * Connects to:
 * - Routed in src/App.tsx as `ai-engineering`, `ai-engineering/*`, `software-engineering`,
 *   `software-services`, `experience`, and `open-source`. Every `domains[].path` is prerendered
 *   and listed in the sitemap via src/lib/publicRoutes.ts.
 * - Content from src/content (`getDomainByPath`, `childDomains`, `evidenceLevelLabels` from
 *   domains.ts; `experience`, `products`, `projects`, `person`, `pageUpdatedAt("domains")`) and
 *   src/lib/canonical.ts; components PageSEO, PageHeader, Prose, SectionHeading, NotFoundPage.
 * - Markdown twins `<path>.md` built from `renderDomainBody` in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link, useLocation } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import SectionHeading from "../components/editorial/SectionHeading";
import NotFoundPage from "./NotFoundPage";
import {
  childDomains,
  evidenceLevelLabels,
  experience,
  getDomainByPath,
  pageUpdatedAt,
  person,
  products,
  projects,
} from "../content";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

/**
 * Link for evidence, related, and further-reading entries (not the breadcrumb, despite the name).
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

  const repos =
    page.path === "/open-source"
      ? uniqueRepos()
      : [];

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
        <p className="label -mt-6 mb-10">{evidenceLevelLabels[page.evidenceLevel]}</p>

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
                    <span>
                      {role.start} – {role.end}
                    </span>
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
                  <a href={repo.href} target="_blank" rel="noopener noreferrer" className="link-underline font-medium">
                    {repo.label}
                  </a>
                  <p className="mt-1 text-sm text-ink-muted">{repo.note}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-14">
          <SectionHeading title="Evidence" />
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

        <section className="mt-14">
          <SectionHeading title="Gaps" />
          <ul className="max-w-measure list-disc space-y-2 pl-5 text-ink-muted">
            {page.gaps.map((gap) => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
        </section>

        <section className="mt-14 border-t border-rule pt-8">
          <h2 className="font-display text-2xl text-ink">Contact</h2>
          <p className="mt-3 max-w-measure text-ink-muted">
            For collaboration on this kind of work, email {person.email}.
          </p>
          <p className="mt-4">
            <Link to="/contact" className="btn-secondary">
              Contact
            </Link>
          </p>
        </section>
      </article>
    </>
  );
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
