"use server";

import { createClient } from "@/lib/supabase/server";

export interface MemberInvitation {
  id: string;
  from_user_id: string;
  to_user_id: string;
  subject: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
}

export async function sendInvitation(
  toUserId: string,
  subject: string,
  body?: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to continue." };
  if (user.id === toUserId) return { ok: false, error: "You can't invite yourself." };

  const { error } = await supabase.from("member_invitations").insert({
    from_user_id: user.id,
    to_user_id: toUserId,
    subject: subject.trim(),
    body: body?.trim() || null,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getMyInvitations(): Promise<MemberInvitation[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("member_invitations")
    .select("id, from_user_id, to_user_id, subject, body, is_read, created_at")
    .eq("to_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  return (data ?? []) as MemberInvitation[];
}

export async function markInvitationRead(invitationId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("member_invitations").update({ is_read: true }).eq("id", invitationId);
}
