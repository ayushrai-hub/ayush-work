/**
 * Ambient types: Vite client globals (`import.meta.env`, asset imports) and a `Window.gtag` declaration.
 *
 * The gtag signature here (`command`, `targetId`, optional `config`) conflicts with the variadic one
 * in src/lib/gtm.ts. tsc reports TS2717 for this file only with skipLibCheck off; with the project's
 * skipLibCheck on, the gtm.ts signature is the one callers see.
 *
 * Connects to:
 * - Included by tsconfig.app.json (`src`). gtag callers: src/lib/analytics.ts, src/lib/webVitals.ts,
 *   src/lib/securityLogger.ts.
 */
/// <reference types="vite/client" />

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export {};
