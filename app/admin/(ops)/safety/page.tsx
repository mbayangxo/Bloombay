import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { SafetyCenter } from "@/app/components/admin/portal/safety-center";

export default function AdminSafetyPage() {
  return (
    <AdminOpsShell title="Safety" compactHeader>
      <SafetyCenter />
    </AdminOpsShell>
  );
}
