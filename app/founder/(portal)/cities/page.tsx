import { FounderShell } from "@/app/components/admin/founder-shell";
import { CityLaunchPanel } from "@/app/components/admin/portal/city-launch-panel";

export default function FounderCitiesPage() {
  return (
    <FounderShell title="Cities" subtitle="Bloom Score · launch or wait · city requests.">
      <CityLaunchPanel />
    </FounderShell>
  );
}
