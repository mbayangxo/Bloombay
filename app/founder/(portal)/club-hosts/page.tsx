import { FounderShell } from "@/app/components/admin/founder-shell";
import { ClubHostsMissionPanel } from "@/app/components/admin/portal/club-hosts-mission-panel";

export default function FounderClubHostsPage() {
  return (
    <FounderShell
      title="Hosts"
      subtitle="Clubhouse leads — approve, coach, and track attendance."
      compactHeader
    >
      <ClubHostsMissionPanel basePath="/founder" />
    </FounderShell>
  );
}
