import { notFound } from "next/navigation";
import { FounderShell } from "@/app/components/admin/founder-shell";
import { EventsStudio } from "@/app/components/events/events-studio";
import { EVENT_KIND_META, type EventKind } from "@/lib/bloombay-events-store";

const KINDS = ["blueday", "current", "regular", "hq"] as const;

export default async function FounderEventKindPage({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = await params;
  if (!KINDS.includes(kind as EventKind)) notFound();
  const k = kind as EventKind;
  const meta = EVENT_KIND_META[k];

  return (
    <FounderShell title={meta.title} subtitle={meta.blurb} compactHeader>
      <EventsStudio kind={k} staffBase="/founder" backHref="/founder/events" />
    </FounderShell>
  );
}
