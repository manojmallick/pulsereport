// Novus.ai (Pendo) analytics wrapper.
// Every call is a safe no-op when the agent failed to load or no key is set,
// so the product never breaks because of analytics.

type Pendo = {
  track: (event: string, data?: Record<string, unknown>) => void;
  isReady?: () => boolean;
};

declare global {
  interface Window {
    pendo?: Pendo;
  }
}

export function trackEvent(event: string, data: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.pendo?.track?.(event, data);
  } catch {
    /* analytics must never throw into product code */
  }
  if (process.env.NODE_ENV !== "production") {
    // Visible in dev so you can verify the Novus.ai story before submission.
    // eslint-disable-next-line no-console
    console.debug(`[novus] ${event}`, data);
  }
}
