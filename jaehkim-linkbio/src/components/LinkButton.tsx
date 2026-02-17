"use client";

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function LinkButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-5 py-4 text-[var(--foreground)] shadow-[var(--shadow)] transition hover:border-[var(--accent)] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
    >
      <span className="flex items-center gap-3">
        <span className="text-[var(--muted)]">{icon}</span>
        <span className="font-medium tracking-wide">{label}</span>
      </span>
      <span className="text-[var(--muted)]"><ExternalIcon /></span>
    </a>
  );
}

/** Row that looks like a link but shows "Coming soon" — used for not-yet-available links */
export function ComingSoonRow({
  label,
  icon,
  badgeText,
}: {
  label: string;
  icon: React.ReactNode;
  badgeText: string;
}) {
  return (
    <div
      role="presentation"
      className="flex w-full items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)]/50 px-5 py-4 text-[var(--muted)] shadow-[var(--shadow)]"
      aria-label={`${label} — ${badgeText}`}
    >
      <span className="flex items-center gap-3">
        <span className="opacity-70">{icon}</span>
        <span className="font-medium tracking-wide">{label}</span>
      </span>
      <span className="rounded-full bg-[var(--muted)]/20 px-2.5 py-1 text-xs font-medium text-[var(--muted)]">
        {badgeText}
      </span>
    </div>
  );
}
