/**
 * Vite and Vitest configuration for the dev server, client build, SSR build, and tests.
 *
 * Registers the React plugin and agentSurfacesPlugin, which in dev/preview stands in for the hosts
 * (`/api/*`, `/api/mcp`, Markdown twins and negotiation, llms.txt, OpenAPI, `.well-known` files) and
 * at build time emits those static files plus AGENTS.md and SKILL.md as assets. The config is a
 * function of `isSsrBuild`: manualChunks applies only to the client build, and react-helmet-async
 * is bundled into the SSR output (`ssr.noExternal`).
 *
 * Options worth knowing:
 * - optimizeDeps.exclude: lucide-react is not pre-bundled by the dev server.
 * - manualChunks (client only): framer-motion, react-router-dom, react/react-dom, and
 *   lucide-react + react-helmet-async go into named chunks.
 * - sourcemap is off; terser drops console and debugger statements from production bundles.
 * - Vitest: jsdom, global test API, setup in src/setupTests.ts, legacy tests and e2e excluded, v8 coverage.
 *
 * Connects to:
 * - package.json scripts `dev`, `build` (client and `--ssr src/entry-server.tsx` builds), `preview`, `test`.
 * - src/lib/agent/vitePlugin.ts (agentSurfacesPlugin).
 */
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { agentSurfacesPlugin } from './src/lib/agent/vitePlugin';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), agentSurfacesPlugin()],
  ssr: { noExternal: ['react-helmet-async'] },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    exclude: [
      'e2e/**/*.ts',
      'node_modules/**',
      'src/__tests__/legacy/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/__tests__/**', 'src/setupTests.ts', 'src/main.tsx', 'e2e/**'],
    },
  },
  build: {
    rollupOptions: {
      output: isSsrBuild ? {} : {
        manualChunks: {
          animations: ['framer-motion'],
          router: ['react-router-dom'],
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'react-helmet-async'],
        },
      },
    },
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
    },
    cssCodeSplit: true,
    reportCompressedSize: true,
    // Raised from Vite's 500 kB default.
    chunkSizeWarningLimit: 600,
  },
}));
