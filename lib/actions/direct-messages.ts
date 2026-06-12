"use server";

import { createClient } from "@/lib/supabase/server";

export interface ConversationSummary {
  id: string;
  type: "direct" | "group" | "plan" | "club";
  name: string | null;
  last_message_at: string | null;
  unread_count: number;
  last_preview: string | null;
  participants: { id: string; full_name: string | null; first_name: string | null; avatar_url: string | null }[];
}

export interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  content: string;
  created_at: string;
  sender?: { full_name: string | null; first_name: string | null; avatar_url: string | null };
}

export async function getMyConversations(): Promise<ConversationSummary[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get all conversations the user participates in
  const { data: participations } = await supabase
    .from("conversation_participants")
    .select("conversation_id, last_read_at")
    .eq("user_id", user.id);

  if (!participations?.length) return [];

  const convoIds = participations.map(p => p.conversation_id);
  const lastReadMap = new Map(participations.map(p => [p.conversation_id, p.last_read_at]));

  const { data: convos } = await supabase
    .from("conversations")
    .select("id, type, name, last_message_at")
    .in("id", convoIds)
    .order("last_message_at", { ascending: false });

  if (!convos?.length) return [];

  // Fetch participants for each convo
  const { data: allParticipants } = await supabase
    .from("conversation_participants")
    .select("conversation_id, user_id")
    .in("conversation_id", convoIds);

  const participantUserIds = [...new Set((allParticipants ?? []).map(p => p.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, first_name, avatar_url")
    .in("id", participantUserIds);

  const profileMap = new Map((profiles ?? []).map(p => [p.id, p]));

  // Fetch last message for preview + unread counts
  const results: ConversationSummary[] = [];

  for (const convo of convos) {
    const lastRead = lastReadMap.get(convo.id);

    // Last message preview
    const { data: lastMsg } = await supabase
      .from("direct_messages")
      .select("content, sender_id, created_at")
      .eq("conversation_id", convo.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Unread count
    let unreadCount = 0;
    if (lastRead) {
      const { count } = await supabase
        .from("direct_messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", convo.id)
        .gt("created_at", lastRead)
        .neq("sender_id", user.id);
      unreadCount = count ?? 0;
    }

    const convoParticipants = (allParticipants ?? [])
      .filter(p => p.conversation_id === convo.id && p.user_id !== user.id)
      .map(p => profileMap.get(p.user_id))
      .filter(Boolean) as ConversationSummary["participants"];

    results.push({
      id: convo.id,
      type: convo.type as ConversationSummary["type"],
      name: convo.name,
      last_message_at: convo.last_message_at,
      unread_count: unreadCount,
      last_preview: lastMsg?.content ?? null,
      participants: convoParticipants,
    });
  }

  return results;
}

export async function getMessages(conversationId: string, limit = 50): Promise<DirectMessage[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("direct_messages")
    .select("id, conversation_id, sender_id, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (!data?.length) return [];

  const senderIds = [...new Set(data.map(m => m.sender_id).filter(Boolean))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, first_name, avatar_url")
    .in("id", senderIds as string[]);

  const profileMap = new Map((profiles ?? []).map(p => [p.id, p]));

  return data.map(m => ({
    ...m,
    sender: m.sender_id ? profileMap.get(m.sender_id) : undefined,
  })) as DirectMessage[];
}

export async function sendMessage(conversationId: string, content: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("direct_messages")
    .insert({ conversation_id: conversationId, sender_id: user.id, content });
  if (error) throw error;

  // Mark last read
  await supabase
    .from("conversation_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id);
}

export async function startConversation(otherUserId: string): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if a direct convo already exists between these two users
  const { data: existing } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", user.id);

  if (existing?.length) {
    const myConvoIds = existing.map(p => p.conversation_id);
    const { data: shared } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", otherUserId)
      .in("conversation_id", myConvoIds);

    if (shared?.length) {
      // Verify it's a direct convo (only 2 participants)
      for (const s of shared) {
        const { count } = await supabase
          .from("conversation_participants")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", s.conversation_id);
        if (count === 2) return s.conversation_id;
      }
    }
  }

  // Create new conversation
  const { data: convo, error } = await supabase
    .from("conversations")
    .insert({ type: "direct", created_by: user.id })
    .select("id")
    .single();
  if (error) throw error;

  const convoId = (convo as { id: string }).id;
  await supabase.from("conversation_participants").insert([
    { conversation_id: convoId, user_id: user.id },
    { conversation_id: convoId, user_id: otherUserId },
  ]);

  return convoId;
}

export async function markConversationRead(conversationId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("conversation_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id);
}
