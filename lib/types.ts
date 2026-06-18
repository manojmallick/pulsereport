export type FormatKey = "slack" | "ceo" | "board" | "standup";

export interface Report {
  slack: string;
  ceo: string;
  board: string;
  standup: string;
}

export interface ReportInput {
  metrics: string;
  shipped: string;
  feedback: string;
  risks: string;
  recommendation: string;
}

export interface StoredReport {
  report: Report;
  input: ReportInput;
  generatedAt: number;
  generationMs: number;
  source: "gemini" | "demo";
}

export const FORMATS: {
  key: FormatKey;
  label: string;
  icon: string;
  desc: string;
}[] = [
  { key: "slack", label: "Slack", icon: "forum", desc: "Short, scannable, emoji" },
  { key: "ceo", label: "CEO Email", icon: "mail", desc: "2 paragraphs, strategic" },
  { key: "board", label: "Board", icon: "dashboard", desc: "5 bullets, crisp" },
  { key: "standup", label: "Standup", icon: "engineering", desc: "Technical, specific" },
];

export const STORAGE_KEY = "pulsereport:last";

/**
 * Canonical PM dataset used by Judge Mode (`/generate?demo=1`) so a judge can
 * see a full, realistic generation in one click — no typing on stage.
 */
export const SAMPLE_INPUT: ReportInput = {
  metrics: [
    "DAU | 47,200 | 45,100 | Monday dip, recovered by Thursday",
    "Conversion | 3.2% | 3.4% | A/B test variant B underperforming",
    "NPS | 42 | 38 | Post-launch survey, higher than expected",
  ].join("\n"),
  shipped: [
    "New checkout flow — launched to 100% traffic",
    "Email notifications — 14K sent, 42% open rate",
    "Mobile search improvements — delayed to next week",
  ].join("\n"),
  feedback: [
    '"The new checkout is so much faster" — Enterprise user (NPS 9)',
    "3 tickets this week about mobile search lag",
    '"Finally fixed the payment bug!" — 12 mentions in Slack',
  ].join("\n"),
  risks: [
    "Search improvements delayed — backend complexity underestimated",
    "A/B test variant B underperforming (2.8% vs 3.4% control)",
  ].join("\n"),
  recommendation: "Focus on conversion recovery. Pause search work until the A/B test resolves.",
};
