import { EventCreatePage } from "@/app/components/portal/event-create-page";

export default async function CreateEventRoute({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; title?: string }>;
}) {
  const { kind, title } = await searchParams;
  return <EventCreatePage initialKind={kind} initialTitle={title} />;
}
