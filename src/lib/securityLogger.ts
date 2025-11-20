// Security Event Logger for Client-Side Security Monitoring
// Implements OWASP A09:2021 Security Logging and Monitoring Failures mitigation

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

// Generate a simple fingerprint for tracking repeated attempts from same session
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

const getStoredEvents = (): SecurityEvent[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const storeEvents = (events: SecurityEvent[]): void => {
  if (typeof window === 'undefined') return;
  try {
    // Rotate events if exceeding max
    const eventsToStore = events.length > MAX_EVENTS
      ? events.slice(-EVENTS_TO_KEEP)
      : events;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsToStore));
  } catch (error) {
    console.error('Failed to store security events:', error);
    // Clear storage if corrupted
    localStorage.removeItem(STORAGE_KEY);
  }
};

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

const determineSeverity = (riskScore: number): SecurityEvent['severity'] => {
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 60) return 'high';
  if (riskScore >= 30) return 'medium';
  return 'low';
};

// Check for suspicious patterns in input
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

// Core logging function
export const logSecurityEvent = (eventData: Omit<SecurityEvent, 'id' | 'timestamp' | 'userAgent' | 'url' | 'riskScore' | 'severity'>): void => {
  if (typeof window === 'undefined') return;

  const event: SecurityEvent = {
    id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...eventData,
  };

  // Calculate risk and severity
  event.riskScore = calculateRiskScore(event);
  event.severity = determineSeverity(event.riskScore);

  // Add fingerprint for tracking
  event.details.fingerprint = generateSessionFingerprint();

  // Store event
  const existingEvents = getStoredEvents();
  const newEvents = [...existingEvents, event];
  storeEvents(newEvents);

  // Console logging for development/monitoring
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

  // Potentially integrate with analytics (if configured)
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

// Specific logging functions for different types of security events
export const logFormValidationFailure = (
  component: string,
  field: string,
  value: string,
  validationError: string
): void => {
  // Check if input is suspicious
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

export const logSuspiciousActivity = (
  activity: string,
  details: Record<string, unknown>
): void => {
  logSecurityEvent({
    type: 'suspicious_input',
    details: { activity, ...details },
  });
};

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

// Utility function to get security events for reporting/debugging
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

// Export events for analysis (admin use only)
export const exportSecurityEvents = (): string => {
  const events = getStoredEvents();
  return JSON.stringify(events, null, 2);
};

// Clear old events
export const clearOldSecurityEvents = (daysToKeep: number = 30): void => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const events = getStoredEvents();
  const filteredEvents = events.filter(event =>
    new Date(event.timestamp) > cutoffDate
  );

  storeEvents(filteredEvents);
};

// Get security summary
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

// Track form submissions for rate limiting
const submissionTracker = new Map<string, { count: number; firstAttempt: number }>();

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

// Auto-clear old trackers periodically
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
