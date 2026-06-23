import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { ClubDesignStudio } from "@/app/components/portal/club-design-studio";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export default async function ClubDesignPage({ params }: RouteParams) {
  const { id } = await params;

  const user = await getAuthUser();
  if (!user) redirect("/member/login");

  const supabase = await createClient();

  const isUuid = /^[0-9a-f-]{36}$/i.test(id);
  const q = supabase
    .from("clubs")
    .select("id, name, slug, owner_id, primary_color, accent_color, tagline, description, status, cover_url, banner_url");

  const { data: club, error } = isUuid
    ? await q.eq("id", id).single()
    : await q.eq("slug", id).single();

  if (error || !club) notFound();
  if (club.owner_id !== user.id) redirect(`/member/clubs/${id}`);

  return <ClubDesignStudio club={club} />;
}
