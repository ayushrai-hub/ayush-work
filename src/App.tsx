import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import FloatingNav from './components/FloatingNav';
import { initGA } from './lib/analytics';
import SEO from './components/SEO';
import './App.css';

// Lazy load heavy components
const ThreeJSHero = lazy(() => import('./components/ThreeJSHero'));
const About = lazy(() => import('./components/About'));
const AboutMe = lazy(() => import('./components/AboutMe'));
const Education = lazy(() => import('./components/Education'));
const Experience = lazy(() => import('./components/Experience'));
const Skills = lazy(() => import('./components/Skills'));
const Other = lazy(() => import('./components/Other'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));

// Import page components directly (no lazy loading)
import ResearchPage from './components/pages/ResearchPage';
import LeadershipPage from './components/pages/LeadershipPage';
import CertificationsPage from './components/pages/CertificationsPage';
import ServicesPage from './components/pages/ServicesPage';
import ExtraCurricularsPage from './components/pages/ExtraCurricularsPage';

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
  </div>
);

function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-gray-100 relative overflow-x-hidden transition-colors duration-300 safe-area">
        <SEO />
        <ParticleBackground />

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Main Portfolio Page */}
            <Route path="/" element={
              <>
                <Header />
                <FloatingNav />
                <motion.main
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <ThreeJSHero />
                  </Suspense>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AboutMe />
                  </Suspense>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Experience />
                  </Suspense>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Projects />
                  </Suspense>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Education />
                  </Suspense>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Skills />
                  </Suspense>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Other />
                  </Suspense>
                  <Suspense fallback={<LoadingSpinner />}>
                    <About />
                  </Suspense>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Contact />
                  </Suspense>
                </motion.main>
                <Footer />
              </>
            } />

            {/* Dedicated Pages */}
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/leadership" element={<LeadershipPage />} />
            <Route path="/certifications" element={<CertificationsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/extracurriculars" element={<ExtraCurricularsPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
