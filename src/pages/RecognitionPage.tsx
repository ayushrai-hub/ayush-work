/**
 * `/recognition`: featured certificates and awards, plus a toggleable archive.
 *
 * `showArchive` state controls the archive list, which stays in the DOM with `hidden` so its
 * anchors exist. On mount, if `location.hash` names an archived item, the archive opens so the
 * deep link (search hits use `/recognition#<slug>`, see src/content/searchIndex.ts) is visible.
 * Every item has an `id` anchor (`#<slug>`).
 *
 * Connects to:
 * - Routed in src/App.tsx as `recognition` (legacy `/certifications` redirects here); prerendered
 *   via STATIC_PAGES in src/lib/publicRoutes.ts.
 * - Content from src/content (`featuredRecognition`, `archivedRecognition`); components PageSEO, PageHeader.
 * - Markdown twin `/recognition.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { useEffect, useState } from "react";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { archivedRecognition, featuredRecognition } from "../content";

/** Recognition page component. Lazy-loaded by the `recognition` route in src/App.tsx. */
export default function RecognitionPage() {
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (id && archivedRecognition.some((item) => item.slug === id)) {
      setShowArchive(true);
    }
  }, []);

  return (
    <>
      <PageSEO
        title="Recognition"
        description="Featured certifications and archived recognition."
        path="/recognition"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Recognition"
          title="Certificates & awards"
          dek="Featured first. Older items are in the archive below, no vanity strip."
        />

        <ul className="max-w-measure space-y-8">
          {featuredRecognition.map((r) => (
            <li id={r.slug} key={r.slug} className="scroll-mt-24 border-t border-rule pt-6">
              <h2 className="font-display text-xl text-ink">{r.title}</h2>
              <p className="meta-row mt-1">
                <span>{r.issuer}</span>
                <span aria-hidden="true">·</span>
                <span>{r.date}</span>
                <span aria-hidden="true">·</span>
                <span>{r.category}</span>
              </p>
              <p className="mt-2 text-ink-muted">{r.description}</p>
              {r.link && (
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-accent text-sm mt-2 inline-block"
                >
                  Credential
                </a>
              )}
            </li>
          ))}
        </ul>

        {archivedRecognition.length > 0 && (
          <div className="mt-12">
            <button
              type="button"
              className="label text-ink-muted hover:text-ink"
              aria-expanded={showArchive}
              onClick={() => setShowArchive((v) => !v)}
            >
              {showArchive ? "Hide archive" : `Show archive (${archivedRecognition.length})`}
            </button>
            <ul hidden={!showArchive} className="mt-6 max-w-measure space-y-6">
                {archivedRecognition.map((r) => (
                  <li id={r.slug} key={r.slug} className="scroll-mt-24">
                    <h3 className="font-medium text-ink">{r.title}</h3>
                    <p className="text-sm text-ink-muted">
                      {r.issuer} · {r.date}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
