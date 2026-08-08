/**
 * Content layer — single source of truth for Ayush Rai's digital home.
 * Import from `@/content` or `../content` rather than hardcoding copy in components.
 */

export * from "./types";

export { person } from "./person";
export { now } from "./now";
export { work, selectedWork, getWorkBySlug } from "./work";
export { products, getProductBySlug } from "./products";
export {
  projects,
  activeProjects,
  archivedProjects,
  getProjectBySlug,
} from "./projects";
export {
  research,
  researchAwardsNeedsConfirmation,
  getResearchBySlug,
} from "./research";
export {
  experience,
  currentExperience,
  getExperienceBySlug,
} from "./experience";
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
export { searchIndex, buildSearchIndex } from "./searchIndex";
