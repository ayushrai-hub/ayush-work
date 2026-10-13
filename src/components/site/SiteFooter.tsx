/**
 * Site-wide footer: one-line positioning, footer navigation, email, location, and freshness dates.
 *
 * Stateless. The opening line is `person.footerLine`, a dedicated field rather than a cut of
 * `person.positioning`, so abbreviations or version numbers in the positioning cannot truncate it.
 * Navigation is FOOTER_LINKS followed by Developers, llms.txt, and Privacy; llms.txt is a
 * plain anchor because it is a static file, not a router route. The dates show
 * `siteMeta.siteUpdatedAt` and `now.lastUpdated`, formatted with formatUpdated.
 *
 * Connects to:
 * - Rendered once by SiteLayout below <main>
 * - content: person, siteMeta, now, formatUpdated
 */
import { Link } from "react-router-dom";
import { formatUpdated, now, person, siteMeta } from "../../content";

/** Router links shown first in the footer nav; Developers, llms.txt, and Privacy are appended in JSX. */
const FOOTER_LINKS = [
  { to: "/work", label: "Work" },
  { to: "/products", label: "Products" },
  { to: "/ai-engineering", label: "AI engineering" },
  { to: "/software-engineering", label: "Software" },
  { to: "/experience", label: "Experience" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/resume", label: "Resume" },
] as const;

/** Footer rendered on every route. */
export default function SiteFooter() {
  return (
    <footer className="border-t border-rule mt-auto">
      <div className="site-shell py-12 md:py-16">
        <p className="max-w-measure text-ink-muted leading-relaxed">{person.footerLine}</p>

        <nav
          className="mt-8 flex flex-wrap gap-x-5 gap-y-2"
          aria-label="Footer"
        >
          {FOOTER_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="link-underline text-sm">
              {link.label}
            </Link>
          ))}
          <Link to="/developers" className="link-underline text-sm">
            Developers
          </Link>
          <a href="/llms.txt" className="link-underline text-sm">
            llms.txt
          </a>
          <Link to="/privacy" className="link-underline text-sm">
            Privacy
          </Link>
        </nav>

        <div className="mt-8 meta-row gap-x-4">
          <a href={`mailto:${person.email}`} className="link-accent">
            {person.email}
          </a>
          <span aria-hidden="true">·</span>
          <span>{person.location}</span>
        </div>

        <p className="mt-4 font-mono text-xs text-ink-faint">
          <time dateTime={siteMeta.siteUpdatedAt}>
            Site info updated {formatUpdated(siteMeta.siteUpdatedAt)}
          </time>
          <span aria-hidden="true"> · </span>
          <time dateTime={now.lastUpdated}>
            Now page {formatUpdated(now.lastUpdated)}
          </time>
        </p>

        <p className="mt-8 text-sm text-ink-faint italic max-w-measure">
          This site is continuously evolving, like the work it documents.
        </p>
      </div>
    </footer>
  );
}
