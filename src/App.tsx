import { useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import About from './components/About';
import AboutMe from './components/AboutMe';
import Education from './components/Education';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Research from './components/Research';
import CommunityLeadership from './components/CommunityLeadership';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import { initGA } from './lib/analytics';
import SEO from './components/SEO';
import './App.css';

// Lazy load heavy components
const ThreeJSHero = lazy(() => import('./components/ThreeJSHero'));

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-800 dark:text-white relative overflow-x-hidden">
      <SEO />
      <ParticleBackground />

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
        <Research />
        <CommunityLeadership />
        <Certifications />
        <Services />
        <About />
        <Contact />
      </motion.main>

      <Footer />
    </div>
  );
}

export default App;
