import {
  aggregateDashboard,
  type WaitlistRow,
  type WaitlistFilters,
  type SignupType,
} from "@/lib/waitlist-admin";
import { ApplicationsCenter } from "./portal/applications-center";

export function ApplicationsHub({
  rows,
  initialFilters,
}: {
  rows: WaitlistRow[];
  initialFilters?: WaitlistFilters;
}) {
  void aggregateDashboard(rows);
  const initialType = initialFilters?.type as SignupType | undefined;

  return <ApplicationsCenter rows={rows} initialType={initialType} />;
}
