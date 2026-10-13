/**
 * React hook exposing memoized wrappers around the GTM dataLayer helpers in src/lib/gtm.ts.
 *
 * Each returned function is a stable useCallback reference that forwards to the matching gtm.ts
 * helper; trackPage defaults to the current URL and document title.
 *
 * Connects to:
 * - Legacy only (not routed): src/components/AboutMe.tsx and src/components/layout/Footer.tsx.
 *   No live page uses it.
 * - src/lib/gtm.ts.
 */
import { useCallback } from 'react';
import {
  trackPageView,
  trackEvent,
  trackFormSubmission,
  trackButtonClick,
  trackDownload,
  trackExternalLink,
  trackScrollDepth,
} from '../lib/gtm';

/** Returns stable tracking callbacks that push events onto the GTM dataLayer. Call them only in the browser. */
export const useGTM = () => {
  const trackPage = useCallback((url?: string, title?: string) => {
    const currentUrl = url || window.location.href;
    const currentTitle = title || document.title;
    trackPageView(currentUrl, currentTitle);
  }, []);

  const trackCustomEvent = useCallback((eventName: string, parameters?: Record<string, string | number | boolean | null | undefined>) => {
    trackEvent(eventName, parameters);
  }, []);

  const trackForm = useCallback((formName: string, success?: boolean) => {
    trackFormSubmission(formName, success);
  }, []);

  const trackButton = useCallback((buttonName: string, location?: string) => {
    trackButtonClick(buttonName, location);
  }, []);

  const trackFileDownload = useCallback((fileName: string, fileType?: string) => {
    trackDownload(fileName, fileType);
  }, []);

  const trackExternal = useCallback((url: string, linkText?: string) => {
    trackExternalLink(url, linkText);
  }, []);

  const trackScroll = useCallback((percentage: number) => {
    trackScrollDepth(percentage);
  }, []);

  return {
    trackPage,
    trackCustomEvent,
    trackForm,
    trackButton,
    trackFileDownload,
    trackExternal,
    trackScroll,
  };
};

export default useGTM;
