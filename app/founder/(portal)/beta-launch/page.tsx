import { FounderShell } from "@/app/components/admin/founder-shell";
import { BetaLaunchChecklist } from "@/app/components/founder/beta-launch-checklist";

export default function FounderBetaLaunchPage() {
  return (
    <FounderShell
      title="Beta launch"
      subtitle="Operator checklist — verify infrastructure, trust, and Club Mama readiness every morning."
      compactHeader
    >
      <BetaLaunchChecklist />
    </FounderShell>
  );
}
