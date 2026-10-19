/**
 * Keyboard helper for the selectable lists on the forward-deployed engineering page.
 *
 * `nextRovingIndex` maps Home, End, and the arrow keys to the next index in a list. Callers
 * prevent the default and move focus themselves. Unhandled keys return null so ordinary typing
 * and Tab are left alone.
 *
 * Connects to:
 * - src/components/fde/StageFlow.tsx, ArchitectureMap.tsx, DecisionList.tsx,
 *   FailureExplorer.tsx, ProcessSteps.tsx, and ProductPreview.tsx.
 */
/**
 * Next index for a roving tabindex, or null when `key` is not a list-navigation key.
 * `count` below 1 always returns null.
 */
export function nextRovingIndex(key: string, index: number, count: number): number | null {
  if (count < 1) return null;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  if (key === "ArrowRight" || key === "ArrowDown") return (index + 1) % count;
  if (key === "ArrowLeft" || key === "ArrowUp") return (index - 1 + count) % count;
  return null;
}
