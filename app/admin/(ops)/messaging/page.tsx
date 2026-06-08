import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { MessagingStudio } from "@/app/components/founder/messaging-studio";

export default function AdminMessagingPage() {
  return (
    <AdminOpsShell title="Messaging Studio" subtitle="Automated member emails, SMS, and in-app messages." compactHeader>
      <MessagingStudio />
    </AdminOpsShell>
  );
}
