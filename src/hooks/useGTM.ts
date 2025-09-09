import { useCallback } from 'react';
import {
  trackPageView,
  trackEvent,
  trackFormSubmission,
  trackButtonClick,
  trackDownload,
  trackExternalLink,
  trackScrollDepth,
} from '../utils/gtm';

export const useGTM = () => {
  const trackPage = useCallback((url?: string, title?: string) => {
    const currentUrl = url || window.location.href;
    const currentTitle = title || document.title;
    trackPageView(currentUrl, currentTitle);
  }, []);

  const trackCustomEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
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
