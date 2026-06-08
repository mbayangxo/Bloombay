/** Mood filters — drives discovery ranking (no AI). */

export type DiscoveryMoodId =
  | "creative"
  | "chill"
  | "get-out"
  | "connect"
  | "restore"
  | "explore";

export type DiscoveryMood = {
  id: DiscoveryMoodId;
  label: string;
  emoji: string;
  /** Tags boosted when this mood is active */
  tags: string[];
};

export const DISCOVERY_MOODS: DiscoveryMood[] = [
  { id: "creative", label: "Creative", emoji: "🎨", tags: ["arts", "culture", "collab", "workshop"] },
  { id: "chill", label: "Chill", emoji: "☕", tags: ["cafe", "solo", "soft", "homebody"] },
  { id: "get-out", label: "Get out", emoji: "✨", tags: ["social", "irl", "seat", "gathering", "tonight"] },
  { id: "connect", label: "Introductions", emoji: "💗", tags: ["connect", "1-on-1", "deep", "bloom"] },
  { id: "restore", label: "Restore", emoji: "🧘🏾‍♀️", tags: ["wellness", "restore", "healing", "solo"] },
  { id: "explore", label: "Explore", emoji: "🌍", tags: ["new-city", "culture", "gem", "guide"] },
];

export function moodById(id: DiscoveryMoodId | null): DiscoveryMood | null {
  if (!id) return null;
  return DISCOVERY_MOODS.find((m) => m.id === id) ?? null;
}
