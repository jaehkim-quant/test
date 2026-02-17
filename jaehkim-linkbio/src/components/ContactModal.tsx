"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TranslationKey } from "@/lib/translations";
import { getT } from "@/lib/translations";
import { useLocale } from "./LocaleProvider";

const NAME_MIN = 2;
const NAME_MAX = 30;
const MESSAGE_MIN = 5;
const MESSAGE_MAX = 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = "idle" | "validating" | "submitting" | "success" | "error";

type Errors = { name?: string; email?: string; message?: string };

function validate(
  name: string,
  email: string,
  message: string,
  t: (k: TranslationKey) => string
): Errors {
  const errors: Errors = {};
  const tName = name.trim();
  if (tName.length < NAME_MIN || tName.length > NAME_MAX || !/^(?!\s*$).+/.test(tName)) {
    errors.name = t("errorName");
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = t("errorEmail");
  }
  const tMsg = message.trim();
  if (tMsg.length < MESSAGE_MIN || tMsg.length > MESSAGE_MAX) {
    errors.message = t("errorMessage");
  }
  return errors;
}

export function ContactModal({
  isOpen,
  onClose,
  onSuccess,
  slug,
  triggerRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  slug: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { locale } = useLocale();
  const t = getT(locale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setName("");
    setEmail("");
    setMessage("");
    setHoneypot("");
    setErrors({});
    setFormState("idle");
    setSubmitError(null);
  }, []);

  const close = useCallback(() => {
    reset();
    onClose();
    triggerRef.current?.focus();
  }, [onClose, reset, triggerRef]);

  useEffect(() => {
    if (!isOpen) return;
    reset();
    const t = setTimeout(() => firstInputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) close();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(name, email, message, t);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setFormState("error");
      return;
    }
    setFormState("submitting");
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          slug,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          honeypot: honeypot || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 429) {
          setSubmitError(t("errorTooMany"));
        } else if (data.errors) {
          setErrors({
            name: data.errors.name ? t("errorName") : undefined,
            email: data.errors.email ? t("errorEmail") : undefined,
            message: data.errors.message ? t("errorMessage") : undefined,
          });
        } else {
          setSubmitError(data.error || t("errorGeneric"));
        }
        setFormState("error");
        return;
      }
      setFormState("success");
      onSuccess();
      setTimeout(close, 300);
    } catch {
      setSubmitError(t("errorGeneric"));
      setFormState("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="w-full max-w-md rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="contact-modal-title" className="text-xl font-semibold text-[var(--foreground)]">
            {t("modalTitle")}
          </h2>
          <button
            type="button"
            onClick={close}
            className="rounded-full p-1 text-[var(--muted)] hover:bg-[var(--highlight)] hover:text-[var(--foreground)]"
            aria-label={t("close")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("modalSubtitle")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="absolute -left-[9999px]"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-[var(--foreground)]">
              {t("fieldName")}
            </label>
            <input
              ref={firstInputRef}
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={formState === "submitting"}
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              placeholder={t("placeholderName")}
              autoComplete="name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-[var(--error)]">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-[var(--foreground)]">
              {t("fieldEmail")}
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={formState === "submitting"}
              className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              placeholder={t("placeholderEmail")}
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-[var(--error)]">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-[var(--foreground)]">
              {t("fieldMessage")}
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={formState === "submitting"}
              rows={4}
              className="mt-1 w-full resize-none rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              placeholder={t("placeholderMessage")}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-[var(--error)]">{errors.message}</p>
            )}
          </div>

          {submitError && (
            <p className="text-sm text-[var(--error)]">{submitError}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              className="flex-1 rounded-[var(--radius)] border border-[var(--card-border)] py-3 font-medium text-[var(--foreground)] hover:bg-[var(--highlight)]"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="flex-1 rounded-[var(--radius)] bg-[var(--champagne)] py-3 font-medium text-[var(--foreground)] hover:opacity-90 disabled:opacity-60"
            >
              {formState === "submitting" ? t("sending") : t("send")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
