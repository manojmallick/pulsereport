type Block =
  | { type: "bullet"; text: string }
  | { type: "header"; text: string }
  | { type: "para"; text: string };

/** Split one long prose paragraph into ~2 at the sentence boundary nearest its middle.
 *  Sentence breaks only at ". " before a capital/quote, so decimals (3.4%) stay intact. */
function splitLongPara(text: string, limit = 340): string[] {
  if (text.length <= limit) return [text];
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z"'])/);
  if (sentences.length < 2) return [text];
  const cum: number[] = [];
  let acc = 0;
  for (const s of sentences) {
    acc += s.length + 1;
    cum.push(acc);
  }
  const mid = text.length / 2;
  let best = 0;
  let bestDiff = Infinity;
  for (let i = 0; i < cum.length - 1; i++) {
    const diff = Math.abs(cum[i] - mid);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  const p1 = sentences.slice(0, best + 1).join(" ").trim();
  const p2 = sentences.slice(best + 1).join(" ").trim();
  return [p1, p2].filter(Boolean);
}

/**
 * Turns a raw format string into readable, spaced blocks — styled bullets,
 * bold sub-headers ("Last week:"), and spaced paragraphs. Defensive against
 * run-on model output (missing line breaks, missing spaces, glued paragraphs).
 */
function parse(raw: string): Block[] {
  let t = (raw || "").replace(/\r/g, "");
  // Repair "trajectory.To" -> "trajectory. To" (missing space after a sentence)
  t = t.replace(/([a-z0-9%)"'’])\.([A-Z])/g, "$1. $2");
  // Break run-on bullets:  "...done.• Next"  ->  newline before each "•"
  t = t.replace(/([^\n])\s*•\s+/g, "$1\n• ");
  // Put standup / common section headers on their own line
  t = t.replace(/([.:!?"])\s*(Last week:|This week(?: focus)?:|Wins:|Blockers:|Next:)/gi, "$1\n$2");

  const out: Block[] = [];
  for (let line of t.split("\n")) {
    line = line.trim();
    if (!line) continue;
    const bullet = line.match(/^[•\-*]\s*(.*)$/);
    if (bullet) {
      out.push({ type: "bullet", text: bullet[1] });
    } else if (/:$/.test(line) && line.length <= 42) {
      out.push({ type: "header", text: line });
    } else {
      // Long prose with no breaks → split into readable paragraphs.
      for (const part of splitLongPara(line)) out.push({ type: "para", text: part });
    }
  }
  return out;
}

export function ReportBody({ text, className = "" }: { text: string; className?: string }) {
  const blocks = parse(text);
  return (
    <div className={`text-[14px] leading-relaxed text-on-surface ${className}`}>
      {blocks.map((b, i) => {
        if (b.type === "bullet") {
          return (
            <div key={i} className="flex gap-2.5 mb-2 last:mb-0">
              <span className="text-secondary-container select-none mt-[2px] leading-none">●</span>
              <span className="flex-grow">{b.text}</span>
            </div>
          );
        }
        if (b.type === "header") {
          return (
            <p key={i} className="font-semibold text-primary uppercase tracking-wide text-[12px] mt-4 mb-2 first:mt-0">
              {b.text}
            </p>
          );
        }
        return (
          <p key={i} className="mb-3 last:mb-0">
            {b.text}
          </p>
        );
      })}
    </div>
  );
}
