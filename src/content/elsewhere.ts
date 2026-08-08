import type { ElsewhereGroup, ProfileLink } from "./types";

/**
 * Reorganized from profilesData.ts.
 * Excludes WhatsApp / phone. Primary vs archive flagged per link.
 */
export const elsewhereProfiles: ProfileLink[] = [
  // Code
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/ayushrai-hub",
    category: "code",
    description: "Open-source projects and repositories",
    primary: true,
  },
  {
    id: "leetcode",
    name: "LeetCode",
    url: "https://leetcode.com/ayushrai0211",
    category: "competitive",
    description: "Problem-solving practice",
  },
  {
    id: "geeksforgeeks",
    name: "GeeksforGeeks",
    url: "https://www.geeksforgeeks.org/user/ayushrai0211/",
    category: "competitive",
    description: "Coding practice and articles",
  },
  {
    id: "unstop",
    name: "Unstop",
    url: "https://unstop.com/u/ayushrai4939",
    category: "competitive",
    description: "Competitions and challenges",
  },

  // Research / ML
  {
    id: "orcid",
    name: "ORCID",
    url: "https://orcid.org/0009-0005-7341-7856",
    category: "research",
    description: "Research identifier",
    primary: true,
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    url: "https://huggingface.co/ayushrai02",
    category: "research",
    description: "Models and ML artifacts",
    primary: true,
  },
  {
    id: "kaggle",
    name: "Kaggle",
    url: "https://www.kaggle.com/ayushrai02",
    category: "research",
    description: "Data science notebooks and competitions",
  },
  {
    id: "opentrain-ai",
    name: "OpenTrain AI",
    url: "https://www.opentrain.ai/profile/ayush-r-5",
    category: "research",
    description: "AI data labeling profile",
  },
  {
    id: "data-science-portfolio",
    name: "Data Science Portfolio",
    url: "https://www.datascienceportfol.io/ayushrai0211",
    category: "research",
    description: "Curated data science projects",
    archive: true,
  },

  // Writing
  {
    id: "medium",
    name: "Medium",
    url: "https://medium.com/@ayushrai0211",
    category: "writing",
    description: "Technical and personal writing",
    primary: true,
  },
  {
    id: "substack",
    name: "Substack",
    url: "https://substack.com/@ayushrai02",
    category: "writing",
    description: "Newsletter / longer-form",
  },
  {
    id: "quora",
    name: "Quora",
    url: "https://www.quora.com/profile/Ayush-Rai-751",
    category: "writing",
    description: "Q&A",
    archive: true,
  },
  {
    id: "blogger",
    name: "Blogger",
    url: "https://ayushrai02.blogspot.com/",
    category: "writing",
    description: "Older personal blog",
    archive: true,
  },

  // Design
  {
    id: "behance",
    name: "Behance",
    url: "https://www.behance.net/ayushrai17",
    category: "design",
    description: "Design portfolio",
  },
  {
    id: "dribbble",
    name: "Dribbble",
    url: "https://dribbble.com/ayushrai",
    category: "design",
    description: "UI shots",
  },
  {
    id: "designcrowd",
    name: "DesignCrowd",
    url: "https://www.designcrowd.com/designer/1663180/ayushrai02/about",
    category: "design",
    description: "Design marketplace profile",
    archive: true,
  },

  // Freelancing
  {
    id: "upwork",
    name: "Upwork",
    url: "https://www.upwork.com/freelancers/~0154ec8cf0990e80bc?mp_source=share",
    category: "freelancing",
    description: "Freelance development",
  },
  {
    id: "fiverr",
    name: "Fiverr",
    url: "https://www.fiverr.com/ayush_rai02?public_mode=true",
    category: "freelancing",
    description: "Freelance services",
  },
  {
    id: "braintrust",
    name: "Braintrust",
    url: "https://app.usebraintrust.com/talent/1859806/",
    category: "freelancing",
    description: "Talent network",
  },
  {
    id: "expert360",
    name: "Expert360",
    url: "https://app.expert360.com/profile/776c3e9214",
    category: "freelancing",
    description: "Consulting network",
  },
  {
    id: "workana",
    name: "Workana",
    url: "https://www.workana.com/freelancer/052bc40cbb5e205f5b39bbf629409be3",
    category: "freelancing",
    description: "Freelance marketplace",
    archive: true,
  },
  {
    id: "guru",
    name: "Guru",
    url: "https://www.guru.com/freelancers/ayushrai02",
    category: "freelancing",
    description: "Freelance marketplace",
    archive: true,
  },
  {
    id: "peopleperhour",
    name: "PeoplePerHour",
    url: "https://www.peopleperhour.com/freelancer/ayush-rai-zymqwwmm",
    category: "freelancing",
    description: "Freelance marketplace",
    archive: true,
  },
  {
    id: "codementor",
    name: "Codementor",
    url: "https://www.codementor.io/@ayushrai188327",
    category: "freelancing",
    description: "Mentorship marketplace",
    archive: true,
  },
  {
    id: "lemonio",
    name: "Lemon.io",
    url: "https://magic.lemon.io/share/candidate?id=68c09bc7d31295bad67a375f&availability=Full-time%20only",
    category: "freelancing",
    description: "Startup hiring marketplace",
    archive: true,
  },

  // Community / professional
  {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/ayushrai02/",
    category: "community",
    description: "Professional network",
    primary: true,
  },
  {
    id: "salesforce-trailblazer",
    name: "Salesforce Trailblazer",
    url: "https://www.salesforce.com/trailblazer/ayushr02",
    category: "community",
    description: "Salesforce learning profile",
  },
  {
    id: "opentakshashila",
    name: "OpenTakshashila",
    url: "https://opentakshashila.net/members/35694678",
    category: "community",
    description: "Professional community",
  },
  {
    id: "producthunt",
    name: "Product Hunt",
    url: "https://www.producthunt.com/@ayush_rai02",
    category: "community",
    description: "Product discovery profile",
  },

  // Scheduling
  {
    id: "cal",
    name: "Cal.com",
    url: "https://cal.com/ayush-rai-02",
    category: "scheduling",
    description: "Book a conversation",
    primary: true,
  },

  // Portfolio mirrors
  {
    id: "notion-portfolio",
    name: "Notion Portfolio",
    url: "https://www.notion.so/Ayush-s-Portfolio-5d069b2fa8b64d7e8b939a0c9b946e7b",
    category: "portfolio",
    description: "Earlier Notion portfolio",
    archive: true,
  },
  {
    id: "super-site",
    name: "Super Site",
    url: "https://ayush-rai.super.site/",
    category: "portfolio",
    description: "Earlier personal site",
    archive: true,
  },
  {
    id: "linktree",
    name: "Linktree",
    url: "https://linktr.ee/ayush_rai02",
    category: "portfolio",
    description: "Link hub",
    archive: true,
  },
  {
    id: "mylifeos",
    name: "MyLifeOS",
    url: "https://thelifeofayush.vercel.app/sites/www/",
    category: "portfolio",
    description: "Personal life/systems site",
  },

  // Social — no WhatsApp / phone
  {
    id: "twitter",
    name: "Twitter / X",
    url: "https://x.com/AyushRai0211",
    category: "social",
    description: "Public updates",
  },
  {
    id: "bluesky",
    name: "Bluesky",
    url: "https://bsky.app/profile/ayush-rai.bsky.social",
    category: "social",
    description: "Decentralized social",
  },
  {
    id: "youtube",
    name: "YouTube",
    url: "https://www.youtube.com/@ayush_rai02",
    category: "social",
    description: "Video content",
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/ayush_rai02/",
    category: "social",
    description: "Photos and stories",
  },
  {
    id: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com/people/Ayush-Rai/pfbid02ha7vx1uEQ8tgakypf3A5U7uzpgJykuEVQffwPPqy9BnLhmz1g4aTeE93SdFuAvH1l/",
    category: "social",
    description: "Social network",
    archive: true,
  },
];

const categoryLabels: Record<string, string> = {
  code: "Code",
  research: "Research & ML",
  writing: "Writing",
  design: "Design",
  competitive: "Competitive",
  freelancing: "Freelancing",
  community: "Community",
  social: "Social",
  scheduling: "Scheduling",
  portfolio: "Portfolio mirrors",
};

const categoryOrder = [
  "code",
  "research",
  "writing",
  "design",
  "competitive",
  "freelancing",
  "community",
  "scheduling",
  "social",
  "portfolio",
] as const;

export const elsewhere: ElsewhereGroup[] = categoryOrder.map((category) => ({
  category,
  label: categoryLabels[category],
  profiles: elsewhereProfiles.filter((p) => p.category === category),
}));

export const primaryElsewhere = elsewhereProfiles.filter((p) => p.primary);
export const archivedElsewhere = elsewhereProfiles.filter((p) => p.archive);
