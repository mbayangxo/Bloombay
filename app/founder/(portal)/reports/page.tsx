import { FounderShell } from "@/app/components/admin/founder-shell";
import { ReportsMissionPanel } from "@/app/components/admin/portal/reports-mission-panel";

export default function FounderReportsPage() {
  return (
    <FounderShell
      title="Reports"
      subtitle="Growth, safety, and referral snapshots across BloomBay."
      compactHeader
    >
      <ReportsMissionPanel basePath="/founder" />
    </FounderShell>
  );
}
