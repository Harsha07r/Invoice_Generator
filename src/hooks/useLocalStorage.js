import { useState, useEffect } from 'react';

/**
 * useLocalStorage — persist state to localStorage with JSON serialization.
 * Falls back to initialValue if reading/writing fails.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if key not found
 * @returns {[value, setter]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Quota exceeded or private mode — silently ignore
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
