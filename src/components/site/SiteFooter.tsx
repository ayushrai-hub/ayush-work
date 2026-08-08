import { Link } from "react-router-dom";
import { now, person } from "../../content";

const FOOTER_LINKS = [
  { to: "/work", label: "Work" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/now", label: "Now" },
  { to: "/writing", label: "Writing" },
  { to: "/contact", label: "Contact" },
  { to: "/resume", label: "Resume" },
] as const;

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule mt-auto">
      <div className="site-shell py-12 md:py-16">
        <p className="max-w-measure text-ink-muted leading-relaxed">
          {person.positioning.split(".")[0]}.
        </p>

        <nav
          className="mt-8 flex flex-wrap gap-x-5 gap-y-2"
          aria-label="Footer"
        >
          {FOOTER_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="link-underline text-sm">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 meta-row gap-x-4">
          <a href={`mailto:${person.email}`} className="link-accent">
            {person.email}
          </a>
          <span aria-hidden="true">·</span>
          <span>{person.location}</span>
          <span aria-hidden="true">·</span>
          <span>Updated {now.lastUpdated}</span>
        </div>

        <p className="mt-8 text-sm text-ink-faint italic max-w-measure">
          This site is continuously evolving, like the work it documents.
        </p>
      </div>
    </footer>
  );
}
