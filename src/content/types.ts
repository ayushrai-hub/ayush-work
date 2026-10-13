/**
 * Shared TypeScript types for every content record on Ayush Rai's personal site.
 *
 * The data modules in src/content/ export arrays or objects typed with these
 * interfaces, and src/content/index.ts re-exports them all. src/content is the
 * single source of truth: the HTML pages, the Markdown twins
 * (src/lib/agent/markdown.ts), search (src/content/searchIndex.ts +
 * src/lib/agent/search.ts), the REST API (src/lib/agent/http.ts) and the MCP
 * tools (src/lib/agent/mcpServer.ts) all read records of these shapes.
 *
 * Connects to:
 * - The data modules in src/content/ (person, now, work, products, projects,
 *   research, experience, education, leadership, recognition, ideas,
 *   principles, timeline, writing, notes, uses, elsewhere, archive,
 *   capabilities, searchIndex).
 * - src/lib/agent/projectsQuery.ts maps `Project` to the public API shape;
 *   src/lib/agent/search.ts ranks `SearchItem`.
 * - Domain dossier types live in src/content/domains.ts and policy section
 *   types in src/content/policies.ts, not here.
 */

/**
 * Kind of piece of work. Shared by `WorkItem.type` and `Project.type`; the
 * REST API and MCP `type` filter accept these values (labels in
 * `projectTypeLabels`).
 */
export type WorkType =
  | "product"
  | "project"
  | "client"
  | "experiment"
  | "open-source";

/**
 * Delivery status of a case study or project. Rendered as-is on pages and in
 * Markdown, used as a search tag, and returned in API `status` fields.
 */
export type WorkStatus =
  | "active"
  | "shipped"
  | "in-progress"
  | "paused"
  | "archived"
  | "concept";

/**
 * How far a research item went. None of these values means a peer-reviewed
 * publication.
 */
export type ResearchStatus = "Note" | "Investigation" | "Experiment";

/** Lifecycle of an entry on the /ideas page. */
export type IdeaStatus =
  | "seed"
  | "exploring"
  | "building"
  | "parked"
  | "shipped";

/**
 * Product maturity stage. Display labels live in `productStageLabels`
 * (src/content/products.ts); `Product.stageExplanation` qualifies the label.
 */
export type ProductStage =
  | "concept"
  | "building"
  | "experimental"
  | "mvp"
  | "beta"
  | "production"
  | "maintained";

/**
 * Domain category for products. Labels and display order live in
 * `productCategoryLabels` and `productCategoryOrder` (src/content/products.ts).
 */
export type ProductCategory =
  | "dpi"
  | "agrotech"
  | "platform"
  | "enterprise"
  | "brand";

/**
 * What exists, what is still moving, and what is only specified. Rendered as
 * the Implemented / Experimental / Planned sections of a product page and its
 * Markdown twin.
 */
export interface ProductMaturity {
  /** Present in code or on a live site today. */
  implemented: string[];
  /** Exists but is partial, credential-dependent, or not yet relied on. */
  experimental: string[];
  /** Intended only. Must not be described elsewhere as built. */
  planned: string[];
}

/**
 * Domain category for projects and experiments. Labels and display order live
 * in `projectCategoryLabels` and `projectCategoryOrder`
 * (src/content/projects.ts); the REST API and MCP `category` filter accept
 * these values.
 */
export type ProjectCategory =
  | "tooling"
  | "education"
  | "client"
  | "studio"
  | "web"
  | "personal";


/**
 * Kind of a /timeline entry. src/pages/TimelinePage.tsx uses it to decide
 * where `TimelineEntry.relatedSlug` links: "project" and "product" link to
 * /work/:slug, the others to their list page, and "life" never links.
 */
export type TimelineKind =
  | "education"
  | "role"
  | "project"
  | "product"
  | "leadership"
  | "recognition"
  | "life";

/**
 * Grouping for external profiles on /elsewhere. Labels and group order are
 * private to src/content/elsewhere.ts.
 */
export type ProfileCategory =
  | "code"
  | "research"
  | "writing"
  | "design"
  | "competitive"
  | "freelancing"
  | "community"
  | "social"
  | "scheduling"
  | "portfolio";

/** Heading of a capability group on /about. Also used as its search id and anchor. */
export type CapabilityDomain =
  | "Intelligence"
  | "Software"
  | "Product"
  | "Research"
  | "Leadership";

/** Kind of short note on /notes. */
export type NoteKind = "learning" | "observation" | "process" | "reflection";

/** Kind of writing entry. "external" entries carry a `url` and are hosted elsewhere. */
export type WritingKind = "essay" | "note" | "external";

/** Generic labelled link. Not referenced by any content module at present. */
export interface LinkRef {
  label: string;
  url: string;
}

/**
 * One external profile (GitHub, Medium, freelancing sites, and so on) from
 * src/content/elsewhere.ts. Rendered on /elsewhere, in /elsewhere.md, and
 * indexed for search.
 */
export interface ProfileLink {
  /** Stable key; also forms the search id `elsewhere:<id>`. */
  id: string;
  name: string;
  url: string;
  category: ProfileCategory;
  description?: string;
  /**
   * Included in `primaryElsewhere`. `person.primaryProfiles` is a separate,
   * hand-maintained object and is not derived from this flag.
   */
  primary?: boolean;
  /** Soft-archived: still listed (and in Markdown marked "(archive)") but de-emphasized. */
  archive?: boolean;
}

/**
 * Public identity of the site owner (src/content/person.ts). Read by the
 * footer, SEO/JSON-LD (src/lib/seo.ts, PageSEO), the home, about, contact and
 * resume pages, Markdown twins, llms.txt, API error bodies, the OpenAPI
 * document and the MCP server card.
 *
 * Phone numbers must never appear on public pages or in machine-readable
 * output; `phone` and `phoneDisplay` stay empty strings and a test asserts it.
 */
export interface Person {
  name: string;
  shortName: string;
  location: string;
  email: string;
  /** Withheld. Leave empty. Do not publish a number here. */
  phone: string;
  /** Withheld display form. Leave empty. */
  phoneDisplay: string;
  /** Typical reply window for contact */
  responseTime: string;
  tagline: string;
  /** Public role line. Not a ranking and not a years-of-experience claim. */
  roleTitle: string;
  positioning: string;
  /** Canonical origin. Used to build absolute URLs in Markdown, SEO tags and API records. */
  siteUrl: string;
  resumeUrl: string;
  /** Direct download (Google Drive export) */
  resumeDownloadUrl: string;
  /** Public portrait path under /public */
  portrait?: string;
  /** External life/work archive for visitors who want more depth */
  deepDive?: {
    label: string;
    url: string;
    description: string;
  };
  /** Hand-picked profile URLs used directly by pages, Markdown and llms.txt. */
  primaryProfiles: {
    github: string;
    linkedin: string;
    orcid: string;
    huggingface: string;
    medium: string;
    cal: string;
  };
  /** Verified authoritative identity URLs only (schema.org sameAs style) */
  sameAs: string[];
}

/**
 * Contents of the /now page (src/content/now.ts). Each list renders as one
 * section on the page and in /now.md; the homepage and /index.md show the
 * first three `workingOn` items.
 */
export interface NowStatus {
  /**
   * Shown as "Now section updated" on the homepage and footer and in /now.md.
   * Independent of `siteMeta.pages.now`, which drives the /now page's Updated label.
   */
  lastUpdated: string; // ISO date YYYY-MM-DD
  workingOn: string[];
  researching: string[];
  learning: string[];
  thinking: string[];
  reading: string[];
  priorities: string[];
}

/**
 * A case study under /work/:slug (src/content/work.ts). Rendered by
 * WorkPage and WorkDetailPage, mirrored in /work/:slug.md, and indexed for
 * search. Projects with `relatedWorkSlug` resolve their API `htmlUrl` here.
 */
export interface WorkItem {
  /** URL segment for /work/:slug; also used by `Project.relatedWorkSlug` and `Product.relatedWorkSlug`. */
  slug: string;
  title: string;
  type: WorkType;
  summary: string;
  problem: string;
  context: string;
  role: string;
  thinking: string;
  execution: string;
  outcome: string;
  lessons: string[];
  status: WorkStatus;
  /** Included in `selectedWork`: the homepage, /index.md and llms.txt "Case studies" list. */
  selected: boolean;
  yearStart: number;
  yearEnd?: number | "present";
  technologies: string[];
  links?: {
    demo?: string;
    github?: string;
    caseStudy?: string;
  };
  relatedSlugs?: string[];
  /**
   * Caveats about claims that are not verified. WorkDetailPage shows them in a
   * "Needs confirmation" aside; the Markdown twin omits them. Write each entry
   * as a caveat, never as a claim to be promoted.
   */
  needsConfirmation?: string[];
}

/** One dated entry on a product's /products/:slug/log page. */
export interface ProductLogEntry {
  date: string; // YYYY-MM-DD
  title: string;
  body: string;
}

/**
 * A product under /products/:slug (src/content/products.ts). Rendered by
 * ProductsPage, ProductDetailPage and ProductLogPage, mirrored in
 * /products/:slug.md and /products/:slug/log.md, and indexed for search.
 * Featured products also appear on the homepage and in llms.txt.
 */
export interface Product {
  slug: string;
  title: string;
  summary: string;
  stage: ProductStage;
  /** Precise reading of the stage. Not a completion percentage. */
  stageExplanation: string;
  /** Shown first on the homepage and products catalog. */
  featured?: boolean;
  /** Short scan labels for the homepage. Problem space or technical constraint. */
  descriptors?: string[];
  category: ProductCategory;
  /** What the product is for, in one or two sentences. */
  thesis?: string;
  /** Why this is being built, when that reason is documented. */
  why?: string;
  audience: string[];
  /** Ordered workflow steps, when the product has one. */
  workflow?: string[];
  architecture: {
    frontend?: string;
    backend?: string;
    data?: string;
    auth?: string;
    infra?: string;
    other?: string[];
  };
  maturity?: ProductMaturity;
  /** Engineering trade-offs, separate from open questions. */
  tradeoffs?: string[];
  openQuestions: string[];
  problem: string;
  approach: string;
  demoUrl?: string;
  githubUrl?: string;
  /**
   * Build log. Products with entries get a /products/:slug/log sitemap route;
   * every product's log page is still prerendered.
   */
  log: ProductLogEntry[];
  /** Slug of the matching `WorkItem` case study, if one exists. */
  relatedWorkSlug?: string;
}

/**
 * A bounded project or experiment listed on /projects (src/content/projects.ts).
 * This is the record the REST API (/api/v1/projects, /api/v1/compare) and the
 * MCP project tools expose, after src/lib/agent/projectsQuery.ts maps it to
 * the public shape.
 */
export interface Project {
  /** Stable API identifier and /projects#slug anchor. */
  slug: string;
  title: string;
  summary: string;
  type: WorkType;
  category: ProjectCategory;
  status: WorkStatus;
  yearStart: number;
  yearEnd?: number | "present";
  technologies: string[];
  links?: {
    demo?: string;
    github?: string;
  };
  /**
   * Early or lesser work. Listed under the archive section of /projects and
   * omitted from API and MCP project results unless the caller asks for
   * archived records.
   */
  archive?: boolean;
  /**
   * Slug of a `WorkItem`. When it resolves, search, Markdown and the API link
   * to /work/:slug instead of /projects#slug.
   */
  relatedWorkSlug?: string;
}

/**
 * A research note, investigation or experiment under /research/:slug
 * (src/content/research.ts). Rendered by ResearchPage and ResearchDetailPage,
 * mirrored in /research/:slug.md, and indexed for search.
 */
export interface ResearchItem {
  slug: string;
  title: string;
  status: ResearchStatus;
  summary: string;
  period: string;
  context?: string;
  methods?: string[];
  technologies: string[];
  /** Softened / provisional, not peer-reviewed claims */
  findings?: string;
  /** Explicit: this is not a peer-reviewed publication */
  disclaimer: string;
  /**
   * Unverified figures or labels for this item. ResearchDetailPage shows them
   * as a caveat list; the Markdown twin omits them.
   */
  needsConfirmation?: string[];
  /** Printed verbatim on the HTML detail page and in the Markdown twin. */
  fundingNote?: string;
}

/**
 * A paid or titled role (src/content/experience.ts). Rendered on /about and
 * /resume (and their Markdown twins), cited by the /experience dossier, and
 * indexed for search with an /about#slug link.
 */
export interface Experience {
  /** Anchor on /about; also referenced by timeline, notes and capability evidence. */
  slug: string;
  title: string;
  organization: string;
  location: string;
  start: string; // e.g. "2024-04"
  end: string | "present";
  type: "full-time" | "part-time" | "internship" | "contract" | "leadership";
  /** Adds a "current" search tag and feeds `currentExperience`. */
  current: boolean;
  /** Prose used on /about; search uses its first 180 characters as the summary. */
  narrative: string;
  /** Bullet points used on /resume and /resume.md. */
  highlights: string[];
  technologies: string[];
  link?: string;
  /** Unverified claims about this role. Not rendered by any page or agent surface today. */
  needsConfirmation?: string[];
}

/**
 * A degree or course of study (src/content/education.ts). Rendered on
 * /education, /about and /resume, their Markdown twins, and search.
 */
export interface Education {
  slug: string;
  degree: string;
  institution: string;
  location?: string;
  /** May be an empty string when the dates are unknown. */
  start: string;
  /** May be an empty string when the dates are unknown. */
  end: string;
  grade?: string;
  coursework?: string[];
  note?: string;
}

/**
 * A grounded community or extracurricular role (src/content/leadership.ts).
 * Rendered on /leadership and (first four) /about, their Markdown twins, and
 * search. Unverified leadership claims belong in `leadershipNeedsConfirmation`,
 * not here.
 */
export interface LeadershipItem {
  slug: string;
  title: string;
  organization: string;
  period: string;
  category: "community" | "events" | "social-work" | "drama" | "tech";
  narrative: string;
  skills?: string[];
  link?: string;
}

/**
 * A certificate or course completion (src/content/recognition.ts). Rendered
 * on /recognition, in /recognition.md, and indexed for search.
 */
export interface RecognitionItem {
  slug: string;
  title: string;
  issuer: string;
  /** Free-form: an ISO date or a range such as "2020–2024". */
  date: string;
  category: string;
  description: string;
  skills?: string[];
  link?: string;
  /** Included in `featuredRecognition`, the lead list on /recognition. */
  featured: boolean;
  /** Included in `archivedRecognition`; Markdown marks it "(archive)". */
  archive?: boolean;
}

/** An idea in progress on /ideas (src/content/ideas.ts), mirrored in /ideas.md and search. */
export interface Idea {
  slug: string;
  title: string;
  status: IdeaStatus;
  theme: string;
  summary: string;
  why: string;
  nextStep?: string;
}

/** A working principle on /principles (src/content/principles.ts), mirrored in /principles.md and search. */
export interface Principle {
  slug: string;
  title: string;
  statement: string;
  /** How this shows up in the work */
  inPractice: string;
}

/**
 * One row on /timeline (src/content/timeline.ts), mirrored in /timeline.md.
 * Entries are sorted newest first by string comparison of `date`.
 */
export interface TimelineEntry {
  id: string;
  date: string; // YYYY or YYYY-MM
  endDate?: string | "present";
  kind: TimelineKind;
  title: string;
  summary: string;
  /**
   * Slug of the related record. For "project" and "product" entries it must
   * be a `WorkItem` slug, because TimelinePage links it to /work/:slug.
   */
  relatedSlug?: string;
}

/**
 * A writing entry (src/content/writing.ts). External entries link out via
 * `url`; others would live at /writing/:slug. Rendered on /writing, in
 * Markdown, and in search.
 */
export interface WritingItem {
  slug: string;
  title: string;
  kind: WritingKind;
  summary: string;
  publishedAt?: string;
  url?: string;
  /** Editorial follow-up for this entry. WritingDetailPage reads it. */
  todo?: string;
}

/**
 * A short note under /notes/:slug (src/content/notes.ts). The body is plain
 * text; search and the Markdown description use its first 180 characters.
 */
export interface Note {
  slug: string;
  title: string;
  kind: NoteKind;
  publishedAt: string;
  body: string;
  relatedSlugs?: string[];
}

/** A tool on /uses (src/content/uses.ts), mirrored in /uses.md. */
export interface UseItem {
  name: string;
  category: "editor" | "runtime" | "language" | "framework" | "styling" | "hosting" | "ops" | "other";
  notes: string;
  /**
   * Tool not yet confirmed as in daily use. UsesPage and /uses.md label it
   * as unconfirmed.
   */
  todo?: boolean;
}

/** Profiles of one `ProfileCategory`, as grouped by `elsewhere` for ElsewherePage. */
export interface ElsewhereGroup {
  category: ProfileCategory;
  label: string;
  profiles: ProfileLink[];
}

/** A pointer to earlier or superseded work on /archive (src/content/archive.ts). */
export interface ArchiveItem {
  slug: string;
  title: string;
  summary: string;
  year?: number;
  /** External URL of the old site or page, when one still exists. */
  pointer?: string;
  /** Slug of the matching archived `Project`, if any. */
  relatedSlug?: string;
}

/** One named skill inside a `Capability` group. */
export interface CapabilitySkill {
  name: string;
  /**
   * Slugs of records that evidence this skill: work, product, project,
   * research, experience, leadership, idea or principle slugs. Not rendered
   * today; pages and Markdown show only `name`.
   */
  evidenceSlugs: string[];
}

/**
 * A capability group on /about (src/content/capabilities.ts), mirrored in
 * /about.md and indexed for search with an /about#capability-<domain> link.
 */
export interface Capability {
  domain: CapabilityDomain;
  summary: string;
  skills: CapabilitySkill[];
}

/**
 * One flattened record in `searchIndex` (src/content/searchIndex.ts). The
 * on-site search dialog, GET /api/v1/search, the MCP `search_portfolio` tool
 * and the WebMCP `search_portfolio_projects` tool all rank these items with
 * src/lib/agent/search.ts.
 */
export interface SearchItem {
  /** `<type>:<slug>` (or "person"); unique across the index. */
  id: string;
  title: string;
  /**
   * Record type. The API `type` filter validates against `SEARCH_TYPES` in
   * src/lib/agent/search.ts, a separate list that must stay in sync with this union.
   */
  type:
    | "person"
    | "work"
    | "product"
    | "project"
    | "research"
    | "experience"
    | "education"
    | "leadership"
    | "recognition"
    | "idea"
    | "principle"
    | "note"
    | "writing"
    | "elsewhere"
    | "capability"
    | "domain";
  summary: string;
  /** Site-relative route (or an external URL for writing and profiles). */
  href: string;
  /** Matched case-insensitively as substrings by the lexical ranker; there is no semantic ranking. */
  tags: string[];
}
