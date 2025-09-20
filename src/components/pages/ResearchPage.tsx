'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import Research from '../Research';
import { ArrowLeft } from 'lucide-react';

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
            href="/"
            className="inline-flex items-center text-secondary hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors mb-8 px-4 py-2 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-900/20"
          >
            <ArrowLeft size={16} className="mr-2" />
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
