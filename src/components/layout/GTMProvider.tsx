/**
 * Live Google Tag Manager provider that wraps the client app and ensures `window.dataLayer` exists.
 *
 * This is the GTM provider the current site uses; it is type-checked by
 * tsconfig.app.json. index.html already embeds the GTM snippet for the default
 * container GTM-NJZ5ZBX4, so on mount this component only initialises
 * `dataLayer`. It injects gtm.js itself only when VITE_GTM_ID names a different
 * container that is not already on the page. It renders its children unchanged.
 *
 * Connects to:
 * - src/main.tsx, which wraps HelmetProvider and App in it (client entry only)
 * - src/__tests__/App.test.tsx, which mocks it as a pass-through
 * - src/lib/gtm.ts for GTM_ID and initGTM; events are pushed separately via src/hooks/useGTM.ts
 */
import React, { useEffect } from 'react';
import { initGTM, GTM_ID } from '../../lib/gtm';

/**
 * Props for the GTMProvider component.
 */
interface GTMProviderProps {
  /** Child components to render within the provider */
  children: React.ReactNode;
}

/**
 * Runs once on mount: initialises `dataLayer`, then, for a non-default GTM_ID
 * with no matching script tag, inserts gtm.js and pushes the `gtm.js` start event.
 * Script-insertion errors are logged with console.warn and otherwise ignored.
 */
export const GTMProvider: React.FC<GTMProviderProps> = ({ children }) => {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Initialize GTM dataLayer
    initGTM();

    // GTM-NJZ5ZBX4 is already loaded by the inline snippet in index.html; loading it again would double-count.
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
