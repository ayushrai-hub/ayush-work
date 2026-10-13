/**
 * Community, volunteering and extracurricular roles, plus a withheld list of unverified leadership claims.
 *
 * `leadership` holds only grounded roles, described without reach metrics.
 * `leadershipNeedsConfirmation` holds older claims that are deliberately not
 * published.
 *
 * Connects to:
 * - LeadershipPage (all entries) and AboutPage (first four).
 * - Markdown twins /leadership.md and /about.md (first four); search items of
 *   type "leadership".
 * - Slugs are cited by timeline.ts and capabilities.ts.
 * - src/__tests__/agentSurfaces.test.ts checks that no entry of
 *   `leadershipNeedsConfirmation` appears in llms.txt or llms-full.txt.
 * - Uses `LeadershipItem` from types.ts.
 */
import type { LeadershipItem } from "./types";

/**
 * Grounded extracurriculars and community roles only.
 * Inflated GDSC / Microsoft / generic "1000+ students" claims live in
 * `leadershipNeedsConfirmation`, not here.
 */
export const leadership: LeadershipItem[] = [
  {
    slug: "bachpanshala",
    title: "Member-tutor — BachpanShala",
    organization: "We Care / BachpanShala",
    period: "2022-06 – 2023-01",
    category: "social-work",
    narrative:
      "Tutored and supported educational work for children through BachpanShala under We Care. The work was local and practical — showing up, teaching, and helping ops — not a scaled edtech claim.",
    skills: ["Teaching", "Empathy", "Teamwork", "Operations"],
  },
  {
    slug: "we-care",
    title: "Volunteer — We Care",
    organization: "We Care",
    period: "2022-06 – 2023-01",
    category: "social-work",
    narrative:
      "Community welfare volunteering alongside BachpanShala — outreach and social service rather than a titled executive role.",
    skills: ["Community outreach", "Volunteering", "Teamwork"],
  },
  {
    slug: "mun-lnct",
    title: "Core member — Model United Nations",
    organization: "LNCT Group of Colleges, Bhopal",
    period: "2022-03 – 2022-09",
    category: "events",
    narrative:
      "Core organizing for the college MUN — outreach, coordination, and conference operations for an international-relations simulation.",
    skills: ["Leadership", "Sales/outreach", "Operations", "Communication"],
  },
  {
    slug: "curious-org",
    title: "Management team member",
    organization: "The Curious Organization",
    period: "2022-05 – 2022-11",
    category: "community",
    narrative:
      "Supported organizational management and coordination. Kept scope honest: contribution to ops and planning, not founder mythology.",
    skills: ["Project coordination", "Communication", "Team management"],
  },
  {
    slug: "raahat",
    title: "Volunteer & member — Raahat",
    organization: "Raahat — LNCT Group",
    period: "2022-11 – 2023-07",
    category: "social-work",
    narrative:
      "Member of Raahat (Be The Change Maker) contributing to social impact initiatives and campus community work.",
    skills: ["Community engagement", "Event organization", "Collaboration"],
  },
  {
    slug: "dragonfly-festival",
    title: "Volunteer — Dragonfly Festival",
    organization: "WWF India",
    period: "2022-07 – 2023-05",
    category: "social-work",
    narrative:
      "Participated in WWF India's Dragonfly Festival work around environmental awareness and outreach.",
    skills: ["Environmental education", "Outreach", "Event support"],
  },
  {
    slug: "hack2skill",
    title: "Volunteer — Hack2Skill",
    organization: "Hack2Skill",
    period: "2022-07 – 2022-08",
    category: "events",
    narrative:
      "Short volunteer stint supporting coding and skill-building event operations.",
    skills: ["Event coordination", "Technical support", "Community building"],
  },
  {
    slug: "uipath-champion-leadership",
    title: "Student Developer Champion",
    organization: "UiPath",
    period: "2022-07 – 2023-07",
    category: "tech",
    narrative:
      "Campus / community champion role for RPA education — workshops and mentoring. Certificate linked from experience content.",
    skills: ["Workshop delivery", "Mentoring", "RPA"],
    link: "https://drive.google.com/file/d/1Nx4TJZIvOUrA12zj0JuXeZGHhDgBDCPp/view?usp=sharing",
  },
];

/**
 * Withheld: leadership claims with large unverified metrics. Do not surface
 * them as public fact until confirmed, and do not copy them into pages,
 * Markdown, search, API or MCP output. No current page or agent surface
 * renders this list; a test asserts it is absent from llms.txt and
 * llms-full.txt.
 */
export const leadershipNeedsConfirmation: string[] = [
  "Google Developer Student Club Lead — '200+ developers', '50+ workshops', '95% satisfaction', '1000+ students'",
  "Microsoft Learn Student Ambassador — '50K+ students reached', Azure hackathons as regional ambassador",
  "Digital Skills Training Coordinator — '200+ trainees', '15+ partner orgs'",
  "Open Source Workshop Series — '25+ workshops', '500+ contributors'",
  "Community Tech Outreach with local government — program ownership claims",
  "Workshop participant counts (150 / 80 / 300 / 200 / 120) without attendance records linked",
];
