import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { PartnerSidebar } from "../components/partner/partner-sidebar";
import { PartnerDesktopRightPanel } from "../components/partner/partner-desktop-right-panel";

export default async function PartnerPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");
  if (!["partner", "admin", "founder"].includes(user.role)) redirect("/member/home");

  return (
    <div className="min-h-screen flex" style={{ background: "#FFF5F8" }}>
      <PartnerSidebar />
      <PartnerDesktopRightPanel />
      <main className="flex-1 pt-14 md:pt-0 md:ml-16 lg:ml-64 min-h-screen overflow-auto lg:mr-[260px]">
        {children}
      </main>
    </div>
  );
}
