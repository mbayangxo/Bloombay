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
  neighborhood?: string;
  borough?: string;
  city?: string;
  age?: number;
  interests?: string[];
  goals?: string[];
  era?: string;
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
    .select("role, first_name, bio, avatar_url, neighborhood, borough, city, age, interests, goals, era, verification_status, onboarding_completed, bloom_points")
    .eq("id", user.id)
    .single();

  const firstName = p?.first_name ?? "";
  const fullName = firstName || (user.email?.split("@")[0] ?? "there");

  return {
    id: user.id,
    email: user.email ?? "",
    role: (p?.role ?? "member") as UserRole,
    first_name: firstName || undefined,
    full_name: fullName,
    bio: p?.bio ?? undefined,
    avatar_url: p?.avatar_url ?? undefined,
    neighborhood: p?.neighborhood ?? undefined,
    borough: p?.borough ?? undefined,
    city: p?.city ?? undefined,
    age: p?.age ?? undefined,
    interests: p?.interests ?? [],
    goals: p?.goals ?? [],
    era: p?.era ?? undefined,
    verification_status: p?.verification_status ?? "unverified",
    onboarding_completed: p?.onboarding_completed ?? false,
    bloom_points: p?.bloom_points ?? 0,
  };
}

export function getPortalHomeForRole(role: UserRole): string {
  switch (role) {
    case "founder":
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
