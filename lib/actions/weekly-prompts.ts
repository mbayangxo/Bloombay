"use server";

import { createClient } from "@/lib/supabase/server";

export interface WeeklyPrompt {
  id: string;
  category: string;
  prompt_text: string;
  week_number: number;
}

const CATEGORY_META: Record<string, { icon: string; color: string; label: string }> = {
  fashion:     { icon: "👗", color: "#FF1F7D", label: "Fashion" },
  travel:      { icon: "✈️", color: "#7C3AED", label: "Travel" },
  career:      { icon: "💼", color: "#F59E0B", label: "Career" },
  wellness:    { icon: "🌿", color: "#10B981", label: "Wellness" },
  friendships: { icon: "🤝", color: "#EC4899", label: "Friendships" },
  city:        { icon: "🗽", color: "#3B82F6", label: "City" },
};

export { CATEGORY_META };

export async function getCurrentWeekPrompts(): Promise<WeeklyPrompt[]> {
  const supabase = await createClient();

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
  const weekNumber = Math.floor(dayOfYear / 7) + 1;
  const week = ((weekNumber - 1) % 8) + 1;

  const { data } = await supabase
    .from("weekly_prompts")
    .select("id, category, prompt_text, week_number")
    .eq("week_number", week)
    .order("category");

  return (data ?? []) as WeeklyPrompt[];
}
