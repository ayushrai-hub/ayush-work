/**
 * ErrorBoundary.tsx — React error boundary component for graceful error handling.
 *
 * This component provides comprehensive error boundary functionality for React applications,
 * catching JavaScript errors anywhere in the component tree, logging them, and displaying
 * appropriate fallback UI. Implements security logging for error incidents and provides
 * both user-facing error messages and developer logging.
 *
 * The component includes:
 * - React error boundary with fallback rendering
 * - Security event logging for error incidents
 * - Google Tag Manager integration for error tracking
 * - Configurable user-facing error messages
 * - Context-aware error reporting
 *
 * @component
 * @example
 * ```tsx
 * import ErrorBoundary from './components/ErrorBoundary';
 *
 * function App() {
 *   return (
 *     <ErrorBoundary context="Main App">
 *       <AppContent />
 *     </ErrorBoundary>
 *   );
 * }
 * ```
 *
 * @see {@link src/lib/securityLogger.ts} for security logging integration
 */
import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { logSecurityEvent } from '../lib/securityLogger';

/**
 * Props for the ErrorBoundary component.
 */
interface Props {
  /** Child components to render within the error boundary */
  children: ReactNode;
  /** Optional custom fallback UI to display on error */
  fallback?: ReactNode;
  /** Whether to show user-facing error messages (defaults to false for production) */
  showUserMessage?: boolean;
  /** Additional context about where the error occurred (e.g., "Three.js rendering") */
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
 * ErrorBoundary — React error boundary component for graceful error handling.
 *
 * Catches and handles React errors gracefully, preventing application crashes.
 * Implements security logging for error incidents and provides configurable
 * fallback UI for different deployment environments.
 *
 * Security features:
 * - Automatic security event logging for errors
 * - GTM integration for analytics tracking
 * - Context-aware error reporting
 * - Debug information for developers
 *
 * @component
 * @example
 * ```tsx
 * <ErrorBoundary context="Three.js rendering">
 *   <ThreeJSComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn(`ErrorBoundary caught an error in ${this.props.context || 'component'}:`, error, errorInfo);

    // Log security event for unexpected error
    logSecurityEvent({
      type: 'unexpected_error',
      details: {
        component: this.props.context || 'unknown',
        errorMessage: error.message,
        stack: error.stack?.slice(0, 500),
        errorInfo: JSON.stringify(errorInfo, null, 2).slice(0, 1000),
      },
    });

    // Log to analytics if available (you could integrate with your analytics system here)
    if (typeof window !== 'undefined' && 'gtag' in window && window.gtag) {
      window.gtag('event', 'exception', {
        description: `ErrorBoundary: ${this.props.context || 'unknown'} - ${error.message}`,
        fatal: false
      });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI for user-facing errors
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

      // Silent fallback for non-critical errors (like Three.js)
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
