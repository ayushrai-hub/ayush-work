/**
 * Simulated RELAY application shell for /pow/fde.
 *
 * The shell lists the planned surfaces. Account Investigation is the working one: predefined
 * accounts from `fdeAccounts`, expandable evidence, a score that is the sum of rule points, a
 * sample recommendation, and an approval control that only updates this component. No model and
 * no workflow are called. Other surfaces explain what they are for and stay honest about that.
 *
 * Connects to:
 * - src/pages/FdePowPage.tsx
 * - src/content/fde.ts (`fdeAccounts`, `fdeShellViews`, `fdeSources`, `accountScore`)
 * - src/components/fde/roving.ts
 */
import { useRef, useState, type KeyboardEvent } from "react";
import {
  accountScore,
  fdeAccounts,
  fdeShellViews,
  fdeSources,
} from "../../content/fde";
import type { FdeAccount, FdeShellViewId } from "../../content/fde";
import { nextRovingIndex } from "./roving";

/** Account buttons shared by the explorer and the investigation. */
function AccountList({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="grid gap-2">
      {fdeAccounts.map((account) => {
        const selected = account.id === selectedId;
        return (
          <li key={account.id}>
            <button
              type="button"
              aria-pressed={selected}
              className={`min-h-11 w-full border px-3 py-2 text-left ${
                selected ? "border-ink bg-paper-elevated" : "border-rule hover:border-ink"
              }`}
              onClick={() => onSelect(account.id)}
            >
              <span className="block text-sm text-ink">{account.name}</span>
              <span className="mt-1 block font-mono text-xs text-ink-faint">
                {account.segment} · {accountScore(account)} points
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Score arithmetic for one account, rendered as the sum of its rules. */
function ScoreBreakdown({ account }: { account: FdeAccount }) {
  const score = accountScore(account);
  return (
    <div>
      <p className="label">Score</p>
      <p className="mt-1 font-display text-3xl text-ink">{score}</p>
      <p className="mt-1 text-sm text-ink-muted">Sum of the rule points below. A model does not set this number.</p>
      <ul className="mt-3 divide-y divide-rule border-y border-rule">
        {account.signals.map((signal) => (
          <li key={signal.id} className="flex items-baseline justify-between gap-4 py-2 text-sm">
            <span className="text-ink">{signal.name}</span>
            <span className="font-mono text-ink-muted">{signal.points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Evidence, recommendation, and approval for the selected account. */
function Investigation({
  account,
  openSignalId,
  onToggleSignal,
  approvalNoted,
  onPreviewApproval,
}: {
  account: FdeAccount | null;
  openSignalId: string | null;
  onToggleSignal: (id: string) => void;
  approvalNoted: boolean;
  onPreviewApproval: () => void;
}) {
  if (!account) {
    return (
      <p className="text-sm text-ink-muted" role="status">
        Select a synthetic account to see its risk rules, evidence, and sample recommendation.
      </p>
    );
  }

  return (
    <div className="grid gap-8">
      <div>
        <h3 className="font-display text-xl text-ink">{account.name}</h3>
        <p className="mt-1 font-mono text-xs text-ink-faint">{account.segment}</p>
      </div>
      <ScoreBreakdown account={account} />
      <div>
        <p className="label">Risk indicators</p>
        <ul className="mt-3 grid gap-3">
          {account.signals.map((signal) => {
            const open = openSignalId === signal.id;
            return (
              <li key={signal.id} className="border border-rule">
                <button
                  type="button"
                  className="flex min-h-11 w-full items-start justify-between gap-4 px-3 py-3 text-left"
                  aria-expanded={open}
                  aria-controls={`evidence-${signal.id}`}
                  onClick={() => onToggleSignal(signal.id)}
                >
                  <span>
                    <span className="block text-sm text-ink">{signal.name}</span>
                    <span className="mt-1 block text-sm text-ink-muted">{signal.reading}</span>
                  </span>
                  <span className="font-mono text-xs text-ink-faint">{open ? "Hide" : "Evidence"}</span>
                </button>
                {open && (
                  <div id={`evidence-${signal.id}`} className="border-t border-rule px-3 py-3">
                    <p className="text-sm text-ink">{signal.rule}</p>
                    <ul className="mt-3 grid gap-2">
                      {signal.evidence.map((item) => (
                        <li key={item.id} className="text-sm leading-relaxed">
                          <span className="font-mono text-xs text-ink-faint">{item.source}</span>
                          <span className="mt-1 block text-ink">{item.observation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <p className="label">Sample recommendation</p>
        <p className="mt-2 text-sm leading-relaxed text-ink">{account.recommendation}</p>
      </div>
      <div className="border border-rule p-4">
        <p className="label">Proposed action</p>
        <h4 className="mt-2 font-display text-lg text-ink">{account.action.title}</h4>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{account.action.detail}</p>
        <p className="mt-3 text-sm text-ink">{account.action.approval}</p>
        <button type="button" className="btn-secondary mt-4" onClick={onPreviewApproval}>
          Preview the approval gate
        </button>
        {approvalNoted && (
          <p className="mt-3 text-sm text-ink" role="status">
            Recorded in this preview only. No approval was submitted and no action was executed.
          </p>
        )}
      </div>
    </div>
  );
}

/** Simulated RELAY shell. Starts with no account selected. */
export default function ProductPreview() {
  const [view, setView] = useState<FdeShellViewId>("investigation");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [openSignalId, setOpenSignalId] = useState<string | null>(null);
  const [approvalNoted, setApprovalNoted] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const account = fdeAccounts.find((item) => item.id === accountId) ?? null;
  const viewIndex = fdeShellViews.findIndex((item) => item.id === view);
  const current = fdeShellViews[viewIndex] ?? fdeShellViews[0];

  /** Selects an account and opens the investigation with that account's panels reset. */
  function selectAccount(id: string) {
    setAccountId(id);
    setOpenSignalId(null);
    setApprovalNoted(false);
    setView("investigation");
  }

  /** Toggles one evidence panel and closes any other. */
  function toggleSignal(id: string) {
    setOpenSignalId((currentId) => (currentId === id ? null : id));
  }

  /** Moves the shell tab and focuses it. */
  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextRovingIndex(event.key, viewIndex, fdeShellViews.length);
    if (next === null) return;
    event.preventDefault();
    const nextView = fdeShellViews[next];
    if (!nextView) return;
    setView(nextView.id);
    tabs.current[next]?.focus();
  }

  return (
    <div className="border border-ink bg-paper-elevated">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule px-4 py-3">
        <p className="font-mono text-xs uppercase tracking-label text-ink">
          RELAY · simulated demonstration
        </p>
        <p className="text-xs text-ink-muted">Predefined examples. No model call. No workflow execution.</p>
      </div>
      <div
        role="tablist"
        aria-label="RELAY preview sections"
        className="flex gap-1 overflow-x-auto border-b border-rule px-2"
        onKeyDown={onTabKeyDown}
      >
        {fdeShellViews.map((item, index) => {
          const selected = item.id === view;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              id={`shell-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="shell-panel"
              tabIndex={selected ? 0 : -1}
              className={`min-h-11 shrink-0 px-3 py-2 text-sm ${
                selected ? "text-ink underline decoration-accent underline-offset-8" : "text-ink-muted"
              }`}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div id="shell-panel" role="tabpanel" aria-labelledby={`shell-tab-${current.id}`} className="p-4 sm:p-6">
        <p className="max-w-measure text-sm leading-relaxed text-ink-muted">{current.summary}</p>
        <div className="mt-6">
          {view === "overview" && (
            <button type="button" className="btn-secondary" onClick={() => setView("investigation")}>
              Open the investigation
            </button>
          )}
          {view === "explorer" && (
            <AccountList selectedId={accountId} onSelect={selectAccount} />
          )}
          {view === "investigation" && (
            <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
              <AccountList selectedId={accountId} onSelect={selectAccount} />
              <Investigation
                account={account}
                openSignalId={openSignalId}
                onToggleSignal={toggleSignal}
                approvalNoted={approvalNoted}
                onPreviewApproval={() => setApprovalNoted(true)}
              />
            </div>
          )}
          {view === "signals" &&
            (account ? (
              <ul className="grid gap-3">
                {account.signals.map((signal) => (
                  <li key={signal.id} className="border border-rule px-3 py-3 text-sm">
                    <span className="text-ink">{signal.name}</span>
                    <span className="mt-1 block text-ink-muted">{signal.rule}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-muted" role="status">
                Select an account in Account Explorer or Account Investigation.
              </p>
            ))}
          {view === "workflow" &&
            (account ? (
              <div className="border border-rule p-4 text-sm">
                <p className="text-ink">{account.action.title}</p>
                <p className="mt-2 text-ink-muted">{account.action.detail}</p>
                <p className="mt-3 text-ink">Execution is not connected in this preview.</p>
              </div>
            ) : (
              <p className="text-sm text-ink-muted" role="status">
                Select an account to see the proposed action.
              </p>
            ))}
          {view === "approvals" &&
            (account ? (
              <div className="border border-rule p-4 text-sm">
                <p className="text-ink">{account.action.approval}</p>
                <button type="button" className="btn-secondary mt-4" onClick={() => setApprovalNoted(true)}>
                  Preview the approval gate
                </button>
                {approvalNoted && (
                  <p className="mt-3 text-ink" role="status">
                    Recorded in this preview only. No approval was submitted and no action was executed.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-ink-muted" role="status">
                Select an account to see what would require approval.
              </p>
            ))}
          {view === "integrations" && (
            <ul className="grid gap-2">
              {fdeSources.map((source) => (
                <li key={source} className="flex items-baseline justify-between gap-4 border-b border-rule py-3 text-sm">
                  <span className="text-ink">{source}</span>
                  <span className="font-mono text-xs text-ink-faint">Not connected</span>
                </li>
              ))}
            </ul>
          )}
          {view === "audit" &&
            (account ? (
              <div className="border border-rule p-4 font-mono text-xs leading-relaxed text-ink">
                <p>Sample audit row. Nothing was written to a database.</p>
                <p className="mt-3">account: {account.name}</p>
                <p>score: {accountScore(account)}</p>
                <p>action: {account.action.title}</p>
                <p>approval: {approvalNoted ? "previewed locally" : "not requested"}</p>
                <p>execution: not run</p>
              </div>
            ) : (
              <p className="text-sm text-ink-muted" role="status">
                Select an account to see the shape of its audit row.
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}
