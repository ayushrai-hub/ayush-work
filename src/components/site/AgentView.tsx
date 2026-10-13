/**
 * In-page "Agent view": shows the current route's Markdown twin with copy and download controls.
 *
 * Reads the pathname from the router, looks up the generated Markdown for that path, and renders
 * it in a <pre>. Copy tries the async Clipboard API, then a hidden-textarea execCommand fallback,
 * and if both fail selects the <pre> text and asks the user to copy manually. Download saves the
 * Markdown as a Blob named after the `.md` URL. Paths without a twin get a short notice linking
 * to llms.txt. The view sets `robots: noindex, follow` and no title or canonical of its own,
 * because the page's PageSEO is not rendered while this view replaces the route outlet.
 *
 * Connects to:
 * - Rendered by SiteLayout in place of <Outlet /> when the URL has `?agent=1` (toggled from SiteHeader)
 * - lib/agent/markdown: renderPageMarkdown (same Markdown served at `<path>.md`) and markdownPublicPath
 */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { markdownPublicPath, renderPageMarkdown } from "../../lib/agent/markdown";

/** Agent view for the current pathname; `copied` and `copyFailed` drive the button label and live-region text. */
export default function AgentView() {
  const { pathname } = useLocation();
  const markdown = renderPageMarkdown(pathname);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const filePath = markdownPublicPath(pathname);
  const filename = filePath.split("/").pop() || "page.md";

  /** Copies the Markdown: Clipboard API, then execCommand fallback, then select-and-prompt. */
  async function copy() {
    if (!markdown) return;
    setCopyFailed(false);
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      const area = document.createElement("textarea");
      area.value = markdown;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      if (!ok) {
        const block = document.getElementById("agent-markdown");
        if (block) {
          const range = document.createRange();
          range.selectNodeContents(block);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
        setCopyFailed(true);
        return;
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  /** Downloads the Markdown as a file named after the page's `.md` URL (e.g. `index.md`). */
  function download() {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    // Revoking in the same task can cancel the download in Safari and Firefox.
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  if (!markdown) {
    return (
      <div className="site-shell page-section">
        <h1 className="font-display text-3xl text-ink">No agent view for this page</h1>
        <p className="mt-4 max-w-measure text-ink-muted">
          This path does not have a Markdown twin. The index of pages that do is{" "}
          <a href="/llms.txt" className="link-accent">
            llms.txt
          </a>
          .
        </p>
        <p className="mt-6">
          <Link to={pathname} className="link-accent">
            Human view
          </Link>
        </p>
      </div>
    );
  }

  const copyLabel = copied ? "Copied" : copyFailed ? "Selected. Press ⌘C" : "Copy";

  return (
    <div className="site-shell page-section">
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">Agent view</h1>
        <Link to={pathname} className="link-accent text-sm">
          Human view
        </Link>
      </div>
      <p className="mt-3 max-w-measure text-sm text-ink-muted">
        The same public copy as this page, as Markdown. Direct URL:{" "}
        <a href={filePath} className="link-accent">
          {filePath}
        </a>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn-secondary" onClick={() => void copy()}>
          {copyLabel}
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {copied
            ? "Markdown copied."
            : copyFailed
              ? "Clipboard unavailable. The markdown text is selected."
              : ""}
        </span>
        <button type="button" className="btn-secondary" onClick={download}>
          Download
        </button>
      </div>
      <pre
        id="agent-markdown"
        className="mt-8 max-w-measure overflow-x-auto whitespace-pre-wrap border border-rule bg-paper-elevated p-4 font-mono text-sm leading-relaxed text-ink"
      >

        {markdown}
      </pre>
    </div>
  );
}
