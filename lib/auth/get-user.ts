import { createClient } from "../supabase/server";

export type UserRole =
  | "member"
  | "founder"
  | "admin"
  | "club_owner"
  | "partner"
  | "moderator"
  | "curator";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  first_name?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  neighborhood?: string;
  borough?: string;
  city?: string;
  verification_status?: string;
  onboarding_completed?: boolean;
  bloom_points?: number;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: p } = await supabase
    .from("profiles")
    .select("role, full_name, first_name, bio, avatar_url, phone, neighborhood, borough, city, verification_status, onboarding_completed, bloom_points")
    .eq("id", user.id)
    .single();

  // full_name is Cursor's primary field; first_name added later via migration 013
  const firstName = (p as Record<string, unknown> | null)?.first_name as string | null ?? "";
  const fullName = ((p as Record<string, unknown> | null)?.full_name as string | null)
    || firstName
    || (user.email?.split("@")[0] ?? "there");

  return {
    id: user.id,
    email: user.email ?? "",
    role: (p?.role ?? "member") as UserRole,
    first_name: firstName || undefined,
    full_name: fullName,
    bio: p?.bio ?? undefined,
    avatar_url: p?.avatar_url ?? undefined,
    phone: p?.phone ?? undefined,
    neighborhood: p?.neighborhood ?? undefined,
    borough: p?.borough ?? undefined,
    city: p?.city ?? undefined,
    verification_status: p?.verification_status ?? "unverified",
    onboarding_completed: p?.onboarding_completed ?? false,
    bloom_points: p?.bloom_points ?? 0,
  };
}

export function getPortalHomeForRole(role: UserRole): string {
  switch (role) {
    case "founder":
      return "/founder/dashboard";
    case "admin":
      return "/admin/dashboard";
    case "club_owner":
      return "/club-owner/dashboard";
    case "partner":
      return "/partner/dashboard";
    case "curator":
      return "/curator/dashboard";
    default:
      return "/member/home";
  }
}
