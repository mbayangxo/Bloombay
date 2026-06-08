import { Suspense } from "react";
import { getAuthUser } from "@/lib/auth/get-user";
import { LoungePage } from "@/app/components/portal/lounge-page";

export default async function MemberLoungePage() {
  const authUser = await getAuthUser();
  const name = authUser?.full_name ?? authUser?.first_name ?? "Member";
  const user = {
    id: authUser?.id,
    name,
    initial: name[0].toUpperCase(),
    neighborhood: authUser?.neighborhood ?? authUser?.borough ?? "NYC",
    bio: authUser?.bio ?? undefined,
    avatarUrl: authUser?.avatar_url ?? null,
  };
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--pale-pink-bg)" }} />}>
      <LoungePage user={user} />
    </Suspense>
  );
}
