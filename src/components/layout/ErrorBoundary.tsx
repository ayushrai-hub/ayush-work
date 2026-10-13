/**
 * React error boundary that logs render errors and shows a fallback instead of crashing its subtree.
 *
 * A class component (React has no hook equivalent). getDerivedStateFromError sets `hasError`;
 * componentDidCatch writes a console warning, records an `unexpected_error` event through
 * logSecurityEvent, and sends a GA4 `exception` event when `window.gtag` exists. On error it
 * renders `fallback` if given, otherwise a "Something went wrong" card with a Try Again button
 * when `showUserMessage` is true, otherwise nothing. Try Again clears the error state and
 * re-renders the children. The card uses raw Tailwind red/gray colors, not the site's paper/ink
 * design tokens.
 *
 * Connects to:
 * - Not mounted in the live app: src/main.tsx, src/App.tsx, and src/components/site/* do not import
 *   it, so route render errors are not caught by any boundary. Its only importer is
 *   src/__tests__/ErrorBoundary.test.tsx.
 * - lib/securityLogger: logSecurityEvent, which stores events in localStorage and also sends its
 *   own `security_event` to gtag
 * - `window.gtag` is declared in src/vite-env.d.ts and loaded by the GA script in index.html
 *
 * @example
 * ```tsx
 * import ErrorBoundary from "./components/layout/ErrorBoundary";
 *
 * <ErrorBoundary context="Main App" showUserMessage>
 *   <AppContent />
 * </ErrorBoundary>
 * ```
 */
import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { logSecurityEvent } from '../../lib/securityLogger';

/**
 * Props for the ErrorBoundary component.
 */
interface Props {
  /** Child components to render within the error boundary */
  children: ReactNode;
  /** Optional custom fallback UI to display on error */
  fallback?: ReactNode;
  /** Show the default error card when no `fallback` is given. Off by default, in every environment; when off, the boundary renders nothing on error. */
  showUserMessage?: boolean;
  /** Label for where the error occurred, used in logs and in the error card (e.g. "Main App") */
  context?: string;
}

/**
 * State for the ErrorBoundary component.
 */
interface State {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The error object if one was caught */
  error?: Error;
}

/**
 * Error boundary class. Catches errors thrown while rendering its children (not errors in event
 * handlers or async code), logs them via logSecurityEvent and gtag, and renders `fallback`, the
 * default card, or null. Currently used only by src/__tests__/ErrorBoundary.test.tsx.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /** Switches to the fallback on the next render. */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /** Side effects for a caught error: console warning, logSecurityEvent, and a gtag `exception` event. */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn(`ErrorBoundary caught an error in ${this.props.context || 'component'}:`, error, errorInfo);

    // Stack and errorInfo are truncated before storage.
    logSecurityEvent({
      type: 'unexpected_error',
      details: {
        component: this.props.context || 'unknown',
        errorMessage: error.message,
        stack: error.stack?.slice(0, 500),
        errorInfo: JSON.stringify(errorInfo, null, 2).slice(0, 1000),
      },
    });

    // GA4 exception event, only when the gtag script has loaded.
    if (typeof window !== 'undefined' && 'gtag' in window && window.gtag) {
      window.gtag('event', 'exception', {
        description: `ErrorBoundary: ${this.props.context || 'unknown'} - ${error.message}`,
        fatal: false
      });
    }
  }

  /** Clears the error so the children render again; if they throw again the fallback returns. */
  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  /** Renders children, or on error: `fallback`, else the error card if `showUserMessage`, else null. */
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.props.showUserMessage) {
        return (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md w-full text-center">
              <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                We encountered an error with {this.props.context || 'this component'}.
                The page should still work, but some features might be unavailable.
              </p>
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        );
      }

      // Without `fallback` or `showUserMessage`, the failed subtree renders nothing.
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
