import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { ProfilePage } from "@/app/components/portal/profile-page";

export default async function SettingsPage() {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");
  return <ProfilePage user={user} defaultTab="settings" />;
}
