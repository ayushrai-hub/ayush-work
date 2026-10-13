/**
 * Keyboard-modifier labels for the visitor's platform: "⌘" on Apple devices, "Ctrl" elsewhere.
 *
 * Only call these from event handlers or from components that render after mount on the client
 * (SearchDialog, AgentView's copy state); prerendered HTML has no navigator, so they return the
 * non-Apple label there.
 *
 * Connects to:
 * - src/components/site/SearchDialog.tsx (shortcut hint) and AgentView.tsx (copy hint).
 */

/** True on macOS, iOS, and iPadOS, based on `navigator.userAgentData.platform` or `navigator.platform`. */
export function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform || nav.platform || nav.userAgent || "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}

/** Label for the primary shortcut modifier, followed by `key` ("⌘K" or "Ctrl K"). */
export function shortcutLabel(key: string): string {
  return isApplePlatform() ? `⌘${key}` : `Ctrl ${key}`;
}
