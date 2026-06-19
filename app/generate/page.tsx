"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { ReportBody } from "@/components/ReportBody";
import { trackEvent } from "@/lib/analytics";
import {
  FORMATS,
  SAMPLE_INPUT,
  STORAGE_KEY,
  type FormatKey,
  type Report,
  type ReportInput,
} from "@/lib/types";

const EMPTY: ReportInput = {
  metrics: "",
  shipped: "",
  feedback: "",
  risks: "",
  recommendation: "",
};

export default function GeneratePage() {
  const [isJudgeMode, setIsJudgeMode] = useState(false);
  const [form, setForm] = useState<ReportInput>(EMPTY);
  const [report, setReport] = useState<Report | null>(null);
  const [active, setActive] = useState<FormatKey>("slack");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState<"gemini" | "demo" | null>(null);
  const autoRan = useRef(false);

  const set = (k: keyof ReportInput, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const generate = async (override?: ReportInput) => {
    const data = override ?? form;
    if (!data.metrics.trim() || !data.shipped.trim()) {
      setError("Key Metrics and What Shipped are required.");
      return;
    }
    setError("");
    setLoading(true);
    setReport(null);
    const start = Date.now();
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Generation failed.");

      const generationMs = Date.now() - start;
      setReport(json.report);
      setSource(json.source ?? null);
      setActive("slack");

      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            report: json.report,
            input: data,
            generatedAt: Date.now(),
            generationMs,
            source: json.source ?? "demo",
          })
        );
      } catch {
        /* storage unavailable (private mode) — non-fatal */
      }

      trackEvent("report_generated", {
        generation_time_ms: generationMs,
        metrics_count: data.metrics.split("\n").filter((l) => l.trim()).length,
        has_user_feedback: !!data.feedback.trim(),
        has_risks: !!data.risks.trim(),
        source: json.source ?? "demo",
        judge_mode: isJudgeMode,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (autoGenerate = false) => {
    setForm(SAMPLE_INPUT);
    setError("");
    trackEvent("sample_loaded", { judge_mode: isJudgeMode });
    if (autoGenerate) void generate(SAMPLE_INPUT);
  };

  // Judge Mode: one-click demo — detect ?demo=… (client-side), fill the
  // canonical dataset, and generate on load. Reading window.location keeps
  // this page fully server-rendered (no useSearchParams / Suspense bail-out).
  useEffect(() => {
    if (autoRan.current) return;
    const demo = (new URLSearchParams(window.location.search).get("demo") || "").toLowerCase();
    if (["1", "judge", "admin", "true"].includes(demo)) {
      autoRan.current = true;
      setIsJudgeMode(true);
      setForm(SAMPLE_INPUT);
      void generate(SAMPLE_INPUT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = async () => {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report[active]);
      setCopied(true);
      trackEvent("format_copied", {
        format: active,
        word_count: report[active].split(/\s+/).filter(Boolean).length,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't access the clipboard.");
    }
  };

  const activeLabel = FORMATS.find((f) => f.key === active)?.label ?? "Slack";

  return (
    <div className="min-h-screen flex flex-col dot-grid">
      <TopNav />

      {isJudgeMode && (
        <div className="w-full bg-primary text-on-primary">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-2.5 flex items-center justify-center gap-2 text-center">
            <Icon name="visibility" size={18} className="text-secondary-container" />
            <span className="font-label-caps text-label-caps uppercase tracking-wider">
              Judge Mode — sample week pre-loaded &amp; generated automatically
            </span>
          </div>
        </div>
      )}

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* LEFT — INPUT */}
        <section className="flex flex-col gap-6">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-headline-md text-primary text-[22px] font-bold">Paste your week</h1>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Fill in what you have. AI handles the writing.
              </p>
            </div>
            <button
              onClick={() => loadSample(true)}
              data-novus-id="load-sample"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all font-label-caps text-label-caps"
            >
              <Icon name="bolt" size={16} /> Try sample
            </button>
          </header>

          <div className="flex flex-col gap-6">
            <Field label="Key Metrics" required>
              <textarea
                value={form.metrics}
                onChange={(e) => set("metrics", e.target.value)}
                className="w-full h-24 p-4 font-mono-data text-mono-data bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-0 outline-none transition-all custom-scrollbar"
                placeholder={"| Metric | Value | Target |\n|--------|-------|--------|\n| DAU    | 4.2k  | 4.5k   |"}
              />
            </Field>

            <Field label="What Shipped" required>
              <textarea
                value={form.shipped}
                onChange={(e) => set("shipped", e.target.value)}
                className="w-full h-24 p-4 font-body-sm bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-0 outline-none transition-all custom-scrollbar"
                placeholder={"• New onboarding flow live\n• Fixed CSS ghosting in dashboard"}
              />
            </Field>

            <Field label="User Feedback">
              <textarea
                value={form.feedback}
                onChange={(e) => set("feedback", e.target.value)}
                className="w-full h-24 p-4 font-body-sm bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-0 outline-none transition-all custom-scrollbar"
                placeholder={'"The new search is 2x faster" — Sarah J.'}
              />
            </Field>

            <Field label="Risks">
              <input
                value={form.risks}
                onChange={(e) => set("risks", e.target.value)}
                className="w-full px-4 py-3 font-body-sm bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-0 outline-none transition-all"
                placeholder="Potential Q3 hiring delays..."
                type="text"
              />
            </Field>

            <Field label="Recommendations">
              <input
                value={form.recommendation}
                onChange={(e) => set("recommendation", e.target.value)}
                className="w-full px-4 py-3 font-body-sm bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-0 outline-none transition-all"
                placeholder="Double down on automated QA scripts"
                type="text"
              />
            </Field>

            {error && <p className="font-body-sm text-error">{error}</p>}

            <div className="mt-2 flex flex-col gap-4">
              <button
                onClick={() => generate()}
                disabled={loading}
                data-novus-id="generate-btn"
                className="w-full h-14 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Synthesizing..."
                ) : (
                  <>
                    Generate my weekly update <Icon name="arrow_forward" />
                  </>
                )}
              </button>

              {loading && (
                <div>
                  <div className="w-full h-1 rounded-full bg-surface-container-high overflow-hidden">
                    <div className="h-full pulse-fill rounded-full bg-secondary-container" />
                  </div>
                  <p className="text-center font-label-caps text-secondary-container mt-2 animate-pulse uppercase tracking-widest">
                    Synthesizing insights...
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT — OUTPUT */}
        <section className="flex flex-col gap-6 lg:h-full lg:sticky lg:top-24 self-start w-full">
          {/* Tabs */}
          <div
            className={`flex flex-wrap gap-2 transition-opacity ${report ? "opacity-100" : "opacity-30 pointer-events-none"}`}
          >
            {FORMATS.map((f) => {
              const isActive = active === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => {
                    setActive(f.key);
                    trackEvent("format_switched", { to: f.key });
                  }}
                  className={`px-4 py-2 text-label-caps rounded-full flex items-center gap-2 transition-all ${
                    isActive
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                  }`}
                >
                  <Icon name={f.icon} size={16} /> {f.label}
                </button>
              );
            })}
          </div>

          {/* Output card */}
          <div className="flex-grow flex flex-col border border-outline-variant bg-surface-container-lowest rounded-xl overflow-hidden min-h-[500px]">
            <div className="pulse-accent-line" />

            {!report && !loading && (
              <div className="flex-grow flex flex-col items-center justify-center p-margin-desktop text-center">
                <div className="w-16 h-16 bg-primary-container/10 flex items-center justify-center rounded-xl mb-4">
                  <Icon name="analytics" className="text-primary" size={32} />
                </div>
                <h3 className="font-headline-md text-primary mb-2">Ready to generate</h3>
                <p className="font-body-sm text-on-surface-variant max-w-xs">
                  Your structured update will appear here. Select a format once the analysis is
                  complete.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex-grow flex flex-col p-6 gap-3 pt-8">
                {[75, 90, 55, 80, 65, 45, 85, 60].map((w, i) => (
                  <div
                    key={i}
                    className="h-4 rounded bg-surface-container-high"
                    style={{ width: `${w}%`, opacity: 0.7 - i * 0.05 }}
                  />
                ))}
              </div>
            )}

            {report && !loading && (
              <div className="flex-grow flex flex-col p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-label-caps text-on-surface-variant uppercase">
                    Analysis: {activeLabel}
                  </span>
                  <button
                    onClick={copy}
                    data-novus-id="copy-btn"
                    className={`flex items-center gap-2 px-3 py-1.5 border text-label-caps rounded transition-all ${
                      copied
                        ? "border-green-600 text-green-700 bg-green-50"
                        : "border-primary text-primary hover:bg-primary-fixed-dim"
                    }`}
                  >
                    {copied ? "Copied" : "Copy"}
                    <Icon name={copied ? "check" : "content_copy"} size={14} />
                  </button>
                </div>
                <div className="flex-grow bg-surface-container-low rounded p-6 custom-scrollbar overflow-y-auto fade-up">
                  <ReportBody text={report[active]} />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="font-body-sm text-on-surface-variant opacity-70">
                    {source === "demo"
                      ? "Demo output · add a Gemini key for live generation."
                      : "Generated with Gemini · edit before sending."}
                  </p>
                  <Link
                    href="/compare"
                    data-novus-id="view-compare"
                    className="flex items-center gap-1.5 font-label-caps text-primary hover:text-primary-container transition-colors"
                  >
                    Compare all 4 <Icon name="arrow_forward" size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-label-caps text-label-caps text-primary uppercase">
        {label} {required && <span className="text-secondary-container">*</span>}
      </label>
      {children}
    </div>
  );
}
