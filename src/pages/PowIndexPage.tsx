/**
 * `/pow`: index of the proof-of-work role pages.
 *
 * Lists `powMenu` in the same order as the header hover menu. Each row links to that role
 * and repeats the one-line limit already published for the page. Nothing here is computed.
 *
 * Connects to:
 * - Routed in src/App.tsx as `pow`. Prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 * - src/content/powPages.ts (`powMenu`, `renderPowIndexBody` for `/pow.md`).
 * - The header POW control in src/components/site/SiteHeader.tsx links here and hovers the same list.
 */
import { Link } from "react-router-dom";
import PageHeader from "../components/editorial/PageHeader";
import PageSEO from "../components/site/PageSEO";
import { pageUpdatedAt, POW_PATH, powIndexDescription, powIndexTitle, powMenu } from "../content";

/** Proof-of-work index. Lazy-loaded by the `pow` route in src/App.tsx. */
export default function PowIndexPage() {
  return (
    <>
      <PageSEO title={powIndexTitle} description={powIndexDescription} path={POW_PATH} />
      <div className="site-shell page-section">
        <PageHeader
          label="Proof of work"
          title={powIndexTitle}
          dek="Each page is one role. It links the work that exists and labels demonstrations as demonstrations."
          updated={pageUpdatedAt("pow")}
        />
        <ul className="border-b border-rule">
          {powMenu.map((item) => (
            <li key={item.to} className="border-t border-rule py-6">
              <Link to={item.to} className="group block max-w-measure">
                <span className="font-mono text-xs uppercase tracking-label text-ink-faint" aria-hidden="true">
                  {item.short}
                </span>
                <h2 className="mt-1 font-display text-xl text-ink group-hover:underline">{item.label}</h2>
              </Link>
              <p className="mt-2 max-w-measure text-ink-muted">{item.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
