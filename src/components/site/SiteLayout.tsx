/**
 * Shared shell for every route: skip link, header, main#main, footer, search dialog, and WebMCP registration.
 *
 * Owns the search dialog's open state and registers global shortcuts: Cmd/Ctrl+K opens search
 * from anywhere, including inside inputs; "/" opens it only when focus is not in an editable
 * field. When the URL has `?agent=1`, <main> renders AgentView (the route's Markdown twin)
 * instead of the matched page via <Outlet />. The page area sits inside an ErrorBoundary keyed on
 * the URL, so a page that throws (or a lazy chunk that fails to load) leaves the header and footer
 * in place, and navigating elsewhere recovers.
 *
 * Connects to:
 * - Used as the parent layout route in App.tsx (AppRoutes), for both the browser app and the
 *   entry-server prerender
 * - Renders ScrollManager, SkipLink, SiteHeader, SiteFooter, SearchDialog, AgentView,
 *   PortfolioWebMcp, and components/layout/ErrorBoundary
 */
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import ErrorBoundary from "../layout/ErrorBoundary";
import SkipLink from "./SkipLink";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import SearchDialog from "./SearchDialog";
import AgentView from "./AgentView";
import PortfolioWebMcp from "./PortfolioWebMcp";
import ScrollManager from "./ScrollManager";

/** Layout route component; `searchOpen` is the SearchDialog state, `agentView` mirrors `?agent=1`. */
export default function SiteLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [params] = useSearchParams();
  const location = useLocation();
  const agentView = params.get("agent") === "1";
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const editable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }

      if (e.key === "/" && !editable && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <ScrollManager />
      <SkipLink />
      <SiteHeader onOpenSearch={openSearch} />
      <main id="main" className="flex-1">
        <ErrorBoundary resetKey={`${location.pathname}${location.search}`}>
          {agentView ? <AgentView /> : <Outlet />}
        </ErrorBoundary>
      </main>
      <SiteFooter />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
      <PortfolioWebMcp />
    </div>
  );
}
