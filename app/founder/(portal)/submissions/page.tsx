import { FounderShell } from "@/app/components/admin/founder-shell";
import { SubmissionsHub } from "@/app/components/admin/portal/submissions-hub";
import { fetchAllWaitlistRows } from "@/lib/supabase-admin";
import type { WaitlistRow } from "@/lib/waitlist-admin";

export const revalidate = 45;

export default async function FounderSubmissionsPage() {
  let rows: WaitlistRow[] = [];
  let loadError: string | null = null;

  try {
    rows = await fetchAllWaitlistRows();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load submissions.";
  }

  return (
    <FounderShell
      title="Submissions"
      subtitle="Open a queue to review waitlist rows by type or status."
      compactHeader
    >
      {loadError ? (
        <p className="bb-admin-login-error" style={{ marginBottom: "1rem" }}>
          {loadError}
        </p>
      ) : (
        <SubmissionsHub rows={rows} staffBase="/founder" />
      )}
    </FounderShell>
  );
}
