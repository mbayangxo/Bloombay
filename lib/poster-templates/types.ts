/**
 * BloomBay poster template system — each event picks a designed physical poster type.
 */

export type PosterTemplateType =
  | "dinner"
  | "club"
  | "party"
  | "museum"
  | "walk"
  | "wellness"
  | "grid"
  | "plate"
  | "aperitivo"
  | "brunch_poster"
  | "saturday"
  | "rooftop_poster"
  | "wine_poster"
  | "after_work"
  | "cafe";

export const POSTER_TEMPLATE_TYPES: PosterTemplateType[] = [
  "dinner",
  "club",
  "party",
  "museum",
  "walk",
  "wellness",
  "grid",
  "plate",
  "aperitivo",
  "brunch_poster",
  "saturday",
  "rooftop_poster",
  "wine_poster",
  "after_work",
  "cafe",
];

/** Fields every template accepts (rendered from event / gathering data). */
export type PosterTemplateProps = {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  seatsLeft?: number;
  hostName?: string;
  imageUrl?: string;
  accentColor?: string;
  fontFamily?: string;
  ctaLabel?: string;
  /** Club template — membership scale */
  memberCount?: number;
  href?: string;
  className?: string;
};

/** Event record: template type + poster fields */
export type PosterTemplateData = PosterTemplateProps & {
  id: string;
  template: PosterTemplateType;
};

export function posterTemplateLabel(type: PosterTemplateType): string {
  const labels: Record<PosterTemplateType, string> = {
    dinner:       "Dinner",
    club:         "Club",
    party:        "Party",
    museum:       "Museum",
    walk:         "Walk",
    wellness:     "Wellness",
    grid:         "Grid Poster",
    plate:        "Plate",
    aperitivo:    "Aperitivo",
    brunch_poster: "Sunday Brunch",
    saturday:     "Saturday Night",
    rooftop_poster: "Rooftop",
    wine_poster:  "Wine Club",
    after_work:   "After Work",
    cafe:         "Café",
  };
  return labels[type];
}
