/**
 * Placeholder line shown where page content is still missing.
 *
 * Stateless and takes no props. Visitors see a short "more soon" line; the list of missing content
 * and the questions blocking it are tracked for maintainers in docs/questions-for-ayush.md, which is
 * not linked from the site.
 *
 * Connects to:
 * - Rendered by NowPage (when a list item contains "todo"), WritingPage, WritingDetailPage, and UsesPage
 */
export default function EmptyNote() {
  return <p className="italic text-ink-faint">More here soon.</p>;
}
