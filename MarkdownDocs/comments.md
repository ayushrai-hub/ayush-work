# Repository-Wide Commenting & Documentation Task — Reviewer Prompt

> Use this prompt to perform a **complete, line-by-line understanding** of the repository and then **add clear, descriptive comments and documentation** to every file, function, and exported symbol. Produce a single authoritative file (`FILES_OVERVIEW.md`) that explains the purpose and existence of every file and folder in the codebase and how pieces link together. Be precise, consistent, and PR-ready.

---

## Objective (short)

1. Read and understand **every line** of code and config in the repository.
2. Insert high-quality, idiomatic comments (TSDoc / JSDoc / docblocks) into each source file and function describing:

   * purpose / responsibility
   * inputs & outputs (types and shape)
   * side-effects, dependencies, and error conditions
   * examples (where helpful)
3. Add top-of-file module comments that explain how the file fits into the overall architecture.
4. Generate a `FILES_OVERVIEW.md` at the repository root that lists and explains every file and folder (one paragraph each) and maps relationships between modules, routes, components, and services.
5. Produce a short summary report with statistics (files updated, LOC commented, percent coverage of functions commented), and prepare a PR with only comment/documentation changes.

---

## Deliverables (explicit)

1. **Updated source files** (only comments and docstrings added/edited; do not change logic unless a small change is required to allow an explanatory comment — note such changes in PR). Comments must be:

   * Idiomatic TSDoc/JSDoc for TypeScript/JavaScript.
   * Clear, one-sentence summary at function declaration followed by a multi-line description when needed.
   * Parameter and return annotations for public functions.
   * `@example` blocks for complex algorithms or non-obvious usage.
2. **FILES_OVERVIEW.md** — one-file index in Markdown listing:

   * File/Folder path (relative)
   * Purpose (1-3 sentences)
   * Inputs / Outputs / Environment variables (if applicable)
   * Who owns it (if known) / where to look for tests
   * Links to related files (imports/consumers)
   * Priority flags: `Critical` (core runtime), `Important` (feature), `Config` (build/deploy), `Asset` (images/static)
3. **COMMENTS_REPORT.md** — short report:

   * Number of files scanned
   * Number of files updated with comments
   * Number of functions/methods documented
   * LOC commented vs LOC total (approx)
   * Any places where code was ambiguous and required minor changes (list diffs)
   * A short list of recommended deeper documentation tasks (architecture diagram, README expansions)
4. **PR branch** with changes and a clean commit history:

   * Branch name: `docs/comment-every-file`
   * Commit granularity: group related file changes; keep messages descriptive
   * PR description: link to `FILES_OVERVIEW.md`, `COMMENTS_REPORT.md` and instructions for maintainers to review

---

## Scope (what to comment)

* All `src/` files (components, pages, API routes, hooks, utils, libs)
* Configuration files that benefit from comments (`vite.config.ts`, `tsconfig.*`, `postcss.config.js`, `tailwind.config.js`, `playwright.config.js`, `vercel.json`)
* Build and manifest files (add top-of-file comments explaining purpose and generated vs authored)
* `README.md` — improve only if a short clarifying sentence is required (prefer to leave content edits to separate PR).
* Do **not** change minified or build output files in `dist/`/`.next/` unless documentation comment is essential and safe — prefer `FILES_OVERVIEW.md` to document build outputs.

---

## Rules for Comments & Docstrings

* Use TSDoc style for TypeScript files:

  ```ts
  /**
   * Short summary of the function (one line).
   *
   * Longer description (why it exists, non-obvious details).
   *
   * @param paramName - description of parameter and expected type/shape
   * @returns description of return value and its type
   * @throws description of possible errors thrown
   * @example
   * // small usage example
   * doThing({ id: 1 });
   */
  export function doThing(params: { id: number }): boolean { ... }
  ```
* For React components:

  ```tsx
  /**
   * `UserCard` — presentational component to render a user's profile summary.
   *
   * Props:
   * - `user`: minimal user object (id, name, avatarUrl)
   * - `onClick`: optional click handler for card actions
   *
   * Notes:
   * - Accessible: the root element is a <button> to support keyboard focus.
   * - Avoid inline styles to allow theme overrides.
   */
  ```
* For config files (e.g., `vite.config.ts`) add a top-of-file block explaining:

  * what the file configures,
  * special flags and environment variables consumed,
  * whether values are overridden by CI or hosting provider.
* For tests:

  * Add a short comment at the top of each test file summarizing the test suite and which behavior/contracts it validates.
* For utilities and helpers:

  * State whether functions are pure, memoized, or cache results; document performance considerations.
* For API routes:

  * Document request method(s), expected request shape, response shape, HTTP status codes, and authentication/authorization needs.

---

## Methodology (how to perform the task)

1. **Inventory**

   * List all files in the repo (e.g., `git ls-files`) and create an initial `FILES_OVERVIEW.md` skeleton with stub entries for every file/folder.
2. **Static analysis to inform commenting**

   * Run `npx eslint --ext .ts,.tsx,.js,.jsx src` and `npx tsc --noEmit` to detect types and problematic areas that need explanation.
   * Use `rg`/`grep` to find top-level exports and public APIs: `rg "export (default )?(function|const|class|interface|type)"`
3. **Line-by-line reading**

   * For each file:

     * Read top-to-bottom and identify exported symbols.
     * Add a module-level comment at top explaining purpose, file relationships, and any environment assumptions.
     * For each exported function/class/component, add TSDoc/JSDoc comments per rules above.
     * For internal non-exported helper functions, add inline comments when logic is non-obvious (prefer small clarifying comments rather than restating the code).
   * Ensure comments explain *why* (rationale), not just *what*.
4. **Cross-referencing**

   * When a function is used across files, add `@see` tags or inline comments mentioning the consumer file(s).
   * Update `FILES_OVERVIEW.md` to record these links.
5. **Ambiguities & required small changes**

   * If a line of code is ambiguous (typo, inconsistent type, unreachable branch), you may:

     * Add a `// FIXME:` or `// TODO:` comment explaining the ambiguity OR
     * Make a **minimal** non-functional change to improve readability (e.g., rename an internal variable locally) — only if safe. Note and justify this in `COMMENTS_REPORT.md`.
6. **Quality & tone**

   * Use neutral, professional, and precise language.
   * Keep comments concise; long-form explanations belong in `FILES_OVERVIEW.md` or `COMMENTS_REPORT.md`.
   * Avoid editorializing or assumptions — if unsure, mark with `// NOTE:` and list the assumption and how to verify.

---

## `FILES_OVERVIEW.md` format (required template)

For each file, include an entry like:

```md
### `src/components/UserCard.tsx` — Important

**Purpose:** Presentational React component that displays a user's avatar, name and action menu. Used in the dashboard and profile pages.

**Exports:** `UserCard` (React.FC<UserCardProps)

**Inputs / Props:**  
- `user: { id: string; name: string; avatarUrl?: string }` — minimal user info  
- `onAction?: (action: string) => void` — optional callback

**Output / Side-effects:**  
- Renders clickable UI; no network calls; triggers `onAction` when actions selected.

**Environment / Notes:**  
- Accessible keyboard behavior is implemented via `role="button"` and key handlers.  
- Styling comes from `src/styles/usercard.css` and tailwind classes.

**Consumers / Related files:**  
- `src/pages/dashboard.tsx` (renders the list)  
- `src/hooks/useUserActions.ts` (handles action callbacks)

**Why exists:** Simplifies user list rendering and shares consistent UI and UX logic.

```

* Include a top-level summary explaining the overall architecture (e.g., client SSR with Next/Vite, API routes in `/api`, auth via JWT in `src/lib/auth`).
* Add a small ASCII/Markdown diagram showing the major module interactions (frontend pages → API routes → database layer / external services).

---

## Edge cases & Security Notes to document inline

* Mark any use of `dangerouslySetInnerHTML` with an explicit block explaining why and how input is sanitized.
* For environment variables used in client code, explain what each variable exposes to client bundles and why (or recommend moving to server-only).
* For auth tokens, sessions, or cookie usage, document how they are issued/validated and where developers should look to change behavior.

---

## Testing & Verification

* After adding comments, run:

  ```bash
  npx tsc --noEmit
  npx eslint "src/**/*.{ts,tsx,js,jsx}" --max-warnings=0
  npm test
  ```
* Ensure no introduced lint or type errors (comments should not break code).
* Prepare CI notes: if any docs updates require CI config to render (e.g., typedoc), add a short note in `COMMENTS_REPORT.md`.

---

## PR Preparation & Commit Guidelines

* Branch: `docs/comment-every-file`
* Commits:

  * Group by folder (e.g., `docs(components): add TSDoc to src/components/*`)
  * Provide meaningful commit messages, include count of files touched in message body.
* PR description template:

  * Summary of work
  * Files changed count
  * How to review (suggest `git diff --unified=0` or file-by-file review)
  * Acceptance criteria (no logic changes, tests pass, CI green)
  * Link to `FILES_OVERVIEW.md` and `COMMENTS_REPORT.md`
* Do not include unrelated changes.

---

## Acceptance Criteria

* Every exported function / class / React component has a TSDoc/JSDoc comment.
* Every source file has a top-of-file module comment summarizing purpose and relationships.
* `FILES_OVERVIEW.md` includes an entry for every file listed by `git ls-files`, with at least a one-line purpose.
* No code logic changed (except documented, minimal readability fixes). Any change must be documented in `COMMENTS_REPORT.md`.
* `npx tsc --noEmit` passes and `npx eslint` does not fail due to the added comments.
* `COMMENTS_REPORT.md` contains statistics and a short list of ambiguous areas requiring attention.
* PR created on branch `docs/comment-every-file` with a clear description and links.

---

## Example comments (use these patterns)

* Function:

  ```ts
  /**
   * Validate and normalize a price value from external input.
   *
   * This function accepts strings and numbers and returns a number
   * in paise (integers). It clamps negative values to 0 and throws
   * if the input cannot be parsed.
   *
   * @param value - input price (string | number)
   * @returns price in paise (number)
   * @throws TypeError if value is not parseable
   */
  export function normalizePrice(value: string | number): number { ... }
  ```
* Component:

  ```tsx
  /**
   * `LoginForm` — collects user credentials and triggers authentication flow.
   *
   * Notes:
   * - Uses `useAuth` hook from `src/hooks/useAuth` for sign-in.
   * - Performs client-side validation on email/password length.
   * - On success navigates to `/dashboard`.
   */
  ```

---

## Final notes to the reviewer/agent

* Be conservative: prefer documenting behavior rather than changing it.
* Explain **why** a file exists and **how** it is used; do not restate code.
* When in doubt, add `// NOTE:` with a short question/suggestion and document it in `COMMENTS_REPORT.md`.
* The goal is readable, maintainable codebase documentation that helps future engineers understand architecture and intent quickly.
