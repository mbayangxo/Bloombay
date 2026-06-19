import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { AdminSidebar } from "../components/admin/admin-sidebar";
import { AdminDesktopRightPanel } from "../components/admin/admin-desktop-right-panel";

export default async function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");
  if (!["admin", "founder"].includes(user.role)) redirect("/member/home");

  return (
    <div className="min-h-screen flex" style={{ background: "#0D0D0D" }}>
      <AdminSidebar />
      <AdminDesktopRightPanel />
      {/* mobile: pt-14 for fixed top bar | tablet: ml-16 | desktop: ml-64 + lg:mr-[260px] for right panel */}
      <main className="flex-1 pt-14 md:pt-0 md:ml-16 lg:ml-64 xl:mr-[260px] min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
