# PulseReport — Record & Submit Kit

Everything is built, deployed, and verified. The **only** thing left is recording the
video and pasting these answers into Devpost. Work top to bottom.

- **Live:** https://pulsereport-tan.vercel.app
- **Judge demo:** https://pulsereport-tan.vercel.app/generate?demo=1
- **Repo:** https://github.com/manojmallick/pulsereport
- **Deadline:** June 20, 2026 · 5:00 PM GMT

✅ Verified green: all 7 routes 200 · live Gemini (~6s, all 4 formats) · Judge Mode ·
shareable links (stateless) · Novus events firing (`report_generated`, `format_switched`,
`format_copied`, `report_shared`, `shared_report_viewed`) delivering to `data.pendo.io` ·
mobile no-overflow.

---

## 1) Record the video (90 seconds) — do this first

Screen-record (QuickTime: File → New Screen Recording) → upload **Unlisted** to YouTube →
paste the URL into Devpost's "Video demo link".

**Teleprompter (read at a natural pace ≈ 90s):**

> **[0:00 — your calendar, Monday 9am]**
> "It's Monday morning. Three meetings, two Slack threads, all asking the same thing: a quick update on last week. Every product manager knows this. You write it once… then rewrite it for the CEO. Again for the board. Again for engineering. Three hours, every single week."
>
> **[0:14 — open pulsereport-tan.vercel.app/generate?demo=1]**
> "This is PulseReport. You paste your week once — your metrics, what shipped, the feedback."
>
> **[0:22 — click Generate, the amber pulse line runs]**
> "And in about six seconds…"
>
> **[0:30 — click through the four tabs]**
> "…it writes your update for every audience. A scannable Slack post. A strategic email for the CEO — specific numbers, no fluff. Five crisp board bullets. And a technical engineering standup. Each one written *for* that reader — not a template with the words swapped."
>
> **[0:55 — click Compare all 4, then Share link]**
> "Here they are side by side. And 'Share link' gives me a URL I can forward straight to my CEO — they open it instantly, no login."
>
> **[1:08 — your Novus dashboard with live events]**
> "It's also instrumented with Novus. So I can see which format PMs actually copy first — that's real product thinking, measured, not guessed."
>
> **[1:20 — landing page / pulse line]**
> "Notion and Linear tell you *what* happened. PulseReport turns it into the story — for everyone who needs it. Everyone Ships Now. PMs ship their weekly update in sixty seconds."

---

## 2) Devpost — Project overview

| Field | Paste |
|---|---|
| **Project name** | `PulseReport` |
| **Elevator pitch** (≤200) | `Paste your week once; PulseReport writes your product update in 4 formats—Slack, CEO email, board slide, eng standup—in 60 seconds. Powered by Gemini + Novus.ai. #EveryoneShipsNow` |
| **Thumbnail** | upload `thumbnail.png` |

## 3) Devpost — Project details

**Built with** (tags): `next.js, react, typescript, tailwind, google-gemini, pendo, vercel, node.js`

**"Try it out" links:**
- `https://pulsereport-tan.vercel.app`
- `https://github.com/manojmallick/pulsereport`

**Image gallery** (upload in this order — first becomes the card preview):
1. `shot-2-generate.png` — Judge Mode + live output (lead image)
2. `shot-3-compare.png` — all four formats side by side
3. `shot-1-landing.png` — landing / hero
4. `novus-proof-1.png` — **Novus dashboard with live events (required proof)**

**Project story:** paste the body of [`DEVPOST.md`](DEVPOST.md) (Inspiration → What it does →
How we built it → Judge Mode → Novus story → Challenges → What's next → Impact).

## 4) Devpost — Additional info (judges/organizers)

| Field | Answer |
|---|---|
| Meet all eligibility criteria? | `Yes. Built during the hackathon period, publicly deployed on Vercel, Novus.ai installed and actively tracking. Meets all eligibility criteria.` |
| When did you begin? | `June 10, 2026` |
| Likely to use moving forward? | Select **the most positive option** (Very/Extremely likely) |
| How will this advance your skills? (≤250) | `PulseReport turns ~3 hrs/week of rewriting the same product update for different audiences into 60 seconds. Building it sharpened my Next.js 15, Gemini API, and product-analytics (Novus.ai) skills — a reusable pattern for multi-audience AI tools.` |
| Public URL | `https://pulsereport-tan.vercel.app` |
| Novus.ai proof URL | `https://novus.pendo.io/admin/subscription` |
| ☑ Uploaded Novus screenshot to carousel | tick it (you've added `novus-proof-1.png`) |
| Video demo link | *(paste your YouTube URL from step 1)* |

---

## 5) Before you submit — drive REAL Novus numbers (highest-leverage)

Post this so visitors' events land in your dashboard; then cite the **actual**
`format_copied` counts in your story (replaces any predicted stat):

> Every Monday, PMs write the same update — then rewrite it for the CEO, the board, and
> engineering standup. ~3 hours, every week.
>
> So I built **PulseReport** for Mind the Product's *Everyone Ships Now*: paste your week
> once → all four formats in ~60 seconds.
>
> 60-second try (no login, sample pre-loaded): https://pulsereport-tan.vercel.app/generate?demo=1
>
> Which format would *you* reach for first? Curious what fellow PMs pick 👇 #EveryoneShipsNow

---

## 6) Final submit checklist
- [ ] Video recorded + uploaded (Unlisted) + URL pasted
- [ ] Project overview saved (name, pitch, thumbnail)
- [ ] Built-with + Try-it-out links + gallery (incl. Novus proof) saved
- [ ] Project story pasted
- [ ] Additional info complete + Novus checkbox ticked
- [ ] Outreach post live; real Novus numbers cited
- [ ] **Submit** before June 20, 5:00 PM GMT
