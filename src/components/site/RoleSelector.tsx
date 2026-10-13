/**
 * "Role view" toggle buttons that set the homepage `?audience=` query parameter.
 *
 * Reads the current audience with parseAudience (unknown or missing values mean "general") and
 * shows one aria-pressed button per entry in AUDIENCES, plus that audience's description.
 * Selecting "general" removes the parameter; any other choice sets it. Updates use
 * `replace: true`, so switching views does not add history entries. It only changes the URL:
 * HomePage reads the same parameter to reorder sections and work, and the Markdown twin is unaffected.
 *
 * Connects to:
 * - Rendered by HomePage near the bottom of the page
 * - lib/agent/audiences: AUDIENCES, audienceDescription, parseAudience, AudienceId (HomePage uses HOME_SECTION_ORDER
 *   and rankWorkForAudience from the same module)
 */
import { useSearchParams } from "react-router-dom";
import {
  AUDIENCES,
  audienceDescription,
  parseAudience,
  type AudienceId,
} from "../../lib/agent/audiences";

/** Audience picker; other query parameters are preserved when the audience changes. */
export default function RoleSelector() {
  const [params, setParams] = useSearchParams();
  const current = parseAudience(params.get("audience"));

  /** Writes the chosen audience to the URL; "general" clears the parameter. */
  function select(id: AudienceId) {
    const next = new URLSearchParams(params);
    if (id === "general") next.delete("audience");
    else next.set("audience", id);
    setParams(next, { replace: true });
  }

  return (
    <fieldset className="max-w-measure">
      <legend className="label mb-3">Role view</legend>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Role view">
        {AUDIENCES.map((audience) => (
          <button
            key={audience.id}
            type="button"
            aria-pressed={current === audience.id}
            onClick={() => select(audience.id)}
            className={`rounded-sm border px-3 py-1.5 text-sm transition-colors ${
              current === audience.id
                ? "border-ink bg-ink text-paper-elevated"
                : "border-rule text-ink-muted hover:border-ink hover:text-ink"
            }`}
          >
            {audience.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-muted">{audienceDescription(current)}</p>
    </fieldset>
  );
}
