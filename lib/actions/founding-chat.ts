"use server";

import { createClient } from "@/lib/supabase/server";

export interface ChatMessage {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
  sender_name: string | null;
  sender_initial: string;
  is_me?: boolean;
}

export async function getFoundingChatMessages(limit = 80): Promise<ChatMessage[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("founding_chat_messages")
    .select("id, sender_id, body, created_at, profiles!sender_id(first_name, full_name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((m: Record<string, unknown>) => {
    const profile = m.profiles as { first_name?: string; full_name?: string } | null;
    const name = profile?.full_name ?? profile?.first_name ?? null;
    return {
      id: m.id as string,
      sender_id: m.sender_id as string,
      body: m.body as string,
      created_at: m.created_at as string,
      sender_name: name,
      sender_initial: (name?.[0] ?? "?").toUpperCase(),
      is_me: (m.sender_id as string) === user.id,
    };
  }).reverse();
}

export async function sendFoundingChatMessage(body: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  if (!body.trim()) return { ok: false, error: "Empty message" };

  const { error } = await supabase
    .from("founding_chat_messages")
    .insert({ sender_id: user.id, body: body.trim() });

  return { ok: !error, error: error?.message };
}

export async function checkIsFoundingMother(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select("is_founding_mother")
    .eq("id", user.id)
    .single();

  return !!(data as { is_founding_mother?: boolean } | null)?.is_founding_mother;
}
