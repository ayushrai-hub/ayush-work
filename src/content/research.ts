import type { ResearchItem } from "./types";

/**
 * Research-shaped work. Status is Note | Investigation | Experiment.
 * These are NOT peer-reviewed publications. Soften unverified metrics.
 */
export const research: ResearchItem[] = [
  {
    slug: "agri-advisory-ai",
    title: "AI-assisted agricultural advisory exploration",
    status: "Experiment",
    summary:
      "Exploring how satellite imagery, soil/weather signals, and models might support farming recommendations — early prototype work, not a deployed national system.",
    period: "2024-01 – present",
    context:
      "Tied to learning under the IIT Madras BS Data Science track. Scope has been exploratory rather than a formal lab publication.",
    methods: [
      "Computer vision / imagery pipelines (exploratory)",
      "Sensor and weather data fusion (partial)",
      "Prototype recommendation UX",
    ],
    technologies: ["Python", "TensorFlow", "Satellite APIs", "Computer Vision"],
    findings:
      "Built toward a working prototype path. Earlier portfolio text claimed '20+ farmers' and '85% accuracy' — those numbers are not verified here and should not be cited until confirmed.",
    disclaimer:
      "Not a peer-reviewed paper. Treat as an investigation/experiment log.",
    fundingNote: "Mentioned in older materials as IIT Madras BS Program context — confirm framing before grant-style claims.",
    needsConfirmation: [
      "Farmer pilot count",
      "Prediction accuracy figures",
      "Deployment status beyond prototype",
    ],
  },
  {
    slug: "legal-nlp-contracts",
    title: "NLP for legal document analysis",
    status: "Investigation",
    summary:
      "Investigated NLP pipelines for contract and regulatory text — document structure, retrieval, and assisted review rather than autonomous legal advice.",
    period: "2023-08 – 2023-12",
    context:
      "Internal / academic exploration (older materials cited LNCT internal research grant — verify before emphasizing).",
    methods: [
      "Transformer-based classification / extraction experiments",
      "Pipeline sketches for review assistance",
    ],
    technologies: ["Python", "Transformers", "BERT", "Legal NLP"],
    findings:
      "Useful learning on domain text and evaluation pitfalls. Softened from earlier claims of '60% time reduction' and '10,000+ documents' until those can be evidenced.",
    disclaimer:
      "Not a peer-reviewed publication or production legal tool. Not legal advice.",
    fundingNote: "LNCT Internal Research Grant — needsConfirmation.",
    needsConfirmation: [
      "Document volume processed",
      "Time-reduction measurements",
      "Grant labeling",
    ],
  },
  {
    slug: "smart-campus-energy",
    title: "Smart campus energy monitoring notes",
    status: "Note",
    summary:
      "Notes and early work around IoT-style energy monitoring and a dashboard for campus buildings — learning project more than a city-scale rollout.",
    period: "2023-03 – 2023-08",
    context:
      "Older copy referenced 'Bhopal Smart City Initiative' funding — keep that claim provisional.",
    methods: [
      "Sensor network concepts",
      "Basic ML for anomaly / optimization sketches",
      "Web dashboard prototype",
    ],
    technologies: ["IoT", "Machine Learning", "Sensor Networks", "Web Dashboard"],
    findings:
      "Produced learning artifacts and a monitoring dashboard direction. Softened from '15% energy savings' until measurement methodology is confirmed.",
    disclaimer:
      "Not peer-reviewed. Not a municipal deployment claim.",
    fundingNote: "BHOPAL SMART CITY INITIATIVE — needsConfirmation.",
    needsConfirmation: [
      "Energy savings percentage",
      "Institutional partnership / funding label",
      "Scale of sensor deployment",
    ],
  },
];

/**
 * Awards previously listed on the research page with thin public evidence.
 * Kept out of primary research[] until confirmed.
 */
export const researchAwardsNeedsConfirmation: string[] = [
  "Top 5 Finalist - Smart India Hackathon 2024 (blockchain voting narrative)",
  "Best Research Paper Award - National Conference on Emerging Technologies (2023)",
  "ACM Student Research Competition Finalist - CCSE 2023",
];

export function getResearchBySlug(slug: string): ResearchItem | undefined {
  return research.find((r) => r.slug === slug);
}
