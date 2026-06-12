import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { ClubManageDashboard } from "@/app/components/portal/club-manage-dashboard";

export default async function ClubManagePage({ params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");

  const supabase = await createClient();

  const isUuid = /^[0-9a-f-]{36}$/i.test(params.id);
  const q = supabase.from("clubs").select("id, slug, owner_id, name, tagline, description, neighborhood, primary_color, membership_type, member_limit, cover_url, category");
  const { data: club, error } = isUuid
    ? await q.eq("id", params.id).single()
    : await q.eq("slug", params.id).single();

  if (error || !club) notFound();
  if (club.owner_id !== user.id) redirect(`/member/clubs/${params.id}`);

  return <ClubManageDashboard club={club as Parameters<typeof ClubManageDashboard>[0]["club"]} />;
}
