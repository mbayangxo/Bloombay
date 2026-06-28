// Friendship Health — runs every Sunday at 11pm UTC
// Rebuilds co-attendance scores from event check-ins + friend scans.
// Looks back 90 days. Score = co_attendance×10 + friend_scan×25.

import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runCronJob } from "@/lib/cron-guard";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  return runCronJob(req, "friendship-health", async (ctx) => {
    if (ctx.dryRun) {
      return { recordsProcessed: 0, dry_run: true, message: "Dry run — no data written" };
    }

    const supabase = admin();
    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const { data: checkins, error: cErr } = await supabase
      .from("event_checkins")
      .select("event_id, user_id, checked_in_at")
      .gte("checked_in_at", since)
      .limit(ctx.maxRecords * 10);

    if (cErr) throw new Error(cErr.message);

    const { data: scans, error: sErr } = await supabase
      .from("friend_scans")
      .select("initiator_id, scanned_id, scanned_at")
      .gte("scanned_at", since)
      .limit(ctx.maxRecords * 10);

    if (sErr) throw new Error(sErr.message);

    const eventMap = new Map<string, { users: string[]; when: string }>();
    for (const c of checkins ?? []) {
      const existing = eventMap.get(c.event_id);
      if (existing) {
        existing.users.push(c.user_id);
      } else {
        eventMap.set(c.event_id, { users: [c.user_id], when: c.checked_in_at });
      }
    }

    type PairData = { co: number; scans: number; lastSeen: string };
    const pairMap = new Map<string, PairData>();

    function pairKey(a: string, b: string) {
      return a < b ? `${a}|${b}` : `${b}|${a}`;
    }

    for (const { users, when } of eventMap.values()) {
      if (users.length < 2) continue;
      for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
          const key = pairKey(users[i], users[j]);
          const existing = pairMap.get(key);
          if (existing) {
            existing.co++;
            if (when > existing.lastSeen) existing.lastSeen = when;
          } else {
            pairMap.set(key, { co: 1, scans: 0, lastSeen: when });
          }
        }
      }
    }

    for (const scan of scans ?? []) {
      const key = pairKey(scan.initiator_id, scan.scanned_id);
      const existing = pairMap.get(key);
      if (existing) {
        existing.scans++;
      } else {
        pairMap.set(key, { co: 0, scans: 1, lastSeen: scan.scanned_at });
      }
    }

    const rows = Array.from(pairMap.entries())
      .slice(0, ctx.maxRecords)
      .map(([key, data]) => {
        const [user_a, user_b] = key.split("|");
        return {
          user_a,
          user_b,
          co_attendance_count: data.co,
          friend_scan_count: data.scans,
          score: data.co * 10 + data.scans * 25,
          last_seen_together: data.lastSeen,
          updated_at: new Date().toISOString(),
        };
      });

    if (!rows.length) {
      return { recordsProcessed: 0, pairs: 0 };
    }

    let upserted = 0;
    for (let i = 0; i < rows.length; i += 200) {
      const batch = rows.slice(i, i + 200);
      const { error } = await supabase
        .from("friendship_scores")
        .upsert(batch, { onConflict: "user_a,user_b" });
      if (error) throw new Error(error.message);
      upserted += batch.length;
    }

    return { recordsProcessed: upserted, pairs: upserted };
  });
}
