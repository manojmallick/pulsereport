import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-8 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center bg-surface-container-low border-t border-outline-variant mt-10 gap-4">
      <Link href="/" className="font-label-caps text-label-caps text-primary uppercase tracking-widest font-bold">
        PulseReport
      </Link>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="/privacy">
          Privacy Policy
        </Link>
        <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="/terms">
          Terms of Service
        </Link>
        <a
          className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors"
          href="mailto:hello@learnhubplay.nl?subject=PulseReport%20support"
        >
          Contact Support
        </a>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant opacity-80 text-center">
        Built by Manoj Mallick · #EveryoneShipsNow
      </p>
    </footer>
  );
}
