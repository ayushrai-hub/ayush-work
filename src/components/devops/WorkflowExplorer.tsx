/**
 * Inspector for verified GitHub Actions files and one proposed example.
 *
 * Verified records come from deliveryFindings. The YAML block is `proposedWorkflowYaml`
 * and is labeled as not installed. Selecting a repository swaps the summary; it does not
 * fetch the file again at runtime.
 *
 * Connects to:
 * - src/pages/DevopsPowPage.tsx
 * - src/content/devopsPow.ts
 */
import { useState } from "react";
import {
  deliveryFindings,
  proposedWorkflowYaml,
  workflowLessons,
  type DeliveryFinding,
} from "../../content/devopsPow";

/** Repository workflow summaries plus the proposed example. */
export default function WorkflowExplorer() {
  const [selected, setSelected] = useState(deliveryFindings[0].id);
  const finding = deliveryFindings.find((item) => item.id === selected) ?? deliveryFindings[0];

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Repositories">
        {deliveryFindings.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === finding.id}
            className={`shrink-0 border px-3 py-2 text-sm ${
              item.id === finding.id ? "border-ink text-ink" : "border-rule text-ink-muted"
            }`}
            onClick={() => setSelected(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <FindingDetail finding={finding} />
      <h3 className="mt-10 font-display text-lg text-ink">Proposed workflow, not installed</h3>
      <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">
        This YAML is a teaching example for a web application. It is not the file in any repository
        listed above, and this page does not commit it.
      </p>
      <pre className="mt-4 max-w-full overflow-x-auto border border-rule p-4 font-mono text-xs leading-relaxed text-ink">
        {proposedWorkflowYaml}
      </pre>
      <ul className="mt-6 max-w-measure space-y-4">
        {workflowLessons.map((lesson) => (
          <li key={lesson.title}>
            <h4 className="font-display text-base text-ink">{lesson.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{lesson.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One repository's verified or missing delivery files. */
function FindingDetail({ finding }: { finding: DeliveryFinding }) {
  return (
    <div className="mt-6">
      <p className="font-mono text-xs uppercase tracking-label text-ink-faint">{finding.verdict}</p>
      <p className="mt-2 text-sm">
        <a href={finding.href} className="link-underline" target="_blank" rel="noopener noreferrer">
          Repository
        </a>
        {finding.live ? (
          <>
            {" · "}
            <a href={finding.live} className="link-underline" target="_blank" rel="noopener noreferrer">
              Live site
            </a>
          </>
        ) : null}
      </p>
      <h3 className="mt-6 font-display text-lg text-ink">What the repository contains</h3>
      <ul className="mt-3 max-w-measure list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink">
        {finding.found.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <h3 className="mt-6 font-display text-lg text-ink">What it does not show</h3>
      <ul className="mt-3 max-w-measure list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
        {finding.absent.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
