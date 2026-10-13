/**
 * Google Analytics 4 helpers: a script loader and a thin `window.gtag` event wrapper.
 *
 * initGA injects gtag.js and a `gtag('config', ...)` call for the hard-coded measurement ID
 * G-VBS0YJ07R8. trackEvent calls `window.gtag` only when it exists, so it is a no-op on the server
 * and before the script loads. `Window.gtag` is typed in src/vite-env.d.ts; the function itself
 * comes from the injected script (or the inline snippet in index.html).
 *
 * Connects to:
 * - Live site: src/App.tsx calls initGA once on mount. index.html already loads gtag.js and configures
 *   the same measurement ID inline, so initGA finds that script and skips injection; it only loads GA
 *   when the page has no snippet. Client-side route changes are not reported from code; GA4's
 *   history-based page views (a dashboard setting) decide whether they are counted.
 * - src/__tests__/analytics.test.ts covers initGA and trackEvent.
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
