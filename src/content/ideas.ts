import type { Idea } from "./types";

/**
 * Ideas derived from real work themes — not startup Mad Libs.
 */
export const ideas: Idea[] = [
  {
    slug: "consent-first-ngo-discovery",
    title: "Consent-first NGO discovery",
    status: "building",
    theme: "Civil society DPI",
    summary:
      "A discovery layer where organizations control what is visible, and donors see progressive verification instead of scraped directories.",
    why: "Open Framework work keeps hitting the same wall: trust without surveillance.",
    nextStep: "Prototype a single verification tier and audit log story.",
  },
  {
    slug: "agrotech-lead-to-datasheet",
    title: "Lead → datasheet vertical slice",
    status: "building",
    theme: "Agrotech",
    summary:
      "Turn product interest into a structured lead plus an auto-generated datasheet before building a full shop.",
    why: "AyushMushrooms buyers need specifics; carts can wait.",
    nextStep: "Harden PDF generation and CRM webhook reliability.",
  },
  {
    slug: "peer-acknowledgement-loops",
    title: "Peer acknowledgement loops in learning",
    status: "exploring",
    theme: "Education platforms",
    summary:
      "Design learning products around recognition of progress between peers, not only streaks or course completion.",
    why: "Shiksha-Mitra's core insight is cultural, not curricular.",
    nextStep: "Sketch two acknowledgement UX patterns and test with a small group.",
  },
  {
    slug: "code-eval-rubrics",
    title: "Honest rubrics for code-oriented LLM eval",
    status: "exploring",
    theme: "RLHF / evaluation",
    summary:
      "Make evaluation criteria for code tasks explicit — correctness, edge cases, security smell — so feedback isn't vibes-only.",
    why: "Day job RLHF work depends on judgment quality more than model name-dropping.",
    nextStep: "Write a one-page rubric for Python/JS tasks used in review.",
  },
  {
    slug: "india-stack-for-civil-society",
    title: "India-stack lessons for civil society tooling",
    status: "seed",
    theme: "India tech",
    summary:
      "Study what made UPI/DigiLocker durable (incentives, standards, ops) and what does not transfer to NGO contexts.",
    why: "DPI metaphors are powerful and easy to misuse.",
    nextStep: "Short reading notes comparing incentive structures.",
  },
  {
    slug: "extension-as-lab",
    title: "Browser extensions as product labs",
    status: "parked",
    theme: "Software craft",
    summary:
      "Use small Manifest V3 tools to learn permission UX and DOM edge cases without a full SaaS shell.",
    why: "Overlay Text Box proved how much signal a tiny tool can give.",
    nextStep: "List next extension ideas that solve a personal itch first.",
  },
  {
    slug: "studio-without-hype",
    title: "Studio positioning without delivery theater",
    status: "seed",
    theme: "Product / collective",
    summary:
      "How a small interdisciplinary collective can describe services without '5x' or 'transformative' language.",
    why: "Expert-O taught how fast copy can outrun capacity.",
    nextStep: "Rewrite service blurbs against actual shipped work.",
  },
];
