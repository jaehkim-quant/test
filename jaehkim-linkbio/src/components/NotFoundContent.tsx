"use client";

import Link from "next/link";
import { getT } from "@/lib/translations";
import { useLocale } from "./LocaleProvider";

export function NotFoundContent() {
  const { locale } = useLocale();
  const t = getT(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <p className="text-[var(--muted)]">{t("notFoundMessage")}</p>
      <Link href="/jaekim" className="mt-4 text-[var(--foreground)] underline">
        {t("goToHome")}
      </Link>
    </main>
  );
}
