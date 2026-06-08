import { redirect } from "next/navigation";
import { getMissionControlRole } from "@/lib/auth/get-mc-role";
import { canSignInFounderPortal } from "@/lib/auth/mission-control";
import { MissionControlProvider } from "@/app/components/admin/mission-control-provider";
import { StaffRouteGuard } from "@/app/components/admin/staff-route-guard";
import "@/app/styles/admin-dashboard.css";
import "@/app/styles/founder-portal.css";
import "@/app/styles/portal-palette.css";
import "@/app/styles/club-operations.css";

export default async function FounderPortalLayout({ children }: { children: React.ReactNode }) {
  const role = await getMissionControlRole();
  if (!role || !canSignInFounderPortal(role)) {
    redirect("/company");
  }

  return (
    <MissionControlProvider role={role} staffBase="/founder">
      <StaffRouteGuard portal="founder">{children}</StaffRouteGuard>
    </MissionControlProvider>
  );
}
