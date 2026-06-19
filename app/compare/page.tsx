"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { FormatGrid } from "@/components/FormatGrid";
import { trackEvent } from "@/lib/analytics";
import { encodeReport } from "@/lib/share";
import { STORAGE_KEY, type Report, type StoredReport } from "@/lib/types";

const SAMPLE: Report = {
  slack:
    "🚨 Week 23 Update: Product metrics are looking sharp! ARPU increased by 12% following the Tier-2 pricing adjustment. Retention at 94.2%.\n\nWins:\n• Core V3 API deployed successfully.\n• Beta feedback for \"Pulse Insights\" is 4.8/5.\n\nBlockers: Latency issues on EMEA clusters. DevOps is investigating.",
  ceo:
    "Subject: Executive Summary — Product Pulse Week 23\n\nSummary of operations for May 18. Growth continues to trend above projection with a 12% lift in ARPU. We are currently stabilizing infrastructure to accommodate the load from the EMEA market expansion.\n\nKey Strategic Alignment: The V3 API launch positions us as a leader in low-latency data processing, directly impacting our Q3 enterprise targets.",
  board:
    "• ARPU Growth: +12.0% WoW — Cohort LTV expanded 8.4% on reduced churn in the 'Advanced' tier.\n• Deployment frequency: 14/week — Infrastructure costs optimized 11% via auto-scaling.\n• Retention: 94.2% — Stable post Tier-2 pricing adjustment.",
  standup:
    "Last week:\n• Finished V3 documentation and finalized pricing-shift monitoring.\n\nThis week focus:\n• EMEA cluster latency — root-cause analysis with DevOps.\n• No blockers except cluster stability.",
};

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
  const [meta, setMeta] = useState<{ ts: number | null; ms: number | null }>({ ts: null, ms: null });
  const [shared, setShared] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: StoredReport = JSON.parse(raw);
        if (stored?.report) {
          setReport(stored.report);
          setMeta({ ts: stored.generatedAt, ms: stored.generationMs });
        }
      }
    } catch {
      /* ignore — fall back to sample */
    }
  }, []);

  const shareAll = async () => {
    const url = `${window.location.origin}/share?d=${encodeReport(report)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      trackEvent("report_shared", { share_method: "link", url_length: url.length });
      setTimeout(() => setShared(false), 2500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const { title, sub } = weekLabel(meta.ts);
  const subLine = meta.ms != null ? `4 formats · generated in ${(meta.ms / 1000).toFixed(1)} seconds` : sub;

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
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
            <Icon name={shared ? "check" : "link"} size={20} />
            {shared ? "Link copied!" : "Share link"}
          </button>
        </header>

        <FormatGrid report={report} via="compare" />

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
              href="mailto:manoj.mallick079@gmail.com?subject=PulseReport%20%E2%80%94%20new%20format%20request&body=I%27d%20love%20a%20format%20for%3A%20"
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
