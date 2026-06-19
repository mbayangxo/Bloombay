import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { AdminSidebar } from "../components/admin/admin-sidebar";

export default async function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");
  if (!["admin", "founder"].includes(user.role)) redirect("/member/home");

  return (
    <div className="min-h-screen flex" style={{ background: "#0D0D0D" }}>
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
