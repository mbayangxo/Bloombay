import { PartnerSidebar } from "../components/partner/partner-sidebar";

export default function PartnerPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: "#FFF5F8" }}>
      <PartnerSidebar />
      <main className="flex-1 md:ml-64 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
