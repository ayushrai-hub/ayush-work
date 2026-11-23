/**
 * Operating manual for `/how-i-work`: rapid learning methodology, reading habits, business & UX
 * instincts, high-agency teamwork, feedback loops, and live work image/video showcase slots.
 *
 * Single source of truth for how Ayush approaches unfamiliar technology at startup pace without
 * sacrificing accuracy, how he collaborates and handles critique, and where live work screenshots
 * and YouTube/Loom/Vimeo walkthrough videos are registered. Adding a new photo or video only
 * requires updating `liveWorkImages` or `liveWorkVideos` here; the HTML page, `/about` preview,
 * and `/how-i-work.md` stay in sync automatically.
 *
 * Connects to:
 * - src/pages/HowIWorkPage.tsx (full page), src/pages/HomePage.tsx (summary strip),
 *   src/pages/AboutPage.tsx (collaboration & live media preview), and src/pages/PrinciplesPage.tsx.
 * - src/lib/agent/markdown.ts (`/how-i-work.md` and `/llms.txt`), src/content/searchIndex.ts,
 *   src/lib/publicRoutes.ts, and src/content/index.ts.
 * - Uses `VisualArtifact` from `./visuals`.
 */
import type { VisualArtifact } from "./visuals";

/** Canonical route path for the operating manual page. */
export const HOW_I_WORK_PATH = "/how-i-work";

/** One step in the rapid-learning playbook. */
export interface LearningStep {
  step: string;
  title: string;
  summary: string;
  inPractice: string;
}

/** One category of reading and ongoing study. */
export interface ReadingHabit {
  category: string;
  focus: string;
  whyItMatters: string;
}

/** One trait describing how Ayush operates as a person and teammate. */
export interface WorkingTrait {
  slug: string;
  title: string;
  headline: string;
  detail: string;
  example: string;
}

/** One video item or ready-to-fill YouTube/Loom/Vimeo slot for live work and personality demos. */
export interface LiveWorkVideo {
  id: string;
  title: string;
  platform: string;
  /** Paste a YouTube (`youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...`), Loom, or Vimeo URL to publish. */
  url?: string;
  description: string;
  plannedTopics: string[];
  caption: string;
}

/** Full content record for `/how-i-work` and `/how-i-work.md`. */
export const howIWork = {
  path: HOW_I_WORK_PATH,
  title: "How I work",
  dek: "Learning unfamiliar tech fast without cutting corners, reading deeply, solving business bottlenecks with UX care, and showing up as a high-agency teammate.",
  description:
    "How Ayush Rai learns new technology rapidly while implementing accurately, reads books and engineering blogs, connects business bottlenecks to user experience, handles feedback, and ships with high agency—plus live work images and video walkthrough slots.",
  intro: [
    "Tools change faster than fundamentals. In fast-moving startup environments, waiting until you already know every API or framework before contributing is too slow—and shipping fragile guesswork is worse. The useful skill is ramping onto unfamiliar technology quickly while keeping the implementation accurate, testable, and grounded in the actual user and business problem.",
    "This page is the human side behind the case studies: how I learn something I have not touched before, what I read to keep judgment sharp, how I work with a team, how I take feedback and iterate, and live visual and video windows into the work itself.",
  ],
  universalBuilderSummary:
    "Good engineering is not isolated ticket-taking. Understanding the business bottleneck, caring about the person using the interface, reading deeply, and learning new stacks quickly are universal builder qualities—whether the task is AI evaluation, GTM data pipelines, or shipping a product from zero.",
  learningPlaybook: [
    {
      step: "01",
      title: "Start with the bottleneck and the user, not the tool",
      summary:
        "Before opening a framework tutorial, I clarify what is slowing the business down, who touches the output, and what breaks if the system is wrong.",
      inPractice:
        "On MedVoice, the constraint was not speech-to-text accuracy alone—it was billing mistakes in pharma wholesale. That immediately dictated integer-paise GST math and a human confirmation gate before any invoice posts.",
    },
    {
      step: "02",
      title: "Read primary sources first",
      summary:
        "When picking up a new technology, I go straight to official documentation, API schemas, rate-limit specs, and source code instead of skimming hype threads.",
      inPractice:
        "Ramping into GTM infrastructure meant reading Clay waterfall docs, Apollo enrichment limits, HubSpot CRM v3 association specs, and sender-compliance rules directly so the design matched real constraints.",
    },
    {
      step: "03",
      title: "Ship a thin vertical slice fast",
      summary:
        "Fast startup experience taught me to get an end-to-end path running early—real inputs, real data shape, real UI or CLI output—so hidden assumptions surface in hours instead of weeks.",
      inPractice:
        "GTM-Strato, Revenue Intelligence Engine, and AIworks Leads all started as runnable vertical slices with synthetic fixtures and explicit schemas before adding extra layers.",
    },
    {
      step: "04",
      title: "Verify accuracy with tests, edge cases, and rubrics",
      summary:
        "Speed only counts when the answer is right. I pair fast iteration with deterministic checks, failure-mode tests, and explicit separation between verified facts and model guesses.",
      inPractice:
        "Evaluation work at FoCDoT and Outlier trained a habit of catching fluent-but-wrong outputs—the same habit behind deterministic 100-point scoring and field-level provenance in my revenue systems.",
    },
    {
      step: "05",
      title: "Leave clear notes on what works and where it stops",
      summary:
        "Learning a technology is only complete when a teammate can inspect the system, trust its boundaries, and extend it without reverse-engineering my head.",
      inPractice:
        "Every project on this site separates implemented, experimental, and planned edges—and keeps code, docs, and tests synchronized from one source.",
    },
  ] as LearningStep[],
  readingHabits: [
    {
      category: "Engineering blogs & postmortems",
      focus: "Production architecture write-ups, retrieval/evaluation notes, data-pipeline trade-offs, and incident postmortems.",
      whyItMatters:
        "Real teams explain the failure modes that tutorials leave out—rate limits, idempotency, schema drift, and UX latency.",
    },
    {
      category: "Books on systems, product & craft",
      focus: "Software design, distributed thinking, product discovery, clear writing, and operational judgment.",
      whyItMatters:
        "Books give durable mental models that outlast any single library release and help spot root causes instead of patching symptoms.",
    },
    {
      category: "Technical articles, specs & RFCs",
      focus: "API documentation, protocol specs (MCP, OpenAPI, WebMCP, A2A), compliance guidelines, and deep technical essays.",
      whyItMatters:
        "Reading primary specs lets me integrate unfamiliar tools accurately on the first pass instead of cargo-culting snippets.",
    },
    {
      category: "Business & user experience lens",
      focus: "How revenue teams, operators, and end users actually move through a workflow—where friction, distrust, or manual toil creeps in.",
      whyItMatters:
        "An accurate backend that confuses the operator still fails. Understanding the business bottleneck keeps engineering pointed at outcomes that matter.",
    },
  ] as ReadingHabit[],
  teamAndPersonality: [
    {
      slug: "high-agency",
      title: "High agency by default",
      headline: "I look for the unblocked path instead of waiting for a perfect spec.",
      detail:
        "When requirements are ambiguous or a dependency is missing, I do not stall. I map the options, flag the trade-off clearly, build a concrete prototype or decision note, and move the conversation forward.",
      example:
        "Turning open-ended product and GTM problems into runnable local workbenches, typed schemas, and clear scope boundaries before anyone has to ask twice.",
    },
    {
      slug: "feedback-and-iteration",
      title: "Direct feedback, zero ego, fast iteration",
      headline: "Critique is debugging signal for the work, not an attack on the person.",
      detail:
        "I prefer blunt, specific feedback early over polite silence late. When something misses the mark—code structure, copy, UX flow, or a wrong assumption—I ask one or two clarifying questions, fix the root cause quickly, and verify the updated version against the real requirement.",
      example:
        "Rewriting positioning, tightening rubrics, and stripping unverified claims across this portfolio whenever review surfaced vague wording or overstatement.",
    },
    {
      slug: "team-player",
      title: "Calm, clear, low-friction teammate",
      headline: "Make the people working next to me faster and more informed.",
      detail:
        "Good remote and startup teamwork runs on written clarity, honest status updates, and reliable follow-through. I share context early, call out blockers before deadlines slip, document decisions, and pitch in wherever the bottleneck actually sits—backend, frontend, data, or product.",
      example:
        "Running workshops and mentoring students as a UiPath Student Developer Champion, plus collaborating across engineering and evaluation reviews remotely.",
    },
    {
      slug: "user-and-business-empathy",
      title: "User experience and business reality together",
      headline: "Ship software that respects both the operator's time and the company's goal.",
      detail:
        "I care about clear hierarchy, honest empty/loading states, keyboard accessibility, and fast feedback loops in the UI—while keeping an eye on conversion, operational cost, and auditability underneath.",
      example:
        "Client deliveries like Praful H. and Iha by Himani, and product workflows like RevenueRoles and Revenue Intelligence Engine where every screen answers a concrete user question.",
    },
  ] as WorkingTrait[],
  liveWorkImages: [
    {
      label: "RevenueRoles · Live UI",
      src: "/images/work/revenueroles-homepage.png",
      alt: "RevenueRoles live platform homepage showing technical revenue job categories and compensation filters",
      caption: "Live product capture: RevenueRoles job discovery and role-family navigation at revenueroles.in.",
      badge: "Live product",
    },
    {
      label: "RIE · 100-pt scoring",
      src: "/images/work/rie-03-scoring.jpg",
      alt: "Revenue Intelligence Engine deterministic 100-point account scoring breakdown screen",
      caption: "Live workbench capture: deterministic 100-point scoring rubric keeping model guesswork out of numerical decisions.",
      badge: "Live workbench",
    },
    {
      label: "RIE · Approval gate",
      src: "/images/work/rie-06-approvals.jpg",
      alt: "Revenue Intelligence Engine human approval queue gating CRM export",
      caption: "Human-in-the-loop operator UX: researched accounts pause for explicit review before any downstream export.",
      badge: "Operator UX",
    },
    {
      label: "Client delivery · Praful H.",
      src: "/images/work/praful-h.jpg",
      alt: "Praful Hedau executive portfolio site live on Netlify",
      caption: "Live client delivery: clean hierarchy, credibility-first layout, and direct contact paths.",
      badge: "Client site",
    },
    {
      label: "MyLifeOS · Personal archive",
      src: "/images/work/mylifeos.jpg",
      alt: "MyLifeOS personal archive site at life.ayushrai.site",
      caption: "Personal archive at life.ayushrai.site: longer-form notes, life context, and evolving work.",
      badge: "Personal site",
    },
    {
      label: "Work-in-progress & desk slot",
      alt: "Add a live build snapshot, whiteboard architecture sketch, pair-programming session, or demo day photo here.",
      caption: "Drop a new image into public/images/work/ and set its src in src/content/howIWork.ts.",
      badge: "Add live photo",
      slot: "live-work-wip-snapshot",
    },
  ] as VisualArtifact[],
  liveWorkVideos: [
    {
      id: "rapid-learning-build-session",
      title: "Learning a new stack fast and shipping an accurate vertical slice",
      platform: "YouTube / Loom / Vimeo",
      url: undefined,
      description:
        "A real screen-recorded build session showing how I read unfamiliar docs, map the business constraint, implement a clean vertical slice, and verify edge cases.",
      plannedTopics: [
        "Reading primary API docs and scoping the exact bottleneck before writing code",
        "Building the vertical slice end-to-end with typed schemas and deterministic checks",
        "Testing edge cases, debugging live, and documenting what works versus what is next",
      ],
      caption: "Paste a YouTube, Loom, or Vimeo URL into `liveWorkVideos[0].url` in src/content/howIWork.ts.",
    },
    {
      id: "live-product-and-ux-walkthrough",
      title: "Live walkthrough: products, GTM systems, and user-experience decisions",
      platform: "YouTube / Loom / Vimeo",
      url: undefined,
      description:
        "Tour of shipped products and local workbenches—walking through why each UI, approval gate, and data-provenance choice exists for the person using it.",
      plannedTopics: [
        "RevenueRoles live taxonomy and job-normalization pipeline",
        "Revenue Intelligence Engine 6-stage scoring, research, and human approval flow",
        "How business bottlenecks shape UX details, error states, and system boundaries",
      ],
      caption: "Paste a YouTube, Loom, or Vimeo URL into `liveWorkVideos[1].url` in src/content/howIWork.ts.",
    },
    {
      id: "personality-teamwork-and-iteration",
      title: "How I work with a team, take feedback, and iterate",
      platform: "YouTube / Loom / Vimeo",
      url: undefined,
      description:
        "A short, unscripted intro on who I am outside of bullet points—how I collaborate remotely, handle direct critique, unblock teammates, and keep high agency without noise.",
      plannedTopics: [
        "Who I am as a person and collaborator in fast-moving teams",
        "A real example of taking sharp feedback and tightening the work quickly",
        "What I am reading, building, and excited to partner on next",
      ],
      caption: "Paste a YouTube, Loom, or Vimeo URL into `liveWorkVideos[2].url` in src/content/howIWork.ts.",
    },
  ] as LiveWorkVideo[],
};

/** Markdown body for `/how-i-work.md`, generated from the same `howIWork` content record. */
export function renderHowIWorkBody(): string {
  const lines: string[] = [
    ...howIWork.intro,
    "",
    "## Universal builder mindset",
    "",
    howIWork.universalBuilderSummary,
    "",
    "## How I learn unfamiliar technology fast (and implement accurately)",
    "",
    ...howIWork.learningPlaybook.flatMap((item) => [
      `### ${item.step}. ${item.title}`,
      "",
      item.summary,
      "",
      `In practice: ${item.inPractice}`,
      "",
    ]),
    "## Reading & staying sharp (books, articles, engineering blogs)",
    "",
    ...howIWork.readingHabits.map(
      (habit) => `- **${habit.category}**: ${habit.focus} ${habit.whyItMatters}`,
    ),
    "",
    "## Teamwork, high agency, feedback & iteration",
    "",
    ...howIWork.teamAndPersonality.flatMap((trait) => [
      `### ${trait.title}`,
      "",
      `${trait.headline} ${trait.detail}`,
      "",
      `In practice: ${trait.example}`,
      "",
    ]),
    "## Live work snapshots",
    "",
    ...howIWork.liveWorkImages.map((img) =>
      img.src
        ? `- **${img.label}** (${img.badge ?? "Image"}): ${img.caption ?? img.alt} (\`${img.src}\`)`
        : `- **${img.label}** (Slot \`${img.slot ?? "unassigned"}\`): ${img.alt}`,
    ),
    "",
    "## Live work & personality videos (YouTube, Loom, Vimeo)",
    "",
    ...howIWork.liveWorkVideos.flatMap((video) => [
      `### ${video.title}`,
      "",
      video.url ? `Video (${video.platform}): ${video.url}` : `Video slot (${video.platform}): not recorded yet.`,
      "",
      video.description,
      "",
      ...video.plannedTopics.map((topic) => `- ${topic}`),
      "",
    ]),
  ];
  return lines.join("\n");
}
