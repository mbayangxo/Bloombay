import { FounderShell } from "@/app/components/admin/founder-shell";
import { NeighborhoodsMissionPanel } from "@/app/components/admin/portal/neighborhoods-mission-panel";

export default function FounderNeighborhoodsPage() {
  return (
    <FounderShell
      title="Neighborhoods"
      subtitle="Launch heat maps — where women are waiting to bloom."
      compactHeader
    >
      <NeighborhoodsMissionPanel />
    </FounderShell>
  );
}
