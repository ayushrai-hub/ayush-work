/**
 * React error boundary for the page area: a page that throws while rendering shows a recoverable
 * fallback inside the site chrome instead of blanking the whole site.
 *
 * A class component (React has no hook equivalent). getDerivedStateFromError switches to the
 * fallback; componentDidCatch logs the error to the console and sends one GA4 `exception` event when
 * gtag is loaded. The boundary clears itself when `resetKey` changes (SiteLayout passes the pathname,
 * so navigating away recovers). A failed lazy-chunk import, which happens when a deploy replaces the
 * hashed chunk files while a tab is open, triggers one automatic reload (src/lib/chunkReload.ts),
 * which is guarded so it cannot loop.
 *
 * Connects to:
 * - src/components/site/SiteLayout.tsx wraps the routed page (and AgentView) in it.
 * - src/lib/chunkReload.ts (isChunkLoadError, reloadOnceForChunkError).
 * - `window.gtag` from the GA4 snippet in index.html (typed in src/vite-env.d.ts).
 * - src/__tests__/ErrorBoundary.test.tsx.
 */
import { Component, type ErrorInfo, type ReactNode } from "react";
import { isChunkLoadError, reloadOnceForChunkError } from "../../lib/chunkReload";

interface Props {
  children: ReactNode;
  /** When this value changes, a caught error is cleared and the children render again. */
  resetKey?: string;
  /** Custom fallback; replaces the default message. */
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

/** Catches render errors below it and renders a fallback with retry, reload, and home actions. */
class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  /** Switches to the fallback on the next render. */
  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  /** Logs the error, reports it once to GA4, and reloads once if a chunk is missing. */
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Page render failed:", error, info.componentStack);
    if (typeof window === "undefined") return;
    if (typeof window.gtag === "function") {
      window.gtag("event", "exception", {
        description: `${isChunkLoadError(error) ? "chunk_load" : "render"}: ${error.message}`.slice(0, 150),
        fatal: false,
      });
    }
    if (isChunkLoadError(error)) reloadOnceForChunkError();
  }

  /** Clears the error when `resetKey` changes, for example after navigating to another route. */
  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  /** Renders the children again; if they throw again the fallback returns. */
  private retry = () => {
    this.setState({ error: null });
  };

  /** Full page reload, which also fetches the current chunk manifest after a deploy. */
  private reload = () => {
    window.location.reload();
  };

  /** Children, or the fallback when an error was caught. */
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    const stale = isChunkLoadError(error);
    return (
      <div className="site-shell page-section" role="alert">
        <p className="label mb-3">Error</p>
        <h1 className="font-display text-3xl md:text-4xl text-ink">
          {stale ? "This page needs a reload." : "This page could not be displayed."}
        </h1>
        <p className="mt-4 max-w-measure text-ink-muted">
          {stale
            ? "The site was updated while this tab was open. Reloading fetches the current version."
            : "Something went wrong while rendering it. The rest of the site still works."}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {!stale && (
            <button type="button" onClick={this.retry} className="link-accent">
              Try again
            </button>
          )}
          <button type="button" onClick={this.reload} className="link-accent">
            Reload page
          </button>
          <a href="/" className="link-accent">
            Go to the homepage
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
