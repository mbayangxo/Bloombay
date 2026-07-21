import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { NightsQueueClient } from "@/app/components/admin/nights-queue-client";

export default function AdminNightsPage() {
  return (
    <AdminOpsShell
      title="Nights queue"
      subtitle="Eventbrite + Submit a night — approve to publish on Happenings."
    >
      <NightsQueueClient />
    </AdminOpsShell>
  );
}
