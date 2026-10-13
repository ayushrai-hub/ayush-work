/**
 * SSR entry used only at build time to prerender routes to static HTML.
 *
 * render() streams AppRoutes inside a StaticRouter with ThemeProvider and HelmetProvider, waits for
 * onAllReady so lazy pages resolve, and returns the HTML plus the Helmet head state. The client entry
 * (src/main.tsx) adds GTMProvider and Vercel Analytics; neither is rendered here.
 *
 * Connects to:
 * - package.json `build` compiles it with `vite build --ssr src/entry-server.tsx --outDir dist-server`;
 *   scripts/prerender.mjs imports the output and calls getRoutes, getSitemapRoutes, and render.
 * - src/App.tsx (AppRoutes), src/contexts/ThemeContext.tsx, src/lib/publicRoutes.ts.
 */
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { Writable } from "node:stream";
import { AppRoutes } from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import { prerenderRoutes, sitemapRoutes } from "./lib/publicRoutes";

/** Every route to write as dist/<route>/index.html. */
export function getRoutes(): string[] {
  return prerenderRoutes();
}

/** Routes listed in dist/sitemap.xml. */
export function getSitemapRoutes(): string[] {
  return sitemapRoutes();
}

/**
 * Renders one URL to an HTML string for the `#root` element, plus Helmet's collected head tags.
 * Rejects if React reports a render error.
 */
export function render(
  url: string,
): Promise<{ html: string; helmet: HelmetServerState | undefined }> {
  return new Promise((resolve, reject) => {
    const helmetContext: { helmet?: HelmetServerState } = {};
    let html = "";
    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString();
        cb();
      },
    });
    sink.on("finish", () => resolve({ html, helmet: helmetContext.helmet }));
    const { pipe } = renderToPipeableStream(
      <ThemeProvider>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <AppRoutes />
          </StaticRouter>
        </HelmetProvider>
      </ThemeProvider>,
      {
        onAllReady() {
          pipe(sink);
        },
        onError(e) {
          reject(e);
        },
      }
    );
  });
}
