'use client';

import React, { Suspense } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import ParticleBackground from '../../src/components/ParticleBackground';

// Lazy load components
const Contact = React.lazy(() => import('../../src/components/Contact'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
  </div>
);

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-gray-100 relative overflow-x-hidden transition-colors duration-300 safe-area">
      <ParticleBackground />

      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <main className="pt-20">
          <Suspense fallback={<LoadingSpinner />}>
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}
