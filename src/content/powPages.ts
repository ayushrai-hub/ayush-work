/**
 * Addressable proof-of-work routes shared by the POW navigation.
 *
 * The list is the public routes for this portfolio series. A route is listed even when its
 * page is still being added, so each finished page can link to the others by the same path.
 * This module does not render those pages.
 *
 * Connects to:
 * - src/components/pow/PowNav.tsx renders `powPages`.
 * - src/components/site/SiteHeader.tsx opens `powMenu` on hover. SiteFooter links to `POW_PATH`.
 * - src/pages/PowIndexPage.tsx lists `powMenu`. `renderPowIndexBody` is the `/pow.md` body.
 * - The founding-engineer page is routed in src/App.tsx at `/pow/founding-engineer`.
 * - AI research engineering is `/pow/ai-research-engineering`. `/pow/ai-research` redirects there.
 * - Sibling POW pages are expected at the other paths in this list.
 */

/** Route for the proof-of-work index. The role pages stay on their own paths. */
export const POW_PATH = "/pow";

/** Title shared by the page head, search, and the Markdown twin. */
export const powIndexTitle = "POW";

/** Document description shared by the page head, search, and the Markdown twin. */
export const powIndexDescription =
  "Proof-of-work pages for the roles this site addresses, including GTM, forward deployed engineering, and the other disciplines listed here.";

/** One proof-of-work page in the series. */
export interface PowPageLink {
  to: string;
  label: string;
  short: string;
}

/** A role link in the POW menu, with the one-line limit already published for that page. */
export interface PowMenuLink extends PowPageLink {
  note: string;
}

/**
 * Proof-of-work routes, in series order.
 * `short` is the compact nav label; `label` is the accessible name.
 */
export const powPages: readonly PowPageLink[] = [
  { to: "/pow/fde", label: "Forward deployed engineering", short: "FDE" },
  { to: "/pow/product-management", label: "Product management", short: "Product" },
  { to: "/pow/devops-engineer", label: "DevOps engineer", short: "DevOps" },
  { to: "/pow/cloud-engineer", label: "Cloud engineering", short: "Cloud" },
  { to: "/pow/ai-benchmark", label: "AI benchmark engineering", short: "Benchmark" },
  { to: "/pow/agentic-ai", label: "Agentic AI engineering", short: "Agents" },
  { to: "/pow/revops-engineering", label: "Revenue operations engineering", short: "RevOps" },
  { to: "/pow/ai-research-engineering", label: "AI research engineering", short: "Research" },
  { to: "/pow/founding-engineer", label: "Founding engineer", short: "Founding" },
  { to: "/pow/ml-engineer", label: "Machine learning engineering", short: "ML" },
  { to: "/pow/ai-data-scientist", label: "AI data scientist", short: "Data" },
];

/**
 * One-line limits already used in llms.txt.
 * Keyed by route so the index and the hover menu cannot drift from those pages.
 */
const POW_NOTES: Record<string, string> = {
  "/gtm":
    "Revenue data pipelines, scoring, and what is built versus still being learned.",
  "/pow/fde":
    "A personal proof of work for the proposed RELAY workflow. Not a customer deployment.",
  "/pow/product-management":
    "A RevenueRoles case study that separates the live product from hypotheses and unmeasured outcomes.",
  "/pow/devops-engineer":
    "A local delivery simulation, with repository workflows labeled separately from illustrative logs.",
  "/pow/cloud-engineer":
    "Deployment, networking, and operations, with repository evidence separated from a local lab.",
  "/pow/ai-benchmark":
    "EVALFORGE, a synthetic evaluation demonstration. Not a published benchmark.",
  "/pow/agentic-ai":
    "ORBIT, a deterministic agent-control simulation. Not a model call and not a deployed agent platform.",
  "/pow/revops-engineering":
    "REVFLOW, a synthetic revenue-operations workbench. Not a live CRM.",
  "/pow/ai-research-engineering":
    "A prepared retrieval experiment. Not a model run and not a publication.",
  "/pow/founding-engineer":
    "Zero-to-one engineering, with synthetic BUILDLOG kept separate from the shipped projects.",
  "/pow/ml-engineer":
    "A browser simulation of a synthetic demand lifecycle. Not a trained or deployed model.",
  "/pow/ai-data-scientist":
    "Insight Lab, a synthetic retail analysis. Not a retailer dataset and not a trained production model.",
};

/** GTM lives at /gtm. It is a targeted role and is not one of the /pow series pages. */
const gtmMenuLink: PowPageLink = {
  to: "/gtm",
  label: "GTM engineering",
  short: "GTM",
};

/**
 * Roles shown in the header POW menu and on /pow.
 * GTM is first. The rest follow `powPages`.
 */
export const powMenu: readonly PowMenuLink[] = [gtmMenuLink, ...powPages].map((link) => {
  const note = POW_NOTES[link.to];
  if (!note) throw new Error(`powMenu: missing note for ${link.to}`);
  return { ...link, note };
});

/** Markdown body for /pow. The same notes as the HTML list. */
export function renderPowIndexBody(): string {
  return [
    "These are the proof-of-work pages for the roles this site addresses. A demonstration stays labeled as a demonstration.",
    "",
    ...powMenu.map((item) => `- [${item.label}](${item.to}): ${item.note}`),
  ].join("\n");
}
