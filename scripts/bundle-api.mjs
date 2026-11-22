/**
 * Bundles the serverless functions in `api/` after the static build so Vercel's Node runtime
 * does not fail on extensionless TypeScript relative imports under `"type": "module"`.
 *
 * Only runs when `VERCEL` is set in the build environment. Uses esbuild (already installed by Vite)
 * to bundle each `api/*.ts` entry with its local `../src/*` imports inlined while keeping
 * `node_modules` packages external. Because `vercel build` runs in an ephemeral build container,
 * overwriting `api/*.ts` in place during a Vercel build does not dirty the git working tree locally.
 *
 * Connects to:
 * - Called at the end of `npm run build` in `package.json`.
 * - Targets `api/{ask,batch,mcp,mcp-docs,projects,search,send-email}.ts`.
 */
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { build } from "esbuild";

if (process.env.VERCEL) {
  const apiDir = resolve(process.cwd(), "api");
  const entries = readdirSync(apiDir)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => resolve(apiDir, file));

  await Promise.all(
    entries.map((entry) =>
      build({
        entryPoints: [entry],
        outfile: entry,
        allowOverwrite: true,
        bundle: true,
        platform: "node",
        target: "node20",
        format: "esm",
        packages: "external",
        logLevel: "warning",
      }),
    ),
  );
  console.log(`bundled ${entries.length} api functions for Vercel`);
}
