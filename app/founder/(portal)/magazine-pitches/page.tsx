import { FounderShell } from "@/app/components/admin/founder-shell";
import { MagazinePitchesPanel } from "@/app/components/admin/portal/magazine-pitches-panel";

export default function MagazinePitchesPage() {
  return (
    <FounderShell title="Magazine Pitches" compactHeader>
      <MagazinePitchesPanel />
    </FounderShell>
  );
}
