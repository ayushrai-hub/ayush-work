'use client';

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import ParticleBackground from '../src/components/ParticleBackground';
import FloatingNav from '../src/components/FloatingNav';

// Lazy load heavy components
const AboutMe = React.lazy(() => import('../src/components/AboutMe'));

// Temporarily disabled Three.js component to avoid React context issues
// import dynamic from 'next/dynamic';
// const DynamicThreeJSHero = dynamic(() => import('../src/components/ThreeJSHero'), {
//   ssr: false,
//   loading: () => <div className="h-[60vh] md:h-[95vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div></div>
// });

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
  </div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-gray-100 relative overflow-x-hidden transition-colors duration-300 safe-area">
      <ParticleBackground />

      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <FloatingNav />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Three.js Hero temporarily disabled due to React context issues */}
          {/* <Suspense fallback={<LoadingSpinner />}>
            <DynamicThreeJSHero />
          </Suspense> */}
          <Suspense fallback={<LoadingSpinner />}>
            <AboutMe />
          </Suspense>
        </motion.main>
        <Footer />
      </Suspense>
    </div>
  );
}
