"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { getPortalHomeForRole, UserRole } from "./get-user";

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
