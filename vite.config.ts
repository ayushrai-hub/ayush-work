// @ts-ignore - Include test config for Vitest
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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/__tests__/**', 'src/setupTests.ts', 'src/main.tsx'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Three.js and related libraries
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          // Separate chart libraries
          charts: ['chart.js', 'react-chartjs-2'],
          // Separate animation library
          animations: ['framer-motion'],
          // Separate routing library
          router: ['react-router-dom'],
          // Vendor libraries
          vendor: ['react', 'react-dom'],
          // UI library and smaller utilities
          ui: ['lucide-react', 'react-intersection-observer', 'react-helmet-async'],
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
    // Split chunks for better caching with lower limit to force splitting
    chunkSizeWarningLimit: 400,
  },
});
