import {
  archive,
  capabilities,
  education,
  elsewhereProfiles,
  experience,
  ideas,
  leadership,
  notes,
  now,
  pageUpdatedAt,
  person,
  principles,
  productCategoryLabels,
  products,
  productStageLabels,
  projects,
  recognition,
  research,
  selectedWork,
  timeline,
  uses,
  work,
  writing,
} from "../../content";
import type { Product } from "../../content";

export interface AgentPage {
  path: string;
  title: string;
  description: string;
  markdown: string;
}

const OMISSION =
  "Private phone numbers and unverified award metrics are omitted. Wording matches the public site.";

function abs(path: string): string {
  if (path.startsWith("http")) return path;
  const base = person.siteUrl.replace(/\/$/, "");
  return path === "/" ? `${base}/` : `${base}${path}`;
}

/** Escape characters that would change Markdown structure. Used for titles and fixtures. */
export function escapeMarkdownText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/([`*_{}[\]()#+.!|])/g, "\\$1");
}

function doc(path: string, title: string, description: string, body: string): AgentPage {
  const markdown = [
    `# ${escapeMarkdownText(title)}`,
    "",
    `Source: ${abs(path)}`,
    `Markdown: ${abs(markdownPublicPath(path))}`,
    "",
    description.trim(),
    "",
    body.trim(),
    "",
    `_${OMISSION}_`,
    "",
  ].join("\n");
  return { path, title, description: description.trim(), markdown };
}

export function markdownPublicPath(path: string): string {
  if (path === "/") return "/index.md";
  return `${path}.md`;
}

function bullets(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

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
      `Status: ${item.status}. Type: ${item.type}. ${item.yearStart}–${item.yearEnd ?? ""}.`,
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
    ].join("\n"),
  );
}

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
              `- ${ed.degree}, ${ed.institution}${ed.location ? ` (${ed.location})` : ""}, ${ed.start} – ${ed.end}${ed.grade ? `, ${ed.grade}` : ""}`,
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
        .map(
          (ed) =>
            `### ${ed.degree}\n\n${ed.institution}${ed.location ? ` · ${ed.location}` : ""}\n\n${ed.start} – ${ed.end}${ed.grade ? ` · ${ed.grade}` : ""}${ed.coursework?.length ? `\n\n${ed.coursework.join(" · ")}` : ""}${ed.note ? `\n\n${ed.note}` : ""}`,
        )
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
      "Email about work, products, research, or a quiet hello.",
      [
        `Email: ${person.email}`,
        `Usual reply time: ${person.responseTime}.`,
        `Calendly: ${person.primaryProfiles.cal}`,
        "",
        "Intents: work opportunity, product, research, collaboration, speaking, consulting, hello.",
        "",
        "A phone number is not included in machine-readable pages.",
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
              `- ${ed.degree}, ${ed.institution}, ${ed.start} – ${ed.end}${ed.grade ? `, ${ed.grade}` : ""}`,
          )
          .join("\n"),
      ].join("\n"),
    ),
  );

  pages.push(
    doc(
      "/developers",
      "Developers",
      "How to read the public Markdown, search API, and local MCP tools.",
      [
        "Start at /llms.txt. Open a `.md` URL for a page. Home is /index.md.",
        "",
        "Search is lexical: `GET /api/search?q=`. It is not a model and does not understand intent.",
        "",
        "Projects:",
        "",
        "- `GET /api/v1/projects`",
        "- `GET /api/v1/projects/{slug}`",
        "- `GET /api/v1/compare?slugs=a,b`",
        "",
        "The older `/api/projects` query form remains. OpenAPI is /openapi.json. Agent notes are /AGENTS.md and /SKILL.md.",
        "",
        "Archived projects are omitted unless `archive=1`. Phone numbers and withheld claims are omitted.",
        "",
        "A local stdio MCP server in this repository exposes `list_projects`, `get_project`, and `compare_projects`. There is no remote MCP endpoint and no registry listing.",
      ].join("\n"),
    ),
  );

  return pages;
}

let pageCache: AgentPage[] | null = null;

export function listAgentPages(): AgentPage[] {
  if (!pageCache) pageCache = buildPages();
  return pageCache;
}

export function renderPageMarkdown(pathname: string): string | null {
  const path = pathname === "" ? "/" : pathname;
  return listAgentPages().find((page) => page.path === path)?.markdown ?? null;
}

export function renderLlmsTxt(): string {
  const groups = new Map<string, AgentPage[]>();
  for (const page of listAgentPages()) {
    const key = page.path.split("/").filter(Boolean)[0] ?? "home";
    const list = groups.get(key) ?? [];
    list.push(page);
    groups.set(key, list);
  }
  const lines = [
    `# ${person.name}`,
    "",
    `> ${person.tagline}`,
    "",
    person.positioning,
    "",
    "Markdown twins use the same content records as the website. Fetch a URL ending in `.md`, or send `Accept: text/markdown` without `text/html`. A full dump is at /llms-full.txt when you want one file.",
    "",
    OMISSION,
    "",
  ];
  for (const [key, pages] of groups) {
    lines.push(`## ${key}`);
    lines.push("");
    for (const page of pages) {
      lines.push(`- [${page.title}](${abs(markdownPublicPath(page.path))}): ${page.description.replace(/\s+/g, " ")}`);
    }
    lines.push("");
  }
  lines.push("## Interfaces");
  lines.push("");
  lines.push(`- [Search API](${abs("/api/search")}): lexical \`GET /api/search?q=\`. Not semantic search.`);
  lines.push(`- [Projects API](${abs("/api/v1/projects")}): list. \`/api/v1/projects/{slug}\` fetches one. \`/api/v1/compare?slugs=a,b\` compares.`);
  lines.push(`- [OpenAPI](${abs("/openapi.json")}): description of those GET endpoints.`);
  lines.push(`- [Developers](${abs("/developers")}): how to call the public interfaces.`);
  lines.push(`- [AGENTS.md](${abs("/AGENTS.md")}): instructions for agents reading this site.`);
  lines.push(`- [SKILL.md](${abs("/SKILL.md")}): examples and limits.`);
  lines.push("");
  return lines.join("\n");
}

export function renderLlmsFull(): string {
  return listAgentPages()
    .map((page) => page.markdown)
    .join("\n\n---\n\n");
}

/** Map a request path such as /work/foo.md or /index.md to a site path. */
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
