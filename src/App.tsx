/**
 * Route table for the live site, shared by the browser app and the build-time prerenderer.
 *
 * AppRoutes renders every page lazily inside SiteLayout behind one Suspense fallback, including the
 * domain dossier paths, legacy redirects, and a NotFoundPage catch-all. App wraps it in a
 * BrowserRouter and loads Google Analytics once on mount; entry-server.tsx wraps AppRoutes in a
 * StaticRouter instead, so initGA never runs during prerender.
 *
 * Connects to:
 * - src/main.tsx renders App; src/entry-server.tsx renders AppRoutes. src/__tests__/App.test.tsx.
 * - src/pages/* and src/components/site/SiteLayout.tsx; src/lib/analytics.ts (initGA).
 * - Proof-of-work routes: `pow` (PowIndexPage), `pow/fde` (FdePowPage), `pow/product-management`, and `pow/ml-engineer`.
 * - The product-management proof of work is `pow/product-management` (ProductManagementPowPage).
 * - The AI research proof of work is `pow/ai-research-engineering` (AiResearchEngineeringPowPage).
 * - The benchmark proof of work is `pow/ai-benchmark` (BenchmarkEngineeringPage).
 *   `pow/benchmark-engineering` redirects there.
 * - Prerendered paths come from src/lib/publicRoutes.ts, which must cover these routes.
 */
import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import SiteLayout from "./components/site/SiteLayout";
import { initGA } from "./lib/analytics";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const WorkDetailPage = lazy(() => import("./pages/WorkDetailPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const ProductLogPage = lazy(() => import("./pages/ProductLogPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ResearchPage = lazy(() => import("./pages/ResearchPage"));
const ResearchDetailPage = lazy(() => import("./pages/ResearchDetailPage"));
const WritingPage = lazy(() => import("./pages/WritingPage"));
const WritingDetailPage = lazy(() => import("./pages/WritingDetailPage"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const NoteDetailPage = lazy(() => import("./pages/NoteDetailPage"));
const NowPage = lazy(() => import("./pages/NowPage"));
const IdeasPage = lazy(() => import("./pages/IdeasPage"));
const PrinciplesPage = lazy(() => import("./pages/PrinciplesPage"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const EducationPage = lazy(() => import("./pages/EducationPage"));
const LeadershipPage = lazy(() => import("./pages/LeadershipPage"));
const RecognitionPage = lazy(() => import("./pages/RecognitionPage"));
const ElsewherePage = lazy(() => import("./pages/ElsewherePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ArchivePage = lazy(() => import("./pages/ArchivePage"));
const UsesPage = lazy(() => import("./pages/UsesPage"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const DesignSystemPage = lazy(() => import("./pages/DesignSystemPage"));
const DevelopersPage = lazy(() => import("./pages/DevelopersPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const DomainPage = lazy(() => import("./pages/DomainPage"));
const GtmPage = lazy(() => import("./pages/GtmPage"));
const PowIndexPage = lazy(() => import("./pages/PowIndexPage"));
const FdePowPage = lazy(() => import("./pages/FdePowPage"));
const ProductManagementPowPage = lazy(() => import("./pages/ProductManagementPowPage"));
const MlEngineerPowPage = lazy(() => import("./pages/MlEngineerPowPage"));
const AiResearchEngineeringPowPage = lazy(() => import("./pages/AiResearchEngineeringPowPage"));
const BenchmarkEngineeringPage = lazy(() => import("./pages/BenchmarkEngineeringPage"));
const FoundingEngineerPowPage = lazy(() => import("./pages/FoundingEngineerPowPage"));
const DevopsPowPage = lazy(() => import("./pages/DevopsPowPage"));
const CloudEngineerPowPage = lazy(() => import("./pages/CloudEngineerPowPage"));
const AgenticPowPage = lazy(() => import("./pages/AgenticPowPage"));
const RevopsPowPage = lazy(() => import("./pages/RevopsPowPage"));
const AiDataScientistPowPage = lazy(() => import("./pages/AiDataScientistPowPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

/** Suspense placeholder shown while a lazy page chunk loads. */
function PageFallback() {
  return (
    <div className="site-shell py-24" role="status" aria-live="polite">
      <p className="font-mono text-sm text-ink-faint">Loading…</p>
    </div>
  );
}

/**
 * All routes, without a router. The caller supplies BrowserRouter (client) or StaticRouter (SSR).
 * DomainPage resolves its dossier from the current path.
 */
export function AppRoutes() {
  return (
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="work" element={<WorkPage />} />
            <Route path="work/:slug" element={<WorkDetailPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="products/:slug/log" element={<ProductLogPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="research" element={<ResearchPage />} />
            <Route path="research/:slug" element={<ResearchDetailPage />} />
            <Route path="writing" element={<WritingPage />} />
            <Route path="writing/:slug" element={<WritingDetailPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="notes/:slug" element={<NoteDetailPage />} />
            <Route path="now" element={<NowPage />} />
            <Route path="ideas" element={<IdeasPage />} />
            <Route path="principles" element={<PrinciplesPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="leadership" element={<LeadershipPage />} />
            <Route path="recognition" element={<RecognitionPage />} />
            <Route path="elsewhere" element={<ElsewherePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="archive" element={<ArchivePage />} />
            <Route path="uses" element={<UsesPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="design-system" element={<DesignSystemPage />} />
            <Route path="developers" element={<DevelopersPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="gtm" element={<GtmPage />} />
            <Route path="pow" element={<PowIndexPage />} />
            <Route path="pow/founding-engineer" element={<FoundingEngineerPowPage />} />
            <Route path="pow/ai-benchmark" element={<BenchmarkEngineeringPage />} />
            <Route
              path="pow/benchmark-engineering"
              element={<Navigate to="/pow/ai-benchmark" replace />}
            />
            <Route path="pow/fde" element={<FdePowPage />} />
            <Route path="pow/agentic-ai" element={<AgenticPowPage />} />
            <Route path="pow/revops-engineering" element={<RevopsPowPage />} />
            <Route path="pow/revenue-operations" element={<Navigate to="/pow/revops-engineering" replace />} />
            <Route path="pow/product-management" element={<ProductManagementPowPage />} />
            <Route path="pow/ml-engineer" element={<MlEngineerPowPage />} />
            <Route path="pow/devops-engineer" element={<DevopsPowPage />} />
            <Route path="pow/cloud-engineer" element={<CloudEngineerPowPage />} />
            <Route path="pow/ai-research-engineering" element={<AiResearchEngineeringPowPage />} />
            <Route path="pow/ai-research" element={<Navigate to="/pow/ai-research-engineering" replace />} />
            <Route path="pow/ai-data-scientist" element={<AiDataScientistPowPage />} />
            <Route path="ai-engineering/*" element={<DomainPage />} />
            <Route path="ai-engineering" element={<DomainPage />} />
            <Route path="software-engineering" element={<DomainPage />} />
            <Route path="software-services" element={<DomainPage />} />
            <Route path="gtm-revops" element={<DomainPage />} />
            <Route path="experience" element={<DomainPage />} />
            <Route path="open-source" element={<DomainPage />} />

            {/* Legacy redirects */}
            <Route path="services" element={<Navigate to="/contact" replace />} />
            <Route
              path="certifications"
              element={<Navigate to="/recognition" replace />}
            />
            <Route
              path="extracurriculars"
              element={<Navigate to="/leadership" replace />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
  );
}

/** Client app: AppRoutes in a BrowserRouter, with GA4 injected once after the first render. */
export default function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
