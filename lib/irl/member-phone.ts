import type { SupabaseClient } from "@supabase/supabase-js";

/** Phone from profiles, falling back to auth user phone. */
export async function getMemberPhone(
  supabase: SupabaseClient,
  userId: string,
  authPhone?: string | null
): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", userId)
    .maybeSingle();

  if (error && !error.message.includes("does not exist")) {
    return authPhone?.trim() || null;
  }

  const profilePhone = (data?.phone as string | null)?.trim();
  if (profilePhone) return profilePhone;
  return authPhone?.trim() || null;
}
