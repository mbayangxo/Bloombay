import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProfileBootstrapFields } from "@/lib/auth/profile-from-metadata";

/** Upsert profiles row — prefers non-empty incoming values. */
export async function upsertProfileRow(
  admin: SupabaseClient,
  userId: string,
  fields: ProfileBootstrapFields
): Promise<{ ok: boolean; error?: string }> {
  const { data: existing, error: readErr } = await admin
    .from("profiles")
    .select("email, full_name, phone, city, state, neighborhood, role")
    .eq("id", userId)
    .maybeSingle();

  if (readErr) {
    return { ok: false, error: readErr.message };
  }

  const row = {
    id: userId,
    email: fields.email ?? existing?.email ?? null,
    full_name: fields.full_name ?? existing?.full_name ?? null,
    phone: fields.phone ?? existing?.phone ?? null,
    city: fields.city ?? existing?.city ?? null,
    state: fields.state ?? existing?.state ?? null,
    neighborhood: fields.neighborhood ?? existing?.neighborhood ?? null,
    role: existing?.role ?? fields.role,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("profiles").upsert(row, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
