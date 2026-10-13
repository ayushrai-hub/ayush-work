import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Writable } from "node:stream";
import { AppRoutes } from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import { prerenderRoutes, sitemapRoutes } from "./lib/publicRoutes";

export function getRoutes(): string[] {
  return prerenderRoutes();
}

export function getSitemapRoutes(): string[] {
  return sitemapRoutes();
}

export function render(url: string): Promise<{ html: string; helmet: any }> {
  return new Promise((resolve, reject) => {
    const helmetContext: any = {};
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
