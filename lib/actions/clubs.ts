"use server";

import { createClient } from "@/lib/supabase/server";
import { resolveClubSlug } from "@/lib/clubs/resolve-slug";

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

function mapApplicationStatus(status: string): ClubApplication["status"] {
  if (status === "approved") return "accepted";
  if (status === "denied") return "rejected";
  return status as ClubApplication["status"];
}

function toDbStatus(status: "accepted" | "rejected"): "approved" | "denied" {
  return status === "accepted" ? "approved" : "denied";
}

// ── Applications ──────────────────────────────────────────────────────────────

export async function getClubApplications(clubId: string): Promise<ClubApplication[]> {
  const supabase = await createClient();
  const slug = await resolveClubSlug(supabase, clubId);
  if (!slug) return [];

  const { data } = await supabase
    .from("club_applications")
    .select("id, user_id, status, why, applicant_name, created_at")
    .eq("club_slug", slug)
    .order("created_at", { ascending: false });

  if (!data) return [];

  const userIds = data.map((a) => a.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, first_name, avatar_url")
    .in("id", userIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  return data.map((a) => ({
    id: a.id,
    user_id: a.user_id,
    status: mapApplicationStatus(a.status as string),
    message: (a.why as string | null) ?? null,
    created_at: a.created_at as string,
    profile: profileMap.get(a.user_id) ?? null,
  }));
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "accepted" | "rejected",
): Promise<void> {
  const supabase = await createClient();
  const dbStatus = toDbStatus(status);

  const { data: app } = await supabase
    .from("club_applications")
    .select("user_id, club_slug")
    .eq("id", applicationId)
    .maybeSingle();

  const { error } = await supabase
    .from("club_applications")
    .update({ status: dbStatus, reviewed_at: new Date().toISOString() })
    .eq("id", applicationId);
  if (error) throw error;

  if (status === "accepted" && app?.club_slug) {
    await supabase.from("club_memberships").upsert(
      {
        user_id: app.user_id,
        club_slug: app.club_slug,
        joined_at: new Date().toISOString(),
      },
      { onConflict: "user_id,club_slug", ignoreDuplicates: true },
    );
  }
}

export type ClubApplicationQuestion = {
  id: string;
  question: string;
  required: boolean;
  position: number;
};

/** Public — used by the apply page to render a club's custom questions, if any. */
export async function getClubApplicationQuestions(clubId: string): Promise<ClubApplicationQuestion[]> {
  const supabase = await createClient();
  const slug = await resolveClubSlug(supabase, clubId);
  if (!slug) return [];

  const { data } = await supabase
    .from("club_application_questions")
    .select("id, question, required, position")
    .eq("club_slug", slug)
    .order("position", { ascending: true });

  return (data ?? []) as ClubApplicationQuestion[];
}

/** Owner-only — manage a club's custom application questions. */
export async function listOwnApplicationQuestions(clubId: string): Promise<ClubApplicationQuestion[]> {
  return getClubApplicationQuestions(clubId);
}

export async function addApplicationQuestion(
  clubId: string,
  question: string,
  required: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const slug = await resolveClubSlug(supabase, clubId);
  if (!slug) return { ok: false, error: "Club not found" };

  const { data: existing } = await supabase
    .from("club_application_questions")
    .select("position")
    .eq("club_slug", slug)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = ((existing as { position: number } | null)?.position ?? -1) + 1;

  const { error } = await supabase.from("club_application_questions").insert({
    club_slug: slug,
    question: question.trim(),
    required,
    position: nextPosition,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function removeApplicationQuestion(questionId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("club_application_questions").delete().eq("id", questionId);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function applyToClub(
  clubId: string,
  message?: string,
  extra?: { answers?: Record<string, string>; photoUrl?: string },
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const slug = await resolveClubSlug(supabase, clubId);
  if (!slug) throw new Error("Club not found");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, first_name")
    .eq("id", user.id)
    .maybeSingle();

  const applicantName =
    (profile?.full_name as string | null) ??
    (profile?.first_name as string | null) ??
    "Member";

  const { error } = await supabase.from("club_applications").insert({
    user_id: user.id,
    club_slug: slug,
    applicant_name: applicantName,
    why: message ?? "",
    status: "pending",
    answers: extra?.answers ?? null,
    photo_url: extra?.photoUrl ?? null,
  });
  if (error) throw error;
}

export async function getMyApplication(clubId: string): Promise<ClubApplication | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const slug = await resolveClubSlug(supabase, clubId);
  if (!slug) return null;

  const { data } = await supabase
    .from("club_applications")
    .select("id, user_id, status, why, created_at")
    .eq("club_slug", slug)
    .eq("user_id", user.id)
    .maybeSingle();

  return data
    ? {
        ...data,
        status: mapApplicationStatus(data.status as string),
        message: (data.why as string | null) ?? null,
        profile: null,
      }
    : null;
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

  const slug = await resolveClubSlug(supabase, clubId);
  if (!slug) throw new Error("Club not found");

  const { error } = await supabase.from("gatherings").insert({
    club_slug: slug,
    title: data.title,
    starts_at: data.starts_at,
    venue: data.venue,
    neighborhood: data.neighborhood ?? null,
    description: data.description ?? null,
    capacity: data.capacity ?? null,
    created_by: user.id,
  });
  if (error) throw error;
}

export async function getClubGatherings(clubId: string) {
  const supabase = await createClient();
  const slug = await resolveClubSlug(supabase, clubId);
  if (!slug) return [];

  const { data } = await supabase
    .from("gatherings")
    .select("id, title, starts_at, venue, neighborhood, description, capacity")
    .eq("club_slug", slug)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(10);
  return data ?? [];
}

// ── Ownership ──────────────────────────────────────────────────────────────────

export async function getMyOwnedClub(): Promise<{ id: string; name: string; slug: string } | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("clubs")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();
  return data ?? null;
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
    .update({ album_urls: current.filter((u) => u !== url) })
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
