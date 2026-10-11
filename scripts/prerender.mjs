import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE = "https://www.ayushrai.site";
const dist = path.resolve("dist");
const server = await import(pathToFileURL(path.resolve("dist-server/entry-server.js")).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

// strip the shell's default head tags; Helmet output replaces them per page
const stripped = template
  .replace(/<title>[\s\S]*?<\/title>/, "")
  .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, "")
  .replace(/<link\s+rel="canonical"[^>]*\/>\s*/, "")
  .replace(/<meta\s+property="og:[^>]*\/>\s*/g, "")
  .replace(/<meta\s+name="twitter:[^>]*\/>\s*/g, "");

const routes = server.getRoutes();
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

const today = new Date().toISOString().slice(0, 10);
const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((u) => `  <url><loc>${SITE}${u === "/" ? "/" : u}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sm);
fs.rmSync(path.resolve("dist-server"), { recursive: true, force: true });
console.log(`prerendered ${ok} routes`);
