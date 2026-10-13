/**
 * ESLint flat config for the whole repository (`npm run lint` runs `eslint .`).
 *
 * - TypeScript and TSX (site, API functions, MCP server, tests) use the recommended
 *   JS and typescript-eslint rules plus the React Hooks and React Refresh plugins.
 * - Plain JavaScript (the CLI, the Netlify edge function, the prerender script, and
 *   config files) uses the recommended JS rules with both browser and Node globals,
 *   because these files run in Node, Deno (Netlify Edge), or the browser.
 * - Build and report output folders are generated and never linted.
 */
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'dist-server',
      'coverage',
      'playwright-report',
      'test-results',
      '.reports',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    extends: [js.configs.recommended],
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
  },
);
