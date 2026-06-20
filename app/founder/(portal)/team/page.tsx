import { FounderShell } from "@/app/components/admin/founder-shell";
import { FounderTeamCenter } from "@/app/components/admin/portal/founder-team-center";

export default function FounderTeamPage() {
  return (
    <FounderShell
      title="Team"
      subtitle="Assign moderators and girl curators · pay from Mission Control."
    >
      <FounderTeamCenter />
    </FounderShell>
  );
}
