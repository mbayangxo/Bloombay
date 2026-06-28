export interface PlanRoom {
  id: number;
  name: string;
  emoji: string;
  bg: string;
  accent: string;
  unread: number;
  members: number;
  date: string;
  venue?: string;
  time?: string;
  eventId?: number;
  poster?: string;
}

export interface DayContent {
  text: string;
  stickers: string[];
  photos: string[];
  voiceCount: number;
}

export type View         = "list" | "room";
export type NewPlanStep  = "choose" | "room" | "bloomie" | "club";
export type DayEditorTab = "write" | "sticker" | "photo" | "voice";

export interface ConfirmationSummary {
  id: string;
  type: "gathering" | "event";
  title: string;
  venue: string | null;
  starts_at: string;
  confirmation_code: string;
  confirmed_at: string | null;
}
