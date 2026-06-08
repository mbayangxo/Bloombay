import { FounderShell } from "@/app/components/admin/founder-shell";
import { YandeMissionCenter } from "@/app/components/admin/portal/yande-mission-center";

export default function FounderYandePage() {
  return (
    <FounderShell
      title="Yande Mission Center"
      subtitle="What women want — clubs, cities, complaints, community health."
    >
      <YandeMissionCenter />
    </FounderShell>
  );
}
