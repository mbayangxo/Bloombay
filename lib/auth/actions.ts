"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { getPortalHomeForRole, UserRole } from "./get-user";

export async function updateProfile(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const updates: Record<string, string> = {};
  const firstName = (formData.get("first_name") as string | null)?.trim();
  const neighborhood = (formData.get("neighborhood") as string | null)?.trim();
  const bio = (formData.get("bio") as string | null)?.trim();

  if (firstName !== undefined) updates.first_name = firstName ?? "";
  if (neighborhood !== undefined) updates.neighborhood = neighborhood ?? "";
  if (bio !== undefined) updates.bio = bio ?? "";

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/member/lounge");
  revalidatePath("/member/home");
  return {};
}

export type LoginState = { error: string } | null;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.message };

  // Get role from profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const role = (profile?.role ?? "member") as UserRole;
  revalidatePath("/", "layout");
  redirect(getPortalHomeForRole(role));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/portals");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });
  if (error || !data.url) return;
  redirect(data.url);
}
