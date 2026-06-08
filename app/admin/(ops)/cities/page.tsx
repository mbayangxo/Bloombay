import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { CityLaunchPanel } from "@/app/components/admin/portal/city-launch-panel";

export default function FounderCitiesPage() {
  return (
    <AdminOpsShell title="Cities" subtitle="Bloom Score · launch or wait · city requests.">
      <CityLaunchPanel />
    </AdminOpsShell>
  );
}
