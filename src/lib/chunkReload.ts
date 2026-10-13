/**
 * Detects failed lazy-chunk imports and reloads the page once to recover from them.
 *
 * After a deploy, the hashed JavaScript chunks a long-open tab expects may no longer exist, so the
 * next lazily loaded page fails to import. One full reload fetches the current HTML and chunk
 * names. A sessionStorage timestamp limits that to one automatic reload per CHUNK_RELOAD_WINDOW_MS,
 * so a chunk that is still missing after the reload shows the error fallback instead of looping.
 *
 * Connects to:
 * - src/components/layout/ErrorBoundary.tsx (calls both helpers from componentDidCatch / render).
 * - src/__tests__/ErrorBoundary.test.tsx.
 */

/** sessionStorage key holding the time of the last automatic reload for a missing chunk. */
export const CHUNK_RELOAD_KEY = "ayushrai:chunk-reload-at";
/** A second chunk failure within this window shows the fallback instead of reloading again. */
export const CHUNK_RELOAD_WINDOW_MS = 30_000;

/** True for the errors Chromium, Firefox, Safari, and Vite raise when a lazily imported chunk cannot be fetched. */
export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? `${error.name} ${error.message}` : String(error);
  return /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk [\w-]+ failed/i.test(
    message,
  );
}

/**
 * Reloads the page once for a missing chunk. Returns false, without reloading, when a reload already
 * happened within CHUNK_RELOAD_WINDOW_MS or sessionStorage is unavailable.
 */
export function reloadOnceForChunkError(now = Date.now()): boolean {
  try {
    const last = Number(window.sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? "0");
    if (now - last < CHUNK_RELOAD_WINDOW_MS) return false;
    window.sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}
