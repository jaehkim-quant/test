"use client";

import { useEffect } from "react";

export function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 text-sm font-medium text-[var(--foreground)] shadow-lg"
    >
      {message}
    </div>
  );
}
