/**
 * Scroll position after client-side navigation: top of the new page, or the `#hash` target.
 *
 * BrowserRouter does not manage scroll, so without this a link clicked low on one page opens the
 * next page at the same offset, and `#slug` links from search and the timeline never reach their
 * anchor. On PUSH and REPLACE navigations it scrolls to the element whose id matches the hash, or to
 * the top when there is no hash. A lazily loaded page may not have rendered its anchors yet, so it
 * retries for a few animation frames. POP (back/forward and the first load) is left to the browser,
 * which restores the previous position itself. Renders nothing.
 *
 * Connects to:
 * - Mounted once in src/components/site/SiteLayout.tsx.
 * - Anchors are the `id={slug}` list items on /about, /education, /leadership, /recognition,
 *   /principles, /projects, and the domain pages.
 * - src/__tests__/scrollManager.test.tsx.
 */
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/** Animation frames to wait for a hash target before giving up and scrolling to the top. */
const MAX_FRAMES = 30;

/** Effect-only component; see the file header. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") return;
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }

    let frame = 0;
    let tries = 0;
    const seek = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView();
        return;
      }
      tries += 1;
      if (tries < MAX_FRAMES) frame = window.requestAnimationFrame(seek);
      else window.scrollTo(0, 0);
    };
    seek();
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, navigationType]);

  return null;
}
