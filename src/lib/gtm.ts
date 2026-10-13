/**
 * Google Tag Manager setup: the container ID and `dataLayer` initialisation.
 *
 * GTM_ID comes from VITE_GTM_ID and falls back to GTM-NJZ5ZBX4, the container index.html already
 * loads inline. `Window.dataLayer` is typed in src/vite-env.d.ts.
 *
 * Connects to:
 * - src/main.tsx renders src/components/layout/GTMProvider.tsx, which uses initGTM and GTM_ID (it
 *   injects gtm.js only when GTM_ID differs from the default).
 */

/** GTM container ID: VITE_GTM_ID at build time, else the container hard-coded in index.html. */
export const GTM_ID = import.meta.env.VITE_GTM_ID || 'GTM-NJZ5ZBX4';

/** Ensures `window.dataLayer` exists. No-op on the server. */
export const initGTM = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};
