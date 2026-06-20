import { supabase } from "@/lib/supabase";

/** First name for greetings — session, profile metadata, or email. */
export function readMemberFirstName(): string {
  if (typeof window === "undefined") return "";

  const stored = sessionStorage.getItem("gf_name")?.trim();
  if (stored) return stored.split(/\s+/)[0] ?? stored;

  return "";
}

export async function hydrateMemberFirstName(): Promise<string> {
  const cached = readMemberFirstName();
  if (cached) return cached;

  try {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return "";

    const meta = user.user_metadata ?? {};
    const fromMeta =
      (typeof meta.first_name === "string" && meta.first_name) ||
      (typeof meta.full_name === "string" && meta.full_name.split(/\s+/)[0]) ||
      (typeof meta.name === "string" && meta.name.split(/\s+/)[0]) ||
      "";

    if (fromMeta) {
      sessionStorage.setItem("gf_name", fromMeta);
      return fromMeta;
    }

    const emailName = user.email?.split("@")[0]?.replace(/[._]/g, " ");
    if (emailName) {
      const first = emailName.split(/\s+/)[0];
      if (first) {
        sessionStorage.setItem("gf_name", first);
        return first;
      }
    }
  } catch {
    /* ignore */
  }

  return "";
}
