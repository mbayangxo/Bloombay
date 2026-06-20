/** Text-based club logo templates until custom PNG templates are uploaded. */

export type ClubLogoTemplateId = "seal" | "wordmark" | "monogram";

export const CLUB_LOGO_TEMPLATES: {
  id: ClubLogoTemplateId;
  label: string;
  description: string;
}[] = [
  { id: "seal", label: "Classic seal", description: "Round stamp with your club words" },
  { id: "monogram", label: "Monogram", description: "Initials in a crest circle" },
  { id: "wordmark", label: "Wordmark", description: "Simple text lockup" },
];

export function initialsFromText(text: string, max = 2): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "CL";
  if (words.length === 1) return words[0].slice(0, max).toUpperCase();
  return words
    .slice(0, max)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
