// Web Vitals monitoring for Core Web Vitals
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

export function reportWebVitals(callback: (metric: any) => void) {
  if (typeof window !== 'undefined') {
    // Core Web Vitals
    onCLS(callback);
    onFID(callback);
    onFCP(callback);
    onLCP(callback);
    onTTFB(callback);
  }
}

// Analytics integration for web vitals
export function trackWebVitals(metric: any) {
  if (typeof window !== 'undefined') {
    // Send to Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Also log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Web Vitals - ${metric.name}:`, metric);
    }
  }
}
