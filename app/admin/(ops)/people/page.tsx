import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { PeopleMissionPanel } from "@/app/components/admin/portal/people-mission-panel";

export default function FounderPeoplePage() {
  return (
    <AdminOpsShell title="People" subtitle="Hosts, curators, moderators, city leads — trust & attendance scores.">
      <PeopleMissionPanel />
    </AdminOpsShell>
  );
}
