import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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
    // Check if window is available
    if (typeof window === 'undefined') return;

    try {
      const root = window.document.documentElement;

      // Remove existing theme classes
      root.classList.remove('light', 'dark');

      // Add current theme class
      root.classList.add(theme);

      // Save to localStorage
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
