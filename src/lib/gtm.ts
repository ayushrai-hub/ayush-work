/**
 * Google Tag Manager helpers: container ID, dataLayer setup, and typed dataLayer event pushers.
 *
 * Every helper pushes a plain object onto `window.dataLayer`; none of them call gtag. GTM_ID comes
 * from VITE_GTM_ID and falls back to GTM-NJZ5ZBX4, the container index.html already loads inline.
 *
 * Connects to:
 * - Live site: src/main.tsx renders src/components/layout/GTMProvider.tsx, which uses initGTM and
 *   GTM_ID (it injects gtm.js only when GTM_ID differs from the default).
 * - Legacy only (not routed): src/hooks/useGTM.ts wraps the track* helpers for
 *   src/components/AboutMe.tsx and src/components/layout/Footer.tsx.
 */
type GtagParameters = Record<string, string | number | boolean | null | undefined>;
type GTMEvent = Record<string, unknown>;

// Also declared, with a different gtag signature, in src/vite-env.d.ts; skipLibCheck hides the conflict.
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: [eventName: string, ...rest: unknown[]]) => void;
  }
}

/** GTM container ID: VITE_GTM_ID at build time, else the container hard-coded in index.html. */
export const GTM_ID = import.meta.env.VITE_GTM_ID || 'GTM-NJZ5ZBX4';

/** Ensures `window.dataLayer` exists. No-op on the server. */
export const initGTM = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

/** Pushes one event object onto the dataLayer; dropped if the dataLayer has not been created. */
export const gtmPush = (event: GTMEvent) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
  }
};

/** Pushes a `page_view` event; the title defaults to `document.title`. */
export const trackPageView = (url: string, title?: string) => {
  gtmPush({
    event: 'page_view',
    page_location: url,
    page_title: title || document.title,
  });
};

/** Pushes a custom event with its parameters spread into the same object. */
export const trackEvent = (eventName: string, parameters: GtagParameters = {}) => {
  gtmPush({
    event: eventName,
    ...parameters,
  });
};

/** Pushes a `form_submit` event; `success` defaults to true. */
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  gtmPush({
    event: 'form_submit',
    form_name: formName,
    form_success: success,
  });
};

/** Pushes a `button_click` event. */
export const trackButtonClick = (buttonName: string, location?: string) => {
  gtmPush({
    event: 'button_click',
    button_name: buttonName,
    click_location: location,
  });
};

/** Pushes a `file_download` event. */
export const trackDownload = (fileName: string, fileType?: string) => {
  gtmPush({
    event: 'file_download',
    file_name: fileName,
    file_type: fileType,
  });
};

/** Pushes an `external_link_click` event. */
export const trackExternalLink = (url: string, linkText?: string) => {
  gtmPush({
    event: 'external_link_click',
    link_url: url,
    link_text: linkText,
  });
};

/** Pushes a `scroll_depth` event with the percentage scrolled. */
export const trackScrollDepth = (percentage: number) => {
  gtmPush({
    event: 'scroll_depth',
    scroll_percentage: percentage,
  });
};
