/**
 * Generates the Markdown twin of every public page, plus `llms.txt`, `llms-full.txt`, and the Markdown 404.
 *
 * `buildPages()` turns the records in `src/content` into one `AgentPage` per site path, and the
 * result is cached for the life of the process. Each page has a title, `Source:` (canonical HTML URL),
 * `Markdown:` (its `.md` URL), a description, the body, and a closing note on what is left out.
 * The home and contact twins and `llms.txt` list `person.phoneDisplay` beside the email.
 *
 * Connects to:
 * - `surfaces.ts` (static files for the build, request-time negotiation) and `vitePlugin.ts`
 *   (dev/preview 404 body).
 * - `src/components/site/AgentView.tsx` shows `renderPageMarkdown` output on the site.
 * - Tests: `agentSurfaces.test.ts`, `agentReadiness.test.ts`, `domainSurfaces.test.tsx`,
 *   `flagshipProducts.test.tsx` in `src/__tests__/`.
 * - Depends on `src/content` (all page records), `../canonical`, and `developerDocs.ts`.
 */
import {
  archive,
  capabilities,
  domains,
  education,
  elsewhereProfiles,
  experience,
  featuredProducts,
  ideas,
  leadership,
  contactSections,
  notes,
  now,
  pageUpdatedAt,
  person,
  principles,
  privacySections,
  productCategoryLabels,
  products,
  productStageLabels,
  projects,
  recognition,
  renderDomainBody,
  research,
  selectedWork,
  timeline,
  uses,
  work,
  writing,
} from "../../content";
import type { PolicySection, Product } from "../../content";
import { canonicalUrl } from "../canonical";
import { yearLabel } from "../format";
import {
  DEVELOPER_DESCRIPTION,
  DEVELOPER_TITLE,
  developerSections,
  WHEN_NOT_TO_USE,
  WHEN_TO_USE,
} from "./developerDocs";

/** One Markdown twin. `path` is the site path without `.md` (`/` for the homepage). */
export interface AgentPage {
  path: string;
  title: string;
  description: string;
  markdown: string;
}

/** Closing note on every page and in `llms.txt`. */
const OMISSION = "Unverified award metrics are omitted. Wording matches the public site.";

/** Renders heading-plus-paragraphs sections (contact, privacy, developers) as `##` blocks. */
function policyBody(sections: PolicySection[]): string {
  return sections
    .map((section) => `## ${section.heading}\n\n${section.paragraphs.join("\n\n")}`)
    .join("\n\n");
}

/** Absolute URL on `person.siteUrl` for a site path; `http(s)` URLs pass through unchanged. */
function abs(path: string): string {
  if (path.startsWith("http")) return path;
  const base = person.siteUrl.replace(/\/$/, "");
  return path === "/" ? `${base}/` : `${base}${path}`;
}

/** Escape characters that would change Markdown structure. Applied to page titles in `doc()`; tests call it directly. */
export function escapeMarkdownText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/([`*_{}[\]()#+.!|])/g, "\\$1");
}

/**
 * Maps a twin path to a `pageUpdatedAt` key (first path segment, or `home` for `/`).
 * Unknown keys fall through to `siteUpdatedAt` inside `pageUpdatedAt`.
 */
function freshnessKey(path: string): string {
  if (path === "/") return "home";
  const segment = path.replace(/^\//, "").split("/")[0] ?? "home";
  return segment || "home";
}

/**
 * Assembles one page: YAML frontmatter, escaped `#` title, Source and Markdown URLs, description,
 * body, and the omission note. Only the title is escaped; `description` and `body` are Markdown.
 */
function doc(path: string, title: string, description: string, body: string): AgentPage {
  const trimmedDescription = description.trim();
  const markdown = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(trimmedDescription)}`,
    `canonical: ${JSON.stringify(canonicalUrl(path))}`,
    `last-updated: ${JSON.stringify(pageUpdatedAt(freshnessKey(path)))}`,
    "---",
    "",
    `# ${escapeMarkdownText(title)}`,
    "",
    `Source: ${canonicalUrl(path)}`,
    `Markdown: ${abs(markdownPublicPath(path))}`,
    "",
    trimmedDescription,
    "",
    body.trim(),
    "",
    `_${OMISSION}_`,
    "",
  ].join("\n");
  return { path, title, description: trimmedDescription, markdown };
}

/** Public `.md` URL path for a site path: `/` becomes `/index.md`, anything else gets `.md` appended. */
export function markdownPublicPath(path: string): string {
  if (path === "/") return "/index.md";
  return `${path}.md`;
}

/** Markdown bullet list, one line per item. */
function bullets(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

/**
 * "Needs confirmation" section for a record's public per-item caveats, matching the aside on the
 * work and research HTML pages; "" when there are none. The withheld lists in src/content
 * (`*NeedsConfirmation` exports) are never passed here.
 */
function caveats(items?: readonly string[]): string {
  return items?.length
    ? `\n## Needs confirmation\n\nUnverified. Do not cite these as facts.\n\n${bullets(items)}`
    : "";
}

/** "start – end", just the one that is set, or "" when neither is, so blank dates print nothing. */
export function dateRange(start?: string, end?: string): string {
  if (start && end) return `${start} – ${end}`;
  return start || end || "";
}

/** Bullet list of the recorded architecture layers; empty string when none are set. */
function architectureBlock(architecture: Product["architecture"]): string {
  const lines = [
    architecture.frontend && `- Frontend: ${architecture.frontend}`,
    architecture.backend && `- Backend: ${architecture.backend}`,
    architecture.data && `- Data: ${architecture.data}`,
    architecture.auth && `- Auth: ${architecture.auth}`,
    architecture.infra && `- Infra: ${architecture.infra}`,
    ...(architecture.other ?? []).map((item) => `- ${item}`),
  ].filter(Boolean);
  return lines.join("\n");
}

/** `/work/{slug}`: a case study from problem to lessons, technologies, and links. */
function workPage(item: (typeof work)[number]): AgentPage {
  const links = [
    item.links?.demo && `- Demo: ${item.links.demo}`,
    item.links?.github && `- GitHub: ${item.links.github}`,
    item.links?.caseStudy && `- Case study: ${item.links.caseStudy}`,
  ]
    .filter(Boolean)
    .join("\n");
  return doc(
    `/work/${item.slug}`,
    item.title,
    item.summary,
    [
      `Status: ${item.status}. Type: ${item.type}. ${yearLabel(item.yearStart, item.yearEnd)}.`,
      "",
      "## Problem",
      "",
      item.problem,
      "",
      "## Context",
      "",
      item.context,
      "",
      "## Role",
      "",
      item.role,
      "",
      "## Thinking",
      "",
      item.thinking,
      "",
      "## Execution",
      "",
      item.execution,
      "",
      "## Outcome",
      "",
      item.outcome,
      "",
      "## Lessons",
      "",
      bullets(item.lessons),
      "",
      "## Technologies",
      "",
      bullets(item.technologies),
      links ? `\n## Links\n\n${links}` : "",
      caveats(item.needsConfirmation),
    ].join("\n"),
  );
}

/** `/products/{slug}`: stage, thesis, audience, approach, architecture, maturity, and open questions. */
function productPage(item: (typeof products)[number]): AgentPage {
  const maturity = item.maturity
    ? [
        "## Implemented",
        "",
        bullets(item.maturity.implemented),
        "",
        "## Experimental",
        "",
        bullets(item.maturity.experimental),
        "",
        "## Planned",
        "",
        bullets(item.maturity.planned),
      ].join("\n")
    : "";
  return doc(
    `/products/${item.slug}`,
    item.title,
    item.summary,
    [
      `Stage: ${productStageLabels[item.stage]}. ${item.stageExplanation}`,
      `Category: ${productCategoryLabels[item.category]}.`,
      item.thesis ? `\n## Thesis\n\n${item.thesis}` : "",
      "",
      "## Audience",
      "",
      bullets(item.audience),
      "",
      "## Problem",
      "",
      item.problem,
      "",
      "## Approach",
      "",
      item.approach,
      item.why ? `\n${item.why}` : "",
      item.workflow?.length ? `\n${item.workflow.map((step, index) => `${index + 1}. ${step}`).join("\n")}` : "",
      "",
      "## Architecture",
      "",
      architectureBlock(item.architecture) || "_Not recorded._",
      maturity ? `\n${maturity}` : "",
      "",
      "## Open questions",
      "",
      item.openQuestions.length ? bullets(item.openQuestions) : "_None listed._",
      item.tradeoffs?.length ? `\n## Trade-offs\n\n${bullets(item.tradeoffs)}` : "",
      item.demoUrl ? `\nLive site: ${item.demoUrl}` : "",
      item.githubUrl ? `Source repository: ${item.githubUrl}` : "",
      item.relatedWorkSlug ? `Case study: /work/${item.relatedWorkSlug}` : "",
    ].join("\n"),
  );
}

/** `/products/{slug}/log`: dated build-log entries. Generated for every product, even with no entries. */
function productLogPage(item: (typeof products)[number]): AgentPage {
  const entries = item.log
    .map((entry) => `### ${entry.date}: ${entry.title}\n\n${entry.body}`)
    .join("\n\n");
  return doc(
    `/products/${item.slug}/log`,
    `${item.title} log`,
    `Build log for ${item.title}.`,
    entries || "_No log entries yet._",
  );
}

/**
 * Every Markdown twin, in site order: home, about, list and detail pages, the static pages,
 * developers, privacy, then the domain dossiers from `src/content/domains.ts`.
 * A page added to the React app needs an entry here to get a twin.
 */
function buildPages(): AgentPage[] {
  const pages: AgentPage[] = [];

  pages.push(
    doc(
      "/",
      person.name,
      person.tagline,
      [
        person.positioning,
        "",
        `Location: ${person.location}.`,
        `Email: ${person.email}`,
        `Phone: ${person.phoneDisplay} (WhatsApp: ${person.whatsappUrl})`,
        `GitHub: ${person.primaryProfiles.github}`,
        `LinkedIn: ${person.primaryProfiles.linkedin}`,
        `Resume: ${person.resumeUrl}`,
        person.deepDive
          ? `${person.deepDive.label}: ${person.deepDive.url}. ${person.deepDive.description}`
          : "",
        "",
        "## Selected work",
        "",
        selectedWork
          .map((item) => `- [${item.title}](/work/${item.slug}.md): ${item.summary}`)
          .join("\n"),
        "",
        "## Now",
        "",
        bullets(now.workingOn.slice(0, 3)),
        "",
        `Index of Markdown pages: ${abs("/llms.txt")}`,
      ].join("\n"),
    ),
  );

  pages.push(
    doc(
      "/about",
      `About ${person.name}`,
      person.positioning,
      [
        `Based in ${person.location}. Day work leans toward AI evaluation and generative systems; evenings and weekends go to products, client sites, and careful notes on what actually shipped.`,
        "",
        "## Where I’ve been working",
        "",
        experience
          .map(
            (role) =>
              `### ${role.title}\n\n${role.organization} · ${role.start} – ${role.end} · ${role.type}\n\n${role.narrative}`,
          )
          .join("\n\n"),
        "",
        "## Education",
        "",
        education
          .map(
            (ed) =>
              `- ${[`${ed.degree}`, `${ed.institution}${ed.location ? ` (${ed.location})` : ""}`, dateRange(ed.start, ed.end), ed.grade].filter(Boolean).join(", ")}`,
          )
          .join("\n"),
        "",
        "Full list: /education.md",
        "",
        "## Community and leadership",
        "",
        leadership
          .slice(0, 4)
          .map(
            (item) =>
              `### ${item.title}\n\n${item.organization} · ${item.period}\n\n${item.narrative}`,
          )
          .join("\n\n"),
        "",
        "More: /leadership.md",
        "",
        "## Capabilities",
        "",
        capabilities
          .map(
            (cap) =>
              `### ${cap.domain}\n\n${cap.summary}\n\n${cap.skills.map((skill) => skill.name).join(" · ")}`,
          )
          .join("\n\n"),
      ].join("\n"),
    ),
  );

  pages.push(
    doc(
      "/work",
      "Work",
      "Case studies across products, projects, and clients.",
      work
        .map(
          (item) =>
            `- [${item.title}](/work/${item.slug}.md) (${item.status}, ${item.type}): ${item.summary}`,
        )
        .join("\n"),
    ),
  );
  pages.push(...work.map(workPage));

  pages.push(
    doc(
      "/products",
      "Products",
      "Things in progress and shipped product surfaces.",
      products
        .map(
          (item) =>
            `- [${item.title}](/products/${item.slug}.md) (${productStageLabels[item.stage]}): ${item.summary}`,
        )
        .join("\n"),
    ),
  );
  for (const item of products) {
    pages.push(productPage(item));
    pages.push(productLogPage(item));
  }

  pages.push(
    doc(
      "/projects",
      "Projects",
      "Bounded projects and experiments. Deeper case studies live under Work.",
      projects
        .map((item) => {
          const href = item.relatedWorkSlug
            ? `/work/${item.relatedWorkSlug}.md`
            : `/projects.md#${item.slug}`;
          return `- [${item.title}](${href}) (${item.status}${item.archive ? ", archive" : ""}): ${item.summary}`;
        })
        .join("\n"),
    ),
  );

  pages.push(
    doc(
      "/research",
      "Research",
      "Notes, investigations, and experiments. Not peer-reviewed publications.",
      research
        .map(
          (item) =>
            `- [${item.title}](/research/${item.slug}.md) (${item.status}): ${item.summary}`,
        )
        .join("\n"),
    ),
  );
  for (const item of research) {
    pages.push(
      doc(
        `/research/${item.slug}`,
        item.title,
        item.summary,
        [
          `Status: ${item.status}. Period: ${item.period}.`,
          "",
          item.disclaimer,
          "",
          item.context ? `## Context\n\n${item.context}` : "",
          item.methods?.length ? `## Methods\n\n${bullets(item.methods)}` : "",
          `## Technologies\n\n${bullets(item.technologies)}`,
          item.findings ? `## Findings\n\n${item.findings}` : "",
          item.fundingNote ? item.fundingNote : "",
          caveats(item.needsConfirmation).trim(),
        ]
          .filter(Boolean)
          .join("\n\n"),
      ),
    );
  }

  pages.push(
    doc(
      "/writing",
      "Writing",
      "Essays and notes. On-site writing is still thin.",
      writing
        .map((item) =>
          item.url
            ? `- [${item.title}](${item.url}): ${item.summary}`
            : `- [${item.title}](/writing/${item.slug}.md): ${item.summary}`,
        )
        .join("\n") || "_No pieces yet._",
    ),
  );
  for (const item of writing) {
    pages.push(
      doc(
        `/writing/${item.slug}`,
        item.title,
        item.summary,
        item.url
          ? `This piece lives externally: ${item.url}`
          : item.summary,
      ),
    );
  }

  pages.push(
    doc(
      "/notes",
      "Notes",
      "Short notes grounded in product and AI work.",
      notes
        .map((item) => `- [${item.title}](/notes/${item.slug}.md) (${item.kind})`)
        .join("\n"),
    ),
  );
  for (const item of notes) {
    pages.push(
      doc(
        `/notes/${item.slug}`,
        item.title,
        item.body.slice(0, 180),
        [`Kind: ${item.kind}. Published: ${item.publishedAt}.`, "", item.body].join("\n"),
      ),
    );
  }

  pages.push(
    doc(
      "/now",
      "Now",
      `Updated ${now.lastUpdated}.`,
      [
        `Last updated: ${now.lastUpdated}. Page date: ${pageUpdatedAt("now")}.`,
        "",
        "## Working on",
        "",
        bullets(now.workingOn),
        "",
        "## Researching",
        "",
        bullets(now.researching),
        "",
        "## Learning",
        "",
        bullets(now.learning),
        "",
        "## Thinking",
        "",
        bullets(now.thinking),
        "",
        "## Reading",
        "",
        bullets(now.reading),
        "",
        "## Priorities",
        "",
        bullets(now.priorities),
      ].join("\n"),
    ),
  );

  pages.push(
    doc(
      "/ideas",
      "Ideas",
      "Ideas in progress, tied to real themes.",
      ideas
        .map(
          (idea) =>
            `### ${idea.title}\n\nStatus: ${idea.status}. Theme: ${idea.theme}.\n\n${idea.summary}\n\nWhy: ${idea.why}${idea.nextStep ? `\n\nNext: ${idea.nextStep}` : ""}`,
        )
        .join("\n\n"),
    ),
  );

  pages.push(
    doc(
      "/principles",
      "Principles",
      "Working principles for how the work is built and described.",
      principles
        .map(
          (item) =>
            `### ${item.title}\n\n${item.statement}\n\nIn practice: ${item.inPractice}`,
        )
        .join("\n\n"),
    ),
  );

  pages.push(
    doc(
      "/timeline",
      "Timeline",
      "Chronological spine of education, roles, products, and life markers.",
      [...timeline]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(
          (entry) =>
            `- ${entry.date}${entry.endDate ? ` – ${entry.endDate}` : ""} · ${entry.kind} · ${entry.title}: ${entry.summary}`,
        )
        .join("\n"),
    ),
  );

  pages.push(
    doc(
      "/education",
      "Education",
      "Degrees and coursework.",
      education
        .map((ed) => {
          const when = [dateRange(ed.start, ed.end), ed.grade].filter(Boolean).join(" · ");
          return [
            `### ${ed.degree}`,
            `${ed.institution}${ed.location ? ` · ${ed.location}` : ""}`,
            when,
            ed.coursework?.length ? ed.coursework.join(" · ") : "",
            ed.note ?? "",
          ]
            .filter(Boolean)
            .join("\n\n");
        })
        .join("\n\n"),
    ),
  );

  pages.push(
    doc(
      "/leadership",
      "Leadership",
      "Grounded community and extracurricular roles.",
      leadership
        .map(
          (item) =>
            `### ${item.title}\n\n${item.organization} · ${item.period} · ${item.category}\n\n${item.narrative}${item.skills?.length ? `\n\n${item.skills.join(" · ")}` : ""}${item.link ? `\n\n${item.link}` : ""}`,
        )
        .join("\n\n"),
    ),
  );

  pages.push(
    doc(
      "/recognition",
      "Recognition",
      "Featured certifications and archived recognition.",
      recognition
        .map(
          (item) =>
            `- ${item.title}: ${item.issuer}, ${item.date}${item.archive ? " (archive)" : ""}. ${item.description}${item.link ? ` ${item.link}` : ""}`,
        )
        .join("\n"),
    ),
  );

  pages.push(
    doc(
      "/elsewhere",
      "Elsewhere",
      "Profiles on other sites.",
      elsewhereProfiles
        .map(
          (profile) =>
            `- [${profile.name}](${profile.url})${profile.archive ? " (archive)" : ""}: ${profile.description ?? profile.category}`,
        )
        .join("\n"),
    ),
  );

  pages.push(
    doc(
      "/contact",
      "Contact",
      "Email, call, or WhatsApp about work, products, research, or a quiet hello.",
      [
        `Email: ${person.email}`,
        `Phone: ${person.phoneDisplay}`,
        `WhatsApp: ${person.whatsappUrl}`,
        `Usual reply time: ${person.responseTime}.`,
        `Calendly: ${person.primaryProfiles.cal}`,
        "",
        "Intents: work opportunity, product, research, collaboration, speaking, consulting, hello.",
        "",
        policyBody(contactSections),
      ].join("\n"),
    ),
  );

  pages.push(
    doc(
      "/archive",
      "Archive",
      "Pointers to earlier sites and superseded work.",
      archive
        .map(
          (item) =>
            `- ${item.title}${item.year ? ` (${item.year})` : ""}: ${item.summary}${item.pointer ? ` ${item.pointer}` : ""}`,
        )
        .join("\n"),
    ),
  );

  pages.push(
    doc(
      "/uses",
      "Uses",
      "Tools and stack actually in use. Unconfirmed items are labeled.",
      uses
        .map(
          (item) =>
            `- **${item.name}** (${item.category}${item.todo ? ", not confirmed as a daily tool" : ""}): ${item.notes}`,
        )
        .join("\n"),
    ),
  );

  pages.push(
    doc(
      "/resume",
      "Resume",
      "Short on-site digest. Prefer the PDF for applications.",
      [
        `Open: ${person.resumeUrl}`,
        `Download: ${person.resumeDownloadUrl}`,
        "",
        person.positioning,
        "",
        "## Experience",
        "",
        experience
          .map(
            (role) =>
              `### ${role.title} · ${role.organization}\n\n${role.start} – ${role.end} · ${role.location}\n\n${bullets(role.highlights)}`,
          )
          .join("\n\n"),
        "",
        "## Education",
        "",
        education
          .map(
            (ed) =>
              `- ${[ed.degree, ed.institution, dateRange(ed.start, ed.end), ed.grade].filter(Boolean).join(", ")}`,
          )
          .join("\n"),
      ].join("\n"),
    ),
  );

  pages.push(
    doc(
      "/developers",
      DEVELOPER_TITLE,
      DEVELOPER_DESCRIPTION,
      policyBody(developerSections()),
    ),
  );

  pages.push(
    doc(
      "/privacy",
      "Privacy",
      "What this site collects, who processes it, and how to ask about it.",
      policyBody(privacySections),
    ),
  );

  for (const page of domains) {
    pages.push(doc(page.path, page.h1, page.description, renderDomainBody(page)));
  }

  return pages;
}

let pageCache: AgentPage[] | null = null;

/** All twins, built once per process and then reused. Content only changes on redeploy. */
export function listAgentPages(): AgentPage[] {
  if (!pageCache) pageCache = buildPages();
  return pageCache;
}

/**
 * The twin for a router pathname, or null when none exists. `""` means `/`, and one trailing slash
 * is ignored, because canonical URLs end in `/` while twin paths do not. Use `sitePathFromRequest`
 * first for raw request paths (`.md` suffixes, query strings, percent-encoding).
 */
export function getAgentPage(pathname: string): AgentPage | null {
  let path = pathname === "" ? "/" : pathname;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return listAgentPages().find((page) => page.path === path) ?? null;
}

/** Markdown for a router pathname (see `getAgentPage`), or null when no twin exists. */
export function renderPageMarkdown(pathname: string): string | null {
  return getAgentPage(pathname)?.markdown ?? null;
}

/**
 * Section index for developer/API surfaces. Linked from the root `/llms.txt`.
 */
export function renderDevelopersLlmsTxt(): string {
  return [
    `# ${person.name} — Developers`,
    "",
    "> Public REST API, OpenAPI, MCP, auth notes, and agent discovery for this site.",
    "",
    `- [Developer docs (Markdown)](${abs("/developers.md")})`,
    `- [Authentication](${abs("/auth.md")}) — public API; no OAuth`,
    `- [Pricing](${abs("/pricing.md")}) — free public API; no paid tiers`,
    `- [OpenAPI](${abs("/openapi.json")})`,
    `- [ARD catalog](${abs("/.well-known/ard.json")})`,
    `- [AI Catalog (legacy)](${abs("/.well-known/ai-catalog.json")})`,
    `- [MCP Server Card](${abs("/api/mcp/server-card")})`,
    `- [Agent mode JSON](${abs("/?mode=agent")})`,
    `- [Ask (NLWeb-shaped, lexical)](${abs("/ask")})`,
    `- [Root llms.txt](${abs("/llms.txt")})`,
    "",
  ].join("\n");
}

/** Section index for case studies under `/work`. */
export function renderWorkLlmsTxt(): string {
  return [
    `# ${person.name} — Work`,
    "",
    "> Case studies: problem, role, execution, and outcomes for shipped work.",
    "",
    `- [Work index](${abs("/work.md")})`,
    ...work.map(
      (item) => `- [${item.title}](${abs(`/work/${item.slug}.md`)}): ${item.summary}`,
    ),
    "",
    `- [Root llms.txt](${abs("/llms.txt")})`,
    "",
  ].join("\n");
}

/** Section index for products under `/products`. */
export function renderProductsLlmsTxt(): string {
  return [
    `# ${person.name} — Products`,
    "",
    "> Flagship and earlier products with stages kept specific.",
    "",
    `- [Products index](${abs("/products.md")})`,
    ...products.map(
      (item) => `- [${item.title}](${abs(`/products/${item.slug}.md`)}): ${item.summary}`,
    ),
    "",
    `- [Root llms.txt](${abs("/llms.txt")})`,
    "",
  ].join("\n");
}

/**
 * `/llms.txt`: the site index for language models. A summary, when (not) to use the site, then
 * links to domains, flagship products, case studies, profiles, and the developer surfaces.
 * It lists the pages worth opening first, not every page.
 */
export function renderLlmsTxt(): string {
  const lines = [
    `# ${person.name}`,
    "",
    `> ${person.tagline}`,
    "",
    `${person.roleTitle}. ${person.positioning}`,
    "",
    "Markdown twins use the same content records as the website. Fetch a URL ending in `.md`, or send `Accept: text/markdown` without `text/html`. A full dump of every page is at /llms-full.txt. This file lists the pages worth opening first.",
    "",
    "Section indexes: [Developers](/developers/llms.txt), [Work](/work/llms.txt), [Products](/products/llms.txt).",
    "",
    OMISSION,
    "",
    "**When to use this site:**",
    "",
    ...WHEN_TO_USE.map((line) => `- ${line}`),
    "",
    "**When not to use it:**",
    "",
    ...WHEN_NOT_TO_USE.map((line) => `- ${line}`),
    "",
    "## Domains",
    "",
    ...domains.map(
      (page) =>
        `- [${page.title}](${abs(markdownPublicPath(page.path))}): ${page.description}`,
    ),
    "",
    "## Flagship products",
    "",
    ...featuredProducts().map(
      (item) => `- [${item.title}](${abs(`/products/${item.slug}.md`)}): ${item.summary}`,
    ),
    "",
    "## Case studies",
    "",
    ...selectedWork.map(
      (item) => `- [${item.title}](${abs(`/work/${item.slug}.md`)}): ${item.summary}`,
    ),
    "",
    "## Profiles and contact",
    "",
    `- [About](${abs("/about.md")})`,
    `- [Experience](${abs("/experience.md")})`,
    `- [Contact](${abs("/contact.md")}): ${person.email}, ${person.phoneDisplay}`,
    `- [Privacy](${abs("/privacy.md")}): what the site collects and who processes it.`,
    `- GitHub: ${person.primaryProfiles.github}`,
    `- LinkedIn: ${person.primaryProfiles.linkedin}`,
    `- ORCID: ${person.primaryProfiles.orcid}`,
    `- Hugging Face: ${person.primaryProfiles.huggingface}`,
    "",
    `## ${DEVELOPER_TITLE}`,
    "",
    `- [${person.name} developer docs](${abs("/developers")}): how to call the public API and MCP server, versioning, and pagination.`,
    `- [${person.name} API: search](${abs("/api/v1/search")}): lexical \`GET /api/v1/search?q=\`. Not semantic search.`,
    `- [${person.name} API: projects](${abs("/api/v1/projects")}): list. \`/api/v1/projects/{slug}\` fetches one. \`/api/v1/compare?slugs=a,b\` compares.`,
    `- [${person.name} OpenAPI spec](${abs("/openapi.json")}): OpenAPI 3.1 description of those GET endpoints.`,
    `- [${person.name} MCP server](${abs("/api/mcp")}): Streamable HTTP, \`POST /api/mcp\`. Tools: list_projects, get_project, compare_projects, search_portfolio.`,
    `- [${person.name} MCP Server Card](${abs("/api/mcp/server-card")}): SEP-2127 card for that endpoint, listed in ARD at /.well-known/ard.json and the AI Catalog at /.well-known/ai-catalog.json.`,
    `- [Authentication](${abs("/auth.md")}): public API and MCP need no tokens; OAuth metadata is not published.`,
    `- [Pricing](${abs("/pricing.md")}): free public read-only API and MCP; no paid tiers or checkout.`,
    `- [Agent mode](${abs("/?mode=agent")}): JSON capability view for agents.`,
    `- [Ask](${abs("/ask")}): NLWeb-shaped lexical search (POST or GET ?query=).`,
    `- [${person.name} API catalog](${abs("/.well-known/api-catalog")}): RFC 9727 linkset.`,
    `- [AGENTS.md](${abs("/AGENTS.md")}): instructions for agents reading this site.`,
    `- [SKILL.md](${abs("/SKILL.md")}): examples and limits.`,
    `- [Full Markdown dump](${abs("/llms-full.txt")})`,
    "",
  ];
  return lines.join("\n");
}

/** `/llms-full.txt`: every twin from `listAgentPages()` joined with `---` separators. */
export function renderLlmsFull(): string {
  return listAgentPages()
    .map((page) => page.markdown)
    .join("\n\n---\n\n");
}

/**
 * Body for a 404 sent to a Markdown reader. Static so hosts can serve it as /404.md:
 * `surfaces.ts` emits it as that file, and the Netlify edge function fetches it from there.
 */
export function renderNotFoundMarkdown(): string {
  return [
    "# Page not found",
    "",
    `There is no page at this address on ${abs("/")}. It may have moved, or it never existed.`,
    "",
    "Start here instead:",
    "",
    `- Index of every page: ${abs("/llms.txt")}`,
    `- Sitemap: ${abs("/sitemap.xml")}`,
    `- Agent guide: ${abs("/AGENTS.md")}`,
    `- Developer notes and API: ${abs("/developers")}`,
    `- Search: ${abs("/api/search?q=")}`,
    "",
  ].join("\n");
}

/**
 * Map a request path such as /work/foo.md or /index.md to a site path. Drops the query string
 * and one trailing slash. Throws on malformed percent-encoding (`decodeURIComponent`); the
 * caller in `surfaces.ts` catches that.
 */
export function sitePathFromRequest(urlPath: string): string | null {
  let path = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (path.endsWith(".md")) {
    path = path.slice(0, -3);
    if (path === "/index" || path === "") return "/";
  }
  if (path === "") return "/";
  return path;
}
