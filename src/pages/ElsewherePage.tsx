import { useMemo, useState } from "react";
import PageSEO from "../components/site/PageSEO";
import {
  archivedElsewhere,
  elsewhere,
  primaryElsewhere,
} from "../content";
import type { ProfileLink } from "../content";

function ProfileLinkRow({ profile }: { profile: ProfileLink }) {
  return (
    <a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      title={profile.description}
      className="group flex items-baseline justify-between gap-3 border-b border-rule py-1.5 text-sm transition-colors hover:border-ink"
    >
      <span className="text-ink group-hover:text-accent">{profile.name}</span>
      <span
        className="shrink-0 font-mono text-[10px] uppercase tracking-label text-ink-faint"
        aria-hidden="true"
      >
        ↗
      </span>
    </a>
  );
}

export default function ElsewherePage() {
  const [showArchive, setShowArchive] = useState(false);

  const primaryIds = useMemo(
    () => new Set(primaryElsewhere.map((p) => p.id)),
    [],
  );

  const activeGroups = useMemo(
    () =>
      elsewhere
        .map((group) => ({
          ...group,
          profiles: group.profiles.filter(
            (p) => !p.archive && !primaryIds.has(p.id),
          ),
        }))
        .filter((group) => group.profiles.length > 0),
    [primaryIds],
  );

  return (
    <>
      <PageSEO
        title="Elsewhere"
        description="Profiles across code, research, writing, and community — no phone numbers."
        path="/elsewhere"
      />
      <div className="site-shell py-10 md:py-14">
        <header className="mb-8 max-w-measure">
          <p className="label mb-2">Elsewhere</p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight text-ink">
            On the internet
          </h1>
          <p className="mt-2 text-sm text-ink-muted leading-relaxed">
            Identity map — primary first, the rest by category.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="label mb-2">Primary</h2>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {primaryElsewhere.map((p) => (
              <li key={p.id}>
                <ProfileLinkRow profile={p} />
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeGroups.map((group) => (
            <section key={group.category}>
              <h2 className="label mb-1.5 border-b border-rule pb-1">
                {group.label}
              </h2>
              <ul>
                {group.profiles.map((p) => (
                  <li key={p.id}>
                    <ProfileLinkRow profile={p} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {archivedElsewhere.length > 0 && (
          <section className="mt-8 border-t border-rule pt-4">
            <button
              type="button"
              onClick={() => setShowArchive((v) => !v)}
              className="label text-ink-muted hover:text-ink"
              aria-expanded={showArchive}
            >
              {showArchive ? "Hide archive" : "Show archive"} ·{" "}
              {archivedElsewhere.length}
            </button>
            {showArchive && (
              <ul className="mt-3 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                {archivedElsewhere.map((p) => (
                  <li key={p.id}>
                    <ProfileLinkRow profile={p} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </>
  );
}
