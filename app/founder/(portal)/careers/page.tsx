import { FounderShell } from "@/app/components/admin/founder-shell";
import { CareersMissionPanel } from "@/app/components/admin/portal/careers-mission-panel";
import { fetchAllCareerApplications } from "@/lib/supabase-admin";
import type { CareerApplicationRow } from "@/lib/careers-admin";

export const revalidate = 45;

export default async function FounderCareersPage() {
  let rows: CareerApplicationRow[] = [];
  let loadError: string | null = null;

  try {
    rows = await fetchAllCareerApplications();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load career applications.";
  }

  return (
    <FounderShell
      title="Careers"
      subtitle="Resumes and cover letters from the public careers page."
    >
      {loadError ? (
        <p className="bb-admin-login-error" style={{ marginBottom: "1rem" }}>
          {loadError}
        </p>
      ) : (
        <CareersMissionPanel initialRows={rows} />
      )}
    </FounderShell>
  );
}
