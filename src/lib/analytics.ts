/**
 * Analytics utilities — Provides Google Analytics 4 integration for user tracking.
 *
 * This module initializes GA4, tracks page views, and handles various custom events for portfolio interactions. It ensures client-side only execution and provides reusable functions for consistent tracking.
 *
 * Notes:
 * - Only runs on client side (checks typeof window)
 * - Uses gtag global function assumed available from vite-env.d.ts
 * - Measurement ID hardcoded (consider moving to environment variable for better security)
 *
 * Exports: initGA, trackPageView, trackEvent, trackGoogleAnalyticsEvent, trackPortfolioInteraction, trackContactForm, trackProjectClick, trackSocialClick, trackServiceInterest
 */

// Parameter types for analytics events
type GtagEventParams = Record<string, string | number | boolean | null | undefined>;

/**
 * Initialize Google Analytics 4.
 *
 * Loads the GA4 script and initializes tracking with privacy-focused settings.
 *
 * @returns void
 * @side-effects: Appends scripts to document.head, sets up global gtag function
 */
export const initGA = () => {
  // Use the provided measurement ID
  const GA_MEASUREMENT_ID = 'G-VBS0YJ07R8';

  if (typeof window === 'undefined') {
    console.log('Google Analytics not initialized - running on server');
    return;
  }

  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      anonymize_ip: true,
      allow_google_signals: true,
      allow_ad_features: false,
      page_title: document.title,
      page_location: window.location.href
    });
  `;
  document.head.appendChild(script2);

  console.log('Google Analytics 4 initialized with Measurement ID:', GA_MEASUREMENT_ID);
};

/**
 * Track page view events for SPA route changes.
 *
 * Updates GA4 with the current page path and optional title.
 *
 * @param pagePath - the path of the page e.g. '/home'
 * @param pageTitle - optional page title
 * @returns void
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-VBS0YJ07R8', {
      page_path: pagePath,
      page_title: pageTitle || document.title
    });
  }
};

/**
 * Track a custom analytics event.
 *
 * @param eventName - name of the event e.g. 'button_click'
 * @param parameters - optional event parameters
 * @returns void
 */
export const trackEvent = (
  eventName: string,
  parameters?: GtagEventParams
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

/**
 * Alternative function to track GA events with specific parameter interface.
 *
 * @param eventName - name of the event
 * @param parameters - event parameters with specific keys
 * @returns void
 */
interface GAParameters {
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameter_1?: string;
  custom_parameter_2?: string;
  page_location?: string;
  page_title?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export const trackGoogleAnalyticsEvent = (eventName: string, parameters: GAParameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

/**
 * Track portfolio-related interactions.
 *
 * @param action - the action e.g. 'view', 'click'
 * @param details - additional parameters
 * @returns void
 */
export const trackPortfolioInteraction = (action: string, details?: GtagEventParams) => {
  trackEvent(action, {
    category: 'portfolio_interaction',
    ...details
  });
};

/**
 * Track contact form interactions.
 *
 * @param action - the action type
 * @returns void
 */
export const trackContactForm = (action: 'start' | 'submit' | 'success' | 'error') => {
  trackEvent('contact_form', {
    action: action,
    category: 'engagement'
  });
};

/**
 * Track when a project is viewed or clicked.
 *
 * @param projectName - name of the project
 * @returns void
 */
export const trackProjectClick = (projectName: string) => {
  trackEvent('project_view', {
    project_name: projectName,
    category: 'engagement'
  });
};

/**
 * Track social media link clicks.
 *
 * @param platform - social platform e.g. 'github', 'linkedin'
 * @returns void
 */
export const trackSocialClick = (platform: string) => {
  trackEvent('social_click', {
    platform: platform,
    category: 'engagement'
  });
};

/**
 * Track when user shows interest in a service.
 *
 * @param service - name of the service
 * @returns void
 */
export const trackServiceInterest = (service: string) => {
  trackEvent('service_interest', {
    service: service,
    category: 'engagement'
  });
};
