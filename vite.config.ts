/**
 * Vite configuration — Configures build tool for development, testing, and production builds.
 *
 * This file sets up Vite with React plugin, optimizes dependencies, configures Vitest for testing, and defines build optimizations for production.
 *
 * Special flags and options:
 * - exclude from optimizeDeps: lucide-react (to avoid bundling issues)
 * - manualChunks in build: separates large libraries (Three.js, Framer Motion, etc.) to improve loading performance
 * - sourcemap: disabled for production security (set to true for debugging)
 * - terserOptions: compress removes console and debugger in production
 * - Vitest: uses jsdom, global test API, includes coverage
 *
 * Environment variables consumed: None directly, but can be accessed in code
 * Overridden by hosting provider: build settings may be altered in Netlify/Vercel UI
 */
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  // Vitest configuration (merged into Vite config for Vite >= 3.0)
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
      output: {
        manualChunks: {
          animations: ['framer-motion'],
          router: ['react-router-dom'],
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'react-helmet-async'],
        },
      },
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Compress assets
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
    },
    // Optimize for better performance
    cssCodeSplit: true,
    reportCompressedSize: true,
    // Increased chunk size limit to reduce warnings
    chunkSizeWarningLimit: 600,
  },
});
