import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { PulseLine } from "@/components/PulseLine";
import { Icon } from "@/components/Icon";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop">
        {/* Hero */}
        <section className="flex flex-col items-center text-center pt-24 pb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container text-secondary font-label-caps text-label-caps mb-8">
            <span className="mr-2">⚡</span> Built for PM teams · 60 seconds
          </div>

          <div className="max-w-[700px] mb-6">
            <h1
              className="text-primary font-bold tracking-[-0.03em] leading-[1.1] mb-2"
              style={{ fontSize: "52px" }}
            >
              Your weekly product update.
              <br />
              <span className="text-secondary-container">60 seconds.</span>
            </h1>
          </div>

          <p className="max-w-[520px] text-outline font-body-lg text-[18px] mb-10 leading-relaxed">
            Paste your metrics, what shipped, and user feedback.
            <br />
            Instant professional updates in four tailored formats.
          </p>

          <Link
            href="/generate"
            data-novus-id="hero-cta"
            className="bg-primary text-on-primary px-8 py-4 rounded-xl font-headline-md text-headline-md transition-all hover:bg-primary-container hover:-translate-y-0.5 flex items-center gap-3 shadow-sm hover:shadow-lg"
          >
            Write my update for free <Icon name="arrow_forward" />
          </Link>
          <p className="mt-3 font-body-sm text-on-surface-variant opacity-70">
            No account · No credit card · 60 seconds
          </p>
          <Link
            href="/generate?demo=1"
            data-novus-id="judge-demo"
            className="mt-4 inline-flex items-center gap-1.5 font-label-caps text-label-caps uppercase tracking-wider text-secondary hover:text-primary transition-colors"
          >
            <Icon name="visibility" size={16} /> Judge? One-click demo
          </Link>
        </section>

        {/* Signature pulse line */}
        <div className="relative w-full overflow-hidden h-24 mb-16">
          <PulseLine className="absolute inset-0 w-full h-full pulse-glow" />
        </div>

        {/* Stats strip */}
        <div className="bg-surface-container-lowest brutal-border rounded-xl px-8 md:px-12 py-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-outline-variant">
            <Stat
              eyebrow="Before"
              emoji="🕐"
              value="3.2 hrs"
              label="Average time spent drafting"
              className="md:pr-12"
            />
            <Stat
              eyebrow="Reach"
              emoji="👥"
              value="5 audiences"
              label="Formats for Execs, Eng, & Ops"
              className="pt-8 md:pt-0 md:px-12"
            />
            <Stat
              eyebrow="With PulseReport"
              emoji="⚡"
              value="60 sec"
              label="Zero manual formatting"
              highlight
              className="pt-8 md:pt-0 md:pl-12"
            />
          </div>
        </div>

        {/* Bento showcase */}
        <section className="pb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Live data integration */}
            <div className="md:col-span-8 bg-surface-container-lowest brutal-border rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary-container pulse-glow" />
              <div className="flex justify-between items-start mb-12">
                <div className="max-w-md">
                  <h3 className="font-headline-md text-headline-md text-primary mb-3">
                    Live data, structured fast
                  </h3>
                  <p className="text-on-surface-variant font-body-lg">
                    Paste raw metrics, changelogs, and feedback. We parse the noise and surface the
                    signal — written for the audience that needs it.
                  </p>
                </div>
                <Icon name="database" className="text-secondary-container text-4xl" />
              </div>
              <div className="aspect-video w-full rounded-lg bg-tertiary overflow-hidden relative border border-outline-variant flex items-center justify-center">
                <PulseLine className="w-2/3 h-24 pulse-glow" />
              </div>
            </div>

            {/* Adaptive tone */}
            <div className="md:col-span-4 bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <Icon name="auto_awesome" className="text-secondary-container text-4xl" />
                </div>
                <h3 className="font-headline-md text-headline-md mb-4 text-on-primary-container">
                  Adaptive tone
                </h3>
                <p className="opacity-80 font-body-sm">
                  One paste, four voices — Slack, CEO email, board slide, and engineering standup.
                  Each written for its reader, not adapted from a template.
                </p>
              </div>
              <div className="mt-8 space-y-3">
                <div className="bg-tertiary-container p-3 rounded-lg flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary-container" />
                  <span className="font-mono-data text-mono-data">CEO Email format</span>
                </div>
                <div className="bg-tertiary-container/50 p-3 rounded-lg flex items-center gap-3 opacity-50">
                  <div className="w-2 h-2 rounded-full bg-outline" />
                  <span className="font-mono-data text-mono-data">Engineering Standup</span>
                </div>
              </div>
            </div>

            {/* Weekly highlights */}
            <div className="md:col-span-4 bg-surface-container-low brutal-border rounded-xl p-6">
              <h4 className="font-label-caps text-label-caps text-outline mb-6 uppercase">
                Weekly highlights
              </h4>
              <div className="space-y-1">
                <Row k="Velocity" v="+12.4%" />
                <Row k="Bugs Fixed" v="42" />
                <Row k="Ship Date" v="STABLE" accent last />
              </div>
            </div>

            {/* Distribute anywhere */}
            <div className="md:col-span-8 bg-surface-container-lowest brutal-border rounded-xl p-8 flex flex-col sm:flex-row gap-8 items-center overflow-hidden">
              <div className="flex-1">
                <h3 className="font-headline-md text-headline-md text-primary mb-3">
                  Copy anywhere
                </h3>
                <p className="text-on-surface-variant font-body-sm">
                  One click to copy into Slack, email, or your board deck. Your stakeholders get
                  exactly what they need, where they are.
                </p>
              </div>
              <div className="flex-shrink-0 flex -space-x-4">
                {["mail", "chat", "groups"].map((n, i) => (
                  <div
                    key={n}
                    className="w-16 h-16 rounded-full bg-surface-bright brutal-border flex items-center justify-center shadow-sm"
                    style={{ zIndex: 30 - i * 10 }}
                  >
                    <Icon name={n} className="text-primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <Link
              href="/generate"
              data-novus-id="bento-cta"
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold transition-all hover:bg-primary-container flex items-center gap-3"
            >
              Generate your first update <Icon name="arrow_forward" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Stat({
  eyebrow,
  emoji,
  value,
  label,
  highlight,
  className = "",
}: {
  eyebrow: string;
  emoji: string;
  value: string;
  label: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center md:items-start text-center md:text-left gap-2 ${className}`}>
      <span
        className={`text-label-caps font-label-caps uppercase tracking-wider ${
          highlight ? "text-secondary font-bold" : "text-outline"
        }`}
      >
        {eyebrow}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <span className="font-display text-[32px] text-primary">{value}</span>
      </div>
      <span className="text-body-sm font-body-sm text-outline">{label}</span>
    </div>
  );
}

function Row({ k, v, accent, last }: { k: string; v: string; accent?: boolean; last?: boolean }) {
  return (
    <div
      className={`flex justify-between items-center py-2 ${
        last ? "" : "border-b border-outline-variant"
      }`}
    >
      <span className="text-body-sm">{k}</span>
      <span className={`font-mono-data ${accent ? "text-secondary-container" : "text-primary"}`}>{v}</span>
    </div>
  );
}
