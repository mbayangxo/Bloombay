import { getAuthUser } from "@/lib/auth/get-user";
import { LoungePage } from "@/app/components/portal/lounge-page";

export default async function MemberLoungePage() {
  const authUser = await getAuthUser();
  const name = authUser?.full_name ?? authUser?.first_name ?? "Member";
  const user = {
    name,
    initial: name[0].toUpperCase(),
    neighborhood: authUser?.neighborhood ?? authUser?.borough ?? "NYC",
    bio: authUser?.bio ?? undefined,
  };
  return <LoungePage user={user} />;
}
