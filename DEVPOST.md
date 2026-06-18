# PulseReport — Devpost submission

> Copy/paste-ready text for the Devpost form. Live links use the deployed alias.

**Tagline:** Your weekly product update. 60 seconds. Every format.

**Live demo:** https://pulsereport-tan.vercel.app
**Judge one-click demo:** https://pulsereport-tan.vercel.app/generate?demo=1
**Repo:** _(add GitHub URL)_

---

## Inspiration

Every product manager writes the same document every Monday: what happened, the
numbers, what shipped, what's at risk. Then they write it again — shorter — for
the CEO. Again, more technical, for engineering standup. Again, as bullets, for
the board. It averages **3.2 hours a week**, every week. Nobody had automated the
*writing* — Notion, Linear, and Amplitude tell you *what* happened; none turn it
into a story for each audience.

## What it does

Paste your week once — metrics, what shipped, user feedback, risks, and a one-line
recommendation — and PulseReport generates your update in **four audience-tuned
formats**, instantly:

- **Slack** — short, scannable, emoji, action-first
- **CEO email** — two strategic paragraphs, specific numbers, no hedging
- **Board slide** — five crisp bullets, business impact first
- **Engineering standup** — last week / this week, deploy notes, metrics

Each format is written *for* its reader, not adapted from a template. A `/compare`
view shows all four side by side with word counts and one-click "Share all".

## How we built it

- **Next.js 15** (App Router) + **React 19** + **TypeScript**, deployed on **Vercel**
- **Google Gemini 2.5 Flash** for generation, prompted by a PM for PMs: specific
  over vague, honest about risks, one clear recommendation, no buzzwords
- **Novus.ai (Pendo)** for product analytics
- A "Financial Brutalism" design system (The Economist / Bloomberg for PMs) with a
  signature animated amber **pulse line**
- A **deterministic demo fallback** so the product works with zero secrets and the
  live demo can never hard-fail

## Judge Mode

No typing on stage: open **`/generate?demo=1`** and PulseReport pre-loads a
realistic PM week and generates all four formats automatically, with a "Judge Mode"
banner.

## What we'll learn from Novus.ai

Five events are instrumented — `report_generated`, `format_copied`,
`format_switched`, `report_shared`, `sample_loaded` — each `report_generated`
tagged with a `judge_mode` flag so demo traffic stays separable from real usage.
The questions this answers: which format do PMs copy first? which section do they
edit most? how long do they read before copying? _(Hypotheses to validate with
live hackathon traffic — not pre-baked numbers.)_

## Challenges

- Translating the Stitch design exports into pixel-faithful, fully interactive React
- Keeping the demo bulletproof (graceful fallback when the model or a key is absent)
- Shipping four genuinely distinct voices from one prompt, with the real numbers

## What's next

Auto-import metrics (Mixpanel/Amplitude) · changelog from Jira/Linear · Slack
auto-post at 9am Monday · week-over-week narrative · team mode aggregating multiple
PMs.

## Impact

~5M product managers globally × ~160 hours/year writing status updates —
PulseReport returns those hours to actual product work.

**At Mind the Product, World Product Day 2026 — Everyone Ships Now. PMs ship their
weekly update in 60 seconds.** `#EveryoneShipsNow`
