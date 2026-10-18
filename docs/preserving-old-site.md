# Keeping old work restorable

Nothing removed from `main` is lost. Each cleanup is pinned by a tag on GitHub, so any file can come back with one command.

| Ref | What it holds |
| --- | --- |
| Branch `archive/portfolio-spa-2026`, tag `legacy-portfolio-spa` | The previous single-page portfolio (particles, Three.js, section dump), exactly as `main` was at commit `67ca26b` before the rebuild. Some files contain withheld claims; review before reusing anything. |
| Tag `pre-docs-cleanup-2026-10-18` | `main` at commit `4cd1606`, before stale docs, unused images, the empty `src/App.css`, and the static `public/sitemap.xml` were removed. |

## What the 18 October 2026 cleanup removed

- `docs/archive/`: prompts, PRDs, plans, a testing guide, and Lighthouse and audit JSON for the old single-page site.
- `docs/reports/`: audit, comments, and file-overview reports about the old components.
- `docs/GTM_IMPLEMENTATION.md`, `docs/PROFILE_IMAGE_SETUP.md`, `docs/THREE_JS_INTEGRATION.md`, `docs/other-pages-consolidation-strategy.md`: setup notes for components that no longer exist. The current GTM setup is described in `src/lib/gtm.ts` and issue 19 of `known-issues.md`.
- `docs/site-audit.md`, `docs/migration-plan.md`, `docs/information-architecture.md`, `docs/content-strategy.md`: rebuild planning. The rebuild shipped; the README route table is the current map.
- `docs/agent-readiness-report.md`, `docs/seo/orank-execution-checklist.md`, `docs/seo/orank-implementation-report.md`, `docs/seo/seo-execution-report.md`, `docs/seo/live-audit.md`: dated audit snapshots, superseded by `docs/seo/agent-readiness-execution-report.md` and `docs/agent-readiness-audit.md`.
- `src/assets/` (six images nothing imported), `public/ayush-profile.jpg` (empty file), `src/App.css` (no rules), `public/sitemap.xml` (a stale hand-kept copy; the build writes `dist/sitemap.xml`), and `postcss.config.js` (its two plugins now live in `vite.config.ts` under `css.postcss`).

## Restore a removed file

```bash
git fetch origin --tags
git checkout pre-docs-cleanup-2026-10-18 -- docs/site-audit.md
# or a whole folder:
git checkout pre-docs-cleanup-2026-10-18 -- docs/archive
```

To read a file without restoring it: `git show pre-docs-cleanup-2026-10-18:docs/site-audit.md`. To list everything the cleanup removed: `git diff --name-status pre-docs-cleanup-2026-10-18 main -- . | grep '^D'`.

## Restore the old site locally

```bash
git fetch origin
git checkout archive/portfolio-spa-2026
npm install
npm run dev
```

To redeploy it, point Netlify or Vercel at branch `archive/portfolio-spa-2026`. Do **not** force-reset `main` unless you intend to undo the current site.

## Before the next cleanup

Tag `main` first (`git tag -a pre-<what>-<date> -m "…" && git push origin <tag>`), then add a row to the table above.
