import type { Cohort14Row } from "@/lib/founder-cohort14";
import type { TodaysBloomLine } from "@/lib/founder-todays-bloom";
import type { StaffBase } from "@/lib/mc-paths";
import type { WaitlistRow } from "@/lib/waitlist-admin";
import { OverviewDashboard } from "./portal/overview-dashboard";

export function DashboardOverview({
  rows,
  cohort14,
  todaysBloom,
  staffBase = "/admin",
}: {
  rows: WaitlistRow[];
  cohort14?: Cohort14Row[];
  todaysBloom?: TodaysBloomLine[];
  staffBase?: StaffBase;
}) {
  return (
    <OverviewDashboard
      rows={rows}
      cohort14={cohort14}
      todaysBloom={todaysBloom}
      staffBase={staffBase}
    />
  );
}
