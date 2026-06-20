import type { User } from "@supabase/supabase-js";
import { normalizeRole, type UserRole } from "@/lib/auth/roles";

export type ProfileBootstrapFields = {
  email: string | null;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  neighborhood: string | null;
  role: UserRole;
};

function trimOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  return t.length ? t : null;
}

function roleFromMetadata(meta: Record<string, unknown>): UserRole {
  const raw = trimOrNull(meta.role);
  if (!raw) return "member";
  const normalized = normalizeRole(raw);
  return normalized ?? "member";
}

/** Build profile fields from auth user + signup metadata. */
export function profileFromAuthUser(user: User): ProfileBootstrapFields {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  return {
    email: user.email ?? null,
    full_name:
      trimOrNull(meta.full_name) ??
      (user.email ? user.email.split("@")[0] : null),
    phone: trimOrNull(user.phone) ?? trimOrNull(meta.phone),
    city: trimOrNull(meta.city),
    state: trimOrNull(meta.state),
    neighborhood: trimOrNull(meta.neighborhood),
    role: roleFromMetadata(meta),
  };
}

/** Merge signup input over auth user fields (email signup path). */
export function profileFromSignUpInput(
  user: User,
  input: {
    email: string;
    fullName: string;
    phone: string;
    city: string;
    neighborhood: string;
  }
): ProfileBootstrapFields {
  const base = profileFromAuthUser(user);
  return {
    email: input.email.trim() || base.email,
    full_name: input.fullName.trim() || base.full_name,
    phone: input.phone.trim() || base.phone,
    city: input.city.trim() || base.city,
    state: base.state,
    neighborhood: input.neighborhood.trim() || base.neighborhood,
    role: "member",
  };
}
