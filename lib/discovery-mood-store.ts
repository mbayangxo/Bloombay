import type { DiscoveryMoodId } from "@/lib/discovery-mood";
import { allowDemoFallback, isTruthfulMode } from "@/lib/truth/config";
import { truthSetMood } from "@/lib/truth/client";

const KEY = "bb_discovery_mood";

export function getDiscoveryMood(): DiscoveryMoodId | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  return raw as DiscoveryMoodId;
}

export async function setDiscoveryMood(mood: DiscoveryMoodId | null) {
  if (typeof window === "undefined") return;

  const result = await truthSetMood(mood);
  if (!result.ok && isTruthfulMode() && !allowDemoFallback()) {
    throw new Error(result.error ?? "Could not save mood");
  }

  if (mood) localStorage.setItem(KEY, mood);
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("bb-discovery-updated"));
}

/** Hydrate mood from Supabase on app load */
export async function hydrateDiscoveryMood() {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch("/api/member/preferences");
    if (!res.ok) return;
    const json = (await res.json()) as { discoveryMood?: string | null };
    if (json.discoveryMood) {
      localStorage.setItem(KEY, json.discoveryMood);
      window.dispatchEvent(new CustomEvent("bb-discovery-updated"));
    }
  } catch {
    /* offline */
  }
}
