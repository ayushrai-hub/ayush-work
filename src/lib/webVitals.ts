/**
 * Core Web Vitals reporting via the `web-vitals` package, with a gtag forwarder.
 *
 * reportWebVitals subscribes a callback to CLS, INP, FCP, LCP, and TTFB. trackWebVitals is a ready
 * callback that sends each metric to gtag as an event (CLS scaled by 1000 so it rounds to an integer)
 * and logs it in development.
 *
 * Connects to:
 * - Nothing imports this module; it is dead code. MarkdownDocs/performance-baseline.md suggests
 *   calling reportWebVitals from App.tsx, which was never done.
 * - web-vitals (its only importer in the repo).
 */
import { onCLS, onFCP, onINP, onLCP, onTTFB, Metric } from 'web-vitals';

/** Registers `callback` for each Core Web Vital plus FCP and TTFB. No-op on the server. */
export function reportWebVitals(callback: (metric: Metric) => void) {
  if (typeof window !== 'undefined') {
    onCLS(callback);
    onINP(callback);
    onFCP(callback);
    onLCP(callback);
    onTTFB(callback);
  }
}

/** Sends one metric to gtag as a non-interaction event named after the metric. */
export function trackWebVitals(metric: Metric) {
  if (typeof window !== 'undefined') {
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`Web Vitals - ${metric.name}:`, metric);
    }
  }
}
