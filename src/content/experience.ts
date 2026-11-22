/**
 * Paid roles, internships and titled programs.
 *
 * `experience` is a flat list in display order (not strictly chronological).
 * Each role has a narrative for /about, bullet
 * highlights for /resume, and technologies used as search tags. Ended roles
 * keep `current: false` and a concrete `end` month.
 *
 * Connects to:
 * - AboutPage, ResumePage and DomainPage (the /experience dossier and others).
 * - Markdown twins /about.md and /resume.md; search items of type
 *   "experience" linking to /about#slug.
 * - Slugs are cited by timeline.ts, notes.ts and capabilities.ts.
 * - Uses `Experience` from types.ts.
 */
import type { Experience } from "./types";

/** All roles, in display order. */
export const experience: Experience[] = [
  {
    slug: "focdot-sde-ai",
    title: "SDE, AI Engineer",
    organization: "FoCDoT Technologies Pvt. Ltd",
    location: "Remote",
    start: "2024-04",
    end: "2025-08",
    type: "full-time",
    current: false,
    narrative:
      "AI engineering and technical evaluation at FoCDoT. Review model outputs against criteria. Analyze coding and STEM tasks when the answer has to be right, not just fluent.",
    highlights: [
      "RLHF-oriented evaluation and model reliability work",
      "STEM and coding-task analysis for generative systems",
    ],
    technologies: [
      "Python",
      "RLHF",
      "Machine Learning",
      "LLM evaluation",
      "STEM analysis",
    ],
  },
  {
    slug: "outlier-genai",
    title: "AI evaluation contributor (contract)",
    organization: "Outlier",
    location: "Remote",
    start: "2025-08",
    end: "present",
    type: "part-time",
    current: true,
    narrative:
      "Contract evaluation for frontier-lab programs through Outlier. Dataset quality, prompting for Python and JavaScript tasks, and review of model behavior that breaks under a real check. The labs are not the employer.",
    highlights: [
      "LLM training dataset and optimization workflows",
      "Prompting strategies for Python / JavaScript tasks",
      "Evaluation work for frontier-lab programs (contract)",
      "Code review, testing, and debugging of model outputs",
    ],
    technologies: [
      "Python",
      "JavaScript",
      "LLMs",
      "Prompt engineering",
      "ML tooling",
    ],
  },
  {
    slug: "uipath-champion",
    title: "Student Developer Champion",
    organization: "UiPath",
    location: "Remote",
    start: "2022-07",
    end: "2023-07",
    type: "leadership",
    current: false,
    narrative:
      "Student Developer Champion for RPA and automation. Workshops, mentoring, and community events. The useful part was teaching the tool without turning the room into a sales pitch.",
    highlights: [
      "Community workshops on automation / RPA",
      "Mentoring students exploring UiPath",
      "Hackathons and educational content",
    ],
    technologies: ["UiPath", "RPA", "Community management", "Workshop delivery"],
    link: "https://drive.google.com/file/d/1Nx4TJZIvOUrA12zj0JuXeZGHhDgBDCPp/view?usp=sharing",
  },
  {
    slug: "salesforce-virtual",
    title: "Virtual Intern",
    organization: "Salesforce",
    location: "Remote",
    start: "2022-10",
    end: "2022-12",
    type: "internship",
    current: false,
    narrative:
      "Virtual internship on CRM concepts and Salesforce platform fundamentals. Coursework, platform orientation, and certification practice.",
    highlights: [
      "CRM and cloud project coursework",
      "Salesforce platform fundamentals",
      "Certification-oriented practice",
    ],
    technologies: ["Salesforce", "CRM", "Cloud", "Apex"],
    link: "https://drive.google.com/file/d/1WQIAEc7387yi-bh6Eq4LqtCZd4RnGqR7/view?usp=sharing",
  },

];