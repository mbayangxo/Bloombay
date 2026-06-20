import {
  IG_SLOTS,
  TIKTOK_SLOTS,
  slotFormat,
  slotPlatform,
  type CalendarPost,
  type CalendarSlotId,
  type CreateIdea,
  type CreateTheme,
  type StudioDraft,
} from "./types";

const IDEAS_KEY = "bb_create_ideas";
const POSTS_KEY = "bb_create_calendar_posts";
const STUDIO_KEY = "bb_create_studio_drafts";
const THEMES_KEY = "bb_create_themes";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uid() {
  return `cs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canUseStorage()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function listIdeas(): CreateIdea[] {
  return readJson<CreateIdea[]>(IDEAS_KEY, []);
}

export function saveIdea(idea: Omit<CreateIdea, "id" | "createdAt"> & { id?: string }): CreateIdea {
  const all = listIdeas();
  const entry: CreateIdea = {
    id: idea.id ?? uid(),
    title: idea.title.trim(),
    notes: idea.notes.trim(),
    pinterestUrl: idea.pinterestUrl?.trim() || undefined,
    imageUrl: idea.imageUrl?.trim() || undefined,
    tags: idea.tags.filter(Boolean),
    themeId: idea.themeId?.trim() || undefined,
    createdAt: idea.id ? all.find((i) => i.id === idea.id)?.createdAt ?? new Date().toISOString() : new Date().toISOString(),
  };
  const next = idea.id ? all.map((i) => (i.id === idea.id ? entry : i)) : [entry, ...all];
  writeJson(IDEAS_KEY, next);
  return entry;
}

export function deleteIdea(id: string) {
  writeJson(
    IDEAS_KEY,
    listIdeas().filter((i) => i.id !== id)
  );
}

export function listCalendarPosts(month?: string): CalendarPost[] {
  const all = readJson<CalendarPost[]>(POSTS_KEY, []);
  if (!month) return all;
  return all.filter((p) => p.date.startsWith(month));
}

export function getPost(date: string, slot: CalendarSlotId): CalendarPost | null {
  return listCalendarPosts().find((p) => p.date === date && p.slot === slot) ?? null;
}

export function upsertCalendarPost(
  patch: Partial<CalendarPost> & { date: string; slot: CalendarSlotId }
): CalendarPost {
  const all = listCalendarPosts();
  const existing = all.find((p) => p.date === patch.date && p.slot === patch.slot);
  const entry: CalendarPost = {
    id: existing?.id ?? uid(),
    date: patch.date,
    slot: patch.slot,
    platform: patch.platform ?? slotPlatform(patch.slot),
    format: patch.format ?? slotFormat(patch.slot),
    status: patch.status ?? existing?.status ?? "draft",
    title: patch.title ?? existing?.title ?? "",
    caption: patch.caption ?? existing?.caption ?? "",
    hashtags: patch.hashtags ?? existing?.hashtags ?? [],
    shotList: patch.shotList ?? existing?.shotList ?? [],
    imageUrl: patch.imageUrl ?? existing?.imageUrl,
    ideaId: patch.ideaId ?? existing?.ideaId,
    updatedAt: new Date().toISOString(),
  };
  const next = existing
    ? all.map((p) => (p.id === existing.id ? entry : p))
    : [...all, entry];
  writeJson(POSTS_KEY, next);
  return entry;
}

export function deleteCalendarPost(id: string) {
  writeJson(
    POSTS_KEY,
    listCalendarPosts().filter((p) => p.id !== id)
  );
}

export function ensureDaySlots(date: string) {
  for (const slot of [...IG_SLOTS, ...TIKTOK_SLOTS]) {
    if (!getPost(date, slot)) {
      upsertCalendarPost({ date, slot, status: "draft", title: "", caption: "", hashtags: [], shotList: [] });
    }
  }
}

export function listStudioDrafts(): StudioDraft[] {
  return readJson<StudioDraft[]>(STUDIO_KEY, []);
}

export function saveStudioDraft(
  draft: Omit<StudioDraft, "id" | "createdAt"> & { id?: string }
): StudioDraft {
  const all = listStudioDrafts();
  const entry: StudioDraft = {
    id: draft.id ?? uid(),
    kind: draft.kind,
    title: draft.title,
    body: draft.body,
    excerpt: draft.excerpt,
    hashtags: draft.hashtags,
    posterTemplate: draft.posterTemplate,
    posterTitle: draft.posterTitle,
    posterDate: draft.posterDate,
    posterLocation: draft.posterLocation,
    imageUrl: draft.imageUrl,
    createdAt: draft.id ? all.find((d) => d.id === draft.id)?.createdAt ?? new Date().toISOString() : new Date().toISOString(),
  };
  const next = draft.id ? all.map((d) => (d.id === draft.id ? entry : d)) : [entry, ...all];
  writeJson(STUDIO_KEY, next);
  return entry;
}

export function listThemes(monthAnchor?: string): CreateTheme[] {
  const all = readJson<CreateTheme[]>(THEMES_KEY, []);
  if (!monthAnchor) return all;
  return all.filter((t) => !t.monthAnchor || t.monthAnchor === monthAnchor);
}

export function saveTheme(theme: Omit<CreateTheme, "id" | "createdAt" | "ideaIds"> & { id?: string; ideaIds?: string[] }): CreateTheme {
  const all = listThemes();
  const entry: CreateTheme = {
    id: theme.id ?? uid(),
    label: theme.label.trim(),
    brief: theme.brief.trim(),
    scope: theme.scope,
    weekday: theme.weekday,
    date: theme.date,
    weekIndex: theme.weekIndex,
    monthAnchor: theme.monthAnchor,
    ideaIds: theme.ideaIds ?? all.find((t) => t.id === theme.id)?.ideaIds ?? [],
    createdAt: theme.id ? all.find((t) => t.id === theme.id)?.createdAt ?? new Date().toISOString() : new Date().toISOString(),
  };
  const next = theme.id ? all.map((t) => (t.id === theme.id ? entry : t)) : [entry, ...all];
  writeJson(THEMES_KEY, next);
  return entry;
}

export function deleteTheme(id: string) {
  writeJson(
    THEMES_KEY,
    listThemes().filter((t) => t.id !== id)
  );
}

export function linkIdeaToTheme(themeId: string, ideaId: string) {
  const all = listThemes();
  const next = all.map((t) => {
    if (t.id !== themeId) return t;
    if (t.ideaIds.includes(ideaId)) return t;
    return { ...t, ideaIds: [...t.ideaIds, ideaId] };
  });
  writeJson(THEMES_KEY, next);
}

export function daysInMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    const iso = d.toISOString().slice(0, 10);
    days.push(iso);
    d.setDate(d.getDate() + 1);
  }
  return days;
}
