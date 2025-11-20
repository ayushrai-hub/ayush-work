/**
 * Main entry point — Initializes and mounts the React application.
 *
 * This module sets up the root React renderer, wrapping the app with all necessary providers for theme, GTM, and SEO. It uses createRoot for React 18 concurrent features.
 *
 * Notes:
 * - Assumes an element with id="root" exists in index.html
 * - StrictMode is enabled for development warnings
 * - All context providers are initialized here for global availability
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import GTMProvider from "./components/GTMProvider.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import App from "./App.tsx";
import "./index.css";
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <GTMProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </GTMProvider>
    </ThemeProvider>
  </StrictMode>
);
