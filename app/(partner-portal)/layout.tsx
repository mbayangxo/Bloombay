import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { PartnerSidebar } from "../components/partner/partner-sidebar";

export default async function PartnerPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");
  if (!["partner", "admin", "founder"].includes(user.role)) redirect("/member/home");

  return (
    <div className="min-h-screen flex" style={{ background: "#FFF5F8" }}>
      <PartnerSidebar />
      <main className="flex-1 md:ml-64 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
