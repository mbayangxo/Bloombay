import { FounderShell } from "@/app/components/admin/founder-shell";
import { MarketingAssistantPage } from "@/app/components/admin/portal/marketing-assistant-page";

export default function FounderMarketingPage() {
  return (
    <FounderShell
      title="Brand Intelligence"
      subtitle="Your marketing mind — powered by what you tell her."
    >
      <MarketingAssistantPage />
    </FounderShell>
  );
}
