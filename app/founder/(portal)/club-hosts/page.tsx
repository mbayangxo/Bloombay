import { FounderShell } from "@/app/components/admin/founder-shell";
import { ClubHostsMissionPanel } from "@/app/components/admin/portal/club-hosts-mission-panel";
import { fetchFounderClubHostOps } from "@/lib/founder/club-host-ops";

export const revalidate = 45;

export default async function FounderClubHostsPage() {
  const { pendingHosts, activeClubs, warning } = await fetchFounderClubHostOps();

  return (
    <FounderShell
      title="Hosts"
      subtitle="Club Mama queue — approve waitlist hosts and open live club manage paths."
      compactHeader
    >
      <ClubHostsMissionPanel
        basePath="/founder"
        pendingHosts={pendingHosts}
        activeClubs={activeClubs}
        warning={warning}
      />
    </FounderShell>
  );
}
