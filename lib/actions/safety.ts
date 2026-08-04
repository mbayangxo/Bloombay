"use server";

import { createClient } from "@/lib/supabase/server";

export interface SafeCheckin {
  id: string;
  event_name: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  expires_at: string;
  resolved_at: string | null;
  created_at: string;
}

export async function getActiveCheckin(): Promise<SafeCheckin | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("safe_checkins")
    .select("id, event_name, contact_name, contact_phone, expires_at, resolved_at, created_at")
    .eq("user_id", user.id)
    .is("resolved_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data as SafeCheckin | null;
}

export async function startCheckin(
  hours: number,
  eventName?: string,
  contactName?: string,
  contactPhone?: string
): Promise<{ checkin: SafeCheckin | null; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { checkin: null, error: "Sign in to continue." };

  const expiresAt = new Date(Date.now() + hours * 3600000).toISOString();
  const { data, error } = await supabase
    .from("safe_checkins")
    .insert({
      user_id: user.id,
      event_name: eventName?.trim() || null,
      contact_name: contactName?.trim() || null,
      contact_phone: contactPhone?.trim() || null,
      expires_at: expiresAt,
    })
    .select("id, event_name, contact_name, contact_phone, expires_at, resolved_at, created_at")
    .single();

  if (error) return { checkin: null, error: error.message };
  return { checkin: data as SafeCheckin };
}

export async function resolveCheckin(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("safe_checkins").update({ resolved_at: new Date().toISOString() }).eq("id", id);
}

// ── Live location sharing ─────────────────────────────────────────────────

export interface BouquetLocation {
  user_id: string;
  name: string;
  enabled: boolean;
  lat: number | null;
  lng: number | null;
  activity: string | null;
  updated_at: string;
}

export async function getMySharingState(): Promise<{ enabled: boolean; activity: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { enabled: false, activity: null };

  const { data } = await supabase
    .from("location_shares")
    .select("enabled, activity")
    .eq("user_id", user.id)
    .maybeSingle();

  return { enabled: data?.enabled ?? false, activity: data?.activity ?? null };
}

export async function updateMyLocation(
  enabled: boolean,
  lat?: number,
  lng?: number,
  activity?: string
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("location_shares").upsert({
    user_id: user.id,
    enabled,
    lat: enabled ? lat ?? null : null,
    lng: enabled ? lng ?? null : null,
    activity: enabled ? activity?.trim() || null : null,
    updated_at: new Date().toISOString(),
  });
}

export async function getBouquetLocations(): Promise<BouquetLocation[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: bouquet } = await supabase
    .from("bloom_bouquet")
    .select("member_id")
    .eq("owner_id", user.id);

  const memberIds = (bouquet ?? []).map((b) => (b as { member_id: string }).member_id);
  if (memberIds.length === 0) return [];

  const { data } = await supabase
    .from("location_shares")
    .select("user_id, enabled, lat, lng, activity, updated_at, profiles!location_shares_user_id_fkey ( first_name, full_name )")
    .in("user_id", memberIds)
    .eq("enabled", true);

  type Row = {
    user_id: string; enabled: boolean; lat: number | null; lng: number | null;
    activity: string | null; updated_at: string;
    profiles: { first_name: string | null; full_name: string | null } | null;
  };

  return ((data ?? []) as unknown as Row[]).map((row) => ({
    user_id: row.user_id,
    name: row.profiles?.first_name || row.profiles?.full_name?.split(" ")[0] || "A Bloomie",
    enabled: row.enabled,
    lat: row.lat,
    lng: row.lng,
    activity: row.activity,
    updated_at: row.updated_at,
  }));
}
