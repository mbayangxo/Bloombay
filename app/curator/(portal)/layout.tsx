import { redirect } from "next/navigation";
import { getMissionControlRole } from "@/lib/auth/get-mc-role";
import { canSignInCuratorPortal } from "@/lib/auth/mission-control";

export default async function CuratorPortalLayout({ children }: { children: React.ReactNode }) {
  const role = await getMissionControlRole();
  if (!role || !canSignInCuratorPortal(role)) {
    redirect("/company");
  }
  return children;
}
