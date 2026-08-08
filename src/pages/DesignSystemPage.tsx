import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";

const SWATCHES = [
  { name: "paper", className: "bg-paper border border-rule" },
  { name: "paper-elevated", className: "bg-paper-elevated border border-rule" },
  { name: "ink", className: "bg-ink" },
  { name: "ink-muted", className: "bg-ink-muted" },
  { name: "ink-faint", className: "bg-ink-faint" },
  { name: "rule", className: "bg-rule" },
  { name: "accent", className: "bg-accent" },
  { name: "accent-soft", className: "bg-accent-soft border border-rule" },
  { name: "signal", className: "bg-signal" },
  { name: "focus", className: "bg-focus" },
] as const;

export default function DesignSystemPage() {
  return (
    <>
      <PageSEO
        title="Design system"
        description="Internal token swatches and type specimens."
        path="/design-system"
        noIndex
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Internal"
          title="Design system"
          dek="Tokens, type, and buttons for the editorial rebuild. Not linked in primary nav."
        />

        <section className="mb-16">
          <h2 className="label mb-4">Color</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {SWATCHES.map((s) => (
              <li key={s.name}>
                <div className={`h-16 rounded-sm ${s.className}`} />
                <p className="mt-2 font-mono text-xs text-ink-faint">{s.name}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="label mb-4">Typography</h2>
          <p className="font-display text-4xl text-ink mb-4">
            Source Serif 4 — display
          </p>
          <p className="font-sans text-lg text-ink-muted mb-4">
            Source Sans 3 — body and UI. The quick brown fox jumps over the lazy
            dog.
          </p>
          <p className="font-mono text-sm text-ink-faint">
            IBM Plex Mono — labels · dates · 2026-08-08
          </p>
        </section>

        <section>
          <h2 className="label mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary">
              Primary
            </button>
            <button type="button" className="btn-secondary">
              Secondary
            </button>
            <button type="button" className="btn-ghost">
              Ghost
            </button>
          </div>
          <p className="mt-6">
            <a href="#main" className="link-underline">
              Underline link
            </a>
            {" · "}
            <a href="#main" className="link-accent">
              Accent link
            </a>
          </p>
        </section>
      </div>
    </>
  );
}
