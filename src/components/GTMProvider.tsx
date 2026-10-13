/**
 * Legacy duplicate of src/components/layout/GTMProvider.tsx.
 *
 * Legacy: not imported anywhere; src/main.tsx uses src/components/layout/GTMProvider.tsx.
 * Kept for reference; excluded from tsconfig.app.json. No test covers it.
 * Its import `../utils/gtm` does not resolve (src/utils does not exist; the
 * module is now src/lib/gtm.ts), so this file would fail to compile if included.
 *
 * The component body matches the live provider: it initialises `dataLayer` and
 * injects gtm.js only for a non-default GTM_ID.
 *
 * Connects to:
 * - No importers
 * - ../utils/gtm (missing; see src/lib/gtm.ts)
 */
import React, { useEffect } from 'react';
import { initGTM, GTM_ID } from '../utils/gtm';

/**
 * Props for the GTMProvider component.
 */
interface GTMProviderProps {
  /** Child components to render within the provider */
  children: React.ReactNode;
}

/**
 * Initialises `dataLayer` on mount and, for a non-default GTM_ID with no
 * matching script tag, inserts gtm.js. Renders its children unchanged.
 */
export const GTMProvider: React.FC<GTMProviderProps> = ({ children }) => {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Initialize GTM dataLayer
    initGTM();

    // Load GTM script dynamically if not already loaded
    if (GTM_ID && GTM_ID !== 'GTM-NJZ5ZBX4' && !document.querySelector(`script[src*="${GTM_ID}"]`)) {
      try {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
        
        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(script, firstScript);
        }

        // Initialize dataLayer with GTM start event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js'
        });
      } catch (error) {
        console.warn('GTMProvider: Could not initialize GTM', error);
      }
    }
  }, []);

  return <>{children}</>;
};

export default GTMProvider;
