"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { ReportBody } from "./ReportBody";
import { trackEvent } from "@/lib/analytics";
import type { FormatKey, Report } from "@/lib/types";

type CardMeta = {
  key: FormatKey;
  title: string;
  icon: string;
  iconWrap: string;
  badge: string;
  accent?: boolean;
  italic?: boolean;
};

const CARDS: CardMeta[] = [
  {
    key: "slack",
    title: "Slack",
    icon: "chat",
    iconWrap: "bg-amber-50 text-[#E01E5A]",
    badge: "bg-secondary-container/20 text-secondary border-secondary-container/30",
  },
  {
    key: "ceo",
    title: "CEO Email",
    icon: "mail",
    iconWrap: "bg-primary-container text-on-primary",
    badge: "bg-primary-container/20 text-primary border-primary-container/30",
    accent: true,
  },
  {
    key: "board",
    title: "Board",
    icon: "monitoring",
    iconWrap: "bg-teal-50 text-teal-800",
    badge: "bg-teal-100 text-teal-900 border-teal-200",
  },
  {
    key: "standup",
    title: "Standup",
    icon: "groups",
    iconWrap: "bg-surface-container-high text-on-surface-variant",
    badge: "bg-outline-variant/40 text-on-surface-variant border-outline-variant",
    italic: true,
  },
];

const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function FormatGrid({ report, via = "compare" }: { report: Report; via?: string }) {
  const [copiedKey, setCopiedKey] = useState<FormatKey | null>(null);

  const copyOne = async (key: FormatKey) => {
    try {
      await navigator.clipboard.writeText(report[key]);
      setCopiedKey(key);
      trackEvent("format_copied", { format: key, word_count: wordCount(report[key]), via });
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-start">
      {CARDS.map((c) => (
        <div
          key={c.key}
          className={`bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col hover:border-primary transition-colors relative ${
            c.accent
              ? "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-secondary-container before:shadow-[0_0_4px_rgba(254,174,44,0.4)] before:z-10"
              : ""
          }`}
        >
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded flex items-center justify-center ${c.iconWrap}`}>
                <Icon name={c.icon} />
              </div>
              <span className="font-headline-md text-headline-md text-primary">{c.title}</span>
            </div>
            <button
              onClick={() => copyOne(c.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors border ${
                copiedKey === c.key
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "text-on-surface-variant hover:bg-surface-container-low border-outline-variant"
              }`}
            >
              <Icon name={copiedKey === c.key ? "check" : "content_copy"} size={18} />
              <span className="font-label-caps text-label-caps">
                {copiedKey === c.key ? "Copied" : "Copy"}
              </span>
            </button>
          </div>
          <div className={`p-6 ${c.italic ? "italic" : ""}`}>
            <ReportBody text={report[c.key]} />
          </div>
          <div className="px-6 py-4 bg-surface-container-low flex items-center">
            <span className={`px-3 py-1 rounded-full font-mono-data text-mono-data border ${c.badge}`}>
              {wordCount(report[c.key])} words
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
