import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { ClubHostsMissionPanel } from "@/app/components/admin/portal/club-hosts-mission-panel";

export default function AdminClubHostsPage() {
  return (
    <AdminOpsShell
      title="Hosts"
      subtitle="Clubhouse leads — approve, coach, and track attendance."
      compactHeader
    >
      <ClubHostsMissionPanel basePath="/admin" />
    </AdminOpsShell>
  );
}
