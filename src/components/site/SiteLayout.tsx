import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SkipLink from "./SkipLink";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import SearchDialog from "./SearchDialog";

export default function SiteLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
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
      <SkipLink />
      <SiteHeader onOpenSearch={openSearch} />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
