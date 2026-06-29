import { fetchAllWaitlistRows } from "@/lib/supabase-admin";
import { getAdminClient } from "@/lib/supabase-admin";
import type { WaitlistRow } from "@/lib/waitlist-admin";

export type FounderClubRow = {
  id: string;
  slug: string;
  name: string;
  ownerId: string | null;
  ownerName: string | null;
  managePath: string;
};

export type FounderClubHostOps = {
  pendingHosts: WaitlistRow[];
  activeClubs: FounderClubRow[];
  warning: string | null;
};

export async function fetchFounderClubHostOps(): Promise<FounderClubHostOps> {
  let pendingHosts: WaitlistRow[] = [];
  let warning: string | null = null;

  try {
    const rows = await fetchAllWaitlistRows();
    pendingHosts = rows.filter(
      (r) =>
        r.signup_type === "club_host" &&
        ["new", "reviewed", "contacted"].includes(r.status)
    );
  } catch (err) {
    warning = err instanceof Error ? err.message : "Could not load waitlist.";
  }

  const admin = getAdminClient();
  const { data: clubs, error: clubErr } = await admin
    .from("clubs")
    .select("id, slug, name, owner_id")
    .order("created_at", { ascending: false })
    .limit(50);

  if (clubErr) {
    if (!warning) {
      warning = clubErr.message.includes("does not exist")
        ? "Run supabase/migrations/013_member_media.sql"
        : clubErr.message;
    }
  }

  const ownerIds = (clubs ?? [])
    .map((c) => (c as { owner_id: string | null }).owner_id)
    .filter((id): id is string => Boolean(id));

  const ownerNames = new Map<string, string>();
  if (ownerIds.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, first_name, display_name, email")
      .in("id", ownerIds);
    for (const row of profiles ?? []) {
      const p = row as { id: string; first_name: string | null; display_name: string | null; email: string | null };
      ownerNames.set(
        p.id,
        p.display_name?.trim() || p.first_name?.trim() || p.email?.split("@")[0] || "Club Mama"
      );
    }
  }

  const activeClubs: FounderClubRow[] = (clubs ?? []).map((row) => {
    const c = row as { id: string; slug: string; name: string; owner_id: string | null };
    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      ownerId: c.owner_id,
      ownerName: c.owner_id ? ownerNames.get(c.owner_id) ?? null : null,
      managePath: `/member/clubs/${c.slug}/manage`,
    };
  });

  return { pendingHosts, activeClubs, warning };
}
