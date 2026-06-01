import { BottomNav } from "../components/portal/bottom-nav";
import { MemberSidebar } from "../components/portal/member-sidebar";
import { TimeWrapper } from "../components/portal/time-wrapper";

export default function MemberPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <TimeWrapper>
      <MemberSidebar />
      <div className="md:ml-60">
        <div className="max-w-[430px] mx-auto md:max-w-none">
          {children}
        </div>
      </div>
      <BottomNav />
    </TimeWrapper>
  );
}
