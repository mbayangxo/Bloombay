import { redirect } from "next/navigation";

export default async function ClubApplyRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/member/clubs/${id}/join`);
}
