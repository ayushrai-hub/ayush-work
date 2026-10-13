/**
 * Legacy round light/dark toggle button with animated sun and moon icons.
 *
 * Legacy: only imported by the legacy src/components/layout/Header.tsx, which
 * the current site does not render. Kept for reference; excluded from
 * tsconfig.app.json. Exercised only indirectly by
 * src/__tests__/legacy/Header.test.tsx, which Vitest excludes.
 *
 * Clicking calls `toggleTheme` from ThemeContext. Persistence (localStorage key
 * "theme") and the `light`/`dark` class on <html> are handled by ThemeProvider,
 * not by this component. The aria-label names the theme it will switch to.
 *
 * Connects to:
 * - src/components/layout/Header.tsx (legacy)
 * - src/contexts/ThemeContext.tsx (`useTheme`; must be inside ThemeProvider)
 * - framer-motion, lucide-react
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Renders the toggle button. The sun and moon cross-fade with rotation and
 * scale, and a radial glow changes colour with the theme.
 */
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-3 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-800 dark:to-secondary-800 hover:from-primary-200 hover:to-secondary-200 dark:hover:from-primary-700 dark:hover:to-secondary-700 transition-all duration-300 shadow-lg hover:shadow-xl border border-primary-200 dark:border-primary-700 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-primary-900"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'light' ? 0 : 180,
          scale: theme === 'light' ? 1 : 0,
          opacity: theme === 'light' ? 1 : 0
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-5 h-5 text-yellow-400 drop-shadow-sm" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 0 : -180,
          scale: theme === 'dark' ? 1 : 0,
          opacity: theme === 'dark' ? 1 : 0
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-5 h-5 text-secondary-300 drop-shadow-sm" />
      </motion.div>

      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: theme === 'light'
            ? 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%)'
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
