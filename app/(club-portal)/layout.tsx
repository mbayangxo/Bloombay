import { ClubSidebar } from "../components/club/club-sidebar";

export default function ClubPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: "#FFF5F8" }}>
      <ClubSidebar />
      <main className="flex-1 md:ml-64 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
