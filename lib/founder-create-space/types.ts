import type { PosterTemplateType } from "@/lib/poster-templates/types";

export type CreatePlatform = "instagram" | "tiktok" | "blog" | "daily_bloom" | "event_poster" | "pinterest";

export type CalendarSlotId =
  | "ig-1"
  | "ig-2"
  | "ig-3"
  | "tiktok-1"
  | "tiktok-2";

export type PostStatus = "idea" | "draft" | "scheduled" | "posted";

export type ThemeScope = "monthly" | "weekly" | "weekday" | "daily";

export type CreateTheme = {
  id: string;
  label: string;
  brief: string;
  scope: ThemeScope;
  /** 0 = Sunday … 6 = Saturday (weekday scope) */
  weekday?: number;
  /** YYYY-MM-DD (daily scope) */
  date?: string;
  /** 1–5 week-of-month (weekly scope); omit = every week in month */
  weekIndex?: number;
  /** YYYY-MM — monthly / weekly themes anchor to this month */
  monthAnchor?: string;
  ideaIds: string[];
  createdAt: string;
};

export type CreateIdea = {
  id: string;
  title: string;
  notes: string;
  pinterestUrl?: string;
  imageUrl?: string;
  tags: string[];
  themeId?: string;
  createdAt: string;
};

export type IdeaVariant = {
  title: string;
  notes: string;
  hook: string;
  indoor: boolean;
};

export type CalendarPost = {
  id: string;
  date: string;
  slot: CalendarSlotId;
  platform: "instagram" | "tiktok";
  format: "feed" | "carousel" | "reel" | "story" | "tiktok";
  status: PostStatus;
  title: string;
  caption: string;
  hashtags: string[];
  shotList: string[];
  imageUrl?: string;
  ideaId?: string;
  updatedAt: string;
};

export type StudioDraft = {
  id: string;
  kind: "blog" | "daily_bloom" | "event_poster" | "magazine";
  title: string;
  body: string;
  excerpt?: string;
  hashtags: string[];
  posterTemplate?: PosterTemplateType;
  posterTitle?: string;
  posterDate?: string;
  posterLocation?: string;
  imageUrl?: string;
  createdAt: string;
};

export type GenerateKind =
  | "instagram"
  | "tiktok"
  | "blog"
  | "daily_bloom"
  | "event_poster"
  | "magazine"
  | "idea_variants"
  | "month_outline";

export const IG_SLOTS: CalendarSlotId[] = ["ig-1", "ig-2", "ig-3"];
export const TIKTOK_SLOTS: CalendarSlotId[] = ["tiktok-1", "tiktok-2"];

export const SLOT_LABELS: Record<CalendarSlotId, string> = {
  "ig-1": "IG · Feed / hero",
  "ig-2": "IG · Carousel / story",
  "ig-3": "IG · Reel / CTA",
  "tiktok-1": "TikTok · Hook + motion",
  "tiktok-2": "TikTok · GIF / trend",
};

export function slotFormat(slot: CalendarSlotId): CalendarPost["format"] {
  if (slot === "ig-1") return "feed";
  if (slot === "ig-2") return "carousel";
  if (slot === "ig-3") return "reel";
  return "tiktok";
}

export function slotPlatform(slot: CalendarSlotId): CalendarPost["platform"] {
  return slot.startsWith("ig") ? "instagram" : "tiktok";
}
