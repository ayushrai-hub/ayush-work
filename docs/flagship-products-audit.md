# Flagship products audit

Date: 11 Oct 2026. Scope: portfolio integration of The Open Framework, AGENYRA, and MedVoice. Source repositories were read; they were not modified.

## What the site already had

- Typed products in `src/content/products.ts`, case studies in `src/content/work.ts`, and routes `/products`, `/products/:slug`, `/products/:slug/log`, `/work/:slug`.
- The Open Framework and AyushMushrooms were the only products. The homepage showed the first three array entries.
- `ProductStage` was concept, MVP, beta, production, maintained. The Open Framework was labeled MVP.
- Its architecture text named Next.js, NestJS or Spring Boot, PostgreSQL, OAuth, Kubernetes-style infra, and audit logs as if they were the stack.
- Build-log dates on that entry (2024-06-01, 2024-09-01, 2025-01-15, 2026-08-08) do not appear in the product repository.
- Search, Markdown twins, and `llms.txt` already iterate `products` and `work`. No second agent-content system was added.
- There was no prerender script yet, and `public/sitemap.xml` was hand-maintained. Since then `scripts/prerender.mjs` writes every route and `dist/sitemap.xml`, and the static copy was removed.

## What the repositories support

### The Open Framework

- Demo: `https://the-open-frameworks.vercel.app/`
- Repo: `https://github.com/ayushrai-hub/the-open-framework` (created 2025-12-26)
- Implemented: Vite, React, TypeScript, Tailwind, shadcn/ui, React Router, TanStack Query, Vercel SPA. Auth is a mock user in `localStorage`.
- Commit mix reviewed: Lovable bot 44, `ayushrai-hub` 2 (branding removal and Vercel setup, 2026-01-10).
- The live homepage copy includes operational status, ecosystem counts, and partner names. Those are prototype text. They are not repeated here.

### AGENYRA

- Site: `https://agenyra.space/`
- Repo: `https://github.com/ayushrai-hub/AGENYRA_product` (public site and waitlist, 2026-09-29)
- Stages in `src/content/status.ts`: foundation building, structured search experimental, distribution exploring, network planned, contextual intelligence research.
- The public site says the product graph is a private build and is not open. This portfolio does not describe that private code.
- Waitlist administration, export route, tokens, and database credentials stay out of the public copy.

### MedVoice

- Repo: `https://github.com/ayushrai-hub/MedVoiceERP` (created 2026-08-03)
- No public demo URL was verified, so none was added.
- `docs/product/PRODUCT_OVERVIEW.md` (last updated 2026-08-25) is the status source: mock speak-to-confirm-to-invoice loop exists; warehouse deployment, live ERP, production speech, and a finished Android app do not.
- Sampled commits are attributed to "MedVoice Agent", not a personal git author.
- A 2026-08-26 commit message mentions Supabase, Tally, Razorpay, and e-invoice. That is ahead of the overview. Those names were not marked implemented.

## Changes this integration makes

- Extend `ProductStage` with `building` and `experimental`, plus display labels. No completion percentage.
- Add `enterprise` as a product category for MedVoice.
- Replace the Open Framework stack and stage with the repository's actual front end. Keep AyushMushrooms in the catalog, not in the featured three.
- Add AGENYRA and MedVoice product records and case studies on the same slugs.
- Featured order on the homepage and `/products`: The Open Framework, AGENYRA, MedVoice.
- Build logs use only repository or document dates listed above.
- Empty log pages say that no verified entries exist yet.
- Search, Markdown twins, sitemap URLs, and capability evidence follow the same content.

## Claims that still need Ayush

- Whether any institution is actually using The Open Framework. Nothing in the repo says yes.
- Whether the private AGENYRA build matches the public stage copy. The public repo cannot prove it.
- Which MedVoice files were written by Ayush versus an agent.
- Whether the 26 Aug 2026 MedVoice commit's ERP and payments work should be described as done.
- A public MedVoice demo URL, if one exists later.
- AyushMushrooms log dates were left as they were. They were not re-verified in this pass.
