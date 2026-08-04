import { FounderShell } from "@/app/components/admin/founder-shell";
import { CityPicksReview } from "@/app/components/admin/portal/city-picks-review";

export default function FounderCityPicksPage() {
  return (
    <FounderShell
      title="City Picks"
      subtitle="Approve or reject member-submitted Girl Gems and cron-scraped spots before they go live in Eat/Go/Solo."
      compactHeader
    >
      <CityPicksReview />
    </FounderShell>
  );
}
