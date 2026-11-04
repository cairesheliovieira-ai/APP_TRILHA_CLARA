import { createContext, useContext, useCallback, useEffect, type ReactNode } from 'react';
import { useAppStore } from '../store/app-store';

interface ThemeContextType {
  theme: 'default' | 'high-contrast';
  textSize: 'default' | 'large';
  reduceMotion: boolean;
  setTheme: (theme: 'default' | 'high-contrast') => void;
  setTextSize: (size: 'default' | 'large') => void;
  setReduceMotion: (reduce: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const {
    theme,
    textSize,
    reduceMotion,
    setTheme,
    setTextSize,
    setReduceMotion,
  } = useAppStore();

  // Apply theme attributes to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-text-size', textSize);
    root.setAttribute('data-reduce-motion', String(reduceMotion));
  }, [theme, textSize, reduceMotion]);

  // Respect system preference for reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches && !reduceMotion) {
      setReduceMotion(true);
    }
  }, []);

  const value: ThemeContextType = {
    theme,
    textSize,
    reduceMotion,
    setTheme: useCallback(setTheme, [setTheme]),
    setTextSize: useCallback(setTextSize, [setTextSize]),
    setReduceMotion: useCallback(setReduceMotion, [setReduceMotion]),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
