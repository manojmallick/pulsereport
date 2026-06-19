type Block =
  | { type: "bullet"; text: string }
  | { type: "header"; text: string }
  | { type: "para"; text: string };

/**
 * Turns a raw format string into readable, spaced blocks — styled bullets,
 * bold sub-headers ("Last week:"), and spaced paragraphs. Defensive against
 * run-on output (bullets/headers with no line breaks) so it always reads well.
 */
function parse(raw: string): Block[] {
  let t = (raw || "").replace(/\r/g, "");
  // Break run-on bullets:  "...done.• Next item"  ->  newline before each "•"
  t = t.replace(/([^\n])\s*•\s+/g, "$1\n• ");
  // Put standup / common section headers on their own line
  t = t.replace(/([.:!?"])\s*(Last week:|This week(?: focus)?:|Wins:|Blockers:|Next:)/gi, "$1\n$2");
  // Encourage a CEO-email paragraph break before the recommendation
  t = t.replace(/([^\n])\s+(My recommendation|To address this|Looking ahead|Going forward)/g, "$1\n\n$2");

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
      out.push({ type: "para", text: line });
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
