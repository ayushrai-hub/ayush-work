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
