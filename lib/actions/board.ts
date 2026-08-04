"use server";

import { createClient } from "@/lib/supabase/server";

export interface BoardPost {
  id: string;
  user_id: string;
  kind: "text" | "link" | "photo" | "voice";
  body: string | null;
  link_url: string | null;
  image_url: string | null;
  voice_url: string | null;
  created_at: string;
}

export async function getBoardPosts(userId: string): Promise<BoardPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("board_posts")
    .select("id, user_id, kind, body, link_url, image_url, voice_url, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(60);
  return (data ?? []) as BoardPost[];
}

export async function addBoardPost(input: {
  kind: "text" | "link" | "photo" | "voice";
  body?: string;
  link_url?: string;
  image_url?: string;
  voice_url?: string;
}): Promise<{ post: BoardPost | null; error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { post: null, error: "Sign in to continue." };

  const { data, error } = await supabase
    .from("board_posts")
    .insert({
      user_id: user.id,
      kind: input.kind,
      body: input.body?.trim() || null,
      link_url: input.link_url?.trim() || null,
      image_url: input.image_url ?? null,
      voice_url: input.voice_url ?? null,
    })
    .select("id, user_id, kind, body, link_url, image_url, voice_url, created_at")
    .single();

  if (error) return { post: null, error: error.message };
  return { post: data as BoardPost, error: null };
}

export async function deleteBoardPost(postId: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  await supabase.from("board_posts").delete().eq("id", postId).eq("user_id", user.id);
  return { ok: true };
}
