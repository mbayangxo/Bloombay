import { HomePage } from "@/app/components/portal/home-page";
import { getAuthUser } from "@/lib/auth/get-user";

export default async function MemberHomePage() {
  const authUser = await getAuthUser();
  const firstName = authUser?.first_name ?? authUser?.full_name ?? "there";
  const initial = firstName[0].toUpperCase();
  return <HomePage firstName={firstName} initial={initial} />;
}
