import type { Cohort14Row } from "@/lib/founder-cohort14";
import type { TodaysBloomLine } from "@/lib/founder-todays-bloom";
import { TODAYS_BLOOM_NARRATIVE } from "@/lib/founder-todays-bloom";
import { COHORT_14_FUNNEL } from "@/lib/founder-cohort14";
import { getAdminClient } from "@/lib/supabase-admin";
import type { WaitlistRow } from "@/lib/waitlist-admin";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function weekWindow(weeksAgo: number): { start: Date; end: Date; label: string } {
  const end = new Date();
  end.setDate(end.getDate() - weeksAgo * 7);
  const start = new Date(end);
  start.setDate(start.getDate() - 7);
  const label =
    weeksAgo === 0 ? "This week" : weeksAgo === 1 ? "Last week" : `${weeksAgo + 1} weeks ago`;
  return { start, end, label };
}

type ProfileLite = { id: string; created_at: string; verified: boolean };

async function loadFunnelInputs() {
  const supabase = getAdminClient();
  const profilesRes = await supabase.from("profiles").select("id, created_at, verified");

  if (profilesRes.error?.message?.includes("does not exist")) return null;

  const profiles = (profilesRes.data ?? []) as ProfileLite[];
  if (!profiles.length) {
    return {
      profiles,
      clubUsers: new Set<string>(),
      seatUsers: new Set<string>(),
      attendUsers: new Set<string>(),
    };
  }

  const ids = profiles.map((p) => p.id);
  const [clubsRes, seatsRes, attendRes] = await Promise.all([
    supabase.from("club_memberships").select("user_id").in("user_id", ids),
    supabase.from("seat_reservations").select("user_id").eq("status", "reserved").in("user_id", ids),
    supabase.from("gathering_attendance").select("user_id").in("user_id", ids),
  ]);

  const clubUsers = new Set((clubsRes.data ?? []).map((r) => r.user_id as string));
  const seatUsers = new Set((seatsRes.data ?? []).map((r) => r.user_id as string));
  const attendUsers = new Set((attendRes.data ?? []).map((r) => r.user_id as string));

  return { profiles, clubUsers, seatUsers, attendUsers };
}

export async function fetchCohort14FromDb(): Promise<Cohort14Row[] | null> {
  try {
    const input = await loadFunnelInputs();
    if (!input) return null;

    const { profiles, clubUsers, seatUsers, attendUsers } = input;

    return [0, 1, 2].map((weeksAgo) => {
      const { start, end, label } = weekWindow(weeksAgo);
      const inCohort = profiles.filter((p) => {
        const t = new Date(p.created_at);
        return t >= start && t < end;
      });
      const ids = inCohort.map((p) => p.id);
      return {
        cohort: label,
        joined: ids.length,
        verified: inCohort.filter((p) => p.verified).length,
        joinedClub: ids.filter((id) => clubUsers.has(id)).length,
        reservedSeat: ids.filter((id) => seatUsers.has(id)).length,
        attended: ids.filter((id) => attendUsers.has(id)).length,
      };
    });
  } catch {
    return null;
  }
}

export async function fetchTodaysBloomFromDb(
  waitlistRows: WaitlistRow[]
): Promise<TodaysBloomLine[] | null> {
  try {
    const supabase = getAdminClient();
    const today = startOfDay(new Date()).toISOString();

    const [joinedRes, unverifiedRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", today),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("verified", false),
    ]);

    if (joinedRes.error?.message?.includes("does not exist")) return null;

    const joinedToday = joinedRes.count ?? 0;
    const needsVerification = unverifiedRes.count ?? 0;
    const partnerPending = waitlistRows.filter(
      (r) => r.signup_type === "partner" && r.status === "new"
    ).length;
    const memberPending = waitlistRows.filter(
      (r) => r.signup_type === "member" && r.status === "new"
    ).length;

    const lines: TodaysBloomLine[] = [];
    if (joinedToday > 0) {
      lines.push({
        text: `${joinedToday} women joined today.`,
        tone: "celebrate",
        href: "/admin/people",
      });
    }
    if (memberPending > 0) {
      lines.push({
        text: `${memberPending} new member waitlist signups need review.`,
        tone: "action",
        href: "/admin/applications",
      });
    }
    if (partnerPending > 0) {
      lines.push({
        text: `${partnerPending} partner application${partnerPending === 1 ? "" : "s"} need review.`,
        tone: "action",
        href: "/admin/partners",
      });
    }
    if (needsVerification > 0) {
      lines.push({
        text: `${needsVerification} profiles still need verification.`,
        tone: "action",
        href: "/admin/verification",
      });
    }

    const cohort = await fetchCohort14FromDb();
    const thisWeek = cohort?.[0];
    if (thisWeek && thisWeek.joined > 0) {
      const rate = Math.round((thisWeek.attended / thisWeek.joined) * 100);
      lines.push({
        text: `This week's cohort: ${thisWeek.attended} of ${thisWeek.joined} attended IRL (${rate}%).`,
        tone: rate >= 25 ? "celebrate" : "watch",
        href: "/admin/dashboard",
      });
    }

    return lines.length ? lines : null;
  } catch {
    return null;
  }
}

export function cohortWithFallback(db: Cohort14Row[] | null): Cohort14Row[] {
  return db && db.some((r) => r.joined > 0) ? db : COHORT_14_FUNNEL;
}

export function todaysBloomWithFallback(
  db: TodaysBloomLine[] | null,
  waitlistRows: WaitlistRow[]
): TodaysBloomLine[] {
  if (db?.length) return db;
  if (waitlistRows.length) {
    const newMembers = waitlistRows.filter((r) => r.signup_type === "member" && r.status === "new").length;
    if (newMembers > 0) {
      return [
        {
          text: `${newMembers} member applications in waitlist (demo narrative until profiles fill).`,
          tone: "action",
          href: "/admin/applications",
        },
        ...TODAYS_BLOOM_NARRATIVE.slice(0, 3),
      ];
    }
  }
  return TODAYS_BLOOM_NARRATIVE;
}
