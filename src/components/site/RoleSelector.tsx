import { useSearchParams } from "react-router-dom";
import {
  AUDIENCES,
  parseAudience,
  type AudienceId,
} from "../../lib/agent/audiences";

export default function RoleSelector() {
  const [params, setParams] = useSearchParams();
  const current = parseAudience(params.get("audience"));
  const meta = AUDIENCES.find((audience) => audience.id === current) ?? AUDIENCES[0];

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
      <p className="mt-3 text-sm text-ink-muted">{meta.description}</p>
    </fieldset>
  );
}
