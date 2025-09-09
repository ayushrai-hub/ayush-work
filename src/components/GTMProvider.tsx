import React, { useEffect } from 'react';
import { initGTM, GTM_ID } from '../utils/gtm';

interface GTMProviderProps {
  children: React.ReactNode;
}

export const GTMProvider: React.FC<GTMProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize GTM dataLayer
    initGTM();

    // Load GTM script dynamically if not already loaded
    if (GTM_ID && GTM_ID !== 'GTM-NJZ5ZBX4' && !document.querySelector(`script[src*="${GTM_ID}"]`)) {
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
    }
  }, []);

  return <>{children}</>;
};

export default GTMProvider;
