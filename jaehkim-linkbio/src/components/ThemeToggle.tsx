"use client";

import { useTheme } from "./ThemeProvider";
import { getT } from "@/lib/translations";
import { useLocale } from "./LocaleProvider";

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { locale } = useLocale();
  const t = getT(locale);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full p-2 text-[var(--muted)] transition hover:bg-[var(--highlight)] hover:text-[var(--foreground)]"
      aria-label={resolvedTheme === "dark" ? t("switchToLight") : t("switchToDark")}
    >
      {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
