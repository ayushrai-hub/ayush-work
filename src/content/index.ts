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
export { practice } from "./practice";
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
  domainSkillStatusLabels,
  evidenceLevelLabels,
  getDomainByPath,
  homeDomains,
  renderDomainBody,
} from "./domains";
export type {
  DomainAgentAccess,
  DomainBenchmarkRow,
  DomainJourney,
  DomainLink,
  DomainRecord,
  DomainSection,
  DomainSkillRow,
  DomainSolution,
  DomainStat,
  DomainWalkthrough,
  EvidenceLevel,
} from "./domains";
export {
  gtmPortfolio,
  gtmEvidenceLabels,
  gtmSkillLevelLabels,
  gtmProofs,
  gtmReadingProgress,
  loomEmbedUrl,
  videoEmbedUrl,
  renderGtmBody,
} from "./gtm";
export {
  powPages,
  powMenu,
  POW_PATH,
  powIndexTitle,
  powIndexDescription,
  renderPowIndexBody,
} from "./powPages";
export type { PowPageLink, PowMenuLink } from "./powPages";
export {
  foundingEngineer,
  foundingCases,
  renderFoundingEngineerBody,
} from "./foundingEngineer";
export {
  CLOUD_ENGINEER_PATH,
  cloudEngineerDescription,
  cloudPrinciples,
  cloudSections,
  cloudCaseStudies,
  cloudRoadmap,
  renderCloudEngineerBody,
} from "./cloudEngineerPow";
export type { CloudEvidence } from "./cloudEngineerPow";
export {
  DEVOPS_PATH,
  devopsDescription,
  devopsPow,
  devopsPrinciples,
  devopsSections,
  devopsLimits,
  deliveryFindings,
  renderDevopsBody,
} from "./devopsPow";
export {
  PRODUCT_MANAGEMENT_PATH,
  productManagementDescription,
  renderProductManagementBody,
} from "./productManagementPow";
export {
  AGENTIC_PATH,
  agenticPow,
  agenticPowDescription,
  agenticThesis,
  agenticLoop,
  agenticNodes,
  agenticDecisions,
  agenticSafeguards,
  agenticRoadmap,
  agenticRelatedWork,
  renderAgenticPowBody,
} from "./agenticPow";
export {
  ML_ENGINEER_PATH,
  ML_HEADLINE,
  mlEngineerDescription,
  renderMlEngineerBody,
} from "./mlEngineerPow";
export {
  AI_RESEARCH_PATH,
  aiResearchDescription,
  aiResearchTitle,
  renderAiResearchBody,
} from "./aiResearchPow";
export {
  AI_DATA_SCIENTIST_PATH,
  aiDataScientistCases,
  aiDataScientistDescription,
  aiDataScientistProfiles,
  renderAiDataScientistBody,
} from "./aiDataScientist";
export {
  benchmarkPage,
  benchmarkPrinciples,
  benchmarkPriorWork,
  benchmarkSpec,
  benchmarkStages,
  benchmarkTasks,
  auditFixtureTasks,
  demonstrationRun,
  renderBenchmarkBody,
} from "./benchmarkEngineering";
export type {
  GtmAgentWorkflow,
  GtmCapabilityRow,
  GtmEvidence,
  GtmLayer,
  GtmPortfolio,
  GtmProof,
  GtmResource,
  GtmResourceGroup,
  GtmMotionRow,
  GtmSkill,
  GtmSkillGroup,
  GtmSkillLevel,
  GtmSkillStackRow,
  GtmStudyTopic,
  GtmThesisPillar,
} from "./gtm";
export {
  FDE_PATH,
  FDE_RELAY_PATH,
  accountScore,
  fdeAccounts,
  fdeDecisions,
  fdeEvidenceLabels,
  fdeFailures,
  fdeLayers,
  fdePhaseStatusLabels,
  fdePortfolio,
  fdePow,
  fdePrinciples,
  fdeProblemSteps,
  fdeProcess,
  fdeProofs,
  fdeRelatedWork,
  fdeRoadmap,
  fdeSections,
  fdeShellViews,
  fdeSources,
  fdeStageKindLabels,
  fdeStages,
  renderFdeBody,
  renderFdeRelayBody,
} from "./fde";
export type {
  FdeAccount,
  FdeDecision,
  FdeEvidence,
  FdeFailure,
  FdeLayer,
  FdePhaseStatus,
  FdePortfolioProject,
  FdePrinciple,
  FdeProblemStep,
  FdeProcessStep,
  FdeProofEvidence,
  FdeProofLink,
  FdeRelatedWork,
  FdeRoadmapPhase,
  FdeSection,
  FdeShellViewId,
  FdeSignal,
  FdeSoftSkillRow,
  FdeStage,
  FdeStageKind,
  FdeTechSkillRow,
  ResolvedFdeProject,
} from "./fde";
export {
  REVOPS_PATH,
  REVOPS_TITLE,
  REVOPS_DESCRIPTION,
  renderRevopsBody,
} from "./revopsPow";
export { privacySections, contactSections } from "./policies";
export type { PolicySection } from "./policies";
export { recordVisuals, getRecordVisuals } from "./visuals";
export type { VisualArtifact, RecordVisuals } from "./visuals";
export {
  HOW_I_WORK_PATH,
  howIWork,
  renderHowIWorkBody,
} from "./howIWork";
export type {
  LearningStep,
  LiveWorkVideo,
  ReadingHabit,
  WorkingTrait,
} from "./howIWork";
export { searchIndex, buildSearchIndex } from "./searchIndex";
