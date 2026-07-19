import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { ClubWelcomeClient } from "./welcome-client";

export default async function ClubWelcomePage({ params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");

  const supabase = await createClient();

  // Support both UUID-format IDs (legacy seed data) and slug-format — mirrors clubs/[id]/page.tsx
  const isUuid = /^[0-9a-f-]{36}$/i.test(params.id);
  const baseQuery = supabase.from("clubs").select("id, name, slug");
  const { data: club, error } = isUuid
    ? await baseQuery.eq("id", params.id).single()
    : await baseQuery.eq("slug", params.id).single();

  if (error || !club) notFound();

  return <ClubWelcomeClient clubId={params.id} clubName={club.name} />;
}
