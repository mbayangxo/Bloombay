import { FounderShell } from "@/app/components/admin/founder-shell";
import { SafetyCenter } from "@/app/components/admin/portal/safety-center";

export default function AdminSafetyPage() {
  return (
    <FounderShell title="Safety" compactHeader>
      <SafetyCenter />
    </FounderShell>
  );
}
