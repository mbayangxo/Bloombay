"use server";

import { createClient } from "@/lib/supabase/server";

export interface ClubApplication {
  id: string;
  user_id: string;
  status: "pending" | "accepted" | "rejected";
  message: string | null;
  created_at: string;
  profile: { full_name: string | null; first_name: string | null; avatar_url: string | null } | null;
}

export interface ClubPost {
  id: string;
  club_id: string;
  author_id: string;
  body: string;
  image_url: string | null;
  created_at: string;
}

export interface GatheringData {
  title: string;
  starts_at: string;
  venue: string;
  neighborhood?: string;
  description?: string;
  capacity?: number;
}

// ── Applications ──────────────────────────────────────────────────────────────

export async function getClubApplications(clubId: string): Promise<ClubApplication[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("club_applications")
    .select("id, user_id, status, message, created_at")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false });

  if (!data) return [];

  // Fetch profiles for each applicant
  const userIds = data.map(a => a.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, first_name, avatar_url")
    .in("id", userIds);

  const profileMap = new Map((profiles ?? []).map(p => [p.id, p]));

  return data.map(a => ({
    ...a,
    status: a.status as ClubApplication["status"],
    profile: profileMap.get(a.user_id) ?? null,
  }));
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "accepted" | "rejected",
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("club_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", applicationId);
  if (error) throw error;
}

export async function applyToClub(clubId: string, message?: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("club_applications").upsert({
    club_id: clubId,
    user_id: user.id,
    message: message ?? null,
    status: "pending",
  }, { onConflict: "club_id,user_id" });
  if (error) throw error;
}

export async function getMyApplication(clubId: string): Promise<ClubApplication | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("club_applications")
    .select("id, user_id, status, message, created_at")
    .eq("club_id", clubId)
    .eq("user_id", user.id)
    .maybeSingle();
  return data ? { ...data, status: data.status as ClubApplication["status"], profile: null } : null;
}

// ── Club posts ────────────────────────────────────────────────────────────────

export async function getClubPosts(clubId: string): Promise<ClubPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("club_posts")
    .select("id, club_id, author_id, body, image_url, created_at")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .limit(20);
  return (data ?? []) as ClubPost[];
}

export async function createClubPost(clubId: string, body: string, imageUrl?: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("club_posts").insert({
    club_id: clubId,
    author_id: user.id,
    body,
    image_url: imageUrl ?? null,
  });
  if (error) throw error;
}

export async function deleteClubPost(postId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("club_posts").delete().eq("id", postId);
  if (error) throw error;
}

// ── Gatherings ────────────────────────────────────────────────────────────────

export async function createGathering(clubId: string, data: GatheringData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("gatherings").insert({
    club_id: clubId,
    title: data.title,
    starts_at: data.starts_at,
    venue: data.venue,
    neighborhood: data.neighborhood ?? null,
    description: data.description ?? null,
    capacity: data.capacity ?? null,
    host_id: user.id,
  });
  if (error) throw error;
}

export async function getClubGatherings(clubId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gatherings")
    .select("id, title, starts_at, venue, neighborhood, description, capacity")
    .eq("club_id", clubId)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(10);
  return data ?? [];
}

// ── Album / gallery ───────────────────────────────────────────────────────────

export async function getClubAlbum(clubId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clubs")
    .select("album_urls")
    .eq("id", clubId)
    .single();
  const urls = (data?.album_urls as string[] | null) ?? [];
  return Array.isArray(urls) ? urls : [];
}

export async function addClubPhoto(clubId: string, url: string): Promise<void> {
  const supabase = await createClient();
  const current = await getClubAlbum(clubId);
  const { error } = await supabase
    .from("clubs")
    .update({ album_urls: [...current, url] })
    .eq("id", clubId);
  if (error) throw error;
}

export async function removeClubPhoto(clubId: string, url: string): Promise<void> {
  const supabase = await createClient();
  const current = await getClubAlbum(clubId);
  const { error } = await supabase
    .from("clubs")
    .update({ album_urls: current.filter(u => u !== url) })
    .eq("id", clubId);
  if (error) throw error;
}

// ── Club edit ─────────────────────────────────────────────────────────────────

export async function updateClub(
  clubId: string,
  fields: { name?: string; tagline?: string; description?: string; neighborhood?: string; primary_color?: string; membership_type?: string; member_limit?: number },
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("clubs").update(fields).eq("id", clubId);
  if (error) throw error;
}
