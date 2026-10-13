/**
 * Barrel module that re-exports every content record, helper and type in src/content/.
 *
 * src/content is the single source of truth for public facts. Pages and
 * components import from here (as `../content` or `../../content`) instead of
 * hardcoding copy, so a change in a data module reaches the HTML pages, the
 * Markdown twins, llms.txt, search, the REST API and the MCP tools together.
 * Not every module's private constants are re-exported (for example
 * `productCategoryOrder` and `projectCategoryOrder`).
 *
 * Connects to:
 * - Pages in src/pages/ and components in src/components/site and
 *   src/components/editorial.
 * - Agent surfaces: src/lib/agent/markdown.ts (Markdown twins, llms.txt,
 *   llms-full.txt), src/lib/agent/search.ts (search API, MCP and WebMCP
 *   search), src/lib/agent/projectsQuery.ts (REST API and MCP project tools),
 *   plus openapi.ts, validate.ts, mcpCard.ts, apiCatalog.ts and apiError.ts.
 * - src/lib/publicRoutes.ts, src/lib/canonical.ts and
 *   src/components/editorial/UpdatedMeta.tsx import individual modules
 *   directly rather than through this barrel.
 * - Re-exports all of types.ts plus `PolicySection` from policies.ts.
 */

export * from "./types";

export { siteMeta, formatUpdated, pageUpdatedAt } from "./siteMeta";
export { person } from "./person";
export { now } from "./now";
export { work, selectedWork, getWorkBySlug } from "./work";
export {
  products,
  getProductBySlug,
  featuredProducts,
  otherProductsByCategory,
  productCategoryLabels,
  productStageLabels,
} from "./products";
export {
  projects,
  activeProjects,
  archivedProjects,
  getProjectBySlug,
  projectsByCategory,
  projectCategoryLabels,
  projectTypeLabels,
} from "./projects";
export {
  research,
  researchAwardsNeedsConfirmation,
  researchFundingNeedsConfirmation,
  getResearchBySlug,
} from "./research";
export { experience } from "./experience";
export { education } from "./education";
export { leadership, leadershipNeedsConfirmation } from "./leadership";
export {
  recognition,
  featuredRecognition,
  archivedRecognition,
} from "./recognition";
export { ideas } from "./ideas";
export { principles } from "./principles";
export { timeline } from "./timeline";
export { writing, onSiteWriting } from "./writing";
export { notes } from "./notes";
export { uses } from "./uses";
export {
  elsewhere,
  elsewhereProfiles,
  primaryElsewhere,
  archivedElsewhere,
} from "./elsewhere";
export { archive } from "./archive";
export { capabilities } from "./capabilities";
export {
  domains,
  childDomains,
  evidenceLevelLabels,
  getDomainByPath,
  homeDomains,
  renderDomainBody,
} from "./domains";
export { privacySections, contactSections } from "./policies";
export type { PolicySection } from "./policies";
export { searchIndex, buildSearchIndex } from "./searchIndex";
