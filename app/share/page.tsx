"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { FormatGrid } from "@/components/FormatGrid";
import { trackEvent } from "@/lib/analytics";
import { decodeReport } from "@/lib/share";
import type { Report } from "@/lib/types";

export default function SharePage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("d");
    const r = decodeReport(d);
    setReport(r);
    setLoaded(true);
    trackEvent("shared_report_viewed", { ok: !!r });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        {report ? (
          <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div>
                <p className="font-label-caps text-label-caps uppercase tracking-wider text-secondary mb-2">
                  Shared product update
                </p>
                <h1 className="font-headline-lg text-headline-lg text-primary mb-1">
                  A weekly update, four ways
                </h1>
                <p className="font-body-sm text-on-surface-variant opacity-70">
                  Slack · CEO email · board slide · engineering standup
                </p>
              </div>
              <Link
                href="/generate"
                data-novus-id="share-make-your-own"
                className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all"
              >
                Make your own <Icon name="arrow_forward" size={18} />
              </Link>
            </header>

            <FormatGrid report={report} via="share" />

            <section className="mt-12 p-8 bg-tertiary-container rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-headline-md text-headline-md text-white mb-2">
                  Write yours in 60 seconds
                </h3>
                <p className="font-body-sm text-on-tertiary-container">
                  Paste your week once — get every format, instantly. No account.
                </p>
              </div>
              <Link
                href="/generate?demo=1"
                className="px-6 py-3 bg-white text-primary rounded-lg font-bold hover:bg-surface-container-low transition-colors relative z-10"
              >
                Try PulseReport
              </Link>
              <div className="absolute right-0 top-0 w-64 h-64 bg-primary opacity-20 blur-[100px] -mr-32 -mt-32" />
            </section>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <div className="w-16 h-16 bg-primary-container/10 flex items-center justify-center rounded-xl mb-4">
              <Icon name={loaded ? "link_off" : "hourglass_empty"} className="text-primary" size={32} />
            </div>
            <h1 className="font-headline-md text-primary mb-2">
              {loaded ? "This link has expired or is invalid" : "Loading…"}
            </h1>
            {loaded && (
              <>
                <p className="font-body-sm text-on-surface-variant max-w-sm mb-6">
                  We couldn&apos;t read a report from this link. Create a fresh one in 60 seconds.
                </p>
                <Link
                  href="/generate"
                  className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold flex items-center gap-2 hover:bg-primary-container transition-all"
                >
                  Write an update <Icon name="arrow_forward" size={16} />
                </Link>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
