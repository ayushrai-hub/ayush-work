/**
 * Shared opportunity CTA: contact, resume, and Calendly for hiring and freelance paths.
 *
 * Renders a short prompt plus links that already exist on `/contact` and in `person`.
 * Used on domain dossiers, case studies, and About so conversion actions stay consistent.
 *
 * Connects to:
 * - DomainPage, WorkDetailPage, AboutPage.
 * - Depends on `person` from src/content.
 */

import { Link } from "react-router-dom";
import { person } from "../../content";

/** Props for the CTA block. `prompt` is one sentence of context for the page. */
interface ContactCtaProps {
  /** Optional heading; defaults to "Next step". */
  title?: string;
  /** One sentence explaining why someone might reach out from this page. */
  prompt: string;
}

/**
 * Contact / resume / schedule links for opportunity conversion.
 * External links open in a new tab; resume uses the public Google Drive view URL.
 */
export default function ContactCta({ title = "Next step", prompt }: ContactCtaProps) {
  return (
    <section className="mt-14 border-t border-rule pt-8">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <p className="mt-3 max-w-measure text-ink-muted">{prompt}</p>
      <nav
        className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
        aria-label="Opportunity actions"
      >
        <Link to="/contact" className="link-underline">
          Contact
        </Link>
        <a
          href={person.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          Resume
        </a>
        <a
          href={person.primaryProfiles.cal}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          Calendly
        </a>
        <a href={`mailto:${person.email}`} className="link-underline">
          Email
        </a>
        <a
          href={person.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          WhatsApp
        </a>
      </nav>
      <p className="mt-5">
        <Link to="/contact" className="btn-secondary">
          Contact page
        </Link>
      </p>
    </section>
  );
}
