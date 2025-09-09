import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import About from './components/About';
import AboutMe from './components/AboutMe';
import Education from './components/Education';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Other from './components/Other';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import { initGA } from './lib/analytics';
import SEO from './components/SEO';
import './App.css';

// Lazy load heavy components
const ThreeJSHero = lazy(() => import('./components/ThreeJSHero'));

// Lazy load page components
const ResearchPage = lazy(() => import('./components/pages/ResearchPage'));
const LeadershipPage = lazy(() => import('./components/pages/LeadershipPage'));
const CertificationsPage = lazy(() => import('./components/pages/CertificationsPage'));
const ServicesPage = lazy(() => import('./components/pages/ServicesPage'));

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-800 dark:text-white relative overflow-x-hidden">
        <SEO />
        <ParticleBackground />

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Main Portfolio Page */}
            <Route path="/" element={
              <>
                <Header />
                <motion.main
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <ThreeJSHero />
                  </Suspense>
                  <AboutMe />
                  <Experience />
                  <Projects />
                  <Education />
                  <Skills />
                  <Other />
                  <About />
                  <Contact />
                </motion.main>
                <Footer />
              </>
            } />

            {/* Dedicated Pages */}
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/leadership" element={<LeadershipPage />} />
            <Route path="/certifications" element={<CertificationsPage />} />
            <Route path="/services" element={<ServicesPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
