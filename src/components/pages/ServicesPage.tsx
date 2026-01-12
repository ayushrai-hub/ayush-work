import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Services from '../Services';
import { ArrowLeft } from 'lucide-react';

const ServicesPage: React.FC = () => {
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
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
