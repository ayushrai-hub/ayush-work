/**
 * Skip link that lets keyboard users jump past the header to the main content.
 *
 * Stateless anchor to `#main`. The `.skip-link` class in src/index.css keeps it screen-reader-only
 * until it receives focus, then pins it to the top-left corner.
 *
 * Connects to:
 * - Rendered first inside SiteLayout, whose <main> has `id="main"`
 */
export default function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to main content
    </a>
  );
}
