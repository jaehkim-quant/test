"use client";

import { useLocale } from "./LocaleProvider";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="flex rounded-full border border-[var(--card-border)] bg-[var(--card)] p-0.5 shadow-[var(--shadow)]"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          locale === "en"
            ? "bg-[var(--champagne)] text-[var(--foreground)]"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
        aria-pressed={locale === "en"}
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("ko")}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          locale === "ko"
            ? "bg-[var(--champagne)] text-[var(--foreground)]"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
        aria-pressed={locale === "ko"}
        aria-label="한국어"
      >
        한
      </button>
    </div>
  );
}
