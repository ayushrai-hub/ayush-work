/**
 * Catch-all 404 page for unmatched paths.
 *
 * Static render; no state. PageSEO gets `noIndex` and `path="/404"`. The client router cannot
 * set an HTTP status; the 404 status comes from the host serving dist/404.html.
 *
 * Connects to:
 * - Routed in src/App.tsx as `*`. DomainPage also renders it when no domain record matches the
 *   pathname. Not in src/lib/publicRoutes.ts; scripts/prerender.mjs renders `/404` separately
 *   to dist/404.html, which netlify.toml serves with status 404.
 * - Component PageSEO.
 * - No per-route Markdown twin; agents asking for Markdown on an unknown path get
 *   `renderNotFoundMarkdown()` from src/lib/agent/markdown.ts instead.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";

/** 404 page component. Lazy-loaded by the `*` route in src/App.tsx and rendered directly by DomainPage. */
export default function NotFoundPage() {
  return (
    <>
      <PageSEO
        title="Not found"
        description="This page does not exist yet."
        path="/404"
        noIndex
      />
      <div className="site-shell page-section min-h-[50vh] flex flex-col justify-center">
        <p className="label mb-3">404</p>
        <h1 className="font-display text-3xl md:text-4xl text-ink">
          This page does not exist yet.
        </h1>
        <p className="mt-4 text-lg text-ink-muted italic max-w-measure">
          That happens to ideas too.
        </p>
        <p className="mt-8">
          <Link to="/" className="btn-primary">
            Go home
          </Link>
        </p>
      </div>
    </>
  );
}
