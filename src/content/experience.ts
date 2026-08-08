import type { Experience } from "./types";

export const experience: Experience[] = [
  {
    slug: "focdot-sde-ai",
    title: "SDE — AI Engineer",
    organization: "FoCDoT Technologies Pvt. Ltd",
    location: "Remote",
    start: "2024-04",
    end: "present",
    type: "full-time",
    current: true,
    narrative:
      "I work on AI engineering with a focus on reinforcement learning from human feedback (RLHF) style workflows — evaluating model behavior, improving reliability on technical tasks, and tightening feedback loops for generative systems. The day-to-day is less 'demo magic' and more careful judgment on outputs, STEM-heavy task analysis, and iteration with evaluation criteria.",
    highlights: [
      "RLHF-oriented evaluation and model reliability work",
      "STEM and coding-task analysis for generative systems",
      "Ongoing collaboration across AI data / evaluation ecosystems",
    ],
    technologies: [
      "Python",
      "RLHF",
      "Machine Learning",
      "LLM evaluation",
      "STEM analysis",
    ],
    // Older copy: "Collaborated with industry leaders: Turing, OpenAI, ScaleAI, Outlier"
    // Softened — vendor/client brand proximity ≠ public partnership claim
    needsConfirmation: [
      "Public characterization of relationships with Turing, OpenAI, Scale AI, and similar orgs — confirm what can be named vs. general ecosystem work",
    ],
  },
  {
    slug: "outlier-genai",
    title: "Generative AI Engineer",
    organization: "Outlier",
    location: "Remote",
    start: "2025-08",
    end: "present",
    type: "part-time",
    current: true,
    narrative:
      "Alongside FoCDoT, I contribute to generative AI workflows at Outlier — dataset quality for LLM training, prompting strategies for Python/JavaScript tasks, and review loops that catch brittle model behavior. It is hands-on evaluation and improvement work, not a keynote role.",
    highlights: [
      "LLM training dataset and optimization workflows",
      "Prompting strategies for Python / JavaScript tasks",
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
    slug: "rasor-iitm",
    title: "Web Developer",
    organization: "RaSoR — IIT Madras",
    location: "Chennai, India",
    start: "2023-12",
    end: "2024-06",
    type: "internship",
    current: false,
    narrative:
      "I built and maintained responsive web surfaces for research-related initiatives — collaborating with research teams on documentation and keeping platforms current. Good practice in shipping under research constraints rather than product marketing timelines.",
    highlights: [
      "Responsive web apps for research initiatives",
      "Technical documentation with research teams",
      "Maintenance of existing research web platforms",
    ],
    technologies: ["React", "TypeScript", "Node.js", "Web development"],
    // Exact end month was "Ended" in UI — approximate if needed
    needsConfirmation: ["Exact end date of internship"],
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
  {
    slug: "kanha-webops",
    title: "WebOps Member",
    organization: "Kanha House, IIT Madras",
    location: "Chennai, India",
    start: "2022-09",
    end: "2023-07",
    type: "part-time",
    current: false,
    narrative:
      "I helped run house digital infrastructure — website updates, social content, and tech support for events. Small ops work teaches ownership: if the site is wrong, people notice quickly.",
    highlights: [
      "House website and digital maintenance",
      "Social / content coordination",
      "Technical support for house events",
    ],
    technologies: [
      "Web development",
      "Content ops",
      "Social media management",
    ],
    link: "https://drive.google.com/file/d/1Q5uEpe9Q3XrGR_FBpy3pbxzZZRYUk2VG/view?usp=sharing",
  },
];

export const currentExperience = experience.filter((e) => e.current);

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experience.find((e) => e.slug === slug);
}
