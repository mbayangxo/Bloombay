import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { CityPicksReview } from "@/app/components/admin/portal/city-picks-review";

export default function AdminCityPicksPage() {
  return (
    <AdminOpsShell
      title="City Picks"
      subtitle="Approve or reject member-submitted Girl Gems and cron-scraped spots before they go live in Eat/Go/Solo."
      compactHeader
    >
      <CityPicksReview />
    </AdminOpsShell>
  );
}
