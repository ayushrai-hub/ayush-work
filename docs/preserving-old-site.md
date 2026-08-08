# Keeping the old site safe

The previous single-page portfolio (particles / Three.js / section dump) is preserved so the digital-home rebuild does not erase it.

## Where the old code lives

| Ref | What it is |
| --- | --- |
| Branch `archive/portfolio-spa-2026` | Exact `main` as of commit `67ca26b` before the rebuild |
| Tag `legacy-portfolio-spa` | Same snapshot, immutable tag |

GitHub: https://github.com/ayushrai-hub/ayush-work/tree/archive/portfolio-spa-2026

## Restore the old site locally

```bash
git fetch origin
git checkout archive/portfolio-spa-2026
npm install
npm run dev
```

## Redeploy the old site (if needed)

Point Netlify/Vercel at branch `archive/portfolio-spa-2026`, or:

```bash
git checkout archive/portfolio-spa-2026
# deploy from this branch in your host UI, or:
# npx netlify deploy --prod
```

Do **not** force-reset `main` unless you intentionally want to undo the new site.

## Current production track

`main` = digital home rebuild (commit `Rebuild site as a personal digital home.`).
