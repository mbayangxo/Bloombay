import { AdminSidebar } from "../components/admin/admin-sidebar";

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: "#0D0D0D" }}>
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
