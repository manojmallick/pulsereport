"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lightweight click-to-open popover used for the nav bar icons.
 * Closes on outside-click, on Escape, and when anything inside the panel
 * is clicked (so links/buttons dismiss it naturally).
 */
export function NavMenu({
  ariaLabel,
  trigger,
  triggerClassName = "",
  children,
  align = "right",
  panelClassName = "",
}: {
  ariaLabel: string;
  trigger: ReactNode;
  triggerClassName?: string;
  children: ReactNode;
  align?: "left" | "right";
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg p-2 z-50 fade-up ${panelClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** A row inside a NavMenu panel. */
export function MenuItem({
  icon,
  children,
  hint,
}: {
  icon?: ReactNode;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <span className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer font-body-sm text-on-surface">
      {icon}
      <span className="flex-grow">{children}</span>
      {hint && <span className="font-mono-data text-on-surface-variant opacity-70">{hint}</span>}
    </span>
  );
}
