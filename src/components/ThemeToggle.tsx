/**
 * ThemeToggle.tsx — Theme toggle component for dark/light mode switching.
 *
 * This component provides a smooth animated toggle for switching between dark and light themes.
 * Features smooth animations, accessibility support, and integrates with the global theme context.
 * The component persists theme preferences and provides visual feedback during transitions.
 *
 * The component includes:
 * - Animated Sun/Moon icon transitions
 * - Smooth scale and rotation animations
 * - Accessibility support with aria-labels
 * - Integration with ThemeContext for state management
 * - Automatic visual feedback during transitions
 *
 * @component
 * @example
 * ```tsx
 * import ThemeToggle from './components/ThemeToggle';
 *
 * function Header() {
 *   return (
 *     <header>
 *       <ThemeToggle />
 *     </header>
 *   );
 * }
 * ```
 *
 * @see {@link src/contexts/ThemeContext.tsx} for theme state management
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * ThemeToggle — Animated theme toggle component.
 *
 * Provides an interactive button to switch between light and dark themes
 * with smooth animations and accessibility features. Integrates with the
 * global theme context to persist user preferences.
 *
 * @component
 * @returns {JSX.Element} The rendered theme toggle button
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
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
