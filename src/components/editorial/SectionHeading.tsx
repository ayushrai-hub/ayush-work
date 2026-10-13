/**
 * Section heading with an optional section number and an optional trailing link.
 *
 * Stateless. Renders `title` as an <h2> by default, or <h3> via `as`. `number` is shown in mono
 * before the title, and `link` renders a router Link aligned to the right (for example a "see all" link).
 *
 * Connects to:
 * - Rendered by HomePage, AboutPage, ContactPage, DevelopersPage, PrivacyPage, and DomainPage
 */
import { Link } from "react-router-dom";

/** Props for SectionHeading. */
interface SectionHeadingProps {
  number?: string;
  title: string;
  link?: { to: string; label: string };
  as?: "h2" | "h3";
}

/** Section heading row; `as` picks the heading level. */
export default function SectionHeading({
  number,
  title,
  link,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
      <Tag className="font-display text-2xl md:text-[1.75rem] text-ink">
        {number && (
          <span className="mr-3 font-mono text-sm text-ink-faint">{number}</span>
        )}
        {title}
      </Tag>
      {link && (
        <Link to={link.to} className="link-accent text-sm shrink-0">
          {link.label}
        </Link>
      )}
    </div>
  );
}
