/**
 * Legacy standalone page that wraps the legacy Research section with the legacy header and footer.
 *
 * Legacy: not routed. /research in src/App.tsx renders src/pages/ResearchPage.tsx,
 * a different file with the same name. Kept for reference; src/components/pages
 * is excluded from tsconfig.app.json. No test covers it.
 *
 * Scrolls to the top on mount, then renders Header, a "Back to Home" link,
 * the section, and Footer, like the other files in this folder.
 *
 * Connects to:
 * - No importers in src/
 * - src/components/layout/Header.tsx, src/components/layout/Footer.tsx, src/components/Research.tsx (all legacy)
 * - react-router-dom `Link` (requires a router ancestor)
 */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Research from '../Research';
import { ArrowLeft } from 'lucide-react';

/** Full-page layout for the legacy research section. */
const ResearchPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center text-secondary hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors mb-4 px-3 py-1.5 rounded-md hover:bg-secondary-50 dark:hover:bg-secondary-900/20 text-sm"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            Back to Home
          </Link>
        </div>
        <Research />
      </main>
      <Footer />
    </div>
  );
};

export default ResearchPage;
