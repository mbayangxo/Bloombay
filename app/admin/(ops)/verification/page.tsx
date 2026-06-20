import { AdminOpsShell } from "@/app/components/admin/admin-ops-shell";
import { VerificationQueue } from "@/app/components/admin/verification-queue";
import { fetchAllWaitlistRows } from "@/lib/supabase-admin";
import type { WaitlistRow } from "@/lib/waitlist-admin";

export const revalidate = 45;

export default async function AdminVerificationPage() {
  let rows: WaitlistRow[] = [];
  let loadError: string | null = null;

  try {
    rows = await fetchAllWaitlistRows();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load queue.";
  }

  return (
    <AdminOpsShell title="Verification" subtitle="Working moderation queue">
      {loadError ? (
        <p className="bb-admin-login-error">{loadError}</p>
      ) : (
        <VerificationQueue initialRows={rows} />
      )}
    </AdminOpsShell>
  );
}
