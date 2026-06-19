import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { ClubSidebar } from "../components/club/club-sidebar";
import { ClubDesktopRightPanel } from "../components/club/club-desktop-right-panel";

export default async function ClubPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");

  return (
    <div className="min-h-screen flex" style={{ background: "#FFF5F8" }}>
      <ClubSidebar />
      <ClubDesktopRightPanel />
      {/* club desktop sidebar is 168px not 256px */}
      <main className="flex-1 pt-14 md:pt-0 md:ml-16 lg:ml-[168px] xl:mr-[260px] min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
