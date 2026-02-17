"use client";

import { useRef, useState } from "react";
import type { Profile } from "@/lib/profile-data";
import { getT } from "@/lib/translations";
import { useLocale } from "./LocaleProvider";
import { LinkButton, ComingSoonRow } from "./LinkButton";
import { ContactModal } from "./ContactModal";
import { Toast } from "./Toast";
import { ResearchIcon, OpenKakaoIcon, YouTubeIcon, XIcon, LinkedInIcon } from "./LinkIcons";

const LINK_KEYS: Array<{ key: keyof Profile["links"]; labelKey: "labelResearch" | "labelOpenKakao" | "labelYouTube" | "labelX" | "labelLinkedIn"; icon: React.ReactNode }> = [
  { key: "research", labelKey: "labelResearch", icon: <ResearchIcon /> },
  { key: "openKakao", labelKey: "labelOpenKakao", icon: <OpenKakaoIcon /> },
  { key: "youtubeChannel", labelKey: "labelYouTube", icon: <YouTubeIcon /> },
  { key: "x", labelKey: "labelX", icon: <XIcon /> },
  { key: "linkedin", labelKey: "labelLinkedIn", icon: <LinkedInIcon /> },
];

/** Links that are live; the rest are shown as "Coming soon" */
const READY_LINK_KEYS: Set<keyof Profile["links"]> = new Set(["research", "linkedin"]);

export function ProfileCard({ profile }: { profile: Profile }) {
  const { locale } = useLocale();
  const t = getT(locale);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);

  const links = profile.links;

  return (
    <>
      <div className="w-full max-w-[480px] px-4 sm:px-6">
        <div className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] p-8 shadow-[var(--shadow)]">
          <header className="text-center">
            <h1 className="text-2xl font-semibold tracking-wide text-[var(--foreground)]">
              {locale === "en" && profile.displayNameEn ? profile.displayNameEn : profile.displayName}
            </h1>
            <p className="mt-1 text-xs tracking-wide text-[var(--muted)]">{t("linksSubtitle")}</p>
          </header>

          <nav className="mt-8 flex flex-col gap-3" aria-label="Links">
            {LINK_KEYS.map(({ key, labelKey, icon }) => {
              const isReady = READY_LINK_KEYS.has(key) && links[key];
              const label = t(labelKey);
              if (isReady) {
                return (
                  <LinkButton
                    key={key}
                    href={links[key]!}
                    label={label}
                    icon={icon}
                  />
                );
              }
              return (
                <ComingSoonRow
                  key={key}
                  label={label}
                  icon={icon}
                  badgeText={t("comingSoon")}
                />
              );
            })}
          </nav>

          <div className="mt-6">
            <button
              ref={contactButtonRef}
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full rounded-[var(--radius)] border-2 border-[var(--champagne)] bg-[var(--champagne)]/30 py-4 font-medium tracking-wide text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--champagne)]/50 active:translate-y-0.5"
            >
              {t("contact")}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[var(--muted)]">
          {t("footerAgree")}
        </p>
      </div>

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setToast({ message: t("toastSuccess"), type: "success" })}
        slug={profile.slug}
        triggerRef={contactButtonRef}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
