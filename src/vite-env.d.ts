/**
 * Type declarations — Extends global types for Vite and Google Analytics.
 *
 * This module augments the global Window interface to include the gtag function for Google Analytics tracking, allowing TypeScript to recognize it without external type packages.
 *
 * Notes:
 * - Referenced types include vite/client for Vite-specific globals
 * - gtag declaration matches GA4 syntax with optional config object
 */
/// <reference types="vite/client" />

// Google Analytics types
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js",
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export {};
