import type { Report, ReportInput } from "./types";

/**
 * Deterministic, high-quality fallback used when GEMINI_API_KEY is absent or
 * the model call fails. Keeps the live demo bulletproof. Mirrors the tone the
 * Gemini prompt targets: specific numbers, honest risks, one clear rec.
 */
export function buildDemoReport(input: ReportInput): Report {
  const m = input.metrics?.trim() || "DAU | 4.2k | 4.5k";
  const firstMetric = m.split("\n").find((l) => l.trim() && !l.includes("---")) || "DAU 4.2k";
  const shipped = input.shipped?.trim() || "Shipped core updates";
  const risks = input.risks?.trim() || "No critical blockers this week.";
  const rec = input.recommendation?.trim() || "Maintain current focus and momentum.";

  return {
    slack: [
      "📊 *Weekly Product Pulse*",
      "──────────────────",
      "*Status:* ON TRACK ✅",
      "",
      `📈 *Metrics:* ${firstMetric.replace(/\|/g, "·").trim()}`,
      `🚀 *Shipped:* ${shipped.split("\n")[0].replace(/^[•\-*]\s*/, "")}`,
      `⚠️ *Risk:* ${risks.split("\n")[0].replace(/^[•\-*]\s*/, "")}`,
      `🎯 *Next:* ${rec}`,
    ].join("\n"),

    ceo: [
      `This week showed steady execution against plan. Headline movement: ${firstMetric
        .replace(/\|/g, "→")
        .trim()}. We shipped ${shipped
        .split("\n")
        .filter(Boolean)
        .length} item(s) on schedule, with the highlight being "${shipped
        .split("\n")[0]
        .replace(/^[•\-*]\s*/, "")}". User sentiment held positive where measured.`,
      "",
      `My recommendation for next week: ${rec} The principal risk to watch is ${risks
        .split("\n")[0]
        .replace(/^[•\-*]\s*/, "")
        .toLowerCase()}, which we are actively de-risking. I expect this to stay contained with focused effort and will flag early if that changes.`,
    ].join("\n"),

    board: [
      `• ${firstMetric.replace(/\|/g, " — ").trim()} — primary growth signal, trending to plan`,
      `• Shipped: ${shipped.split("\n")[0].replace(/^[•\-*]\s*/, "")} — delivered on schedule`,
      `• Quality: user feedback positive; no regressions reported in core flows`,
      `• Risk: ${risks.split("\n")[0].replace(/^[•\-*]\s*/, "")} — owner assigned, mitigation underway`,
      `• Focus next week: ${rec}`,
    ].join("\n"),

    standup: [
      "Last week:",
      ...shipped
        .split("\n")
        .filter(Boolean)
        .map((s) => `- ${s.replace(/^[•\-*]\s*/, "")} — deployed, monitoring nominal`),
      `- Metrics tracked: ${firstMetric.replace(/\|/g, " / ").trim()}`,
      "",
      "This week focus:",
      `- ${rec}`,
      `- De-risk: ${risks.split("\n")[0].replace(/^[•\-*]\s*/, "")} (funnel + logs review)`,
    ].join("\n"),
  };
}
