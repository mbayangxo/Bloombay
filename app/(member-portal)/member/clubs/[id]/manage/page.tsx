import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { ClubManageDashboard } from "@/app/components/portal/club-manage-dashboard";

export default async function ClubManagePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");

  const supabase = await createClient();

  const { id } = await params;
  const isUuid = /^[0-9a-f-]{36}$/i.test(id);
  const q = supabase.from("clubs").select("id, slug, owner_id, name, tagline, description, neighborhood, primary_color, membership_type, member_limit, cover_url, category");
  const { data: club, error } = isUuid
    ? await q.eq("id", id).single()
    : await q.eq("slug", id).single();

  if (error || !club) notFound();
  if (club.owner_id !== user.id) redirect(`/member/clubs/${id}`);

  return <ClubManageDashboard club={club as Parameters<typeof ClubManageDashboard>[0]["club"]} />;
}
