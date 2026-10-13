/**
 * Tailwind CSS configuration: content globs, class-based dark mode, breakpoints, and design-token theme extensions.
 *
 * The paper/ink/rule/accent/signal/focus colors are CSS variables defined in src/index.css for
 * :root and .dark, so one utility class (for example `text-ink`) follows the active theme. Dark
 * mode is the `dark` class that src/contexts/ThemeContext.tsx sets on <html>. The screens list
 * replaces Tailwind's defaults: `xs` (320px) is added and `sm` is 480px instead of 640px.
 *
 * Connects to:
 * - postcss.config.js runs Tailwind over src/index.css.
 * - Scans index.html and src/**, including legacy components, for class names.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: 'var(--bg)',
          elevated: 'var(--bg-elevated)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
          faint: 'var(--ink-faint)',
        },
        rule: 'var(--rule)',
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
        signal: 'var(--signal)',
        focus: 'var(--focus)',
      },
      // The named faces are loaded from Google Fonts in index.html.
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        measure: '68ch',
        content: '42rem',
        site: '70rem',
      },
      letterSpacing: {
        label: '0.08em',
      },
    },
  },
  plugins: [],
};
