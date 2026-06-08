import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { ApplicationsHub } from "@/app/components/admin/applications-hub";
import { fetchAllWaitlistRows } from "@/lib/supabase-admin";
import type { SignupType, WaitlistRow, WaitlistStatus } from "@/lib/waitlist-admin";

export const revalidate = 45;

type SearchParams = Promise<{
  type?: string;
  status?: string;
  city?: string;
  interest?: string;
}>;

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  let rows: WaitlistRow[] = [];
  let loadError: string | null = null;

  try {
    rows = await fetchAllWaitlistRows();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load applications.";
  }

  return (
    <AdminOpsShell
      title="Applications"
      subtitle="Master inbox — approve, reject, and review every application."
    >
      {loadError ? (
        <p className="bb-admin-login-error" style={{ marginBottom: "1rem" }}>
          {loadError}
        </p>
      ) : (
        <ApplicationsHub
          rows={rows}
          initialFilters={{
            type: params.type as SignupType | undefined,
            status: params.status as WaitlistStatus | undefined,
            city: params.city,
            interest: params.interest,
          }}
        />
      )}
    </AdminOpsShell>
  );
}
