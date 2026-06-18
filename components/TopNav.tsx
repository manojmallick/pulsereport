"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { NavMenu, MenuItem } from "./NavMenu";
import { STORAGE_KEY, type StoredReport } from "@/lib/types";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/generate", label: "Generate" },
  { href: "/compare", label: "Compare" },
];

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function TopNav() {
  const pathname = usePathname();
  const [last, setLast] = useState<StoredReport | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setLast(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [pathname]);

  const resetSession = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      setLast(null);
    } catch {
      /* ignore */
    }
  };

  const iconBtn =
    "material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors";

  return (
    <nav className="sticky top-0 w-full z-50 bg-surface flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 border-b border-outline-variant">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="font-headline-md text-headline-md font-bold text-primary border-t-2 border-secondary-container"
        >
          PulseReport
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active
                    ? "font-body-lg text-body-lg text-primary font-bold border-b-2 border-secondary-container pb-1 transition-colors"
                    : "font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NavMenu ariaLabel="Notifications" trigger={<span className={iconBtn}>notifications</span>}>
          <p className="px-3 pt-1 pb-2 font-label-caps text-label-caps uppercase text-on-surface-variant">
            Notifications
          </p>
          {last ? (
            <Link href="/compare">
              <MenuItem icon={<Icon name="check_circle" size={18} className="text-green-600" />} hint={timeAgo(last.generatedAt)}>
                Weekly update ready
              </MenuItem>
            </Link>
          ) : (
            <Link href="/generate">
              <MenuItem icon={<Icon name="bolt" size={18} className="text-secondary-container" />}>
                Generate your first update
              </MenuItem>
            </Link>
          )}
          <Link href="/generate?demo=1">
            <MenuItem icon={<Icon name="visibility" size={18} className="text-primary" />}>
              Try the one-click demo
            </MenuItem>
          </Link>
        </NavMenu>

        {/* Settings */}
        <NavMenu ariaLabel="Settings" trigger={<span className={iconBtn}>settings</span>}>
          <p className="px-3 pt-1 pb-2 font-label-caps text-label-caps uppercase text-on-surface-variant">
            Settings
          </p>
          <MenuItem icon={<Icon name="smart_toy" size={18} className="text-primary" />} hint="Gemini">
            AI engine
          </MenuItem>
          <MenuItem icon={<Icon name="monitoring" size={18} className="text-primary" />} hint="Novus.ai">
            Analytics
          </MenuItem>
          <button type="button" onClick={resetSession} className="w-full text-left">
            <MenuItem icon={<Icon name="restart_alt" size={18} className="text-error" />}>
              Reset session data
            </MenuItem>
          </button>
        </NavMenu>

        {/* Account */}
        <NavMenu
          ariaLabel="Account"
          align="right"
          trigger={
            <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <Icon name="person" size={18} />
            </span>
          }
        >
          <div className="px-3 pt-1 pb-2 border-b border-outline-variant mb-1">
            <p className="font-body-sm font-semibold text-on-surface">Demo User</p>
            <p className="font-body-sm text-on-surface-variant opacity-70">Mind the Product 2026</p>
          </div>
          <Link href="/generate">
            <MenuItem icon={<Icon name="edit_note" size={18} className="text-primary" />}>
              New update
            </MenuItem>
          </Link>
          <Link href="/compare">
            <MenuItem icon={<Icon name="dashboard" size={18} className="text-primary" />}>
              Compare formats
            </MenuItem>
          </Link>
          <Link href="/">
            <MenuItem icon={<Icon name="home" size={18} className="text-primary" />}>
              Home
            </MenuItem>
          </Link>
        </NavMenu>
      </div>
    </nav>
  );
}
