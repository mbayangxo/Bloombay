import { redirect } from "next/navigation";
import { getMissionControlRole } from "@/lib/auth/get-mc-role";
import { canSignInFounderPortal } from "@/lib/auth/mission-control";

export default async function FounderIndexPage() {
  const role = await getMissionControlRole();
  if (role && canSignInFounderPortal(role)) {
    redirect("/founder/dashboard");
  }
  redirect("/company");
}
