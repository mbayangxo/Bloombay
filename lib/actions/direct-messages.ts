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
  const legacy = parseLegacyMediaContent(content ?? "");
  if (legacy.media_type === "image") return "📷 Photo";
  if (legacy.media_type === "gif") return "GIF";
  if (legacy.media_type === "audio") return "🎤 Voice note";
  return content?.trim() || "Start a conversation";
}

/** Encoded when media_* columns aren't migrated yet: BBMEDIA:image:https://... */
function parseLegacyMediaContent(content: string): {
  content: string;
  media_url: string | null;
  media_type: MessageMediaType;
} {
  const m = content.match(/^BBMEDIA:(image|audio|gif):(https?:\/\/\S+)$/);
  if (!m) {
    return { content, media_url: null, media_type: "text" };
  }
  const media_type = m[1] as MessageMediaType;
  return {
    content: media_type === "image" ? "📷 Photo" : media_type === "gif" ? "GIF" : "🎤 Voice note",
    media_url: m[2],
    media_type,
  };
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

export async function hasUnreadMessages(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: participations } = await supabase
    .from("conversation_participants")
    .select("conversation_id, last_read_at")
    .eq("user_id", user.id);
  if (!participations?.length) return false;

  for (const p of participations) {
    if (!p.last_read_at) continue;
    const { count } = await supabase
      .from("direct_messages")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", p.conversation_id)
      .gt("created_at", p.last_read_at)
      .neq("sender_id", user.id);
    if ((count ?? 0) > 0) return true;
  }
  return false;
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

  return data.map(m => {
    const legacy = parseLegacyMediaContent(m.content ?? "");
    return {
      id: m.id,
      conversation_id: m.conversation_id,
      sender_id: m.sender_id,
      content: legacy.media_url ? legacy.content : (m.content ?? ""),
      media_url: m.media_url ?? legacy.media_url,
      media_type: (m.media_type && m.media_type !== "text" ? m.media_type : legacy.media_type) as MessageMediaType,
      created_at: m.created_at,
      sender: m.sender_id ? profileMap.get(m.sender_id) : undefined,
    };
  });
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

  // Prefer structured media columns; fall back to encoded content if migration not applied yet.
  const withMedia = await supabase
    .from("direct_messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: body,
      media_url: mediaUrl,
      media_type: mediaType,
    });

  if (withMedia.error) {
    const encoded =
      mediaUrl && mediaType !== "text"
        ? `BBMEDIA:${mediaType}:${mediaUrl}`
        : body;
    const { error } = await supabase
      .from("direct_messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: encoded,
      });
    if (error) throw new Error(error.message || withMedia.error.message);
  }

  await supabase
    .from("conversation_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id);
}

/** Upload photo/voice/gif via service role (survives missing client bucket / RLS), then save the message. */
export async function sendChatMediaMessage(
  conversationId: string,
  formData: FormData,
): Promise<{ ok: true; mediaUrl: string; mediaType: "image" | "audio" | "gif" } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const file = formData.get("file");
  const kindRaw = String(formData.get("kind") ?? "image");
  const kind = (kindRaw === "audio" || kindRaw === "gif" ? kindRaw : "image") as "image" | "audio" | "gif";

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file selected" };
  }

  const maxBytes = kind === "audio" ? 10 * 1024 * 1024 : 6 * 1024 * 1024;
  if (file.size > maxBytes) {
    return { ok: false, error: kind === "audio" ? "Voice note must be under 10MB" : "Photo must be under 6MB" };
  }

  // Must be a participant
  const { data: part } = await supabase
    .from("conversation_participants")
    .select("user_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!part) return { ok: false, error: "You’re not in this chat" };

  const admin = createAdminClient();

  // Ensure chat-media exists; otherwise use a known public member bucket.
  let bucket = "chat-media";
  const { data: buckets } = await admin.storage.listBuckets();
  const names = new Set((buckets ?? []).map((b) => b.id || b.name));
  if (!names.has("chat-media")) {
    const created = await admin.storage.createBucket("chat-media", {
      public: true,
      fileSizeLimit: 10485760,
      allowedMimeTypes: [
        "image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif",
        "audio/webm", "audio/mp4", "audio/mpeg", "audio/ogg", "audio/wav", "audio/x-m4a", "audio/aac",
      ],
    });
    if (created.error) {
      if (names.has("member-memories")) bucket = "member-memories";
      else if (names.has("profile-photos")) bucket = "profile-photos";
      else if (names.has("avatars")) bucket = "avatars";
      else return { ok: false, error: `Storage isn’t ready (${created.error.message}). Run migration 096 or create the chat-media bucket.` };
    }
  }

  const mime = file.type || (kind === "gif" ? "image/gif" : kind === "audio" ? "audio/webm" : "image/jpeg");
  const extFromName = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
  const ext =
    kind === "gif"
      ? "gif"
      : kind === "audio"
        ? (mime.includes("mp4") || mime.includes("m4a") ? "m4a" : mime.includes("mpeg") ? "mp3" : "webm")
        : (["jpg", "jpeg", "png", "webp", "gif", "heic", "heif"].includes(extFromName)
          ? (extFromName === "jpeg" ? "jpg" : extFromName)
          : mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : mime.includes("gif") ? "gif" : "jpg");

  const path = `${user.id}/chat/${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { data: uploaded, error: upErr } = await admin.storage
    .from(bucket)
    .upload(path, file, { upsert: false, contentType: mime, cacheControl: "3600" });

  if (upErr || !uploaded) {
    // Last resort: try member-memories with user-scoped path (common existing bucket)
    if (bucket !== "member-memories" && names.has("member-memories")) {
      const fallbackPath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const retry = await admin.storage
        .from("member-memories")
        .upload(fallbackPath, file, { upsert: false, contentType: mime });
      if (retry.error || !retry.data) {
        return { ok: false, error: upErr?.message || retry.error?.message || "Upload failed" };
      }
      bucket = "member-memories";
      const { data: urlData } = admin.storage.from(bucket).getPublicUrl(retry.data.path);
      try {
        await sendMessage(conversationId, "", { url: urlData.publicUrl, type: kind });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Saved file but couldn’t send message" };
      }
      return { ok: true, mediaUrl: urlData.publicUrl, mediaType: kind };
    }
    return { ok: false, error: upErr?.message || "Upload failed" };
  }

  const { data: urlData } = admin.storage.from(bucket).getPublicUrl(uploaded.path);
  try {
    await sendMessage(conversationId, "", { url: urlData.publicUrl, type: kind });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Saved file but couldn’t send message" };
  }

  return { ok: true, mediaUrl: urlData.publicUrl, mediaType: kind };
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
