/** Every moment is anchored — café, place, or feeling in the city. */

export type CityMomentTieKind = "cafe" | "place" | "feeling";

export type CityMomentTie = {
  kind: CityMomentTieKind;
  /** Café name, place name, or feeling label */
  label: string;
  neighborhood?: string;
  /** For feelings: optional “while at” café or spot */
  at?: string;
};

export const CITY_MOMENT_FEELINGS = [
  "Slow morning",
  "Golden hour",
  "Table for one",
  "Soft reset",
  "Main character energy",
  "Safe after dark",
  "Girls night energy",
] as const;

const TIE_META: Record<
  CityMomentTieKind,
  { emoji: string; noun: string; defaultHref: string }
> = {
  cafe: { emoji: "☕", noun: "Café", defaultHref: "/member/eats" },
  place: { emoji: "📍", noun: "Place", defaultHref: "/member/maps#pins" },
  feeling: { emoji: "✨", noun: "Feeling", defaultHref: "/member/explore#solo" },
};

export function tieMeta(kind: CityMomentTieKind) {
  return TIE_META[kind];
}

export function tieHeadline(tie: CityMomentTie): string {
  const { emoji, noun } = TIE_META[tie.kind];
  if (tie.kind === "feeling" && tie.at) {
    return `${emoji} ${noun} · ${tie.label} at ${tie.at}`;
  }
  return `${emoji} ${noun} · ${tie.label}`;
}

export function tieHref(tie: CityMomentTie): string {
  return TIE_META[tie.kind].defaultHref;
}

export function tiePlaceLine(tie: CityMomentTie, fallbackPlace: string): string {
  if (tie.kind === "feeling") {
    return tie.at ? `${tie.at}${tie.neighborhood ? ` · ${tie.neighborhood}` : ""}` : tie.label;
  }
  return fallbackPlace || tie.label;
}
