import { FounderShell } from "@/app/components/admin/founder-shell";
import { BloomRequestsPanel } from "@/app/components/admin/portal/bloom-requests-panel";

export default function FounderBloomRequestsPage() {
  return (
    <FounderShell title="Bloom requests" subtitle="What women want — seeds clubs & gatherings.">
      <BloomRequestsPanel />
    </FounderShell>
  );
}
