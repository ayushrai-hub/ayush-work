'use client';

import React, { Suspense } from 'react';

// Lazy load the existing ResearchPage component
const ResearchPage = React.lazy(() => import('../../src/components/pages/ResearchPage'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
  </div>
);

export default function Research() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResearchPage />
    </Suspense>
  );
}
