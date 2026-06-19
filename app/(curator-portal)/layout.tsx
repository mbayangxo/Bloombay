import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { CuratorSidebar } from "../components/curator/curator-sidebar";
import { CuratorDesktopRightPanel } from "../components/curator/curator-desktop-right-panel";

export default async function CuratorPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");
  if (!["curator", "admin", "founder"].includes(user.role)) redirect("/member/home");

  return (
    <div className="min-h-screen flex" style={{ background: "#FFF5F8" }}>
      <CuratorSidebar />
      <CuratorDesktopRightPanel />
      <main className="flex-1 pt-14 md:pt-0 md:ml-16 lg:ml-64 lg:mr-[260px] min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
