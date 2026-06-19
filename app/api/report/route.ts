import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { Report, ReportInput } from "@/lib/types";
import { buildDemoReport } from "@/lib/demoReport";

export const runtime = "nodejs";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Structured output. Without an explicit schema, gemini-2.5-flash "front-loads"
// the slack/ceo fields and returns near-empty board/standup. Declaring all four
// as required, described fields forces it to populate every format.
const RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    slack: { type: SchemaType.STRING, description: "Slack message, <=300 chars, emoji, scannable, action-first" },
    ceo: { type: SchemaType.STRING, description: "CEO email, two full strategic paragraphs with specific numbers" },
    board: { type: SchemaType.STRING, description: "Exactly 5 crisp board bullets, each on its own line starting with a bullet" },
    standup: { type: SchemaType.STRING, description: "Engineering standup: a 'Last week:' bullet list then a 'This week focus:' bullet list" },
  },
  required: ["slack", "ceo", "board", "standup"],
};

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
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.6,
        maxOutputTokens: 4096,
      },
    });

    const result = await model.generateContent(buildPrompt(input));
    const text = result.response.text().trim();
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const g = coerceReport(JSON.parse(cleaned));
    if (!g.slack && !g.ceo && !g.board && !g.standup) {
      throw new Error("Empty model response");
    }

    // Belt-and-suspenders: if the model ever drops a field, fill it from the
    // deterministic demo so no output tab is ever blank.
    const demo = buildDemoReport(input);
    const report: Report = {
      slack: g.slack || demo.slack,
      ceo: g.ceo || demo.ceo,
      board: g.board || demo.board,
      standup: g.standup || demo.standup,
    };
    return NextResponse.json({ report, source: "gemini" });
  } catch (err) {
    // Never fail the demo: fall back to the deterministic report.
    console.error("Gemini generation error, using demo fallback:", err);
    return NextResponse.json({ report: buildDemoReport(input), source: "demo" });
  }
}
