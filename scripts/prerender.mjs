/**
 * Final build step: writes a static HTML file for every public route, plus dist/404.html and dist/sitemap.xml.
 *
 * Loads the SSR bundle from dist-server/entry-server.js, renders each route from getRoutes() into the
 * client build's dist/index.html shell (default title, description, canonical, Open Graph, Twitter,
 * and robots tags stripped so each page's Helmet tags replace them), and writes it to
 * dist/<route>/index.html. The sitemap lists getSitemapRoutes() with today's date as lastmod. The
 * SSR bundle directory is deleted afterwards. Must run from the repository root.
 *
 * Connects to:
 * - package.json `build`: `vite build && vite build --ssr src/entry-server.tsx --outDir dist-server && node scripts/prerender.mjs`.
 * - src/entry-server.tsx (getRoutes, getSitemapRoutes, render), which reads src/lib/publicRoutes.ts.
 * - Netlify serves dist/404.html for unknown paths (netlify.toml `/*` rule). The generated sitemap
 *   overwrites the copy of public/sitemap.xml that Vite placed in dist.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE = "https://www.ayushrai.site";
const dist = path.resolve("dist");
const server = await import(pathToFileURL(path.resolve("dist-server/entry-server.js")).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

// Strip the shell's default head tags; Helmet output replaces them per page.
const stripped = template
  .replace(/<title>[\s\S]*?<\/title>/, "")
  .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, "")
  .replace(/<link\s+rel="canonical"[^>]*\/>\s*/, "")
  .replace(/<meta\s+property="og:[^>]*\/>\s*/g, "")
  .replace(/<meta\s+name="twitter:[^>]*\/>\s*/g, "")
  .replace(/<meta\s+name="robots"[^>]*>\s*/i, "");

const routes = server.getRoutes();
const indexed = server.getSitemapRoutes();
let ok = 0;
for (const url of routes) {
  const { html, helmet } = await server.render(url);
  const head = ["title", "meta", "link", "script"]
    .map((k) => helmet?.[k]?.toString() ?? "")
    .join("\n");
  const page = stripped
    .replace("</head>", `${head}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  const out = url === "/" ? path.join(dist, "index.html") : path.join(dist, url, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page);
  ok++;
}

const notFound = await server.render("/404");
const notFoundHead = ["title", "meta", "link", "script"]
  .map((k) => notFound.helmet?.[k]?.toString() ?? "")
  .join("\n");
fs.writeFileSync(
  path.join(dist, "404.html"),
  stripped
    .replace("</head>", `${notFoundHead}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${notFound.html}</div>`),
);

const today = new Date().toISOString().slice(0, 10);
/** Absolute sitemap URL; non-root pages end in a slash, matching src/lib/canonical.ts. */
const loc = (u) => (u === "/" ? `${SITE}/` : `${SITE}${u}/`);
const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  indexed.map((u) => `  <url><loc>${loc(u)}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sm);
fs.rmSync(path.resolve("dist-server"), { recursive: true, force: true });
console.log(`prerendered ${ok} routes`);
