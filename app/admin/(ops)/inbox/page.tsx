import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { InboxCenter } from "@/app/components/admin/portal/inbox-center";

export default function AdminInboxPage() {
  return (
    <AdminOpsShell title="Inbox" compactHeader>
      <InboxCenter />
    </AdminOpsShell>
  );
}
