/**
 * Synthetic artifact manifest for the build-reproducibility section.
 *
 * The visitor can mark the lockfile absent. That changes the promotion note. It does not
 * hash a file or claim the sample digest exists in a registry.
 *
 * Connects to:
 * - src/pages/DevopsPowPage.tsx
 * - sampleManifest, artifactLayers, and supplyChainNotes in src/content/devopsPow.ts.
 */
import { useState } from "react";
import { artifactLayers, sampleManifest, supplyChainNotes } from "../../content/devopsPow";
import { IllustrativeNote } from "./StatusMark";

/** Manifest viewer with a lockfile toggle. */
export default function ArtifactExplorer() {
  const [lockfilePresent, setLockfilePresent] = useState(true);
  const rows = [
    ["Application", sampleManifest.application],
    ["Version", sampleManifest.version],
    ["Source revision", sampleManifest.revision],
    ["Build configuration", sampleManifest.buildConfig],
    ["Dependency lockfile", lockfilePresent ? sampleManifest.lockfile : "absent"],
    ["Build result", sampleManifest.buildResult],
    ["Artifact identifier", sampleManifest.artifactId],
    ["Creation status", sampleManifest.created],
  ];

  return (
    <div>
      <IllustrativeNote>Synthetic metadata. Nothing in this table was built or published.</IllustrativeNote>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Synthetic artifact manifest</caption>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-b border-rule">
                <th scope="row" className="py-3 pr-4 text-left font-normal text-ink-muted">
                  {label}
                </th>
                <td className="py-3 font-mono text-ink">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button
            type="button"
            className="btn-secondary"
            aria-pressed={!lockfilePresent}
            onClick={() => setLockfilePresent((current) => !current)}
          >
            {lockfilePresent ? "Mark lockfile absent" : "Restore lockfile"}
          </button>
          <p className="mt-4 text-sm leading-relaxed text-ink">
            {lockfilePresent
              ? "Promotion can name this revision, this lockfile, and this artifact id. The same artifact would move between environments."
              : "Without a lockfile, a later install may resolve a different tree. This sample would not be promoted."}
          </p>
        </div>
      </div>
      <ol className="mt-8 grid gap-3 md:grid-cols-2">
        {artifactLayers.map((layer, index) => (
          <li key={layer.id} className="border border-rule p-4">
            <p className="font-mono text-xs text-ink-faint">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 font-display text-lg text-ink">{layer.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{layer.body}</p>
          </li>
        ))}
      </ol>
      <ul className="mt-8 max-w-measure space-y-4">
        {supplyChainNotes.map((note) => (
          <li key={note.title}>
            <h3 className="font-display text-base text-ink">{note.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{note.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
