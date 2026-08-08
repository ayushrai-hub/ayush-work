/**
 * Shared content types for Ayush Rai's personal digital home.
 * Content modules under src/content/ are the single source of truth.
 */

export type WorkType =
  | "product"
  | "project"
  | "client"
  | "experiment"
  | "open-source";

export type WorkStatus =
  | "active"
  | "shipped"
  | "in-progress"
  | "paused"
  | "archived"
  | "concept";

export type ResearchStatus = "Note" | "Investigation" | "Experiment";

export type IdeaStatus =
  | "seed"
  | "exploring"
  | "building"
  | "parked"
  | "shipped";

export type ProductStage =
  | "concept"
  | "mvp"
  | "beta"
  | "production"
  | "maintained";

export type TimelineKind =
  | "education"
  | "role"
  | "project"
  | "product"
  | "leadership"
  | "recognition"
  | "life";

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

export type CapabilityDomain =
  | "Intelligence"
  | "Software"
  | "Product"
  | "Research"
  | "Leadership";

export type NoteKind = "learning" | "observation" | "process" | "reflection";

export type WritingKind = "essay" | "note" | "external";

export interface LinkRef {
  label: string;
  url: string;
}

export interface ProfileLink {
  id: string;
  name: string;
  url: string;
  category: ProfileCategory;
  description?: string;
  /** Shown in primary elsewhere / person.primaryProfiles */
  primary?: boolean;
  /** Soft-archived; still listed but de-emphasized */
  archive?: boolean;
}

export interface Person {
  name: string;
  shortName: string;
  location: string;
  email: string;
  tagline: string;
  positioning: string;
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

export interface NowStatus {
  lastUpdated: string; // ISO date YYYY-MM-DD
  workingOn: string[];
  researching: string[];
  learning: string[];
  thinking: string[];
  reading: string[];
  priorities: string[];
}

export interface WorkItem {
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
  /** Featured on homepage */
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
  /** Flag claims that still need verification before public emphasis */
  needsConfirmation?: string[];
}

export interface ProductLogEntry {
  date: string; // YYYY-MM-DD
  title: string;
  body: string;
}

export interface Product {
  slug: string;
  title: string;
  summary: string;
  stage: ProductStage;
  audience: string[];
  architecture: {
    frontend?: string;
    backend?: string;
    data?: string;
    auth?: string;
    infra?: string;
    other?: string[];
  };
  openQuestions: string[];
  problem: string;
  approach: string;
  demoUrl?: string;
  githubUrl?: string;
  log: ProductLogEntry[];
  relatedWorkSlug?: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  type: WorkType;
  status: WorkStatus;
  yearStart: number;
  yearEnd?: number | "present";
  technologies: string[];
  links?: {
    demo?: string;
    github?: string;
  };
  /** Early / lesser work */
  archive?: boolean;
  relatedWorkSlug?: string;
}

export interface ResearchItem {
  slug: string;
  title: string;
  status: ResearchStatus;
  summary: string;
  period: string;
  context?: string;
  methods?: string[];
  technologies: string[];
  /** Softened / provisional — not peer-reviewed claims */
  findings?: string;
  /** Explicit: this is not a peer-reviewed publication */
  disclaimer: string;
  needsConfirmation?: string[];
  fundingNote?: string;
}

export interface Experience {
  slug: string;
  title: string;
  organization: string;
  location: string;
  start: string; // e.g. "2024-04"
  end: string | "present";
  type: "full-time" | "part-time" | "internship" | "contract" | "leadership";
  current: boolean;
  narrative: string;
  highlights: string[];
  technologies: string[];
  link?: string;
  needsConfirmation?: string[];
}

export interface Education {
  slug: string;
  degree: string;
  institution: string;
  location?: string;
  start: string;
  end: string;
  grade?: string;
  coursework?: string[];
  note?: string;
}

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

export interface RecognitionItem {
  slug: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  description: string;
  skills?: string[];
  link?: string;
  /** Surface on public recognition section */
  featured: boolean;
  archive?: boolean;
}

export interface Idea {
  slug: string;
  title: string;
  status: IdeaStatus;
  theme: string;
  summary: string;
  why: string;
  nextStep?: string;
}

export interface Principle {
  slug: string;
  title: string;
  statement: string;
  /** How this shows up in the work */
  inPractice: string;
}

export interface TimelineEntry {
  id: string;
  date: string; // YYYY or YYYY-MM
  endDate?: string | "present";
  kind: TimelineKind;
  title: string;
  summary: string;
  relatedSlug?: string;
}

export interface WritingItem {
  slug: string;
  title: string;
  kind: WritingKind;
  summary: string;
  publishedAt?: string;
  url?: string;
  /** On-site body TBD */
  todo?: string;
}

export interface Note {
  slug: string;
  title: string;
  kind: NoteKind;
  publishedAt: string;
  body: string;
  relatedSlugs?: string[];
}

export interface UseItem {
  name: string;
  category: "editor" | "runtime" | "language" | "framework" | "styling" | "hosting" | "ops" | "other";
  notes: string;
  /** Mark tools not yet confirmed in daily use */
  todo?: boolean;
}

export interface ElsewhereGroup {
  category: ProfileCategory;
  label: string;
  profiles: ProfileLink[];
}

export interface ArchiveItem {
  slug: string;
  title: string;
  summary: string;
  year?: number;
  pointer?: string;
  relatedSlug?: string;
}

export interface CapabilitySkill {
  name: string;
  /** Work / product / project slugs that evidence this skill */
  evidenceSlugs: string[];
}

export interface Capability {
  domain: CapabilityDomain;
  summary: string;
  skills: CapabilitySkill[];
}

export interface SearchItem {
  id: string;
  title: string;
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
    | "capability";
  summary: string;
  href: string;
  tags: string[];
}
