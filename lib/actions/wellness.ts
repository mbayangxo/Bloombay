"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface WellnessPost {
  id: string;
  author_id: string;
  author_name: string | null;
  author_avatar: string | null;
  category: string;
  title: string;
  content: string | null;
  ingredients: string[];
  steps: string[];
  image_url: string | null;
  saves_count: number;
  created_at: string;
}

export interface CreateWellnessInput {
  category: string;
  title: string;
  content?: string;
  ingredients?: string[];
  steps?: string[];
  image_url?: string;
}

export const WELLNESS_CATEGORIES = ["juice", "smoothie", "meal", "tip", "skincare"] as const;

function mapPost(r: {
  id: string; author_id: string; category: string; title: string;
  content: string | null; ingredients: string[]; steps: string[];
  image_url: string | null; saves_count: number; created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}): WellnessPost {
  return {
    id: r.id, author_id: r.author_id, category: r.category, title: r.title,
    content: r.content, ingredients: r.ingredients, steps: r.steps,
    image_url: r.image_url, saves_count: r.saves_count, created_at: r.created_at,
    author_name: r.profiles?.display_name ?? null,
    author_avatar: r.profiles?.avatar_url ?? null,
  };
}

export async function getWellnessPosts(category?: string): Promise<WellnessPost[]> {
  const supabase = await createClient();
  let q = supabase
    .from("wellness_posts")
    .select("*, profiles!author_id(display_name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(60);
  if (category && category !== "all") q = q.eq("category", category);
  const { data } = await q;
  return (data ?? []).map(mapPost);
}

export async function createWellnessPost(input: CreateWellnessInput): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("wellness_posts").insert({
    author_id: user.id,
    category: input.category,
    title: input.title.trim(),
    content: input.content?.trim() ?? null,
    ingredients: input.ingredients ?? [],
    steps: input.steps ?? [],
    image_url: input.image_url ?? null,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/member/lobby/health");
  return { ok: true };
}

export async function saveWellnessPost(postId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("wellness_saves").insert({ post_id: postId, user_id: user.id });
  revalidatePath("/member/lobby/health");
}

export async function unsaveWellnessPost(postId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("wellness_saves").delete().eq("post_id", postId).eq("user_id", user.id);
  revalidatePath("/member/lobby/health");
}

export async function getMySavedWellnessPosts(): Promise<WellnessPost[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: saves } = await supabase
    .from("wellness_saves")
    .select("post_id")
    .eq("user_id", user.id);
  const ids = (saves ?? []).map((r: { post_id: string }) => r.post_id);
  if (ids.length === 0) return [];

  const { data } = await supabase
    .from("wellness_posts")
    .select("*, profiles!author_id(display_name, avatar_url)")
    .in("id", ids)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapPost);
}

export async function getMyWellnessSaveIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("wellness_saves")
    .select("post_id")
    .eq("user_id", user.id);
  return (data ?? []).map((r: { post_id: string }) => r.post_id);
}
