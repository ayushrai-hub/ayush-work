/**
 * Ambient types: Vite client globals (`import.meta.env`, asset imports) and the Google tag globals.
 *
 * `Window.dataLayer` and `Window.gtag` are declared only here. `gtag` is optional because it exists
 * only after the GA4 snippet in index.html (or initGA) runs; callers check for it first.
 *
 * Connects to:
 * - Included by tsconfig.app.json (`src`). dataLayer: src/lib/gtm.ts and
 *   src/components/layout/GTMProvider.tsx. gtag: src/lib/analytics.ts and
 *   src/components/layout/ErrorBoundary.tsx.
 */
/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    /** GTM container to inject when it differs from the one index.html loads. */
    readonly VITE_GTM_ID?: string;
  }

  interface Window {
    dataLayer: unknown[];
    gtag?: (command: "config" | "event" | "js" | "set" | "consent", ...args: unknown[]) => void;
  }
}

export {};
