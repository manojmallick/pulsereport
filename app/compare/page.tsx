"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { trackEvent } from "@/lib/analytics";
import { STORAGE_KEY, type FormatKey, type Report, type StoredReport } from "@/lib/types";

const SAMPLE: Report = {
  slack:
    "🚨 Week 23 Update: Product metrics are looking sharp! ARPU increased by 12% following the Tier-2 pricing adjustment. Retention at 94.2%.\n\nWins:\n• Core V3 API deployed successfully.\n• Beta feedback for \"Pulse Insights\" is 4.8/5.\n\nBlockers: Latency issues on EMEA clusters. DevOps is investigating.",
  ceo:
    "Subject: Executive Summary — Product Pulse Week 23\n\nSummary of operations for May 18. Growth continues to trend above projection with a 12% lift in ARPU. We are currently stabilizing infrastructure to accommodate the load from the EMEA market expansion.\n\nKey Strategic Alignment: The V3 API launch positions us as a leader in low-latency data processing, directly impacting our Q3 enterprise targets.",
  board:
    "1. FINANCIAL PERFORMANCE\nARPU Growth: +12.0% WoW. Cohort LTV expanded by 8.4% due to reduced churn in the 'Advanced' tier.\n\n2. OPERATIONAL EFFICIENCY\nDeployment frequency reached 14/week. Infrastructure costs optimized by 11% through auto-scaling refactoring.",
  standup:
    "\"Yesterday I finished the V3 documentation and finalized the pricing shift monitoring. Today I'm focused on the EMEA cluster latency issues and meeting with DevOps for a root cause analysis. No blockers except for the cluster stability.\"",
};

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

function weekLabel(ts: number | null): { title: string; sub: string } {
  if (!ts) return { title: "Week 23 · May 18, 2026", sub: "4 formats · sample report" };
  const d = new Date(ts);
  const start = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  const date = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return { title: `Week ${week} · ${date}`, sub: "4 formats · generated for you" };
}

export default function ComparePage() {
  const [report, setReport] = useState<Report>(SAMPLE);
  const [meta, setMeta] = useState<{ ts: number | null; ms: number | null; source: string }>({
    ts: null,
    ms: null,
    source: "sample",
  });
  const [copiedKey, setCopiedKey] = useState<FormatKey | "all" | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: StoredReport = JSON.parse(raw);
        if (stored?.report) {
          setReport(stored.report);
          setMeta({ ts: stored.generatedAt, ms: stored.generationMs, source: stored.source });
        }
      }
    } catch {
      /* ignore — fall back to sample */
    }
  }, []);

  const copyOne = async (key: FormatKey) => {
    try {
      await navigator.clipboard.writeText(report[key]);
      setCopiedKey(key);
      trackEvent("format_copied", { format: key, word_count: wordCount(report[key]), via: "compare" });
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const shareAll = async () => {
    const combined = CARDS.map((c) => `## ${c.title}\n${report[c.key]}`).join("\n\n———\n\n");
    try {
      await navigator.clipboard.writeText(combined);
      setCopiedKey("all");
      trackEvent("report_shared", { share_method: "copy_all", formats: 4 });
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const { title, sub } = weekLabel(meta.ts);
  const subLine =
    meta.ms != null
      ? `4 formats · generated in ${(meta.ms / 1000).toFixed(1)} seconds`
      : sub;

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-1">{title}</h1>
            <p className="font-body-sm text-on-surface-variant opacity-70 uppercase tracking-wider">
              {subLine}
            </p>
          </div>
          <button
            onClick={shareAll}
            data-novus-id="share-all"
            className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <Icon name={copiedKey === "all" ? "check" : "share"} size={20} />
            {copiedKey === "all" ? "Copied all" : "Share all"}
          </button>
        </header>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {CARDS.map((c) => (
            <div
              key={c.key}
              className={`bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col hover:border-primary transition-colors relative ${
                c.accent ? "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-secondary-container before:shadow-[0_0_4px_rgba(254,174,44,0.4)] before:z-10" : ""
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
              <div
                className={`p-6 flex-grow font-body-lg text-body-lg text-on-surface-variant whitespace-pre-wrap ${
                  c.italic ? "italic" : ""
                }`}
              >
                {report[c.key]}
              </div>
              <div className="px-6 py-4 bg-surface-container-low flex items-center">
                <span className={`px-3 py-1 rounded-full font-mono-data text-mono-data border ${c.badge}`}>
                  {wordCount(report[c.key])} words
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action bar */}
        <section className="mt-12 p-8 bg-tertiary-container rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-headline-md text-headline-md text-white mb-2">
              Need a different perspective?
            </h3>
            <p className="font-body-sm text-on-tertiary-container">
              Add custom constraints or personas to regenerate the pulse report.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 relative z-10">
            <Link
              href="/generate"
              className="px-6 py-3 bg-white text-primary rounded-lg font-bold hover:bg-surface-container-low transition-colors"
            >
              Modify Parameters
            </Link>
            <a
              href="mailto:hello@learnhubplay.nl?subject=PulseReport%20%E2%80%94%20new%20format%20request&body=I%27d%20love%20a%20format%20for%3A%20"
              onClick={() => trackEvent("add_format_requested", {})}
              className="px-6 py-3 border border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Request a Format
            </a>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary opacity-20 blur-[100px] -mr-32 -mt-32" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
