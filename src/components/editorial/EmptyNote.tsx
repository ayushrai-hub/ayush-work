/**
 * Placeholder line shown where page content is still missing.
 *
 * Stateless and takes no props. The visible text points readers to docs/questions-for-ayush.md,
 * a file in the repository rather than a page on the site.
 *
 * Connects to:
 * - Rendered by NowPage (when a list item contains "todo"), WritingPage, WritingDetailPage, and UsesPage
 */
export default function EmptyNote() {
  return (
    <p className="italic text-ink-faint">
      Details coming, see docs/questions-for-ayush.md
    </p>
  );
}
