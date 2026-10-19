/**
 * Addressable proof-of-work routes shared by the POW navigation.
 *
 * The list is the public routes for this portfolio series. A route is listed even when its
 * page is still being added, so each finished page can link to the others by the same path.
 * This module does not render those pages.
 *
 * Connects to:
 * - src/components/pow/PowNav.tsx renders `powPages`.
 * - The founding-engineer page is routed in src/App.tsx at `/pow/founding-engineer`.
 * - AI research engineering is `/pow/ai-research-engineering`. `/pow/ai-research` redirects there.
 * - Sibling POW pages are expected at the other paths in this list.
 */

/** One proof-of-work page in the series. */
export interface PowPageLink {
  to: string;
  label: string;
  short: string;
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
