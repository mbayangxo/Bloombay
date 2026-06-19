import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { ClubSidebar } from "../components/club/club-sidebar";

export default async function ClubPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");

  return (
    <div className="min-h-screen flex" style={{ background: "#FFF5F8" }}>
      <ClubSidebar />
      <main className="flex-1 md:ml-64 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
