/**
 * Client-side security event log kept in localStorage, plus a per-form submission rate limiter.
 *
 * logSecurityEvent stamps an event with id, time, user agent, URL, a heuristic risk score, severity,
 * and a canvas-based session fingerprint, appends it to localStorage key `security_events` (trimmed
 * to the newest 800 once it passes 1000), logs it to the console, and forwards a `security_event` to
 * gtag when present. Nothing is sent to a server. Importing the module starts a 60-second
 * setInterval that prunes the in-memory submission tracker; it is never cleared.
 *
 * Connects to:
 * - Legacy only (not routed): src/components/Contact.tsx and src/components/layout/ErrorBoundary.tsx
 *   (ErrorBoundary is imported only by src/__tests__/ErrorBoundary.test.tsx).
 * - The reporting helpers (getSecurityEvents, exportSecurityEvents, clearOldSecurityEvents,
 *   getSecuritySummary) and logSuspiciousActivity, logValidationBypassAttempt, logRepeatedFailures,
 *   and _detectSuspiciousPatterns have no callers.
 */

export type SecurityEventType =
  | 'form_validation_failure'
  | 'xss_attempt'
  | 'suspicious_input'
  | 'rate_limit_exceeded'
  | 'repeated_failures'
  | 'network_error'
  | 'validation_bypass_attempt'
  | 'unexpected_error'
  | 'csrf_attempt'
  | 'malicious_payload';

/** One stored event. `riskScore` and `severity` are filled in by logSecurityEvent. */
export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: SecurityEventType;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  userAgent: string;
  url: string;
  ip?: string;
  userId?: string;
  details: {
    component?: string;
    field?: string;
    value?: string;
    validationError?: string;
    attempts?: number;
    timeWindow?: number;
    errorMessage?: string;
    referrer?: string;
    fingerprint?: string;
    [key: string]: unknown;
  };
  riskScore?: number;
  resolved?: boolean;
}

const STORAGE_KEY = 'security_events';
const MAX_EVENTS = 1000;
const EVENTS_TO_KEEP = 800;

/**
 * Last 16 characters of a canvas data URL, used to correlate events from the same browser.
 * Returns a fixed marker string on the server or when canvas is unavailable.
 */
const generateSessionFingerprint = (): string => {
  if (typeof window === 'undefined') return 'ssr';
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('security-monitoring', 2, 2);
    const dataUrl = canvas.toDataURL();
    return dataUrl ? dataUrl.slice(-16) : 'no-dataurl';
  } catch {
    return 'canvas-error';
  }
};

/** Reads the event array from localStorage; returns [] on the server or on any read/parse error. */
const getStoredEvents = (): SecurityEvent[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Writes the event array, keeping only the newest EVENTS_TO_KEEP once it exceeds MAX_EVENTS.
 * On a write error (for example quota exceeded) the whole key is removed.
 */
const storeEvents = (events: SecurityEvent[]): void => {
  if (typeof window === 'undefined') return;
  try {
    const eventsToStore = events.length > MAX_EVENTS
      ? events.slice(-EVENTS_TO_KEEP)
      : events;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsToStore));
  } catch (error) {
    console.error('Failed to store security events:', error);
    localStorage.removeItem(STORAGE_KEY);
  }
};

/**
 * Heuristic 0-100 score: a base by event type, +30 for more than 3 attempts, and +50 when
 * `details.value` contains a script-like keyword. Capped at 100.
 */
const calculateRiskScore = (event: SecurityEvent): number => {
  let score = 0;

  switch (event.type) {
    case 'xss_attempt':
      score += 80;
      break;
    case 'validation_bypass_attempt':
      score += 70;
      break;
    case 'repeated_failures':
      score += 40 + (event.details.attempts || 0) * 10;
      break;
    case 'rate_limit_exceeded':
      score += 50;
      break;
    case 'suspicious_input':
      score += 30;
      break;
    case 'form_validation_failure':
      score += 10;
      break;
    case 'network_error':
      score += 5;
      break;
    default:
      score += 20;
  }

  // Increase score for repeated events in short time
  if ((event.details.attempts || 0) > 3) score += 30;

  // Increase score for certain keywords in input
  if (event.details.value) {
    const suspiciousPatterns = ['script', 'javascript:', 'onload', 'eval', '<iframe'];

    if (suspiciousPatterns.some(pattern =>
      event.details.value!.toLowerCase().includes(pattern)
    )) {
      score += 50;
    }
  }

  return Math.min(score, 100);
};

/** Maps a risk score to severity: >=80 critical, >=60 high, >=30 medium, else low. */
const determineSeverity = (riskScore: number): SecurityEvent['severity'] => {
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 60) return 'high';
  if (riskScore >= 30) return 'medium';
  return 'low';
};

/** True when the input contains script/event-handler markup, embedding or form tags, or control characters. */
const detectSuspiciousPatterns = (input: string): boolean => {
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<form[^>]*>/gi,
    /<input[^>]*>/gi,
    /<meta[^>]*>/gi,
    // eslint-disable-next-line no-control-regex
    /\x00/g, // null bytes
    // eslint-disable-next-line no-control-regex
    /[\u0000-\u001F\u007F-\u009F]/, // control characters
  ];

  return suspiciousPatterns.some(pattern => pattern.test(input));
};

/**
 * Records one event: adds id, timestamp, user agent, URL, risk score, severity, and fingerprint,
 * appends it to localStorage, logs it at a console level matching severity, and sends a
 * `security_event` to gtag if loaded. No-op on the server.
 */
export const logSecurityEvent = (eventData: Omit<SecurityEvent, 'id' | 'timestamp' | 'userAgent' | 'url' | 'riskScore' | 'severity'>): void => {
  if (typeof window === 'undefined') return;

  const event: SecurityEvent = {
    id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...eventData,
  };

  event.riskScore = calculateRiskScore(event);
  event.severity = determineSeverity(event.riskScore);

  // Mutates the caller's `details` object, since `...eventData` copies it by reference.
  event.details.fingerprint = generateSessionFingerprint();

  const existingEvents = getStoredEvents();
  const newEvents = [...existingEvents, event];
  storeEvents(newEvents);

  const logLevel = event.severity! === 'critical' || event.severity! === 'high' ? 'error' :
                  event.severity! === 'medium' ? 'warn' : 'info';

  console[logLevel](
    `[SECURITY ${event.severity!.toUpperCase()}] ${event.type}: ${event.details.errorMessage || ''}`,
    {
      id: event.id,
      riskScore: event.riskScore,
      details: event.details,
    }
  );

  if (typeof window !== 'undefined' && (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag('event', 'security_event', {
        event_type: event.type,
        severity: event.severity!,
        risk_score: event.riskScore,
      });
    } catch {
      // Silently fail if analytics is not properly configured
    }
  }
};

/**
 * Logs a failed form validation. Input matching detectSuspiciousPatterns is logged as `xss_attempt`
 * with the value replaced by a placeholder; otherwise the first 100 characters are stored.
 */
export const logFormValidationFailure = (
  component: string,
  field: string,
  value: string,
  validationError: string
): void => {
  const isSuspicious = detectSuspiciousPatterns(value);

  logSecurityEvent({
    type: isSuspicious ? 'xss_attempt' : 'form_validation_failure',
    details: {
      component,
      field,
      value: isSuspicious ? '[FILTERED - SUSPICIOUS CONTENT]' : value.slice(0, 100),
      validationError,
      isSuspicious,
    },
  });
};

/** Logs a `rate_limit_exceeded` event; called by trackFormSubmission. */
export const logRateLimitExceeded = (
  component: string,
  attempts: number,
  timeWindow: number
): void => {
  logSecurityEvent({
    type: 'rate_limit_exceeded',
    details: { component, attempts, timeWindow },
  });
};

/** Logs a `suspicious_input` event with arbitrary details. */
export const logSuspiciousActivity = (
  activity: string,
  details: Record<string, unknown>
): void => {
  logSecurityEvent({
    type: 'suspicious_input',
    details: { activity, ...details },
  });
};

/** Logs a `validation_bypass_attempt` only when sanitizing changed the value; stores both values unredacted. */
export const logValidationBypassAttempt = (
  component: string,
  originalValue: string,
  sanitizedValue: string
): void => {
  if (originalValue !== sanitizedValue) {
    logSecurityEvent({
      type: 'validation_bypass_attempt',
      details: { component, originalValue, sanitizedValue },
    });
  }
};

/** Logs a `repeated_failures` event; risk grows with `attempts`. */
export const logRepeatedFailures = (
  component: string,
  attempts: number,
  timeWindow: number
): void => {
  logSecurityEvent({
    type: 'repeated_failures',
    details: { component, attempts, timeWindow },
  });
};

/** Logs a `network_error` with the message and the first 200 characters of the stack. */
export const logNetworkError = (
  error: Error,
  component: string,
  context?: Record<string, unknown>
): void => {
  logSecurityEvent({
    type: 'network_error',
    details: {
      component,
      errorMessage: error.message,
      stack: error.stack?.slice(0, 200),
      ...context,
    },
  });
};

/** Returns stored events, optionally filtered by type, severity, and minimum timestamp. */
export const getSecurityEvents = (
  filter?: { type?: SecurityEventType; severity?: SecurityEvent['severity']; since?: Date }
): SecurityEvent[] => {
  const events = getStoredEvents();

  if (!filter) return events;

  return events.filter(event => {
    if (filter.type && event.type !== filter.type) return false;
    if (filter.severity && event.severity !== filter.severity) return false;
    if (filter.since && new Date(event.timestamp) < filter.since) return false;
    return true;
  });
};

/** Stored events as pretty-printed JSON. There is no access control; anything on the page can call it. */
export const exportSecurityEvents = (): string => {
  const events = getStoredEvents();
  return JSON.stringify(events, null, 2);
};

/** Drops stored events older than `daysToKeep` days (default 30). */
export const clearOldSecurityEvents = (daysToKeep: number = 30): void => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const events = getStoredEvents();
  const filteredEvents = events.filter(event =>
    new Date(event.timestamp) > cutoffDate
  );

  storeEvents(filteredEvents);
};

/** Counts by severity, the last 10 events, and the mean risk score of all stored events. */
export const getSecuritySummary = () => {
  const events = getStoredEvents();
  const critical = events.filter(e => e.severity === 'critical').length;
  const high = events.filter(e => e.severity === 'high').length;
  const medium = events.filter(e => e.severity === 'medium').length;
  const low = events.filter(e => e.severity === 'low').length;

  return {
    total: events.length,
    bySeverity: { critical, high, medium, low },
    recentEvents: events.slice(-10),
    riskScore: events.length > 0 ? events.reduce((sum, e) => sum + (e.riskScore || 0), 0) / events.length : 0,
  };
};

/** In-memory submission counts per form id; reset on page reload. */
const submissionTracker = new Map<string, { count: number; firstAttempt: number }>();

/**
 * Fixed-window client-side rate limit. Returns true and counts the attempt when allowed; returns
 * false and logs `rate_limit_exceeded` once `maxAttempts` (default 5) is reached within `windowMs`
 * (default 60 s). Not a security boundary: it lives in the browser.
 */
export const trackFormSubmission = (formId: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const existing = submissionTracker.get(formId);

  if (!existing) {
    submissionTracker.set(formId, { count: 1, firstAttempt: now });
    return true;
  }

  // Reset if outside window
  if (now - existing.firstAttempt > windowMs) {
    submissionTracker.set(formId, { count: 1, firstAttempt: now });
    return true;
  }

  // Check rate limit
  if (existing.count >= maxAttempts) {
    logRateLimitExceeded('form_submissions', existing.count + 1, windowMs);
    return false;
  }

  existing.count++;
  return true;
};

// Prunes trackers older than an hour. Starts at import time, without a window check, and is never cleared.
setInterval(() => {
  const now = Date.now();
  const maxAge = 3600000; // 1 hour
  for (const [key, value] of submissionTracker.entries()) {
    if (now - value.firstAttempt > maxAge) {
      submissionTracker.delete(key);
    }
  }
}, 60000); // Check every minute

export { detectSuspiciousPatterns as _detectSuspiciousPatterns };
