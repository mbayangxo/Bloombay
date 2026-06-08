import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { HappeningsMissionPanel } from "@/app/components/admin/portal/happenings-mission-panel";

export default function AdminEventsPage() {
  return (
    <AdminOpsShell
      title="Happenings"
      subtitle="Gatherings, seats, and attendance — the IRL layer of BloomBay."
      compactHeader
    >
      <HappeningsMissionPanel basePath="/admin" />
    </AdminOpsShell>
  );
}
