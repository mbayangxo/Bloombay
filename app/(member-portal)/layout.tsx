import { BottomNav } from "../components/portal/bottom-nav";
import { MemberSidebar } from "../components/portal/member-sidebar";

export default function MemberPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--pale-pink-bg)" }}>
      <MemberSidebar />
      <div className="md:ml-60">
        <div className="max-w-[430px] mx-auto md:max-w-none">
          {children}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
