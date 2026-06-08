import { redirect } from "next/navigation";
import { getMissionControlRole } from "@/lib/auth/get-mc-role";
import { canSignInAdminPortal } from "@/lib/auth/mission-control";
import { MissionControlProvider } from "@/app/components/admin/mission-control-provider";
import { StaffRouteGuard } from "@/app/components/admin/staff-route-guard";
import "@/app/styles/admin-dashboard.css";
import "@/app/styles/founder-portal.css";
import "@/app/styles/portal-palette.css";

export default async function AdminOpsLayout({ children }: { children: React.ReactNode }) {
  const role = await getMissionControlRole();
  if (!role || !canSignInAdminPortal(role)) {
    redirect("/company");
  }

  return (
    <MissionControlProvider role={role}>
      <StaffRouteGuard portal="admin">{children}</StaffRouteGuard>
    </MissionControlProvider>
  );
}
