"use server";

import { createClient } from "@/lib/supabase/server";

export type InvitationTemplate = "default" | "photo" | "scallop" | "newspaper" | "formal" | "launch";
export type InvitationStatus = "pending" | "accepted" | "declined";

export interface MemberInvitation {
  id: string;
  from_user_id: string;
  to_user_id: string;
  subject: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
  template_id: InvitationTemplate;
  event_title: string | null;
  venue: string | null;
  event_date: string | null;
  image_url: string | null;
  accent_color: string | null;
  status: InvitationStatus;
  decline_note: string | null;
}

export interface MemberInvitationWithSender extends MemberInvitation {
  from_name: string | null;
  from_avatar_url: string | null;
}

export async function sendInvitation(input: {
  toUserId: string;
  subject: string;
  body?: string;
  templateId?: InvitationTemplate;
  eventTitle?: string;
  venue?: string;
  eventDate?: string;
  imageUrl?: string;
  accentColor?: string;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to continue." };
  if (user.id === input.toUserId) return { ok: false, error: "You can't invite yourself." };
  if (!input.subject.trim()) return { ok: false, error: "Give your invitation a title." };

  const { data, error } = await supabase
    .from("member_invitations")
    .insert({
      from_user_id: user.id,
      to_user_id: input.toUserId,
      subject: input.subject.trim(),
      body: input.body?.trim() || null,
      template_id: input.templateId ?? "default",
      event_title: input.eventTitle?.trim() || input.subject.trim(),
      venue: input.venue?.trim() || null,
      event_date: input.eventDate || null,
      image_url: input.imageUrl || null,
      accent_color: input.accentColor || null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data?.id as string | undefined };
}

export async function getMyInvitations(): Promise<MemberInvitationWithSender[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("member_invitations")
    .select("*, profiles!from_user_id(full_name, first_name, avatar_url)")
    .eq("to_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  return (data ?? []).map((r: Record<string, unknown>) => {
    const sender = r.profiles as { full_name?: string; first_name?: string; avatar_url?: string } | null;
    return {
      ...(r as unknown as MemberInvitation),
      from_name: sender?.full_name ?? sender?.first_name ?? null,
      from_avatar_url: sender?.avatar_url ?? null,
    };
  });
}

export async function getInvitationById(id: string): Promise<MemberInvitationWithSender | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("member_invitations")
    .select("*, profiles!from_user_id(full_name, first_name, avatar_url)")
    .eq("id", id)
    .or(`to_user_id.eq.${user.id},from_user_id.eq.${user.id}`)
    .maybeSingle();

  if (!data) return null;
  const sender = data.profiles as { full_name?: string; first_name?: string; avatar_url?: string } | null;
  return {
    ...(data as unknown as MemberInvitation),
    from_name: sender?.full_name ?? sender?.first_name ?? null,
    from_avatar_url: sender?.avatar_url ?? null,
  };
}

export async function markInvitationRead(invitationId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("member_invitations").update({ is_read: true }).eq("id", invitationId);
}

export async function respondToInvitation(
  invitationId: string,
  status: "accepted" | "declined",
  declineNote?: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to continue." };

  const { error } = await supabase
    .from("member_invitations")
    .update({
      status,
      is_read: true,
      decline_note: status === "declined" ? (declineNote?.trim() || null) : null,
    })
    .eq("id", invitationId)
    .eq("to_user_id", user.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
