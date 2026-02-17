"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "linkbio-theme";

type ThemeContextValue = {
  themeMode: ThemeMode;
  resolvedTheme: "light" | "dark";
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "light" || v === "dark" || v === "system") return v;
  return "system";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setThemeModeState(getStoredMode());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const resolved = themeMode === "system" ? getSystemTheme() : themeMode;
    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, [themeMode, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (themeMode === "system") {
        const resolved = mq.matches ? "dark" : "light";
        setResolvedTheme(resolved);
        document.documentElement.setAttribute("data-theme", resolved);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mounted, themeMode]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === "light" ? "dark" : "light";
    setThemeModeState(next);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, next);
  }, [resolvedTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ themeMode, resolvedTheme, setThemeMode, toggleTheme }),
    [themeMode, resolvedTheme, setThemeMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
