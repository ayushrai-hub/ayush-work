import type { RecognitionItem } from "./types";

/**
 * Certifications from Certifications.tsx — featured vs archive.
 * No vanity "100% verified" stats here; links are Drive-hosted copies.
 */
export const recognition: RecognitionItem[] = [
  {
    slug: "cisco-cyberops-associate",
    title: "CyberOps Associate",
    issuer: "Cisco Networking Academy",
    date: "2023-07-04",
    category: "Cybersecurity",
    description:
      "Cybersecurity operations fundamentals — threat analysis, incident response, and monitoring concepts.",
    skills: [
      "Network security",
      "Incident response",
      "Linux / Windows basics",
    ],
    link: "https://drive.google.com/file/d/1cYU351AbShDaJlv8z8pAyaV2CmuKMHq9/view?usp=sharing",
    featured: true,
  },
  {
    slug: "google-cloud-30-days",
    title: "30 Days of Google Cloud",
    issuer: "Google Cloud",
    date: "2020–2024",
    category: "Cloud Computing",
    description:
      "Structured Google Cloud training program covering cloud and ML/data-oriented labs.",
    skills: ["Google Cloud", "Python", "ML labs", "Data analysis"],
    link: "https://drive.google.com/file/d/1VCcOhp_OW1qVUVbB5pUadznZuceHxLzF/view?usp=sharing",
    featured: true,
  },
  {
    slug: "aws-intro-ml",
    title: "Introduction to Machine Learning",
    issuer: "AWS Training & Certification",
    date: "2021-04-27",
    category: "Machine Learning",
    description: "Introductory AWS ML fundamentals course completion.",
    skills: ["Machine Learning"],
    link: "https://drive.google.com/file/d/1LHtAR2zdBEUHYe1oQC_ZNeeO1-UQ4YCQ/view",
    featured: true,
  },
  {
    slug: "cisco-intro-cybersecurity",
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "2023-02-10",
    category: "Cybersecurity",
    description: "Foundational cybersecurity principles and practices.",
    skills: ["Cybersecurity"],
    link: "https://drive.google.com/file/d/1dR5JkyQiC66W5lu_7c9PJbhNccVoCMDT/view?usp=sharing",
    featured: true,
  },
  {
    slug: "coursera-data-everywhere",
    title: "Foundations: Data, Everywhere",
    issuer: "Coursera",
    date: "2022-03-04",
    category: "Data Science",
    description: "Foundational data literacy and analytics concepts.",
    skills: ["Data Science"],
    link: "https://drive.google.com/file/d/1SdTEH72nLWGtL50vYh_tH7Fhj_JJ881J/view?usp=sharing",
    featured: false,
    archive: true,
  },
  {
    slug: "cisco-packet-tracer",
    title: "Introduction to Packet Tracer",
    issuer: "Cisco Networking Academy",
    date: "2023-01-25",
    category: "Cybersecurity",
    description: "Network simulation fundamentals using Packet Tracer.",
    skills: ["Networking", "Packet Tracer"],
    link: "https://drive.google.com/file/d/1_CIDIlPRbNR9rhwgaAFLQlRe9rJqC_qN/view?usp=sharing",
    featured: false,
    archive: true,
  },
  {
    slug: "lncts-leadership-talent",
    title: "Leadership and Talent Management",
    issuer: "Lakshmi Narain College of Technology & Science, Bhopal",
    date: "2021-05-11",
    category: "Leadership",
    description: "College leadership and talent management training certificate.",
    skills: ["Leadership"],
    link: "https://drive.google.com/file/d/1KLQRhZWKtZP3wUTHWhpk1aBBVOUhiKL-/view",
    featured: false,
    archive: true,
  },
];

export const featuredRecognition = recognition.filter((r) => r.featured);
export const archivedRecognition = recognition.filter((r) => r.archive);
