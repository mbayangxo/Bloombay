/** BloomBay artifact kinds — physical objects, not generic cards. */

export type BloomArtifactKind =
  | "club"
  | "invitation"
  | "event-poster"
  | "ticket"
  | "notice"
  | "bloom-request"
  | "postcard"
  | "wall-note";

export type WallNoteVariant = "pink" | "yellow" | "ivory";

const PARTY_WORDS = ["party", "festival", "pop-up", "popup", "night", "rooftop", "dj", "club night"];
const DINNER_WORDS = ["dinner", "celebration", "brunch", "table", "hosted", "intimate", "gathering"];
const ANNOUNCE_WORDS = ["announcement", "notice", "schedule", "launch", "update", "policy"];

export function wallVariantFromTopic(topic: string): WallNoteVariant {
  const t = topic.toLowerCase();
  if (t.includes("wellness") || t.includes("style")) return "yellow";
  if (t.includes("bloom") || t.includes("event") || t.includes("gathering")) return "pink";
  return "ivory";
}

/** Infer artifact from free-text labels (tabs, tags, titles). */
export function artifactKindFromContent(input: {
  kind?: string;
  title?: string;
  tags?: string[];
}): BloomArtifactKind {
  const blob = [input.kind, input.title, ...(input.tags ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (blob.includes("club") && !blob.includes("club night")) return "club";
  if (blob.includes("wall")) return "wall-note";
  if (blob.includes("bloom request") || blob.includes("bloom-request") || blob.includes("wants to bloom"))
    return "bloom-request";
  if (blob.includes("ticket") || blob.includes("reserved") || blob.includes("seat saved") || blob.includes("rsvp"))
    return "ticket";
  if (blob.includes("recap") || blob.includes("memory") || blob.includes("polaroid") || blob.includes("postcard"))
    return "postcard";
  if (ANNOUNCE_WORDS.some((w) => blob.includes(w))) return "notice";
  if (PARTY_WORDS.some((w) => blob.includes(w))) return "event-poster";
  if (DINNER_WORDS.some((w) => blob.includes(w))) return "invitation";

  if (input.kind === "club") return "club";
  if (input.kind === "seat") return "ticket";
  if (input.kind === "connect") return "bloom-request";
  if (input.kind === "happening" || input.kind === "partner" || input.kind === "gem")
    return "event-poster";

  return "event-poster";
}

export function splitTitleHighlight(title: string): { lead: string; highlight: string } {
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return { lead: title, highlight: "" };
  const highlight = words.pop() ?? "";
  return { lead: words.join(" "), highlight };
}

export function formatDateBadge(when: string): string {
  const month = when.match(
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*(\d{1,2})?/i
  );
  if (month) {
    const m = month[1].slice(0, 3).toUpperCase();
    const d = month[2] ? ` ${month[2]}` : "";
    return `${m}${d}`;
  }
  if (/today/i.test(when)) return "TODAY";
  if (/tonight/i.test(when)) return "TONIGHT";
  return when.slice(0, 12).toUpperCase();
}
