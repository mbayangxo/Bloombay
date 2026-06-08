import { FounderShell } from "@/app/components/admin/founder-shell";
import { InboxCenter } from "@/app/components/admin/portal/inbox-center";

export default function AdminInboxPage() {
  return (
    <FounderShell title="Inbox" compactHeader>
      <InboxCenter />
    </FounderShell>
  );
}
