// Type definitions for GTM
type GtagParameters = Record<string, string | number | boolean | null | undefined>;
type GTMEvent = Record<string, unknown>;

// Google Tag Manager utility functions
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: [eventName: string, ...rest: unknown[]]) => void;
  }
}

export const GTM_ID = import.meta.env.VITE_GTM_ID || 'GTM-NJZ5ZBX4';

// Initialize GTM dataLayer
export const initGTM = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

// Push events to GTM dataLayer
export const gtmPush = (event: GTMEvent) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  gtmPush({
    event: 'page_view',
    page_location: url,
    page_title: title || document.title,
  });
};

// Track custom events
export const trackEvent = (eventName: string, parameters: GtagParameters = {}) => {
  gtmPush({
    event: eventName,
    ...parameters,
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  gtmPush({
    event: 'form_submit',
    form_name: formName,
    form_success: success,
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location?: string) => {
  gtmPush({
    event: 'button_click',
    button_name: buttonName,
    click_location: location,
  });
};

// Track downloads
export const trackDownload = (fileName: string, fileType?: string) => {
  gtmPush({
    event: 'file_download',
    file_name: fileName,
    file_type: fileType,
  });
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string) => {
  gtmPush({
    event: 'external_link_click',
    link_url: url,
    link_text: linkText,
  });
};

// Track scroll depth
export const trackScrollDepth = (percentage: number) => {
  gtmPush({
    event: 'scroll_depth',
    scroll_percentage: percentage,
  });
};
