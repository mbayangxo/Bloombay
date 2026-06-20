import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { GirlsWorkingStudio } from "@/app/components/founder/girls-working-studio";

export default function AdminGirlsWorkingPage() {
  return (
    <AdminOpsShell
      title="Girls Working"
      subtitle="NYC job board for the Lobby · Girls Working room."
      compactHeader
    >
      <GirlsWorkingStudio />
    </AdminOpsShell>
  );
}
