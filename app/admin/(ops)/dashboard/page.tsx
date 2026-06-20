import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { DashboardOverview } from "@/app/components/admin/dashboard-overview";
import {
  cohortWithFallback,
  fetchCohort14FromDb,
  fetchTodaysBloomFromDb,
  todaysBloomWithFallback,
} from "@/lib/irl/founder-metrics";
import { fetchAllWaitlistRows } from "@/lib/supabase-admin";
import type { WaitlistRow } from "@/lib/waitlist-admin";

/** Cache overview data briefly — keeps Mission Control snappy while staying fresh enough. */
export const revalidate = 45;

export default async function AdminDashboardPage() {
  let rows: WaitlistRow[] = [];
  let loadError: string | null = null;

  let cohort14 = undefined;
  let todaysBloom = undefined;

  try {
    rows = await fetchAllWaitlistRows();
    const [cohortDb, bloomDb] = await Promise.all([
      fetchCohort14FromDb(),
      fetchTodaysBloomFromDb(rows),
    ]);
    cohort14 = cohortWithFallback(cohortDb);
    todaysBloom = todaysBloomWithFallback(bloomDb, rows);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load portal data.";
  }

  return (
    <AdminOpsShell
      title="Overview"
      subtitle="BloomBay Mission Control — cities, clubs, women, partners, and trust."
    >
      {loadError ? (
        <p className="bb-admin-login-error" style={{ marginBottom: "1rem" }}>
          {loadError}. Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
          <code>.env.local</code> and run <code>supabase/apply-all.sql</code>.
        </p>
      ) : null}
      <DashboardOverview rows={rows} cohort14={cohort14} todaysBloom={todaysBloom} />
    </AdminOpsShell>
  );
}
