/**
 * Container-delivery lab for the DevOps proof-of-work page.
 *
 * The visitor picks a hypothetical failure and reads which phase stops and what the pipeline
 * should do. The notes beside it describe Dockerfiles that were actually read, and they say
 * when a repository has no Dockerfile.
 *
 * Connects to:
 * - src/pages/DevopsPowPage.tsx
 * - containerPhases, containerScenarios, and containerNotes in src/content/devopsPow.ts.
 */
import { useState } from "react";
import { containerNotes, containerPhases, containerScenarios } from "../../content/devopsPow";
import { IllustrativeNote } from "./StatusMark";

/** Failure picker for a container lifecycle that does not build an image. */
export default function ContainerLab() {
  const [scenarioId, setScenarioId] = useState(containerScenarios[0].id);
  const scenario = containerScenarios.find((item) => item.id === scenarioId) ?? containerScenarios[0];
  const failedIndex = containerPhases.indexOf(scenario.phase);

  return (
    <div>
      <IllustrativeNote>
        Hypothetical container failures. No image was built or pushed from this page.
      </IllustrativeNote>
      <div className="mt-6 flex flex-wrap gap-2">
        {containerScenarios.map((item) => (
          <button
            key={item.id}
            type="button"
            className="btn-secondary"
            aria-pressed={item.id === scenario.id}
            onClick={() => setScenarioId(item.id)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {containerPhases.map((phase, index) => {
          const state = index < failedIndex ? "Would pass" : index === failedIndex ? "Stops here" : "Not reached";
          return (
            <li key={phase} className="border border-rule p-3">
              <p className="font-mono text-xs text-ink-faint">{state}</p>
              <p className="mt-1 text-sm text-ink">{phase}</p>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 max-w-measure text-sm leading-relaxed text-ink">{scenario.reaction}</p>
      <ul className="mt-8 max-w-measure space-y-4">
        {containerNotes.map((note) => (
          <li key={note.title}>
            <h3 className="font-display text-base text-ink">{note.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{note.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
