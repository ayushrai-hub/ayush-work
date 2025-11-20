# Codebase Full Audit & Improvement Task — Detailed Reviewer Prompt

> Use this prompt to perform a **comprehensive, line-by-line** review, test, and improvement pass on the repository pictured (and all nested subfiles). The reviewer can be a human engineer or an automated assistant. Be exhaustive, precise, and produce a final **Markdown report** that lists strengths, weaknesses, security issues, recommended fixes, tests, and a completion checklist.

---

## Goals (short)

1. Review **every file and every line** in the repository for correctness, clarity, maintainability, and security.
2. Run and verify all tests and CI pipelines; add missing tests where coverage is insufficient.
3. Identify vulnerabilities in dependencies and code (OWASP top issues, secrets, misconfigurations).
4. Improve code quality: formatting, linting, type safety, error handling, and documentation.
5. Produce a final, **structured Markdown audit report** containing findings, severity-rated issues, remediation steps, and a completion score.

---

## Scope

* All root files visible (`package.json`, `tsconfig.*`, `vite.config.ts`, `postcss.config.js`, `tailwind.config.js`, `README.md`, `public/`, `src/`, `.next/`, `types/`, `api/`, `dist/`, `playwright-config.js`, any manifest files, etc.) and every file/folder below them.
* Both frontend and backend code (if applicable), build scripts, CI, e2e tests, config files, and static assets.

---

## Required Deliverables

1. **Primary Audit Report (Markdown)** — must include:

   * Executive summary (1 paragraph)
   * High-level status: `Ready / Minor fixes / Major issues / Blocked`
   * Overall score (0–100) and rationale
   * Strengths (clear positives)
   * Weaknesses (concrete list)
   * Security vulnerabilities (detailed)
   * Testing status & coverage gaps
   * Documentation gaps
   * Compatibility/build issues
   * Recommended prioritised remediation steps (P0, P1, P2, P3)
   * A proposed acceptance checklist for project completion
2. **Per-file Findings** — a structured list (or table) that for each file includes:

   * File path
   * Short description of purpose
   * Lines inspected (start–end)
   * Issues found (with line numbers and suggested fixes / PR-ready patch)
   * Score or severity (Critical / High / Medium / Low / Info)
3. **Automated commands & logs** — raw outputs (or summarized) from:

   * `npm install` / `pnpm install` / `yarn install`
   * `npm test` / `pnpm test` / `yarn test`
   * `npm run build` and server start (local)
   * `npm audit` or `yarn audit` (include actionable results)
   * Linter runs (`eslint --ext .ts,.tsx,.js,.jsx`)
   * Type checks (`tsc --noEmit`)
   * Dependency tree (`npm ls` or `pnpm list`)
   * E2E tests (`playwright test`), if available
4. **Minimal PRs / Patches** — small code patches or suggested diffs for high-priority fixes (example code included in the report).
5. **Security report** — detailed with CVE references (if applicable), how each vulnerability is triggered and recommended patch or mitigation.
6. **Acceptance Checklist** — itemized, testable criteria before marking project “complete”.

---

## Methodology (step-by-step instructions for reviewer)

1. **Get repo & baseline**

   * Clone repository.
   * Choose Node version defined by `.nvmrc` or `engines` in `package.json`; if none, use latest LTS.
   * `cp .env.example .env` and set any required variables (mark secrets as redactable).
   * `npm ci` (or `pnpm install` / `yarn install`).
2. **Static checks**

   * Run `eslint` and `prettier` (or project-specific linters). Fix formatting and lint errors where trivial.
   * Run `tsc --noEmit` to surface type errors.
   * Run `depcheck` to find unused dependencies and `npm-check` for outdated packages.
3. **Dependency & vulnerability scan**

   * `npm audit --json` (save output). If high/critical vulnerabilities appear, attempt `npm audit fix` and test.
   * Run SCA if available (Snyk/OSS Index)—include remediation suggestions.
   * Check `package-lock.json` / `pnpm-lock.yaml` for unexpected packages.
4. **Secrets & configuration**

   * Run secret scanning (search for `API_KEY`, `SECRET`, tokens, or long Base64 strings) and check Git history for leaked secrets.
   * Validate `.gitignore`, `.env.example` and that `.env` is not committed.
5. **Build & runtime**

   * `npm run build` (or `next build` / `vite build`). Capture errors/warnings.
   * Start app locally (`npm start` / `next start` / `vite preview`). Confirm server runs on expected port.
   * Check server logs for runtime warnings.
6. **Test runs**

   * Run unit tests: `npm test` — record failures and flaky tests.
   * Run e2e tests (Playwright): `npx playwright test`. If tests are missing, create essential smoke tests for key flows (homepage load, login, add-to-cart).
   * Measure coverage (`jest --coverage` or `vitest --coverage`).
7. **Manual review (code & structure)**

   * Review `src/` — components, pages, API routes, utilities, hooks, styles.
   * Review server code (`api/`, `server/`, `.next/server` if SSR).
   * For every file: check naming, single responsibility, complexity, side effects, and error handling.
   * Open large / complex functions and verify edge cases and input validation.
8. **Security manual checks**

   * OWASP top 10 matrix: XSS, CSRF, injection, broken auth, sensitive data exposure — verify mitigations.
   * CSP headers, cookie flags (`HttpOnly`, `Secure`, `SameSite`), input validation, SQL/NoSQL injection vectors.
   * Validate third-party script usage, CORS policies, file upload validation, and rate limiting.
9. **Performance & SEO**

   * Check large bundles (`webpack`/`vite` bundle analysis): `source-map-explorer` or built-in analyzer.
   * Check SSR vs client bundles, unused CSS (Tailwind purge config), images (optimize, lazyload), and code-splitting.
10. **Accessibility**

    * Run automated A11y checks (axe, Lighthouse) and note critical issues (missing alt, color contrast, keyboard navigation).
11. **Documentation**

    * Review `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, and in-code JSDoc/TSDoc. Ensure dev setup, run commands, environment variables and architecture are explained.
12. **CI/CD**

    * Inspect GitHub Actions / Vercel / Netlify config. Validate build, test, and deploy steps. Check secrets usage and permissions.

---

## What to include in each **Issue** entry (template)

* **Title:** short summary
* **File(s):** `path/to/file.tsx:line-range`
* **Severity:** `Critical / High / Medium / Low / Info`
* **Description:** clear explanation of the problem & why it matters
* **Reproduction:** commands or steps to reproduce (if relevant)
* **Suggested Fix:** code diff or snippet; reference to standards (eslint rule, OWASP control)
* **Estimated Effort:** `minutes / hours`
* **PR Ready?:** yes/no (if yes, attach patch)

---

## Security Specifics to Check (detailed)

* **Dependencies**

  * outdated packages with known CVEs
  * transitive dependency risks
* **Secrets**

  * check for `process.env` usage and not exposing secrets to client bundles
  * `next.config.js` or Vite exposePublicEnv variables — verify what’s exposed
* **Auth & Session**

  * cookie security (`HttpOnly`, `SameSite`, `Secure`)
  * token storage (avoid localStorage for sensitive tokens)
  * session invalidation on logout
* **XSS & CSP**

  * sanitize user input, avoid `dangerouslySetInnerHTML` without sanitizer
  * implement Content Security Policy headers
* **CSRF**

  * CSRF tokens on state-changing endpoints (if cookies used for auth)
* **Injection**

  * parameterized DB queries, validation and sanitization
* **File upload**

  * type checks, size limits, virus scanning
* **Misconfig**

  * open CORS (`*`) on authenticated endpoints
  * debug/verbose logs in production, stack traces leaked
* **Build-time leakage**

  * check `publicRuntimeConfig` / `serverRuntimeConfig` in Next (or equivalents)
* **Hosting**

  * Vercel/Netlify settings: environment variables, preview deployments, branch protections
* **Network**

  * TLS configuration if server managed (ensure HSTS headers etc.)

---

## Coding Standards & Style Checklist

* TypeScript types are explicit for public functions and API responses
* No `any` unless justified with comment
* Functional React components with hooks used correctly (no conditional hooks)
* Clear separation: presentational vs container components
* Proper error handling and user-facing error messages
* No console.logs in production code
* Single responsibility for modules and functions (max ~200 LOC for files; break up when larger)
* Tests: each public function / component with 1+ tests; critical flows have e2e tests
* Naming: file and variable names are descriptive and consistent (kebab-case vs PascalCase)
* Accessibility: semantic HTML, labels, ARIA attributes only when needed
* CSS/Tailwind: no deep nesting, purge properly configured, well-scoped styles

---

## Suggested Tooling & Commands (for reviewer to run)

* Setup & install:

  ```bash
  git clone <repo>
  cd repo
  cp .env.example .env
  npm ci
  ```
* Static checks:

  ```bash
  npx eslint "src/**/*.{js,ts,jsx,tsx}" --max-warnings=0
  npx prettier --check .
  npx tsc --noEmit
  npx depcheck
  ```
* Tests & coverage:

  ```bash
  npm test
  npm run test:coverage
  npx playwright test
  ```
* Security & dependency:

  ```bash
  npm audit --json > audit.json
  npx npm-check-updates -u
  ```
* Build & run:

  ```bash
  npm run build
  npm run start
  ```
* Bundle analysis:

  ```bash
  npm run analyze
  # or use vite build --sourcemap + source-map-explorer
  ```
* Accessibility:

  ```bash
  npx lighthouse http://localhost:3000 --output=json --output-path=lh-report.json
  ```

---

## Final Report Structure (outline to use for Markdown report)

1. Title, Repo commit/sha reviewed, Date, Reviewer
2. Executive summary & overall score
3. High-level status (Ready / Minor fixes / Major issues / Blocked)
4. Urgent security issues (P0) — explicit remediation steps
5. P1–P3 prioritized technical issues
6. Tests & CI status
7. Documentation status & required docs to add
8. Per-file findings (table with file → severity → short comment)
9. PR snippets for top fixes (code diffs)
10. Acceptance checklist (testable items)
11. Appendix: commands run, raw logs, `npm audit` output, coverage summary

---

## Severity / Priority guidance

* **Critical (P0):** breaks production, data breach risk, critical vulnerability, or build/deploy failure.
* **High (P1):** major bug, security risk without immediate exploitability, missing auth checks.
* **Medium (P2):** maintainability, missing types, non-critical bugs, test gaps.
* **Low (P3):** style, minor improvements, optimizations.
* **Info:** suggestions, best-practices and documentation notes.

---

## Example / Template of a Single Per-file Issue (Markdown)

````md
### Issue: Unvalidated user input in `/src/api/orders.ts` (lines 34–68)
- **Severity:** Critical (P0)
- **Description:** `req.body` is used directly in DB insert without schema validation. This allows injection and malformed data.
- **Reproduction:** POST `/api/orders` with `{ "productId": 1, "qty": "1; DROP TABLE users;" }`
- **Suggested Fix:**
  ```ts
  import { z } from 'zod';
  const OrderSchema = z.object({ productId: z.number(), qty: z.number().min(1) });
  const parsed = OrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error });
  // use parsed.data for DB insert (parameterized)
````

* **Estimated Effort:** 1–2 hours
* **PR Ready:** Yes (patch below)

```

---

## Acceptance Checklist (example)
- [ ] All critical security vulnerabilities fixed or mitigated
- [ ] `npm run build` succeeds without warnings or fails only for acceptable reasons
- [ ] Unit tests pass and coverage >= 80% for core modules
- [ ] E2E smoke tests cover login, key flows and pass
- [ ] Linting and formatting errors resolved (`eslint`/`prettier`)
- [ ] TypeScript errors resolved (`tsc --noEmit`)
- [ ] README updated with setup, envs, and architecture diagram
- [ ] CI pipeline passes on a fresh clone
- [ ] No secrets in repo history; `.env` not committed
- [ ] Accessibility critical issues addressed (contrast, alt tags, forms)

---

## Final notes to reviewer
- Be explicit: always attach **line numbers** and **small patches** for fixes.
- For security issues, include how an attacker could exploit the issue (threat model) and the impact.
- Prefer **PR-ready diffs** for high severity items to reduce friction for maintainers.
- If unsure about behaviour, document assumptions and how to validate them.

---

Use this as the canonical review prompt. When you run the audit, return the **Primary Audit Report** (Markdown) as described under *Deliverables*, and include code diffs / PR snippets inline. If anything is missing in the repo required to run tests (missing `.env` keys, external services), list required values and whether you mocked them to complete the review.
```
