import type { Experience } from "./types";

export const experience: Experience[] = [
  {
    slug: "focdot-sde-ai",
    title: "SDE — AI Engineer",
    organization: "FoCDoT Technologies Pvt. Ltd",
    location: "Remote",
    start: "2024-04",
    end: "2025-08",
    type: "full-time",
    current: false,
    narrative:
      "I worked on AI engineering and technical evaluation at FoCDoT from April 2024 to August 2025. The work involved reviewing model outputs against evaluation criteria and analyzing coding and STEM tasks.",
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
      "Through Outlier, I have contributed to generative AI evaluation workflows — dataset quality for LLM training, prompting strategies for Python/JavaScript tasks, and review loops that catch brittle model behavior. It is hands-on evaluation and improvement work, not a keynote role.",
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
      "I spent a year as a Student Developer Champion around RPA and automation — workshops, mentoring, and community events. The useful part was learning how to teach tooling without turning sessions into vendor theater.",
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
      "A structured virtual internship covering CRM concepts and Salesforce platform fundamentals — projects, ecosystem orientation, and certification-oriented learning rather than a long production tenure.",
    highlights: [
      "CRM and cloud project coursework",
      "Salesforce platform fundamentals",
      "Certification-oriented practice",
    ],
    technologies: ["Salesforce", "CRM", "Cloud", "Apex"],
    link: "https://drive.google.com/file/d/1WQIAEc7387yi-bh6Eq4LqtCZd4RnGqR7/view?usp=sharing",
  },

];

export const currentExperience = experience.filter((e) => e.current);

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experience.find((e) => e.slug === slug);
}
