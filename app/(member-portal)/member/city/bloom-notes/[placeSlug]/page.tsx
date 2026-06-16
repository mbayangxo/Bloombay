import { BloomNotesPage } from "@/app/components/portal/bloom-notes-page";

export default async function BloomNotesRoute({
  params,
}: {
  params: Promise<{ placeSlug: string }>;
}) {
  const { placeSlug } = await params;
  return <BloomNotesPage placeSlug={placeSlug} />;
}
