import type { Person } from "./types";

/**
 * Public identity — no phone numbers in this file.
 */
export const person: Person = {
  name: "Ayush Rai",
  shortName: "Ayush",
  location: "Bhopal, India",
  email: "ayushrai0211@gmail.com",
  tagline:
    "I build software and AI systems that try to be useful in the real world — civil society tooling, education platforms, and careful model evaluation.",
  positioning:
    "I'm an AI-focused software engineer based in Bhopal. Day to day I work on RLHF-style evaluation and generative AI workflows, and on the side I ship products and client sites — from an early Digital Public Infrastructure concept for NGOs to education and agrotech MVPs. I care more about clear problem framing and shipped learning than about sounding futuristic.",
  siteUrl: "https://ayush-me.netlify.app",
  resumeUrl:
    "https://drive.google.com/file/d/1JdAckW6i057eYNpdRVLYDMFp2Xo5vyJs/view?usp=sharing",
  resumeDownloadUrl:
    "https://drive.google.com/uc?export=download&id=1JdAckW6i057eYNpdRVLYDMFp2Xo5vyJs",
  portrait: "/IMG_0029.jpeg",
  deepDive: {
    label: "MyLifeOS",
    url: "https://thelifeofayush.vercel.app/sites/www/",
    description:
      "A longer personal archive — more of the life, work, and context behind this site.",
  },
  primaryProfiles: {
    github: "https://github.com/ayushrai-hub",
    linkedin: "https://www.linkedin.com/in/ayushrai02/",
    orcid: "https://orcid.org/0009-0005-7341-7856",
    huggingface: "https://huggingface.co/ayushrai02",
    medium: "https://medium.com/@ayushrai0211",
    cal: "https://cal.com/ayush-rai-02",
  },
  // Authoritative / identity URLs only — not every social profile
  sameAs: [
    "https://github.com/ayushrai-hub",
    "https://www.linkedin.com/in/ayushrai02/",
    "https://orcid.org/0009-0005-7341-7856",
    "https://huggingface.co/ayushrai02",
    "https://medium.com/@ayushrai0211",
    "https://x.com/AyushRai0211",
  ],
};
