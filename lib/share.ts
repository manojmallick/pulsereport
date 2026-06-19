import LZString from "lz-string";
import type { Report } from "./types";

/**
 * Stateless sharing: the whole report is compressed into the URL itself
 * (~230 chars), so a shared link works with no database and no account —
 * forward it to a CEO and they see the report instantly.
 */
export function encodeReport(report: Report): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(report));
}

export function decodeReport(data: string | null | undefined): Report | null {
  if (!data) return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(data);
    if (!json) return null;
    const o = JSON.parse(json) as Partial<Report>;
    if (o && typeof o.slack === "string" && typeof o.ceo === "string") {
      return { slack: o.slack, ceo: o.ceo, board: o.board || "", standup: o.standup || "" };
    }
    return null;
  } catch {
    return null;
  }
}
