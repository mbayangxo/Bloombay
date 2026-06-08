import { FounderShell } from "@/app/components/admin/founder-shell";
import { PartnersPipeline } from "@/app/components/admin/portal/partners-pipeline";
import { fetchAllWaitlistRows } from "@/lib/supabase-admin";
import type { WaitlistRow } from "@/lib/waitlist-admin";

export const revalidate = 45;

export default async function AdminPartnersPage() {
  let rows: WaitlistRow[] = [];
  let loadError: string | null = null;

  try {
    const all = await fetchAllWaitlistRows();
    rows = all.filter((r) => r.signup_type === "partner");
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load partners.";
  }

  return (
    <FounderShell title="Partners" compactHeader>
      {loadError ? (
        <p className="bb-admin-login-error">{loadError}</p>
      ) : (
        <PartnersPipeline initialRows={rows} />
      )}
    </FounderShell>
  );
}
