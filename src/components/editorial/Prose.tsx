/**
 * Wrapper that applies the site's body-text style to long-form content.
 *
 * Stateless. Wraps `children` in a div with the `.prose-site` class from src/index.css (measure
 * width, relaxed leading, spacing between paragraphs) plus any extra `className`.
 *
 * Connects to:
 * - Rendered by HomePage, AboutPage, ContactPage, DevelopersPage, PrivacyPage, ResumePage,
 *   DomainPage, and the work, product, product-log, research, writing, and note detail pages
 */
import type { ReactNode } from "react";

/** Props for Prose. */
interface ProseProps {
  children: ReactNode;
  className?: string;
}

/** Body-text container using `.prose-site`. */
export default function Prose({ children, className = "" }: ProseProps) {
  return <div className={`prose-site ${className}`.trim()}>{children}</div>;
}
