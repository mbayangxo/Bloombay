"use server";

import { createClient } from "@/lib/supabase/server";
import type { BloomNote, CityTag } from "@/lib/bloom-notes/shared";

interface NoteRow {
  id: string;
  author_id: string;
  place_slug: string;
  place_name: string | null;
  gathering_id: string | null;
  content: string;
  photo_urls: string[] | null;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
  bloom_note_flowers: { user_id: string; gift_kind?: string | null; units?: number | null }[];
  bloom_note_saves: { user_id: string }[];
}

function rowToNote(row: NoteRow, viewerId: string | null): BloomNote {
  const gifts = row.bloom_note_flowers ?? [];
  const units = gifts.reduce((sum, g) => sum + (g.units ?? (g.gift_kind === "bouquet" ? 12 : 1)), 0);
  const mine = viewerId ? gifts.find((f) => f.user_id === viewerId) : undefined;
  const myKind = mine
    ? ((mine.gift_kind === "bouquet" ? "bouquet" : "flower") as "flower" | "bouquet")
    : null;
  return {
    id: row.id,
    author_id: row.author_id,
    author_name: row.profiles?.display_name ?? null,
    author_avatar: row.profiles?.avatar_url ?? null,
    place_slug: row.place_slug,
    place_name: row.place_name,
    gathering_id: row.gathering_id ?? null,
    content: row.content,
    photo_urls: row.photo_urls ?? [],
    created_at: row.created_at,
    flower_count: units,
    gave_flower: !!mine,
    my_gift_kind: myKind,
    saved: viewerId ? row.bloom_note_saves.some((s) => s.user_id === viewerId) : false,
  };
}

const NOTE_SELECT = `
  id, author_id, place_slug, place_name, gathering_id, content, photo_urls, created_at,
  profiles ( display_name, avatar_url ),
  bloom_note_flowers ( user_id, gift_kind, units ),
  bloom_note_saves ( user_id )
`;

export async function getNotesForPlace(placeSlug: string): Promise<BloomNote[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("bloom_notes")
    .select(NOTE_SELECT)
    .eq("place_slug", placeSlug)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return (data as unknown as NoteRow[]).map((r) => rowToNote(r, user?.id ?? null));
}

export async function getNotesByAuthor(authorId: string): Promise<BloomNote[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("bloom_notes")
    .select(NOTE_SELECT)
    .eq("author_id", authorId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) return [];
  return (data as unknown as NoteRow[]).map((r) => rowToNote(r, user?.id ?? null));
}

export async function getMySavedNotes(): Promise<BloomNote[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: saves } = await supabase
    .from("bloom_note_saves")
    .select("note_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const ids = (saves ?? []).map((s) => s.note_id);
  if (ids.length === 0) return [];

  const { data, error } = await supabase.from("bloom_notes").select(NOTE_SELECT).in("id", ids);

  if (error || !data) return [];
  const notes = (data as unknown as NoteRow[]).map((r) => rowToNote(r, user.id));
  return ids.map((id) => notes.find((n) => n.id === id)).filter((n): n is BloomNote => !!n);
}

export async function leaveBloomNote(
  placeSlug: string,
  placeName: string,
  content: string,
  tags: CityTag[] = [],
  opts?: { photoUrls?: string[]; gatheringId?: string | null },
): Promise<{ ok: boolean; error?: string }> {
  const trimmed = content.trim();
  const photos = (opts?.photoUrls ?? []).filter(Boolean).slice(0, 4);
  if (!trimmed && photos.length === 0) {
    return { ok: false, error: "Write something or add a photo." };
  }
  if (trimmed.length > 500) return { ok: false, error: "Keep it under 500 characters." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  if (opts?.gatheringId) {
    const { requireConfirmedGatheringParticipant } = await import(
      "@/lib/happenings/attendee-gate"
    );
    const gate = await requireConfirmedGatheringParticipant(opts.gatheringId);
    if (!gate.ok) return { ok: false, error: gate.error };
  }

  const { data: note, error } = await supabase
    .from("bloom_notes")
    .insert({
      author_id: user.id,
      place_slug: placeSlug,
      place_name: placeName,
      content: trimmed || (photos.length ? "✦" : ""),
      photo_urls: photos,
      gathering_id: opts?.gatheringId ?? null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  if (tags.length && note) {
    await supabase.from("bloom_note_tags").insert(tags.map((tag) => ({ note_id: note.id, tag })));
  }

  return { ok: true };
}

export async function getNotesForGathering(gatheringId: string): Promise<BloomNote[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("bloom_notes")
    .select(NOTE_SELECT)
    .eq("gathering_id", gatheringId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return (data as unknown as NoteRow[]).map((r) => rowToNote(r, user?.id ?? null));
}

export async function deleteBloomNote(noteId: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from("bloom_notes").delete().eq("id", noteId);
  return { ok: !error };
}

export async function toggleFlower(noteId: string): Promise<{ gave: boolean }> {
  const result = await giveNoteGift(noteId, "flower");
  return { gave: result.gave };
}

export async function giveNoteGift(
  noteId: string,
  kind: "flower" | "bouquet"
): Promise<{ gave: boolean; kind: "flower" | "bouquet" | null; units: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { gave: false, kind: null, units: 0 };

  const units = kind === "bouquet" ? 12 : 1;
  const { data: existing } = await supabase
    .from("bloom_note_flowers")
    .select("note_id, gift_kind")
    .eq("note_id", noteId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    // Same kind again → take back; different → upgrade/downgrade
    if ((existing as { gift_kind?: string }).gift_kind === kind) {
      await supabase
        .from("bloom_note_flowers")
        .delete()
        .eq("note_id", noteId)
        .eq("user_id", user.id);
      return { gave: false, kind: null, units: 0 };
    }
    await supabase
      .from("bloom_note_flowers")
      .update({ gift_kind: kind, units })
      .eq("note_id", noteId)
      .eq("user_id", user.id);
    return { gave: true, kind, units };
  }

  await supabase.from("bloom_note_flowers").insert({
    note_id: noteId,
    user_id: user.id,
    gift_kind: kind,
    units,
  });
  return { gave: true, kind, units };
}

export async function takeBackNoteGift(noteId: string): Promise<{ gave: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { gave: false };
  await supabase
    .from("bloom_note_flowers")
    .delete()
    .eq("note_id", noteId)
    .eq("user_id", user.id);
  return { gave: false };
}

export async function getNoteCountsByPlace(slugs: string[]): Promise<Record<string, number>> {
  if (slugs.length === 0) return {};
  const supabase = await createClient();
  const { data } = await supabase.from("bloom_notes").select("place_slug").in("place_slug", slugs);

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.place_slug] = (counts[row.place_slug] ?? 0) + 1;
  }
  return counts;
}

export async function getTopNotesForPlace(placeSlug: string, limit = 50): Promise<BloomNote[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("bloom_notes")
    .select(NOTE_SELECT)
    .eq("place_slug", placeSlug)
    .limit(limit);

  if (error || !data) return [];
  return (data as unknown as NoteRow[])
    .map((r) => rowToNote(r, user?.id ?? null))
    .sort((a, b) => b.flower_count - a.flower_count);
}

export async function toggleSaveNote(noteId: string): Promise<{ saved: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { saved: false };

  const { data: existing } = await supabase
    .from("bloom_note_saves")
    .select("note_id")
    .eq("note_id", noteId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("bloom_note_saves").delete().eq("note_id", noteId).eq("user_id", user.id);
    return { saved: false };
  }
  await supabase.from("bloom_note_saves").insert({ note_id: noteId, user_id: user.id });
  return { saved: true };
}

export async function addNoteTags(noteId: string, tags: CityTag[]): Promise<void> {
  if (!tags.length) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("bloom_note_tags")
    .upsert(
      tags.map((tag) => ({ note_id: noteId, tag })),
      { onConflict: "note_id,tag" },
    );
}

export async function getPlaceTagCounts(placeSlug: string): Promise<Record<CityTag, number>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bloom_note_tags")
    .select("tag, bloom_notes!inner(place_slug)")
    .eq("bloom_notes.place_slug", placeSlug);

  const counts: Partial<Record<CityTag, number>> = {};
  for (const row of (data ?? []) as { tag: string }[]) {
    const t = row.tag as CityTag;
    counts[t] = (counts[t] ?? 0) + 1;
  }
  return counts as Record<CityTag, number>;
}
