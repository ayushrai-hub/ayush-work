/**
 * PostCSS pipeline Vite applies to imported CSS: Tailwind (tailwind.config.js), then Autoprefixer.
 *
 * Connects to:
 * - Vite picks this file up automatically; it processes src/index.css.
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
