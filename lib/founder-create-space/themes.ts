import type { CreateIdea, CreateTheme, ThemeScope } from "./types";

export const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export function weekOfMonth(dateIso: string): number {
  const d = new Date(`${dateIso}T12:00:00`);
  return Math.ceil(d.getDate() / 7);
}

export function monthAnchor(dateIso: string): string {
  return dateIso.slice(0, 7);
}

export type ResolvedThemes = {
  monthly: CreateTheme | null;
  weekly: CreateTheme | null;
  weekday: CreateTheme | null;
  daily: CreateTheme | null;
  layers: CreateTheme[];
  combinedBrief: string;
  label: string;
};

function themeApplies(theme: CreateTheme, dateIso: string): boolean {
  const anchor = monthAnchor(dateIso);
  if (theme.monthAnchor && theme.monthAnchor !== anchor) return false;

  if (theme.scope === "daily") return theme.date === dateIso;

  if (theme.scope === "weekday") {
    const dow = new Date(`${dateIso}T12:00:00`).getDay();
    return theme.weekday === dow;
  }

  if (theme.scope === "weekly") {
    const wom = weekOfMonth(dateIso);
    if (theme.weekIndex != null && theme.weekIndex !== wom) return false;
    return true;
  }

  if (theme.scope === "monthly") return !theme.monthAnchor || theme.monthAnchor === anchor;

  return false;
}

export function resolveThemesForDate(themes: CreateTheme[], dateIso: string, fallbackBrief = ""): ResolvedThemes {
  const monthly = themes.find((t) => t.scope === "monthly" && themeApplies(t, dateIso)) ?? null;
  const weekly = themes.find((t) => t.scope === "weekly" && themeApplies(t, dateIso)) ?? null;
  const weekday = themes.find((t) => t.scope === "weekday" && themeApplies(t, dateIso)) ?? null;
  const daily = themes.find((t) => t.scope === "daily" && themeApplies(t, dateIso)) ?? null;

  const layers = [monthly, weekly, weekday, daily].filter(Boolean) as CreateTheme[];
  const parts = layers.map((t) => t.brief.trim()).filter(Boolean);
  const combinedBrief = parts.length ? parts.join(" · ") : fallbackBrief.trim();

  const label = layers.length
    ? layers.map((t) => `${scopeLabel(t.scope)}: ${t.label}`).join(" → ")
    : fallbackBrief.trim() || "No theme set";

  return { monthly, weekly, weekday, daily, layers, combinedBrief, label };
}

export function scopeLabel(scope: ThemeScope): string {
  if (scope === "monthly") return "Month";
  if (scope === "weekly") return "Week";
  if (scope === "weekday") return "Recurring";
  return "Day";
}

export function ideasForThemes(ideas: CreateIdea[], themeIds: string[]): CreateIdea[] {
  if (!themeIds.length) return [];
  const set = new Set(themeIds);
  return ideas.filter((i) => i.themeId && set.has(i.themeId));
}

export function linkedIdeasForDate(
  themes: CreateTheme[],
  ideas: CreateIdea[],
  dateIso: string
): CreateIdea[] {
  const { layers } = resolveThemesForDate(themes, dateIso);
  const ids = layers.flatMap((t) => t.ideaIds);
  return ideasForThemes(ideas, ids);
}
