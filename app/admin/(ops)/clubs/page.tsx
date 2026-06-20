import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { ClubsHub } from "@/app/components/admin/clubs-hub";

export default function AdminClubsPage() {
  return (
    <AdminOpsShell
      title="Clubs"
      subtitle="Club creation and growth — hosts, venues, and launch readiness."
    >
      <ClubsHub staffBase="/admin" />
    </AdminOpsShell>
  );
}
