import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { ReportsMissionPanel } from "@/app/components/admin/portal/reports-mission-panel";

export default function AdminReportsPage() {
  return (
    <AdminOpsShell
      title="Reports"
      subtitle="Growth, safety, and referral snapshots across BloomBay."
      compactHeader
    >
      <ReportsMissionPanel basePath="/admin" />
    </AdminOpsShell>
  );
}
