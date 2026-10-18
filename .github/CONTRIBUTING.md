# Contributing

This is Ayush Rai's personal site. Setup, scripts, and layout are in [README.md](../README.md); rules for agents and anyone editing the repo are in [AGENTS.md](../AGENTS.md).

## Ground rules

- Public facts live only in `src/content/`. Pages, Markdown twins, search, the API, and MCP all read from there; do not add a second copy.
- Do not publish a claim that `docs/content-fact-check.md` has not cleared. Withheld award and leadership claims stay in the `*NeedsConfirmation` lists.
- The only phone number allowed in public output is `person.phone`; `src/__tests__/publicOutput.test.ts` fails on any other.
- Every source file opens with a header comment (purpose, mechanism, what it connects to), and every function has a short doc comment. Update them with the code.
- Check that a file or function exists before editing it, and prefer small diffs over rewrites.
- Do not copy code back from the old site (tag `legacy-portfolio-spa`); it contains withheld information.

## Making a change

1. Branch from `main`.
2. Make the change, with tests for new behavior.
3. Run the same checks CI runs:

   ```bash
   npm run lint
   npm run typecheck
   npx vitest run          # or npm run test:coverage to check the coverage thresholds
   npm run build
   npm run test:e2e
   ```

4. Update the README, `docs/API_ENDPOINTS.md`, or `docs/known-issues.md` if the change affects them.
5. Open a pull request to `main`. Merging deploys to production.

## Reporting issues

Open a GitHub issue with what you saw, the URL, steps to reproduce, and the browser or client you used.
