/**
 * Light/dark theme state shared through React context.
 *
 * ThemeProvider starts from the `theme` value in localStorage when it is 'light' or 'dark', else
 * 'light' (the server always renders 'light'). On every change it sets the matching class on <html>
 * and writes the value back to localStorage. CSS tokens for each class live in src/index.css.
 *
 * Connects to:
 * - ThemeProvider: src/main.tsx (client) and src/entry-server.tsx (prerender); tests render it too.
 * - useTheme: src/components/site/SiteHeader.tsx (live toggle); legacy src/components/ui/ThemeToggle.tsx.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

/** Value exposed by the context. */
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Reads the theme context. Throws when called outside a ThemeProvider. */
// The hook stays beside its provider; editing this file triggers a full reload instead of Fast Refresh.
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

/** Holds the theme and syncs it to the <html> class and localStorage. Storage errors are logged and ignored. */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Light-first editorial default; only honor an explicit user choice.
    if (typeof window === 'undefined') {
      return 'light';
    }

    try {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (error) {
      console.warn('Theme context: Could not access localStorage', error);
    }

    return 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const root = window.document.documentElement;

      root.classList.remove('light', 'dark');

      root.classList.add(theme);

      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Theme context: Could not update theme classes', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
