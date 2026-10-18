/**
 * Browser entry: mounts the React app into `#root` in index.html.
 *
 * Wraps App in StrictMode, ThemeProvider, GTMProvider, and HelmetProvider, and renders Vercel Web
 * Analytics beside it. It uses createRoot, not hydrateRoot, so the prerendered markup from
 * scripts/prerender.mjs is replaced by a fresh client render rather than hydrated. hydrateRoot was
 * measured to mismatch for a saved dark theme, `?agent=1`, and `?audience=`; see issue 10 in
 * docs/known-issues.md before switching.
 *
 * Connects to:
 * - index.html loads this module; global styles come from src/index.css.
 * - src/App.tsx, src/contexts/ThemeContext.tsx, src/components/layout/GTMProvider.tsx (src/lib/gtm.ts),
 *   @vercel/analytics/react. The SSR counterpart is src/entry-server.tsx.
 * - On Netlify (the live www host), netlify.toml proxies /_vercel/insights/* to the Vercel alias so
 *   the Analytics script and its beacons reach the ayush-work project.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
import GTMProvider from "./components/layout/GTMProvider.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <GTMProvider>
        <HelmetProvider>
          <App />
          <Analytics />
        </HelmetProvider>
      </GTMProvider>
    </ThemeProvider>
  </StrictMode>
);
