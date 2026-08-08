import { Link } from "react-router-dom";

interface SectionHeadingProps {
  number?: string;
  title: string;
  link?: { to: string; label: string };
  as?: "h2" | "h3";
}

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
