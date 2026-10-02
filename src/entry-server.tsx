import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Writable } from "node:stream";
import { AppRoutes } from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import { work } from "./content/work";
import { products } from "./content/products";
import { research } from "./content/research";
import { notes } from "./content/notes";

export function getRoutes(): string[] {
  const base = [
    "/", "/about", "/work", "/products", "/projects", "/research", "/writing",
    "/notes", "/now", "/ideas", "/principles", "/timeline", "/education",
    "/leadership", "/recognition", "/elsewhere", "/contact", "/archive",
    "/uses", "/resume",
  ];
  return [
    ...base,
    ...work.map((w) => `/work/${w.slug}`),
    ...products.map((p) => `/products/${p.slug}`),
    ...research.map((r) => `/research/${r.slug}`),
    ...notes.map((n) => `/notes/${n.slug}`),
  ];
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
