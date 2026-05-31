import { BottomNav } from "../components/portal/bottom-nav";
import { Sidebar } from "../components/portal/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Content: full-width on mobile, offset by sidebar on desktop */}
      <div className="md:ml-60">
        {/* Mobile: constrain to 430px centered. Desktop: full width */}
        <div className="max-w-[430px] mx-auto md:max-w-none">
          {children}
        </div>
      </div>

      {/* Mobile-only bottom nav */}
      <BottomNav />
    </div>
  );
}
