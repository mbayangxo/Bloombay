import { createClient } from "@/lib/supabase/server";
import { EventCreatePage } from "@/app/components/portal/event-create-page";

export default async function CreateEventRoute({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; title?: string }>;
}) {
  const { kind, title } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let govIdVerified = false;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("gov_id_verification_status")
      .eq("id", user.id)
      .single();
    govIdVerified = (data as { gov_id_verification_status?: string } | null)?.gov_id_verification_status === "verified";
  }

  return <EventCreatePage initialKind={kind} initialTitle={title} govIdVerified={govIdVerified} />;
}
