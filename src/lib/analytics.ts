/**
 * Google Analytics 4 helpers: script loader plus thin `window.gtag` event wrappers.
 *
 * initGA injects gtag.js and a `gtag('config', ...)` call for the hard-coded measurement ID
 * G-VBS0YJ07R8. The track* helpers call `window.gtag` only when it exists, so they are no-ops on the
 * server and before the script loads. vite-env.d.ts and gtm.ts only declare the `gtag` type; the
 * function itself comes from the injected script (or the inline snippet in index.html).
 *
 * Connects to:
 * - Live site: src/App.tsx calls initGA once on mount. index.html already loads gtag.js and configures
 *   the same measurement ID inline, so initGA finds that script and skips injection; it only loads GA
 *   when the page has no snippet.
 * - Legacy only (not routed): src/components/Contact.tsx uses trackContactForm and trackServiceInterest.
 * - src/__tests__/analytics.test.ts covers initGA and trackEvent. trackPageView,
 *   trackGoogleAnalyticsEvent, trackPortfolioInteraction, trackProjectClick, and trackSocialClick
 *   have no callers.
 */

/** Event parameter bag accepted by gtag. */
type GtagEventParams = Record<string, string | number | boolean | null | undefined>;

/**
 * Initialize Google Analytics 4.
 *
 * Appends gtag.js and an inline script that defines `window.gtag` and configures the property with
 * IP anonymization and ad features off. Does nothing when a gtag.js script for the same ID is
 * already on the page, which is the case for every page built from index.html.
 *
 * @returns void
 * @side-effects: Appends scripts to document.head, sets up global gtag function
 */
export const initGA = () => {
  const GA_MEASUREMENT_ID = 'G-VBS0YJ07R8';

  if (typeof window === 'undefined') {
    console.log('Google Analytics not initialized - running on server');
    return;
  }

  // index.html already loads and configures this property; a second config sends a second page_view.
  if (document.querySelector(`script[src*="gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
    return;
  }

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

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
 * Re-sends `config` with the new path and optional title. No code calls this, so client-side route
 * changes are not reported from here.
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

/** GA event parameters with the common keys spelled out; any other key is also allowed. */
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

/**
 * Same as trackEvent, typed with GAParameters and defaulting to an empty parameter object.
 *
 * @param eventName - name of the event
 * @param parameters - event parameters with specific keys
 * @returns void
 */
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
