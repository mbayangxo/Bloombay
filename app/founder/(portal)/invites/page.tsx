import { FounderShell } from "@/app/components/admin/founder-shell";
import { FounderPortalInvites } from "@/app/components/founder/founder-portal-invites";

export default function FounderInvitesPage() {
  return (
    <FounderShell
      title="Portal invites"
      subtitle="Send create-account links — role is set automatically; no dropdown at sign-in."
    >
      <FounderPortalInvites />
    </FounderShell>
  );
}
