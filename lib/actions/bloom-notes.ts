"use server";

import { createClient } from "@/lib/supabase/server";

export interface BloomNote {
  id: string;
  author_id: string;
  author_name: string | null;
  author_avatar: string | null;
  place_slug: string;
  place_name: string | null;
  content: string;
  created_at: string;
  flower_count: number;
  gave_flower: boolean;   // did the current user give this note a flower
  saved: boolean;         // did the current user save this note
}

interface NoteRow {
  id: string;
  author_id: string;
  place_slug: string;
  place_name: string | null;
  content: string;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
  bloom_note_flowers: { user_id: string }[];
  bloom_note_saves: { user_id: string }[];
}

function rowToNote(row: NoteRow, viewerId: string | null): BloomNote {
  return {
    id: row.id,
    author_id: row.author_id,
    author_name: row.profiles?.display_name ?? null,
    author_avatar: row.profiles?.avatar_url ?? null,
    place_slug: row.place_slug,
    place_name: row.place_name,
    content: row.content,
    created_at: row.created_at,
    flower_count: row.bloom_note_flowers.length,
    gave_flower: viewerId ? row.bloom_note_flowers.some(f => f.user_id === viewerId) : false,
    saved: viewerId ? row.bloom_note_saves.some(s => s.user_id === viewerId) : false,
  };
}

const NOTE_SELECT = `
  id, author_id, place_slug, place_name, content, created_at,
  profiles ( display_name, avatar_url ),
  bloom_note_flowers ( user_id ),
  bloom_note_saves ( user_id )
`;

// Notes left at one place — newest first
export async function getNotesForPlace(placeSlug: string): Promise<BloomNote[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("bloom_notes")
    .select(NOTE_SELECT)
    .eq("place_slug", placeSlug)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return (data as unknown as NoteRow[]).map(r => rowToNote(r, user?.id ?? null));
}

// Every note a woman has left across the city — her trail
export async function getNotesByAuthor(authorId: string): Promise<BloomNote[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("bloom_notes")
    .select(NOTE_SELECT)
    .eq("author_id", authorId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) return [];
  return (data as unknown as NoteRow[]).map(r => rowToNote(r, user?.id ?? null));
}

// Notes the current user saved — to come back to
export async function getMySavedNotes(): Promise<BloomNote[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: saves } = await supabase
    .from("bloom_note_saves")
    .select("note_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const ids = (saves ?? []).map(s => s.note_id);
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("bloom_notes")
    .select(NOTE_SELECT)
    .in("id", ids);

  if (error || !data) return [];
  const notes = (data as unknown as NoteRow[]).map(r => rowToNote(r, user.id));
  // keep saved order
  return ids.map(id => notes.find(n => n.id === id)).filter((n): n is BloomNote => !!n);
}

export async function leaveBloomNote(placeSlug: string, placeName: string, content: string): Promise<{ ok: boolean; error?: string }> {
  const trimmed = content.trim();
  if (!trimmed) return { ok: false, error: "Write something first." };
  if (trimmed.length > 500) return { ok: false, error: "Keep it under 500 characters." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("bloom_notes").insert({
    author_id: user.id,
    place_slug: placeSlug,
    place_name: placeName,
    content: trimmed,
  });

  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function deleteBloomNote(noteId: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from("bloom_notes").delete().eq("id", noteId);
  return { ok: !error };
}

// Toggle a flower on a note. Returns new state.
export async function toggleFlower(noteId: string): Promise<{ gave: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { gave: false };

  const { data: existing } = await supabase
    .from("bloom_note_flowers")
    .select("note_id")
    .eq("note_id", noteId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("bloom_note_flowers").delete().eq("note_id", noteId).eq("user_id", user.id);
    return { gave: false };
  }
  await supabase.from("bloom_note_flowers").insert({ note_id: noteId, user_id: user.id });
  return { gave: true };
}

// Toggle saving a note. Returns new state.
export async function toggleSaveNote(noteId: string): Promise<{ saved: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
