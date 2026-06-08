import { notFound } from "next/navigation";
import { FounderShell } from "@/app/components/admin/founder-shell";
import { SubmissionsQueuePanel } from "@/app/components/admin/portal/submissions-queue-panel";
import { fetchAllWaitlistRows } from "@/lib/supabase-admin";
import {
  filterRowsByQueue,
  getSubmissionQueue,
  isSubmissionQueueSlug,
} from "@/lib/submissions-queues";

export const revalidate = 45;

type PageProps = {
  params: Promise<{ queue: string }>;
};

export default async function FounderSubmissionQueuePage({ params }: PageProps) {
  const { queue: queueParam } = await params;

  if (!isSubmissionQueueSlug(queueParam)) {
    notFound();
  }

  const queue = getSubmissionQueue(queueParam);
  if (!queue) notFound();

  let rows: Awaited<ReturnType<typeof fetchAllWaitlistRows>> = [];
  let loadError: string | null = null;

  try {
    const all = await fetchAllWaitlistRows();
    rows = filterRowsByQueue(all, queueParam);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load submissions.";
  }

  return (
    <FounderShell title={queue.title} subtitle={queue.blurb} compactHeader>
      {loadError ? (
        <p className="bb-admin-login-error" style={{ marginBottom: "1rem" }}>
          {loadError}
        </p>
      ) : (
        <SubmissionsQueuePanel rows={rows} queue={queueParam} staffBase="/founder" />
      )}
    </FounderShell>
  );
}
