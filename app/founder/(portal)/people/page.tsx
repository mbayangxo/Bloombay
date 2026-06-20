import { FounderShell } from "@/app/components/admin/founder-shell";
import { PeopleMissionPanel } from "@/app/components/admin/portal/people-mission-panel";

export default function FounderPeoplePage() {
  return (
    <FounderShell title="People" subtitle="Hosts, curators, moderators, city leads — trust & attendance scores.">
      <PeopleMissionPanel />
    </FounderShell>
  );
}
