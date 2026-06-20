import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { BloomRequestsPanel } from "@/app/components/admin/portal/bloom-requests-panel";

export default function FounderBloomRequestsPage() {
  return (
    <AdminOpsShell title="Bloom requests" subtitle="What women want — seeds clubs & gatherings.">
      <BloomRequestsPanel />
    </AdminOpsShell>
  );
}
