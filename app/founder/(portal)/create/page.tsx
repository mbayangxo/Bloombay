import { FounderShell } from "@/app/components/admin/founder-shell";
import { CreateSpaceCenter } from "@/app/components/founder/create-space/create-space-center";
import "@/app/styles/founder-create-space.css";

export default function FounderCreateSpacePage() {
  return (
    <FounderShell
      title="Create space"
      subtitle="Layered themes · weather-aware calendar · ideas · magazine posts · Daily Bloom · posters."
    >
      <CreateSpaceCenter />
    </FounderShell>
  );
}
