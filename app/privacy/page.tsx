import type { Metadata } from "next";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = { title: "Privacy Policy — PulseReport" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-grow w-full max-w-[760px] mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Privacy Policy</h1>
        <p className="font-body-sm text-on-surface-variant mb-10">Last updated June 18, 2026</p>

        <div className="flex flex-col gap-8 font-body-lg text-on-surface-variant leading-relaxed">
          <Section title="What we collect">
            PulseReport is a hackathon demo. The text you paste into the generator is sent to
            Google&apos;s Gemini API to produce your update and is <strong>not stored on our servers</strong>.
            Your most recent generated report is kept only in your browser&apos;s <code>sessionStorage</code>
            so the Compare view can read it; it clears when you close the tab.
          </Section>
          <Section title="Analytics">
            We use Novus.ai (Pendo) to understand product usage — which formats are copied, how long
            people read before copying, and similar interaction events. These are anonymous and
            contain no report content.
          </Section>
          <Section title="Third parties">
            Generation is powered by Google Gemini. Hosting is on Vercel. Each has its own privacy
            terms governing data in transit.
          </Section>
          <Section title="Contact">
            Questions? Email{" "}
            <a className="text-primary hover:text-secondary" href="mailto:manoj.mallick079@gmail.com">
              manoj.mallick079@gmail.com
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
