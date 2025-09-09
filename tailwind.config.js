/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '320px',
      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D1B2A',
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3cc',
          400: '#8299bc',
          500: '#6580ac',
          600: '#4d6490',
          700: '#3d5174',
          800: '#2e3e58',
          900: '#1e2b3c',
          dark: '#041E42'
        },
        secondary: {
          DEFAULT: '#00D9FF',
          50: '#e6f9ff',
          100: '#ccedff',
          200: '#99dbff',
          300: '#66c9ff',
          400: '#33b7ff',
          500: '#00a5ff',
          600: '#0084cc',
          700: '#006399',
          800: '#004266',
          900: '#002133'
        },
        accent: {
          DEFAULT: '#39FF14',
          50: '#e8ffe6',
          100: '#d1ffcc',
          200: '#a3ff99',
          300: '#75ff66',
          400: '#47ff33',
          500: '#19ff00',
          600: '#14cc00',
          700: '#0f9900',
          800: '#0a6600',
          900: '#053300'
        },
        tertiary: {
          DEFAULT: '#6B46C1',
          50: '#f3f1ff',
          100: '#e9e5ff',
          200: '#d3ccff',
          300: '#bdb3ff',
          400: '#a799ff',
          500: '#917fff',
          600: '#7a66cc',
          700: '#635099',
          800: '#4c3a66',
          900: '#352533',
          light: '#9333EA'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
};
