import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Report, ReportInput } from "@/lib/types";
import { buildDemoReport } from "@/lib/demoReport";

export const runtime = "nodejs";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

const systemPrompt = `You are a senior product manager at a tech company.
You write clear, direct, and insightful product updates.
Your style: specific numbers over vague claims. One clear recommendation.
Honest about risks — never bury problems. Executive-friendly but not dumbed down.
No buzzwords. No padding. Every sentence earns its place.`;

function buildPrompt(data: ReportInput): string {
  return `${systemPrompt}

Generate a weekly product update in FOUR formats based on this data:

METRICS THIS WEEK:
${data.metrics}

WHAT SHIPPED:
${data.shipped}

USER FEEDBACK / NPS COMMENTS:
${data.feedback || "(none provided)"}

RISKS / WHAT DIDN'T SHIP:
${data.risks || "(none provided)"}

PM'S RECOMMENDATION FOR NEXT WEEK:
${data.recommendation || "(none provided)"}

Generate all 4 formats. Respond with ONLY this JSON structure (no markdown wrapping):

{
  "slack": "Slack message — <=300 chars, use emoji, scannable, action-oriented. One line per topic with an emoji bullet.",
  "ceo": "CEO update — 2 confident paragraphs. Para 1: what happened and what it means strategically. Para 2: what you recommend and why. Specific numbers. No hedging.",
  "board": "Board slide bullets — exactly 5 bullets, crisp. Format: '• Metric/topic: number (trend) — one insight'. Prioritize business impact.",
  "standup": "Engineering standup — structured as 'Last week:' (bullet list) and 'This week focus:' (bullet list). Technical and specific. Include relevant metrics and deployment notes."
}

Important rules:
- Use the ACTUAL NUMBERS from the metrics.
- Quote user feedback where it adds credibility.
- Be direct about risks — don't soften them.
- The recommendation should be specific, not generic.
- Each format should feel written FOR that audience, not adapted.`;
}

function coerceReport(parsed: unknown): Report {
  const p = (parsed ?? {}) as Record<string, unknown>;
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  return {
    slack: s(p.slack),
    ceo: s(p.ceo),
    board: s(p.board),
    standup: s(p.standup),
  };
}

export async function POST(req: NextRequest) {
  let body: Partial<ReportInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const input: ReportInput = {
    metrics: body.metrics ?? "",
    shipped: body.shipped ?? "",
    feedback: body.feedback ?? "",
    risks: body.risks ?? "",
    recommendation: body.recommendation ?? "",
  };

  if (!input.metrics.trim() || !input.shipped.trim()) {
    return NextResponse.json(
      { error: "Key Metrics and What Shipped are required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // No key configured → deterministic demo so the product still works.
  if (!apiKey) {
    return NextResponse.json({ report: buildDemoReport(input), source: "demo" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: { responseMimeType: "application/json", temperature: 0.6 },
    });

    const result = await model.generateContent(buildPrompt(input));
    const text = result.response.text().trim();
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const report = coerceReport(JSON.parse(cleaned));
    if (!report.slack && !report.ceo && !report.board && !report.standup) {
      throw new Error("Empty model response");
    }
    return NextResponse.json({ report, source: "gemini" });
  } catch (err) {
    // Never fail the demo: fall back to the deterministic report.
    console.error("Gemini generation error, using demo fallback:", err);
    return NextResponse.json({ report: buildDemoReport(input), source: "demo" });
  }
}
