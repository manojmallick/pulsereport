import type { Metadata } from "next";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = { title: "Terms of Service — PulseReport" };

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-grow w-full max-w-[760px] mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Terms of Service</h1>
        <p className="font-body-sm text-on-surface-variant mb-10">Last updated June 18, 2026</p>

        <div className="flex flex-col gap-8 font-body-lg text-on-surface-variant leading-relaxed">
          <Section title="The short version">
            PulseReport is a demo built for the Mind the Product hackathon (World Product Day 2026).
            It&apos;s provided <strong>as-is</strong>, with no warranty, for evaluation and demonstration.
          </Section>
          <Section title="AI-generated output">
            Generated updates are a <strong>starting point, not the final word</strong>. Always review and
            edit before sending anything to a CEO, board, or your team. You are responsible for what
            you publish.
          </Section>
          <Section title="Acceptable use">
            Don&apos;t paste secrets, regulated personal data, or anything you&apos;re not allowed to share with
            third-party AI services. Don&apos;t use the tool for unlawful purposes.
          </Section>
          <Section title="Contact">
            Reach us at{" "}
            <a className="text-primary hover:text-secondary" href="mailto:hello@learnhubplay.nl">
              hello@learnhubplay.nl
            </a>
            .
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-headline-md text-headline-md text-primary mb-2">{title}</h2>
      <p>{children}</p>
    </section>
  );
}
