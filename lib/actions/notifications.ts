"use server";

import { createClient } from "@/lib/supabase/server";

export type NotifType = "flower" | "seat" | "event" | "message" | "club" | "club_accepted" | "intro" | "celebrate" | "club_new_post" | "gathering";

export interface Notification {
  id: string;
  user_id: string;
  type: NotifType;
  title: string;
  body: string | null;
  link: string | null;
  data: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
}

export async function getMyNotifications(limit = 30): Promise<Notification[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as Notification[];
}

export async function markAllRead(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);
}

export async function markNotificationRead(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .eq("user_id", user.id);
}

export async function getUnreadCount(): Promise<number> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return count ?? 0;
}

export async function pushNotification(
  userId: string,
  type: NotifType,
  title: string,
  body?: string,
  link?: string,
  data?: Record<string, unknown>,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("notifications").insert({
    user_id:    userId,
    type,
    title,
    body:       body ?? null,
    link:       link ?? null,
    data:       data ?? null,
  });
}
