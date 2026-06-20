import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { SubmissionsTable } from "@/app/components/admin/submissions-table";
import { fetchAllWaitlistRows } from "@/lib/supabase-admin";
import type { WaitlistRow } from "@/lib/waitlist-admin";

export const revalidate = 45;

export default async function AdminSubmissionsPage() {
  let rows: WaitlistRow[] = [];
  let loadError: string | null = null;

  try {
    rows = await fetchAllWaitlistRows();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load submissions.";
  }

  return (
    <AdminOpsShell
      title="Submissions"
      subtitle="Waitlist & application rows — update status as women move through the funnel."
      compactHeader
    >
      {loadError ? (
        <p className="bb-admin-login-error" style={{ marginBottom: "1rem" }}>
          {loadError}
        </p>
      ) : (
        <SubmissionsTable initialRows={rows} showActions />
      )}
    </AdminOpsShell>
  );
}
