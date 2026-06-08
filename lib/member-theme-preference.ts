/**
 * Appearance — auto (time-based), day, or night.
 */

export type ThemePreference = "auto" | "day" | "night";

const KEY = "bb_theme_preference";

export function readThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "auto";
  const v = localStorage.getItem(KEY);
  if (v === "day" || v === "night" || v === "auto") return v;
  return "auto";
}

export function writeThemePreference(pref: ThemePreference) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, pref);
  window.dispatchEvent(new CustomEvent("bb-theme-preference-updated"));
}

export async function syncThemePreferenceFromServer(): Promise<ThemePreference | null> {
  try {
    const res = await fetch("/api/member/preferences");
    if (!res.ok) return null;
    const json = (await res.json()) as { themePreference?: ThemePreference };
    if (json.themePreference) {
      writeThemePreference(json.themePreference);
      return json.themePreference;
    }
  } catch {
    /* offline */
  }
  return null;
}

export async function persistThemePreference(pref: ThemePreference): Promise<boolean> {
  writeThemePreference(pref);
  try {
    const res = await fetch("/api/member/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themePreference: pref }),
    });
    const json = (await res.json()) as { ok?: boolean };
    return Boolean(json.ok);
  } catch {
    return false;
  }
}

/** Whether night palette should apply (respects manual override). */
export function shouldUseNightPalette(date = new Date()): boolean {
  const pref = readThemePreference();
  if (pref === "night") return true;
  if (pref === "day") return false;
  const h = date.getHours();
  return h >= 20 || h < 6;
}
