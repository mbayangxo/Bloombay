"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type MessageMediaType = "text" | "image" | "audio" | "gif";

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
  media_url: string | null;
  media_type: MessageMediaType;
  created_at: string;
  sender?: { full_name: string | null; first_name: string | null; avatar_url: string | null };
}

function previewForMessage(content: string | null | undefined, mediaType?: string | null): string {
  if (mediaType === "image") return content?.trim() || "📷 Photo";
  if (mediaType === "gif") return content?.trim() || "GIF";
  if (mediaType === "audio") return content?.trim() || "🎤 Voice note";
  return content?.trim() || "Start a conversation";
}

async function loadProfilesByIds(ids: string[]) {
  if (!ids.length) return new Map<string, { id: string; full_name: string | null; first_name: string | null; avatar_url: string | null }>();
  // Service role so member directory works even if profiles RLS is still own-only in prod.
  const admin = createAdminClient();
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, first_name, avatar_url")
    .in("id", ids);
  return new Map((profiles ?? []).map((p) => [p.id as string, p as { id: string; full_name: string | null; first_name: string | null; avatar_url: string | null }]));
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
  const profileMap = await loadProfilesByIds(participantUserIds);

  // Fetch last message for preview + unread counts
  const results: ConversationSummary[] = [];

  for (const convo of convos) {
    const lastRead = lastReadMap.get(convo.id);

    // Last message preview
    let preview: string | null = null;
    const lastWithMedia = await supabase
      .from("direct_messages")
      .select("content, media_type")
      .eq("conversation_id", convo.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!lastWithMedia.error && lastWithMedia.data) {
      preview = previewForMessage(
        lastWithMedia.data.content,
        (lastWithMedia.data as { media_type?: string }).media_type,
      );
    } else {
      const { data: textOnly } = await supabase
        .from("direct_messages")
        .select("content")
        .eq("conversation_id", convo.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      preview = textOnly?.content ?? null;
    }

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
      last_preview: preview,
      participants: convoParticipants,
    });
  }

  return results;
}

export async function getMessages(conversationId: string, limit = 50): Promise<DirectMessage[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let data:
    | {
        id: string;
        conversation_id: string;
        sender_id: string | null;
        content: string;
        media_url?: string | null;
        media_type?: MessageMediaType | null;
        created_at: string;
      }[]
    | null = null;

  const withMedia = await supabase
    .from("direct_messages")
    .select("id, conversation_id, sender_id, content, media_url, media_type, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (withMedia.error) {
    // Pre-migration fallback (text only)
    const fallback = await supabase
      .from("direct_messages")
      .select("id, conversation_id, sender_id, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(limit);
    data = fallback.data;
  } else {
    data = withMedia.data;
  }

  if (!data?.length) return [];

  const senderIds = [...new Set(data.map(m => m.sender_id).filter(Boolean))] as string[];
  const profileMap = await loadProfilesByIds(senderIds);

  return data.map(m => ({
    id: m.id,
    conversation_id: m.conversation_id,
    sender_id: m.sender_id,
    content: m.content ?? "",
    media_url: m.media_url ?? null,
    media_type: m.media_type ?? "text",
    created_at: m.created_at,
    sender: m.sender_id ? profileMap.get(m.sender_id) : undefined,
  }));
}

export async function sendMessage(
  conversationId: string,
  content: string,
  media?: { url: string; type: "image" | "audio" | "gif" },
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const trimmed = content.trim();
  const mediaType: MessageMediaType = media?.type ?? "text";
  const mediaUrl = media?.url ?? null;

  if (mediaType === "text" && !trimmed) throw new Error("Message is empty");
  if ((mediaType === "image" || mediaType === "audio" || mediaType === "gif") && !mediaUrl) {
    throw new Error("Media upload failed");
  }

  const body =
    trimmed ||
    (mediaType === "image"
      ? "📷 Photo"
      : mediaType === "gif"
        ? "GIF"
        : mediaType === "audio"
          ? "🎤 Voice note"
          : "");

  const { error } = await supabase
    .from("direct_messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: body,
      media_url: mediaUrl,
      media_type: mediaType,
    });
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
  // Creator first (RLS allows self-insert), then the other member
  // (RLS allows insert if you're already a participant).
  const { error: selfErr } = await supabase
    .from("conversation_participants")
    .insert({ conversation_id: convoId, user_id: user.id });
  if (selfErr) throw selfErr;

  const { error: otherErr } = await supabase
    .from("conversation_participants")
    .insert({ conversation_id: convoId, user_id: otherUserId });
  if (otherErr) throw otherErr;

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

export async function listChatMembers(): Promise<
  { id: string; name: string; avatar_url: string | null }[]
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, full_name, first_name, avatar_url")
    .neq("id", user.id)
    .limit(80);

  return (data ?? [])
    .map((p) => ({
      id: p.id as string,
      name: ((p.full_name as string | null) ?? (p.first_name as string | null) ?? "").trim(),
      avatar_url: (p.avatar_url as string | null) ?? null,
    }))
    .filter((p) => p.name.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Named group chat — name is required (what members create and call it). */
export async function createNamedGroupConversation(
  name: string,
  memberIds: string[],
): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const trimmed = name.trim();
  if (!trimmed) throw new Error("Name your chat");

  const uniqueMembers = [...new Set(memberIds.filter((id) => id && id !== user.id))];
  if (uniqueMembers.length < 1) throw new Error("Add at least one woman");

  const { data: convo, error } = await supabase
    .from("conversations")
    .insert({ type: "group", name: trimmed, created_by: user.id })
    .select("id")
    .single();
  if (error) throw error;

  const convoId = (convo as { id: string }).id;

  // Creator first so RLS allows inviting others (must already be a participant).
  const { error: selfErr } = await supabase
    .from("conversation_participants")
    .insert({ conversation_id: convoId, user_id: user.id });
  if (selfErr) throw selfErr;

  const { error: partError } = await supabase
    .from("conversation_participants")
    .insert(uniqueMembers.map((user_id) => ({ conversation_id: convoId, user_id })));
  if (partError) throw partError;

  return convoId;
}

/** Add members to an existing group conversation (caller must already be a participant). */
export async function addMembersToConversation(
  conversationId: string,
  memberIds: string[],
): Promise<{ added: number }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const unique = [...new Set(memberIds.filter((id) => id && id !== user.id))];
  if (!unique.length) return { added: 0 };

  // Confirm caller is a participant
  const { data: me } = await supabase
    .from("conversation_participants")
    .select("user_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!me) throw new Error("You’re not in this chat");

  const { data: existing } = await supabase
    .from("conversation_participants")
    .select("user_id")
    .eq("conversation_id", conversationId);

  const already = new Set((existing ?? []).map((r) => r.user_id as string));
  const toAdd = unique.filter((id) => !already.has(id));
  if (!toAdd.length) return { added: 0 };

  const { error } = await supabase
    .from("conversation_participants")
    .insert(toAdd.map((user_id) => ({ conversation_id: conversationId, user_id })));
  if (error) throw error;

  return { added: toAdd.length };
}
