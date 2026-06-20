import type { SpaceMoodId } from "@/lib/bloom-space-moods";

/** Cover typography from bloombaymemberui — poster vs editorial vs envelope. */
export type PlaceCoverTone = "poster" | "editorial" | "envelope";

export function placeCoverToneFor(moodId: SpaceMoodId): PlaceCoverTone {
  switch (moodId) {
    case "happenings":
    case "tonight":
    case "room":
    case "club-night":
    case "club-founders":
      return "envelope";
    case "home":
    case "lounge":
    case "explore":
    case "connect":
    case "club-museum":
    case "club-dinner":
    case "club-books":
    case "club-wellness":
    case "club-default":
      return "editorial";
    default:
      return "poster";
  }
}
