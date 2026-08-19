import { useCallback, useEffect, useState } from "react";

export function useLocalStorageState<T extends string>(
  key: string,
  defaultValue: T,
  isValid?: (value: string) => value is T
) {
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) return defaultValue;
      if (isValid && !isValid(stored)) return defaultValue;
      return stored as T;
    } catch {
      return defaultValue;
    }
  }, [key, defaultValue, isValid]);

  const [value, setValue] = useState<T>(readValue);

  const setPersistedValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, resolved);
        } catch {
        }
        return resolved;
      });
    },
    [key]
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      setValue(readValue());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, readValue]);

  return [value, setPersistedValue] as const;
}