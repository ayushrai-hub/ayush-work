/**
 * GTMProvider.tsx — Google Tag Manager integration provider component.
 *
 * This component provides Google Tag Manager (GTM) integration for the entire React application.
 * Dynamically loads GTM script, initializes dataLayer, and provides seamless analytics tracking.
 * Features environment-aware configuration, error handling, and safe script loading.
 *
 * The component includes:
 * - Dynamic GTM script loading with error handling
 * - DataLayer initialization and configuration
 * - Environment-based GTM ID configuration
 * - Safe loading with browser environment checks
 * - Graceful degradation when GTM unavailable
 *
 * Security features:
 * - Environment variable-based configuration
 * - Safe script injection
 * - Error logging for tracking failures
 *
 * @component
 * @example
 * ```tsx
 * import GTMProvider from './components/GTMProvider';
 *
 * function App() {
 *   return (
 *     <GTMProvider>
 *       <AppContent />
 *     </GTMProvider>
 *   );
 * }
 * ```
 *
 * @see {@link src/utils/gtm.ts} for GTM utilities
 * @see {@link src/hooks/useGTM.ts} for GTM integration hook
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
 * GTMProvider — Google Tag Manager integration provider.
 *
 * Provides GTM integration for the entire React application with
 * dynamic script loading, dataLayer initialization, and environment-aware
 * configuration. Ensures safe GTM integration with error handling.
 *
 * @component
 * @param {GTMProviderProps} props - Component props
 * @returns {JSX.Element} The rendered provider component
 *
 * @example
 * ```tsx
 * <GTMProvider>
 *   <App />
 * </GTMProvider>
 * ```
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
