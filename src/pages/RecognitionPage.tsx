import { useState } from "react";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import { archivedRecognition, featuredRecognition } from "../content";

export default function RecognitionPage() {
  const [showArchive, setShowArchive] = useState(false);

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
          dek="Featured first. Archive available on request — no vanity strip."
        />

        <ul className="max-w-measure space-y-8">
          {featuredRecognition.map((r) => (
            <li key={r.slug} className="border-t border-rule pt-6">
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
            {showArchive && (
              <ul className="mt-6 max-w-measure space-y-6">
                {archivedRecognition.map((r) => (
                  <li key={r.slug}>
                    <h3 className="font-medium text-ink">{r.title}</h3>
                    <p className="text-sm text-ink-muted">
                      {r.issuer} · {r.date}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}
