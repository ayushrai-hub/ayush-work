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
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function PageFallback() {
  return (
    <div className="site-shell py-24" role="status" aria-live="polite">
      <p className="font-mono text-sm text-ink-faint">Loading…</p>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
