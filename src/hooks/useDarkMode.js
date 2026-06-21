import { useState, useEffect } from 'react';

/**
 * useDarkMode — toggle dark mode by toggling 'dark' class on <html> element.
 * Persists preference in localStorage and respects system preference as default.
 *
 * @returns {{ isDark: boolean, toggle: Function, setDark: Function }}
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('invoiceforge-dark-mode');
      if (stored !== null) return JSON.parse(stored);
    } catch { /* ignore */ }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('invoiceforge-dark-mode', JSON.stringify(isDark));
    } catch { /* ignore */ }
  }, [isDark]);

  const toggle   = () => setIsDark(prev => !prev);
  const setDark  = (val) => setIsDark(val);

  return { isDark, toggle, setDark };
}
