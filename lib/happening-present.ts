/** Rich happening presentation — event detail scrapbook layer. */

export type HappeningPresent = {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  tags: string[];
  vibeNote: string;
  vibeFull?: string;
  curatedLine: string;
  pinnedNote: string;
  scrapQuote: string;
  trustLine: string;
  seatLabel: string;
  sectionLabel: string;
  includes: string[];
  experienceFee: number;
  venueFee: number;
};

export function getHappeningPresent(
  eventId: string,
  fallback: {
    title: string;
    subtitle: string;
    deposit: number;
    ticket: number;
    minSpend: number;
    neighborhood: string;
    table: string;
    attendees?: string[];
    extra?: number;
  }
): HappeningPresent {
  const tableSize = (fallback.attendees?.length ?? 0) + (fallback.extra ?? 0);
  const trustLine =
    tableSize > 0
      ? `${tableSize} women already at the table — curated by BloomBay hosts`
      : "Curated table — real RSVPs, no fake scores";

  if (eventId === "g1" || fallback.title.toLowerCase().includes("soho")) {
    return {
      eyebrow: "HAPPENING · DINNER PARTY",
      title: "SATURDAY IN",
      titleAccent: "SOHO",
      subtitle:
        "An intimate dinner party for women who romanticize their lives and their friendships.",
      tags: ["Dinner Party", "Downtown", "Women Only", "21+"],
      vibeNote: "Intimate dinner. Real conversation. Soft glam welcome.",
      vibeFull:
        "Candlelight, curated tables, and women who actually show up. You'll leave with new Bloomies and a camera roll worth keeping.",
      curatedLine: "Curated by BloomBay",
      pinnedNote: "Intimate dinner. Real conversation.",
      scrapQuote: "You're not just reserving a seat. You're saying yes to a night you'll remember.",
      trustLine,
      seatLabel: fallback.table === "—" ? "07" : fallback.table,
      sectionLabel: "MAIN TABLE",
      includes: [
        "Welcome cocktail on arrival",
        "Three-course dinner at the table",
        "BloomBay host at your table all night",
        "Post-dinner walk if the city is still awake",
      ],
      experienceFee: 15,
      venueFee: fallback.minSpend > 0 ? 40 : 0,
    };
  }

  return {
    eyebrow: "HAPPENING · BLOOMBAY",
    title: fallback.title.toUpperCase(),
    subtitle: fallback.subtitle,
    tags: [fallback.neighborhood, "Women Only"],
    vibeNote: fallback.subtitle,
    curatedLine: "Curated by BloomBay",
    pinnedNote: fallback.subtitle,
    scrapQuote: "Say yes to the table — your Plan Room opens after you RSVP.",
    trustLine,
    seatLabel: fallback.table === "—" ? "A7" : fallback.table,
    sectionLabel: "TABLE",
    includes: ["Seat at the gathering", "Host check-in QR", "Plan Room access after RSVP"],
    experienceFee: 0,
    venueFee: 0,
  };
}
