import { CuratorSidebar } from "../components/curator/curator-sidebar";

export default function CuratorPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: "#FFF5F8" }}>
      <CuratorSidebar />
      <main className="flex-1 md:ml-64 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
