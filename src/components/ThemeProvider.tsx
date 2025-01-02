import { ReactNode, useEffect } from 'react';
import { useThemeStore } from '../stores/useThemeStore';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return <>{children}</>;
}
